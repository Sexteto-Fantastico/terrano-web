import { Header } from "../header";
import { Separator } from "../ui/separator";

interface DataViewProps {
  children?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function DataView({ children, headerActions }: DataViewProps) {
  return (
    <div className="flex h-screen flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <Header children={headerActions} />
        <Separator className="mt-4 sm:mt-6 lg:mt-8" />
      </div>
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}

