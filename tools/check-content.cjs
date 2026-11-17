// Run with: node tools/check-content.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const storage = new Map();
const context = vm.createContext({window:{},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console});
for (const file of ['template-svgs.js','content-state.js','renderer.js']) vm.runInContext(fs.readFileSync(`engine/${file}`,'utf8'),context);
const {SlideRenderer:SR} = context.window;
const demoDigests=JSON.parse(fs.readFileSync('tools/original-demo-digests.json','utf8'));
assert.equal(SR.COMPOUND_LAYOUTS.length,30,'Keep all 30 distinct layout definitions');
for(const [id,expected] of Object.entries(demoDigests)){
  const originalPlan=SR.getDeckPlan('editorial-magazine',{},id);
  assert.equal(originalPlan.length,20,'Keep all 20 pages');
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(originalPlan)).digest('hex'),expected.sha256,`Keep the complete original ${id} dataset`);
}
const rulesDemo = JSON.parse(fs.readFileSync('examples/rules-demo.json','utf8'));
const extended = JSON.parse(fs.readFileSync('examples/review-checklist.json','utf8'));
assert.equal(extended.pages.length,4,'New content follows the same contract without changing the engine');
assert.ok(extended.pages.every(p=>(p.points||[]).length<=4&&!p.image&&!p.highlightStat));
assert.equal((rulesDemo.pages[0].points||[]).length,0,'An empty cover must stay empty');
assert.ok(rulesDemo.pages.every(p=>!p.image&&!p.kicker),'Optional content must stay absent');
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
const nasa = JSON.parse(fs.readFileSync('examples/solar-system.json','utf8'));
assert.equal(nasa.pages.length,7);
for(const page of nasa.pages){
  assert.equal(page.points.length,3);
  const bodyLength=page.summary.length+page.points.reduce((n,p)=>n+(p.title+p.desc+p.action+(p.stat||'')).length,0);
  assert.ok(bodyLength>=80&&bodyLength<=120,`${page.title}: body density`);
  assert.ok(page.points.every(p=>p.title.length>=2&&p.title.length<=6&&p.desc.length>=18&&p.desc.length<=25));
  assert.ok(page.notes.includes('nasa.gov'),'Keep primary source attribution');
}
SR.registerCustomTopic(nasa);
for(const preset of SR.STYLE_PRESETS){
  const plan=SR.getDeckPlan(preset.templateId,{},nasa.id);
  assert.equal(plan.length,7);
  plan.forEach(page=>assert.ok(!/undefined|NaN/.test(SR.renderSlideInner(preset.templateId,page))));
}
assert.deepEqual(nasa.pages[4].points.map(p=>p.stat),['50%','25%','25%']);
assert.equal(nasa.pages[3].matrixTable.rows.reduce((n,row)=>n+Number(row[2]),0),8);
console.log('PASS: original demo preservation, optional fields, locked styles, honest bars, and NASA seven-page content contract.');
