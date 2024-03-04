<script>
	import options from '$lib/settings/options.js';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import SimpleSelect from '$lib/components/SimpleSelect.svelte';
	import SimpleRadio from '$lib/components/SimpleRadio.svelte';
	import Form from '$lib/components/Form.svelte';
</script>

<Form on:showProjection showClear={false}>
	<SimpleSelect {...options.get('sscode')}
		><InfoBox title={'Subspecialty'} info={'Select a subspecialty.'} /></SimpleSelect
	>
	<SimpleSelect {...options.get('geography')} />
	<SimpleRadio {...options.get('headcount')} checked="1"
		><InfoBox
			title={'Headcount or CWE'}
			info={'Clinical workforce equivalent (CWE) refers to the headcount adjusted by the proportion of time spent in direct clinical or consultative care. This value is self-reported in response to the question "What proportion of your total professional time is spent performing each of the following tasks?" The proportion used for this calculation is from the following category: "Direct and/or consultative inpatient and outpatient care, including patient billing and charting (with or without trainees).'}
		/></SimpleRadio
	>
	<SimpleSelect {...options.get('scenario')}
		><InfoBox title={'Scenarios'} info={'Choose a what-if scenario.'} /></SimpleSelect
	>

	<!-- <SimpleRadio {...options.get('pop')} checked="0" /> -->
</Form>
