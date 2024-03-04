<script>
	import options from '$lib/settings/options.js';
	import SimpleSelect from '$lib/components/SimpleSelect.svelte';
	import SimpleRadio from '$lib/components/SimpleRadio.svelte';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import Form from '$lib/components/Form.svelte';

	/*
	This is a workaround to add the option to add all subspecs at once to avoid a lot of clicking. We add the option here,
	and then amend Form
	*/
	const subspecOptions = options.get('sscode');
	const newSubspecList = [{value: -1, label: "All Pediatric Subspecialties (Separate)"},...subspecOptions.options];
	const newSubspecOptions ={...subspecOptions, options: newSubspecList }

	const locationOptions = options.get('location');
	const newLocationList = [{value: -1, label: "All Census Regions (Separate)"},{value: -2, label: "All Census Divisions (Separate)"},...locationOptions.options];
	const newLocationOptions ={...locationOptions, options: newLocationList }

</script>

<Form on:showProjection on:clearProjections>
	<SimpleSelect {...newSubspecOptions}
		><InfoBox title={'Subspecialty'} info={'Select a subspecialty.'} /></SimpleSelect
	>
	<SimpleSelect {...newLocationOptions}
		><InfoBox
			big={true}
			title={'Region or Division'}
			info={`You can select Census divisions or regions. <a href="/censusmap" target="_blank"><img class="image " src="/images/us_regdiv.jpg" alt="A map of the United States of American showing Census Regions and Divisions." /></a>`}
		/></SimpleSelect
	>
	<SimpleRadio {...options.get('headcount')} checked="1"
		><InfoBox
			title={'Headcount or Clinical Workforce Equivalent'}
			info={'Clinical workforce equivalent (CWE) refers to the headcount adjusted by the proportion of time spent in direct clinical or consultative care. This value is self-reported in response to the question "What proportion of your total professional time is spent performing each of the following tasks?" The proportion used for this calculation is from the following category: "Direct and/or consultative inpatient and outpatient care, including patient billing and charting (with or without trainees)."'}
		/></SimpleRadio
	>
	<SimpleRadio {...options.get('pop')} checked="0"
		><InfoBox
			title={'Total or Subspecialist per 100,000 Children'}
			info={'Select total to see absolute numbers of physicians or the rate to see the workforce relative to the population being served. Children are defined as people 18 years or younger. The population projections are from University of Virginia Weldon Cooper Center, Demographics Research Group. (2018). <a href="https://demographics.coopercenter.org/national-population-projections">National Population Projections</a>.'}
		/></SimpleRadio
	>
	<SimpleSelect {...options.get('scenario')}
		><InfoBox title={'Scenarios'} info={'Choose a what-if scenario.'} /></SimpleSelect
	>
</Form>
