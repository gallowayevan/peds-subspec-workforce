<script>
	import { fontColor } from '$lib/utilities';
	import options from '$lib/settings/options';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let color = undefined;
	export let data = undefined;
</script>

<!-- This is very clunky and the duplicate calls for the two inline styles are not great.
	However, this is not meant for production and is just to allow exploration of the state data. -->
<section class="section">
	<div class="tags">
		{#each data as tag (tag.id)}
			<span
				class="tag"
				style="color: {fontColor(
					color(tag.values[tag.values.length - 1].value)
				)}; background-color:{color(tag.values[tag.values.length - 1].value)};"
			>
				{options.get('location').optionsMap.get(tag.parameters['location'])}
				<button
					class="delete is-small"
					data-id={tag.parameters['location']}
					on:click={(e) => dispatch('exceptLocation', e.target.getAttribute('data-id'))}
				/>
			</span>
		{/each}
	</div>
</section>
