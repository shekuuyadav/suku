
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

// Helper function to handle retries with exponential backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, initialDelay = 1000): Promise<T> {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      // Check for specific retryable error codes (e.g., 429, 503) or generic network errors
      const isRetryable = error.status === 429 || error.status === 503 || error.code === 'ECONNRESET';
      
      if (isRetryable && i < retries - 1) {
        console.log(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Rethrow if not retryable or max retries reached
      }
    }
  }
  // This line should not be reachable, but is required for type safety
  throw new Error("Max retries reached");
}


export async function getVioResponse(
  userInput: string,
  environmentalCues: string
): Promise<Message> {
    return retryWithBackoff(async () => {
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
    });
}

export async function regenerateResponseAction(userInput: string): Promise<Message | { error: string }> {
    try {
        return await getVioResponse(userInput, "Calm, indoor setting");
    } catch (error) {
        console.error("Error regenerating response:", getErrorMessage(error));
        return { error: "The system is temporarily busy. Please try again in a moment." };
    }
}

export async function generateAvatarAction(
  interactionHistory: string
): Promise<{ avatarDataUri: string } | { error: string }> {
  try {
    if (!interactionHistory.trim()) {
        return { error: "I need some conversation history to generate an avatar. Let's chat first!" };
    }
    const response = await retryWithBackoff(() => generateAvatar({ interactionHistory }));
    return { avatarDataUri: response.avatarDataUri };
  } catch (error) {
    console.error("Error generating avatar:", getErrorMessage(error));
    return { error: "The avatar generator is temporarily busy. Please try again in a moment." };
  }
}

export async function getVioResponseAction(
    userInput: string,
    environmentalCues: string
): Promise<Message | { error: string }> {
    try {
        return await getVioResponse(userInput, environmentalCues);
    } catch (error) {
        console.error("Error getting Suku's response:", getErrorMessage(error));
        return { error: "The system is temporarily busy. Please try again in a moment." };
    }
}
