// Dependency-free browser checks using Edge's DevTools protocol.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=process.cwd(),out=path.join(root,'.verification');
const downloads=path.join(out,'nasa-downloads',String(Date.now()));
fs.mkdirSync(downloads,{recursive:true});
fs.copyFileSync(path.join(root,'tools/render-fixture.html'),path.join(out,'render.html'));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const server=spawn('python',['-m','http.server','8779','--bind','127.0.0.1'],{cwd:root,windowsHide:true,stdio:'ignore'});
const browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9349',`--user-data-dir=${path.join(out,'edge-nasa')}`],{windowsHide:true,stdio:'ignore'});
let ws;
const results={pages:[],errors:[],checks:[]};
const uiOnly=process.argv.includes('--ui-only');
const extensionOnly=process.argv.includes('--extension-only');
try{
  let targets;
  for(let i=0;i<60;i++){try{targets=await(await fetch('http://127.0.0.1:9349/json/list')).json();if(targets.some(t=>t.type==='page'))break;}catch{}await delay(200);}
  if(!targets)throw Error('Edge debugging endpoint unavailable');
  ws=new WebSocket(targets.find(t=>t.type==='page'&&!t.url.startsWith('edge://sync')).webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  let seq=0;const pending=new Map();
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}}if(m.method==='Runtime.exceptionThrown')results.errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
  const evaluate=async(expression)=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
  let serverReady=false;
  for(let i=0;i<100;i++){try{serverReady=(await fetch('http://127.0.0.1:8779/index.html')).ok;if(serverReady)break;}catch{}await delay(100);}
  if(!serverReady)throw Error('Local HTTP server did not become ready');
  await send('Page.enable');await send('Runtime.enable');
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
  const navigate=async(url)=>{await send('Page.navigate',{url:`http://127.0.0.1:8779/${url}`});await delay(120);for(let i=0;i<600;i++){const ready=await evaluate(url.includes('render.html')?'document.readyState === "complete" && document.body.dataset.ready === "true"':url.startsWith('index.html')?'!!document.querySelector("#stageFrame>div") && !!document.querySelector("#editContentBtn")':url.includes('studio-deck.html')?'!!document.querySelector(".hud-counter") && !!document.querySelector(".slide")':'document.readyState === "complete"');if(ready)break;await delay(100);} };
  const screenshot=async(name)=>{const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name),Buffer.from(shot.data,'base64'));};
  const geometry=()=>evaluate(`(()=>{const stage=document.querySelector('#slide>div');const bounds=stage.getBoundingClientRect();const issues=[];for(const el of stage.querySelectorAll('*')){if(!el.childNodes.length||!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;const r=el.getBoundingClientRect();if(r.left<bounds.left-1||r.top<bounds.top-1||r.right>bounds.right+1||r.bottom>bounds.bottom+1)issues.push({text:el.textContent.slice(0,70),reason:'outside stage'});if(el.clientHeight&&el.scrollHeight>el.clientHeight+2&&getComputedStyle(el).overflowY==='hidden')issues.push({text:el.textContent.slice(0,70),reason:'clipped'});}return issues;})()`);


  const checks=[];const check=(name,pass)=>{checks.push({name,pass});if(!pass)console.log('FAIL',name);};
  for(const style of ['editorial-magazine','botanical-line','academic-thesis','keynote-dark']){
    for(let page=0;page<7;page++){
      await navigate(`.verification/render.html?topic=solar-system&style=${style}&page=${page}`);
      const issues=await geometry();results.pages.push({style,page,issues});
      check(`${style} page ${page+1} title`,await evaluate(`document.querySelector('#slide').textContent.includes(SlideRenderer.getDeckPlan('${style}',{},'solar-system')[${page}].title)`));
      await screenshot(`nasa-${style}-${page}.png`);
    }
    console.log('Rendered NASA',style);
  }
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('index.html?topic=solar-system&style=keynote-dark');
  check('Seven new pages and original three topics preserved',await evaluate(`document.querySelector('#pageSelect').options.length===7&&['ai-security','cafe-brand','lumina-pitch','solar-system'].every(id=>document.querySelector('[data-topic="'+id+'"]'))`));
  await evaluate(`document.querySelector('#pageSelect').value='2';document.querySelector('#pageSelect').dispatchEvent(new Event('change'));document.querySelector('#editContentBtn').click();document.querySelector('[data-field="title"]').value='NASA資料編修保留驗證';document.querySelector('#contentDialog button[value="save"]').click();document.querySelector('[data-preset="academic-thesis"]').click();document.querySelector('[data-layout="banner-3-rows"]').click();true`);
  check('Edited content survives new style and layout',await evaluate(`document.querySelector('#stageFrame').textContent.includes('NASA資料編修保留驗證')`));
  // Return to clean source data before creating the public comparison artifact.
  await evaluate('localStorage.clear();true');
  await navigate('index.html?topic=solar-system&style=keynote-dark');
  await screenshot('nasa-studio.png');
  await send('Page.bringToFront');
  const position=await evaluate(`(()=>{const r=document.querySelector('#downloadPptBtn').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...position});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...position});
  let file;
  for(let i=0;i<400;i++){file=fs.readdirSync(downloads).find(n=>n.endsWith('.pptx'));if(file)break;await delay(200);}
  if(!file)throw Error('Actual PPT download did not complete');
  fs.mkdirSync(path.join(root,'exports'),{recursive:true});fs.copyFileSync(path.join(downloads,file),path.join(root,'exports','solar-system.pptx'));
  console.log('Actual PPT downloaded:',file,fs.statSync(path.join(downloads,file)).size);
  await navigate('decks/studio-deck.html?topic=solar-system&style=keynote-dark');
  check('New player has seven slides and source notes',await evaluate(`document.querySelectorAll('.slide').length===7&&document.querySelectorAll('.notes').length===7&&document.querySelector('.notes').textContent.includes('nasa.gov')`));
  check('Player controller initialized after topic content',await evaluate('!!document.querySelector(".hud-counter")'));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await navigate('index.html?topic=solar-system&style=keynote-dark');await screenshot('nasa-mobile.png');
  check('Mobile studio fits viewport',await evaluate('document.documentElement.scrollWidth<=innerWidth+1'));
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('decks/solar-system-review.html');
  check('Review page has seven genuine browser/PowerPoint pairs',await evaluate(`(async()=>{const images=[...document.images];images.forEach(img=>img.loading='eager');await Promise.all(images.map(async img=>{try{await img.decode();}catch{const response=await fetch(img.src);console.log('IMAGE LOAD',img.src,response.status);const blob=await response.blob();img.src=URL.createObjectURL(blob);await img.decode();}}));return images.length===14&&images.every(img=>img.naturalWidth===1280&&img.naturalHeight===720);})()`));
  await screenshot('nasa-comparison-desktop.png');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await screenshot('nasa-comparison-mobile.png');
  check('Review page fits mobile width',await evaluate('document.documentElement.scrollWidth<=innerWidth+1'));
  results.checks=checks;results.download=path.join(root,'exports','solar-system.pptx');
  fs.writeFileSync(path.join(out,'nasa-results.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify({rendered:results.pages.length,geometryFailures:results.pages.filter(p=>p.issues.length),failedChecks:checks.filter(c=>!c.pass),runtimeErrors:results.errors},null,2));
  if(results.errors.length||checks.some(c=>!c.pass)||results.pages.some(p=>p.issues.length))process.exitCode=1;
  await send('Browser.close');
}catch(e){console.error(e);process.exitCode=1;fs.writeFileSync(path.join(out,'nasa-results.json'),JSON.stringify({...results,fatal:e.message},null,2));}
finally{ws?.close();server.kill();browser.kill();}
