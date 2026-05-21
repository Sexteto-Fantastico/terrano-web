import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (context.auth.token && !context.auth.mustResetPassword) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-2">
      <aside className="hidden items-center justify-center bg-primary md:flex">
        <h1 className="text-4xl font-semibold text-primary-foreground">
          Terrano
        </h1>
      </aside>
      <div className="flex w-full items-center justify-center p-6">
        <Outlet />
      </div>
    </div>
  );
}
