import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { z } from "zod";

import { CreateView } from "@/components/views/create-view";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { useFeedbackDialog } from "@/hooks/use-feedback-dialog";
import { getApiErrorMessage } from "@/lib/errors";

import { SupplierForm } from "./-components/supplier-form";

import {
  fetchSupplierById,
  updateSupplier,
} from "@/api/supplier";

export const Route = createFileRoute(
  "/_app/supplier/edit"
)({
  component: SupplierEditPage,

  validateSearch: z.object({
    id: z.string().min(1),
  }),

  head: () => ({
    meta: [
      {
        title:
          "Editar Fornecedor",
      },
    ],
  }),
});

function SupplierEditPage() {
  const search = useSearch({
    from: "/_app/supplier/edit",
  });

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const feedback =
    useFeedbackDialog();

  const supplierQuery =
    useQuery({
      queryKey: [
        "supplier",
        search.id,
      ],

      queryFn: () =>
        fetchSupplierById(
          Number(search.id)
        ),

      enabled:
        Boolean(search.id),
    });

  const updateMutation =
    useMutation({
      mutationFn:
        updateSupplier,

      onSuccess:
        async () => {
          await queryClient.invalidateQueries(
            {
              queryKey: [
                "suppliers",
              ],
            }
          );

          await queryClient.invalidateQueries(
            {
              queryKey: [
                "supplier",
                search.id,
              ],
            }
          );

          await queryClient.refetchQueries(
            {
              queryKey: [
                "supplier",
                search.id,
              ],
            }
          );

          feedback.success(
            "Fornecedor atualizado com sucesso!",
            () =>
              navigate({
                to: "/supplier",
              })
          );
        },

      onError: (error) => {
        feedback.error(
          getApiErrorMessage(error)
        );
      },
    });

  if (!search.id) {
    return (
      <div>
        Fornecedor inválido
      </div>
    );
  }

  if (
    supplierQuery.isLoading
  ) {
    return (
      <div>
        Carregando...
      </div>
    );
  }

  if (
    !supplierQuery.data
  ) {
    return (
      <div>
        Fornecedor não encontrado
      </div>
    );
  }

  return (
    <CreateView formId="supplier-form">
      <SupplierForm
        key={
          supplierQuery.data.id
        }
        initialValues={{
          corporateName:
            supplierQuery.data
              .corporateName,

          tradeName:
            supplierQuery.data
              .tradeName,

          cnpj:
            supplierQuery.data
              .cnpj,

          email:
            supplierQuery.data
              .email,

          phone:
            supplierQuery.data
              .phone,
        }}
        onSubmit={async (
          values
        ) => {
          await updateMutation.mutateAsync(
            {
              id:
                supplierQuery
                  .data.id,

              corporateName:
                values.corporateName,

              tradeName:
                values.tradeName,

              cnpj:
                values.cnpj,

              email:
                values.email,

              phone:
                values.phone,
            }
          );
        }}
      />

      <FeedbackDialog
        {...feedback.props}
      />
    </CreateView>
  );
}