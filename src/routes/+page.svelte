<script lang="ts">
	import { onMount } from 'svelte';
	import Folder from '#lib/components/Folder.svelte';
	import type { folder } from '#lib/components/folder.ts';

	let folders: folder[] = $state([]);

	onMount(async () => {
		const res = await fetch('http://localhost:8000/folders');
		folders = await res.json();
	});
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
			<Folder id={folder.id} name={folder.name} subfolders={folder?.subfolders || null} />
		{/each}
	</section>
</main>
