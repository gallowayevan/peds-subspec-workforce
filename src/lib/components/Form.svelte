<script>
	import { createEventDispatcher } from 'svelte';
	import { navigating } from '$app/stores';

	const dispatch = createEventDispatcher();

	let formHasChanged = true;
	export let showClear = true;
	export let formTitle = "Model Options"

	function handleClearData() {
		dispatch('clearProjections');
	}

	function handleShowProjection(event) {
		let params = [];

		//Loop through form elements and get values for data query
		//Only get values from elements that have a name and are either select elements
		//or checked (as for radio elements).
		for (let el of event.target) {
			if (el.name && (el.type == 'select-one' || el.checked == true)) {
				params.push({
					name: el.name,
					value: el.value,
					display:
						el.type == 'select-one'
							? el.selectedOptions[0].innerText.trim()
							: el.parentElement.innerText.trim()
				});
			}
		}
		//Reset formHasChanged
		formHasChanged = false;

		dispatch('showProjection', params);
	}
</script>

<form on:submit|preventDefault={handleShowProjection} on:change={() => (formHasChanged = true)}>
	<fieldset class="model">
		<legend class="model is-size-3 has-text-weight-semibold">{formTitle}</legend>
		<slot />

		<div class="field is-grouped">
			<div class="control">
				<button class="button" class:is-primary={!formHasChanged} class:is-warning={formHasChanged} type="submit"> Show </button>
			</div>
			{#if showClear}
				<div class="control">
					<button class="button" type="button" on:click={handleClearData}> Clear </button>
				</div>
			{/if}
			{#if $navigating}
				<div class="control">
					<progress class="progress is-small is-primary" max="100" />
				</div>
			{/if}
		</div>
	</fieldset>
</form>

