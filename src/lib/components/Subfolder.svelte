<script lang="ts">
	import type { folder } from './folder';
	import Folder from './Folder.svelte';
	import FolderIcon from '@iconify-svelte/tabler/folder';
	import FolderOpenIcon from '@iconify-svelte/tabler/folder-open';
	import CardsIcon from '@iconify-svelte/tabler/cards';

	let { id, name, subfolders }: { id: string; name: string; subfolders?: folder[] } = $props();
</script>

<div class="transform bg-transparent transition-all duration-100 ease-in hover:bg-white/20">
	<!-- <p title="{id}. {name}" class="font-global text-white text-left">{name}</p> -->
	<div class="flex w-full flex-row">
		<div class="rounded-xl pr-2 pl-6">
			{#if subfolders != null}
				{#if !showSub}
					<FolderIcon height="1.5em" />
				{:else}
					<FolderOpenIcon height="1.5em" />
				{/if}
			{:else}
				<CardsIcon height="1.5em" />
			{/if}
		</div>
		<p title="{id}. {name}" class="font-global text-white">{name}</p>
	</div>
	{#each subfolders as folder (folder.id)}
		<Folder id={folder.id} name={folder.name} subfolders={folder?.subfolders || null} />
	{/each}
</div>
