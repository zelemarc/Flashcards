<script lang="ts">
	import type { folder } from './folder';
	import Folder from './Folder.svelte';
	import FolderIcon from '@iconify-svelte/tabler/folder';
	import FolderOpenIcon from '@iconify-svelte/tabler/folder-open';
	import ChevronDown from '@iconify-svelte/tabler/chevron-down';
	import ChevronRight from '@iconify-svelte/tabler/chevron-right';
	import CardsIcon from '@iconify-svelte/tabler/cards';
	import DotsIcon from '@iconify-svelte/tabler/dots';
	import PlayIcon from '@iconify-svelte/tabler/play-card';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import MenuButton from './MenuButton.svelte';
	import { onMount } from 'svelte';

	let focused = $state(false);
	let showSub = $state(false);
	let collapsed: Record<string, boolean> = $state({});
	let clickedmenu = $state(false);
	let {
		id,
		name,
		subfolders = null,
		privateDeck
	}: { id: string; name: string; subfolders: folder[] | null; privateDeck: boolean } = $props();

	$effect(() => {
		cookieStore.set('collapsed', JSON.stringify(collapsed), { path: '/' });
	});
	onMount(async () => {
		const saved = await cookieStore.get('collapsed');
		if (saved?.value) {
			collapsed = JSON.parse(saved.value);
		}
	})
</script>

<button
	class="flex w-full transform flex-col rounded-2xl bg-transparent text-xl transition-all duration-100 ease-in hover:bg-white/10"
	onfocus={() => {
		focused = true;
	}}
	onfocusout={() => {
		focused = false;
	}}

	ondblclick={() => goto(resolve('/card/[deckid]', { deckid: id}))}
>
	<div class="relative flex w-full flex-row" 	onclick={() => (collapsed[id] = !collapsed[id])}>
		<div class="relative rounded-xl px-2" >
			{#if focused}
				<div
					class="absolute -left-18 isolate z-50 transform animate-scaling overflow-clip rounded-2xl
				bg-black px-2 invert transition duration-100 ease-in hover:scale-105"
					onclick={() => goto(resolve('/card/[deckid]', { deckid: id }))}
				>
					<p class="group gap-0 rounded-2xl font-black tracking-[-0.1em] italic invert">
						<span class="text-black group-hover:text-red">P</span>
						<span class="text-black group-hover:text-amber">L</span>
						<span class="text-black group-hover:text-blue">A</span>
						<span class="text-black group-hover:text-green">Y</span>
					</p>
				</div>
			{/if}
			{#if subfolders != null}
				{#if !collapsed[id]}
				<div in:slide={{axis: 'y'}} out:slide={{axis: 'y'}}>
					<ChevronRight height="1.5em"/>
				</div>
				{:else}
				<div in:slide={{axis: 'y'}} out:slide={{axis: 'y'}}>
					<ChevronDown height="1.5em" />
				</div>
				{/if}
			{:else}
				<CardsIcon height="1.5em" />
			{/if}
		</div>
		<p title="{id}. {name}" class="font-global text-white">{name}</p>
		<div class="absolute -right-5">
			<div
				class="isolate transform rounded-2xl bg-black transition-all duration-100 ease-in hover:invert"
				onclick={() => {
					clickedmenu = !clickedmenu;
				}}
			>
				<DotsIcon height="1em" />
			</div>
			{#if clickedmenu}
				<div
					class="absolute top-0 left-6 isolate flex transform flex-col overflow-clip rounded-xl border-2 border-white bg-black"
					transition:slide
				>
					<MenuButton
						text="add card"
						color="oklch(0.626 0.257 29)"
						on:click={() => goto(resolve('/addCard'))}
					/>
					<MenuButton
						text="modify card"
						color="oklch(0.769 0.188 70.08)"
						on:click={() => goto(resolve('/modifyDeck/[deckid]', { deckid: id }))}
					/>
					<MenuButton text="copy deck" color="oklch(0.649 0.311 321)" />
					<MenuButton text="rename" color="oklch(0.511 0.272 263)" />
					<MenuButton
						text={privateDeck ? 'make public' : 'make private'}
						color="oklch(0.781 0.258 143)"
					/>
				</div>
			{/if}
		</div>
	</div>
	{#if (collapsed[id] ?? true) && subfolders}
		<div transition:slide={{ easing: cubicOut }} class="pl-8">
			{#each subfolders as folder (folder.id)}
				<Folder
					id={folder.id}
					name={folder.name}
					subfolders={folder.subfolders || null}
					privateDeck={folder.private}
				/>
			{/each}
		</div>
	{/if}
</button>
