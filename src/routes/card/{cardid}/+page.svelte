<script lang="ts">
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let answer = $state();
</script>

<main>
	<footer>
		<ButtonSlide
			text="forgot"
			onclick={() => {
				answer = -1;
			}}
		/>
		<ButtonSlide
			text="bad"
			onclick={() => {
				answer = 0;
			}}
		/>
		<ButtonSlide
			text="again"
			onclick={() => {
				answer = 1;
			}}
		/>
		<ButtonSlide
			text="good"
			onclick={() => {
				answer = 2;
			}}
		/>
		<ButtonSlide
			text="easy"
			onclick={() => {
				answer = 3;
			}}
		/>
	</footer>
</main>
