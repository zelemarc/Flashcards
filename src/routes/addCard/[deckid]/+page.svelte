<script lang="ts">
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	// This initial state intentionally comes from the route's initial deck selection.
	// svelte-ignore state_referenced_locally
	let folderId = $state(data.folder.id);
</script>

<main class="flex h-screen w-full overflow-clip">
	<section class="flex h-fit w-full flex-col gap-2 text-white">
		<form method="POST" action="?/create" use:enhance class="flex flex-col gap-2">
			<header class="flex flex-row gap-2">
				<select name="folderId" class="w-fit bg-transparent text-white" bind:value={folderId}>
					{#each data.folders as folder (folder.id)}
						<option value={folder.id} class="bg-black">{folder.name}</option>
					{/each}
				</select>
			</header>
			<section class="flex w-full flex-col gap-2">
				<label for="question" class="font-mono text-sm">Question</label>
				<input id="question" name="question" type="text" required class="bg-transparent" />
				<label for="answer" class="font-mono text-sm">Answer</label>
				<input id="answer" name="answer" type="text" required class="bg-transparent" />
			</section>
			{#if form?.error}
				<p class="text-sm text-red-300" role="alert">{form.error}</p>
			{/if}
			<footer class="mx-auto">
				<ButtonSlide
					text="add card"
					type="submit"
					onclick={() => goto(resolve('/addCard/[deckid]', { deckid: folderId }))}
				/>

				<ButtonSlide
					text="add card & go to check"
					type="submit"
					onclick={() => goto(resolve('/modifyDeck/[deckid]', { deckid: folderId }))}
				/>
			</footer>
		</form>
	</section>
</main>
