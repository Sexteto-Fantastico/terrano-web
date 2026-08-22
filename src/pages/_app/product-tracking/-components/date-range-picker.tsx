import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
  startDate?: string;
  endDate?: string;
  onChange: (startDate?: string, endDate?: string) => void;
  disabled?: boolean;
};

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  disabled,
}: Props) {
  const from = startDate ? new Date(startDate) : undefined;
  const to = endDate ? new Date(endDate) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="h-10 gap-2 border-border bg-background font-normal shadow-sm justify-start text-left"
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          {from && to ? (
            <span className="text-foreground">
              {format(from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
              {format(to, "dd/MM/yyyy", { locale: ptBR })}
            </span>
          ) : from ? (
            <span className="text-foreground">
              A partir de {format(from, "dd/MM/yyyy", { locale: ptBR })}
            </span>
          ) : (
            <span className="text-muted-foreground">Filtrar por período</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{ from, to }}
          onSelect={(range) => {
            onChange(
              range?.from ? range.from.toISOString() : undefined,
              range?.to ? range.to.toISOString() : undefined
            );
          }}
          locale={ptBR}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}