<script>
	import { getContext } from 'svelte';
	import { line, curveMonotoneX } from 'd3-shape';

	const { data, xGet, yGet, zGet, xScale, yScale, xRange, yRange, xDomain, yDomain } = getContext(
		'LayerCake'
	);

	$: lineGen = line()
		.curve(curveMonotoneX)
		.x((d) => $xGet(d))
		.y((d) => $yGet(d));
</script>

<g class="line-group">
	{#each $data as group}
		<path class="path-line" d={lineGen(group.values)} stroke={$zGet(group)} />
	{/each}
</g>

<style>
	.path-line {
		fill: none;
		stroke-width: 3px;
	}
</style>
