'use server';

/**
 * @fileOverview Generates a summary report of students with outstanding balances.
 *
 * - generateDebtorReport - A function that generates the debtor report.
 * - GenerateDebtorReportInput - The input type for the generateDebtorReport function.
 * - GenerateDebtorReportOutput - The return type for the generateDebtorReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDebtorReportInputSchema = z.object({
  month: z.string().describe('The month for which to generate the report (e.g., January 2024).'),
});
export type GenerateDebtorReportInput = z.infer<typeof GenerateDebtorReportInputSchema>;

const GenerateDebtorReportOutputSchema = z.object({
  report: z.string().describe('A summary report of students with outstanding balances.'),
});
export type GenerateDebtorReportOutput = z.infer<typeof GenerateDebtorReportOutputSchema>;

export async function generateDebtorReport(input: GenerateDebtorReportInput): Promise<GenerateDebtorReportOutput> {
  return generateDebtorReportFlow(input);
}

const generateDebtorReportPrompt = ai.definePrompt({
  name: 'generateDebtorReportPrompt',
  input: {schema: GenerateDebtorReportInputSchema},
  output: {schema: GenerateDebtorReportOutputSchema},
  prompt: `You are a financial analyst tasked with generating a summary report of students with outstanding balances for the month of {{{month}}}.

  Include students with significant debts, but use your discretion to exclude those with smaller debts if they are not relevant to the overall financial picture.

  Provide a concise and informative report that highlights the key financial issues related to student debt.
  Report:
  `,
});

const generateDebtorReportFlow = ai.defineFlow(
  {
    name: 'generateDebtorReportFlow',
    inputSchema: GenerateDebtorReportInputSchema,
    outputSchema: GenerateDebtorReportOutputSchema,
  },
  async input => {
    const {output} = await generateDebtorReportPrompt(input);
    return output!;
  }
);
