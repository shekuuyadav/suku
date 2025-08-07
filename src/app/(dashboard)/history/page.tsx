
"use client";

import { useSession } from "@/contexts/session-context";
import ChatMessage from "@/components/chat-message";
import ChatPanel from "@/components/chat-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export default function HistoryPage() {
  const { messages } = useSession();

  return (
    <main className="flex h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold font-headline">
          Conversation History
        </h1>
        <p className="text-muted-foreground">
          A log of your conversation with Suku.
        </p>
      </header>
      <ChatPanel />
    </main>
  );
}
