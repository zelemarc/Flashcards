<script lang="ts">
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import type { PageProps } from './$types';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import CardsIcon from '@iconify-svelte/tabler/cards';
	import LockIcon from '@iconify-svelte/tabler/lock';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	let cards = $derived(data.cards);
	let index = $state(0);
	let showAnswer = $state(false);

	let cardObject = $derived(cards[index]);
	let isDone = $derived(cards.length > 0 && index >= cards.length);
	let progress = $derived(cards.length === 0 ? 0 : (index / cards.length) * 100);

	function grade(value: number) {
		if (!showAnswer || isDone) return;

		// The answer is not persisted yet, so the grade only moves the session forward.
		void value;
		showAnswer = false;
		index += 1;
	}

	function restart() {
		index = 0;
		showAnswer = false;
	}

	function onkey(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			goto(resolve('/'));
			return;
		}

		if (cards.length === 0 || isDone) return;

		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			if (!showAnswer) showAnswer = true;
			return;
		}

		if (!showAnswer) return;

		switch (event.key) {
			case '1':
				grade(-1);
				break;
			case '2':
				grade(0);
				break;
			case '3':
				grade(1);
				break;
			case '4':
				grade(2);
				break;
		}
	}
</script>

<main class="flex h-[calc(100dvh-5rem)] w-full flex-col overflow-hidden font-global text-white">
	<section class="mx-auto flex h-full w-4/5 max-w-4xl flex-col gap-4 py-4">
		<header class="flex flex-row items-end justify-between">
			<div>
				<p class="text-xs tracking-[0.25em] text-white/40 uppercase italic">studying</p>
				<h1 class="flex flex-row items-center gap-2 text-3xl font-bold italic">
					{data.folder.name}
					{#if data.folder.private}
						<LockIcon height="0.9em" class="opacity-30" />
					{/if}
				</h1>
			</div>
			<div class="flex flex-row items-center gap-2 text-sm text-white/50">
				<CardsIcon height="1.2em" />
				<span>
					{#if cards.length === 0}
						0 / 0
					{:else if isDone}
						{cards.length} / {cards.length}
					{:else}
						{index + 1} / {cards.length}
					{/if}
				</span>
			</div>
		</header>

		<div class="h-1 w-full overflow-hidden rounded-full bg-white/10">
			<div
				class="h-full rounded-full bg-white transition-all duration-300 ease-out"
				style="width: {progress}%"
			></div>
		</div>

		{#if cards.length === 0}
			<section class="flex flex-1 flex-col items-center justify-center gap-5 text-center">
				<CardsIcon height="3em" class="text-white/20" />
				<p class="font-handwritten text-4xl italic">this deck is empty</p>
				<p class="text-sm text-white/40">Add your first card to start studying.</p>
				<ButtonSlide
					text="add card"
					onclick={() => goto(resolve('/addCard/[deckid]', { deckid: data.folder.id }))}
				/>
			</section>
		{:else if isDone}
			<section class="flex flex-1 flex-col items-center justify-center gap-4 text-center">
				<p class="font-handwritten text-5xl italic">deck complete</p>
				<p class="text-white/50">
					You reviewed {cards.length} card{cards.length === 1 ? '' : 's'}.
				</p>
				<div class="mt-2 flex flex-row gap-3">
					<ButtonSlide text="study again" onclick={restart} />
					<ButtonSlide
						text="back to deck"
						onclick={() => goto(resolve('/modifyDeck/[deckid]', { deckid: data.folder.id }))}
					/>
				</div>
			</section>
		{:else}
			<section class="flex min-h-0 flex-1 items-center justify-center">
				<div
					class="relative flex h-full max-h-[32rem] w-full flex-col overflow-hidden rounded-3xl
					border border-white/20 bg-gray-400/15 backdrop-blur-xl"
					role="button"
					tabindex="0"
					aria-label={showAnswer ? 'Answer shown' : 'Show answer'}
					onclick={() => (showAnswer = true)}
					onkeydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') showAnswer = true;
					}}
				>
					<div
						class="flex flex-row items-center justify-between border-b border-white/10 px-6 py-4
						text-xs tracking-[0.25em] text-white/40 uppercase"
					>
						<span>question</span>
						<span class="tracking-normal normal-case italic">{cardObject?.id}</span>
					</div>

					<div class="flex flex-1 items-center justify-center overflow-y-auto px-8 py-8">
						<p class="text-center font-serif-gothic text-4xl leading-tight font-bold">
							{cardObject?.question}
						</p>
					</div>

					{#if showAnswer}
						<div
							transition:slide={{ duration: 200, easing: cubicOut }}
							class="border-t border-white/10 bg-black/20 px-6 py-5"
						>
							<p class="text-xs tracking-[0.25em] text-amber uppercase">answer</p>
							<p class="mt-1 font-serif-gothic text-2xl text-white/90">{cardObject?.answer}</p>
						</div>
					{:else}
						<div
							class="border-t border-white/10 px-6 py-5 text-center text-xs tracking-[0.25em]
							text-white/30 uppercase"
						>
							press space or show answer
						</div>
					{/if}
				</div>
			</section>

			<footer class="flex flex-row flex-wrap justify-center gap-3 pb-2">
				{#if showAnswer}
					<ButtonSlide text="1 · bad" onclick={() => grade(-1)} />
					<ButtonSlide text="2 · again" onclick={() => grade(0)} />
					<ButtonSlide text="3 · good" onclick={() => grade(1)} />
					<ButtonSlide text="4 · easy" onclick={() => grade(2)} />
				{:else}
					<ButtonSlide text="show answer" onclick={() => (showAnswer = true)} />
				{/if}
			</footer>
		{/if}
	</section>
</main>

<svelte:window onkeydown={onkey} />
