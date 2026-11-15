<script lang="ts">
    let {text, color="#000" } = $props();
</script>

<button
    on:click
	class="px-2 font-global text-lg w-40 isolate transform bg-black transition-all
	duration-75 ease-in hover:italic hover:tracking-tighter hover:bg-(--color)"
	style="--color: {color};"
	><p class="line-clamp-1 w-fit">{text}</p></button
>
