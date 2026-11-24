<script>
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
</script>

<main
	class="h-[calc(100dvh-5rem)] overflow-y-auto scroll-smooth font-global text-white motion-reduce:scroll-auto"
>
	<aside class="absolute not-lg:left-0 lg:left-20">
		<p>
			<a href="#account-acc" class="transform transition-all duration-100 hover:bg-blue">Account</a>
		</p>
		<p>
			<a href="#app-behavior" class="transform transition-all duration-100 hover:bg-green"
				>App Behavior</a
			>
		</p>
		<p><a href="#decks" class="transform transition-all duration-100 hover:bg-amber">Decks</a></p>
		<p>
			<a href="#danger-zone" class="transform transition-all duration-100 hover:bg-red"
				>Danger Zone</a
			>
		</p>
	</aside>
	<main class="mx-auto w-2/3">
		<section id="account-acc" class="scroll-mt-24">
			<h2
				class="transform from-blue from-10% to-transparent to-80% transition-all duration-100 hover:bg-linear-to-r"
			>
				Account
			</h2>
			<div>
				<p>name</p>
				<input type="text" />
			</div>
			<div>
				<p>email</p>
				<input type="email" />
			</div>
			<div>
				<p>password</p>
				<input type="password" />
			</div>
		</section>
		<section id="app-behavior" class="scroll-mt-24">
			<h2
				class="transform from-green from-10% to-transparent to-80% transition-all duration-100 hover:bg-linear-to-r"
			>
				App behavior
			</h2>
			<div class="flex h-fit flex-row gap-2 align-bottom">
				<p>Auto-Sync</p>
				<input type="checkbox" />
			</div>
			<div class="flex h-fit flex-row gap-2 align-bottom">
				<p>Type of cover for the answer</p>
				<select>
					<option>Blur</option>
					<option>blank</option>
					<option>costume color</option>
				</select>
			</div>
		</section>
		<section id="decks" class="scroll-mt-24">
			<h2
				class="transform from-amber from-10% to-transparent to-80% transition-all duration-100 hover:bg-linear-to-r"
			>
				Decks
			</h2>
			<div>
				<p>name</p>
				<input type="text" />
			</div>
			<div>
				<p>
					Auto private deck <details>
						is an option for every new created deck to be set to private. This means that no one
						will be able to copy new decks
					</details>
				</p>
				<input type="text" />
			</div>
		</section>
		<section id="danger-zone" class="scroll-mt-24 text-red">
			<h2
				class="transform from-red/70 from-10% to-transparent to-80% transition-all duration-100 hover:bg-linear-to-r"
			>
				Danger Zone
			</h2>
			<div>
				<p>Delete account</p>
				<ButtonSlide text="ok..." onclick={() => {}} />
			</div>
			<div></div>
		</section>
	</main>
</main>

<style>
	h2 {
		font-size: 2rem;
		padding: 0.1rem 0.5rem;
		border-radius: 0.5rem 0rem 0rem 0.5rem;
	}
	div:hover p {
		font-style: italic;
	}
	section {
		padding: 1rem;
		transition: all 100ms ease-in-out;
	}
	section div {
		padding-left: 2rem;
	}
	input[type='text'],
	input[type='email'],
	input[type='password'] {
		accent-color: none;
		background-color: transparent;
		border: none;
		border-bottom: 1px white solid;
		border-image: linear-gradient(to right, white, transparent) 1;
		border-bottom-left-radius: 5px;
	}
</style>
