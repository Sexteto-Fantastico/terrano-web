import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Terrano",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-balance">
        Terrano
      </h1>
    </div>
  );
}
