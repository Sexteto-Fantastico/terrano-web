import * as React from "react";
import {
  SearchIcon,
  type LucideIcon,
  CircleFadingPlusIcon,
  TrendingUpIcon,
  ArrowRightLeftIcon,
  FileTextIcon,
  UserCogIcon,
  BadgeAlertIcon,
  ChevronRight,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface MenuItem {
  title: string;
  href: string;
}

interface MenuGroup {
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
}

const MENU_DATA: MenuGroup[] = [
  {
    title: "Cadastros",
    icon: CircleFadingPlusIcon,
    items: [
      { title: "Produto", href: "/produto" },
      { title: "Marca", href: "/marca" },
      { title: "Categoria", href: "/categoria" },
      { title: "Unidade de Medida", href: "/unidade-medida" },
      { title: "Estoque", href: "/estoque" },
      { title: "Fornecedor", href: "/fornecedor" },
      { title: "Departamento", href: "/departamento" },
      { title: "Centro de Custo", href: "/centro-custo" },
    ],
  },
  {
    title: "Transações",
    icon: TrendingUpIcon,
    items: [
      { title: "Compra", href: "/compra" },
      { title: "Entrada de Estoque", href: "/entrada-estoque" },
      { title: "Saída de Estoque", href: "/saida-estoque" },
    ],
  },
  {
    title: "Requisições",
    icon: ArrowRightLeftIcon,
    items: [
      { title: "Solicitação de Material", href: "/solicitacao-material" },
    ],
  },
  {
    title: "Relatórios",
    icon: FileTextIcon,
    items: [{ title: "Relatórios", href: "/relatorio" }],
  },
  {
    title: "Controle de Acesso",
    icon: UserCogIcon,
    items: [
      { title: "Usuário", href: "/usuario" },
      { title: "Perfil de Acesso", href: "/perfil-acesso" },
    ],
  },
  {
    title: "Notificações",
    icon: BadgeAlertIcon,
    items: [{ title: "Alertas", href: "/alerta" }],
  },
];

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const [filter, setFilter] = React.useState("");
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(MENU_DATA.map((group) => [group.title, true]))
  );

  const filteredGroups = React.useMemo(() => {
    if (!filter.trim()) {
      return MENU_DATA;
    }

    const lowerFilter = filter.toLowerCase();

    return MENU_DATA.map((group) => {
      const matchesGroup = group.title.toLowerCase().includes(lowerFilter);
      const filteredItems = group.items.filter((item) =>
        item.title.toLowerCase().includes(lowerFilter)
      );

      if (matchesGroup) {
        return { ...group, items: group.items };
      }

      if (filteredItems.length > 0) {
        return { ...group, items: filteredItems };
      }

      return null;
    }).filter((group): group is MenuGroup => group !== null);
  }, [filter]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <span className="text-center text-2xl font-extrabold">Terrano</span>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {open && (
          <div className="p-2">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Filtrar menu..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </InputGroup>
          </div>
        )}
        <SidebarMenu>
          {filteredGroups.map((group) => (
            <Collapsible
              key={group.title}
              defaultOpen={openGroups[group.title]}
              onOpenChange={(open) =>
                setOpenGroups((prev) => ({ ...prev, [group.title]: open }))
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={group.title}>
                    <group.icon />
                    <span>{group.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {group.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <Link to={item.href}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}

          {filteredGroups.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado
            </div>
          )}
        </SidebarMenu>

        <SidebarFooter className="mt-auto border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{"a"}</span>
                  <span className="truncate text-xs">{"a"}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

export { AppSidebar };
