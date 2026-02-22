const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // Fill something so dropdown has value
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Paddy'));
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 500));
  
  const styles = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="number"]');
    const humidity = Array.from(inputs).find(i => i.name === 'Humidity');
    
    const spans = document.querySelectorAll('.space-y-1\\.5 span.truncate');
    let dropdownSpan;
    // The dropdown span will have the text of the selected option, for paddy it's Low Humic Gley
    for (const span of Array.from(spans)) {
        if (span.textContent.includes('Low Humic Gley')) {
            dropdownSpan = span;
        }
    }
    
    if(!humidity || !dropdownSpan) return { error: "could not find elements" };
    
    const hStyle = window.getComputedStyle(humidity);
    const dStyle = window.getComputedStyle(dropdownSpan);
    
    return {
        humidity: {
            color: hStyle.color,
            fontSize: hStyle.fontSize,
            fontWeight: hStyle.fontWeight,
            fontFamily: hStyle.fontFamily
        },
        dropdownSelectedText: {
            color: dStyle.color,
            fontSize: dStyle.fontSize,
            fontWeight: dStyle.fontWeight,
            fontFamily: dStyle.fontFamily
        }
    };
  });
  
  console.log(JSON.stringify(styles, null, 2));
  await browser.close();
})();
