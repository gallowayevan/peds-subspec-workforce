<script>
	export let options;
	export let name;
	export let checked;

	/*Need to override in the case of CWE, so that it is CWE in the table 
	and "Clinical workforce equivalent" in the radio text. This was a late request so too late to
	alter options.js structure.
	*/
</script>

<div class="field">
	<div class="control">
		{#each options as { value, label }}
			<label class="radio">
				<input type="radio" {name} {value} checked={checked == value} />
				{label == "CWE" ? "Clinical Workforce Equivalent" : label}
			</label>
		{/each}
		<slot />
	</div>
</div>
