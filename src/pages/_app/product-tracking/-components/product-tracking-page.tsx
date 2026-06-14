import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "../index";
import { DataView } from "@/components/views/data-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProductSelect } from "./product-select";
import { DateRangePicker } from "./date-range-picker";
import { MovementsTable } from "./movements-table";
import { fetchProductTracking } from "@/api/product-tracking";


export default function ProductTrackingPage() {
  const navigate = useNavigate();

  const search = Route.useSearch();

  const initialFilters = useMemo(
    () => ({
      productId: search.productId,
      startDate: search.startDate,
      endDate: search.endDate,
    }),
    [search]
  );

  const [productId, setProductId] = useState<number | undefined>(
    initialFilters.productId
  );

  const [startDate, setStartDate] = useState<string | undefined>(
    initialFilters.startDate
  );

  const [endDate, setEndDate] = useState<string | undefined>(
    initialFilters.endDate
  );

  useEffect(() => {
    navigate({
  to: "/product-tracking",
  search: {
    productId,
    startDate,
    endDate,
  } as any,
  replace: true,
});
  }, [
    productId,
    startDate,
    endDate,
    navigate,
  ]);
  const { data, isLoading } = useQuery({
    queryKey: ["product-tracking", productId, startDate, endDate],
    queryFn: () =>
      fetchProductTracking({
        productId: productId!,
        startDate,
        endDate,
      }),
    enabled: !!productId,
  });

  return (
    <DataView>
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <div className="w-64">
          <Label>Produto *</Label>
          <ProductSelect value={productId} onChange={setProductId} />
        </div>
        <div className="w-80">
          <Label>Período</Label>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>
      </div>

      {productId && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Custo Médio Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-semibold">
                  {data?.averageCost != null
                    ? data.averageCost.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "-"}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Custo Médio no Período</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-semibold">
                  {data?.periodAverageCost != null
                    ? data.periodAverageCost.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "-"}
                </span>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-4" />

          <MovementsTable
            movements={data?.movements ?? []}
            isLoading={isLoading}
          />
        </>
      )}
    </DataView>
  );
}