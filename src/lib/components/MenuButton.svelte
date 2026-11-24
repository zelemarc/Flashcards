<script lang="ts">
	let {
		text,
		color = '#000',
		onclick
	}: {
		text: string;
		color?: string;
		onclick?: (event: MouseEvent) => void;
	} = $props();
</script>

<button
	{onclick}
	class="isolate w-40 transform bg-black px-2 font-global text-lg transition-all
	duration-75 ease-in hover:bg-(--color) hover:tracking-tighter hover:italic"
	style="--color: {color};"><p class="line-clamp-1 w-fit">{text}</p></button
>
