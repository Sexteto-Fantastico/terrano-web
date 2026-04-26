import { HeadContent, Outlet, createRootRoute } from "@tanstack/react-router";
import { NotFound } from "@/components/not-found";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <NuqsAdapter>
        <Outlet />
      </NuqsAdapter>
    </>
  );
}
