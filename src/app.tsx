import {
  RouterProvider,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./context/auth-context";
import { useAuth } from "./hooks/use-auth";
import { queryClient } from "./lib/react-query";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { Button } from "./components/ui/button";

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();

  // Guards depend on the session and permissions, so they must be evaluated again whenever those change.
  useEffect(() => {
    if (auth.isReady) {
      void router.invalidate();
    }
  }, [
    auth.isReady,
    auth.token,
    auth.user?.id,
    auth.user?.requiresPasswordReset,
    auth.permissions,
  ]);

  if (!auth.isBootstrapped) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (auth.authError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{auth.authError}</p>
        <div className="flex gap-2">
          <Button onClick={auth.reload}>Tentar novamente</Button>
          <Button variant="outline" onClick={auth.logout}>
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RouterContextProvider router={router} context={{ auth }}>
      <RouterProvider router={router} />
    </RouterContextProvider>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <InnerApp />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
