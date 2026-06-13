import type React from "react";
import { ArrowRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "@/components/ui/link";

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  label: string;
  value: string;
  trend?: string;
  trendColor?: string;
  trendBg?: string;
  href?: string;
  linkLabel?: string;
}

export function MetricCard({
  icon: Icon,
  iconColor,
  label,
  value,
  trend,
  trendColor,
  trendBg,
  href,
  linkLabel,
}: Readonly<MetricCardProps>) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Icon className={cn("size-5", iconColor)} />
          {href && (
            <Link to={href} className="flex items-center self-start">
              <span className="text-xs font-medium text-primary">
                {linkLabel}
              </span>
              <ArrowRightIcon className="size-3 text-primary" />
            </Link>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5",
                trendBg
              )}
            >
              <span className={cn("text-xs font-medium", trendColor)}>
                {trend}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
}
