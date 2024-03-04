<script>
        export let url;
    export let fileExtension = "png";

   $: target = url.pathname === "/" ? "/overview" : url.pathname;
    
    $: saveUrl = `${target}.${fileExtension}${url.search}`
    </script>
    
    
    <p class="subtitle hide-on-save">
        <a href={saveUrl} download><slot>Download.</slot></a>
    </p>