import { Button, type ButtonProps } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";

interface AddButtonProps extends ButtonProps {}

export const AddButton = ({
  variant = "default",
  ...props
}: AddButtonProps) => {
  return (
    <Button variant={variant} {...props}>
      <PlusIcon />
      <span>Adicionar</span>
    </Button>
  );
};
