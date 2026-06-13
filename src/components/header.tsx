import { useMatches, useRouter, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "./ui/breadcrumb";

export function Header({ children }: { children?: React.ReactNode }) {
  const matches = useMatches();
  const router = useRouter();

  if (!matches.length) return null;

  const currentMatch = matches[matches.length - 1];
  const route = router.routesById[currentMatch.routeId] as any;

  const pageTitle =
    route?.options?.head?.()?.meta?.[0]?.title ||
    currentMatch.pathname.split("/").filter(Boolean).pop() ||
    "Terrano";

  const breadcrumbMatches = matches.filter((match, index, self) => {
    if (index > 0 && match.pathname === self[index - 1].pathname) {
      return false;
    }

    if (match.routeId !== "__root__" && match.routeId.includes("/_")) {
      const matchRoute = router.routesById[match.routeId] as any;
      const hasTitle = !!matchRoute?.options.head?.()?.meta?.[0]?.title;
      if (!hasTitle) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
        {children}
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbMatches.map((match, index) => {
            const isLast = index === breadcrumbMatches.length - 1;
            const matchRoute = router.routesById[match.routeId] as any;

            const label =
              matchRoute?.options?.head?.()?.meta?.[0]?.title ||
              match.pathname.split("/").filter(Boolean).pop() ||
              "Home";

            return (
              <BreadcrumbItem key={match.id}>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link to={match.pathname}>{label}</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
