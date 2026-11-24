<script lang="ts">
	import { slide } from 'svelte/transition';

	let { text = 'button', disabled = false } = $props();
	let mouseover = $state(false);
</script>

<button
	class="relative isolate transform rounded-xl border-4 border-white px-3 py-1
    font-bold italic transition-all duration-100 ease-in hover:scale-105 focus:animate-scaling"
	on:click
	{disabled}
	on:mouseenter={() => {
		mouseover = true;
	}}
	on:mouseleave={() => {
		mouseover = false;
	}}
>
	<span class="relative z-10 text-white mix-blend-difference">{text}</span>
	{#if mouseover}
		<div transition:slide class="absolute top-[0%] bottom-[0%] left-0 w-full bg-white"></div>
	{/if}
</button>
