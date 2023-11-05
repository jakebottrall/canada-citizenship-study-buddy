import OpenAI from 'openai';
import { questionsSchema } from '../../src/lib/questionsSchema';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const examples = [
	{
		question: 'What are three responsibilities of citizenship?',
		answer: 1,
		options: [
			{
				label:
					'Being loyal to Canada, recycling newspapers, serving in the navy, army or air force',
				value: 0
			},
			{
				label:
					'Obeying the law, taking responsibility for oneself and one’s family, serving on a jury',
				value: 1
			},
			{
				label: 'Learning both official languages, voting in elections, belonging to a union.',
				value: 2
			},
			{
				label: 'Buying Canadian products, owning your own business, using less water.',
				value: 3
			}
		]
	},
	{
		question: 'What is the meaning of the Remembrance Day poppy?',
		answer: 3,
		options: [
			{
				label: 'To remember our Sovereign, Queen Elizabeth II',
				value: 0
			},
			{
				label: 'To celebrate Confederation.',
				value: 1
			},
			{
				label: 'To honour prime ministers who have died',
				value: 2
			},
			{
				label:
					'To remember the sacrifice of Canadians who have served or died in wars up to the present day',
				value: 3
			}
		]
	}
];

const systemMessage = (num: number) =>
	({
		role: 'system',
		content: `You are an assistant to a developer creating an app aiming to help people study for the Canadian citizenship exam. The developer will give you a html page from the Discover Canada Study Guide and you will create ${num} multiple choice questions from the page. The answer must be JSON formatted like so:
    \`\`\`json
    ${JSON.stringify(examples)}
    \`\`\`
    Only return the JSON object, nothing else.`
	}) satisfies OpenAI.Chat.Completions.ChatCompletionMessage;

export const createAndParseQuestions = async (pageHtml: string) => {
	console.info('Creating & parsing questions...');

	const numberOfQuestions = Math.ceil(pageHtml.length / 1000) * 2;

	const res = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo-16k',
		messages: [systemMessage(numberOfQuestions), { role: 'user', content: pageHtml }]
	});

	console.table({ ...res.usage });

	const questions = JSON.parse(res.choices[0].message.content ?? '');

	return questionsSchema.parse(questions);
};
