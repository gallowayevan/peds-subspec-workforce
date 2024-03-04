<script>
	import usMapData from '$lib/usMap.json';
	import { makeLabelMap } from '$lib/utilities';
	import {raise} from 'layercake';

	const { viewBox, region, state, division } = usMapData;

	export let data;

	export let color;
	export let hoverYear = 2040;
	export let formatValue = d=>d.toLocaleString();

	let tooltipText = '';
	let tooltipPosition = [];
	let showTooltip = false;


	//All elements should have same geography
	$: currentGeography = data[0]?.parameters.geography || 902;

	/* Lookup for each location and values by year to get
    data for Map.
    */
	$: dataMap = new Map(
		data.map(function (d) {
			const location = d.parameters.location;
			const geoid =
				currentGeography === 901
					? location
					: currentGeography === 902
					? divisionMap.get(location)
					: convertRegion(location);

			const valuesMap = new Map(d.values.map((e) => [e.year, { ...e, fill: color(e.value) }]));
			return [geoid, { ...d, valuesMap }];
		})
	);

	$: labelMap = data[0]?.parameters ? makeLabelMap(data[0]?.parameters) : new Map();

	//Map to convert model data division codes to Census geo codes.
	const divisionMap = new Map([
		[400, 3],
		[401, 6],
		[402, 2],
		[403, 8],
		[404, 1],
		[405, 9],
		[406, 5],
		[407, 4],
		[408, 7]
	]);

	function convertRegion(modelRegionCode) {
		//return code that corresponds to Census region codes
		return modelRegionCode - 199;
	}

	function getFill(geoid, year) {
		return dataMap.get(+geoid)?.valuesMap.get(year)?.fill;
	}

	function handleMouseover(e) {

		raise(e.target)
		showTooltip = true;
		const currentGeoid = e.target.getAttribute('data-geoid');
		const currentLocation = e.target.getAttribute('data-location');
		const currentValue = dataMap.get(+currentGeoid)?.valuesMap.get(hoverYear)?.value;
		tooltipText = `${currentLocation}: ${formatValue(currentValue)}`;
		tooltipPosition = [e.clientX, e.clientY];
	}

	function handleMouseout() {
		showTooltip = false;
	}
</script>

<p id="forecast-map-label" class="is-size-4">
	Projection of Workforce Supply for {labelMap.get('sscode')}, {hoverYear}
</p>
<p id="forecast-map-description">
	Model Parameters: {labelMap.get('geography')}, {labelMap.get('headcount')}, Subspecialists per
	100,000 Children, {labelMap.get('scenario')}
</p>

<svg {viewBox} aria-describedby="forecast-map-description" aria-labelledby="forecast-map-label">
	<g  >
		{#if currentGeography === 902}
			<g class="divisions" aria-hidden="true">
				{#each division as { d, geoid, name }}
					<path
						class="division"
						stroke-linejoin="round"
						stroke="#898989"
						fill={dataMap.get(+geoid)?.valuesMap.get(hoverYear)?.fill}
						data-geo-code={geoid}
						data-geo-name={name}
						{d}
					/>
				{/each}
			</g>
		{/if}

		{#if currentGeography === 900}
			<g class="regions" aria-hidden="true">
				{#each region as { d, geoid, name }}
					<path
						class="region"
						fill={dataMap.get(+geoid)?.valuesMap.get(hoverYear)?.fill}
						stroke-linejoin="round"
						data-geo-code={geoid}
						data-geo-name={name}
						{d}
					/>
				{/each}
			</g>
		{/if}

		<g class="states" aria-hidden="true">
			{#each state as { d, geoid, name }}
				<path
					class="state"
					stroke-linejoin="round"
					stroke="#fff"
					stroke-width="0.5"
					fill={currentGeography === 901 ? getFill(geoid, hoverYear) : 'none'}
					data-geo-code={geoid}
					data-geo-name={name}
					{d}
				/>
			{/each}
		</g>
		<!-- Eventually clean up so we don't have to render divisions twice -->
		{#if currentGeography === 902}
			<g class="division-outlines">
				{#each division as { d, geoid, name }}
					<path
					
					class="outlines"
						stroke-linejoin="round"
						data-geoid={geoid}
						data-location={name}
						
						stroke="#333"
						stroke-width="1.5px"
						fill="none"
						pointer-events="all"
						{d}
						on:mousemove={handleMouseover} on:mouseout={handleMouseout}
					>
					<!-- <title>{name}: {dataMap.get(+geoid)?.valuesMap.get(hoverYear)?.value.toLocaleString()}</title> -->
				</path>
				{/each}
			</g>
		{/if}
		{#if currentGeography === 900}
			<g class="region-outlines">
				{#each region as { d, geoid, name }}
					<path
					class="outlines"
						stroke-linejoin="round"
						data-geoid={geoid}
						data-location={name}
						stroke="#333"
						stroke-width="1.5px"
						fill="none"
						pointer-events="all"
						{d}
						on:mousemove={handleMouseover} on:mouseout={handleMouseout}
					/>
				{/each}
			</g>
		{/if}
	</g>
</svg>

{#if showTooltip}
	<div class="map-tooltip" style="top: {tooltipPosition[1] - 5}px; left: {tooltipPosition[0]}px">
		{tooltipText}
	</div>
{/if}

<style>

.outlines:hover {
    stroke: #000;
    stroke-width: 2px;
  }

  
path.outlines:focus {
    stroke: #000;
    stroke-width: 2px;
  }

	div.map-tooltip {
		position: fixed;
		background-color: white;
		opacity: 0.9;
		transform: translate(-50%, -100%);
		padding: 5px;
		z-index: 15;
		pointer-events: none;
		border-radius: 5px;
		font-weight: 600;
	}
</style>
