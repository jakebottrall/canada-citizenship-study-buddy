import OpenAI from 'openai';
import { questionsSchema } from '../../src/lib/questionsSchema';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const examples = [
	{
		question: 'What are three responsibilities of citizenship?',
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
		],
		answer: 1
	},
	{
		question: 'What is the meaning of the Remembrance Day poppy?',
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
		],
		answer: 3
	}
];

const systemMessage = (num: number, prevQuestions: string[]) =>
	({
		role: 'system',
		content: `You are an assistant to a developer building an app to help people study for the Canadian citizenship exam. The developer will give you a html page from the Discover Canada Study Guide and you will create ${num} multiple choice questions from the page. The answer must be JSON formatted like so:
    ${JSON.stringify(examples)}
    You must use the following guidelines:
		- There may only be four options per question.
		- Each option's value is it's index position in the array.
		- The answer is the value of the correct option.
		- Only return the JSON object, nothing else.
		- Only use information from the page given to you, do not use any other sources.
		- Avoid using language that is not included on the provided page.
		- Do not use ambiguous questions. For example "What is the meaning of the Remembrance Day poppy?" is a good question, but "What is the meaning of the poppy?" is not.
		- Do not use ambiguous answers. For example "To remember the sacrifice of Canadians who have served or died in wars up to the present day" is a good answer, but "To remember the sacrifice of Canadians" is not.
		The following questions have already been created, so do not repeat them:
		- ${prevQuestions.join('\n- ')}`
	}) satisfies OpenAI.Chat.Completions.ChatCompletionMessage;

export const createAndParseQuestions = async (pageHtml: string, prevQuestions: string[]) => {
	console.info('Creating & parsing questions...');

	const numberOfQuestions = Math.ceil(pageHtml.length / 1000) * 3;

	const res = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo-16k',
		messages: [systemMessage(numberOfQuestions, prevQuestions), { role: 'user', content: pageHtml }]
	});

	console.table({ ...res.usage });

	try {
		const questions = JSON.parse(res.choices[0].message.content ?? '');
		const parsedQuestions = questionsSchema.parse(questions);

		parsedQuestions.forEach((question) => {
			if (prevQuestions.includes(question.question)) {
				throw new Error('Question already exists');
			}

			if (question.options.length !== 4) {
				throw new Error('Question does not have four options');
			}

			if (question.options.some((option, i) => option.value !== i)) {
				throw new Error('Question does not have options with sequential values');
			}
		});

		return parsedQuestions;
	} catch (error) {
		console.error(error);
		return await createAndParseQuestions(pageHtml, prevQuestions);
	}
};
