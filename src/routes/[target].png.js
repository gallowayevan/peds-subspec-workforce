import puppeteer from 'puppeteer-core';
// import {existsSync} from 'fs';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const getBrowser = () =>
	IS_PRODUCTION
		? puppeteer.connect({
				browserWSEndpoint: 'wss://chrome.browserless.io?token=a15603f4-2629-47f2-a38b-01e35503b802'
		  })
		: puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

export async function get({ url: { searchParams, origin }, params }) {
	const query = searchParams.toString();

	//Default to overview/homepage
	let urlToPng = `${origin}/`;
	//If not homepage, then create target url to pdf
	if (params.target !== 'overview') {
		urlToPng = urlToPng + `${params.target}?${query}`;
	}

	const png = await printPNG(urlToPng);

	return {
		body: png,
		status: 200,
		headers: {
			'Content-Type': 'application/png'
		}
	};
}

async function printPNG(urlToPng) {
	const browser = await getBrowser();
	const page = await browser.newPage();
	await page.goto(urlToPng, { waitUntil: 'networkidle0' });
	await page.addStyleTag({ content: '.hide-on-save { display: none !important;}' });
	const png = await page.screenshot({ fullPage: true });

	await browser.close();
	return png;
}
