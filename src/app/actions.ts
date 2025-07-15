'use server';

import { generateInterviewQuestions, type GenerateInterviewQuestionsInput, type GenerateInterviewQuestionsOutput } from '@/ai/flows/generate-interview-questions';

export async function getInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<{ success: boolean; questions?: GenerateInterviewQuestionsOutput; error?: string; }> {
  try {
    const output = await generateInterviewQuestions(input);
    return { success: true, questions: output };
  } catch (error) {
    console.error('Error generating questions:', error);
    return { success: false, error: 'Failed to generate interview questions. Please try again later.' };
  }
}
