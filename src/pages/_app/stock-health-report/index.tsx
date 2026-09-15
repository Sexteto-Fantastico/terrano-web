import { createFileRoute } from "@tanstack/react-router";
import { requirePermission } from "@/lib/route-guard";
import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { getStockHealthReportTableColumns } from "./-components/stock-health-report-table-columns";
import {
  fetchStockHealthReport,
  fetchStockHealthSummary,
  StockHealthStatus,
  type StockHealthReportFilters,
} from "@/api/stock-health-report";
import { fetchStockLocations } from "@/api/stock-locations";
import { exportTableToCSV } from "@/lib/export";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Search,
  Eraser,
  ShieldAlert,
  PackageX,
  AlertTriangle,
  Percent,
  ShieldCheck,
  SearchX,
} from "lucide-react";
import { ExportButton } from "@/components/button/export-button";

const ALL_LOCATIONS = "all";
const ALL_STATUSES = "all";

export const Route = createFileRoute("/_app/stock-health-report/")({
  component: StockHealthReportPage,
  beforeLoad: requirePermission("STOCK_HEALTH", "read"),
  validateSearch: (search: Record<string, unknown>): StockHealthReportFilters => ({
    pageIndex: search.pageIndex ? Number(search.pageIndex) : undefined,
    pageSize: search.pageSize ? Number(search.pageSize) : undefined,
    sortBy: search.sortBy as any,
    search: search.search as string,
    stockLocationId: search.stockLocationId as string,
    status: search.status as StockHealthReportFilters["status"],
  }),
  head: () => ({
    meta: [
      {
        title: "Controle de ruptura/saúde de estoque",
      },
    ],
  }),
});

function StockHealthReportPage() {
  const { filters, setFilters } = useFilters(Route.id);
  const [prevFilterSearch, setPrevFilterSearch] = useState(filters.search);
  const [searchVal, setSearchVal] = useState(filters.search ?? "");

  if (filters.search !== prevFilterSearch) {
    setPrevFilterSearch(filters.search);
    setSearchVal(filters.search ?? "");
  }

  const { data: stockLocationsData } = useQuery({
    queryKey: ["stock-locations"],
    queryFn: () => fetchStockLocations({}),
  });

  const stockLocations = useMemo(() => stockLocationsData?.result ?? [], [stockLocationsData]);

  const { data, isLoading } = useQuery({
    queryKey: ["stock-health-report", filters],
    queryFn: () => fetchStockHealthReport(filters),
    placeholderData: keepPreviousData,
  });

  const { data: summary } = useQuery({
    queryKey: ["stock-health-summary", filters.stockLocationId],
    queryFn: () => fetchStockHealthSummary(filters.stockLocationId),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchVal || undefined });
  };

  const handleClearFilters = () => {
    setSearchVal("");
    setFilters({ search: undefined, stockLocationId: undefined, status: undefined });
  };

  const hasActiveFilters = !!(filters.search || filters.stockLocationId || filters.status);

  const columns = useMemo(() => getStockHealthReportTableColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    filters: filters as any,
    setFilters: setFilters as any,
  });

  const handleExport = () => {
    exportTableToCSV(table, {
      filename: "relatorio-ruptura-saude-estoque",
      excludeColumns: ["status"],
      columnLabels: {
        code: "Código",
        name: "Produto",
        category: "Categoria",
        stockLocationName: "Local de Estoque",
        quantity: "Quantidade Atual",
        minStock: "Estoque Mínimo",
        shortage: "Quantidade para Repor",
        updatedAt: "Atualizado em",
      },
    });
  };

  const renderEmptyState = () => {
    if (isLoading) return null;

    if (hasActiveFilters) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 mb-6 relative">
            <SearchX className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Nenhum item encontrado</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 whitespace-normal">
            Não encontramos itens em ruptura para os filtros selecionados. Tente ajustar a busca ou limpar os filtros.
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
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#009262]/10 mb-6 relative">
          <ShieldCheck className="h-16 w-16 text-[#009262]" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Estoque saudável</h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto whitespace-normal">
          Nenhum produto está esgotado ou abaixo da quantidade mínima no momento.
        </p>
      </div>
    );
  };

  return (
    <DataView>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-l-4 border-l-[#8B5CF6] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">Itens críticos</span>
            </div>
            <p className="text-sm text-muted-foreground">Total de itens em ruptura de estoque</p>
            <p className="text-4xl font-extrabold text-foreground">{summary?.totalCritical ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#E31B23] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#E31B23]/10 text-[#E31B23]">
                <PackageX className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">Esgotados</span>
            </div>
            <p className="text-sm text-muted-foreground">Itens zerados no estoque</p>
            <p className="text-4xl font-extrabold text-foreground">{summary?.outOfStock ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FF7A00] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FF7A00]/10 text-[#FF7A00]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">Estoque baixo</span>
            </div>
            <p className="text-sm text-muted-foreground">Itens abaixo da quantidade mínima</p>
            <p className="text-4xl font-extrabold text-foreground">{summary?.lowStock ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2F80ED] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2F80ED]/10 text-[#2F80ED]">
                <Percent className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">Catálogo afetado</span>
            </div>
            <p className="text-sm text-muted-foreground">Percentual dos itens rastreados em ruptura</p>
            <p className="text-4xl font-extrabold text-foreground">
              {(summary?.criticalPercentage ?? 0).toFixed(1).replace(".", ",")}%
            </p>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por código ou nome..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="pl-9 h-10 w-full bg-background border-border shadow-sm"
            />
          </div>

          <Select
            value={filters.stockLocationId || ALL_LOCATIONS}
            onValueChange={(val) => setFilters({ stockLocationId: val === ALL_LOCATIONS ? undefined : val })}
          >
            <SelectTrigger className="w-full sm:w-56 h-10 gap-2 font-medium bg-background border-border shadow-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Local de estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_LOCATIONS}>Todos os locais</SelectItem>
              {stockLocations.map((location) => (
                <SelectItem key={location.id} value={String(location.id)}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status || ALL_STATUSES}
            onValueChange={(val) =>
              setFilters({ status: val === ALL_STATUSES ? undefined : (val as StockHealthReportFilters["status"]) })
            }
          >
            <SelectTrigger className="w-full sm:w-48 h-10 gap-2 font-medium bg-background border-border shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>Todos os críticos</SelectItem>
              <SelectItem value={StockHealthStatus.ESGOTADO}>Esgotados</SelectItem>
              <SelectItem value={StockHealthStatus.BAIXO}>Estoque baixo</SelectItem>
            </SelectContent>
          </Select>
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
        actionBar={
          <DataTableToolbar table={table}>
            <ExportButton onClick={handleExport} disabled={!data?.result.length} />
          </DataTableToolbar>
        }
        emptyState={renderEmptyState()}
      />

      <div className="mt-4">
        <DataTablePagination table={table} isLoading={isLoading} />
      </div>
    </DataView>
  );
}
