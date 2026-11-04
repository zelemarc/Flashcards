<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { draw } from 'svelte/transition';
	import ButtonHeaderGroup from '#lib/components/ButtonHeaderGroup.svelte';
	import ButtonHeader from '#lib/components/ButtonHeader.svelte';
	import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
	let { children }: LayoutProps = $props();

	let user = null;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="h-screen w-full bg-[#040404]">
	<header
		class="fixed m-1 flex h-fit w-full justify-between rounded-2xl border border-white/20
		bg-gray-400/15 px-4 py-2 backdrop-blur-xl z-50"
	>
		<h1 class="font-handwritten text-3xl text-white italic">Flash<span>card</span></h1>

		<a href={resolve("")} title="Home" class="hover:mix-blend-difference hover:bg-black w-fit h-fit">
		<svg
			class="absolute left-[50%] translate-x-[-50%] transform"
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
				<ButtonHeader text="Home" action=""/>
				{#if user != null}
				<ButtonHeader text="Folders" action="/folder"/>
				<ButtonHeader text="Statistics" action='/statistics' />
				{/if}
				<ButtonHeader text="About" action='/about' />
				{#if user != null}
					<ButtonHeader text="Settings" action="/settings" />
				{:else}
					<button
						class="transform rounded-lg px-3 py-1 transition-all duration-100
						ease-in bg-red-500/60 hover:bg-red-700 text-gray-200 cursor-pointer"
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
