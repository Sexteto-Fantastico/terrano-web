import * as React from "react";
import { type AnyFieldApi } from "@tanstack/react-form";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  DataTableFilterOption,
  DataTableFilterVariant,
} from "@/components/ui/data-table/@types";
import { cn } from "@/lib/utils";
import { CalendarIcon, XIcon } from "lucide-react";

type RangeValue = {
  min?: number;
  max?: number;
};

type DateRangeValue = {
  from?: Date;
  to?: Date;
};

type MultiSelectValue = string[];

function parseRangeValue(value: string | undefined): RangeValue {
  if (!value) return {};
  try {
    return JSON.parse(value) as RangeValue;
  } catch {
    return {};
  }
}

function serializeRangeValue(range: RangeValue): string {
  return JSON.stringify(range);
}

function parseDateRangeValue(value: string | undefined): DateRangeValue {
  if (!value) return {};
  try {
    return JSON.parse(value) as DateRangeValue;
  } catch {
    return {};
  }
}

function serializeDateRangeValue(range: DateRangeValue): string {
  return JSON.stringify(range);
}

function parseMultiSelectValue(value: string | undefined): MultiSelectValue {
  if (!value) return [];
  try {
    return JSON.parse(value) as MultiSelectValue;
  } catch {
    return [];
  }
}

function serializeMultiSelectValue(values: MultiSelectValue): string {
  return JSON.stringify(values);
}

function formatDateRange(range: DateRangeValue): string {
  if (!range.from && !range.to) return "";
  if (range.from && !range.to)
    return format(range.from, "PP", { locale: ptBR });
  if (!range.from && range.to) return format(range.to, "PP", { locale: ptBR });
  return `${format(range.from!, "PP", { locale: ptBR })} - ${format(range.to!, "PP", { locale: ptBR })}`;
}

type DataTableFilterInputProps = {
  field: AnyFieldApi;
  variant: DataTableFilterVariant;
  label: string;
  placeholder?: string;
  options?: DataTableFilterOption[];
  disabled?: boolean;
  className?: string;
  inputProps?: React.ComponentProps<"input">;
};
export function DataTableFilterInput({
  field,
  variant,
  label,
  placeholder,
  options = [],
  disabled = false,
  className,
  inputProps,
}: DataTableFilterInputProps) {
  switch (variant) {
    case "text":
      return (
        <Input
          type="text"
          value={(field.state.value as string) ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder ?? `Filtrar por ${label.toLowerCase()}`}
          disabled={disabled}
          className={cn("w-full", className)}
          {...inputProps}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          value={(field.state.value as string) ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder ?? `Filtrar por ${label.toLowerCase()}`}
          disabled={disabled}
          className={cn("w-full", className)}
          {...inputProps}
        />
      );

    case "range": {
      const range = parseRangeValue(field.state.value as string | undefined);
      return (
        <div className={cn("flex items-center gap-2", className)}>
          <Input
            type="number"
            value={range.min ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              const newRange: RangeValue = {
                ...range,
                min: value ? Number(value) : undefined,
              };
              field.handleChange(serializeRangeValue(newRange));
            }}
            placeholder="Min"
            disabled={disabled}
            className={cn("w-full", "min-w-0 flex-1")}
            {...inputProps}
          />
          <span className="text-sm text-muted-foreground">-</span>
          <Input
            type="number"
            value={range.max ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              const newRange: RangeValue = {
                ...range,
                max: value ? Number(value) : undefined,
              };
              field.handleChange(serializeRangeValue(newRange));
            }}
            placeholder="Max"
            disabled={disabled}
            className={cn("w-full", "min-w-0 flex-1")}
            {...inputProps}
          />
          {(range.min !== undefined || range.max !== undefined) && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => field.handleChange("")}
              disabled={disabled}
              aria-label={`Limpar filtro de ${label}`}
            >
              <XIcon className="size-3" aria-hidden="true" />
            </Button>
          )}
        </div>
      );
    }

    case "date": {
      const dateStr = field.state.value as string | undefined;
      const selectedDate = dateStr ? parseISO(dateStr) : undefined;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between font-normal",
                !selectedDate && "text-muted-foreground",
                className
              )}
              disabled={disabled}
            >
              {selectedDate
                ? format(selectedDate, "PP", { locale: ptBR })
                : (placeholder ?? `Selecione ${label.toLowerCase()}`)}
              <CalendarIcon
                className="ml-2 size-4 shrink-0"
                aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                field.handleChange(date ? format(date, "yyyy-MM-dd") : "");
              }}
              disabled={disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    }

    case "dateRange": {
      const range = parseDateRangeValue(
        field.state.value as string | undefined
      );
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full",
                "w-full justify-between font-normal",
                !range.from && "text-muted-foreground",
                className
              )}
              disabled={disabled}
            >
              {formatDateRange(range) ||
                (placeholder ?? `Selecione período de ${label.toLowerCase()}`)}
              <CalendarIcon
                className="ml-2 size-4 shrink-0"
                aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: range.from, to: range.to }}
              onSelect={(dateRange) => {
                field.handleChange(
                  dateRange
                    ? serializeDateRangeValue({
                        from: dateRange.from,
                        to: dateRange.to,
                      })
                    : ""
                );
              }}
              disabled={disabled}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    }

    case "boolean": {
      const boolOptions = [
        { label: "Sim", value: "true" },
        { label: "Não", value: "false" },
      ];
      const currentValue = field.state.value as string | undefined;
      return (
        <Select
          value={currentValue ?? ""}
          onValueChange={(value) => field.handleChange(value)}
          disabled={disabled}
        >
          <SelectTrigger className={cn("w-full", "min-w-0 flex-1", className)}>
            <SelectValue
              placeholder={placeholder ?? `Selecione ${label.toLowerCase()}`}
            />
          </SelectTrigger>
          <SelectContent>
            {boolOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case "select": {
      const currentValue = field.state.value as string | undefined;
      return (
        <Select
          value={currentValue ?? ""}
          onValueChange={(value) => field.handleChange(value)}
          disabled={disabled}
        >
          <SelectTrigger className={cn("w-full", className)}>
            <SelectValue
              placeholder={placeholder ?? `Selecione ${label.toLowerCase()}`}
            />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case "multiSelect": {
      const selectedValues = parseMultiSelectValue(
        field.state.value as string | undefined
      );
      return (
        <MultiSelect
          options={options.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))}
          onValueChange={(values: string[]) =>
            field.handleChange(serializeMultiSelectValue(values))
          }
          defaultValue={selectedValues}
          placeholder={placeholder ?? `Selecione ${label.toLowerCase()}`}
          disabled={disabled}
          className={cn("w-full", className)}
          hideSelectAll
          searchable={false}
          maxCount={3}
        />
      );
    }

    default:
      return null;
  }
}
