<script>
	import { page } from '$app/stores';
	import SaveButton from '$lib/components/SaveButton.svelte';
	import TopHero from '$lib/components/TopHero.svelte';
	import LineChart from './_src/LineChart.svelte';
	import MapForm from './_src/MapForm.svelte';
	import SimpleMap from './_src/SimpleMap.svelte';
	import {
		handleShowProjection,
		handleDeleteProjection,
		handleClearData,
		handleExceptLocation
	} from '$lib/events.js';
	import { extent } from 'd3-array';
	import { scaleSequential } from 'd3-scale';
	import { interpolateViridis as colorInterpolator } from 'd3-scale-chromatic';
	import NoData from '$lib/components/NoData.svelte';
	import ButtonRadio from '$lib/components/ButtonRadio.svelte';
	import Citation from '$lib/components/Citation.svelte';
	import ColorLegend from '$lib/components/ColorLegend.svelte';
	import DownloadData from '$lib/components/DownloadData.svelte';
	import Table2D from '$lib/components/Table2D.svelte';
	import options from '$lib/settings/options.js';
	import { numberFormat } from '$lib/utilities.js';
	import Note from '$lib/components/Note.svelte';

	export let data = [];
	let hoverYear;
	let currentYear = 2040; //How to avoid hard coding this?

	const yearOptions = [2020, 2025, 2030, 2035, 2040]; //ticks(...yearExtent, 2);

	//Full extent includes uci and lci in addition to means
	$: fullExtent = extent(data.flatMap((d) => d.values.flatMap((e) => [e.value, e.lci, e.uci])));
	$: yDomain = [0, fullExtent[1]];
	// $: yearExtent = extent(data.flatMap((d) => d.values.map((e) => e.year)));
	$: color = scaleSequential(yDomain, colorInterpolator);

	function changeYear({ detail }) {
		currentYear = +detail;
	}

	const removeParenthesesRegex = /\s\(.+/;
</script>

<div class="hide-on-save">
	<TopHero>
		<span slot="title">Interactive Map</span>
		<span slot="subtitle"
			>How Will Pediatric Subspecialists be Distributed Across the United States?</span
		>
	</TopHero>
</div>
<section class="section container">
	<main>
		<section class="columns hide-on-save">
			<article class="column content">
				<p>
					Welcome to the interactive map that lets you investigate and compare different
					projections of the pediatric subspecialty workforce across U.S. Census Divisions.
				</p>
				<p>
					To get started, select the options in which you are interested and click <strong
						>Show</strong
					>.</p><p> The
					<a href="/help#map">Help</a>
					page has tutorials about how to use the visualization. The
					<a href="/methods">Methods</a> page has more information about how the projections were made.
				</p>
				<Citation/>
				
			</article>

			<div class="column">
				<div class="notification is-primary is-light">
					Need more detail? The <svg class="icon-svg has-fill-primary" width="20" height="20" role="img">
						<title>Example of information icon button.</title>
						<use xlink:href="#fa-info-circle" />
					</svg>
					buttons have information about each option.
				</div>
				<MapForm on:showProjection={(e) => handleShowProjection(e, $page)} />
			</div>
		</section>

		{#if data.length > 0}
			<section class="section py-0 no-break">
				<SimpleMap {data} {color} hoverYear={currentYear} formatValue= {numberFormat(1)}/>
				<div class="columns">
					<div class="column is-two-fifths">
						<ColorLegend {color} title="Subspecialists per 100,000 Children" />
					</div>
					<div class="column is-one-fifth" />
					<div class="column is-two-fifths hide-on-save">
						<fieldset>
							<legend>Projection Year</legend>
							<ButtonRadio
								options={yearOptions.map((d) => ({ value: d, label: d }))}
								selected={currentYear}
								on:changeSelected={changeYear}
							/>
						</fieldset>
					</div>
				</div>
			</section>

			<section class="section no-break">
				<LineChart
				formatValue= {numberFormat(1)}
					on:quadtreeItemFound={(e) => {
						hoverYear = e.detail.year;
					}}
					{data}
					{yDomain}
					{color}
					on:deleteProjection={(e) => handleDeleteProjection(e, $page)}
					on:exceptLocation={(e) => handleExceptLocation(e, $page)}
				/>
			</section>
			<section class="section no-break">
				<Table2D
					data={data.map((d) => ({
						location: options
							.get('location')
							?.optionsMap.get(d.parameters.location)
							?.replace(/\s\(.+/gm, ''),
						values: d.values
					}))}
					colorScale={color}
					columnProp="year"
					rowProp="location"
					valueFormat = {numberFormat(1)}
				/>
			</section>
			
			<!-- <SaveButton  {...$page} fileExtension="pdf" buttonText = "Download PDF"/> -->
			<div >
			<SaveButton  {...$page} fileExtension="png" buttonText = "Download Image"/>  
			<DownloadData {data} />
		</div>
		{:else}
			<NoData />
		{/if}
		<Note></Note>
	</main>
</section>
