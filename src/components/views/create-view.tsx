import { Separator } from "@/components/ui/separator.tsx";
import { Header } from "@/components/header";
import { CancelButton } from "../button/cancel-button";
import { SaveButton } from "../button/save-button";

interface CreateViewProps {
  children?: React.ReactNode;
}

export function CreateView({ children }: CreateViewProps) {
  return (
    <div className="flex h-screen flex-col p-4">
      <Header />
      <Separator className="my-4" />
      <div className="flex flex-1 flex-col">
        {children}

        <footer className="flex justify-end gap-3 border-t border-border px-8 py-4">
          <CancelButton />
          <SaveButton />
        </footer>
      </div>
    </div>
  );
}
