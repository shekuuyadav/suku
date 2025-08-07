
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, UserCircle, MessageSquare } from "lucide-react";
import { useSession } from "@/contexts/session-context";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SukuLogo } from "./suku-logo";

export default function MainSidebar() {
  const pathname = usePathname();
  const { avatarUrl } = useSession();

  const menuItems = [
    { href: "/", label: "Chat", icon: MessageSquare },
    { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
  ];

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <SukuLogo className="size-8" />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold">Suku</h2>
            <p className="text-xs text-muted-foreground">Companion</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/profile" className="w-full">
              <SidebarMenuButton
                isActive={pathname === "/profile"}
                tooltip={{ children: "Profile" }}
              >
                <Avatar className="size-6">
                  <AvatarImage src={avatarUrl} alt="User Avatar" />
                  <AvatarFallback>
                    <UserCircle />
                  </AvatarFallback>
                </Avatar>
                <span>Your Profile</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
