import { z } from "zod";

export const envSchema = z.object({
  VITE_API_BASE_URL: z.url("URL da API inválida"),
});

export const env = envSchema.parse(import.meta.env);
