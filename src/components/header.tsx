import { useMatches, useRouter, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "./ui/breadcrumb";

export function Header() {
  const matches = useMatches();
  const router = useRouter();

  if (!matches.length) return null;

  const currentMatch = matches[matches.length - 1];
  const route = router.routesById[currentMatch.routeId];

  const pageTitle =
    route?.options.head?.()?.meta?.[0]?.title ||
    currentMatch.pathname.split("/").filter(Boolean).pop() ||
    "Terrano";

  const breadcrumbMatches = matches.filter((match, index, self) => {
    if (index > 0 && match.pathname === self[index - 1].pathname) {
      return false;
    }

    if (match.routeId !== '__root__' && match.routeId.includes('/_')) {
      const matchRoute = router.routesById[match.routeId];
      const hasTitle = !!matchRoute?.options.head?.()?.meta?.[0]?.title;
      if (!hasTitle) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbMatches.map((match, index) => {
            const isLast = index === breadcrumbMatches.length - 1;
            const matchRoute = router.routesById[match.routeId];
            
            const label =
              matchRoute?.options.head?.()?.meta?.[0]?.title ||
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