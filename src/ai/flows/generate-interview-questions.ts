'use server';

/**
 * @fileOverview Generates interview questions based on a resume and selected skills.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The candidate's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  skills: z
    .string()
    .describe(
      'A comma-separated list of skills to focus the interview questions on.'
    ),
});
export type GenerateInterviewQuestionsInput = z.infer<
  typeof GenerateInterviewQuestionsInputSchema
>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  easy: z
    .array(z.string())
    .describe('An array of 5 easy difficulty questions.'),
  medium: z
    .array(z.string())
    .describe('An array of 5 medium difficulty questions.'),
  hard: z
    .array(z.string())
    .describe('An array of 5 hard difficulty questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<
  typeof GenerateInterviewQuestionsOutputSchema
>;

export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {
    schema: GenerateInterviewQuestionsOutputSchema,
    format: 'json',
  },
  prompt: `You are an expert interview question generator for technical interviews.

  Based on the provided resume and the selected skills, generate a list of 15 theoretical interview questions, categorized by difficulty.
  
  You MUST generate exactly 5 easy, 5 medium, and 5 hard questions.

  - For the 5 "easy" questions, focus on foundational theoretical knowledge about the skills provided.
  - For the 5 "medium" questions, you MUST tailor them specifically to the experience, projects, or technologies mentioned in the provided resume.
  - For the 5 "hard" questions, focus on advanced, complex, or architectural theoretical knowledge about the skills provided.

  Resume: {{media url=resumeDataUri}}
  Skills: {{{skills}}}
  
  Return ONLY a JSON object with three keys: "easy", "medium", and "hard", where each key holds an array of 5 question strings.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const output = llmResponse.output;

    if (!output) {
      console.error('AI response was null or undefined.', {
        finishReason: llmResponse.finishReason,
        candidates: llmResponse.candidates,
      });
      throw new Error(
        `The AI failed to generate questions. Finish Reason: ${llmResponse.finishReason}`
      );
    }
    
    return output;
  }
);
