<script lang="ts">
	import ButtonSlide from '#lib/components/ButtonSlide.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let user = $derived(data.user);
	let token = $derived(data.token);
	let showPassword = $state(false);
	let changePasswordError = $state<string>('');
	let changePasswordSuccess = $state<string>('');

	async function handleChangePassword(
		oldPassword: string,
		newPassword: string,
		repeatPassword: string
	) {
		changePasswordError = '';
		changePasswordSuccess = '';

		if (!oldPassword || !newPassword) {
			changePasswordError = 'Enter both old and new passwords.';
			return;
		}

		if (newPassword !== repeatPassword) {
			changePasswordError = 'New passwords do not match.';
			return;
		}

		if (newPassword.length < 8 || newPassword.length > 32) {
			changePasswordError = 'Password must be 8–32 characters.';
			return;
		}

		const hasUpper = /[A-Z]/.test(newPassword);
		const hasLower = /[a-z]/.test(newPassword);
		const hasNumber = /[0-9]/.test(newPassword);
		const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
		if (!(hasUpper && hasLower && hasNumber && hasSpecial)) {
			changePasswordError =
				'Password must contain uppercase, lowercase, a number, and a special character.';
			return;
		}

		changePasswordSuccess = '';
		try {
			const response = await fetch(
				`${process.env.BACKEND_URL || 'http://127.0.0.1:8000'}/auth/change-password`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
				}
			);

			if (!response.ok) {
				const err = (await response.json()) as { detail?: string };
				changePasswordError = err.detail ?? 'Failed to change password.';
				return;
			}
			changePasswordSuccess = 'Password changed successfully.';
			changePasswordError = '';
		} catch {
			changePasswordError = 'Could not reach the server.';
		}
	}
</script>

{#snippet sectionTitle(text, color)}
	<h2
		class="transform rounded-s-2xl from-(--color)/75 from-10% to-transparent to-80% text-2xl
		        px-2 transition-all duration-100 ease-in hover:bg-linear-to-r hover:italic"
		style="--color: {color}"
	>
		{text}
	</h2>
{/snippet}

<main
	class="h-[calc(100dvh-5rem)] overflow-y-auto scroll-smooth font-global text-white motion-reduce:scroll-auto"
>
	<aside class="absolute not-lg:left-0 lg:left-20">
		<p>
			<a href="#account-acc" class="px-4 rounded-lg w-full transform transition-all duration-100 hover:bg-blue/80">Account</a>
		</p>
		<p><a href="#decks" class="px-4 rounded-lg w-full transform transition-all duration-100 hover:bg-amber/80">Decks</a></p>
		<p>
			<a href="#danger-zone" class="px-4 rounded-lg w-full transform transition-all duration-100 hover:bg-red/80"
				>Danger Zone</a
			>
		</p>
	</aside>
	<main class="mx-auto w-2/3">
		<h2 class="px-2 py-5 font-handwritten text-4xl font-bold italic">Settings</h2>
		<section id="account-acc" class="scroll-mt-24">
		    {@render sectionTitle("Account","oklch(0.511 0.272 263)")}
			<div class="ms-8 my-1">
				<p>email</p>
				<input type="email" value={user.email} readonly class="border-0 border-s-3 border-b-3 rounded-bl-lg border-white bg-transparent" />
			</div>
			<div class="ms-8 my-1">
				<p>password</p>
				<ButtonSlide
					type="button"
					text="Change password"
					onclick={() => {
						const oldPass = prompt('Enter your current password');
						if (oldPass === null) return;
						const newPass = prompt('Enter new password');
						if (newPass === null) return;
						const repeatPass = prompt('Repeat new password');
						if (repeatPass === null) return;
						handleChangePassword(oldPass, newPass, repeatPass);
					}}
				/>
				{#if changePasswordError}
					<p class="mt-2 text-sm text-red-300" role="alert">{changePasswordError}</p>
				{/if}
				{#if changePasswordSuccess}
					<p class="mt-2 text-sm text-green-300" role="alert">{changePasswordSuccess}</p>
				{/if}
			</div>
		</section>
		<section id="decks" class="scroll-mt-24">
            {@render sectionTitle("Folders","oklch(0.769 0.188 70.08)")}
			<div class="ms-8 my-1 flex flex-row">
				<p class="flex flex-col">
					Auto private deck
					<span class="italic font-sm opacity-40 ps-4">~ option in the creating deck window will be automaticlly set to private</span>
				</p>
				<input type="checkbox" class="size-5 bg-transparent border-3 outline-none border-white transform transition-all duration-100 ease-in rounded-bl-lg hover:rounded" />
			</div>
		</section>
		<section id="danger-zone" class="scroll-mt-24 text-red">
            {@render sectionTitle("Danger Zone","oklch(0.626 0.257 29)")}

			<div class="ms-8 my-1">
				<p>Delete account</p>
				<ButtonSlide text="this cannot be undone" onclick={() => {}} color="oklch(0.626 0.257 29)"/>
			</div>
		</section>
	</main>
</main>
