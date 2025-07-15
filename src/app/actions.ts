'use server';

import { generateInterviewQuestions, type GenerateInterviewQuestionsInput } from '@/ai/flows/generate-interview-questions';

export async function getInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<{ success: boolean; questions?: string[]; error?: string; }> {
  try {
    const output = await generateInterviewQuestions(input);
    const allQuestions = [...output.easy, ...output.medium, ...output.hard];
    return { success: true, questions: allQuestions };
  } catch (error) {
    console.error('Error generating questions:', error);
    return { success: false, error: 'Failed to generate interview questions. Please try again later.' };
  }
}
