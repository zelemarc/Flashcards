<script lang="ts">
	import type { folder } from './folder';
	import Subfolder from './Subfolder.svelte';
	import FolderIcon from '@iconify-svelte/tabler/folder';
	import FolderOpenIcon from '@iconify-svelte/tabler/folder-open';
	import CardsIcon from '@iconify-svelte/tabler/cards';
	import PlayIcon from '@iconify-svelte/tabler/play-card';
	import { slide } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let focused = $state(false);
	let hovertoplay = $state(false);
	let showSub = $state(false);
	let {
		id,
		name,
		subfolders = null
	}: { id: string; name: string; subfolders: folder[] | null } = $props();
</script>

<button
	class="flex flex-col rounded-2xl bg-transparent text-xl transform transition-all duration-100 ease-in hover:bg-white/10"
	onclick={() => (showSub = !showSub)}
	onfocus={() => focused = true}
	onfocusout={() => focused = false}
	ondblclick={() => goto(resolve('/card/0'))} >
	<div class="flex w-full flex-row">
		<div class="rounded-xl px-2">
		{#if !focused}
			{#if subfolders != null}
				{#if !showSub}
					<FolderIcon height="1.5em" />
				{:else}
					<FolderOpenIcon height="1.5em" />
				{/if}
			{:else}
				<CardsIcon height="1.5em" />
			{/if}
			{:else}
			<div class="px-1 isolate invert bg-black animate-scaling hover:scale-105 z-50"
			    onmouseenter={() => hovertoplay = true}
				onmouseleave={() => hovertoplay = false}
                onclick={() => goto(resolve('/card'))} >
			    <!-- <PlayIcon height="1.5em" /> -->
					<p class="italic font-black tracking-tighter">PLAY</p>
			</div>
			{/if}
		</div>
		<p title="{id}. {name}" class="font-global text-white">{name}</p>
	</div>
	{#if showSub}
		<div transition:slide={{easing: cubicOut}}>
			{#each subfolders as folder (folder.id)}
				<Subfolder id={folder.id} name={folder.name} subfolders={folder?.subfolders || null} />
			{/each}
		</div>
	{/if}
</button>
