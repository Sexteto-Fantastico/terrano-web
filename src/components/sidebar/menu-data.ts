import type { LucideIcon } from "lucide-react";
import {
  CircleFadingPlusIcon,
  TrendingUpIcon,
  ArrowRightLeftIcon,
  FileTextIcon,
  UserCogIcon,
  BadgeAlertIcon,
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
}

export interface MenuGroup {
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
}

export const MENU_DATA: MenuGroup[] = [
  {
    title: "Cadastros",
    icon: CircleFadingPlusIcon,
    items: [
      { title: "Produto", href: "/product" },
      { title: "Marca", href: "/product-brand" },
      { title: "Categoria", href: "/category" },
      { title: "Unidade de Medida", href: "/unit" },
      { title: "Estoque", href: "/stock" },
      { title: "Fornecedor", href: "/supplier" },
      { title: "Departamento", href: "/department" },
      { title: "Centro de Custo", href: "/cost-center" },
    ],
  },
  {
    title: "Transações",
    icon: TrendingUpIcon,
    items: [
      { title: "Compra", href: "/purchase" },
      { title: "Entrada de Estoque", href: "/stock-in" },
      { title: "Saída de Estoque", href: "/stock-out" },
    ],
  },
  {
    title: "Requisições",
    icon: ArrowRightLeftIcon,
    items: [{ title: "Solicitação de Material", href: "/material-request" }],
  },
  {
    title: "Relatórios",
    icon: FileTextIcon,
    items: [{ title: "Relatórios", href: "/report" }],
  },
  {
    title: "Controle de Acesso",
    icon: UserCogIcon,
    items: [
      { title: "Usuário", href: "/user" },
      { title: "Perfil de Acesso", href: "/access-profile" },
    ],
  },
  {
    title: "Notificações",
    icon: BadgeAlertIcon,
    items: [{ title: "Alertas", href: "/alert" }],
  },
];
