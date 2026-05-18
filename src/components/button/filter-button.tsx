import { Button, type ButtonProps } from "@/components/ui/button.tsx";
import { SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { cn } from "@/lib/utils.ts";

interface FilterButtonProps extends ButtonProps {
  filters?: string[];
}

export const FilterButton = ({
  filters = [],
  variant = "outline",
  className,
  ...props
}: FilterButtonProps) => {
  const filtersApplied: boolean = filters.length > 0;

  return (
    <Button
      variant={variant}
      className={cn(filtersApplied && "border-primary text-primary", className)}
      {...props}
    >
      <SlidersHorizontal className="size-4" />
      <span>Filtros</span>
      {filtersApplied && filters.length > 0 && (
        <Badge className="h-4 w-4 tabular-nums">{filters.length}</Badge>
      )}
    </Button>
  );
};
