import { Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "./ui/link";

interface UnauthorizedProps {
  title?: string;
  message?: string;
  showLoginButton?: boolean;
}

export function Unauthorized({
  title = "Acesso Negado",
  message = "Você não tem permissão para acessar este recurso.",
  showLoginButton = true,
}: UnauthorizedProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-destructive/10 p-4">
          <Lock className="size-8 text-destructive" />
        </div>
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-balance">
          {title}
        </h1>
        <p className="max-w-md text-center text-lg text-muted-foreground">
          {message}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        {showLoginButton && (
          <Link to="/auth/sign-in">
            <Button>Fazer Login</Button>
          </Link>
        )}
        <Link to="/">
          <Button variant="outline">Voltar para Home</Button>
        </Link>
      </div>
    </div>
  );
}
