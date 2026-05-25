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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

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
                          <Link
                            to={item.href}
                            activeProps={{ className: "bg-sidebar-accent" }}
                          >
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
                {/*
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.avatar} />
                  <AvatarFallback className="rounded-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.role}</span>
                </div>
                */}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar };
