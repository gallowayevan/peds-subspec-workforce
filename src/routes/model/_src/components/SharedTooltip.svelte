<script>
	import { getContext } from 'svelte';
	import IndexCircle from './IndexCircle.svelte';
	import QuadTree from './QuadTree.svelte';

	const { data, width, yScale, zScale, config, yRange } = getContext('LayerCake');

	const titleCase = (d) => d.replace(/^\w/, (w) => w.toUpperCase());

	export let tooltipOffset = 10;
	export let dataset = undefined;
	export let showKey = false;
	export let showIndex = false;
	export let formatTitle = (d) => d;
	export let formatKey = (d) => d;
	export let formatValue = (d) =>
		isNaN(+d) ? d : d.toLocaleString(undefined, { maximumFractionDigits: 2 });

	export let indexLookup = undefined;

	/* --------------------------------------------
	 * Sort the keys by the highest value
	 */
	function sortResult(result) {
		if (Object.keys(result).length === 0) return [];
		const rows = Object.keys(result)
			.filter((d) => d !== $config.x)
			.map((key) => {
				return {
					key,
					value: result[key],
					index: showIndex ? indexLookup.get(key) : ""
				};
			})
			.sort((a, b) => b.value - a.value);
		// console.log(rows);
		return rows;
	}
</script>

<QuadTree
	dataset={dataset || $data}
	y="x"
	let:x
	let:y
	let:visible
	let:found
	let:e
	on:quadtreeItemFound
>
	{#if visible === true}
		<div style="left:{x}px;" class="line" />

		<div
			class="tooltip"
			style="
		
		display: {visible ? 'block' : 'none'};
		top:{($yRange[0] + $yRange[1]) / 2 - tooltipOffset}px;
		left:{Math.min(Math.max(x), $width)}px;"
		>
			<div class="table-container">
				<table class="table is-narrow">
					<thead>
						<tr>
							{#if showIndex}
								<th />
							{/if}
							{#if showKey}
								<th />
							{/if}
							<th style="text-align:right;">{formatTitle(found[$config.x])}</th>
						</tr>
					</thead>
					<tbody>
						{#each sortResult(found) as row}
							<tr>
								{#if showIndex}
									<IndexCircle color={$zScale(row.key)}>
										{row.index}
									</IndexCircle>
								{/if}
								{#if showKey}
									<td style="color:{$zScale(row.key)}; text-align:left;">
										{formatKey(row.key)}
									</td>
								{/if}
								<td style="color:{$zScale(row.key)}; text-align:right;">
									{formatValue(row.value)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</QuadTree>

<style>
	.tooltip {
		position: absolute;
		font-size: 1rem;
		pointer-events: none;
		/* background: rgba(255, 255, 255, 0); */
		transform: translate(-50%, -100%);
		padding: 1px;
		border-radius: 5px;
		border: 1px solid #333333;
		z-index: 200;
		font-weight: 600;
		white-space: nowrap;
	}
	.line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		border-left: 2px dotted #333;
		pointer-events: none;
	}
</style>
