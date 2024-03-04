<script>
	import { getContext } from 'svelte';
	import { ticks } from 'd3-array';

	const { yRange } = getContext('LayerCake');

	export let gradientId = undefined;
	export let color = undefined;
	export let numberOfStops = 10;

	const stops = ticks(0, 1, numberOfStops);
	const interpolator = color.interpolator();
</script>

<linearGradient
	id={gradientId}
	gradientUnits="userSpaceOnUse"
	x1="0"
	y1={$yRange[0]}
	x2="0"
	y2={$yRange[1]}
>
	{#each stops as stop}
		<stop offset={stop} stop-color={interpolator(stop)} />
	{/each}
</linearGradient>
