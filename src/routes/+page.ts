import type { questionsSchema } from '$lib/questionsSchema';
import type { PageLoad } from './$types';
import type z from 'zod';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/questions.json');
	const questions = (await res.json()) as z.infer<typeof questionsSchema>;
	return { questions };
};
