import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricSkeleton } from "./metric-card";
import { PendingRequestsTable } from "./pending-requests-table";
import { fetchPendingStockRequisitions } from "@/api/stock-requisitions";

export function PendingRequestsCard() {
  const { data: requisitions = [], isLoading } = useQuery({
    queryKey: ["pending-requisitions"],
    queryFn: fetchPendingStockRequisitions,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between px-4">
          <CardTitle>Solicitações Pendentes</CardTitle>
          <Badge className="rounded-full bg-blue-500 text-white hover:bg-blue-500">
            ... pendentes
          </Badge>
        </CardHeader>
        <CardContent className="px-4">
          <MetricSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between px-4">
        <CardTitle>Solicitações Pendentes</CardTitle>

        <Badge className="rounded-full bg-blue-500 text-white hover:bg-blue-500">
          {requisitions.length} pendentes
        </Badge>
      </CardHeader>

      <CardContent className="px-4">
        <PendingRequestsTable data={requisitions} />
      </CardContent>
    </Card>
  );
}
