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
  questionFormat: z
    .enum(['MCQs', 'Fill in the Blanks', 'Theoretical'])
    .describe('The desired format for the generated interview questions.'),
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
  prompt: `You are an expert interview question generator.

  Based on the provided resume and the selected skills, generate a list of 15 interview questions in the specified format, categorized by difficulty.
  
  You MUST generate exactly 5 easy, 5 medium, and 5 hard questions.

  Resume: {{media url=resumeDataUri}}
  Skills: {{{skills}}}
  Question Format: {{{questionFormat}}}

  The questions should be relevant to the resume and skills, and designed to assess the candidate's knowledge and experience.
  
  If the requested format is "MCQs" (Multiple Choice Questions), you MUST provide a question with at least 4 distinct options, where one is correct. Format them clearly as a question followed by options (e.g., A, B, C, D).

  If the requested format is "Fill in the Blanks", you MUST create a sentence where a key term or concept is replaced by '________'. For example: "In React, the '________' hook is used to manage state in a functional component."

  If the requested format is "Theoretical", provide a standard theoretical question.

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
