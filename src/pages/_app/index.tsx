import { createFileRoute } from "@tanstack/react-router";
import { CreateView } from "@/components/views/create-view";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
}
