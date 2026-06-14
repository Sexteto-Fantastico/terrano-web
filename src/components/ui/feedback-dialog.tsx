import { CircleCheckIcon, OctagonXIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FeedbackVariant = "success" | "error";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: FeedbackVariant;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

const variantConfig = {
  success: {
    icon: CircleCheckIcon,
    mediaClassName: "bg-primary/10 text-primary",
    buttonVariant: "default" as const,
  },
  error: {
    icon: OctagonXIcon,
    mediaClassName: "bg-destructive/10 text-destructive",
    buttonVariant: "destructive" as const,
  },
};

export function FeedbackDialog({
  open,
  onOpenChange,
  variant = "success",
  title,
  description,
  actionText = "OK",
  onAction,
}: FeedbackDialogProps) {
  const { icon: Icon, mediaClassName, buttonVariant } = variantConfig[variant];

  function handleAction() {
    onOpenChange(false);
    onAction?.();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className={cn(mediaClassName)}>
            <Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant={buttonVariant} onClick={handleAction}>
            {actionText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
