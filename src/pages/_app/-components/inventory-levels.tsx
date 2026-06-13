import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format-number";
import {
  fetchStockPositionings,
  StockPositioningStatus,
} from "@/api/stock-positioning";
import { MetricSkeleton } from "./metric-card";

const PAGE_SIZE = 5;

function getProgressColor(percentage: number): string {
  if (percentage < 25) return "bg-destructive";
  if (percentage < 50) return "bg-orange-500";
  return "bg-primary";
}

export function InventoryLevels() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["stock-positionings", "low-stock", page],
    queryFn: () =>
      fetchStockPositionings({
        status: StockPositioningStatus.BAIXO,
        pageIndex: page - 1,
        pageSize: PAGE_SIZE,
      }),
  });

  const currentMonth = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(new Date());

  const items =
    data?.result.map((p) => ({
      name: p.product.name,
      current: p.quantity,
      max: p.product.maxStock ?? Math.max(p.quantity * 2, 100),
    })) ?? [];

  const rowCount = data?.rowCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(rowCount / PAGE_SIZE));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Estoque Baixo</CardTitle>
            <CardDescription>Resumo do mês de {currentMonth}</CardDescription>
          </div>
          <Button
            variant="link"
            size="sm"
            asChild
            className="h-auto p-0 text-xs"
          >
            <Link to="/stock-positioning">
              Ver mais
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <MetricSkeleton />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
              <PackageOpen
                className="h-8 w-8 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhum item com estoque baixo.
            </p>
          </div>
        ) : (
          <>
            {items.map((item) => {
              const percentage = Math.round((item.current / item.max) * 100);
              return (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(item.current)} / {formatNumber(item.max)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        getProgressColor(percentage)
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-muted-foreground">
                  Página {page} de {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
