
"use server";

import { modelHumanEmotions } from "@/ai/flows/model-human-emotions";
import { understandEmotionalState } from "@/ai/flows/understand-emotional-state";
import { generateAvatar } from "@/ai/flows/generate-avatar";
import type { Message } from "@/lib/types";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
}

export async function getVioResponse(
  userInput: string,
  environmentalCues: string
): Promise<Message> {
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
}

export async function regenerateResponseAction(userInput: string): Promise<Message | { error: string }> {
    try {
        return await getVioResponse(userInput, "Calm, indoor setting");
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Error regenerating response:", errorMessage);
        return { error: `Sorry, I was unable to regenerate a response. Reason: ${errorMessage}` };
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
    const errorMessage = getErrorMessage(error);
    console.error("Error generating avatar:", errorMessage);
    return { error: `Sorry, I was unable to generate an avatar. Reason: ${errorMessage}` };
  }
}

export async function getVioResponseAction(
    userInput: string,
    environmentalCues: string
): Promise<Message | { error: string }> {
    try {
        return await getVioResponse(userInput, environmentalCues);
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Error getting Suku's response:", errorMessage);
        return { error: `I'm having trouble processing that right now. Reason: ${errorMessage}` };
    }
}
