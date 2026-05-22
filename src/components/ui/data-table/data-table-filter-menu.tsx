import { Button } from "@/components/ui/button";
import { DataTableFilterInput } from "@/components/ui/data-table/data-table-filter-input";
import { cn } from "@/lib/utils";
import type { DataTableFilterVariant } from "@/components/ui/data-table/@types";
import { useForm } from "@tanstack/react-form";
import type { Table } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";

type ColumnFilter = {
  id: string;
  label: string;
  placeholder: string | undefined;
  variant: DataTableFilterVariant;
  options: { label: string; value: string }[] | undefined;
  defaultValue: string | undefined;
  className: string | undefined;
};

type DataTableFilterMenuProps<
  TData,
  TFilters extends Record<string, unknown>,
> = {
  table: Table<TData>;
  filters: TFilters;
  onFilter: (partialFilters: Partial<TFilters>) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
  className?: string;
};

export function DataTableFilterMenu<
  TData,
  TFilters extends Record<string, unknown>,
>({
  table,
  filters,
  onFilter,
  onClearFilters,
  isLoading = false,
  className,
}: DataTableFilterMenuProps<TData, TFilters>) {
  const filterableColumns: ColumnFilter[] = table
    .getAllLeafColumns()
    .map((column) => {
      const meta = column.columnDef.meta;
      const filter = meta?.filter;
      if (!filter || filter.hidden) return undefined;

      const variant = filter.variant;

      const label = filter.label ?? column.id;
      const options =
        variant === "boolean"
          ? [
            { label: "Sim", value: "true" },
            { label: "Não", value: "false" },
          ]
          : filter.options;

      return {
        id: column.id,
        label,
        placeholder: filter.placeholder,
        variant,
        options,
        defaultValue: filter.defaultValue,
        className: filter.props?.className,
      } satisfies ColumnFilter;
    })
    .filter((value): value is ColumnFilter => value !== undefined);

  const initialValues = useMemo(
    () =>
      filterableColumns.reduce<Record<string, string>>((acc, column) => {
        const rawValue = filters[column.id as keyof TFilters];
        acc[column.id] =
          rawValue === undefined || rawValue === null
            ? (column.defaultValue ?? "")
            : String(rawValue);
        return acc;
      }, {}),
    [filterableColumns, filters]
  );

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      const nextFilters = filterableColumns.reduce<Partial<TFilters>>(
        (acc, column) => {
          const draftValue = value[column.id] ?? "";

          if (column.variant === "checkbox") {
            acc[column.id as keyof TFilters] =
              (draftValue || "false") as TFilters[keyof TFilters];
            return acc;
          }

          if (!draftValue.trim()) {
            acc[column.id as keyof TFilters] =
              undefined as TFilters[keyof TFilters];
            return acc;
          }

          if (column.variant === "number") {
            const parsed = Number(draftValue);
            acc[column.id as keyof TFilters] = (
              Number.isNaN(parsed) ? undefined : parsed
            ) as TFilters[keyof TFilters];
            return acc;
          }

          if (column.variant === "boolean") {
            acc[column.id as keyof TFilters] = (draftValue ===
              "true") as TFilters[keyof TFilters];
            return acc;
          }

          acc[column.id as keyof TFilters] =
            draftValue as TFilters[keyof TFilters];
          return acc;
        },
        {}
      );

      onFilter(nextFilters);
    },
  });

  useEffect(() => {
    const nextDraft = filterableColumns.reduce<Record<string, string>>(
      (acc, column) => {
        const rawValue = filters[column.id as keyof TFilters];
        acc[column.id] =
          rawValue === undefined || rawValue === null
            ? (column.defaultValue ?? "")
            : String(rawValue);
        return acc;
      },
      {}
    );

    form.reset(nextDraft);
  }, [filterableColumns, filters]);

  if (filterableColumns.length === 0) return null;

  return (
    <form
      className={cn(
        "grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto]",
        className
      )}
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      aria-label="Filtros da tabela"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filterableColumns.map((column) => {
          return (
            <div
              key={column.id}
              className={cn("flex min-w-0 flex-col gap-1", column.className)}
            >
              {column.variant !== "checkbox" && (
                <label className="text-sm font-medium text-foreground">
                  {column.label}
                </label>
              )}
              <form.Field
                name={column.id}
                children={(field) => (
                  <DataTableFilterInput
                    field={field}
                    variant={column.variant}
                    label={column.label}
                    placeholder={column.placeholder}
                    options={column.options?.map((opt) => ({
                      ...opt,
                      value: opt.value,
                    }))}
                    disabled={isLoading}
                    className="min-w-0"
                  />
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 md:items-stretch">
        <Button type="submit" disabled={isLoading} className="w-full">
          Filtrar
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            form.reset(
              filterableColumns.reduce<Record<string, string>>(
                (acc, column) => {
                  acc[column.id] = column.defaultValue ?? "";
                  return acc;
                },
                {}
              )
            );
            onClearFilters();
          }}
          disabled={isLoading}
        >
          Limpar filtros
        </Button>
      </div>
    </form>
  );
}
