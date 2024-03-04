<script>
    import { page } from '$app/stores';
	const todaysDate = new Date().toLocaleDateString(undefined, {dateStyle: "long"});
    const url = $page.url.origin + $page.url.pathname

</script>

<p>To cite, please include the following: 
<blockquote>The Program on Health Workforce Research and Policy at the Cecil G. Sheps Center for Health
    Services Research, the University of North Carolina at Chapel Hill, and the American Board of Pediatrics Foundation. Projecting the future US pediatric subspecialty workforce: A workforce microsimulation model, 2020-2040. Updated February 2023. {url}. Accessed on: {todaysDate}</blockquote>
