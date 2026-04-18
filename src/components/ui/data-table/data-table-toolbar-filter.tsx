import type { Column } from "@tanstack/react-table";
import { useCallback } from "react";
import { Input } from "../input";
import { DataTableDateFilter } from "./data-table-date-picker";
import { cn } from "@/lib/utils";
import { Label } from "../label";

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
  value: string | string[] | number[] | null;
  onChange: (value: string | string[] | number[] | null) => void;
  onSubmit?: () => void;
}

export function DataTableToolbarFilter<TData>({
  column,
  value,
  onChange,
  onSubmit,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const getTitle = useCallback(() => {
    return columnMeta?.label ?? columnMeta?.placeholder ?? column.id;
  }, [columnMeta, column]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onSubmit) {
      onSubmit();
    }
  };

  const handleDateChange = (newValue: number[] | null) => {
    onChange(newValue);
  };

  const onFilterRender = useCallback(() => {
    if (!columnMeta?.variant) {
      return null;
    }

    switch (columnMeta.variant) {
      case "text":
        return (
          <Input
            className="h-8 w-[150px]"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={(value as string) ?? ""}
          />
        );

      case "number":
        return (
          <div className="relative">
            <Input
              className={cn("h-8 w-[120px]", columnMeta.unit && "pr-8")}
              inputMode="numeric"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={getTitle()}
              type="number"
              value={(value as string) ?? ""}
            />
            {columnMeta.unit && (
              <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-sm text-muted-foreground">
                {columnMeta.unit}
              </span>
            )}
          </div>
        );

      case "range":
      // return <DataTableSliderFilter column={column} title={getTitle()} />;

      case "date":
      case "dateRange":
        return (
          <DataTableDateFilter
            column={column}
            multiple={columnMeta.variant === "dateRange"}
            title={getTitle()}
            value={value as number[] | null}
            onChange={handleDateChange}
          />
        );

      case "select":
      case "multiSelect":
      // return (
      //   <DataTableFacetedFilter
      //     column={column}
      //     multiple={columnMeta.variant === "multiSelect"}
      //     options={columnMeta.options ?? []}
      //     title={getTitle()}
      //   />
      // );

      default:
        return null;
    }
  }, [column, columnMeta, value, handleChange, getTitle]);

  const filterContent = onFilterRender();

  if (!filterContent) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{getTitle()}</Label>
      {filterContent}
    </div>
  );
}