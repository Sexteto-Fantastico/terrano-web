import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Link } from "@/components/ui/link";
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
import { forgotPassword } from "@/api/auth";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordPage,
});

const forgotPasswordSchema = z.object({
  email: z.email("Email inválido"),
});

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await forgotPassword(value);
        navigate({ to: "/check-email" });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao enviar link de redefinição";
        toast.error(message);
      }
    },
  });

  return (
    <form
      id="forgot-password-form"
      className="w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldSet className="space-y-4">
        <FieldLegend variant="legend">Esqueci minha senha</FieldLegend>
        <FieldDescription>
          Insira seu email e enviaremos um link para redefinir sua senha.
        </FieldDescription>
        <FieldGroup>
          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  disabled={form.state.isSubmitting}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <Button
          type="submit"
          form="forgot-password-form"
          className="w-full"
          disabled={form.state.isSubmitting}
        >
          Enviar link de redefinição
        </Button>

        <Link to="/sign-in">Voltar ao login</Link>
      </FieldSet>
    </form>
  );
}
