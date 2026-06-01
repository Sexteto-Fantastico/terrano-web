import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SidebarMenuList } from "./sidebar/menu-list";
import { SidebarUserFooter } from "./sidebar/user-footer";

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { user, isLoadingUser, logout } = useAuth();

  const handleLogout = React.useCallback(() => {
    logout();
    navigate({ to: "/sign-in" });
  }, [logout, navigate]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <span className="text-center text-2xl font-extrabold">Terrano</span>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenuList />
      </SidebarContent>
      <SidebarUserFooter
        user={user}
        isLoadingUser={isLoadingUser}
        onLogout={handleLogout}
      />
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar };
