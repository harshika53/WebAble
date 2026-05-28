const lh = require('lighthouse');
const lighthouse = lh.default || lh;
const chromeLauncher = require('chrome-launcher');
const axe = require('axe-core');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Ensure the local temp directory exists
const tempDir = path.join(__dirname, 'temp_lighthouse');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Lighthouse scan function with isolation
async function runLighthouseScan(url) {
  const userDataDir = path.join(tempDir, `lh_${Date.now()}`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--headless', 
      '--no-sandbox', 
      '--disable-gpu',
      `--user-data-dir=${userDataDir}`
    ]
  });

  const options = {
    logLevel: 'silent', // Quiet the console
    output: 'json',
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    // ADD THESE TWO LINES TO PREVENT DISK WRITES
    disableStorageReset: true,
    flags: { disableFullPageScreenshot: true } 
  };

  try {
    const runnerResult = await lighthouse(url, options);
    return JSON.parse(runnerResult.report);
  } catch (error) {
    throw error;
  } finally {
    await chrome.kill();
    // Increase delay slightly
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Axe-core scan function with isolation
async function runAxeScan(url) {
  const userDataDir = path.join(tempDir, `axe_${Date.now()}`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', 
      '--disable-gpu',
      `--user-data-dir=${userDataDir}`
    ]
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.evaluate(axe.source);
    const results = await page.evaluate(() => axe.run());

    return results;
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// MAIN RUNNER
if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error("No URL provided.");
    process.exit(1);
  }

  (async () => {
    try {
      // Run sequentially to prevent resource contention
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

module.exports = {
  runLighthouseScan,
  runAxeScan
};