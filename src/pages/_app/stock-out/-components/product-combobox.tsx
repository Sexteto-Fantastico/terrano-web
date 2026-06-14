import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type Product } from "@/api/products";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function ProductCombobox({ value, onValueChange, required, disabled }: ProductComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  type FetchProductsOptions = Parameters<typeof fetchProducts>[0];
  const queryParams: FetchProductsOptions = {
    name: debouncedSearch,
    pageSize: 50,
    activeOnly: "true",
  };

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => fetchProducts(queryParams),
    staleTime: 1000 * 60 * 5,
  });

  const products = useMemo(() => productsData?.result || [], [productsData]);

  const selectedProduct = useMemo<Product | null>(() => {
    if (!value || !products.length) return null;
    return products.find((p) => String(p.id) === value) ?? null;
  }, [value, products]);

  return (
    <>
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("w-full justify-between bg-background font-normal", !value && "text-muted-foreground")}
          >
            {selectedProduct ? selectedProduct.name : "Selecione o produto"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Buscar produto por nome..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Buscando produtos..." : "Nenhum produto encontrado."}
              </CommandEmpty>
              <CommandGroup>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={String(product.id)}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {product.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === String(product.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <input type="hidden" name="productId" value={value} required={required} />
    </>
  );
}
