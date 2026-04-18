import { Header } from "../header";
import { Separator } from "../ui/separator";

interface DataViewProps {
  children?: React.ReactNode;
}

export function DataView({ children }: DataViewProps) {
  return (
    <div className="flex h-screen flex-col p-4">
      <Header />
      <Separator className="my-2" />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
