<script lang="ts">
	import { slide } from "svelte/transition";

    let {text = "button"} = $props();
    let mouseover = $state(false);
</script>

<button class="relative  rounded-xl border-4 border-white px-3 py-1 italic
    font-bold transform transition-all duration-100 ease-in hover:scale-105 focus:animate-scaling"
    onmouseenter={() => {mouseover = true}}
    onmouseleave={() => {mouseover = false}}>
    <span class="invert-100 text-black z-50">{text}</span>
    {#if mouseover}
        <div transition:slide class="absolute w-full top-[0%] bottom-[0%] rounded-lg bg-white left-0 z-0 mix-blend-difference"></div>
    {/if}
</button>
