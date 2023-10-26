<script lang="ts">
	const questions = [
		{
			question: 'What are three responsibilities of citizenship?',
			options: [
				'Being loyal to Canada, recycling newspapers, serving in the navy, army or air force',
				'Obeying the law, taking responsibility for oneself and one’s family, serving on a jury',
				'Learning both official languages, voting in elections, belonging to a union.',
				'Buying Canadian products, owning your own business, using less water.'
			],
			answer: 1
		},
		{
			question: 'What is the meaning of the Remembrance Day poppy?',
			options: [
				'To remember our Sovereign, Queen Elizabeth II',
				'To celebrate Confederation.',
				'To honour prime ministers who have died',
				'To remember the sacrifice of Canadians who have served or died in wars up to the present day'
			],
			answer: 3
		}
	];

	const getRandomQuestion = () => Math.floor(Math.random() * questions.length);

	let index = getRandomQuestion();

	$: currentQuestion = questions[index];

	const handleClick = (selected: number) => {
		if (selected === currentQuestion.answer) {
			alert('Correct!');
		} else {
			alert('Incorrect!');
		}

		index = getRandomQuestion();
	};
</script>

<svelte:head>
	<title>ohhhh canada</title>
	<meta name="description" content="The best mock canada citizenship test" />
</svelte:head>

<div class="flex h-screen w-screen flex-col items-center justify-center bg-slate-900">
	<h1 class="mb-2 text-3xl text-white">Canada Citizenship Study Buddy</h1>

	<h2 class="mb-2 text-2xl text-white">
		Question {index + 1}: {currentQuestion.question}
	</h2>

	<div class="w-5/6">
		{#each currentQuestion.options as option, i}
			<button
				on:click={() => handleClick(i)}
				class="mb-2 w-full bg-violet-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
				>{option}</button
			>
		{/each}
	</div>
</div>
``
