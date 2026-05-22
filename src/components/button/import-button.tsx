import { Button, type ButtonProps } from "@/components/ui/button.tsx";
import { ImportIcon } from "lucide-react";

interface ImportButtonProps extends ButtonProps {}

export const ImportButton = ({
  variant = "outline",
  ...props
}: ImportButtonProps) => {
  return (
    <Button variant={variant} {...props}>
      <ImportIcon />
      <span>Importar</span>
    </Button>
  );
};
