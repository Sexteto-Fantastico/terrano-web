import {Button} from "@/components/ui/button.tsx";
import {PlusIcon} from "lucide-react";



export const AddButton = () => {

    return <Button variant="defaultTerrano">
        <PlusIcon/>
        <span>Adicionar</span>
    </Button>
}