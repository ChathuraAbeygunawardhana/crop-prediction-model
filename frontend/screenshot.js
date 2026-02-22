const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200 });
  await page.goto('http://localhost:3000');
  
  // click "Load Template: Paddy"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Paddy'));
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'frontend-screenshot2.png' });
  await browser.close();
})();
