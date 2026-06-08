import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserIcon, AlignLeftIcon, ArrowRightIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  STOCK_REQUISITION_STATUS_LABELS,
  fetchStockRequisitionById,
  updateStockRequisitionStatus,
  type StockRequisitionStatus,
} from "@/api/stock-requisition";

const STATUS_COLORS: Record<StockRequisitionStatus, string> = {
  PENDING: "bg-yellow-500",
  CANCELLED: "bg-red-500",
  DENIED: "bg-red-500",
  APPROVED: "bg-green-500",
  WAITING_PURCHASE: "bg-orange-500",
  WAITING_ARRIVAL: "bg-orange-400",
  FINISHED: "bg-emerald-500",
};

const STATUS_BADGE_CLASS: Record<StockRequisitionStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  DENIED: "bg-red-100 text-red-800",
  APPROVED: "bg-green-100 text-green-800",
  WAITING_PURCHASE: "bg-orange-100 text-orange-800",
  WAITING_ARRIVAL: "bg-orange-100 text-orange-800",
  FINISHED: "bg-emerald-100 text-emerald-800",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requisitionId: number;
}

export function StockRequisitionHistoryDialog({
  open,
  onOpenChange,
  requisitionId,
}: Props) {
  const queryClient = useQueryClient();

  const [newStatus, setNewStatus] = useState<StockRequisitionStatus | "">("");
  const [justification, setJustification] = useState("");

  const { data: requisition } = useQuery({
    queryKey: ["stock-requisition", requisitionId],
    queryFn: () => fetchStockRequisitionById(requisitionId),
    enabled: open && !!requisitionId,
  });

  const currentStatus = requisition?.status;
  const logs = requisition?.statusLogs ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: () =>
      updateStockRequisitionStatus(requisitionId, {
        status: newStatus as StockRequisitionStatus,
        changeJustification: justification || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["stock-requisition", requisitionId] });
      setNewStatus("");
      setJustification("");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Histórico da solicitação{" "}
            <span className="text-primary">#{requisitionId}</span>
          </DialogTitle>
          <DialogDescription>
            Visualize e altere o status da solicitação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 border rounded-md p-3">
          <p className="text-sm font-medium">Alterar status</p>

          <Select
            value={newStatus}
            onValueChange={(v) => setNewStatus(v as StockRequisitionStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o novo status" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(STOCK_REQUISITION_STATUS_LABELS) as StockRequisitionStatus[])
                .filter((s) => s !== currentStatus)
                .map((s) => (
                  <SelectItem key={s} value={s}>
                    {STOCK_REQUISITION_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Justificativa (opcional)"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={2}
          />

          <Button
            className="w-full"
            disabled={!newStatus || updateStatusMutation.isPending}
            onClick={() => updateStatusMutation.mutate()}
          >
            Confirmar
          </Button>
        </div>

        <div className="relative mt-2">
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

          <div className="space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className="relative mt-1 flex-shrink-0">
                  <div
                    className={`h-4 w-4 rounded-full ${STATUS_COLORS[log.currentStatus]}`}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {log.previousStatus && (
                      <>
                        <Badge className={STATUS_BADGE_CLASS[log.previousStatus]}>
                          {STOCK_REQUISITION_STATUS_LABELS[log.previousStatus]}
                        </Badge>
                        <ArrowRightIcon className="h-3 w-3 text-muted-foreground" />
                      </>
                    )}
                    <Badge className={STATUS_BADGE_CLASS[log.currentStatus]}>
                      {STOCK_REQUISITION_STATUS_LABELS[log.currentStatus]}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <UserIcon className="h-3.5 w-3.5" />
                    <span>
                      {new Date(log.createdAt).toLocaleDateString("pt-BR")}{" "}
                      {new Date(log.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {log.changeJustification && (
                    <div className="flex items-start gap-1.5 rounded-md bg-muted px-3 py-2 text-sm">
                      <AlignLeftIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                      <span>{log.changeJustification}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum histórico encontrado.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}