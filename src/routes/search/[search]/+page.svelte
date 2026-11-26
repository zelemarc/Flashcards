<script lang="ts">
	import type { PageProps } from './$types';
	import FolderIcon from '@iconify-svelte/tabler/folder';
	import FolderOpenIcon from '@iconify-svelte/tabler/folder-open';
	import CardsIcon from '@iconify-svelte/tabler/cards';
	import SearchIcon from '@iconify-svelte/tabler/search';
	import ArrowRightIcon from '@iconify-svelte/tabler/arrow-right';
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	let total = $derived(data.folders.length + data.cards.length);
	let copyStatus = $state<Record<string, string>>({});

	async function copyDeck(id: string) {
		copyStatus = { ...copyStatus, [id]: '' };
		try {
			const response = await fetch(`/api/folders/${encodeURIComponent(id)}`, {
				method: 'POST'
			});
			if (!response.ok) throw new Error('Could not copy this deck.');
			copyStatus = { ...copyStatus, [id]: 'deck copied to your decks!' };
		} catch (error) {
			copyStatus = {
				...copyStatus,
				[id]: error instanceof Error ? error.message : 'Could not copy this deck.'
			};
		}
	}
</script>

<main
	class="flex h-[calc(100dvh-5rem)] w-full overflow-y-auto scroll-smooth font-global text-white"
>
	<section class="mx-auto flex w-1/2 flex-col gap-5 pb-16">
		<header class="flex flex-col gap-1 border-b border-white/20 pb-4">
			<p class="flex flex-row items-center gap-2 text-xs tracking-[0.25em] text-white/40 uppercase">
				<SearchIcon height="1.2em" />
				search results
			</p>
			<h1 class="font-handwritten text-4xl italic">
				"<span class="text-amber">{data.query}</span>"
			</h1>
			<p class="text-sm text-white/50 ">
				{total}
				{total === 1 ? 'result' : 'results'} found
			</p>
		</header>

		{#if data.folders.length > 0}
			<section class="flex flex-col gap-1">
				<h2 class="px-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase">decks</h2>
				{#each data.folders as folder (folder.id)}
					<div
						class="flex flex-col gap-1 rounded-2xl px-3 py-2 transition-all duration-100 ease-in
						hover:bg-white/10"
					>
						<button
							type="button"
							class="group flex w-full flex-row items-center gap-3 text-left"
							title="Open {folder.name}"
							onclick={() => goto(resolve('/modifyDeck/[deckid]', { deckid: folder.id }))}
						>
							<FolderOpenIcon height="1.4em" class="text-blue" />
							<span class="text-xl">{folder.name}</span>
							<span class="ml-auto flex flex-row items-center gap-2 text-xs text-white/30">
								<CardsIcon height="1.2em" />
								<span class="transition-all duration-100 group-hover:text-white/70">
									{folder.cardCount}
									{folder.cardCount === 1 ? 'card' : 'cards'}
								</span>
								<ArrowRightIcon
									height="1.2em"
									class="opacity-0 transition-opacity group-hover:opacity-100"
								/>
							</span>
						</button>
						<p class="pl-8 text-xs text-white/40">
							by <span class="text-white/70">{folder.ownerEmail ?? 'unknown'}</span>
						</p>
						<div class="flex flex-row items-center gap-3 pl-8 pt-1">
							<ButtonSlide
								text="view cards"
								onclick={() => goto(resolve('/modifyDeck/[deckid]', { deckid: folder.id }))}
							/>
							<ButtonSlide
								text="copy deck"
								color="oklch(0.649 0.311 321)"
								onclick={() => void copyDeck(folder.id)}
							/>
							{#if copyStatus[folder.id]}
								<span class="text-xs text-white/50">{copyStatus[folder.id]}</span>
							{/if}
						</div>
					</div>
				{/each}
			</section>
		{/if}

		{#if data.cards.length > 0}
			<section class="flex flex-col gap-1">
				<h2 class="px-2 text-xs font-bold tracking-[0.25em] text-white/40 uppercase">cards</h2>
				{#each data.cards as card (card.id)}
					<button
						type="button"
						class="group flex w-full flex-col gap-1 rounded-2xl px-3 py-2 text-left
						transition-all duration-100 ease-in hover:bg-white/10"
						title="Study {card.deckName}"
						onclick={() => goto(resolve('/card/[deckid]', { deckid: card.deckid }))}
					>
						<span class="flex w-full flex-row items-baseline gap-2">
							<span class="truncate text-lg font-bold">{card.question}</span>
							<span class="ml-auto shrink-0 text-sm text-white/40 italic">{card.answer}</span>
						</span>
						<span class="flex flex-row items-center gap-1 text-xs text-white/30">
							<FolderIcon height="1em" />
							{card.deckName}
						</span>
					</button>
				{/each}
			</section>
		{/if}

		{#if total === 0}
			<section class="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
				<SearchIcon height="3em" class="text-white/20" />
				<p class="font-handwritten text-4xl italic">nothing here...</p>
				<p class="max-w-md text-sm text-white/40">
					No decks or cards match "{data.query}". Try a different word or browse your decks.
				</p>
				<ButtonSlide text="browse decks" onclick={() => goto(resolve('/'))} />
			</section>
		{/if}
	</section>
</main>
