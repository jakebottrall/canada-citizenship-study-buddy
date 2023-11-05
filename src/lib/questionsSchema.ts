import z from 'zod';

export const questionsSchema = z.array(
	z.object({
		question: z.string(),
		answer: z.number(),
		reference: z.string().optional(),
		options: z.array(
			z.object({
				label: z.string(),
				value: z.number()
			})
		)
	})
);
