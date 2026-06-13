import { ArrowUpFromLineIcon } from "lucide-react";
import type { HomeIndicator } from "@/api/home";
import { MetricCard } from "./metric-card";
import { formatNumber } from "@/utils/format-number";
import { formatPercentage } from "@/utils/format-percentage";

interface ExitsMetricCardProps {
  exits: HomeIndicator;
}

export function ExitsMetricCard({ exits }: Readonly<ExitsMetricCardProps>) {
  return (
    <MetricCard
      icon={ArrowUpFromLineIcon}
      iconColor="text-destructive"
      label="Saídas"
      value={formatNumber(exits.total)}
      trend={formatPercentage(exits.percentage)}
      trendColor={
        exits.percentage >= 0 ? "text-primary" : "text-destructive"
      }
      trendBg={exits.percentage >= 0 ? "bg-green-100" : "bg-red-100"}
      href="/stock-out"
      linkLabel="Ver saídas"
    />
  );
}
