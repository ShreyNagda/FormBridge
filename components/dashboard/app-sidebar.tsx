"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, FileText, LayoutDashboard, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Logo } from "../logo";

interface AppSidebarProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Forms",
      url: "/dashboard/forms",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Documentation",
      url: "/docs?callback=dashboard",
      icon: BookText,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex h-14 items-center justify-center border-b px-4 py-2">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 font-semibold w-full"
        >
          <div className="flex items-center justify-center shrink-0">
            <Logo />
          </div>
          <span className="text-lg text-foreground group-data-[collapsible=icon]:hidden">
            StaticSend
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.endsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="w-full justify-start"
                >
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t px-2! py-2">
        <UserMenu user={user} showName={true} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
