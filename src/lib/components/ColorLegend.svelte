<!-- Copyright 2021, Observable Inc.
Released under the ISC license.
https://observablehq.com/@d3/color-legend 

This is a Svelte compatible derivation for only the sequential scale case.-->
<script>
	import { onMount } from 'svelte';
	import { ticks } from 'd3-array';
	import {scaleLinear} from 'd3-scale';

	export let color;
	export let title;
	export let tickSize = 6;
	export let width = 320;
	export let height = 50 + 6; //6 is ticksize
	export let marginTop = 18;
	export let marginRight = 0;
	export let marginBottom = 16 + 6; //6 is tick size
	export let marginLeft = 0;
	export let tickCount = width / 64;
	export let tickFormat = (t) => t.toLocaleString();
	export let tickValues;

	let canvas;
	let n = 256;

	const scaling = 1.2;

	$: domain = color.domain();
	$: tickValuesRendered = tickValues ? tickValues : ticks(...domain, tickCount);
	$: interpolator = color.copy().interpolator();
	$: rampBase64 = canvas?.toDataURL();
	$: x = scaleLinear().domain(domain).range([marginLeft,  width - marginRight])

	onMount(() => {
		const context = canvas.getContext('2d');
		for (let i = 0; i < n; ++i) {
			context.fillStyle = interpolator(i / (n - 1));
			context.fillRect(i, 0, 1, 1);
		}
	});
</script>

<!-- This canvas element is just to generate the base64 encoding for the scale. -->
<canvas bind:this={canvas} width="256" height="1" style="display:none;" />

<svg
	{width}
	{height}
	viewBox="0,0,{width},{height}"
	style="overflow: visible; display: block;"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	><g transform="scale({scaling})"
		><image
			x={marginLeft}
			y={marginTop}
			width={width - marginLeft - marginRight}
			height={height - marginTop - marginBottom}
			preserveAspectRatio="none"
			xlink:href={rampBase64}
		/><g font-size="{1/scaling}rem"
			transform="translate(0,{height - marginBottom})"
			fill="none"
			text-anchor="middle"
		>
			<g>
				{#each tickValuesRendered as tick}
					<g  opacity="1" transform="translate({x(tick)},0)"
						><line stroke="currentColor" y2={tickSize} y1="-16" /><text
							fill="currentColor"
							y="9"
							dy="0.71em">{tickFormat(tick)}</text
						></g
					>
				{/each}
				</g
			><text
				x={marginLeft}
				y={marginTop + marginBottom - height - 6}
				fill="currentColor"
				text-anchor="start"
				>{title}</text
			></g
		>
	</g>
	></svg
>




