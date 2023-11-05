<script lang="ts">
	import awesome from '$lib/assets/awesome.png';
	import notAwesome from '$lib/assets/not-awesome.png';
	import Option from '$lib/Option.svelte';
	import ResultImage from '$lib/ResultImage.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { questions } = data;

	const getRandomQuestion = () => Math.floor(Math.random() * questions.length);

	let index = getRandomQuestion();

	let previousQuestions: number[] = [index];

	let questionsAsked = 0;
	let questionsCorrect = 0;

	let correct = false;
	let incorrect = false;

	$: currentQuestion = questions[index];

	$: randomisedOptions = [...currentQuestion.options.sort(() => Math.random() - 0.5)];

	const handleSelect = (selected: number) => {
		if (selected === currentQuestion.answer) {
			correct = true;
		} else {
			incorrect = true;
		}
	};

	const handleNext = () => {
		if (questionsAsked === questions.length) {
			alert(`You got ${questionsCorrect} out of ${questionsAsked} questions correct!`);
			questionsAsked = 0;
			questionsCorrect = 0;
			previousQuestions = [];
		}

		questionsAsked += 1;

		if (correct) {
			questionsCorrect += 1;
		}

		correct = false;
		incorrect = false;

		const findNextQuestion = (): number => {
			const nextIndex = getRandomQuestion();

			if (previousQuestions.includes(nextIndex)) {
				return findNextQuestion();
			}

			return nextIndex;
		};

		index = findNextQuestion();
		previousQuestions = [...previousQuestions, index];
	};
</script>

<svelte:head>
	<title>ohhhh canada</title>
	<meta name="description" content="The best mock canada citizenship test" />
</svelte:head>

<div class="flex h-screen w-screen flex-col items-center justify-between bg-slate-900">
	<div class="flex flex-grow flex-col items-center justify-center">
		<h1 class="mb-2 text-3xl text-white">Canada Citizenship Study Buddy</h1>

		<h2 class="mb-2 max-w-3xl text-center text-2xl text-white">
			Question {questionsAsked + 1}: {currentQuestion.question}
		</h2>

		<div class="w-5/6 max-w-2xl">
			{#each randomisedOptions as option, index (option.label)}
				<Option
					{index}
					disabled={correct || incorrect}
					correct={correct || incorrect ? option.value === currentQuestion.answer : null}
					on:click={() => handleSelect(option.value)}
					question={option.label}
				/>
			{/each}
		</div>

		<p class="text-white">
			You have answered {questionsCorrect} out of {questionsAsked} questions correctly.
		</p>
	</div>

	<div class="h-20">
		{#if correct || incorrect}
			<button
				class="mb-2 bg-sky-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-opacity-75 focus:outline-none"
				on:click={handleNext}>Next Question</button
			>
		{/if}
	</div>

	<ResultImage toggled={correct} src={awesome} alt="correct" />
	<ResultImage toggled={incorrect} src={notAwesome} alt="incorrect" />

	<div class="absolute bottom-2 left-2">
		<a class="text-sky-600 underline" href={currentQuestion.reference} target="_blank">Reference</a>
	</div>
</div>
