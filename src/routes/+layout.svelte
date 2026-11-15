<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { draw, slide } from 'svelte/transition';
	import SearchIcon from '@iconify-svelte/tabler/search';
	import ButtonHeaderGroup from '#lib/components/ButtonHeaderGroup.svelte';
	import ButtonHeader from '#lib/components/ButtonHeader.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { cubicIn, cubicInOut } from 'svelte/easing';
	let { children }: LayoutProps = $props();
	let searchfocused = $state(false);
	let search = $state('');
	let user = true;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="h-screen w-screen bg-[#040404]">
	<header
		class="fixed z-50 m-1 flex h-fit w-full justify-between rounded-2xl border
		border-white/20 bg-gray-400/15 px-4 py-2 backdrop-blur-xl"
	>
		<h1 class="font-handwritten text-3xl text-white italic">Flashcard</h1>

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
			<ButtonHeaderGroup>
				{#if user != null}
					<!-- search button -->
					<button onfocusin={() => searchfocused = true}
					onfocusout={() => search === "" ? searchfocused = false : null}
					class="flex flex-row cursor-pointer rounded-2xl px-3 py-1 transition-all h-fit
					duration-100 ease-in hover:bg-[#eeee] hover:text-black justify-center align-middle">
						<SearchIcon height="1.4em" class="self-center"/>
						{#if searchfocused}
						    <input type="text" placeholder="search..." bind:value={search} class="bg-transparent border-none outline-0 h-[1.4em]" transition:slide={{axis: 'x', easing: cubicInOut}}/>
						{/if}
					</button>
					<ButtonHeader text="Statistics" action="/statistics" />
					<ButtonHeader text="Settings" action="/settings" />
				{:else}
					<button
						class="transform cursor-pointer rounded-lg bg-red-500/60 px-3 py-1
						text-gray-200 transition-all duration-100 ease-in hover:bg-red-700"
						onclick={() => goto(resolve('/login'))}
					>
						Login
					</button>
				{/if}
			</ButtonHeaderGroup>
		</div>
	</header>
	{@render children()}
</section>
