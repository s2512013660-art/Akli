const { chromium } = require('playwright');
// renders the FINAL state of slides 1..7 (what PowerPoint shows when the presenter clicks) at 1920x1080
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + __dirname + '/web/index.html?video=1');
  await p.addStyleTag({ content: 'body{padding:0!important} #ui,#hint,#notes{display:none!important} #stage{transition:none!important}' });
  await p.evaluate(() => { dispatchEvent(new Event('resize')); return window.__deck.allDecoded(); });
  await p.waitForTimeout(600);
  for (let k = 1; k <= 7; k++) {
    await p.evaluate(i => { if (i === 0) window.__start(); else window.__deck.go(i); window.__deck.freeze(); window.__deck.seek(60000); }, k - 1);
    await p.waitForTimeout(250);
    await p.screenshot({ path: `${out}/snap_${k}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close(); console.log('snapshots done');
})();
