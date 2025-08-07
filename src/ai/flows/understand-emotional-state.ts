
'use server';

/**
 * @fileOverview A flow that analyzes user inputs and environmental cues to infer the user's emotional state.
 *
 * - understandEmotionalState - A function that handles the process of understanding the user's emotional state.
 * - UnderstandEmotionalStateInput - The input type for the understandEmotionalState function.
 * - UnderstandEmotionalStateOutput - The return type for the understandEmotionalState function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandEmotionalStateInputSchema = z.object({
  userInput: z.string().describe('The user input text.'),
  environmentalCues: z
    .string()
    .describe('Description of the environmental cues.'),
});
export type UnderstandEmotionalStateInput = z.infer<
  typeof UnderstandEmotionalStateInputSchema
>;

const UnderstandEmotionalStateOutputSchema = z.object({
  emotionalState: z
    .string()
    .describe('The inferred emotional state of the user.'),
  confidenceLevel: z
    .number()
    .describe('The confidence level of the emotional state inference (0-1).'),
  reason: z.string().describe('The reasoning behind the emotional state inference.'),
});
export type UnderstandEmotionalStateOutput = z.infer<
  typeof UnderstandEmotionalStateOutputSchema
>;

export async function understandEmotionalState(
  input: UnderstandEmotionalStateInput
): Promise<UnderstandEmotionalStateOutput> {
  return understandEmotionalStateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'understandEmotionalStatePrompt',
  input: {schema: UnderstandEmotionalStateInputSchema},
  output: {schema: UnderstandEmotionalStateOutputSchema},
  prompt: `You are Suku, an AI designed to understand human emotions.

  Analyze the user input and environmental cues to infer the user's emotional state.

  User Input: {{{userInput}}}
  Environmental Cues: {{{environmentalCues}}}

  Determine the emotional state of the user, provide a confidence level (0-1), and explain your reasoning.

  Format your response as a JSON object with "emotionalState", "confidenceLevel", and "reason" fields.`,
});

const understandEmotionalStateFlow = ai.defineFlow(
  {
    name: 'understandEmotionalStateFlow',
    inputSchema: UnderstandEmotionalStateInputSchema,
    outputSchema: UnderstandEmotionalStateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
