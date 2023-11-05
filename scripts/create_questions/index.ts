import fs from 'fs';
import prettier from 'prettier';
import z from 'zod';
import { questionsSchema } from '../../src/lib/questionsSchema';
import { createAndParseQuestions } from './createAndParseQuestions';
import { fetchAndParsePage } from './fetchAndParsePage';

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
	'memorable-quote'
];

const main = async () => {
	const questions: z.infer<typeof questionsSchema> = [];

	for (const page of pages) {
		console.log(`Starting ${page}...`);

		const { pageHtml, pageUrl } = await fetchAndParsePage(page);

		const newQuestions = await createAndParseQuestions(
			pageHtml,
			questions.map((q) => q.question)
		);

		newQuestions.forEach((question) => questions.push({ ...question, reference: pageUrl }));
	}

	const jsonString = JSON.stringify(questions);
	const prettyJsonString = await prettier.format(jsonString, { parser: 'json' });

	fs.writeFileSync(`./static/questions.json`, prettyJsonString);
};

main();
