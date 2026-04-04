import {Button, type ButtonProps} from "@/components/ui/button.tsx";
import {ShareIcon} from "lucide-react";

interface ExportButtonProps extends ButtonProps {

}

export const ExportButton = ({variant = "outline", ...props}: ExportButtonProps) => {

    return <Button variant={variant} {...props}>
        <ShareIcon/>
        <span>Exportar</span>
    </Button>
}