const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const sharp = require('sharp');
(async () => {
  const dir = path.join(__dirname, 'svg'), out = path.join(__dirname, 'img');
  fs.mkdirSync(out, { recursive: true });
  const man = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'))).filter(m => !m.name.startsWith('_'));
  const only = process.argv.slice(2);
  const browser = await chromium.launch();
  for (const m of man) {
    if (only.length && !only.includes(m.name)) continue;
    const page = await browser.newPage({ viewport: { width: m.w, height: m.h }, deviceScaleFactor: 2.4 });
    const svg = fs.readFileSync(path.join(dir, m.name + '.svg'), 'utf8');
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    const buf = await page.screenshot({ omitBackground: m.kind !== 'jpg', type: 'png', clip: { x: 0, y: 0, width: m.w, height: m.h } });
    if (m.kind === 'jpg') await sharp(buf).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(out, m.name + '.jpg'));
    else await sharp(buf).png({ compressionLevel: 9, palette: false }).toFile(path.join(out, m.name + '.png'));
    await page.close();
  }
  await browser.close();
  console.log('rendered', only.length ? only.length : man.length);
})();
