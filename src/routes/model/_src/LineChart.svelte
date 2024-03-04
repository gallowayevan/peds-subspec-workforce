<script>
	import { LayerCake, Svg, ScaledSvg, Html } from 'layercake';

	import { scaleOrdinal } from 'd3-scale';
	import { groups, rollup, greatest, max } from 'd3-array';

	import MultiLine from './components/MultiLine.svelte';
	import AxisX from './components/AxisX.svelte';
	import AxisY from './components/AxisY.svelte';
	import Labels from './components/Labels.svelte';
	import LineChartLegendTable from './components/LineChartLegendTable.svelte';
	import SharedTooltip from './components/SharedTooltip.svelte';
	import { updateColorMap } from '$lib/utilities';
	import { projectionStartYear } from '$lib/settings/default';
	import HistoricalAnnotation from './components/HistoricalAnnotation.svelte';
	import MultiArea from './components/MultiArea.svelte';
	import NoData from '$lib/components/NoData.svelte';
	import { makeLabelMap } from '$lib/utilities';

	export let data = [];
	$: flattened = flatten(data);

	const xKey = 'year';
	const yKey = 'value';
	const zKey = 'id';

	$: xExtent = [2020, max(flattened, (d) => d[xKey]) || 2040];

	// Color Scale
	let colorMap = new Map();
	let zDomain = [];
	let zRange = [];

	let showConfidenceIntervals = true;

	$: if (data) {
		colorMap = updateColorMap(data, colorMap, zKey);
		zDomain = Array.from(colorMap.keys());
		zRange = Array.from(colorMap.values());
	}

	/* Make a flat array of the `values` of our nested series
	 we can pluck the `value` field from each item in the array to measure extents 
	 From: https://layercake.graphics/example/MultiLine*/
	const flatten = (data) =>
		data.reduce((memo, group) => {
			return memo.concat(group.values.map((d) => ({ id: group.id, ...d })));
		}, []);

	const formatTickY = (d) => d.toLocaleString();

	const widen = (flat) => {
		return groups(flat, (d) => d[xKey]).map(function (d) {
			const values = d[1].reduce((memo, { id, value }) => {
				memo[id] = value;
				return memo;
			}, {});
			return { year: d[0], ...values };
		});
	};

	$: labelMap = data[0]?.parameters ? makeLabelMap(data[0]?.parameters) : new Map();

	$: statsMap = new Map(
		data.map(function (d) {
			// const firstYearObj = least(d.values, (d) => d.year);
			//Allow flexibility in setting start year to align all in cases where historical data are unevenly available.
			const firstYearObj = d.values.find((d) => d.year === xExtent[0]);
			const lastYearObj = greatest(d.values, (d) => d.year);
			const firstValue = firstYearObj.value || 0;
			const lastValue = lastYearObj.value || 0;
			const percentChange = (lastValue - firstValue) / firstValue || 0;
			const formatValue = (v) => v.toLocaleString(undefined, { maximumFractionDigits: 2 });
			const formatPercent = (v) =>
				v.toLocaleString(undefined, { style: 'percent', signDisplay: 'exceptZero' });

			return [
				d.id,
				`${formatValue(firstValue)} - ${formatValue(lastValue)} (${formatPercent(percentChange)})`
			];
		})
	);

	$: indexLookup = new Map(data.map(d=>[d.id, d.index]));

	$: statsColumnName = `${xExtent[0]}&nbsp;-&nbsp;${xExtent[1]} (%&nbsp;Change)`;

	//Determine which parameters differ between projections
	//Allows highlighting of parameters that differ.
	//1. Get flat list of parameters to group
	//2. Use a Set to deduplicates values, so if size of Set is > 1
	//then there are different values for that parameter
	$: parametersDifferent = rollup(
		data.map((d) => Object.entries(d.parameters)).flat(),
		(v) => new Set(v.map((e) => e[1])).size > 1,
		(d) => d[0]
	);

	$: subtitle = Array.from(parametersDifferent)
		.filter((d) => !d[1])
		.map((d) => labelMap.get(d[0]))
		.join(', ');

	$: yLabel = `Physicians ${['headcount', 'pop']
		.filter((d) => !parametersDifferent.get(d))
		.map((d) => labelMap.get(d))
		.join(', ')}`;
</script>

<div class="pb-6 pt-0">
	<!-- Rework this component to be more composable with LayerCake -->
	{#if data.length > 0}
		<h2 class="is-size-4">Model Parameter Summary</h2>
		<LineChartLegendTable
			on:deleteProjection
			{parametersDifferent}
			rows={data.map((d, i) => {
				const addedParam = {};
				addedParam[statsColumnName] = statsMap.get(d.id);
				return {
					parameters: { ...d.parameters, ...addedParam },
					color: colorMap.get(d.id),
					id: d.id,
					index: d.index
				};
			})}
			columnOrder={['sscode', 'pop', 'headcount', 'location', 'scenario', statsColumnName]}
		/>
	{/if}
</div>
<div class="chart-container " id="svg-line-chart-for-save">
	{#if data.length > 0}
		<p class="is-size-4">
			<span class="hide-on-save">Interactive</span> Projections Based on Selected Model Parameters
		</p>
		<!-- <p class="is-size-5">
			{subtitle}
		</p> -->
		<LayerCake
			padding={{ top: 10, right: 10, bottom: 20, left: 40 }}
			x={xKey}
			y={yKey}
			z={zKey}
			yDomain={[0, null]}
			zScale={scaleOrdinal()}
			{zDomain}
			{zRange}
			flatData={flattened}
			{data}
		>
			<!-- <Html>
				<HistoricalAnnotation {projectionStartYear} />
			</Html> -->
			<Svg>
				<AxisX gridlines={false} />

				<AxisY
					ticks={10}
					formatTick={formatTickY}
					textAnchor={'end'}
					labelText={yLabel}
					dyLabel={-60}
				/>
				{#if showConfidenceIntervals}
				<MultiArea topKey={'uci'} bottomKey={'lci'} />
				{/if	}
				<MultiLine />
			</Svg>

			<Html>
				<SharedTooltip dataset={widen(flattened)} {indexLookup} showIndex =true/>
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
	{:else}
		<NoData />
	{/if}
</div>

<style>
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
