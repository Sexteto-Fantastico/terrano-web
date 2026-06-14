import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProducts } from "@/api/products"; 

type Props = {
  value: number | undefined;
  onChange: (productId: number) => void;
};

export function ProductSelect({ value, onChange }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["products-for-tracking"],
    queryFn: () => fetchProducts({}), 
  });

  return (
    <Select
      value={value?.toString() ?? ""}
      onValueChange={(v) => onChange(Number(v))}
      disabled={isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione um produto" />
      </SelectTrigger>
      <SelectContent>
        {data?.result?.map((product) => (
          <SelectItem key={product.id} value={product.id.toString()}>
            {product.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}