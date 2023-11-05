import type { questionsSchema } from '$lib/questionsSchema';
import type z from 'zod';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/questions.json');
	const questions = (await res.json()) as z.infer<typeof questionsSchema>;
	return { questions };
};
