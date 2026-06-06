import api from "@/lib/axios";

export type LogEntity =
  | "user"
  | "product"
  | "stock-location"
  | "department"
  | "product-brand"
  | "product-category"
  | "measurement-unit";

const LOG_ENTITY_BASE: Record<LogEntity, string> = {
  user: "/users",
  product: "/products",
  "stock-location": "/stock-locations",
  department: "/departments",
  "product-brand": "/product-brands",
  "product-category": "/product-categories",
  "measurement-unit": "/measurement-units",
};

export type SystemLogUser = {
  id: number;
  name: string;
  email?: string;
  username?: string;
};

export type SystemLogAction = "CREATE" | "UPDATE" | "DELETE" | (string & {});

export type SystemLog = {
  id: number;
  entity_name: string;
  entity_id: number | null;
  action: SystemLogAction;
  user_id: number | null;
  user: SystemLogUser | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export async function fetchRecordLogs(
  entity: LogEntity,
  id: number
): Promise<SystemLog[]> {
  const { data } = await api.get<SystemLog[]>(
    `${LOG_ENTITY_BASE[entity]}/${id}/logs`
  );
  return data;
}
