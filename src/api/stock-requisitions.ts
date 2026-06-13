import api from "@/lib/axios";

export type StockRequisitionItem = {
  productId: number;
  productName?: string;
  quantity: number;
  delivered: boolean;
};

export type StockRequisitionResponse = {
  id: number;
  requesterJustification: string;
  status: string;
  createdAt: string;
  department?: { id: number; name: string } | null;
  items: StockRequisitionItem[];
};

export async function fetchPendingStockRequisitions(): Promise<
  StockRequisitionResponse[]
> {
  const { data } = await api.get<StockRequisitionResponse[]>(
    "/stock-requisitions",
    {
      params: {
        status: "PENDING",
        pageSize: 10,
      },
    }
  );
  return data;
}
