import { Button } from "@/components/ui/button";
import {
  HeadContent,
  Link,
  Outlet,
  createRootRoute,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-balance">
          Página não encontrada
        </h1>
        <p className="text-lg text-muted-foreground">
          A página que você está procurando não existe.
        </p>
        <Button variant={"link"} asChild>
          <Link to="/">
            <ArrowLeft className="size-4" />
            Voltar para a página inicial
          </Link>
        </Button>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
