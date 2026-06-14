import { MovementEntryCategory } from "@/api/movement-entry";
import { cn } from "@/lib/utils";

const categoryConfig: Record<MovementEntryCategory, { label: string; className: string }> = {
  PURCHASE: {
    label: "Compra",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  ADJUSTMENT: {
    label: "Ajuste",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
};

interface MovementEntryCategoryBadgeProps {
  category: MovementEntryCategory;
}

export function MovementEntryCategoryBadge({ category }: MovementEntryCategoryBadgeProps) {
  const config = categoryConfig[category] ?? { label: category, className: "bg-gray-100 text-gray-800" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
