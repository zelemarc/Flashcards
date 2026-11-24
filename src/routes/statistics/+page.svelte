<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let stats = $derived(data.statistics);
	const duration = (milliseconds: number | null) => {
		if (milliseconds == null) return '—';
		const minutes = Math.round(milliseconds / 60000);
		return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
	};
</script>

<main
	class="mx-auto flex h-[calc(100dvh-5rem)] w-4/5 max-w-5xl flex-col gap-6 overflow-y-auto py-6 font-global text-white"
>
	<header>
		<p class="text-xs tracking-[0.25em] text-white/40 uppercase">your progress</p>
		<h1 class="font-handwritten text-5xl italic">Statistics</h1>
		<p class="mt-1 text-sm text-white/50">Last 30 days and all-time card totals</p>
	</header>

	<section class="grid grid-cols-2 gap-3 md:grid-cols-3">
		{#each [{ label: 'Cards', value: stats.cards.total }, { label: 'New', value: stats.cards.new }, { label: 'Learning', value: stats.cards.learn }, { label: 'Due now', value: stats.cards.due_now }, { label: 'Reviews', value: stats.answers.total }, { label: 'Study streak', value: `${stats.streak_days} days` }] as metric (metric.label)}
			<article class="rounded-2xl border border-white/10 bg-white/5 p-4">
				<p class="text-xs tracking-widest text-white/40 uppercase">{metric.label}</p>
				<p class="mt-2 text-3xl font-bold">{metric.value}</p>
			</article>
		{/each}
	</section>

	<section class="rounded-2xl border border-white/10 bg-white/5 p-4">
		<h2 class="text-lg font-bold">Review summary</h2>
		<div class="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
			<p>Today: <strong>{stats.answers.today}</strong></p>
			<p>
				Accuracy: <strong
					>{stats.answers.accuracy == null
						? '—'
						: `${Math.round(stats.answers.accuracy * 100)}%`}</strong
				>
			</p>
			<p>Total study time: <strong>{duration(stats.answers.total_time_ms)}</strong></p>
			<p>Average answer: <strong>{duration(stats.answers.avg_time_ms)}</strong></p>
		</div>
	</section>

	<section class="rounded-2xl border border-white/10 bg-white/5 p-4">
		<h2 class="text-lg font-bold">Recent activity</h2>
		<div class="mt-3 flex flex-col gap-2">
			{#each stats.daily.slice(-7).reverse() as day (day.date)}
				<div
					class="flex items-center justify-between border-b border-white/5 pb-2 text-sm last:border-0"
				>
					<time datetime={day.date} class="text-white/60">{day.date}</time>
					<span>{day.answers} reviews</span>
					<span class="text-white/40">{duration(day.time_ms)}</span>
				</div>
			{/each}
		</div>
	</section>
</main>
