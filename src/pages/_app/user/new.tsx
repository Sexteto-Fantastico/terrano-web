import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/user/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/user/new"!</div>;
}
