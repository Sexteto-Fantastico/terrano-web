import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { NotFound } from "@/components/not-found";
import type { AuthState } from "@/context/auth-context";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  auth: AuthState;
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
