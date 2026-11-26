<script lang="ts">
	import type { card } from '#lib/components/card.ts';
	import LockIcon from '@iconify-svelte/tabler/lock';
	import type { PageProps } from './$types';
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { folder } from '#lib/components/folder.ts';
	import { enhance } from '$app/forms';

	let { data }: PageProps = $props();
	let Folder: folder = $derived(data.folder);
	let cards: card[] = $derived(data.cards);
	let owned: boolean = $derived(data.owned);
	let ownerEmail: string = $derived(data.ownerEmail ?? '');
	let copyStatus = $state('');

	async function copyDeck() {
		copyStatus = '';
		try {
			const response = await fetch(`/api/folders/${encodeURIComponent(Folder.id)}`, {
				method: 'POST'
			});
			if (!response.ok) throw new Error('Could not copy this deck.');
			copyStatus = 'deck copied to your decks!';
		} catch (error) {
			copyStatus = error instanceof Error ? error.message : 'Could not copy this deck.';
		}
	}
</script>

<main class="flex h-screen w-full">
	<section class="mx-auto flex h-fit w-4/5 flex-col text-white">
		<h1
			class="flex flex-row gap-2 text-4xl font-bold"
			title="this deck is {Folder.private ? 'private' : 'public'}"
		>
			{Folder.name}
			{#if Folder.private}
				<LockIcon height="1.3em" class="opacity-30 " />
			{/if}
		</h1>
		{#if ownerEmail}
			<p class="text-sm text-white/50">
				by <span class="text-white/70">{ownerEmail}</span>
			</p>
		{/if}
		{#if !owned}
			<div class="mt-2 flex flex-row items-center gap-3">
				<ButtonSlide
					text="copy deck"
					color="oklch(0.649 0.311 321)"
					onclick={() => void copyDeck()}
				/>
				{#if copyStatus}
					<span class="text-xs text-white/50">{copyStatus}</span>
				{/if}
			</div>
			<p class="mt-1 text-xs text-white/40">read-only view — this deck belongs to someone else</p>
		{/if}
		<section class="f-full w-1/2">
			<table class="w-full">
				<thead class="border-b-2 border-[#fff4]">
					<tr>
						<th>id</th>
						<th>question</th>
						<th>answer</th>
						<th>type</th>
						<th>answer history</th>
						{#if owned}
							<th>settings</th>
						{/if}
					</tr>
				</thead>
				<tbody class="gap-2 py-2">
					{#each cards as Card (Card.id)}
						<tr class="my-1">
							<td>{Card.id}</td>
							<td>{Card.question}</td>
							<td>{Card.answer}</td>
							<td>{Card.type ?? 'basic'}</td>
							<td>{Card.answerHistory?.length ?? 0} reviews</td>
							{#if owned}
								<td>
									<details>
										<summary class="cursor-pointer">modify</summary>
										<form
											method="POST"
											action="?/update"
											use:enhance
											class="flex flex-col gap-1 py-2"
										>
											<input type="hidden" name="cardId" value={Card.id} />
											<input
												name="question"
												value={Card.question}
												required
												class="bg-transparent"
											/>
											<input name="answer" value={Card.answer} required class="bg-transparent" />
											<input
												name="type"
												value={Card.type ?? 'basic'}
												required
												class="bg-transparent"
											/>
											<ButtonSlide text="save" type="submit" />
										</form>
									</details>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="cardId" value={Card.id} />
										<button type="submit" class="cursor-pointer text-red-300 hover:text-red-100">
											delete
										</button>
									</form>
								</td>
							{/if}
						</tr>
					{:else}
						<tr>
							<td colspan={owned ? 6 : 5} class="py-4 text-center">
								the deck is empty
								{#if owned}
									<ButtonSlide
										text="add card!"
										onclick={() => goto(resolve('/addCard/[deckid]', { deckid: Folder.id }))}
									/>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	</section>
</main>
