// Dependency-free browser checks using Edge's DevTools protocol.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=process.cwd(),out=path.join(root,'.verification');
fs.mkdirSync(path.join(out,'downloads'),{recursive:true});
fs.copyFileSync(path.join(root,'tools/render-fixture.html'),path.join(out,'render.html'));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const server=spawn('python',['-m','http.server','8773','--bind','127.0.0.1'],{cwd:root,windowsHide:true,stdio:'ignore'});
const browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9339',`--user-data-dir=${path.join(out,'edge-personal')}`],{windowsHide:true,stdio:'ignore'});
let ws;
const results={pages:[],errors:[],checks:[]};
const uiOnly=process.argv.includes('--ui-only');
const extensionOnly=process.argv.includes('--extension-only');
try{
  let targets;
  for(let i=0;i<60;i++){try{targets=await(await fetch('http://127.0.0.1:9339/json/list')).json();if(targets.some(t=>t.type==='page'))break;}catch{}await delay(200);}
  if(!targets)throw Error('Edge debugging endpoint unavailable');
  ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  let seq=0;const pending=new Map();
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}}if(m.method==='Runtime.exceptionThrown')results.errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
  const evaluate=async(expression)=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
  await send('Page.enable');await send('Runtime.enable');
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:path.join(out,'downloads')});
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
  const navigate=async(url)=>{await send('Page.navigate',{url:`http://127.0.0.1:8773/${url}`});await delay(120);for(let i=0;i<400;i++){const ready=await evaluate(url.includes('render.html')?'document.readyState === "complete" && document.body.dataset.ready === "true"':url.startsWith('index.html')?'!!document.querySelector("#editContentBtn") && !!document.querySelector("#stageFrame>div")':'document.readyState === "complete"');if(ready)break;await delay(100);} };
  const screenshot=async(name)=>{const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name),Buffer.from(shot.data,'base64'));};
  const geometry=()=>evaluate(`(()=>{const stage=document.querySelector('#slide>div');const bounds=stage.getBoundingClientRect();const issues=[];for(const el of stage.querySelectorAll('*')){if(!el.childNodes.length||!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;const r=el.getBoundingClientRect();if(r.left<bounds.left-1||r.top<bounds.top-1||r.right>bounds.right+1||r.bottom>bounds.bottom+1)issues.push({text:el.textContent.slice(0,70),reason:'outside stage'});if(el.clientHeight&&el.scrollHeight>el.clientHeight+2&&getComputedStyle(el).overflowY==='hidden')issues.push({text:el.textContent.slice(0,70),reason:'clipped'});}return issues;})()`);
  const check=(name,pass)=>{results.checks.push({name,pass});if(!pass)console.log('FAIL',name);};
  for(const style of ['editorial-magazine','botanical-line','academic-thesis','keynote-dark']){
    for(let page=0;page<20;page++){
      await navigate(`.verification/render.html?style=${style}&topic=ziwei-reading&page=${page}`);
      if(!await evaluate("!!document.querySelector('#slide>div')")){console.log(await evaluate("JSON.stringify({url:location.href,html:document.documentElement.outerHTML.slice(0,2500)})"));throw Error("Render fixture did not load");}
      const issues=await geometry();results.pages.push({style,page,issues});
      await screenshot(`ziwei-${style}-${page}.png`);
      check(`${style} page ${page+1} meaningful source text`,await evaluate(`(()=>{const p=SlideRenderer.getDeckPlan('${style}',{},'ziwei-reading')[${page}],t=document.querySelector('#slide').textContent;return t.includes(p.title)&&p.points.every(x=>t.includes(x.title)&&t.includes(x.desc))&&!/undefined|NaN/.test(t)&&!document.querySelector('#slide img');})()`));
    }
    console.log('Rendered personal PDF:',style);
  }
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('index.html?topic=ziwei-reading');
  check('20 personal pages and all three original examples',await evaluate(`document.querySelector('#pageSelect').options.length===20&&['ai-security','cafe-brand','lumina-pitch','ziwei-reading'].every(id=>document.querySelector('[data-topic="'+id+'"]'))`));
  await screenshot('ziwei-studio.png');
  await evaluate(`document.querySelector('#editContentBtn').click();document.querySelector('#contentDialog [data-field="title"]').value='我的紫微斗數讀書簡報';document.querySelector('#contentDialog button[value="save"]').click();true`);
  check('canonical content editor saved',await evaluate(`document.querySelector('#stageFrame').textContent.includes('我的紫微斗數讀書簡報')`));
  const position=await evaluate(`(()=>{const r=document.querySelector('#stageFrame h1').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...position});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...position});
  await evaluate(`const h=document.querySelector('#stageFrame h1');h.textContent='直接編輯也要保留';h.dispatchEvent(new Event('input',{bubbles:true}));true`);
  for(const preset of ['botanical-line','academic-thesis','keynote-dark','editorial-magazine']){
    await evaluate(`document.querySelector('[data-preset="${preset}"]').click();true`);
    check(`direct edit survives ${preset}`,await evaluate(`document.querySelector('#stageFrame').textContent.includes('直接編輯也要保留')`));
  }
  const layouts=await evaluate('SlideRenderer.COMPOUND_LAYOUTS.map(x=>x.id)');
  for(const layout of layouts){
    await evaluate(`document.querySelector('[data-layout="${layout}"]').click();true`);
    check(`edited title survives ${layout}`,await evaluate(`document.querySelector('#stageFrame').textContent.includes('直接編輯也要保留')`));
  }
  await evaluate(`document.querySelector('#pageSelect').value='1';document.querySelector('#pageSelect').dispatchEvent(new Event('change'));true`);
  for(const layout of layouts){
    await evaluate(`document.querySelector('[data-layout="${layout}"]').click();true`);
    check(`all source points survive ${layout}`,await evaluate(`(()=>{const t=document.querySelector('#stageFrame').textContent.replace(/\\s+/g,'');return SlideRenderer.getDeckPlan('editorial-magazine',{},'ziwei-reading')[1].points.every(p=>t.includes(p.title.replace(/\\s+/g,''))&&t.includes(p.desc.replace(/\\s+/g,'')));})()`));
  }
  await evaluate(`document.querySelector('#pageSelect').value='0';document.querySelector('#pageSelect').dispatchEvent(new Event('change'));true`);
  await evaluate(`document.querySelector('[data-topic="cafe-brand"]').click();document.querySelector('[data-topic="ziwei-reading"]').click();true`);
  check('switch topic and back preserves source edits',await evaluate(`document.querySelector('#stageFrame').textContent.includes('直接編輯也要保留')`));
  await evaluate(`document.querySelector('#resetPageBtn').click();document.querySelector('#elAddText').click();const el=document.querySelector('[data-atelier-extra]');el.textContent='我自己的補充文字';el.dispatchEvent(new Event('input',{bubbles:true}));true`);
  await evaluate(`document.querySelector('[data-preset="academic-thesis"]').click();document.querySelector('[data-layout="cover-framed-grid"]').click();true`);
  check('user-added text survives style and layout changes',await evaluate(`document.querySelector('#stageFrame').textContent.includes('我自己的補充文字')`));
  await evaluate(`document.querySelector('#resetPageBtn').click();true`);
  // Reload preserves source data; stage cache may also contain additional user objects.
  await navigate('index.html?topic=ziwei-reading');
  check('reload retains edited content',await evaluate(`document.querySelector('#stageFrame').textContent.includes('直接編輯也要保留')`));
  const player=await evaluate('document.querySelector("#openDeckBtn").getAttribute("href")');
  await navigate(player);
  check('20-page player receives edited content',await evaluate(`document.querySelectorAll('.slide').length===20&&document.querySelector('.deck').textContent.includes('直接編輯也要保留')`));
  await evaluate(`(async()=>{await SlidePptxExporter.exportDeck({slideElements:[...document.querySelectorAll('.slide')],deckTitle:'ziwei-personal-validation'});return true;})()`);
  for(let i=0;i<80;i++){if(fs.readdirSync(path.join(out,'downloads')).some(n=>n.startsWith('ziwei-personal-validation')&&n.endsWith('.pptx')))break;await delay(200);}
  check('personal PDF deck native PPTX generated',fs.readdirSync(path.join(out,'downloads')).some(n=>n.startsWith('ziwei-personal-validation')&&n.endsWith('.pptx')));
  await evaluate(`(async()=>{await SlidePptxExporter.exportDeck({topicId:'ziwei-reading',recipe:{templateId:'academic-thesis'},pageOverrides:{},customHtmlByPage:{},assetBase:'../assets/',deckTitle:'ziwei-reading-20'});return true;})()`);
  for(let i=0;i<80;i++){if(fs.readdirSync(path.join(out,'downloads')).some(n=>n==='ziwei-reading-20.pptx'))break;await delay(200);}
  const artifact=path.join(out,'downloads','ziwei-reading-20.pptx');
  check('clean original book PPTX generated',fs.existsSync(artifact));
  if(fs.existsSync(artifact)){fs.mkdirSync(path.join(root,'exports'),{recursive:true});fs.copyFileSync(artifact,path.join(root,'exports','ziwei-reading.pptx'));}
  await screenshot('ziwei-player.png');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await navigate('index.html?topic=ziwei-reading');await screenshot('ziwei-mobile.png');
  check('mobile page fits viewport',await evaluate('document.documentElement.scrollWidth<=innerWidth+1'));
  await evaluate(`document.querySelector('#editContentBtn').click();true`);await screenshot('ziwei-content-editor-mobile.png');
  check('mobile content editor fits viewport',await evaluate(`document.querySelector('#contentDialog').getBoundingClientRect().width<=innerWidth`));
  fs.writeFileSync(path.join(out,'personal-deck-results.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify({rendered:results.pages.length,geometryFailures:results.pages.filter(p=>p.issues.length),runtimeErrors:results.errors,failedChecks:results.checks.filter(c=>!c.pass),passed:results.checks.filter(c=>c.pass).length},null,2));
  if(results.errors.length||results.pages.some(p=>p.issues.length)||results.checks.some(c=>!c.pass))process.exitCode=1;
  await send('Browser.close');
}catch(e){try{console.error(await evaluate('JSON.stringify({url:location.href,html:document.documentElement.outerHTML.slice(0,3000)})'));}catch{}console.error(e);process.exitCode=1;fs.writeFileSync(path.join(out,'personal-deck-results.json'),JSON.stringify({...results,fatal:e.message},null,2));}
finally{ws?.close();server.kill();browser.kill();}
