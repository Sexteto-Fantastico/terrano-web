import { createFileRoute } from "@tanstack/react-router";
import { requirePermission } from "@/lib/route-guard";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useFilters } from "@/hooks/use-filters";
import { ProductSelect } from "./-components/product-select";
import { DateRangePicker } from "./-components/date-range-picker";
import { getMovementsTableColumns } from "./-components/movements-table-columns";
import {
  fetchProductTracking,
  MOVEMENT_PURPOSE_LABELS,
} from "@/api/product-tracking";
import { useState, useMemo } from "react";
import {
  DollarSign,
  CalendarDays,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Eraser,
  SearchX,
  PackageOpen,
  PackageSearch,
} from "lucide-react";

export type ProductTrackingRouteSearch = {
  productId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: any;
};

export const Route = createFileRoute("/_app/product-tracking/")({
  component: ProductTrackingPage,
  beforeLoad: requirePermission("PRODUCT_TRACE", "read"),
  validateSearch: (search: Record<string, unknown>): ProductTrackingRouteSearch => ({
    productId: search.productId ? Number(search.productId) : undefined,
    startDate: search.startDate as string | undefined,
    endDate: search.endDate as string | undefined,
    search: search.search as string | undefined,
    pageIndex: search.pageIndex ? Number(search.pageIndex) : undefined,
    pageSize: search.pageSize ? Number(search.pageSize) : undefined,
    sortBy: search.sortBy as any,
  }),
  head: () => ({
    meta: [
      {
        title: "Rastreamento de Produto",
      },
    ],
  }),
});

function ProductTrackingPage() {
  const { filters, setFilters } = useFilters(Route.id);
  const [prevFilterSearch, setPrevFilterSearch] = useState(filters.search);
  const [searchVal, setSearchVal] = useState(filters.search ?? "");

  if (filters.search !== prevFilterSearch) {
    setPrevFilterSearch(filters.search);
    setSearchVal(filters.search ?? "");
  }

  const { data, isLoading } = useQuery({
    queryKey: ["product-tracking", filters.productId, filters.startDate, filters.endDate],
    queryFn: () =>
      fetchProductTracking({
        productId: filters.productId!,
        startDate: filters.startDate,
        endDate: filters.endDate,
      }),
    placeholderData: keepPreviousData,
    enabled: !!filters.productId,
  });

  const rawMovements = useMemo(() => data?.movements ?? [], [data?.movements]);

  const filteredMovements = useMemo(() => {
    if (!filters.search) return rawMovements;
    const q = filters.search.toLowerCase().trim();
    return rawMovements.filter((m) => {
      const dateStr = m.date ? new Date(m.date).toLocaleDateString("pt-BR") : "";
      const typeStr = m.type === "IN" ? "entrada" : "saída";
      const purposeStr = (MOVEMENT_PURPOSE_LABELS[m.purpose] ?? m.purpose).toLowerCase();
      return (
        dateStr.includes(q) ||
        typeStr.includes(q) ||
        purposeStr.includes(q) ||
        String(m.quantity).includes(q) ||
        String(m.unitCost).includes(q) ||
        String(m.total).includes(q)
      );
    });
  }, [rawMovements, filters.search]);

  const pageIndex = filters.pageIndex ?? 0;
  const pageSize = filters.pageSize ?? 10;

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const result = filteredMovements.slice(start, start + pageSize);
    return {
      result,
      rowCount: filteredMovements.length,
    };
  }, [filteredMovements, pageIndex, pageSize]);

  const totalIn = useMemo(
    () =>
      rawMovements
        .filter((m) => m.type === "IN")
        .reduce((sum, m) => sum + (m.quantity || 0), 0),
    [rawMovements]
  );

  const totalOut = useMemo(
    () =>
      rawMovements
        .filter((m) => m.type === "OUT")
        .reduce((sum, m) => sum + (m.quantity || 0), 0),
    [rawMovements]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchVal || undefined, pageIndex: 0 });
  };

  const handleClearFilters = () => {
    setSearchVal("");
    setFilters({ search: undefined, startDate: undefined, endDate: undefined, pageIndex: 0 });
  };

  const columns = useMemo(() => getMovementsTableColumns(), []);

  const { table } = useDataTable({
    data: paginatedData,
    columns,
    filters: filters as any,
    setFilters: setFilters as any,
  });

  const renderEmptyState = () => {
    if (isLoading) return null;

    if (!filters.productId) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 mb-6 relative">
            <PackageSearch className="h-16 w-16 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Nenhum produto selecionado</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6 whitespace-normal text-center">
            Selecione um produto no menu superior para visualizar o histórico de rastreamento e movimentações.
          </p>
        </div>
      );
    }

    if (filters.search || filters.startDate || filters.endDate) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 mb-6 relative">
            <SearchX className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Nenhuma movimentação encontrada</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 whitespace-normal text-center">
            Não encontramos nenhum registro para os filtros aplicados. Tente ajustar o período ou o termo de busca.
          </p>
          <Button variant="outline" onClick={handleClearFilters} className="p-6 gap-2 border-border shadow-sm">
            <Eraser className="h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 mb-6 relative">
          <PackageOpen className="h-16 w-16 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Sem movimentações</h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6 whitespace-normal text-center">
          Este produto ainda não possui movimentações registradas de entrada ou saída no estoque.
        </p>
      </div>
    );
  };

  return (
    <DataView
      headerActions={
        <ProductSelect
          value={filters.productId}
          onChange={(val) => setFilters({ productId: val, pageIndex: 0 })}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-l-4 border-l-[#009262] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#009262]/10 text-[#009262]">
                <DollarSign className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">
                Custo Médio Histórico
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Custo médio ponderado geral do produto</p>
            <p className="text-4xl font-extrabold text-foreground">
              {data?.averageCost != null
                ? data.averageCost.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : "R$ 0,00"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2F80ED] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2F80ED]/10 text-[#2F80ED]">
                <CalendarDays className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">
                Custo Médio Período
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Custo médio das entradas no período</p>
            <p className="text-4xl font-extrabold text-foreground">
              {data?.periodAverageCost != null
                ? data.periodAverageCost.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : "R$ 0,00"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#009262] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#009262]/10 text-[#009262]">
                <ArrowDownLeft className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">
                Total de Entradas
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Quantidade de itens recebidos no período</p>
            <p className="text-4xl font-extrabold text-foreground">{totalIn.toLocaleString("pt-BR")}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FF7A00] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FF7A00]/10 text-[#FF7A00]">
                <ArrowUpRight className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">
                Total de Saídas
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Quantidade de itens expedidos no período</p>
            <p className="text-4xl font-extrabold text-foreground">{totalOut.toLocaleString("pt-BR")}</p>
          </CardContent>
        </Card>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:max-w-2xl">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar movimentação..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="pl-9 h-10 w-full bg-background border-border shadow-sm"
            />
          </div>

          <DateRangePicker
            startDate={filters.startDate}
            endDate={filters.endDate}
            onChange={(start, end) =>
              setFilters({ startDate: start, endDate: end, pageIndex: 0 })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleClearFilters}
            className="h-10 gap-2 border-border shadow-sm"
          >
            <Eraser className="h-4 w-4" />
            <span>Limpar filtros</span>
          </Button>
        </div>
      </form>

      <DataTable
        table={table}
        isLoading={isLoading}
        actionBar={<DataTableToolbar table={table} />}
        emptyState={renderEmptyState()}
      />

      <div className="mt-4">
        <DataTablePagination table={table} isLoading={isLoading} />
      </div>
    </DataView>
  );
}