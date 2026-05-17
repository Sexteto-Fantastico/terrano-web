import { createFileRoute } from "@tanstack/react-router";
import CreateView from "@/components/feature/shared/components/create/create-view.tsx";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
      <CreateView />
  );
}
