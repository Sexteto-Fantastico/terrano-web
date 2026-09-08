import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProducts } from "@/api/products";
import { Package } from "lucide-react";

type Props = {
  value: number | undefined;
  onChange: (productId: number) => void;
  disabled?: boolean;
};

export function ProductSelect({ value, onChange, disabled }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["products-for-tracking"],
    queryFn: () => fetchProducts({ pageSize: 100, activeOnly: "true" }),
  });

  const products = data?.result ?? [];

  return (
    <Select
      value={value ? String(value) : ""}
      onValueChange={(v) => onChange(Number(v))}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-72 sm:w-80 h-10 gap-2 font-medium bg-background border-border shadow-sm">
        <Package className="h-4 w-4 text-muted-foreground shrink-0" />
        <SelectValue placeholder={isLoading ? "Carregando produtos..." : "Selecione o produto"} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {products.map((product) => (
          <SelectItem key={product.id} value={String(product.id)}>
            {product.code ? `${product.code} - ${product.name}` : product.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}