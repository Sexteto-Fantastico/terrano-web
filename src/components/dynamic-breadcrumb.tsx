import { useMatches, useRouter, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "./ui/breadcrumb";

export function DynamicBreadcrumb() {
  const matches = useMatches();
  const router = useRouter();

  if (!matches.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          {matches.map((match, index) => {
            const isLast = index === matches.length - 1;
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
