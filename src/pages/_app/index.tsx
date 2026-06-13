import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataView } from "@/components/views/data-view";
import { fetchHomeSummary, type HomeResponse } from "@/api/home";
import { MetricSkeleton } from "./-components/metric-card";
import { PurchasesMetricCard } from "./-components/purchases-metric-card";
import { EntriesMetricCard } from "./-components/entries-metric-card";
import { ExitsMetricCard } from "./-components/exits-metric-card";
import { AlertsCard } from "./-components/alerts-metric-card";
import { PendingRequestsCard } from "./-components/pending-requests-card";
import { InventoryLevels } from "./-components/inventory-levels";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Dashboard",
      },
    ],
  }),
});

function RouteComponent() {
  const { data, isLoading } = useQuery<HomeResponse>({
    queryKey: ["home-summary"],
    queryFn: fetchHomeSummary,
  });

  const summary: HomeResponse = {
    purchases: {
      total: data?.purchases.total ?? 0,
      percentage: data?.purchases.percentage ?? 0,
    },
    entries: {
      total: data?.entries.total ?? 0,
      percentage: data?.entries.percentage ?? 0,
    },
    exits: {
      total: data?.exits.total ?? 0,
      percentage: data?.exits.percentage ?? 0,
    },
    alerts: {
      total: data?.alerts.total ?? 0,
      newCount: data?.alerts.newCount ?? 0,
    },
  };

  const currentPeriod = `Resumo de ${new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date())} de ${new Date().getFullYear()}`;

  return (
    <DataView
      headerActions={
        <span className="text-sm text-muted-foreground">{currentPeriod}</span>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="m-1 grid grid-cols-4 gap-6">
          {isLoading ? (
            <>
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
            </>
          ) : (
            <>
              <PurchasesMetricCard purchases={summary.purchases} />
              <EntriesMetricCard entries={summary.entries} />
              <ExitsMetricCard exits={summary.exits} />
              <AlertsCard alerts={summary.alerts} />
            </>
          )}
        </div>

        <div className="m-1 grid grid-cols-[1fr_360px] gap-6">
          <PendingRequestsCard />
          <InventoryLevels />
        </div>
      </div>
    </DataView>
  );
}
