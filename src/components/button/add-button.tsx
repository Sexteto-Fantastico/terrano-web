import { Button, type ButtonProps } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface AddButtonProps extends ButtonProps {
  to?: string;
}

export const AddButton = ({
  variant = "default",
  to,
  onClick,
  ...props
}: AddButtonProps) => {
  const navigate = useNavigate();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (to) {
      navigate({ to: to as any });
    } else {
      onClick?.(event);
    }
  }

  return (
    <Button variant={variant} onClick={handleClick} {...props}>
      <PlusIcon />
      <span>Adicionar</span>
    </Button>
  );
};
