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
		<section class="f-full w-1/2">
			<table class="w-full">
				<thead class="border-b-2 border-[#fff4]">
					<tr>
						<th>id</th>
						<th>question</th>
						<th>answer</th>
						<th>type</th>
						<th>answer history</th>
						<th>settings</th>
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
										<input name="question" value={Card.question} required class="bg-transparent" />
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
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="py-4 text-center">
								the deck is empty
								<ButtonSlide
									text="add card!"
									onclick={() => goto(resolve('/addCard/[deckid]', { deckid: Folder.id }))}
								/>
							</td>
						</tr>
					{/each}
					<!-- <tr class="col-span-6">
					    <MenuButton text="add card" color="oklch(0.626 0.257 29)"/>
					</tr> -->
				</tbody>
			</table>
		</section>
	</section>
</main>
