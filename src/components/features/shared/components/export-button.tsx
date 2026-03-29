import {Button} from "@/components/ui/button.tsx";
import {ShareIcon} from "lucide-react";


export const ExportButton = () => {

    return <Button variant="defaultTerrano">
        <ShareIcon/>
        <span>Exportar</span>
    </Button>
}