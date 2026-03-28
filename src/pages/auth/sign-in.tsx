import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/field";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});

const signInSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  rememberMe: z.boolean(),
});

function SignInPage() {
  const signInForm = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Login realizado com sucesso");
      console.log(value);
    },
  });

  return (
    <div className="grid md:grid-cols-2 h-screen grid-cols-1">
      <aside className="bg-primary items-center justify-center md:flex hidden">
        <h1 className="text-4xl font-semibold text-primary-foreground">
          Terrano
        </h1>
      </aside>
      <div className="flex items-center justify-center p-6 w-full">
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
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </signInForm.Field>
              <div className="flex items-center justify-between">
                <signInForm.Field name="rememberMe">
                  {(field) => (
                    <Field orientation="horizontal">
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked === true)
                        }
                        aria-describedby={undefined}
                      />
                      <FieldLabel
                        htmlFor={field.name}
                        className="cursor-pointer font-normal"
                      >
                        Lembre de mim
                      </FieldLabel>
                    </Field>
                  )}
                </signInForm.Field>
                <Link to={"/"}>Esqueci minha senha</Link>
              </div>
            </FieldGroup>

            <Button type="submit" form="sign-in-form" className="w-full">
              Entrar
            </Button>
          </FieldSet>
        </form>
      </div>
    </div>
  );
}
