<script>
	import TopHero from '$lib/components/TopHero.svelte';
</script>

<TopHero>
	<span slot="title">Help</span>
	<span slot="subtitle">Read More About How to Use the Visualizations.</span>
</TopHero>
<div class="container content">
	<ul>
		<li><a href="#model">How to Use the Line Chart Visualization</a></li>
		<li><a href="#map">How to Use the Map Visualization</a></li>
	</ul>
</div>
<div class="columns is-centered">
	<article
		class="content column
    is-two-thirds-tablet
    is-two-thirds-desktop
    is-two-thirds-widescreen
    is-half-fullhd"
	>
		<h2 id="model">How to Use the Line Chart Visualization</h2>
		<ol>
			<li class="notification">
				<p>
					Use the <strong>Model Options</strong> form to select parameters for the projection you
					want to view. Select a
					<svg class="icon-svg has-fill-primary" width="20" height="20" role="img">
						<title>Example of information icon button.</title>
						<use xlink:href="#fa-info-circle" />
					</svg>
					to learn more about each option. Select
					<strong>Show</strong> to display the projection.
				</p>
				<video loop muted playsinline controls>
					<source src="images/help/model_step_1.mp4" type="video/mp4" />
					<p>Example of how to use model options form for choosing specific projections.</p>
				</video>
			</li>
			<li class="notification">
				<p>
					You can display multiple lines at once to compare projections - just change your options and select <strong
						>Show</strong
					>
					again. You can also delete individual projections by clicking the <strong>X</strong>
					button to the left of each projection in the <strong>Model Parameter Summary</strong>. Or
					you can clear all projections by clicking the <strong>Clear</strong> button.
				</p>
				<video controls loop muted playsinline>
					<source src="images/help/model_step_2.mp4" type="video/mp4" />
					<p>
						Example of how you can add multiple projections and delete either individual
						projections using the X buttons or all projections using the Clear button.
					</p>
				</video>
			</li>
				<li class="notification">
				<p>You can also add multiple projections at once by selecting the option that specifies "Separate".</p>
				<video controls loop muted playsinline>
					<source src="images/help/model_step_3.mp4" type="video/mp4" />
					<p>
						How to add projections for all subspecialities at once.
					</p>
				</video>
			</li>
			<li class="notification">
				<p>
					Hovering in the chart area displays the values associated with each projection for a given
					year. The number circles correspond with the number circles in the <strong
						>Model Parameter Summary</strong
					>.
				</p>
				<img
					class="image"
					alt="The circle numbers link the values in the hover table and the parameters table."
					src="/images/help/hover_link.png"
				/>
			</li>
			<li class="notification">
				<p>
					The area around each projection line represents the confidence interval. The interval will
					be larger for smaller subspecialist populations and for projections further in the future.
				</p>
				<img
					class="image"
					alt="Confidence intervals surround each projection."
					src="/images/help/model_confidence_interval.png"
				/>
			</li>
			<li class="notification">
				<p>
					You can download an image of the chart or the data underlying the chart as a .csv file by clicking one of the download buttons.
				</p>
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img
					class="image"
					alt="Buttons for downloading an image or csv."
					src="/images/help/download_buttons.png"
				/>
			</li>
		</ol>
	</article>
</div>
<div class="columns is-centered">
	<article
		class="content column
    is-two-thirds-tablet
    is-two-thirds-desktop
    is-two-thirds-widescreen
    is-half-fullhd"
	>
		<h2 id="map">How to Use the Map Visualization</h2>
		<ol>
			<li class="notification">
				<p>
					This visualization displays projections for either all <a href="/censusmap">Census Divisions or Census Regions</a>. Use the <strong>Model Options</strong> form to select parameters for the projections you
					want to view. Select a
					<svg class="icon-svg has-fill-primary" width="20" height="20" role="img">
						<title>Example of information icon button.</title>
						<use xlink:href="#fa-info-circle" />
					</svg>
					to learn more about each option. Select
					<strong>Show</strong> to display the projection.
				</p>
				<video loop muted playsinline controls>
					<source src="images/help/map_step_1.mp4" type="video/mp4" />
					<p>Example of how to use model options form for choosing specific projections.</p>
				</video>
			</li>
			<li class="notification">
				<p>
					The map shows the projected supply for a specific year. You can find specific values on the map by hovering over a Census Region or Division in the map. All values are rates per 100,000 children in the region or division. You can change the projection year by clicking on the <strong>Projection Year</strong> options.
				</p>
				<video loop muted playsinline controls>
					<source src="images/help/using_the_map.mp4" type="video/mp4" />
					<p>How to use the map to switch years and obtain specific region or division values by hovering.</p>
				</video>
			</li>
			<li class="notification">
				<p>
					The projections for the Census Regions or Divisions are also displayed as a line chart and a table. The line chart displays confidence intervals around the projection mean. You can also hover on the line chart to obtain projection values for a given year. 
				</p>
				<p>In both the line chart and the table, the colors correspond to the colors in the map.</p>
				<img
					class="image"
					alt="Line chart and table of data in the map."
					src="/images/help/map_line_chart_table.png"
				/>
			</li>
			<li class="notification">
				<p>
					You can download an image of the chart or the data underlying the chart as a .csv file by clicking one of the download buttons.
				</p>
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img
					class="image"
					alt="Buttons for downloading an image or csv."
					src="/images/help/download_buttons.png"
				/>
			</li>
		</ol>
	</article>
</div>
