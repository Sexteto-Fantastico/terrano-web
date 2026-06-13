import { ShoppingCartIcon } from "lucide-react";
import type { HomeIndicator } from "@/api/home";
import { MetricCard } from "./metric-card";
import { formatCurrency } from "@/utils/format-currency";
import { formatPercentage } from "@/utils/format-percentage";

interface PurchasesMetricCardProps {
  purchases: HomeIndicator;
}

export function PurchasesMetricCard({
  purchases,
}: Readonly<PurchasesMetricCardProps>) {
  return (
    <MetricCard
      icon={ShoppingCartIcon}
      iconColor="text-primary"
      label="Compras Registradas"
      value={formatCurrency(purchases.total)}
      trend={formatPercentage(purchases.percentage)}
      trendColor={
        purchases.percentage >= 0 ? "text-primary" : "text-destructive"
      }
      trendBg={purchases.percentage >= 0 ? "bg-green-100" : "bg-red-100"}
      href="/purchase"
      linkLabel="Ver compras"
    />
  );
}
