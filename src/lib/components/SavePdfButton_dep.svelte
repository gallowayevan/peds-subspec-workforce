<script>
	function getPDF() {
		return fetch(`/screen.pdf?url=http://localhost:3000/model`, {
			headers: {
				'Content-Type': "application/octet-stream"
			}
		}).then(res=>res.arrayBuffer());
	}

	function savePDF() {
		return getPDF() // API call
			.then((response) => {
				const blob = new Blob([response], { type: 'application/pdf' });
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = `example.pdf`;
				link.click();
			})
			.catch((err) => console.log(err));
	}
</script>

<button class="button is-info" on:click={savePDF}>Save as PDF</button>
