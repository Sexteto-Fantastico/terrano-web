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
  component: RouteComponent,
});

const signInSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean(),
});

function RouteComponent() {
  const signInForm = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onChange: signInSchema,
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
              <signInForm.Field
                name="email"
                children={(field) => (
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
              />

              <signInForm.Field
                name="password"
                children={(field) => (
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
              />

              <div className="grid grid-cols-2 gap-2">
                <signInForm.Field
                  name="rememberMe"
                  children={(field) => (
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
                />
                <div className="flex items-center justify-end">
                  <Link
                    to={"/auth/forgot-password"}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
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
