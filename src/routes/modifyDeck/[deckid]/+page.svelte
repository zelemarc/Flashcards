<script lang="ts">
	import type { card } from '#lib/components/card.ts';
	import LockIcon from '@iconify-svelte/tabler/lock';
	import type { PageProps } from './$types';
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { folder } from '#lib/components/folder.ts';

	let { data }: PageProps = $props();
	let Folder: folder = $derived(data.folder);
	let cards: card[] = $derived(data.cards);

</script>

<main class="flex h-screen w-full">
	<section class="mx-auto mt-20 flex h-fit w-4/5 flex-col text-white">
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
							<td>{Card.type}</td>
							<td>{Card?.answerHistory || 'null'}</td>
							<td><ButtonSlide text="modify" onclick={() => {}} /></td>
						</tr>
					{:else}
						<div>
							the deck is empty<ButtonSlide
								text="add card!"
								onclick={() => {
									goto(resolve('/addCard'));
								}}
							/>
						</div>
					{/each}
					<!-- <tr class="col-span-6">
					    <MenuButton text="add card" color="oklch(0.626 0.257 29)"/>
					</tr> -->
				</tbody>
			</table>
		</section>
	</section>
</main>
