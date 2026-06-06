import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollTextIcon } from "lucide-react";
import {
  fetchRecordLogs,
  type LogEntity,
  type SystemLog,
  type SystemLogAction,
} from "@/api/system-logs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RecordLogDialogProps {
  entity: LogEntity;
  recordId: number;
}

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Criação",
  UPDATE: "Alteração",
  DELETE: "Exclusão",
  RESTORE: "Restauração",
};

const ACTION_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  RESTORE: "outline",
};

function actionLabel(action: SystemLogAction): string {
  return ACTION_LABELS[action] ?? action;
}

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTimeFormatter.format(date);
}

export function RecordLogDialog({ entity, recordId }: RecordLogDialogProps) {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["system-logs", entity, recordId],
    queryFn: () => fetchRecordLogs(entity, recordId),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ScrollTextIcon className="size-4" />
          <span className="underline">Log do registro #{recordId}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Log do registro #{recordId}</DialogTitle>
          <DialogDescription>
            Histórico de alterações deste registro.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Spinner className="size-4" />
            Carregando logs...
          </div>
        )}

        {isError && (
          <div className="py-10 text-center text-sm text-destructive">
            Não foi possível carregar os logs deste registro.
          </div>
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Nenhum log encontrado para este registro.
          </div>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <ScrollArea className="max-h-[60vh] pr-4">
            <ul className="space-y-3">
              {data.map((log) => (
                <LogEntryItem key={log.id} log={log} />
              ))}
            </ul>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LogEntryItem({ log }: { log: SystemLog }) {
  const metadataEntries = log.metadata ? Object.entries(log.metadata) : [];

  return (
    <li className="rounded-md border p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <Badge variant={ACTION_VARIANTS[log.action] ?? "outline"}>
          {actionLabel(log.action)}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatDateTime(log.created_at)}
        </span>
      </div>

      <dl className="mt-2 space-y-1 text-muted-foreground">
        <div className="flex gap-2">
          <dt className="font-medium text-foreground">Entidade:</dt>
          <dd>
            {log.entity_name}
            {log.entity_id != null ? ` #${log.entity_id}` : ""}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-foreground">Usuário:</dt>
          <dd>
            {log.user?.name ??
              (log.user_id != null ? `#${log.user_id}` : "Sistema")}
          </dd>
        </div>
        {metadataEntries.length > 0 && (
          <div className="flex gap-2">
            <dt className="font-medium text-foreground">Detalhes:</dt>
            <dd className="break-all">
              {metadataEntries
                .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                .join(", ")}
            </dd>
          </div>
        )}
      </dl>
    </li>
  );
}
