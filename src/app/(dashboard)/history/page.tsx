
"use client";

import { useSession } from "@/contexts/session-context";
import ChatMessage from "@/components/chat-message";
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
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Card>
          <CardContent className="pt-6">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
