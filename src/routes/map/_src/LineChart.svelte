<script>
	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleOrdinal } from 'd3-scale';
	import { groups } from 'd3-array';

	import { projectionStartYear } from '$lib/settings/default';
	import options from '$lib/settings/options.js';

	import MultiLine from '../../model/_src/components/MultiLine.svelte';
	import AxisX from '../../model/_src/components/AxisX.svelte';
	import AxisY from '../../model/_src/components/AxisY.svelte';
	import Labels from '../../model/_src/components/Labels.svelte';
	import SharedTooltip from '../../model/_src/components/SharedTooltip.svelte';
	import HistoricalAnnotation from '../../model/_src/components/HistoricalAnnotation.svelte';
	import MultiArea from '../../model/_src/components/MultiArea.svelte';
	import { makeLabelMap } from '$lib/utilities';
	import GradientDefinition from './GradientDefinition.svelte';
	import LineChartTags from './LineChartTags.svelte';

	export let data = [];
	export let yDomain = [0, null];
	export let color = undefined;
	export let formatValue = d=>d.toLocaleString();

	let showConfidenceIntervals = true;

	const gradientId = 'linechartgradient';

	$: flattened = flatten(data);

	const xKey = 'year';
	const yKey = 'value';

	const flatten = (data) =>
		data.reduce((memo, group) => {
			return memo.concat(
				//We need location in the flat dataset for the tooltip
				group.values.map((d) => ({ id: group.id, location: group.parameters.location, ...d }))
			);
		}, []);

	const formatTickY = (d) => d.toLocaleString();

	//This version of wide uses location as the key, in order to show in tooltip table.
	const widen = (flat) => {
		return groups(flat, (d) => d[xKey]).map(function (d) {
			const values = d[1].reduce((memo, { location, value }) => {
				memo[location] = value;
				return memo;
			}, {});
			return { year: d[0], ...values };
		});
	};

	$: labelMap = data[0]?.parameters ? makeLabelMap(data[0]?.parameters) : new Map();
</script>

<p class="is-size-4">
	Projection of Workforce Supply for {labelMap.get('sscode')}
</p>
<p class="">
	Model Parameters: Census Division, {labelMap.get('headcount')}, Subspecialists per 100,000 Children, {labelMap.get(
		'scenario'
	)}
</p>


<div class="chart-container">
	<LayerCake
		padding={{ top: 10, right: 10, bottom: 20, left: 70 }}
		x={xKey}
		y={yKey}
		z={1}
		{yDomain}
		zDomain={[1]}
		zScale={scaleOrdinal()}
		zRange={[`url(#${gradientId})`]}
		flatData={flattened}
		{data}
	>
		<Html>
			<HistoricalAnnotation {projectionStartYear} />
		</Html>
		<Svg>
			<GradientDefinition {gradientId} {color} />
			<AxisX gridlines={true} />

			<AxisY
				ticks={10}
				formatTick={formatTickY}
				textAnchor={'end'}
				labelText={`Physician ${labelMap.get('headcount')}, Rate per 100,000 Children`}
				dyLabel={-60}
			/>
			{#if showConfidenceIntervals}
			<MultiArea topKey={'uci'} bottomKey={'lci'} />
			{/if}
			<MultiLine />
		</Svg>

		<Html>
			<SharedTooltip
			{formatValue}
				dataset={widen(flattened)}
				showKey={true}
				formatKey={(d) =>
					options
						.get('location')
						.optionsMap.get(+d)
						.replace(/\s*\(.*$/gm, '')}
				on:quadtreeItemFound
			/>
		</Html>
	</LayerCake>
	<div class="field mt-5 hide-on-save">
		<div class="control">
		  <label class="checkbox">
			<input type="checkbox" bind:checked={showConfidenceIntervals}>
			Show Confidence Intervals
		  </label>
		</div>
	  </div>
	<!-- <LineChartTags {color} {data} on:exceptLocation /> -->
</div>

<style>
	/*
      Create media queries to alter height?
    */
	.chart-container {
		width: 100%;
		height: 300px;
	}

	@media screen and (min-width: 1024px) {
		.chart-container {
			width: 100%;
			height: 500px;
		}
	}
</style>
