<script lang="ts">
	import type { folder as FolderType } from './folder';
	import Folder from './Folder.svelte';
	import ChevronDown from '@iconify-svelte/tabler/chevron-down';
	import ChevronRight from '@iconify-svelte/tabler/chevron-right';
	import CardsIcon from '@iconify-svelte/tabler/cards';
	import DotsIcon from '@iconify-svelte/tabler/dots';
	import LockIcon from '@iconify-svelte/tabler/lock';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import MenuButton from './MenuButton.svelte';
	import { onMount } from 'svelte';

	let { folder, folders }: { folder: FolderType; folders: FolderType[] } = $props();

	let focused = $state(false);
	let collapsed: Record<string, boolean> = $state({});
	let clickedmenu = $state(false);
	let actionError = $state('');

	let children = $derived(folders.filter((child) => child.parentid === folder.id));
	let hasChildren = $derived(children.length > 0);
	let isCollapsed = $derived(collapsed[folder.id] ?? false);

	$effect(() => {
		const value = JSON.stringify(collapsed);
		if (typeof cookieStore !== 'undefined') {
			cookieStore.set({ name: 'collapsed', value, path: '/' });
		}
	});

	onMount(async () => {
		if (typeof cookieStore === 'undefined') return;
		const saved = await cookieStore.get('collapsed');
		if (!saved?.value) return;

		try {
			collapsed = JSON.parse(saved.value);
		} catch {
			collapsed = {};
		}
	});

	function toggle() {
		collapsed[folder.id] = !isCollapsed;
	}

	async function updateFolder(body: { name?: string; public?: boolean }) {
		actionError = '';
		try {
			const response = await fetch(`/api/folders/${encodeURIComponent(folder.id)}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!response.ok) throw new Error('Could not update this deck.');
			await invalidateAll();
		} catch (error) {
			actionError = error instanceof Error ? error.message : 'Could not update this deck.';
		}
	}

	async function copyFolder() {
		actionError = '';
		try {
			const response = await fetch(`/api/folders/${encodeURIComponent(folder.id)}`, {
				method: 'POST'
			});
			if (!response.ok) throw new Error('Only public decks can be copied.');
			await invalidateAll();
		} catch (error) {
			actionError = error instanceof Error ? error.message : 'Could not copy this deck.';
		}
	}
</script>

<div
	class="flex w-full flex-col"
	onfocusin={() => {
		focused = true;
	}}
	onfocusout={(event) => {
		if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
		focused = false;
	}}
>
	<div class="relative flex w-full flex-row">
		{#if focused}
			<button
				type="button"
				aria-label="Study {folder.name}"
				title="Study {folder.name}"
				class="absolute top-1/2 -left-16 z-50 -translate-y-1/2 transform animate-scaling overflow-clip
				rounded-2xl bg-black px-2 invert transition duration-100 ease-in hover:scale-105"
				onclick={() => goto(resolve('/card/[deckid]', { deckid: folder.id }))}
			>
				<span class="group gap-0 rounded-2xl font-black tracking-[-0.1em] italic invert">
					<span class="text-black group-hover:text-red">P</span>
					<span class="text-black group-hover:text-amber">L</span>
					<span class="text-black group-hover:text-blue">A</span>
					<span class="text-black group-hover:text-green">Y</span>
				</span>
			</button>
		{/if}
		<button
			type="button"
			class="flex w-full transform flex-row items-center rounded-2xl bg-transparent pr-6 text-left
			text-xl transition-all duration-100 ease-in hover:bg-white/10"
			onclick={toggle}
			ondblclick={() => goto(resolve('/card/[deckid]', { deckid: folder.id }))}
		>
			<span class="relative inline-flex items-center rounded-xl px-2">
				{#if hasChildren}
					{#if isCollapsed}
						<ChevronRight height="1.5em" />
					{:else}
						<ChevronDown height="1.5em" />
					{/if}
				{:else}
					<CardsIcon height="1.5em" />
				{/if}
			</span>
			<span title="{folder.id}. {folder.name}" class="min-w-0 truncate font-global text-white">
				{folder.name}
			</span>
			{#if folder.private}
				<LockIcon height="0.9em" class="ml-2 shrink-0 opacity-30" />
			{/if}
			<span class="ml-auto flex w-50 shrink-0 flex-row justify-between text-sm">
				<span class={folder.new > 0 ? 'text-blue' : 'text-white/25'}>{folder.new}</span>
				<span class={folder.learn > 0 ? 'text-red' : 'text-white/25'}>{folder.learn}</span>
				<span class={folder.due > 0 ? 'text-green' : 'text-white/25'}>{folder.due}</span>
			</span>
		</button>

		<div class="absolute top-1/2 -right-5 -translate-y-1/2">
			<button
				type="button"
				aria-label="Deck menu"
				title="Deck options"
				class="isolate flex transform cursor-pointer rounded-2xl bg-black p-1 transition-all duration-100
				ease-in hover:invert"
				onclick={() => {
					clickedmenu = !clickedmenu;
				}}
			>
				<DotsIcon height="1em" />
			</button>
			{#if clickedmenu}
				<div
					class="absolute top-7 right-0 isolate flex transform flex-col overflow-clip rounded-xl border-2
					border-white bg-black"
					transition:slide
				>
					<MenuButton
						text="add card"
						color="oklch(0.626 0.257 29)"
						onclick={() => goto(resolve('/addCard/[deckid]', { deckid: folder.id }))}
					/>
					<MenuButton
						text="modify card"
						color="oklch(0.769 0.188 70.08)"
						onclick={() => goto(resolve('/modifyDeck/[deckid]', { deckid: folder.id }))}
					/>
					<MenuButton text="copy deck" color="oklch(0.649 0.311 321)" onclick={copyFolder} />
					<MenuButton
						text="rename"
						color="oklch(0.511 0.272 263)"
						onclick={() => {
							const name = prompt('New deck name', folder.name)?.trim();
							if (name) void updateFolder({ name });
						}}
					/>
					<MenuButton
						text={folder.private ? 'make public' : 'make private'}
						color="oklch(0.781 0.258 143)"
						onclick={() => void updateFolder({ public: folder.private })}
					/>
				</div>
			{/if}
		</div>
		{#if actionError}
			<p class="pl-2 text-xs text-red-300" role="alert">{actionError}</p>
		{/if}
	</div>

	{#if hasChildren && !isCollapsed}
		<div transition:slide={{ easing: cubicOut }} class="w-full pl-8">
			{#each children as child (child.id)}
				<Folder folder={child} {folders} />
			{/each}
		</div>
	{/if}
</div>
