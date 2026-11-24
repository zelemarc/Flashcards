<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { draw, slide } from 'svelte/transition';
	import SearchIcon from '@iconify-svelte/tabler/search';
	import ButtonHeader from '#lib/components/ButtonHeader.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { cubicIn, cubicInOut } from 'svelte/easing';
	let { children, data }: LayoutProps = $props();
	let searchfocused = $state(false);
	let search = $state('');
	let searchInput = $state<HTMLInputElement | null>(null);
	let user = $derived(data.user);

	// Focus the input once it has actually been mounted/rendered.
	$effect(() => {
		if (searchfocused) searchInput?.focus();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="h-screen w-screen bg-[#040404]">
	<header
		class="fixed z-50 m-1 flex h-fit w-full justify-between rounded-2xl border
		border-white/20 bg-gray-400/15 px-4 py-2 backdrop-blur-xl"
	>
		<a href={resolve('')} title="Home">
			<h1 class="font-handwritten text-3xl text-white italic">Flashcard</h1></a
		>

		<a
			href={resolve('')}
			title="Home"
			class="h-fit w-fit hover:bg-black hover:mix-blend-difference"
		>
			<svg
				class="absolute left-[50%] translate-x-[-50%] transform transition-all duration-100 ease-in hover:rotate-6
				{user != null ? 'animate-[spin_1s]' : ''}"
				width="2.4rem"
				height="2.4rem"
				viewBox="0 0 150 150"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g>
					<path
						transition:draw={{ duration: 1000 }}
						transform="matrix(1 0 0 1 0 0)"
						d="M75 0L91.752 51.943L146.329 51.824L102.105 83.807L119.084 135.676L75 103.5L30.916 135.676L47.895 83.807L3.671 51.824L58.248 51.943Z"
						fill="#FFFFFF"
					/>
				</g>
			</svg>
		</a>

		<div class="flex w-fit flex-row self-center font-global text-white">
			<div class="flex flex-row gap-2">
				{#if user != null}
					<!-- search button -->
					<div
						role="search"
						class="flex h-fit cursor-pointer flex-row justify-center rounded-2xl px-3 py-1
					align-middle transition-all duration-100 ease-in hover:bg-[#eeee] hover:text-black"
						onfocusin={() => (searchfocused = true)}
						onfocusout={(event) => {
							// Only close when focus leaves the search area and nothing was typed.
							if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
							if (search === '') searchfocused = false;
						}}
					>
						<button
							type="button"
							aria-label="Search"
							title="Search"
							class="flex cursor-pointer items-center"
							onclick={() => (searchfocused = true)}
						>
							<SearchIcon height="1.4em" class="self-center" />
						</button>
						{#if searchfocused}
							<input
								type="text"
								placeholder="search..."
								bind:this={searchInput}
								bind:value={search}
								class="h-[1.4em] border-none bg-transparent outline-0"
								transition:slide={{ axis: 'x', easing: cubicInOut }}
								onkeydown={(event) => {
									if (event.key === 'Escape') {
										search = '';
										searchfocused = false;
									}
									if (event.key === 'Enter') {
										const query = search.trim();
										if (!query) return;
										search = '';
										searchfocused = false;
										goto(resolve('/search/[search]', { search: query }));
									}
								}}
							/>
						{/if}
					</div>
					<ButtonHeader text="Statistics" action="/statistics" />
					<ButtonHeader text="Settings" action="/settings" />
					<form method="POST" action="/logout">
						<button
							type="submit"
							class="transform cursor-pointer rounded-lg px-3 py-1 text-white/70 transition-all duration-100 ease-in hover:bg-white/10 hover:text-white"
						>
							Logout
						</button>
					</form>
				{:else}
					<button
						class="transform cursor-pointer rounded-lg bg-red-500/60 px-3 py-1
						text-gray-200 transition-all duration-100 ease-in hover:bg-red-700"
						onclick={() => goto(resolve('/login'))}
					>
						Login
					</button>
				{/if}
			</div>
		</div>
	</header>
	<section class="pt-20">
		{@render children()}
	</section>
</section>
