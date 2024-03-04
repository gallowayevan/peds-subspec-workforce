<script>
    export let url;
    export let buttonText = "Download";
    export let fileExtension = "png";

    $: target = url.pathname === "/" ? "/overview" : url.pathname;
    
    $: saveUrl = `${target}.${fileExtension}${url.search}`

    let isLoading = false;
    
    function handleSave(){
      isLoading = true;
        const link = document.createElement('a');
                    link.href = saveUrl;
                    link.download = `chart.${fileExtension}`;
                    link.click();
        setTimeout(() => {
          isLoading = false;
        }, 3000);
    
    }
    
    
    </script>
    
    
    <button
      title="Save Chart as {fileExtension}"
      class="button is-info hide-on-save"
      class:is-loading={isLoading}
      on:click={handleSave}
      aria-label="Download {fileExtension} of Current Chart"
    >
   {buttonText}
    </button>
    