<script lang="ts">
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let login = $state(false);

	let email = $state('');
	let password = $state('');
	let reapetpassword = $state('');
</script>

<main class="relative grid min-h-[calc(100svh)] w-full grid-cols-2 overflow-clip">
	<div
		class="absolute top-[-12%] bottom-[-12%] -left-20 z-0 transform transition-all duration-200 {login
			? 'w-[65%]'
			: 'w-[55%]'} -rotate-10 bg-red-700/90"
	></div>
	<div
		class="absolute top-[-12%] bottom-[-12%] {login
			? '-right-40'
			: '-right-20'} z-0 w-[55%] -rotate-10 transform bg-green-700/90 transition-all duration-200"
	></div>
	{#if !login}
		<div
			transition:slide={{ axis: 'x', easing: cubicInOut }}
			class="absolute top-[-12%] bottom-[-12%] -left-20 z-40 w-[55%] -rotate-10 transform bg-gray-300/15 backdrop-blur-lg"
		></div>
	{:else}
		<div
			transition:slide={{ axis: 'x', easing: cubicInOut }}
			class="absolute top-[-12%] -right-40 bottom-[-12%] z-40 w-[55%] -rotate-10 transform bg-gray-300/15 backdrop-blur-lg"
		></div>
	{/if}
	<!-- login left side -->
	<div
		class="z-10 mt-60 w-full transform px-20 transition-all duration-200 {login ? '' : 'scale-90'}"
	>
		<p class="mx-auto font-handwritten text-4xl font-bold text-white italic">Login</p>
		<div class="h-4"></div>
		<form class="text-global flex flex-col gap-2">
			<fieldset class="rounded-xl border-2 border-white bg-transparent">
				<legend
					class="mx-2 rounded-2xl border-2 border-white bg-transparent px-3 text-sm font-bold text-white italic"
					>Email</legend
				>
				<input
					type="email"
					placeholder="jakubwarkusz@exmaple.com"
					class="w-full rounded-lg border-none bg-transparent text-white outline-none"
					bind:value={email}
				/>
			</fieldset>

			<fieldset class="rounded-xl border-2 border-white bg-transparent">
				<legend
					class="mx-2 rounded-2xl border-2 border-white bg-transparent px-3 text-sm font-bold text-white italic"
					>Password</legend
				>
				<input
					type="password"
					placeholder="************"
					class="w-full rounded-lg border-none bg-transparent text-white outline-none"
					bind:value={password}
				/>
			</fieldset>
			<ButtonSlide
				text="Login"
				onclick={() => {
					alert('warkusz');
				}}
				disabled={!login}
			/>
		</form>
	</div>
	<!-- register right side -->
	<div
		class="z-10 mt-40 w-full transform px-20 transition-all duration-200 {!login ? '' : 'scale-90'}"
	>
		<p class="mx-auto font-handwritten text-4xl font-bold text-white italic">
			Create your account!
		</p>
		<div class="h-4"></div>
		<form class="text-global flex flex-col gap-2">
			<fieldset class="rounded-xl border-2 border-white bg-transparent">
				<legend
					class="mx-2 rounded-2xl border-2 border-white bg-transparent px-3 text-sm font-bold text-white italic"
					>Email</legend
				>
				<input
					type="email"
					placeholder="jakubwarkusz@exmaple.com"
					class="w-full rounded-lg border-none bg-transparent text-white outline-none"
					bind:value={email}
				/>
			</fieldset>

			<fieldset class="rounded-xl border-2 border-white bg-transparent">
				<legend
					class="mx-2 rounded-2xl border-2 border-white bg-transparent px-3 text-sm font-bold text-white italic"
					>Password</legend
				>
				<input
					type="password"
					placeholder="************"
					class="w-full rounded-lg border-none bg-transparent text-white outline-none"
					bind:value={password}
				/>
			</fieldset>

			<fieldset class="rounded-xl border-2 border-white bg-transparent">
				<legend
					class="mx-2 rounded-2xl border-2 border-white bg-transparent px-3 text-sm font-bold text-white italic"
				>
					Reapet Password</legend
				>
				<input
					type="password"
					placeholder="************"
					class="w-full rounded-lg border-none bg-transparent text-white outline-none"
					bind:value={reapetpassword}
				/>
			</fieldset>
			<p class="font-global text-white">
				Remember that the passwords <span class="">MUST</span> be the same, and they have to:
			</p>
			<dl class="font-global text-white" type="dot">
				<dt>have a BIG letter (A-Z)</dt>
				<dt>have a small letter (a-z)</dt>
				<dt>have a number (0-9)</dt>
				<dt>have a special character (^,%,!,*,etc.)</dt>
				<dt>be between 8-32 characters long</dt>
			</dl>

			<ButtonSlide
				text="Make it!"
				onclick={() => {
					alert('warkusz');
				}}
				disabled={login}
			/>
		</form>
	</div>

	{#if login}
		<div
			transition:slide={{ axis: 'y' }}
			class="z-50 col-start-1 self-center justify-self-center font-global text-white"
		>
			<p>Don't have an account yet?</p>
			<ButtonSlide
				text="CREATE IT!"
				onclick={() => {
					login = false;
				}}
			/>
		</div>
	{:else}
		<div
			transition:slide={{ axis: 'y' }}
			class="z-50 col-start-1 self-center justify-self-center font-global text-white"
		>
			<p>Have an account?</p>
			<ButtonSlide
				text="Login then!"
				onclick={() => {
					login = true;
				}}
			/>
		</div>
	{/if}
</main>
