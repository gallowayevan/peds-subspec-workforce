<script>
	import { fontColor, throttle } from '$lib/utilities.js';
	import { onMount, onDestroy } from 'svelte';

	export let data;
	export let rowProp = '';
	export let columnProp = '';
	export let valueProp = 'value';
	export let valuesProp = 'values'
	export let colorScale = (d) => '#fff';
	export let valueFormat = (d) => d.toLocaleString();
	export let frozenWidth = '11em';

	let leftCoord = 0;

	function calculatePosition() {
		// const { left: containerLeft } = document
		// 	.getElementById('main-container')
		// 	.getBoundingClientRect();
		
		/*Picks very first element in document with class of .section this should be a top level wrapper
		for the rest of the document. */
		const { left: containerLeft } = document
			.querySelector('.section')
			.getBoundingClientRect();

		const { left: tableLeft } = document
			.getElementById('top-level-table-div')
			.getBoundingClientRect();
		leftCoord = tableLeft - containerLeft;
	}

	onMount(() => {
		calculatePosition();
		window.onresize = throttle(calculatePosition, 100);
	});

	onDestroy(() => {
		// window.onresize = null;
	});
</script>

{#if data.length > 0}
<!-- Reference: https://www.w3.org/WAI/tutorials/tables/two-headers/ -->
	<div id="top-level-table-div">
	

		<div class="table-container" id="wrapper" style="margin-left:{frozenWidth};">
			<table class="table is-narrow">
				<caption>	<slot /></caption>
				<thead>
					<tr>
						<th class="frozen" style="border: none; left:{leftCoord}px;padding-bottom:5px;width:{frozenWidth};">
						<!-- Spacer -->
						</th>
						<!-- Take first row in data and use columnProp values to create column headers -->
						{#each data[0][valuesProp] as column}
							<th scope="col">
								{column[columnProp]}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each data as row, index}
						<tr>
							<!-- This padding adjustment (along with the one in the thead) are to correct for some mysterious
              misalignment of the borders for the first two elements in the first column. -->
							<th
								class="frozen"
								scope="row"
								style="width:{frozenWidth};left:{leftCoord}px;{index == 0
									? `padding-bottom:5px;`
									: ''}"
							>
								{row[rowProp]}
							</th>
							{#each row[valuesProp] as cell, index}
								<td
									class="number-cell"
									style="background-color:{colorScale(cell[valueProp])};
                    color:{fontColor(colorScale(cell[valueProp]))};"
								>
									{valueFormat(cell[valueProp])}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else}
	<div class="notification">
		Choose a combination of selections and click "Show" to see a table of the model's projections.
	</div>
{/if}

<style>
	#wrapper {
		overflow-x: scroll;
		/* margin-left: 10em; */
		overflow-y: visible;
		padding: 0;
	}

	.frozen {
		white-space: nowrap;
		position: absolute;
		/* width: 10em; */
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.number-cell {
		text-align: right;
	}
</style>
