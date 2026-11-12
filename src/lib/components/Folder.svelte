<script lang="ts">
	import type { folder } from './folder';
	import Subfolder from './Subfolder.svelte';
	import FolderIcon from '@iconify-svelte/tabler/folder';
	import FolderOpenIcon from '@iconify-svelte/tabler/folder-open';
	import CardsIcon from '@iconify-svelte/tabler/cards';
	import DotsIcon from '@iconify-svelte/tabler/dots';
	import PlayIcon from '@iconify-svelte/tabler/play-card';
	import { slide } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import MenuButton from './MenuButton.svelte';

	let focused = $state(false);
	let hovertoplay = $state(false);
	let showSub = $state(false);
	let clickedmenu = $state(false);
	let {
		id,
		name,
		subfolders = null,
		privateDeck
	}: { id: string; name: string; subfolders: folder[] | null; privateDeck: boolean } = $props();
</script>

<button
	class="flex transform flex-col rounded-2xl bg-transparent text-xl transition-all duration-100 ease-in hover:bg-white/10"
	onfocus={() => {
		focused = true;
		showSub = true;
	}}
	onfocusout={() => {
		focused = false;
		showSub = false;
	}}
	ondblclick={() => goto(resolve('/card/0'))}
>
	<div class="relative flex w-full flex-row">
		<div class="relative rounded-xl px-2">
			{#if subfolders != null}
				{#if !showSub}
					<FolderIcon height="1.5em" />
				{:else}
					<FolderOpenIcon height="1.5em" />
				{/if}
			{:else}
				<CardsIcon height="1.5em" />
			{/if}
			{#if focused}
				<div
					class="absolute -left-10 isolate z-50 animate-scaling rounded-2xl bg-black px-2 invert hover:scale-105"
					onmouseenter={() => (hovertoplay = true)}
					onmouseleave={() => (hovertoplay = false)}
					onclick={() => goto(resolve('/card'))}
				>
					<!-- <PlayIcon height="1.5em" /> -->
					<p class="rounded-2xl font-black tracking-tighter italic">PLAY</p>
				</div>
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
					class="absolute top-10 isolate flex transform flex-col rounded-xl border-2 border-white bg-black overflow-clip"
					transition:slide
				>
				    <MenuButton text="add card"/>
					<MenuButton text="modify card"/>
					<MenuButton text="rename"/>
					<MenuButton text={privateDeck ? 'make public' : 'make private'}/>
				</div>
			{/if}
		</div>
	</div>
	{#if showSub}
		<div transition:slide={{ easing: cubicOut }}>
			{#each subfolders as folder (folder.id)}
				<Subfolder id={folder.id} name={folder.name} subfolders={folder.subfolders || null} />
			{/each}
		</div>
	{/if}
</button>
