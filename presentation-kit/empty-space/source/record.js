// Run build2.js against a recording stand-in for pptxgenjs -> records.json (same layout data as the .pptx)
const Module = require('module'), fs = require('fs'), path = require('path');
const clone = o => JSON.parse(JSON.stringify(o || {}));
class FakePres {
  constructor() { this.slides = []; this.masters = {}; }
  defineSlideMaster(o) { this.masters[o.title] = clone(o); }
  addSection() {}
  addSlide(o) {
    const s = { master: o.masterName, items: [], notes: '' };
    this.slides.push(s);
    return {
      addText: (t, opt) => s.items.push({ kind: 'text', t: clone(t), o: clone(opt) }),
      addImage: (opt) => s.items.push({ kind: 'image', o: clone(opt) }),
      addShape: (type, opt) => s.items.push({ kind: 'shape', type, o: clone(opt) }),
      addNotes: (n) => { s.notes = n; },
    };
  }
  async writeFile() { fs.writeFileSync(path.join(__dirname, 'records.json'), JSON.stringify({ slides: this.slides, masters: this.masters })); }
}
const origLoad = Module._load;
Module._load = function (req, parent, isMain) {
  if (req === 'pptxgenjs') return FakePres;
  if (req.endsWith('apply_theme.js')) return { applyTheme: async () => {} };
  return origLoad.apply(this, arguments);
};
require('./build2.js');
