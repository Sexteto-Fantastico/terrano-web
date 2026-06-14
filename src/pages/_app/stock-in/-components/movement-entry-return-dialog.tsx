import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { createMovementExitReturn, type MovementEntry, type MovementEntryItem } from "@/api/movement-entry";

interface ReturnItem {
  item: MovementEntryItem;
  selected: boolean;
  quantity: number;
}

interface MovementEntryReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: MovementEntry;
  onSuccess: () => void;
}

export function MovementEntryReturnDialog({
  open,
  onOpenChange,
  entry,
  onSuccess,
}: MovementEntryReturnDialogProps) {
  const [returnItems, setReturnItems] = useState<ReturnItem[]>(
    () =>
      (entry.items ?? []).map((item) => ({
        item,
        selected: true,
        quantity: item.quantity,
      }))
  );
  const [nfNumber, setNfNumber] = useState("");
  const [nfSerie, setNfSerie] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleToggleItem(index: number, checked: boolean) {
    setReturnItems((prev) =>
      prev.map((ri, i) => (i === index ? { ...ri, selected: checked } : ri))
    );
  }

  function handleQuantityChange(index: number, value: string) {
    const parsed = Number(value);
    setReturnItems((prev) =>
      prev.map((ri, i) =>
        i === index
          ? { ...ri, quantity: isNaN(parsed) ? ri.quantity : Math.min(parsed, ri.item.quantity) }
          : ri
      )
    );
  }

  async function handleConfirm() {
    const selectedItems = returnItems.filter((ri) => ri.selected && ri.quantity > 0);
    if (selectedItems.length === 0) {
      toast.error("Selecione ao menos um item para devolver.");
      return;
    }

    if (!entry.stockLocation) {
      toast.error("Estoque de origem não encontrado na entrada.");
      return;
    }

    setIsSaving(true);
    try {
      await createMovementExitReturn({
        stockLocationId: entry.stockLocation.id,
        category: "RETURN",
        movementEntryId: entry.id,
        nfNumber: nfNumber.trim() || null,
        nfSerie: nfSerie.trim() || null,
        internalNotes: internalNotes.trim() || null,
        items: selectedItems.map((ri) => ({
          productId: ri.item.product?.id ?? 0,
          quantity: ri.quantity,
          unitCost: ri.item.unitCost ?? 0,
        })),
      });
      toast.success("Devolução registrada com sucesso.");
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Erro ao registrar devolução.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova devolução</DialogTitle>
          <DialogDescription>
            Selecione os itens e quantidades a devolver para a Entrada #{entry.id}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          <div className="space-y-2">
            {returnItems.map((ri, index) => (
              <div
                key={ri.item.id}
                className="grid grid-cols-[auto_1fr_80px_80px] items-center gap-3 rounded-lg border border-border p-3"
              >
                <Checkbox
                  checked={ri.selected}
                  onCheckedChange={(checked) => handleToggleItem(index, !!checked)}
                />
                <span className="text-sm font-medium">
                  {ri.item.product?.name ?? `Produto #${ri.item.product?.id}`}
                </span>
                <span className="text-sm text-muted-foreground text-right">
                  Orig.: {ri.item.quantity}
                </span>
                <Input
                  type="number"
                  min={1}
                  max={ri.item.quantity}
                  value={ri.quantity}
                  disabled={!ri.selected}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>NF Número (opcional)</FieldLabel>
              <Input
                value={nfNumber}
                onChange={(e) => setNfNumber(e.target.value)}
                placeholder="Ex: 123456"
              />
            </Field>
            <Field>
              <FieldLabel>NF Série (opcional)</FieldLabel>
              <Input
                value={nfSerie}
                onChange={(e) => setNfSerie(e.target.value)}
                placeholder="Ex: 1"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Anotações internas (opcional)</FieldLabel>
            <Textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isSaving}>
            {isSaving ? "Registrando..." : "Confirmar devolução"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
