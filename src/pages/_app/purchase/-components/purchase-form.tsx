import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { PaginatedData } from "@/components/ui/data-table/@types";
import { fetchAllSuppliers } from "@/api/suppliers";
import { fetchProducts, type Product } from "@/api/products";
import type {
  PurchasePaymentRequest,
  PurchaseProductRequest,
} from "@/api/purchases";
import { PlusIcon, Trash2Icon } from "lucide-react";

export type PurchasePaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "PIX";

export type PurchaseProductFormItem = {
  id?: number;
  productId?: number;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type PurchasePaymentFormItem = {
  id?: number;
  paymentMethod: PurchasePaymentMethod;
  total: number;
};

export type PurchaseFormValues = {
  total: number;
  purchaseDate: string;
  estimatedDeliveryDate?: string;
  supplierId?: number;
  nfNumber?: string;
  nfSerie?: string;
  usedNfXmlDocument: boolean;
  internalNotes?: string;
  payments: PurchasePaymentRequest[];
  products: PurchaseProductRequest[];
};

interface PurchaseFormProps {
  initialValues?: PurchaseFormValues;
  onSubmit: (values: PurchaseFormValues) => Promise<void>;
}

const defaultProduct: PurchaseProductFormItem = {
  quantity: 1,
  unitPrice: 0,
  total: 0,
};

const defaultPayment: PurchasePaymentFormItem = {
  paymentMethod: "CASH",
  total: 0,
};

export function PurchaseForm({ initialValues, onSubmit }: PurchaseFormProps) {
  const { setIsSaving } = useCreateView();
  const [total, setTotal] = useState(initialValues?.total ?? 0);
  const [purchaseDate, setPurchaseDate] = useState(initialValues?.purchaseDate ?? "");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(
    initialValues?.estimatedDeliveryDate ?? ""
  );
  const [supplierId, setSupplierId] = useState<string | undefined>(
    initialValues?.supplierId ? String(initialValues.supplierId) : undefined
  );
  const [nfNumber, setNfNumber] = useState(initialValues?.nfNumber ?? "");
  const [nfSerie, setNfSerie] = useState(initialValues?.nfSerie ?? "");
  const [usedNfXmlDocument, setUsedNfXmlDocument] = useState(
    initialValues?.usedNfXmlDocument ?? false
  );
  const [internalNotes, setInternalNotes] = useState(
    initialValues?.internalNotes ?? ""
  );
  const [products, setProducts] = useState<PurchaseProductFormItem[]>(
    initialValues?.products?.map((product) => ({
      ...product,
      total: product.total,
    })) ?? [defaultProduct]
  );
  const [payments, setPayments] = useState<PurchasePaymentFormItem[]>(
    initialValues?.payments?.map((payment) => ({
      ...payment,
    })) ?? [defaultPayment]
  );

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers", "purchase-form"],
    queryFn: () => fetchAllSuppliers(),
  });

  const { data: productData } = useQuery<PaginatedData<Product>>({
    queryKey: ["products", "purchase-form"],
    queryFn: () => fetchProducts({ pageIndex: 0, pageSize: 50 }),
  });

  const productOptions = useMemo(
    () =>
      productData?.result.map((product) => ({
        label: product.name,
        value: String(product.id),
      })) ?? [],
    [productData]
  );

  useEffect(() => {
    if (!initialValues) return;

    setTotal(initialValues.total ?? 0);
    setPurchaseDate(initialValues.purchaseDate ?? "");
    setEstimatedDeliveryDate(initialValues.estimatedDeliveryDate ?? "");
    setSupplierId(initialValues.supplierId ? String(initialValues.supplierId) : undefined);
    setNfNumber(initialValues.nfNumber ?? "");
    setNfSerie(initialValues.nfSerie ?? "");
    setUsedNfXmlDocument(initialValues.usedNfXmlDocument ?? false);
    setInternalNotes(initialValues.internalNotes ?? "");
    setProducts(
      initialValues.products?.length
        ? initialValues.products.map((product) => ({
            ...product,
            total: product.total,
          }))
        : [defaultProduct]
    );
    setPayments(
      initialValues.payments?.length
        ? initialValues.payments.map((payment) => ({ ...payment }))
        : [defaultPayment]
    );
  }, [initialValues]);

  function handleProductChange(
    index: number,
    field: keyof PurchaseProductFormItem,
    value: string | number | undefined
  ) {
    setProducts((current) =>
      current.map((product, productIndex) => {
        if (index !== productIndex) return product;

        const nextProduct = {
          ...product,
          [field]:
            field === "productId"
              ? value === undefined || value === "" || value === "__none"
                ? undefined
                : Number(value)
              : field === "quantity" || field === "unitPrice"
              ? Number(value)
              : value,
        } as PurchaseProductFormItem;

        if (field === "quantity" || field === "unitPrice") {
          const quantity =
            field === "quantity"
              ? Number(value)
              : product.quantity ?? 0;
          const unitPrice =
            field === "unitPrice"
              ? Number(value)
              : product.unitPrice ?? 0;
          nextProduct.total = Number((quantity * unitPrice).toFixed(2));
        }

        return nextProduct;
      })
    );
  }

  function handlePaymentChange(
    index: number,
    field: keyof PurchasePaymentFormItem,
    value: string | number
  ) {
    setPayments((current) =>
      current.map((payment, paymentIndex) => {
        if (index !== paymentIndex) return payment;

        return {
          ...payment,
          [field]:
            field === "total"
              ? Number(value)
              : (value as PurchasePaymentMethod),
        };
      })
    );
  }

  function handleRemoveProduct(index: number) {
    setProducts((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleRemovePayment(index: number) {
    setPayments((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleAddProduct() {
    setProducts((current) => [...current, { ...defaultProduct }]);
  }

  function handleAddPayment() {
    setPayments((current) => [...current, { ...defaultPayment }]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    setIsSaving(true);
    try {
      await onSubmit({
        total,
        purchaseDate,
        estimatedDeliveryDate: estimatedDeliveryDate || undefined,
        supplierId: supplierId ? Number(supplierId) : undefined,
        nfNumber: nfNumber.trim() || undefined,
        nfSerie: nfSerie.trim() || undefined,
        usedNfXmlDocument,
        internalNotes: internalNotes.trim() || undefined,
        payments: payments.map((payment) => ({
          ...(payment.id ? { id: payment.id } : {}),
          paymentMethod: payment.paymentMethod,
          total: payment.total,
        })),
        products: products
          .filter((product) => product.productId !== undefined)
          .map((product) => ({
            ...(product.id ? { id: product.id } : {}),
            productId: product.productId ?? 0,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            total: product.total,
          })),
      });
    } finally {
      setIsSaving(false);
    }
  }

  const supplierOptions = useMemo(
    () =>
      suppliers.map((supplier) => ({
        label: supplier.tradeName,
        value: String(supplier.id),
      })),
    [suppliers]
  );

  return (
    <form id="purchase-form" className="w-full max-w-6xl" onSubmit={handleSubmit}>
      <FieldSet className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="supplier">Fornecedor</FieldLabel>
                <Select
                  value={supplierId}
                  onValueChange={(value) => setSupplierId(value === "__none" ? undefined : value)}
                  disabled={supplierOptions.length === 0}
                >
              <SelectTrigger id="supplier" className="w-full">
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">Sem fornecedor</SelectItem>
                      {supplierOptions.map((supplier) => (
                        <SelectItem key={supplier.value} value={supplier.value}>
                          {supplier.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="purchase-date">Data da compra</FieldLabel>
            <Input
              id="purchase-date"
              type="date"
              value={purchaseDate}
              onChange={(event) => setPurchaseDate(event.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="estimated-delivery-date">
              Data prevista
            </FieldLabel>
            <Input
              id="estimated-delivery-date"
              type="date"
              value={estimatedDeliveryDate}
              onChange={(event) => setEstimatedDeliveryDate(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="total">Total</FieldLabel>
            <Input
              id="total"
              type="number"
              min={0}
              step="0.01"
              value={total}
              onChange={(event) => setTotal(Number(event.target.value))}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="nf-number">NF número</FieldLabel>
            <Input
              id="nf-number"
              type="text"
              value={nfNumber}
              onChange={(event) => setNfNumber(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="nf-serie">NF série</FieldLabel>
            <Input
              id="nf-serie"
              type="text"
              value={nfSerie}
              onChange={(event) => setNfSerie(event.target.value)}
            />
          </Field>
          <Field className="items-center gap-3">
            <FieldLabel>Usou XML da NF?</FieldLabel>
            <Switch
              checked={usedNfXmlDocument}
              onCheckedChange={setUsedNfXmlDocument}
            />
          </Field>
          <Field className="lg:col-span-2">
            <FieldLabel htmlFor="internal-notes">Observações internas</FieldLabel>
            <Textarea
              id="internal-notes"
              value={internalNotes}
              onChange={(event) => setInternalNotes(event.target.value)}
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Produtos</h2>
              <p className="text-sm text-muted-foreground">
                Adicione os produtos do pedido.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={handleAddProduct}>
              <PlusIcon />
              Adicionar produto
            </Button>
          </div>

          <div className="grid gap-3">
            {products.map((product, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
              >
                <Field>
                  <FieldLabel>Produto</FieldLabel>
                  <Select
                    value={product.productId ? String(product.productId) : undefined}
                    onValueChange={(value) =>
                      handleProductChange(
                        index,
                        "productId",
                        value === "__none" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">Sem produto</SelectItem>
                      {productOptions.map((productOption) => (
                        <SelectItem
                          key={productOption.value}
                          value={productOption.value}
                        >
                          {productOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Quantidade</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    value={product.quantity}
                    onChange={(event) =>
                      handleProductChange(index, "quantity", event.target.value)
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Preço unitário</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={product.unitPrice}
                    onChange={(event) =>
                      handleProductChange(index, "unitPrice", event.target.value)
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Total</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={product.total}
                    onChange={(event) =>
                      handleProductChange(index, "total", event.target.value)
                    }
                  />
                </Field>

                <Button
                  type="button"
                  variant="destructive"
                  className="h-10 self-end"
                  onClick={() => handleRemoveProduct(index)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Pagamentos</h2>
              <p className="text-sm text-muted-foreground">
                Adicione as formas de pagamento do pedido.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={handleAddPayment}>
              <PlusIcon />
              Adicionar pagamento
            </Button>
          </div>

          <div className="grid gap-3">
            {payments.map((payment, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[1.5fr_1fr_1fr_auto]"
              >
                <Field>
                  <FieldLabel>Forma</FieldLabel>
                  <Select
                    value={payment.paymentMethod}
                    onValueChange={(value) =>
                      handlePaymentChange(index, "paymentMethod", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Dinheiro</SelectItem>
                      <SelectItem value="CREDIT_CARD">Cartão de crédito</SelectItem>
                      <SelectItem value="DEBIT_CARD">Cartão de débito</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Transferência bancária</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Total</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={payment.total}
                    onChange={(event) =>
                      handlePaymentChange(index, "total", event.target.value)
                    }
                  />
                </Field>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-10"
                    onClick={() => handleRemovePayment(index)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FieldSet>
    </form>
  );
}
