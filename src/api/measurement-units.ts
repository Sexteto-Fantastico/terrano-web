import api from "@/lib/axios";
import { fetchPaginated } from "@/lib/pagination";
import type { Filters, PaginatedData } from "@/components/ui/data-table/@types";

/**
 * "Conformidade" / standardized symbol of a measurement unit.
 * Mirrors the backend `MeasurementUnitSymbol` enum so we always know
 * which unit is meant, instead of relying only on the free-text name.
 */
export const MeasurementUnitSymbol = {
  UN: "UN",
  KG: "KG",
  L: "L",
  M: "M",
  CX: "CX",
  PCT: "PCT",
  OTHER: "OTHER",
} as const;

export type MeasurementUnitSymbol =
  (typeof MeasurementUnitSymbol)[keyof typeof MeasurementUnitSymbol];

/** Backend `MeasurementUnitType` enum. */
export const MeasurementUnitType = {
  MASS: "MASS",
  VOLUME: "VOLUME",
  LENGTH: "LENGTH",
  AREA: "AREA",
  UNIT: "UNIT",
} as const;

export type MeasurementUnitType =
  (typeof MeasurementUnitType)[keyof typeof MeasurementUnitType];

/**
 * Human readable labels for each symbol, shown in selects and the table.
 */
export const MEASUREMENT_UNIT_SYMBOL_LABELS: Record<
  MeasurementUnitSymbol,
  string
> = {
  UN: "Unidade (un)",
  KG: "Quilograma (kg)",
  L: "Litro (L)",
  M: "Metro (m)",
  CX: "Caixa (cx)",
  PCT: "Pacote (pct)",
  OTHER: "Outros",
};

/**
 * The backend requires a `type` alongside the `symbol`. The user only informs
 * the "conformidade" (symbol), so we derive the type from it automatically.
 */
const SYMBOL_TO_TYPE: Record<MeasurementUnitSymbol, MeasurementUnitType> = {
  UN: MeasurementUnitType.UNIT,
  KG: MeasurementUnitType.MASS,
  L: MeasurementUnitType.VOLUME,
  M: MeasurementUnitType.LENGTH,
  CX: MeasurementUnitType.UNIT,
  PCT: MeasurementUnitType.UNIT,
  OTHER: MeasurementUnitType.UNIT,
};

export function typeFromSymbol(
  symbol: MeasurementUnitSymbol
): MeasurementUnitType {
  return SYMBOL_TO_TYPE[symbol];
}

export type MeasurementUnit = {
  id: number;
  name: string;
  symbol: MeasurementUnitSymbol;
  type: MeasurementUnitType;
  isActive: boolean;
  deletedAt?: string | null;
};

export type CreateMeasurementUnitRequestDTO = {
  name: string;
  symbol: MeasurementUnitSymbol;
  type: MeasurementUnitType;
};

export type UpdateMeasurementUnitRequestDTO = {
  id: number;
  name?: string;
  symbol?: MeasurementUnitSymbol;
  type?: MeasurementUnitType;
};

type MeasurementUnitQuery = {
  name?: string;
  activeOnly?: string;
};

export type MeasurementUnitFilters = Filters<MeasurementUnitQuery>;

type MeasurementUnitApiResponse = Omit<MeasurementUnit, "isActive">;

/** Backend returns `deletedAt`; the UI works with `isActive`. */
function withIsActive(unit: MeasurementUnitApiResponse): MeasurementUnit {
  return { ...unit, isActive: unit.deletedAt == null };
}

export async function fetchAllMeasurementUnits(): Promise<MeasurementUnit[]> {
  const { data } = await api.get<MeasurementUnitApiResponse[]>(
    "/measurement-units"
  );
  return data.map(withIsActive);
}

export async function fetchMeasurementUnits(
  filters: MeasurementUnitFilters
): Promise<PaginatedData<MeasurementUnit>> {
  const { result, rowCount } = await fetchPaginated<MeasurementUnitApiResponse>(
    "/measurement-units",
    filters
  );
  return { result: result.map(withIsActive), rowCount };
}

export async function fetchMeasurementUnitById(
  id: number
): Promise<MeasurementUnit> {
  const { data } = await api.get<MeasurementUnitApiResponse>(
    `/measurement-units/${id}`
  );
  return withIsActive(data);
}

export async function createMeasurementUnit(
  data: CreateMeasurementUnitRequestDTO
): Promise<MeasurementUnit> {
  const { data: response } = await api.post<MeasurementUnitApiResponse>(
    "/measurement-units",
    data
  );
  return withIsActive(response);
}

export async function updateMeasurementUnit(
  data: UpdateMeasurementUnitRequestDTO
): Promise<MeasurementUnit> {
  const { id, ...body } = data;
  const { data: response } = await api.put<MeasurementUnitApiResponse>(
    `/measurement-units/${id}`,
    body
  );
  return withIsActive(response);
}

export async function deleteMeasurementUnit(id: number): Promise<void> {
  await api.delete(`/measurement-units/${id}`);
}

export async function restoreMeasurementUnit(
  id: number
): Promise<MeasurementUnit> {
  const { data } = await api.patch<MeasurementUnitApiResponse>(
    `/measurement-units/${id}/restore`
  );
  return withIsActive(data);
}
