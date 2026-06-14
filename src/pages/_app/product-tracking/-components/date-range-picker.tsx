import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
  startDate?: string;
  endDate?: string;
  onChange: (startDate?: string, endDate?: string) => void;
};

export function DateRangePicker({ startDate, endDate, onChange }: Props) {
  const from = startDate ? new Date(startDate) : undefined;
  const to = endDate ? new Date(endDate) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal">
          {from && to
            ? `${format(from, "dd/MM/yyyy", { locale: ptBR })} - ${format(
                to,
                "dd/MM/yyyy",
                { locale: ptBR }
              )}`
            : "Selecionar período"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={{ from, to }}
          onSelect={(range) => {
            onChange(
              range?.from?.toISOString(),
              range?.to?.toISOString()
            );
          }}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}