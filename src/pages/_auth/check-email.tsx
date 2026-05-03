import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/components/ui/link";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/_auth/check-email")({
  component: CheckEmailPage,
});

function CheckEmailPage() {
  return (
    <div className="w-full max-w-sm space-y-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-6 w-6 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Verifique seu email</h1>
        <p className="text-sm text-muted-foreground">
          Enviamos um link de redefinição de senha para o email informado. Por
          favor, verifique sua caixa de entrada e siga as instruções.
        </p>
      </div>
      <Link to="/sign-in">Voltar ao login</Link>
    </div>
  );
}
