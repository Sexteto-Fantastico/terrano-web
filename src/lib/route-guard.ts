import { redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export function requirePermission(resource: string, action: string) {
  return ({
    context,
  }: {
    context: {
      auth: { can: (r: string, a: string) => boolean };
    };
  }) => {
    if (!context.auth.can(resource, action)) {
      toast.error("Você não tem permissão para acessar esta página.");
      throw redirect({ to: "/" });
    }
  };
}
