import { ArrowLeft } from "lucide-react";
import { Link } from "./ui/link";

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-extrabold tracking-tight text-balance">
        Página não encontrada
      </h1>
      <p className="text-lg text-muted-foreground">
        A página que você está procurando não existe.
      </p>
      <Link to="/">
        <ArrowLeft className="size-4" />
        Voltar para a página inicial
      </Link>
    </div>
  );
}
