import { redirect } from "@tanstack/react-router";

export function requirePermission(resource: string, action: string) {
  return ({
    context,
  }: {
    context: {
      auth: { can: (r: string, a: string) => boolean };
    };
  }) => {
    if (!context.auth.can(resource, action)) {
      throw redirect({ to: "/" });
    }
  };
}
