<script lang="ts">
	import Folder from '#lib/components/Folder.svelte';
	import type { folder } from '#lib/components/folder.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let folders: folder[] = $derived(data.folders);
</script>

<main class="flex h-screen w-full">
	<section class="mx-auto mt-20 flex h-fit w-1/2 flex-col text-white">
		<div class="flex w-full flex-row justify-between italic">
			<p>Folder</p>
			<div class="flex w-50 flex-row justify-between">
				<p>new</p>
				<p>learn</p>
				<p>due</p>
			</div>
		</div>
		<hr />
		{#each folders as folder (folder.id)}
			<Folder id={folder.id} name={folder.name} subfolders={folder?.subfolders || null} privateDeck={folder.private} />
		{/each}
	</section>
</main>
