import {
  RouterProvider,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./context/auth-context";
import { useAuth } from "./hooks/use-auth";

const queryClient = new QueryClient();

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
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
