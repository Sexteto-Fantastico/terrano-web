import { isAxiosError } from "axios";

/**
 * Extrai a mensagem de erro retornada pela API (campo `message` da resposta
 * do axios). Quando não houver uma mensagem utilizável, retorna o `fallback`.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Erro ao processar operação!"
): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;

      if (typeof message === "string" && message.trim().length > 0) {
        return message;
      }
    }
  }

  return fallback;
}
