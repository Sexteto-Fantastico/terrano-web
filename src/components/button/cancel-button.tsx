import {Button, type ButtonProps} from "@/components/ui/button.tsx";
import {X} from "lucide-react";
import {cn} from "@/lib/utils.ts";

interface CancelButtonProps extends ButtonProps {
}

export const CancelButton = ({
                                 variant = "outline",
                                 size = "lg",
                                 className,
                                 ...props
                             }: CancelButtonProps) => {
    return (
        <Button
            variant={variant}
            size={size}
            className={cn("border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 gap-1.5 transition-colors", className)}
            {...props}>
            <X size={14}/>
            <span>Cancelar</span>
        </Button>)
}