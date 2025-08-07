import ChatPanel from '@/components/chat-panel';

export default function ChatPage() {
  return (
    <main className="flex h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold font-headline">Conversation with Vio 3</h1>
      </header>
      <ChatPanel />
    </main>
  );
}
