// Run with: node tools/check-content.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const storage = new Map();
const context = vm.createContext({window:{},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console});
for (const file of ['renderer.js','importer.js']) vm.runInContext(fs.readFileSync(`engine/${file}`,'utf8'),context);
const {SlideRenderer:SR,SlideImporter:SI} = context.window;
const demoDigests=JSON.parse(fs.readFileSync('tools/original-demo-digests.json','utf8'));
assert.equal(SR.COMPOUND_LAYOUTS.length,30,'Keep all 30 distinct layout definitions');
for(const [id,expected] of Object.entries(demoDigests)){
  const originalPlan=SR.getDeckPlan('editorial-magazine',{},id);
  assert.equal(originalPlan.length,20,'Keep all 20 pages');
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(originalPlan)).digest('hex'),expected.sha256,`Keep the complete original ${id} dataset`);
}
const imported = SI.parseRawContentToDeck(fs.readFileSync('examples/rules-demo.json','utf8'));
const extended = SI.parseRawContentToDeck(fs.readFileSync('examples/review-checklist.json','utf8'));
assert.equal(extended.pages.length,4,'New content follows the same contract without changing the engine');
assert.ok(extended.pages.every(p=>p.points.length<=4&&!p.image&&!p.highlightStat));
assert.equal(imported.pages[0].points.length,0,'An empty cover must stay empty');
assert.ok(imported.pages.every(p=>!p.image&&!p.kicker),'Optional content must stay absent');
SR.registerCustomTopic(imported);
assert.ok(SR.getDeckPlan('editorial-magazine',{},imported.id).every(p=>!p.image),'No default photos');
const many = {pages:Array.from({length:25},(_,i)=>({title:`Source ${i}`,points:[]}))};
assert.equal(SI.parseRawContentToDeck(JSON.stringify(many)).pages.length,25,'Do not discard pages after page 20');
const split = SI.parseRawContentToDeck(JSON.stringify({pages:[{title:'Long list',mode:'banner-3-rows',points:Array.from({length:9},(_,i)=>({title:`Item ${i}`}))}]}));
assert.ok(split.pages.every(p=>p.points.length<=4),'Split long lists');
assert.equal(split.pages.flatMap(p=>p.points).length,9,'Retain every point');
assert.throws(()=>SI.parseRawContentToDeck('{"pages":[{"points":[]}]}'),/title/,'Explain invalid JSON content');
assert.throws(()=>SI.parseRawContentToDeck('{"pages":'),/JSON/,'Explain invalid JSON syntax');
assert.equal(SR.CORE_LAYOUTS.length,10);
for(const preset of SR.STYLE_PRESETS){
  const tpl=SR.getTemplate({templateId:preset.templateId,colorId:'mono-ink',fontId:'archival-mono'});
  assert.equal(tpl.colorId,preset.colorId,'Lock palette'); assert.equal(tpl.fontId,preset.fontId,'Lock fonts');
  for(const topic of SR.TOPICS){
    const plan=SR.getDeckPlan(preset.templateId,{},topic.id);
    assert.equal(plan.length,topic.count);
    for(const page of plan){
      const html=SR.renderSlideInner(preset.templateId,page);
      assert.ok(!/undefined|NaN/.test(html));
      // Built-in examples retain their explicitly supplied photos and complete data.
    }
  }
  for(const layout of SR.CORE_LAYOUTS){
    const html=SR.renderSlideInner(preset.templateId,{title:'Empty optional fields',mode:layout.id,num:'02',total:2,points:[]});
    assert.ok(!/undefined|NaN|repeat\(0,/.test(html),`${layout.id} must handle missing data`);
  }
}
const bar=SR.renderSlideInner('editorial-magazine',{mode:'bars-insight-split',title:'Source values',num:'02',points:[{title:'Zero',stat:'0%'},{title:'Small',stat:'2%'},{title:'Unscaled',stat:'40'}]});
assert.match(bar,/width:0%/);assert.match(bar,/width:2%/);assert.ok(!bar.includes('data-el="bar-2"'));
const zeroTable=SR.renderSlideInner('editorial-magazine',{mode:'matrix-table-split',title:'Source table',num:'02',points:[],matrixTable:{headers:['Value'],rows:[[0]]}});
assert.match(zeroTable,/>0<\/(?:td|span)>/,'Preserve numeric zero in tables');
const suppliedBars=SR.renderSlideInner('editorial-magazine',{mode:'bars-insight-split',title:'Supplied values',num:'02',points:[],r2Bars:[{name:'Exact value',val:0,desc:'Supplied zero'}]});
assert.match(suppliedBars,/Exact value/);assert.match(suppliedBars,/Supplied zero/);
const longText='A'.repeat(180)+' SOURCE_END';
const longDeck=SI.parseRawContentToDeck(JSON.stringify({pages:[{title:'Long content',points:[{title:'Source',desc:longText}]}]}));
assert.ok(longDeck.pages.some(p=>p.points.some(pt=>pt.desc.includes('SOURCE_END'))),'Never truncate source text');
const sentences=Array.from({length:8},(_,i)=>`Sentence ${i}: ${'word '.repeat(14)}。`).join('');
const dense=SI.parseRawContentToDeck(JSON.stringify({pages:[{title:'Dense content',points:[{title:'Source',desc:sentences}]}]}));
assert.ok(dense.pages.length>1,'Paginate dense paragraphs at sentence boundaries');
assert.equal(dense.pages.flatMap(p=>p.points).map(p=>p.desc||'').join(''),sentences,'Retain complete dense source text');
assert.throws(()=>SI.parseRawContentToDeck(JSON.stringify({pages:[{title:'Source',points:[{title:'Detail',desc:'x'.repeat(400)}]}]})),/未被截斷/,'Explain unbreakable content instead of clipping');
console.log('PASS: content preservation, optional fields, locked presets, 10 layouts, honest bar scale.');
