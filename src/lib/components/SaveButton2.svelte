
<script>
import html2canvas from 'html2canvas';

        export let buttonText = "Download Image";
    export let fileExtension = "png";
    export let elementId;
    export let options;

    function handleSave(){
        html2canvas(document.getElementById(elementId), options).then(function(canvas) {
            const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = `chart.${fileExtension}`;
                    link.click();
});
    }
</script>

<button
data-html2canvas-ignore
title="Save Chart as {fileExtension}"
class="button is-info"
on:click={handleSave}
aria-label="Download {fileExtension} of Current Chart"
>
{buttonText}
</button>