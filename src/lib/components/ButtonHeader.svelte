<script lang="ts">
	import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
	let { text, action } = $props();
</script>

<button
    class="px-3 py-1 hover:bg-[#eeee] rounded-2xl hover:text-black transform transition-all duration-100 ease-in cursor-pointer"
    onclick={() => {goto(resolve(action))}}>
	{text}
</button>
