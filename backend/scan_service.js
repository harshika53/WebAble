const lh = require('lighthouse');
const lighthouse = lh.default || lh;
const chromeLauncher = require('chrome-launcher');
const axe = require('axe-core');
const puppeteer = require('puppeteer');

// Lighthouse scan function
async function runLighthouseScan(url) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  const options = {
    logLevel: 'info',
    output: 'json',
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  };

  try {
    const runnerResult = await lighthouse(url, options);
    const report = runnerResult.report;
    await chrome.kill();
    return JSON.parse(report);
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

// axe-core scan function
async function runAxeScan(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.evaluate(axe.source);
    const results = await page.evaluate(() => axe.run());

    await browser.close();
    return results;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

// MAIN RUNNER for command-line use (used by Python subprocess)
if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error("No URL provided.");
    process.exit(1);
  }

  (async () => {
    try {
      const lighthouseResults = await runLighthouseScan(url);
      const axeResults = await runAxeScan(url);

      const finalResults = {
        lighthouse: lighthouseResults,
        axe: axeResults
      };

      console.log(JSON.stringify(finalResults));
    } catch (err) {
      console.error("Error during scan:", err.message);
      process.exit(1);
    }
  })();
}

// Exported for future unit testing if needed
module.exports = {
  runLighthouseScan,
  runAxeScan
};