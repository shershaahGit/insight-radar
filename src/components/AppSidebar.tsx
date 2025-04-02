
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { 
  BarChart, 
  Home, 
  MessageSquare, 
  Settings, 
  Users, 
  FileText, 
  Database, 
  LogOut 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const { user, logout } = useAuth();

  // Define menu items based on user role
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Home,
      allowedRoles: ["admin", "manager", "analyst"],
    },
    {
      title: "Feedback",
      path: "/feedback",
      icon: MessageSquare,
      allowedRoles: ["admin", "manager", "analyst"],
    },
    {
      title: "Reports",
      path: "/reports",
      icon: BarChart,
      allowedRoles: ["admin", "manager", "analyst"],
    },
    {
      title: "Forms",
      path: "/forms",
      icon: FileText,
      allowedRoles: ["admin", "manager"],
    },
    {
      title: "Users",
      path: "/users",
      icon: Users,
      allowedRoles: ["admin"],
    },
    {
      title: "Data",
      path: "/data",
      icon: Database,
      allowedRoles: ["admin", "analyst"],
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
      allowedRoles: ["admin", "manager"],
    },
  ];

  // Filter items based on user role
  const filteredItems = user
    ? menuItems.filter((item) => item.allowedRoles.includes(user.role))
    : [];

  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-1 text-white">
            <BarChart size={18} />
          </div>
          <span className="font-semibold text-lg">FeedbackAI</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        isActive ? "text-primary" : ""
                      }
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-6 py-4">
        {user && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={logout}
            >
              <LogOut size={16} className="mr-2" />
              Log out
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
