import { createFileRoute } from "@tanstack/react-router";
import { AddButton } from "@/components/feature/shared/components/add-button";
import { ExportButton } from "@/components/feature/shared/components/export-button";
import { FilterButton } from "@/components/feature/shared/components/filter-button";
import { ImportButton } from "@/components/feature/shared/components/import-button";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-balance">
        Terrano
      </h1>
      <div>
        <AddButton className="ml-4" />
        <ExportButton className="ml-2" />
        <ImportButton className="ml-2" />
        <FilterButton className="ml-2" />
        <FilterButton className="ml-2" filters={["Filtro 1", "Filtro 2"]} />
      </div>
    </div>
  );
}
