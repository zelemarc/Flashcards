<script lang="ts">
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import Folder from '#lib/components/Folder.svelte';
	import type { folder } from '#lib/components/folder.ts';
	import ChevronRight from '@iconify-svelte/tabler/chevron-right';
	import ChevronLeft from '@iconify-svelte/tabler/chevron-left';
	import { fade } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let folders: folder[] = $derived(data.folders);
	let rootFolders: folder[] = $derived(folders.filter((folder) => !folder.parentid));

	let showForm: boolean = $state(false);
	let newFolder: folder = $state({
		id: '',
		name: '',
		new: 0,
		learn: 0,
		due: 0,
		private: false,
		parentid: null
	});

	// Reset the form when the action succeeds
	$effect(() => {
		if (form?.success) {
			showForm = false;
			newFolder.name = '';
			newFolder.parentid = null;
			newFolder.private = false;
			void invalidateAll();
		}
	});
</script>

<main class="flex h-screen w-full overflow-clip absolute top-0 pt-20">
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
	<footer class="absolute bottom-0 left-[50%] translate-x-[-50%] transform">
		<ButtonSlide text="Create deck" onclick={() => (showForm = true)} />
	</footer>
</main>

{#if showForm}
	<!-- blur background -->
	<div
		transition:fade
		class="absolute top-0 z-10 h-screen w-screen backdrop-blur-md"
		onclick={() => (showForm = !showForm)}
	></div>
	<section
		transition:fade
		class="absolute top-[50%] left-[50%] z-50 translate-[-50%] transform text-white"
	>
		<form
			method="POST"
			action="?/create"
			class="rounded-xl border-3 border-white bg-black p-3 font-global flex flex-col gap-5 scale-110"
		>
			<h2 class="font-handwritten text-xl font-bold">Create new deck</h2>
			<div>
				<p>name</p>
				<input
					type="text"
					name="name"
					required
					class="border-0 border-b-2 border-white bg-transparent"
					bind:value={newFolder.name}
				/>
			</div>
			<div>
				<p>is it a subfolder?</p>
				<select
					name="parentid"
					class="border-0 border-b-2 border-white bg-transparent"
					bind:value={newFolder.parentid}
				>
					<option value="">— top level —</option>
					{#each folders as folder (folder.id)}
						<option value={folder.id}>
							{folder.name}
						</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-row gap-5">
				<button type="button"
					class="{!newFolder.private
						? 'italic opacity-30'
						: 'font-semibold'} transform transition-all duration-100"
						onclick={() => {newFolder.private = true}}>
						Public
				</button>
				<input type="hidden" name="public" value={newFolder.private ? 'true' : 'false'} />
				<input type="checkbox" class="absolute invisible size-0 p-0 m-0" bind:checked={newFolder.private} />
				<div >
					{#if newFolder.private}
						<ChevronLeft height="1.5em" />
					{:else}
						<ChevronRight height="1.5em" />
					{/if}
				</div>
				<button type="button"
					class="{newFolder.private
						? 'italic opacity-30'
						: 'font-semibold'} transform transition-all duration-100"
						onclick={() => {newFolder.private = false}}>
						Private
				</button>
			</div>
			{#if form?.createError}
				<p class="text-sm text-red-300" role="alert">{form.createError}</p>
			{/if}
			<ButtonSlide type="submit" text="Create!" />
		</form>
	</section>
{/if}
