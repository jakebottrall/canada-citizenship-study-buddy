<script lang="ts">
	import { questions } from '$lib/questions';
	import awesome from '$lib/assets/awesome.png';
	import notAwesome from '$lib/assets/not-awesome.png';
	import Option from '$lib/Option.svelte';
	import ResultImage from '$lib/ResultImage.svelte';

	const getRandomQuestion = () => Math.floor(Math.random() * questions.length);

	let index = getRandomQuestion();

	let questionsAsked = 0;
	let questionsCorrect = 0;

	let correct = false;
	let incorrect = false;

	$: currentQuestion = questions[index];

	const handleClick = (selected: number) => {
		questionsAsked += 1;

		if (selected === currentQuestion.answer) {
			correct = true;
			questionsCorrect += 1;

			setTimeout(() => {
				correct = false;
			}, 1000);
		} else {
			incorrect = true;

			setTimeout(() => {
				incorrect = false;
			}, 1000);
		}

		index = getRandomQuestion();
	};

	const randomizeOptionsOrder = (options: { question: string; value: number }[]) => {
		return options.sort(() => Math.random() - 0.5);
	};
</script>

<svelte:head>
	<title>ohhhh canada</title>
	<meta name="description" content="The best mock canada citizenship test" />
</svelte:head>

<div class="flex h-screen w-screen flex-col items-center justify-center bg-slate-900">
	<h1 class="mb-2 text-3xl text-white">Canada Citizenship Study Buddy</h1>

	<h2 class="mb-2 text-2xl text-white">
		Question {questionsAsked + 1}: {currentQuestion.question}
	</h2>

	<div class="w-5/6">
		{#each randomizeOptionsOrder(currentQuestion.options) as option, index (option.question)}
			<Option on:click={() => handleClick(option.value)} question={option.question} {index} />
		{/each}
	</div>

	<p class="text-white">
		You have answered {questionsCorrect} out of {questionsAsked} questions correctly.
	</p>

	<ResultImage toggled={correct} src={awesome} alt="correct" />
	<ResultImage toggled={incorrect} src={notAwesome} alt="incorrect" />
</div>
