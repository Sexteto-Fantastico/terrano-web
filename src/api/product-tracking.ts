import api from "@/lib/axios";

export type MovementType = "IN" | "OUT";

export type MovementPurpose =
  | "PURCHASE"
  | "STOCK_REQUISITION"
  | "RETURN"
  | "ADJUSTMENT"
  | "OTHER";

export const MOVEMENT_PURPOSE_LABELS: Record<MovementPurpose, string> = {
  PURCHASE: "Compra",
  STOCK_REQUISITION: "Requisição de Estoque",
  RETURN: "Devolução",
  ADJUSTMENT: "Ajuste",
  OTHER: "Outro",
};

export type ProductMovement = {
  id: number;
  date: string;
  type: MovementType;
  quantity: number;
  unitCost: number;
  total: number;
  purpose: MovementPurpose;
};

export type ProductTrackingResponse = {
  productId: number;
  averageCost: number;
  periodAverageCost: number;
  movements: ProductMovement[];
};

export type ProductTrackingFilters = {
  productId: number;
  startDate?: string;
  endDate?: string;
};

export async function fetchProductTracking(
  filters: ProductTrackingFilters
): Promise<ProductTrackingResponse> {
  const { data } = await api.get<ProductTrackingResponse>(
    "/product-tracking",
    { params: filters }
  );
  return data;
}