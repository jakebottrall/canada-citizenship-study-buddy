<script lang="ts">
	export let question: string;
	export let index: number;

	const backgroundColors = ['bg-violet-500', 'bg-violet-600', 'bg-violet-700', 'bg-violet-800'];
</script>

<button
	on:click
	class={`${backgroundColors[index]} mb-2 w-full px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-900 focus:outline-none`}
	>{question}</button
>
