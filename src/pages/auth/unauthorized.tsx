import { createFileRoute } from "@tanstack/react-router";
import { Unauthorized } from "@/components/unauthorized";

export const Route = createFileRoute("/auth/unauthorized")({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <Unauthorized
      title="Acesso Negado"
      message="Você não tem permissão para acessar este recurso. Por favor, faça login ou contate o administrador."
      showLoginButton={true}
    />
  );
}
