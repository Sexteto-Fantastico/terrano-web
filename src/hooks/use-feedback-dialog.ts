import { useCallback, useState } from "react";

import type { FeedbackVariant } from "@/components/ui/feedback-dialog";

interface FeedbackState {
  open: boolean;
  variant: FeedbackVariant;
  title: string;
  description?: string;
  onAction?: () => void;
}

export function useFeedbackDialog() {
  const [state, setState] = useState<FeedbackState>({
    open: false,
    variant: "success",
    title: "",
  });

  const success = useCallback(
    (title: string, onAction?: () => void, description?: string) => {
      setState({ open: true, variant: "success", title, description, onAction });
    },
    []
  );

  const error = useCallback((title: string, description?: string) => {
    setState({
      open: true,
      variant: "error",
      title,
      description,
      onAction: undefined,
    });
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, open }));
  }, []);

  return {
    success,
    error,
    props: {
      open: state.open,
      variant: state.variant,
      title: state.title,
      description: state.description,
      onAction: state.onAction,
      onOpenChange,
    },
  };
}
