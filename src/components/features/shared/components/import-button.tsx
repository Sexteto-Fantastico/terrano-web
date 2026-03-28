import {Button} from "@/components/ui/button.tsx";
import {ImportIcon} from "lucide-react";


export const ImportButton = () => {

    return <Button variant="defaultTerrano">
        <ImportIcon/>
        <span>Importar</span>
    </Button>
}