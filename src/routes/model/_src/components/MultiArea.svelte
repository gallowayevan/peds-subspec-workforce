<script>
	import { area, curveMonotoneX } from 'd3-shape';

	import { getContext } from 'svelte';

	const { data, xGet, yScale, zGet } = getContext('LayerCake');

	export let topKey = undefined;
	export let bottomKey = undefined;
	export let opacity = 0.7;

	$: areaGen = area()
		.x((d) => $xGet(d))
		.y0((d) => $yScale(d[topKey]))
		.y1((d) => $yScale(d[bottomKey]))
		.curve(curveMonotoneX);
</script>

<g class="area-group">
	{#each $data as d}
		<path class="path-area" d={areaGen(d.values)} fill={$zGet(d)} {opacity} />
	{/each}
</g>
