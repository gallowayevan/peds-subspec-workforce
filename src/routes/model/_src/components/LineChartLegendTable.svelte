<script>
	import { createEventDispatcher } from 'svelte';
	import options from '$lib/settings/options.js';
	import IndexCircle from './IndexCircle.svelte';

	const dispatch = createEventDispatcher();

	export let rows = undefined;
	export let columnOrder = undefined;
	export let parametersDifferent = undefined;

	function handleDeleteProjection(e) {
		dispatch('deleteProjection', e.target.getAttribute('data-id'));
	}
</script>

<div class="table-container">
	<table class="table is-narrow" id="line-chart-table">
		<thead>
			<tr>
				<th />
				<th />

				{#each columnOrder as column}
					<th>{@html options.has(column) ? options.get(column)?.label : column}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row}
				<tr>
					<td style="background-color: {row.color}; vertical-align: middle;">
						<button
							class="delete hide-on-save"
							data-id={row.id}
							aria-label="delete"
							on:click={handleDeleteProjection}
						/>
					</td>
					<IndexCircle color={row.color}>{row.index}</IndexCircle>
					{#each columnOrder as column}
						<td
							class:has-text-weight-bold={parametersDifferent.get(column)}
							class:has-text-black-bis={parametersDifferent.get(column)}
						>
							{options.has(column)
								? options.get(column).optionsMap.get(row.parameters[column])
								: row.parameters[column]}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>


