import { createFileRoute } from "@tanstack/react-router";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";

export const Route = createFileRoute("/users")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Usuários",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="flex h-screen flex-col">
      <DynamicBreadcrumb />

      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          Usuários
        </h1>
      </div>
    </div>
  );
}
