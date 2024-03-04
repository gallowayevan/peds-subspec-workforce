<script>
	import { getContext } from 'svelte';

	const { width, padding, xRange, yScale, yRange, config } = getContext('LayerCake');

	const cap = (val) => val.replace(/^\w/, (d) => d.toUpperCase());

	export let ticks = 4;
	export let tickMarks = false;
	export let gridlines = true;
	export let formatTick = (d) => d;
	export let xTick = 0;
	export let yTick = 0;
	export let dxTick = -5;
	export let dyTick = 5;
	export let textAnchor = 'end';
	export let labelText = cap($config.y);
	export let dxLabel = 0;
	export let dyLabel = -$padding.left; //Default is rotated so dy moves in x direction
	export let labelRotate = undefined;

	$: isBandwidth = typeof $yScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks)
		? ticks
		: isBandwidth
		? $yScale.domain()
		: typeof ticks === 'function'
		? ticks($yScale.ticks())
		: $yScale.ticks(ticks);
</script>

<g class="axis y-axis" transform="translate(0, 0)">
	{#each tickVals as tick, i}
		<g
			class="tick tick-{tick}"
			transform="translate({$xRange[0] + (isBandwidth ? $padding.left : 0)}, {$yScale(tick)})"
		>
			{#if gridlines !== false}
				<line
					class="gridline"
					x2={$width}
					y1={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
					y2={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
				/>
			{/if}
			{#if tickMarks === true}
				<line
					class="tick-mark"
					x1="0"
					x2={isBandwidth ? -6 : 6}
					y1={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
					y2={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
				/>
			{/if}
			<text
				x={xTick}
				y={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
				dx={isBandwidth ? -9 : dxTick}
				dy={isBandwidth ? 4 : dyTick}
				style="text-anchor:{isBandwidth ? 'end' : textAnchor};">{formatTick(tick)}</text
			>
		</g>
	{/each}

	<!-- Axis Label -->
	<g
		class="tick"
		transform="translate({$xRange[0] + (isBandwidth ? $padding.left : 0)}, {($yRange[0] +
			$yRange[1]) /
			2}) rotate({isBandwidth ? 0 : labelRotate ? labelRotate : 270})"
	>
		<text
			x={xTick}
			y={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
			dx={isBandwidth ? -9 : dxLabel}
			dy={isBandwidth ? 4 : dyLabel}
			style="text-anchor:{isBandwidth ? 'end' : 'middle'}; font-weight: 600;">{labelText}</text
		>
	</g>
</g>

<style>
	.tick {
		font-size: 1em;
		/* font-weight: 200; */
	}

	.tick line {
		stroke: #a3a3a3;
	}

	.tick text {
		fill: #666;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}
</style>
