<script lang="ts">
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import type { PageProps } from './$types';
	import type { card } from '#lib/components/card.ts';

	let { data }: PageProps = $props();
	let cards = $state({last: '', current: '', next: ''});
	let cardObject: card = $state({});
	let showAnswer = $state(false);
	let answer = $derived((o) => {

	});

	function onkey(e) {
	  switch(e.keyCode){
			case 1:

			break;
			case 2:

			break;
			case 3:

			break;
			case 4:

			break;
			}
	}

	$effect(() => {

	})
</script>

<main class="relative">
    <header><p class="text-xs">{data.card?.id}</p></header>
    <section>
        <p>{cardObject.question}</p>
        <div class="">
            <p>{cardObject.answer}</p>
        </div>
    </section>
	<footer class="mx-auto absolute -bottom-6">
		<ButtonSlide
			text="bad"
			on:click={() => {
				answer(-1);
			}}
		/>
		<ButtonSlide
			text="again"
			on:click={() => {
				answer(0)
			}}
		/>
		<ButtonSlide
			text="good"
			on:click={() => {
				answer(1);
			}}
		/>
		<ButtonSlide
			text="easy"
			on:click={() => {
				answer(2);
			}}
		/>
	</footer>
</main>

<svelte:window onkeydown={onkey} />
