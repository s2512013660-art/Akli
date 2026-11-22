import sys, zipfile, re
from lxml import etree
SK='/root/.claude/skills/synced/4053cd73-26b3-4e96-9059-1c86e49cf057_78ad373f-24ee-4468-b7bd-35008017f477/pptx/scripts/office/schemas/ISO-IEC29500-4_2016/pml.xsd'
schema = etree.XMLSchema(etree.parse(SK)); MC='http://schemas.openxmlformats.org/markup-compatibility/2006'
def errs(path):
    z = zipfile.ZipFile(path); out = {}
    for n in sorted(f for f in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', f)):
        root = etree.fromstring(z.read(n))
        for ac in list(root.iter('{%s}AlternateContent' % MC)):
            fb = ac.find('{%s}Fallback' % MC); parent = ac.getparent(); idx = parent.index(ac)
            for i, c in enumerate(list(fb)): parent.insert(idx + i, c)
            parent.remove(ac)
        schema.validate(root)
        out[n] = {re.sub(r'line \d+', '', e.message) for e in schema.error_log}
    return out
base, anim = errs(sys.argv[1]), errs(sys.argv[2])
new = {n: anim[n] - base.get(n, set()) for n in anim}
for n, e in new.items():
    if e: print('NEW ERRORS', n); [print('   ', x[:220]) for x in list(e)[:6]]
print('slides with new (animation/transition) schema errors:', sum(1 for e in new.values() if e))
