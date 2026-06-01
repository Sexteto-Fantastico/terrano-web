import {
  RouterProvider,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./hooks/use-auth";
import { queryClient } from "./lib/react-query";
import { Providers } from "./components/providers";

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
    <Providers>
      <InnerApp />
    </Providers>
  );
}
