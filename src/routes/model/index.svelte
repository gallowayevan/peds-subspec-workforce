<script>
	import { page } from '$app/stores';
	import TopHero from '$lib/components/TopHero.svelte';
	import LineChart from './_src/LineChart.svelte';
	import ModelForm from './_src/components/ModelForm.svelte';
	import Citation from '$lib/components/Citation.svelte';
	import SaveButton from '$lib/components/SaveButton.svelte';
	import DownloadData from '$lib/components/DownloadData.svelte';
	import { handleShowProjection, handleDeleteProjection, handleClearData } from '$lib/events.js';
	import Note from '$lib/components/Note.svelte';

	export let data = [];


</script>

<div class="">
	<TopHero>
		<span slot="title">Interactive Model</span>
		<span slot="subtitle">The Future Supply of Pediatric Subspecialists</span>
	</TopHero>
</div>
<section class="section container">
	<main>
		<section class="columns hide-on-save">
			<article class="column content">
				<p>
					Welcome to the interactive model where you can investigate and compare different
					projections of the pediatric subspecialty workforce.
				</p>
				<p>The projections are available at the U.S. Census Division and Region level.</p>
				<p>
					To get started, select the options you are interested in and click <strong
						>Show</strong
					>. You can display multiple lines simultaneously to compare subspecialties - just change your options and select
					<strong>Show</strong>
					again. To remove a line, click the <strong>X</strong> button to the left of the parameter table.
				</p>
				<p>The area around each projection line represents the confidence interval. The interval will be larger for smaller subspecialist populations and for projections further in the future.</p>
				<p>
					The
					<a href="/help#model">Help</a>
					page has tutorials about how to use the visualization. The
					<a href="/methods">Methods</a> page has more information about how the projections were made.
				</p>
				<Citation/>
				
				
			</article>
			<div class="column">
				<div class="notification is-primary is-light">
					Need more detail? The <svg
						class="icon-svg has-fill-primary"
						width="20"
						height="20"
						role="img"
					>
						<title>Example of information icon button.</title>
						<use xlink:href="#fa-info-circle" />
					</svg>
					buttons have information about each option.
				</div>
				<ModelForm
					on:showProjection={(e) => handleShowProjection(e, $page)}
					on:clearProjections={(e) => handleClearData($page)}
				/>
			</div>
		</section>
		<div>
			<section class="section pt-0">
				<LineChart {data} on:deleteProjection={(e) => handleDeleteProjection(e, $page)} />
			</section>
<div class="section mt-6 hide-on-save">
			<SaveButton {...$page} fileExtension="png" buttonText="Download Image" />
			<DownloadData {data} />
		</div>
			<Note />
		</div>
	</main>
</section>
