<script lang="ts">
	export let correct: boolean | null;
	export let question: string;
	export let index: number;
	export let disabled: boolean;

	const backgroundColors = ['bg-violet-500', 'bg-violet-600', 'bg-violet-700', 'bg-violet-800'];
</script>

<div class="flex items-center">
	<button
		on:click
		class={`${backgroundColors[index]} mb-2 w-full px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-opacity-75 focus:outline-none`}
		{disabled}
	>
		{question}
	</button>
	<span class="ml-2 w-2">
		{#if correct}
			✅
		{:else if correct === false}
			❌
		{/if}
	</span>
</div>
