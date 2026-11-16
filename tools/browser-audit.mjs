// Dependency-free browser checks using Edge's DevTools protocol.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=process.cwd(),out=path.join(root,'.verification');
fs.mkdirSync(path.join(out,'downloads'),{recursive:true});
fs.copyFileSync(path.join(root,'tools/render-fixture.html'),path.join(out,'render.html'));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const server=spawn('python',['-m','http.server','8769','--bind','127.0.0.1'],{cwd:root,windowsHide:true,stdio:'ignore'});
const browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9335',`--user-data-dir=${path.join(out,'edge-audit')}`],{windowsHide:true,stdio:'ignore'});
let ws;
const results={pages:[],errors:[],checks:[]};
const uiOnly=process.argv.includes('--ui-only');
const extensionOnly=process.argv.includes('--extension-only');
try{
  let targets;
  for(let i=0;i<60;i++){try{targets=await(await fetch('http://127.0.0.1:9335/json/list')).json();if(targets.some(t=>t.type==='page'))break;}catch{}await delay(200);}
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
  const navigate=async(url)=>{await send('Page.navigate',{url:`http://127.0.0.1:8769/${url}`});await delay(120);for(let i=0;i<60;i++){const ready=await evaluate(url.includes('render.html')?'document.readyState === "complete" && document.body.dataset.ready === "true"':'document.readyState === "complete"');if(ready)break;await delay(100);} };
  const screenshot=async(name)=>{const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name),Buffer.from(shot.data,'base64'));};
  const geometry=()=>evaluate(`(()=>{const stage=document.querySelector('#slide>div');const bounds=stage.getBoundingClientRect();const issues=[];for(const el of stage.querySelectorAll('*')){if(!el.childNodes.length||!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;const r=el.getBoundingClientRect();if(r.left<bounds.left-1||r.top<bounds.top-1||r.right>bounds.right+1||r.bottom>bounds.bottom+1)issues.push({text:el.textContent.slice(0,70),reason:'outside stage'});if(el.clientHeight&&el.scrollHeight>el.clientHeight+2&&getComputedStyle(el).overflowY==='hidden')issues.push({text:el.textContent.slice(0,70),reason:'clipped'});}return issues;})()`);
  const styles=['editorial-magazine','botanical-line','academic-thesis','keynote-dark'];
  const topics=extensionOnly?[['review-checklist',4]]:[['ai-security',20],['cafe-brand',20],['lumina-pitch',20]];
  await navigate('.verification/render.html');
  const layouts=await evaluate('window.SlideRenderer.COMPOUND_LAYOUTS.map(l=>l.id)');
  for(const style of uiOnly?[]:styles){
    for(const [topic,count] of topics)for(let page=0;page<count;page++){
      await navigate(`.verification/render.html?style=${style}&${extensionOnly?'example':'topic'}=${topic}&page=${page}`);
      const issues=await geometry();results.pages.push({style,topic,page,issues});
      await screenshot(`${style}-${topic}-${page}.png`);
    }
    for(const layout of extensionOnly?[]:layouts){
      for(const empty of [false,true]){
        await navigate(`.verification/render.html?style=${style}&layout=${layout}${empty?'&empty=1':''}`);
        const issues=await geometry();results.pages.push({style,layout,empty,issues});
        if(!empty)await screenshot(`${style}-layout-${layout}.png`);
      }
    }
    console.log(`Rendered and checked ${style}.`);
  }
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await navigate('index.html');
  await evaluate('localStorage.clear();location.reload();true');await delay(500);
  await screenshot('studio-fixed.png');
  results.checks.push({name:'original examples and 30 layouts in studio',pass:await evaluate('["ai-security","cafe-brand","lumina-pitch"].every(id=>document.querySelector(`[data-topic="${id}"]`)) && document.querySelectorAll("#layoutSwitcher [data-layout]").length===30 && document.querySelector("#pageSelect").options.length===20')});
  const example=fs.readFileSync('examples/rules-demo.json','utf8');
  await evaluate(`document.querySelector('#openImportModalBtn').click();document.querySelector('#importTextInput').value=${JSON.stringify(example)};document.querySelector('#runImportBtn').click();true`);
  results.checks.push({name:'JSON import in UI',pass:await evaluate('document.querySelector("#pageSelect").options.length===3 && !document.querySelector("#importModal").classList.contains("is-open")')});
  const titlePosition=await evaluate(`(()=>{const r=document.querySelector('#stageFrame h1').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...titlePosition});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...titlePosition});
  await evaluate(`(()=>{const el=document.querySelector('#stageFrame h1');el.textContent='編修內容保留測試';el.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`);
  const player=await evaluate('document.querySelector("#openDeckBtn").getAttribute("href")');
  await navigate(player);
  results.checks.push({name:'edited text reaches player',pass:await evaluate('document.querySelector(".deck").textContent.includes("編修內容保留測試")')});
  results.checks.push({name:'actual player count',pass:await evaluate('document.querySelectorAll(".slide").length===3 && document.querySelector(".hud-title").textContent.includes("3頁")')});
  await screenshot('player-fixed.png');
  await evaluate('document.querySelector("#studioPillToggle").click();true');
  results.checks.push({name:'4 locked styles and 30 player layouts',pass:await evaluate('document.querySelectorAll("#sqPresets button").length===4 && document.querySelectorAll("#sqLayouts button").length===30')});
  await evaluate('document.querySelector("#studioPillToggle").click();true');
  try{
    await evaluate(`(async()=>{await window.SlidePptxExporter.exportDeck({slideElements:Array.from(document.querySelectorAll('.slide')),deckTitle:'rules-demo-validation'});return true;})()`);
    for(let i=0;i<50;i++){if(fs.readdirSync(path.join(out,'downloads')).some(n=>n.endsWith('.pptx')))break;await delay(200);}
    results.checks.push({name:'native PPTX download',pass:fs.readdirSync(path.join(out,'downloads')).some(n=>n.endsWith('.pptx'))});
  }catch(e){results.checks.push({name:'native PPTX download',pass:false,error:e.message});}
  await navigate('project.html');await screenshot('project-fixed.png');
  for(const sample of ['editorial-proof','thesis-ct-mambarec']){
    await navigate(`decks/${sample}.html`);await screenshot(`restored-${sample}.png`);
    results.checks.push({name:`restored standalone ${sample}`,pass:await evaluate('document.body.innerText.length>100')});
  }
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await navigate('index.html');await screenshot('studio-mobile.png');
  results.checks.push({name:'mobile no horizontal clipping',pass:await evaluate('document.documentElement.scrollWidth<=window.innerWidth+1')});
  await navigate('project.html');await screenshot('project-mobile.png');
  results.checks.push({name:'project mobile no horizontal clipping',pass:await evaluate('document.documentElement.scrollWidth<=window.innerWidth+1')});
  fs.writeFileSync(path.join(out,extensionOnly?'browser-extension-results.json':uiOnly?'browser-ui-results.json':'browser-results.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify({rendered:results.pages.length,geometryFailures:results.pages.filter(p=>p.issues.length),runtimeErrors:results.errors,checks:results.checks},null,2));
  if(results.errors.length||results.pages.some(p=>p.issues.length)||results.checks.some(c=>!c.pass))process.exitCode=1;
  await send('Browser.close');
}catch(e){console.error(e);process.exitCode=1;fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({...results,fatal:e.message},null,2));}
finally{ws?.close();server.kill();browser.kill();}
