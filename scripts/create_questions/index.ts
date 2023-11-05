import z from 'zod';
import fs from 'fs';
import { questionsSchema } from '../../src/lib/questionsSchema';
import { fetchAndParsePage } from './fetchAndParsePage';
import { createAndParseQuestions } from './createAndParseQuestions';

const pages = [
	'oath-citizenship',
	'rights-resonsibilities-citizenship',
	'who-are-canadians',
	'canadas-history',
	'modern-canada',
	'how-canadians-govern-themselves',
	'federal-elections',
	'justice-system',
	'canadian-symbols',
	'canadas-economy',
	'canadas-regions',
	'authorities',
	'memorable-quote'
];

const main = async () => {
	const questions: z.infer<typeof questionsSchema> = [];

	for (const page of pages) {
		console.log(`Starting ${page}...`);
		const { pageHtml, pageUrl } = await fetchAndParsePage(page);
		const newQuestions = await createAndParseQuestions(pageHtml);
		newQuestions.forEach((question) => questions.push({ ...question, reference: pageUrl }));
	}

	fs.writeFileSync(`./static/questions.json`, JSON.stringify(questions));
};

main();
