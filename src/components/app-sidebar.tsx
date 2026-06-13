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
  LogOutIcon,
  UploadCloudIcon,
  ChevronsUpDown,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { uploadAvatar } from "@/api/users";

interface MenuItem {
  title: string;
  href: string;
  permission?: { resource: string; action: string };
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
      { title: "Produto", href: "/product", permission: { resource: "PRODUCT", action: "read" } },
      { title: "Marca", href: "/product-brand", permission: { resource: "PRODUCT_BRAND", action: "read" } },
      { title: "Categoria", href: "/category", permission: { resource: "PRODUCT_CATEGORY", action: "read" } },
      { title: "Unidade de Medida", href: "/unit", permission: { resource: "MEASUREMENT_UNIT", action: "read" } },
      { title: "Estoque", href: "/stock-location", permission: { resource: "STOCK_LOCATION", action: "read" } },
      { title: "Fornecedor", href: "/supplier", permission: { resource: "SUPPLIER", action: "read" } },
      { title: "Departamento", href: "/department", permission: { resource: "DEPARTMENT", action: "read" } }
    ],
  },
  {
    title: "Transações",
    icon: TrendingUpIcon,
    items: [
      { title: "Compra", href: "/purchase", permission: { resource: "PURCHASE", action: "read" } },
      { title: "Entrada de Estoque", href: "/stock-in", permission: { resource: "MOVEMENT_ENTRY", action: "read" } },
      { title: "Saída de Estoque", href: "/stock-out", permission: { resource: "MOVEMENT_EXIT", action: "read" } },
    ],
  },
  {
    title: "Requisições",
    icon: ArrowRightLeftIcon,
    items: [{ title: "Solicitação de Material", href: "/stock-requisition", permission: { resource: "MATERIAL_REQUESTER", action: "read" } }],
  },
  {
    title: "Relatórios",
    icon: FileTextIcon,
    items: [
      { title: "Posicionamento de estoque", href: "/stock-positioning", permission: { resource: "STOCK_POSITION", action: "read" } },
    ],
  },
  {
    title: "Controle de Acesso",
    icon: UserCogIcon,
    items: [
      { title: "Usuário", href: "/user", permission: { resource: "USER", action: "read" } },
      { title: "Perfil de Acesso", href: "/access-profile", permission: { resource: "USER", action: "read" } },
    ],
  },
  {
    title: "Notificações",
    icon: BadgeAlertIcon,
    items: [{ title: "Alertas", href: "/alert", permission: { resource: "ALERT", action: "read" } }],
  },
];

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, setOpen } = useSidebar();
  const { user, updateUser, logout, isLoggingOut, can: canAccess } = useAuth();
  const [filter, setFilter] = React.useState("");
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(MENU_DATA.map((group) => [group.title, true]))
  );
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const updatedUser = await uploadAvatar(user.id, file);
      updateUser(updatedUser);
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar avatar:", error);
      toast.error("Erro ao atualizar foto de perfil. Tente novamente.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const visibleGroups = React.useMemo(() => {
    return MENU_DATA
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          !item.permission || canAccess(item.permission.resource, item.permission.action)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [canAccess]);

  const filteredGroups = React.useMemo(() => {
    if (!filter.trim()) {
      return visibleGroups;
    }

    const lowerFilter = filter.toLowerCase();

    return visibleGroups.map((group) => {
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
  }, [filter, visibleGroups]);

  const serverBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

  const avatarUrl = user?.profilePicture 
    ? `${serverBaseUrl}${user.profilePicture}` 
    : undefined;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="relative flex h-16 items-center justify-center overflow-hidden">
        <Link to="/">
          <span className="text-2xl font-extrabold whitespace-nowrap transition-all duration-200 ease-linear group-data-[collapsible=icon]:scale-0 group-data-[collapsible=icon]:opacity-0">
          Terrano
        </span>
        <span className="absolute text-3xl font-extrabold transition-all duration-200 ease-linear scale-0 opacity-0 group-data-[collapsible=icon]:scale-100 group-data-[collapsible=icon]:opacity-100">
          T
        </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <div className="p-2 transition-all duration-200 ease-linear group-data-[collapsible=icon]:hidden overflow-hidden">
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
        <SidebarMenu>
          {filteredGroups.map((group) => (
            <Collapsible
              key={group.title}
              open={openGroups[group.title]}
              onOpenChange={(isOpen) =>
                setOpenGroups((prev) => ({ ...prev, [group.title]: isOpen }))
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={group.title}
                    onClick={(e) => {
                      if (!open) {
                        e.preventDefault();
                        setOpen(true);
                        setOpenGroups((prev) => ({ ...prev, [group.title]: true }));
                      }
                    }}
                  >
                    <group.icon className="shrink-0" />
                    <span className="truncate transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-0">{group.title}</span>
                    <ChevronRight className="ml-auto shrink-0 transition-all duration-200 ease-linear group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:opacity-0" />
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
                            <span className="truncate">{item.title}</span>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    disabled={isUploading || isLoggingOut}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                  >
                    <div className="relative h-8 w-8 rounded-lg overflow-hidden shrink-0">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={avatarUrl}
                          alt={user?.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-lg text-xs font-semibold">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Spinner className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-medium">
                        {isLoggingOut ? "Saindo..." : user?.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {isLoggingOut ? "" : user?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:hidden" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={avatarUrl} alt={user?.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg text-xs font-semibold">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user?.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAvatarClick} disabled={isUploading}>
                    <UploadCloudIcon className="mr-2 h-4 w-4" />
                    <span>Alterar foto de perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar };
