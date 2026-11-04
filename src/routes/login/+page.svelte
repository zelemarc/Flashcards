<script lang="ts">
	import ButtonSlide from "#lib/components/ButtonSlide.svelte";
	import { cubicInOut } from "svelte/easing";
	import { slide } from "svelte/transition";

	let login = $state(false);

	let email = $state("");
	let password = $state("");
	let reapetpassword = $state("");
</script>

<main class="relative grid min-h-[calc(100svh)] w-full grid-cols-2 overflow-clip">
   	<div
		class="absolute top-[-12%] bottom-[-12%] -left-20 z-0 transform transition-all duration-200 {login ? 'w-[65%]':'w-[55%]'} -rotate-10  bg-red-700/90"
	></div>
	<div
		class="absolute top-[-12%] bottom-[-12%] {login ? '-right-40':'-right-20'} z-0 transform transition-all duration-200 w-[55%] -rotate-10 bg-green-700/90"
	></div>
    {#if !login}
	<div
	transition:slide={{axis: "x", easing: cubicInOut}}
		class="absolute top-[-12%] bottom-[-12%] -left-20 z-40 w-[55%] -rotate-10 transform backdrop-blur-lg bg-gray-300/15"
	></div>
	{:else}
	<div
	transition:slide={{axis: "x", easing: cubicInOut}}
		class="absolute top-[-12%] bottom-[-12%] -right-40 z-40 w-[55%] -rotate-10 transform backdrop-blur-lg bg-gray-300/15"
	></div>
	{/if}
    <!-- login left side -->
	<div class="z-10 transform mt-60 w-full px-20 transition-all duration-200 {login ? '' : 'scale-90'}">
		<p class="mx-auto font-handwritten text-4xl font-bold text-white italic">Login</p>
		<p class="font-global">Log in to your account, if you dont remember the password, well your bad, create a new account then.</p>
		<form class="flex flex-col gap-2 text-global">
		    <fieldset class="border-2 border-white rounded-xl bg-transparent">
				<legend class="border-2 px-3 font-bold italic text-sm border-white bg-transparent rounded-2xl mx-2 text-white">Email</legend>
				<input type="email"
				placeholder="jakubwarkusz@exmaple.com"
				class="w-full border-none bg-transparent outline-none rounded-lg text-white"
				bind:value={email}/>
			</fieldset>

			<fieldset class="border-2 border-white rounded-xl bg-transparent">
            	<legend class="border-2 px-3 font-bold italic text-sm border-white bg-transparent rounded-2xl mx-2 text-white">Password</legend>
            	<input type="password"
            	placeholder="************"
            	class="w-full border-none bg-transparent outline-none rounded-lg text-white"
                bind:value={password}/>
            </fieldset>
			<ButtonSlide text="Login" onclick={() => {alert("warkusz")}} disabled={!login}/>
		</form>
	</div>
<!-- register right side -->
	<div class="z-10 transform mt-40 w-full px-20 transition-all duration-200 {!login ? '' : 'scale-90'}">
		<p class="mx-auto font-handwritten text-4xl font-bold text-white italic">Create your account!</p>
		<!-- <p class="font-global">Create your own account</p> -->
		<div class="h-4"></div>
		<form class="flex flex-col gap-2 text-global">
		    <fieldset class="border-2 border-white rounded-xl bg-transparent">
				<legend class="border-2 px-3 font-bold italic text-sm border-white bg-transparent rounded-2xl mx-2 text-white">Email</legend>
				<input type="email"
				placeholder="jakubwarkusz@exmaple.com"
				class="w-full border-none bg-transparent outline-none rounded-lg text-white"
				bind:value={email}/>
			</fieldset>

			<fieldset class="border-2 border-white rounded-xl bg-transparent">
            	<legend class="border-2 px-3 font-bold italic text-sm border-white bg-transparent rounded-2xl mx-2 text-white">Password</legend>
            	<input type="password"
            	placeholder="************"
            	class="w-full border-none bg-transparent outline-none rounded-lg text-white"
                bind:value={password}/>
            </fieldset>

            <fieldset class="border-2 border-white rounded-xl bg-transparent">
                     	<legend class="border-2 px-3 font-bold italic text-sm border-white bg-transparent rounded-2xl mx-2 text-white">
                          Reapet Password</legend>
                     	<input type="password"
                     	placeholder="************"
                     	class="w-full border-none bg-transparent outline-none rounded-lg text-white"
                         bind:value={reapetpassword}/>
                     </fieldset>
                     <p class="text-white font-global">Remember that the passwords <span class="">MUST</span> be the same, and they have to:</p>
                     <dl class="text-white font-global" type="dot">
                         <dt>have a BIG letter (A-Z)</dt>
                         <dt>have a small letter (a-z)</dt>
                         <dt>have a number (0-9)</dt>
                         <dt>have a special character (^,%,!,*,etc.)</dt>
                         <dt>be between 8-32 characters long</dt>
                     </dl>

			<ButtonSlide text="Make it!" onclick={() => {alert("warkusz")}} disabled={login}/>
		</form>
	</div>

	{#if login}
	<div transition:slide={{axis: 'y'}} class="self-center justify-self-center font-global text-white z-50 col-start-1">
		<p>Don't have an account yet?</p>
		<ButtonSlide text="CREATE IT!" onclick={() => {login = false}}/>
	</div>
	{:else}
	<div transition:slide={{axis: 'y'}} class="self-center justify-self-center font-global text-white z-50 col-start-1">
		<p>Have an account?</p>
		<ButtonSlide text="Login then!" onclick={() => {login = true}}/>
	</div>
	{/if}
</main>
