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
import { useAuth } from "@/hooks/use-auth";
import { login } from "@/api/auth";

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInPage,
});

const signInSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

function SignInPage() {
  const { setToken, setMustResetPassword } = useAuth();
  const navigate = useNavigate();

  const signInForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await login(value);
        setToken(response.token, response.expiresAt);
        setMustResetPassword(response.mustResetPassword ?? false);
        toast.success("Login realizado com sucesso");
        if (response.mustResetPassword) {
          navigate({ to: "/define-password" });
        } else {
          navigate({ to: "/" });
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro ao fazer login";
        toast.error(message);
      }
    },
  });

  return (
    <form
      id="sign-in-form"
      className="w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        signInForm.handleSubmit();
      }}
    >
      <FieldSet className="space-y-4">
        <FieldLegend variant="legend">Entre com a sua conta</FieldLegend>
        <FieldDescription>
          Bem-vindo! Por favor, insira suas informações.
        </FieldDescription>
        <FieldGroup>
          <signInForm.Field name="email">
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
                  disabled={signInForm.state.isSubmitting}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </signInForm.Field>

          <signInForm.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  disabled={signInForm.state.isSubmitting}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </signInForm.Field>
        </FieldGroup>

        <Button
          type="submit"
          form="sign-in-form"
          className="w-full"
          disabled={signInForm.state.isSubmitting}
        >
          Entrar
        </Button>

        <Link to="/forgot-password">Esqueci minha senha</Link>
      </FieldSet>
    </form>
  );
}
