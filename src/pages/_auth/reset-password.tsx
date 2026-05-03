import { useState } from "react";
import {
  createFileRoute,
  useSearch,
  useNavigate,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/field";
import { resetPassword } from "@/api/auth";

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: z.object({
    token: z.string().min(1, "Token de redefinição é obrigatório"),
  }),
  component: ResetPasswordPage,
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

function ResetPasswordPage() {
  const search = useSearch({ from: "/_auth/reset-password" });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        await resetPassword({ token: search.token, password: value.password });
        toast.success("Senha redefinida com sucesso");
        navigate({ to: "/sign-in" });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro ao redefinir senha";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      id="reset-password-form"
      className="w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldSet className="space-y-4">
        <FieldLegend variant="legend">Redefinir senha</FieldLegend>
        <FieldDescription>Insira sua nova senha.</FieldDescription>
        <FieldGroup>
          <form.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Nova senha</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  disabled={isSubmitting}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Confirmar senha</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  disabled={isSubmitting}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <Button type="submit" form="reset-password-form" className="w-full" disabled={isSubmitting}>
          Redefinir senha
        </Button>
      </FieldSet>
    </form>
  );
}
