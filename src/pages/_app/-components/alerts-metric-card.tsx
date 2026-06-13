import { TriangleAlertIcon } from "lucide-react";
import type { HomeAlert } from "@/api/home";
import { MetricCard } from "./metric-card";
import { formatNumber } from "@/utils/format-number";

interface AlertsCardProps {
  alerts: HomeAlert;
}

export function AlertsCard({ alerts }: Readonly<AlertsCardProps>) {
  return (
    <MetricCard
      icon={TriangleAlertIcon}
      iconColor="text-amber-500"
      label="Alertas"
      value={formatNumber(alerts.total)}
      trend={`+${alerts.newCount} novos`}
      trendColor="text-amber-700"
      trendBg="bg-amber-100"
      href="/alert"
      linkLabel="Ver alertas"
    />
  );
}
