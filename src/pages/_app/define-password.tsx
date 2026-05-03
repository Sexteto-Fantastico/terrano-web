import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { useAuth } from "@/hooks/use-auth";
import { definePassword } from "@/api/auth";

export const Route = createFileRoute("/_app/define-password")({
  component: DefinePasswordPage,
});

const definePasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

function DefinePasswordPage() {
  const { setMustResetPassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: definePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        await definePassword({ password: value.password });
        setMustResetPassword(false);
        toast.success("Senha atualizada com sucesso");
        navigate({ to: "/" });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro ao atualizar senha";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex w-full items-center justify-center p-6">
      <form
        id="define-password-form"
        className="w-full max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldSet className="space-y-4">
          <FieldLegend variant="legend">Definir senha</FieldLegend>
          <FieldDescription>
            Você precisa definir uma nova senha para continuar.
          </FieldDescription>
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

          <Button type="submit" form="define-password-form" className="w-full" disabled={isSubmitting}>
            Definir senha
          </Button>
        </FieldSet>
      </form>
    </div>
  );
}
