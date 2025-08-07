"use client";

import { SessionProvider, useSession } from "@/contexts/session-context";
import MainSidebar from "@/components/main-sidebar";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";

function LayoutWithEmotion({ children }: { children: React.ReactNode }) {
  const { lastEmotion } = useSession();
  
  return (
    <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
            <MainSidebar />
        </Sidebar>
        <SidebarInset data-emotion={lastEmotion} className="transition-colors duration-1000">
            {children}
        </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LayoutWithEmotion>{children}</LayoutWithEmotion>
    </SessionProvider>
  );
}
