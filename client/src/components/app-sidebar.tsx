import * as React from "react"
import {
  Activity,
  ClipboardList,
  History,
  UserPlus,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

const navItems = [
  {
    title: "Queue Status",
    icon: Activity,
    page: "status",
  },
  {
    title: "Join Queue",
    icon: UserPlus,
    page: "join",
  },
  {
    title: "History",
    icon: History,
    page: "history",
  },
]

export function AppSidebar({ activePage = "status", onNavigate, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[slot=sidebar-menu-button]:!p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-lg font-semibold">Bathroom Queue</span>
                  <span className="text-xs text-muted-foreground">Management System</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.page}>
              <SidebarMenuButton
                onClick={() => onNavigate?.(item.page)}
                isActive={activePage === item.page}
                tooltip={item.title}
                className="w-full"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full">
              <div className="flex flex-col gap-1 text-left text-sm leading-tight">
                <span className="text-xs text-muted-foreground">Current User</span>
                <span className="font-semibold truncate">Guest User</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
