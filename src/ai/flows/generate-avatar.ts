
// src/ai/flows/generate-avatar.ts
'use server';
/**
 * @fileOverview A flow for generating personalized avatars based on user interaction history.
 *
 * - generateAvatar - A function that generates a personalized avatar for a user.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAvatarInputSchema = z.object({
  interactionHistory: z
    .string()
    .describe('The user interaction history with Suku.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
  avatarDataUri: z
    .string()
    .describe(
      "A data URI of the generated avatar image. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAvatarPrompt',
  input: {schema: GenerateAvatarInputSchema},
  output: {schema: GenerateAvatarOutputSchema},
  prompt: `You are an AI avatar generator. Based on the user's interaction history, generate a personalized avatar for them.

Interaction History: {{{interactionHistory}}}

Create a detailed and visually appealing avatar that reflects the user's personality and preferences as indicated in their interaction history. The avatar should be a digital image in data URI format.

Output the avatar as a data URI.`, 
});

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.interactionHistory,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Failed to generate avatar image.');
    }

    return {avatarDataUri: media.url};
  }
);
