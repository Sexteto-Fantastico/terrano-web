import { redirect } from "@tanstack/react-router";

export function requirePermission(resource: string, action: string) {
  return ({
    context,
  }: {
    context: {
      auth: { can: (r: string, a: string) => boolean; isReady: boolean };
    };
  }) => {
    // Permissions are still loading: the router is invalidated once they arrive and this guard runs again.
    if (!context.auth.isReady) return;

    if (!context.auth.can(resource, action)) {
      throw redirect({ to: "/" });
    }
  };
}
