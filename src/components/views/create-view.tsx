import { createContext, useContext, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { CancelButton } from "@/components/button/cancel-button";
import { SaveButton } from "@/components/button/save-button";
import { Header } from "@/components/header";

interface CreateViewContextValue {
  goBack: () => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
}

const CreateViewContext = createContext<CreateViewContextValue | null>(null);

export function useCreateView() {
  const ctx = useContext(CreateViewContext);
  if (!ctx) throw new Error("useCreateView must be used inside CreateView");
  return ctx;
}

interface CreateViewProps {
  formId: string;
  children: React.ReactNode;
}

export function CreateView({ formId, children }: CreateViewProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  function goBack() {
    router.history.back();
  }

  return (
    <CreateViewContext.Provider value={{ goBack, isSaving, setIsSaving }}>
      <div className="flex h-screen flex-col p-4">
        <Header />
        <Separator className="my-4" />
        <div className="flex-1 overflow-auto">{children}</div>
        <Separator className="my-4" />
        <div className="flex justify-end gap-3">
          <CancelButton onClick={goBack} />
          <SaveButton type="submit" form={formId} disabled={isSaving} />
        </div>
      </div>
    </CreateViewContext.Provider>
  );
}
