import { createFileRoute } from "@tanstack/react-router";
import {FilterButton} from "@/components/features/shared/components/filter-button.tsx";
import {ExportButton} from "@/components/features/shared/components/export-button.tsx";
import {ImportButton} from "@/components/features/shared/components/import-button.tsx";
import {AddButton} from "@/components/features/shared/components/add-button.tsx";

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
      <FilterButton />
      <FilterButton filters={["a","b"]}/>
      <ExportButton />
      <ImportButton />
      <AddButton />
    </div>
  );
}
