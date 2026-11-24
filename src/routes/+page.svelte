<script lang="ts">
	import Folder from '#lib/components/Folder.svelte';
	import type { folder } from '#lib/components/folder.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let folders: folder[] = $derived(data.folders);
	let rootFolders: folder[] = $derived(folders.filter((folder) => !folder.parentid));
</script>

<main class="flex h-screen w-full overflow-clip">
	<section class="mx-auto flex h-fit w-1/2 flex-col text-white">
		<div class="flex w-full flex-row justify-between italic">
			<p>Folder</p>
			<div class="mr-6 flex w-50 flex-row justify-between text-sm">
				<p>new</p>
				<p>learn</p>
				<p>due</p>
			</div>
		</div>
		<hr />
		{#each rootFolders as folder (folder.id)}
			<Folder {folder} {folders} />
		{/each}
	</section>
</main>