import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { useFilters } from "@/hooks/use-filters";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { getStockPositioningTableColumns } from "./-components/stock-positioning-table-columns";
import {
  fetchStockPositionings,
  fetchStockPositioningMetrics,
  generateStockReport,
  type StockPositioningFilters,
  type StockPositioning,
} from "@/api/stock-positioning";
import { fetchAllStockLocations } from "@/api/stock-locations";
import { useMemo, useState, useEffect } from "react";
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
  FileText,
  Package,
  AlertTriangle,
  Boxes,
  PackageX,
  PackageOpen,
  SearchX,
} from "lucide-react";
import { toast } from "sonner";
import { keepPreviousData } from "@tanstack/react-query";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";

export const Route = createFileRoute("/_app/stock-positioning/")({
  component: StockPositioningPage,
  validateSearch: (search: Record<string, unknown>): StockPositioningFilters => ({
    pageIndex: search.pageIndex ? Number(search.pageIndex) : undefined,
    pageSize: search.pageSize ? Number(search.pageSize) : undefined,
    sortBy: search.sortBy as any,
    search: search.search as string,
    stockLocationId: search.stockLocationId as string,
  }),
  head: () => ({
    meta: [
      {
        title: "Posicionamento de estoque",
      },
    ],
  }),
});

function StockPositioningPage() {
  const { filters, setFilters } = useFilters(Route.id);
  const [searchVal, setSearchVal] = useState(filters.search ?? "");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setSearchVal(filters.search ?? "");
  }, [filters.search]);

  const { data: stockLocations = [] } = useQuery({
    queryKey: ["stock-locations"],
    queryFn: fetchAllStockLocations,
  });

  useEffect(() => {
    if (!filters.stockLocationId && stockLocations.length > 0) {
      setFilters({ stockLocationId: String(stockLocations[0].id) });
    }
  }, [filters.stockLocationId, stockLocations, setFilters]);

  const activeStockLocationId = filters.stockLocationId || (stockLocations[0] ? String(stockLocations[0].id) : undefined);

  const { data, isLoading } = useQuery({
    queryKey: ["stock-positionings", filters],
    queryFn: () => fetchStockPositionings(filters),
    placeholderData: keepPreviousData,
    enabled: !!activeStockLocationId,
  });

  const { data: metrics } = useQuery({
    queryKey: ["stock-positioning-metrics", activeStockLocationId],
    queryFn: () => fetchStockPositioningMetrics(activeStockLocationId),
    enabled: !!activeStockLocationId,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchVal || undefined });
  };

  const handleClearFilters = () => {
    setSearchVal("");
    setFilters({ search: undefined });
  };

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      await generateStockReport(activeStockLocationId);
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar relatório.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewHistory = (item: StockPositioning) => {
    toast.info(`Histórico do produto ${item.product.name} (Funcionalidade simulada)`);
  };

  const columns = useMemo(
    () => getStockPositioningTableColumns({ onViewHistory: handleViewHistory }),
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    filters: filters as any,
    setFilters: setFilters as any,
  });

  const renderEmptyState = () => {
    if (isLoading) return null;

    if (filters.search) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 mb-6 relative">
            <SearchX className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Nenhum produto encontrado</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 whitespace-normal">
            Não encontramos nenhum resultado para a sua busca. Tente verificar a ortografia ou usar o código do produto.
          </p>
          <Button variant="outline" onClick={handleClearFilters} className="p-6 gap-2 border-border shadow-sm">
            <Eraser className="h-4 w-4" />
            Limpar busca
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 mb-6 relative">
          <PackageOpen className="h-16 w-16 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Este almoxarifado está vazio</h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6 whitespace-normal">
          Ainda não há produtos alocados para cá. Faça uma entrada de estoque ou cadastre novos itens para começar.
        </p>
        <Button asChild className="p-6 bg-[#009262] hover:bg-[#009262]/90 text-white shadow-sm">
          <Link to={"/stock-in" as any}>
            Realizar entrada de estoque
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <DataView
      headerActions={
        stockLocations.length > 0 ? (
          <Select
            value={activeStockLocationId || ""}
            onValueChange={(val) => setFilters({ stockLocationId: val })}
          >
            <SelectTrigger className="w-[260px] h-10 gap-2 font-medium bg-background border-border shadow-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Selecione o local de estoque" />
            </SelectTrigger>
            <SelectContent>
              {stockLocations.map((w) => (
                <SelectItem key={w.id} value={String(w.id)}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null
      }
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-l-4 border-l-[#009262] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#009262]/10 text-[#009262]">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">Total de itens</span>
            </div>
            <p className="text-sm text-muted-foreground">Total de itens em estoque</p>
            <p className="text-4xl font-extrabold text-foreground">{metrics?.totalItems ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FF7A00] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FF7A00]/10 text-[#FF7A00]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">Baixo estoque</span>
            </div>
            <p className="text-sm text-muted-foreground">Número de itens com baixo estoque</p>
            <p className="text-4xl font-extrabold text-foreground">{metrics?.lowStock ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2F80ED] shadow-sm bg-card">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2F80ED]/10 text-[#2F80ED]">
                <Boxes className="h-6 w-6" />
              </div>
              <span className="text-lg xl:text-xl font-bold text-foreground leading-tight">Estoque em excesso</span>
            </div>
            <p className="text-sm text-muted-foreground">Número de itens em excesso no estoque</p>
            <p className="text-4xl font-extrabold text-foreground">{metrics?.excessStock ?? 0}</p>
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
            <p className="text-sm text-muted-foreground">Quantidade de itens esgotados atualmente</p>
            <p className="text-4xl font-extrabold text-foreground">{metrics?.outOfStock ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
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
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleExportReport}
            disabled={isExporting}
            className="h-10 gap-2 border-border shadow-sm"
          >
            <FileText className="h-4 w-4" />
            <span>{isExporting ? "Exportando..." : "Gerar relatório"}</span>
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
