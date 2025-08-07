
import MoodDashboardClient from "@/components/mood-dashboard-client";

export default function DashboardPage() {
  return (
    <main className="flex h-screen flex-col">
        <header className="border-b p-4">
            <h1 className="text-xl font-semibold font-headline">Your Mood Dashboard</h1>
            <p className="text-muted-foreground">Suku's analysis of your recent emotional states.</p>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
            <MoodDashboardClient />
        </div>
    </main>
  );
}
