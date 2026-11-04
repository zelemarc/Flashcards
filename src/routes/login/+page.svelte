<script lang="ts">
	import ButtonSlide from "#lib/components/ButtonSlide.svelte";

	let login = $state(true);
	let email = $state("");
</script>

<main class="relative grid min-h-[calc(100svh)] w-full grid-cols-2 overflow-clip">
	<div
		class="absolute top-[-12%] bottom-[-12%] -left-20 z-0 w-[55%] -rotate-10 transform bg-red-700/90"
	></div>
	<div class="z-10 transform mt-60 w-full px-20">
		<p class="mx-auto font-handwritten text-4xl font-bold text-white italic">Login</p>
		<p class="font-global">Log in to your account, if you dont remember the password, well your bad, create a new account then.</p>
		<form class="flex flex-col gap-2 text-global">
		    <fieldset class="border-2 border-white rounded-xl bg-transparent">
				<legend class="border-2 px-3 font-bold italic text-sm border-white bg-transparent rounded-2xl mx-2 text-white">email</legend>
				<input type="email"
				placeholder="jakubwarkusz@exmaple.com"
				class="w-full border-none bg-transparent outline-none rounded-lg text-white" />
			</fieldset>

			<input type="password" placeholder="***********" />
			<ButtonSlide text="Login"/>
		</form>
	</div>
	<div
		class="absolute top-[-12%] bottom-[-12%] -right-10 z-0 w-[50%] -rotate-10 transform bg-green-700/90"
	></div>

	<div class="self-center justify-self-center font-global text-white">
		<p>Don't have an account yet?</p>
		<ButtonSlide text="CREATE IT!"/>
	</div>
</main>
