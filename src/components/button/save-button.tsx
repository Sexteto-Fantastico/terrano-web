import {Button, type ButtonProps} from "@/components/ui/button.tsx";
import {PlusIcon} from "lucide-react";
import {cn} from "@/lib/utils.ts";

interface SaveButtonProps extends ButtonProps {
}

export const SaveButton = ({
                               variant = "outline",
                               size = "lg",
                               className,
                               ...props
                           }: SaveButtonProps) => {
    return (
        <Button
            variant={variant}
            size={size}
            className={cn("border-primary text-primary", className)}
            {...props}>
            <PlusIcon/>
            <span>Salvar</span>
        </Button>)
}