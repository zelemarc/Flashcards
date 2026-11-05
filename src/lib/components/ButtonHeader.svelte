<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	let { text, action } = $props();
</script>

<button
	class="transform cursor-pointer rounded-2xl px-3 py-1 transition-all duration-100 ease-in hover:bg-[#eeee] hover:text-black"
	onclick={() => {
		goto(resolve(action));
	}}
>
	{text}
</button>
