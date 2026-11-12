<script lang="ts">
	import Folder from '#lib/components/Folder.svelte';
	import type { folder } from '#lib/components/folder.ts';

	let folders: folder[] = [
		{ id: '0', name: 'polski', subfolders: null, new: 0, learn: 0, due: 0, private: false },
		{ id: '1', name: 'matemtyka', subfolders: null, new: 0, learn: 0, due: 0, private: true },
		{
			id: '2',
			name: 'informatyka',
			subfolders: [
				{ id: '20', name: 'cpp',subfolders: null, new: 0, learn: 0, due: 0, private: true },
				{ id: '21', name: 'python',subfolders: null, new: 0, learn: 0, due: 0, private: false }
			],
			new: 0,
			learn: 0,
			due: 0,
			private: false
		}
	];

	// dodac opcje prywatne / publiczny folder/deck kart
	// opcja sklonowania nie swojego decku i zmieniania go
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
