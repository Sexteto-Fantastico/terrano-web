import type { FormEvent } from "react";
import { useState ,useEffect, useRef} from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2Icon, PlusCircleIcon } from "lucide-react";

import { useCreateView } from "@/components/views/create-view";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { fetchProducts, type Product } from "@/api/products";

export type StockRequisitionFormValues = {
  requesterJustification: string;
  items: {
    productId: number;
    quantity: number;
  }[];
};

interface Props {
  initialJustification?: string;
  initialItems?: {
    productId: number;
    quantity: number;
  }[];
  onSubmit: (values: StockRequisitionFormValues) => Promise<void>;
}

export function StockRequisitionForm({
  initialJustification = "",
  initialItems = [],
  onSubmit,
}: Props) {
  const { setIsSaving } = useCreateView();

  const [justification, setJustification] = useState(initialJustification);
const [items, setItems] = useState(
  initialItems.length > 0
    ? initialItems
    : [{ productId: 0, quantity: 1 }]
);

const didInit = useRef(false);

useEffect(() => {
  if (didInit.current) return;

  setJustification(initialJustification);
  setItems(
    initialItems.length > 0
      ? initialItems
      : [{ productId: 0, quantity: 1 }]
  );

  didInit.current = true;
}, []);

  const { data: products = [] } = useQuery({
    queryKey: ["products-all"],
    queryFn: fetchProducts,
  });

  function addItem() {
    setItems((old) => [...old, { productId: 0, quantity: 1 }]);
  }

  function removeItem(index: number) {
    setItems((old) => old.filter((_, i) => i !== index));
  }

  function updateItem(
    index: number,
    field: "productId" | "quantity",
    value: number
  ) {
    setItems((old) =>
      old.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);

      await onSubmit({
        requesterJustification: justification.trim(),
        items: items.filter((i) => i.productId !== 0),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="stock-requisition-form"
      className="w-full max-w-3xl"
      onSubmit={handleSubmit}
    >
      <FieldSet className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="w-36">Quantidade</TableHead>
              <TableHead className="w-12">Ação</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={item.productId ? String(item.productId) : ""}
                    onValueChange={(val) =>
                      updateItem(index, "productId", Number(val))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>

                    <SelectContent>
                      {products.map((product: Product) => (
                        <SelectItem
                          key={product.id}
                          value={String(product.id)}
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", Number(e.target.value))
                    }
                  />
                </TableCell>

                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={addItem}
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Adicionar outro item
        </Button>

        <Field>
          <FieldLabel>Justificativa</FieldLabel>

          <Textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Adicione uma justificativa"
            rows={4}
            required
          />
        </Field>
      </FieldSet>
    </form>
  );
}