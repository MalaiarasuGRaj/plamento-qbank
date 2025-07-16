'use server';

import {
  generateInterviewQuestions,
  type GenerateInterviewQuestionsInput,
  type GenerateInterviewQuestionsOutput,
} from '@/ai/flows/generate-interview-questions';

export async function getInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<{
  success: boolean;
  questions?: GenerateInterviewQuestionsOutput;
  error?: string;
}> {
  try {
    const output = await generateInterviewQuestions(input);
    return { success: true, questions: output };
  } catch (error: any) {
    console.error('Error generating questions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      success: false,
      error: `Failed to generate interview questions. ${errorMessage}`,
    };
  }
}
