"use server";

import { modelHumanEmotions } from "@/ai/flows/model-human-emotions";
import { understandEmotionalState } from "@/ai/flows/understand-emotional-state";
import { generateAvatar } from "@/ai/flows/generate-avatar";
import type { Message } from "@/lib/types";

export async function getVioResponse(
  userInput: string,
  environmentalCues: string
): Promise<Message> {
  try {
    const [vioResponse, emotionalState] = await Promise.all([
      modelHumanEmotions({ userInput }),
      understandEmotionalState({ userInput, environmentalCues }),
    ]);

    return {
      id: crypto.randomUUID(),
      text: vioResponse.emotionalResponse,
      isUser: false,
      emotion: {
        emotionalState: emotionalState.emotionalState,
        confidenceLevel: emotionalState.confidenceLevel,
        reason: emotionalState.reason,
      },
    };
  } catch (error) {
    console.error("Error getting Vio's response:", error);
    return {
      id: crypto.randomUUID(),
      text: "I'm having trouble processing that right now. Could we talk about something else?",
      isUser: false,
    };
  }
}

export async function generateAvatarAction(
  interactionHistory: string
): Promise<{ avatarDataUri: string } | { error: string }> {
  try {
    if (!interactionHistory.trim()) {
        return { error: "I need some conversation history to generate an avatar. Let's chat first!" };
    }
    const response = await generateAvatar({ interactionHistory });
    return { avatarDataUri: response.avatarDataUri };
  } catch (error) {
    console.error("Error generating avatar:", error);
    return { error: "Sorry, I was unable to generate an avatar. Please try again." };
  }
}
