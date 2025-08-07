
import ChatPanel from '@/components/chat-panel';

export default function ChatPage() {
  return (
    <main className="flex h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold font-headline">Conversation with Suku</h1>
        <p className="text-muted-foreground">What's on your mind today?</p>
      </header>
      <ChatPanel />
    </main>
  );
}
