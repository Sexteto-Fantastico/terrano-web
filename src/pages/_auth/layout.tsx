import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.token || !context.auth.isReady) return;

    if (!context.auth.mustResetPassword) {
      throw redirect({ to: "/" });
    }
    // A pending password reset keeps the user on the define-password screen.
    if (location.pathname !== "/define-password") {
      throw redirect({ to: "/define-password" });
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
