import type { ColumnDef } from "@tanstack/react-table";
import { type StockPositioning, StockPositioningStatus } from "@/api/stock-positioning";
import { createHeaderColumn } from "@/components/ui/data-table/data-table-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type StockPositioningTableActionHandlers = {
  onViewHistory: (item: StockPositioning) => void;
};

export function getStockPositioningTableColumns({
  onViewHistory,
}: StockPositioningTableActionHandlers) {
  return [
    {
      accessorKey: "product.code",
      header: createHeaderColumn("CÓDIGO DO PRODUTO"),
    },
    {
      accessorKey: "product.name",
      header: createHeaderColumn("NOME"),
    },
    {
      accessorKey: "product.measurementUnit.symbol",
      header: createHeaderColumn("UN. MEDIDA"),
      cell: ({ row }) => {
        const unit = row.original.product?.measurementUnit;
        return unit?.symbol ?? unit?.name ?? "-";
      },
    },
    {
      accessorKey: "quantity",
      header: createHeaderColumn("QUANTIDADE"),
    },
    {
      accessorKey: "status",
      header: createHeaderColumn("STATUS"),
      cell: ({ row }) => {
        const status = row.original.status;
        let bgClass = "";
        let label = "";

        switch (status) {
          case StockPositioningStatus.ESGOTADO:
            bgClass = "bg-[#E31B23] text-white hover:bg-[#E31B23]/90 border-transparent";
            label = "Esgotado";
            break;
          case StockPositioningStatus.BAIXO:
            bgClass = "bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 border-transparent";
            label = "Baixo";
            break;
          case StockPositioningStatus.ADEQUADO:
            bgClass = "bg-[#009262] text-white hover:bg-[#009262]/90 border-transparent";
            label = "Adequado";
            break;
          case StockPositioningStatus.EXCESSO:
            bgClass = "bg-[#2F80ED] text-white hover:bg-[#2F80ED]/90 border-transparent";
            label = "Excesso";
            break;
          default:
            bgClass = "bg-muted text-muted-foreground border-transparent";
            label = status;
        }

        return (
          <Badge className={`px-3 py-3.5 font-semibold text-xs rounded-md ${bgClass}`}>
            {label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "AÇÕES",
      size: 60,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={() => onViewHistory(item)}
                >
                  <History className="size-5" />
                  <span className="sr-only">Ver rastreamento do produto</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Ver rastreamento do produto</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
  ] as ColumnDef<StockPositioning>[];
}
