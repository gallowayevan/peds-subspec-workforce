<script>
	import { getContext } from 'svelte';

	const { xScale, xDomain } = getContext('LayerCake');

	export let projectionStartYear;
</script>

{#if projectionStartYear > $xDomain[0] + 1}
	<div class="historical-annotation" style="width: {$xScale(projectionStartYear - 1)}px;">
		<div class="annotation-text">Historical</div>
	</div>
{/if}

<style scoped>
	.historical-annotation {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgb(236, 236, 236);
		text-align: right;
	}

	.annotation-text {
		padding-right: 5px;
	}
</style>
