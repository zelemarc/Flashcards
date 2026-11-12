<script lang="ts">
    let {text} = $props();
</script>

<button
    on:click
	class="px-2 font-global text-lg  w-fit isolate transform bg-black transition-all duration-75 ease-in hover:italic hover:tracking-tighter hover:invert"
	>{text}</button
>
