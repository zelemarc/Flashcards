<script lang="ts">
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import type { card } from '#lib/components/card.ts';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    let newCard: card = $state({
      id: '',
      question: '',
      answer: '',
      showIn: '',
      // svelte-ignore state_referenced_locally
      deckid: data.folder.id,
      created: ''
    });

    // The checkbox itself is state...
    let reversed = $state(false);

    // ...and the reversed card is derived from it. Runs automatically
    // whenever `reversed`, `newCard.question` or `newCard.answer` change.
    let reversedCard: card | null = $derived(
      reversed ? { ...newCard, question: newCard.answer, answer: newCard.question } : null
    );
</script>

<main class="flex h-screen w-full overflow-clip">
    <section class="flex flex-col gap-2 h-fit w-full text-white">
        <header class="flex flex-row gap-2">
            <select class="bg-transparent text-white w-fit" bind:value={newCard.deckid}>
                {#each data.folders as folder (folder.id)}
                <option value={folder.id}>
                    {folder.name}
                </option>
                {/each}
            </select>
        </header>
        <section class="w-full flex flex-col gap-2">
            <p class="font-mono text-sm">Question</p>
            <input type="text" bind:value={newCard.question} class="bg-transparent"/>
            <p class="font-mono text-sm">Answer</p>
            <input type="text" bind:value={newCard.answer} class="bg-transparent" />
        </section>
        <footer class="mx-auto">
            <ButtonSlide text="add card" />
        </footer>
    </section>
</main>
