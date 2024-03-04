import puppeteer from 'puppeteer-core';

export async function get({ url: { searchParams, origin }, params }) {

    const query = searchParams.toString();

    //Default to overview/homepade
    let urlToPdf = `${origin}/`
    //If not homepage, then create target url to pdf
    if (params.target !== 'overview') {
        urlToPdf = urlToPdf + `${params.target}?${query}`
    }

    const pdf = await printPDF(urlToPdf);

    return {
        body: pdf,
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length
        }
    }


}

async function printPDF(urlToPdf) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(urlToPdf, { waitUntil: 'networkidle0' });
    await page.addStyleTag({ content: '.hide-on-save { display: none !important;}' })
    const pdf = await page.pdf({ format: 'letter', printBackground: true });

    await browser.close();
    return pdf
}