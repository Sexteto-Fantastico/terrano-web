import {Button} from "@/components/ui/button.tsx";
import {SlidersHorizontal} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";

interface Props {
    filters?: string[];
}

export const FilterButton = ({ filters = []}: Props) => {
    const filtersApplied : boolean = filters && filters.length > 0;

    return (
        <Button variant={filtersApplied ? "filtered" : "defaultTerrano"} >
            <SlidersHorizontal className="size-4"/>

            <span>Filtros</span>

            {filtersApplied && filters.length > 0 && (
                <Badge
                    className="w-4 h-4 tabular-nums"
                >
                    {filters.length}
                </Badge>
            )}
        </Button>
    );
}

