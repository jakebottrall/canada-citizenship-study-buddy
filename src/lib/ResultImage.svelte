<script lang="ts">
	import { fly } from 'svelte/transition';

	export let toggled: boolean;
	export let src: string;
	export let alt: string;
</script>

{#if toggled}
	<img
		{alt}
		{src}
		class="absolute"
		height="50"
		in:fly={{ x: 300, duration: 500 }}
		out:fly={{ x: 300, duration: 1000 }}
		style="bottom: 10px; right: 0px"
		width="50"
	/>
{/if}
