"use client";

import { useMemo } from "react";
import { useSession } from "@/contexts/session-context";
import MoodChart from "./mood-chart";
import type { EmotionDataPoint } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function MoodDashboardClient() {
  const { messages } = useSession();

  const emotionData = useMemo(() => {
    const emotionCounts = new Map<string, number>();
    messages.forEach((msg) => {
      if (!msg.isUser && msg.emotion) {
        const state = msg.emotion.emotionalState;
        emotionCounts.set(state, (emotionCounts.get(state) || 0) + 1);
      }
    });

    return Array.from(emotionCounts.entries()).map(
      ([name, count]) => ({ name, count })
    );
  }, [messages]);

  return (
    <div>
      {emotionData.length > 0 ? (
        <Card>
            <CardHeader>
                <CardTitle>Session Emotion Analysis</CardTitle>
                <CardDescription>A summary of emotions detected during your conversation.</CardDescription>
            </CardHeader>
            <CardContent>
                <MoodChart data={emotionData} />
            </CardContent>
        </Card>
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
                <h3 className="text-lg font-semibold">No emotion data yet.</h3>
                <p className="text-muted-foreground">Start a conversation with Vio 3 to see your mood analysis here.</p>
            </div>
        </div>
      )}
    </div>
  );
}
