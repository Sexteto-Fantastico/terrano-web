import { ArrowDownToLineIcon } from "lucide-react";
import type { HomeIndicator } from "@/api/home";
import { MetricCard } from "./metric-card";
import { formatNumber } from "@/utils/format-number";
import { formatPercentage } from "@/utils/format-percentage";

interface EntriesMetricCardProps {
  entries: HomeIndicator;
}

export function EntriesMetricCard({
  entries,
}: Readonly<EntriesMetricCardProps>) {
  return (
    <MetricCard
      icon={ArrowDownToLineIcon}
      iconColor="text-primary"
      label="Entradas"
      value={formatNumber(entries.total)}
      trend={formatPercentage(entries.percentage)}
      trendColor={
        entries.percentage >= 0 ? "text-primary" : "text-destructive"
      }
      trendBg={entries.percentage >= 0 ? "bg-green-100" : "bg-red-100"}
      href="/stock-in"
      linkLabel="Ver entradas"
    />
  );
}
