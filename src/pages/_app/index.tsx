import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  CircleFadingPlusIcon,
  TrendingUpIcon,
  ArrowRightLeftIcon,
  FileTextIcon,
  UserCogIcon,
  BadgeAlertIcon,
  LayoutDashboardIcon,
} from "lucide-react";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Início",
      },
    ],
  }),
});

const QUICK_LINKS = [
  {
    title: "Cadastros",
    icon: CircleFadingPlusIcon,
    description: "Produtos, marcas, categorias e mais",
    href: "/product",
    permission: { resource: "PRODUCT", action: "read" },
  },
  {
    title: "Transações",
    icon: TrendingUpIcon,
    description: "Compras, entradas e saídas",
    href: "/purchase",
    permission: { resource: "PURCHASE", action: "read" },
  },
  {
    title: "Requisições",
    icon: ArrowRightLeftIcon,
    description: "Solicitações de material",
    href: "/stock-requisition",
    permission: { resource: "MATERIAL_REQUESTER", action: "read" },
  },
  {
    title: "Relatórios",
    icon: FileTextIcon,
    description: "Posicionamento de estoque",
    href: "/stock-positioning",
    permission: { resource: "STOCK_POSITION", action: "read" },
  },
  {
    title: "Controle de Acesso",
    icon: UserCogIcon,
    description: "Usuários e perfis",
    href: "/user",
    permission: { resource: "USER", action: "read" },
  },
  {
    title: "Alertas",
    icon: BadgeAlertIcon,
    description: "Notificações do sistema",
    href: "/alert",
    permission: { resource: "ALERT", action: "read" },
  },
];

function RouteComponent() {
  const { user, can: canAccess } = useAuth();

  const availableLinks = QUICK_LINKS.filter(
    (link) =>
      !link.permission ||
      canAccess(link.permission.resource, link.permission.action)
  );

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Bem-vindo, {user?.name ?? "usuário"}
          </h2>
          <p className="mt-1 text-muted-foreground">
            {user?.role?.name ? `Perfil: ${user.role.name}` : ""}
            {user?.role?.name && user?.department?.name ? " · " : ""}
            {user?.department?.name
              ? `Departamento: ${user.department.name}`
              : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableLinks.map((link) => (
            <Link key={link.title} to={link.href}>
              <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <link.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {canAccess("DASHBOARD", "read") && (
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <LayoutDashboardIcon className="size-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Dashboard Administrativo</p>
                <p className="text-sm text-muted-foreground">
                  Acesse métricas, indicadores e relatórios gerenciais
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Acessar
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
