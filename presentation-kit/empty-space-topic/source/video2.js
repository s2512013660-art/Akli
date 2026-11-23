const { chromium } = require('playwright');
const { spawn } = require('child_process');
const FPS = 25, HOLD = [7, 8, 8.5, 8, 7.5, 8, 8.5, 9];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + __dirname + '/web/index.html?video=1');
  await p.addStyleTag({ content: 'body{padding:0!important} #ui,#hint,#notes{display:none!important} #stage{transition:none!important}' });
  await p.evaluate(() => { dispatchEvent(new Event('resize')); return window.__deck.allDecoded(); });
  await p.waitForTimeout(800);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    'silent.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
  let n = 0;
  for (let i = 0; i < HOLD.length; i++) {
    await p.evaluate(i => { if (i === 0) window.__start(); else window.__deck.go(i); window.__deck.freeze(); }, i);
    const frames = Math.round(HOLD[i] * FPS);
    for (let f = 0; f < frames; f++) {
      await p.evaluate(ms => window.__deck.seek(ms), f * 1000 / FPS);
      const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      n++;
    }
    process.stdout.write(`slide ${i + 1} done (${n} frames)\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  console.log('frames', n);
})();
