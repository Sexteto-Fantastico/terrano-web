import * as React from "react";
import { SearchIcon, ChevronRight } from "lucide-react";
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { MENU_DATA, type MenuGroup } from "./menu-data";

export function SidebarMenuList() {
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
    <>
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
    </>
  );
}
