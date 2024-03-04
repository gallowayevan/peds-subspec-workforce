<script>
export let url;
$: target = url.pathname === "/" ? "/overview" : url.pathname;

$: pdfUrl = `${target}.pdf${url.search}`
</script>


<p class="subtitle">
    <a href={pdfUrl}>Download a PDF.</a>
</p>