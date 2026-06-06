import { createContext, useContext, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CancelButton } from "@/components/button/cancel-button";
import { SaveButton } from "@/components/button/save-button";
import { Header } from "@/components/header";
import { RecordLogDialog } from "@/components/views/record-log-dialog";
import type { LogEntity } from "@/api/system-logs";

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
  recordId?: number;
  logEntity?: LogEntity;
  active?: boolean;
  onActiveChange?: (value: boolean) => void;
}

export function CreateView({
  formId,
  children,
  recordId,
  logEntity,
  active,
  onActiveChange,
}: CreateViewProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  function goBack() {
    router.history.back();
  }

  const showActive = typeof onActiveChange === "function";
  const showLog = recordId != null && logEntity != null;

  return (
    <CreateViewContext.Provider value={{ goBack, isSaving, setIsSaving }}>
      <div className="flex h-screen flex-col p-4">
        <Header />
        <Separator className="my-4" />
        <div className="flex-1 overflow-auto">{children}</div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            {showActive && (
              <div className="flex items-center gap-2">
                <Switch
                  id="create-view-active"
                  checked={active}
                  onCheckedChange={onActiveChange}
                />
                <Label htmlFor="create-view-active">Ativo</Label>
              </div>
            )}
            {showLog && (
              <RecordLogDialog entity={logEntity} recordId={recordId} />
            )}
          </div>
          <div className="flex gap-3">
            <CancelButton onClick={goBack} />
            <SaveButton type="submit" form={formId} disabled={isSaving} />
          </div>
        </div>
      </div>
    </CreateViewContext.Provider>
  );
}
