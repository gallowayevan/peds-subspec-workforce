<script>
	import { fontColor } from '$lib/utilities.js';
	export let color;
</script>

<td style="vertical-align: middle;">
	<div
		class="circle-div has-text-weight-bold"
		style="background-color: {color}; color: {fontColor(color)};"
	>
		<slot />
	</div></td
>

<style>
	.circle-div {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		line-height: 30px;
		text-align: center;
		vertical-align: middle;
	}
</style>
