<script>
	import { ascending, extent } from 'd3-array';
	import { csvFormat } from 'd3-dsv';
	import options from '$lib/settings/options.js';

	export let data;
	let isLoading = false;
	const buildDate = __BUILD_DATE__;

	function handleDownloadData() {
		isLoading = true;

		const years = Array.from(new Set(data.flatMap((d) => d.values.map((e) => e.year)))).sort(
			ascending
		);
		const yearsDomain = years.flatMap((d) => ['lci_' + d, 'mean_' + d, 'uci_' + d]);
		const yearsExtent = extent(years);

		const parametersDomain = Array.from(
			new Set(data.flatMap((d) => Object.keys(d.parameters).map((e) => options.get(e).label)))
		);

		const header = `Projections Based on Selected Model Parameters (${yearsExtent[0]} - ${yearsExtent[1]})\nThe first ${parametersDomain.length} fields identify model parameters for the selected projections.\nFields in the form of mean_YEAR are the projection mean for that YEAR.\nuci_YEAR and lci_YEAR are the upper and lower bounds respectively of the confidence interval for that YEAR.\n\n`;
		const note = `\n\nNOTE: The year 2020 data represents non-projected estimates of the actual workforce in that year and is the base year for the future projections.\n\nCITATION: The Future of the Pediatric Subspecialty Workforce. ${
			window.location.href
		}. Updated: ${buildDate}. Accessed ${new Date().toDateString()}.\n`;

		const rows = data.map(function (d) {
			const row = {};
			d.values.forEach(function (e) {
				row["lci_" + e.year] = e.lci;
				row["mean_" + e.year] = e.value;
				row["uci_" + e.year] = e.uci;
			});

			Object.keys(d.parameters).forEach(
				(e) => (row[options.get(e).label] = options.get(e).optionsMap.get(d.parameters[e]))
			);

			return row;
		});

		const download = header + csvFormat(rows, [...parametersDomain, ...yearsDomain]) + note;

		if (navigator.msSaveBlob) {
			// IE 10+
			navigator.msSaveBlob(
				new Blob([download], { type: 'text/csv;charset=utf-8;' }),
				'projections.csv'
			);
		} else {
			var uri = 'data:attachment/csv;charset=utf-8,' + encodeURI(download);
			var downloadLink = document.createElement('a');
			downloadLink.href = uri;
			downloadLink.download = 'projections.csv';

			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		}
		isLoading = false;
	}
</script>

<button
	title="Download Data"
	class="button is-info hide-on-save"
	class:is-loading={isLoading}
	on:click={handleDownloadData}
	aria-label="Download Data as a CSV file"
>
	<slot>Download Data</slot>
</button>
