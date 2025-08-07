
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
    const [sukuResponse, emotionalState] = await Promise.all([
      modelHumanEmotions({ userInput }),
      understandEmotionalState({ userInput, environmentalCues }),
    ]);

    return {
      id: crypto.randomUUID(),
      text: sukuResponse.emotionalResponse,
      isUser: false,
      emotion: {
        emotionalState: emotionalState.emotionalState,
        confidenceLevel: emotionalState.confidenceLevel,
        reason: emotionalState.reason,
      },
    };
  } catch (error) {
    console.error("Error getting Suku's response:", error);
    return {
      id: crypto.randomUUID(),
      text: "I'm having trouble processing that right now. Could we talk about something else?",
      isUser: false,
    };
  }
}

export async function regenerateResponseAction(userInput: string): Promise<Message | { error: string }> {
    try {
        return await getVioResponse(userInput, "Calm, indoor setting");
    } catch (error) {
        console.error("Error regenerating response:", error);
        return { error: "Sorry, I was unable to regenerate a response. Please try again." };
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
