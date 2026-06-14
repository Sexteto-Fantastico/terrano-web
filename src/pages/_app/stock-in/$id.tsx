import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchMovementEntryById, deleteMovementEntry, type MovementEntry } from "@/api/movement-entry";
import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MovementEntryCategoryBadge } from "./-components/movement-entry-category-badge";
import { MovementEntryReturnDialog } from "./-components/movement-entry-return-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_app/stock-in/$id")({
  component: StockInDetailPage,
  head: () => ({
    meta: [{ title: "Entrada de Estoque" }],
  }),
});

function StockInDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [inactivateOpen, setInactivateOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);

  const { data: entry, isLoading } = useQuery({
    queryKey: ["movement-entry", id],
    queryFn: () => fetchMovementEntryById(Number(id)),
  });

  async function handleInactivate() {
    try {
      await deleteMovementEntry(Number(id));
      toast.success("Entrada inativada com sucesso. O saldo foi revertido.");
      queryClient.invalidateQueries({ queryKey: ["movement-entry", id] });
      queryClient.invalidateQueries({ queryKey: ["movement-entries"] });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Erro ao inativar a entrada.";
      toast.error(message);
    } finally {
      setInactivateOpen(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col p-4">
        <Header />
        <Separator className="my-4" />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Carregando...
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex h-screen flex-col p-4">
        <Header />
        <Separator className="my-4" />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Entrada não encontrada.
        </div>
      </div>
    );
  }

  const hasReturns = (entry.items?.length ?? 0) > 0 && false; // returns tracked via API
  const total = (entry.items ?? []).reduce(
    (sum, item) => sum + item.quantity * (item.unitCost ?? 0),
    0
  );

  return (
    <div className="flex h-screen flex-col p-4">
      <Header />
      <Separator className="my-4" />

      <div className="flex-1 overflow-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">Entrada de Estoque #{entry.id}</h1>
            <Badge variant={entry.isActive ? "default" : "secondary"}>
              {entry.isActive ? "Ativo" : "Inativo"}
            </Badge>
            <MovementEntryCategoryBadge category={entry.entryMovementCategory} />
          </div>
          <div className="flex gap-2">
            {entry.isActive && (
              <>
                <Button variant="outline" onClick={() => setReturnDialogOpen(true)}>
                  Nova devolução
                </Button>
                <Button variant="destructive" onClick={() => setInactivateOpen(true)}>
                  Inativar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Dados gerais */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <h2 className="text-base font-semibold">Dados gerais</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
            <DetailField label="Data de entrega">
              {entry.entryDate
                ? new Date(entry.entryDate).toLocaleDateString("pt-BR")
                : "-"}
            </DetailField>
            <DetailField label="Estoque de destino">
              {entry.stockLocation?.name ?? "-"}
            </DetailField>
            <DetailField label="Fornecedor">
              {entry.purchase?.supplier?.tradeName ?? "-"}
            </DetailField>
            <DetailField label="NF">
              {[entry.purchase?.nfNumber, entry.purchase?.nfSerie]
                .filter(Boolean)
                .join(" / ") || "-"}
            </DetailField>
            {entry.purchase && (
              <DetailField label="Compra vinculada">
                <Link
                  to="/purchase"
                  className="text-primary underline"
                >
                  #{entry.purchase.id}
                </Link>
              </DetailField>
            )}
          </div>
          {entry.internalNotes && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-1">Anotações internas</p>
              <p className="text-sm whitespace-pre-wrap">{entry.internalNotes}</p>
            </div>
          )}
        </div>

        {/* Itens */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-base font-semibold">Itens da entrada</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-2 text-left font-medium">Produto</th>
                <th className="px-4 py-2 text-right font-medium">Quantidade</th>
                <th className="px-4 py-2 text-right font-medium">Custo unitário</th>
                <th className="px-4 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {(entry.items ?? []).map((item) => {
                const itemTotal = item.quantity * (item.unitCost ?? 0);
                return (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-2">{item.product?.name ?? "-"}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">
                      {(item.unitCost ?? 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {itemTotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t bg-muted/40">
                <td className="px-4 py-2 font-semibold" colSpan={3}>
                  Valor total
                </td>
                <td className="px-4 py-2 text-right font-semibold">
                  {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Seção de devoluções */}
        <ReturnsSection entry={entry} />
      </div>

      <AlertDialog open={inactivateOpen} onOpenChange={setInactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar Entrada de Estoque</AlertDialogTitle>
            <AlertDialogDescription>
              Ao inativar esta entrada, o saldo dos produtos será revertido. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleInactivate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {entry && (
        <MovementEntryReturnDialog
          open={returnDialogOpen}
          onOpenChange={setReturnDialogOpen}
          entry={entry}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["movement-entry", id] });
          }}
        />
      )}
    </div>
  );
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5">{children}</p>
    </div>
  );
}

function ReturnsSection({ entry }: { entry: MovementEntry }) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <h2 className="text-base font-semibold">Devoluções</h2>
      <p className="text-sm text-muted-foreground">Nenhuma devolução registrada.</p>
    </div>
  );
}
