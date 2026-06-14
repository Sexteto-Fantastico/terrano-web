import { type FormEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { MovementEntryCategory, type CreateMovementEntryRequest } from "@/api/movement-entry";
import { fetchStockLocations, type StockLocation } from "@/api/stock-locations";
import { fetchPurchases, getPurchaseById, type Purchase } from "@/api/purchases";
import { MOVEMENT_ENTRY_CATEGORY_LABELS } from "./movement-entry-filter-config";
import { ProductCombobox } from "../../stock-out/-components/product-combobox";

export type MovementEntryFormValues = CreateMovementEntryRequest;

interface MovementEntryFormProps {
  onSubmit: (values: MovementEntryFormValues) => Promise<void>;
}

type FormItem = {
  id: string;
  productId: string;
  quantity: string;
  unitCost: string;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function MovementEntryForm({ onSubmit }: MovementEntryFormProps) {
  const { setIsSaving } = useCreateView();

  const [category, setCategory] = useState<MovementEntryCategory | "">("");
  const [stockLocationId, setStockLocationId] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>(todayIso());
  const [purchaseId, setPurchaseId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [nfNumber, setNfNumber] = useState<string>("");
  const [nfSerie, setNfSerie] = useState<string>("");
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [items, setItems] = useState<FormItem[]>([
    { id: "1", productId: "", quantity: "1", unitCost: "0" },
  ]);

  const isPurchase = category === MovementEntryCategory.PURCHASE;

  const { data: stockLocationsData } = useQuery({
    queryKey: ["stock-locations"],
    queryFn: () => fetchStockLocations({}),
  });

  const { data: purchasesData } = useQuery({
    queryKey: ["purchases", { activeOnly: "true", pageSize: 100 }],
    queryFn: () => fetchPurchases({ activeOnly: "true", pageSize: 100 } as any),
    enabled: isPurchase,
  });

  const stockLocations = stockLocationsData?.result ?? [];
  const purchases = purchasesData?.result ?? [];

  useEffect(() => {
    if (!isPurchase) {
      setPurchaseId("");
      setSupplierId("");
      setNfNumber("");
      setNfSerie("");
      setItems([{ id: "1", productId: "", quantity: "1", unitCost: "0" }]);
    }
  }, [isPurchase]);

  async function handlePurchaseSelect(pid: string) {
    setPurchaseId(pid);
    if (!pid) {
      setSupplierId("");
      setNfNumber("");
      setNfSerie("");
      setItems([{ id: "1", productId: "", quantity: "1", unitCost: "0" }]);
      return;
    }

    try {
      const purchase = await getPurchaseById(Number(pid));
      setSupplierId(purchase.supplier ? String(purchase.supplier.id) : "");
      setNfNumber(purchase.nfNumber ?? "");
      setNfSerie(purchase.nfSerie ?? "");

      if (purchase.products && purchase.products.length > 0) {
        setItems(
          purchase.products.map((p, i) => ({
            id: String(i + 1),
            productId: String(p.productId),
            quantity: String(Math.round(p.quantity)),
            unitCost: String(p.unitPrice ?? 0),
          }))
        );
      } else {
        setItems([{ id: "1", productId: "", quantity: "1", unitCost: "0" }]);
      }
    } catch {
      return;
    }
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), productId: "", quantity: "1", unitCost: "0" },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof FormItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  const totalValue = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitCost) || 0),
    0
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    setIsSaving(true);
    try {
      await onSubmit({
        stockLocationId: Number(stockLocationId) || 0,
        category: category as MovementEntryCategory,
        entryDate: entryDate || undefined,
        purchaseId: isPurchase && purchaseId ? Number(purchaseId) : null,
        internalNotes: internalNotes.trim() || null,
        items: items.map((item) => ({
          productId: Number(item.productId) || 0,
          quantity: Number(item.quantity) || 0,
          unitCost: Number(item.unitCost) || 0,
        })),
      });
    } finally {
      setIsSaving(false);
    }
  }

  const displayedStockLocationId =
    stockLocationId || (stockLocations.length > 0 ? String(stockLocations[0].id) : "");

  return (
    <form id="stock-in-form" className="w-full max-w-4xl" onSubmit={handleSubmit} noValidate>
      <FieldSet className="space-y-6">
        {/* Seção 1: Tipo de entrada */}
        <div className="space-y-4 rounded-lg border border-border p-4">
          <h2 className="text-base font-semibold">Tipo de entrada</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="category">Categoria</FieldLabel>
              <Select value={category} onValueChange={(v) => setCategory(v as MovementEntryCategory)} required>
                <SelectTrigger id="category" className="bg-background w-full">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MovementEntryCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {MOVEMENT_ENTRY_CATEGORY_LABELS[cat] ?? cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {isPurchase && (
              <Field>
                <FieldLabel htmlFor="purchaseId">Compra</FieldLabel>
                <Select value={purchaseId} onValueChange={handlePurchaseSelect} required>
                  <SelectTrigger id="purchaseId" className="bg-background w-full">
                    <SelectValue placeholder="Selecione a compra" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchases.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        #{p.id} — {p.nfNumber ? `NF ${p.nfNumber}` : "Sem NF"}{" "}
                        {p.supplier?.tradeName ? `(${p.supplier.tradeName})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </div>
        </div>

        {/* Seção 2: Dados gerais */}
        <div className="space-y-4 rounded-lg border border-border p-4">
          <h2 className="text-base font-semibold">Dados gerais</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="entryDate">Data de entrega</FieldLabel>
              <Input
                id="entryDate"
                type="date"
                value={entryDate}
                max={todayIso()}
                onChange={(e) => setEntryDate(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="stockLocationId">Estoque de destino</FieldLabel>
              <Select value={displayedStockLocationId} onValueChange={setStockLocationId} required>
                <SelectTrigger id="stockLocationId" className="bg-background w-full">
                  <SelectValue placeholder="Selecione o estoque" />
                </SelectTrigger>
                <SelectContent>
                  {stockLocations.map((loc) => (
                    <SelectItem key={loc.id} value={String(loc.id)}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {isPurchase && (
              <>
                <Field>
                  <FieldLabel htmlFor="supplierDisplay">Fornecedor</FieldLabel>
                  <Input
                    id="supplierDisplay"
                    value={
                      purchases.find((p) => String(p.id) === purchaseId)?.supplier?.tradeName ?? ""
                    }
                    disabled
                    placeholder="Preenchido pela compra"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="nfNumber">Número da NF</FieldLabel>
                  <Input
                    id="nfNumber"
                    value={nfNumber}
                    disabled
                    placeholder="Preenchido pela compra"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="nfSerie">Série da NF</FieldLabel>
                  <Input
                    id="nfSerie"
                    value={nfSerie}
                    disabled
                    placeholder="Preenchido pela compra"
                  />
                </Field>
              </>
            )}

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="internalNotes">Anotações internas (opcional)</FieldLabel>
              <Textarea
                id="internalNotes"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </Field>
          </div>
        </div>

        {/* Seção 3: Itens */}
        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Itens da entrada</h2>
            {!isPurchase && (
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar item
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitCost) || 0);
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_100px_120px_100px_auto] gap-3 items-end rounded-lg border border-border p-3"
                >
                  <Field>
                    <FieldLabel>Produto</FieldLabel>
                    <ProductCombobox
                      value={item.productId}
                      onValueChange={(val) => updateItem(index, "productId", val)}
                      required
                      disabled={isPurchase}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Qtd.</FieldLabel>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      required
                      disabled={isPurchase}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Custo unit.</FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitCost}
                      onChange={(e) => updateItem(index, "unitCost", e.target.value)}
                      required
                      disabled={isPurchase}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Total</FieldLabel>
                    <Input
                      type="text"
                      value={itemTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      readOnly
                      className="bg-muted"
                    />
                  </Field>
                  {!isPurchase ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="w-10" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end border-t pt-3">
            <span className="text-sm font-medium text-muted-foreground">
              Valor total da entrada:{" "}
              <span className="text-foreground font-semibold">
                {totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </span>
          </div>
        </div>
      </FieldSet>
    </form>
  );
}
