// Dependency-free browser checks using Edge's DevTools protocol.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=process.cwd(),out=path.join(root,'.verification');
const downloads=path.join(out,'personal-downloads',String(Date.now()));
fs.mkdirSync(downloads,{recursive:true});
fs.copyFileSync(path.join(root,'tools/render-fixture.html'),path.join(out,'render.html'));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const server=spawn('python',['-m','http.server','8773','--bind','127.0.0.1'],{cwd:root,windowsHide:true,stdio:'ignore'});
const browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9345',`--user-data-dir=${path.join(out,'edge-typography-fresh')}`],{windowsHide:true,stdio:'ignore'});
let ws;
const results={pages:[],errors:[],checks:[]};
const uiOnly=process.argv.includes('--ui-only');
const extensionOnly=process.argv.includes('--extension-only');
try{
  let targets;
  for(let i=0;i<60;i++){try{targets=await(await fetch('http://127.0.0.1:9345/json/list')).json();if(targets.some(t=>t.type==='page'))break;}catch{}await delay(200);}
  if(!targets)throw Error('Edge debugging endpoint unavailable');
  ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  let seq=0;const pending=new Map();
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}}if(m.method==='Runtime.exceptionThrown')results.errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
  const evaluate=async(expression)=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
  await send('Page.enable');await send('Runtime.enable');
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
  const navigate=async(url)=>{await send('Page.navigate',{url:`http://127.0.0.1:8773/${url}`});await delay(120);for(let i=0;i<400;i++){const ready=await evaluate(url.includes('render.html')?'document.readyState === "complete" && document.body.dataset.ready === "true"':url.startsWith('index.html')?'!!document.querySelector("#editContentBtn") && !!document.querySelector("#stageFrame>div")':'document.readyState === "complete"');if(ready)break;await delay(100);} };
  const screenshot=async(name)=>{const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name),Buffer.from(shot.data,'base64'));};
  const geometry=()=>evaluate(`(()=>{const stage=document.querySelector('#slide>div');const bounds=stage.getBoundingClientRect();const issues=[];for(const el of stage.querySelectorAll('*')){if(!el.childNodes.length||!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;const r=el.getBoundingClientRect();if(r.left<bounds.left-1||r.top<bounds.top-1||r.right>bounds.right+1||r.bottom>bounds.bottom+1)issues.push({text:el.textContent.slice(0,70),reason:'outside stage'});if(el.clientHeight&&el.scrollHeight>el.clientHeight+2&&getComputedStyle(el).overflowY==='hidden')issues.push({text:el.textContent.slice(0,70),reason:'clipped'});}return issues;})()`);

 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await navigate('index.html?topic=ziwei-reading');
 console.log('START',await evaluate('JSON.stringify({url:location.href,ready:document.readyState,editor:!!document.querySelector("#editContentBtn"),heading:!!document.querySelector("#stageFrame h1"),scripts:[...document.scripts].filter(s=>s.src).map(s=>s.src)})'));console.log(results.errors);
 const errors=[];
 const check=async(name,test)=>{const pass=await evaluate(test);console.log(name,pass);if(!pass)errors.push(name);};
 await check('font controls immediately enabled','["elFontFamily","elFontSize","elTextColor"].every(id=>!document.getElementById(id).disabled)');
 await check('current cover size shown','document.querySelector("#elFontSize").value==="52px"');
 await evaluate(`document.querySelector('#pageSelect').value='10';document.querySelector('#pageSelect').dispatchEvent(new Event('change'));const select=document.querySelector('#elTextTarget');select.value=String([...select.options].find(o=>o.textContent.startsWith('正文')).value);select.dispatchEvent(new Event('change'));true`);
 await check('body selected through target menu','document.querySelector("[data-edit-selected]").matches("p")&&document.querySelector("#elFontSize").value==="17px"');
 await evaluate(`for(const [id,value] of [['elFontFamily',"'Microsoft JhengHei', sans-serif"],['elFontSize','24px'],['elTextColor','#a1263f']]){const el=document.getElementById(id);el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));}true`);
 await check('actual rendered font, size and color changed',`(()=>{const s=getComputedStyle(document.querySelector('[data-edit-selected]'));return s.fontFamily.includes('Microsoft JhengHei')&&s.fontSize==='24px'&&s.color==='rgb(161, 38, 63)';})()`);
 await screenshot('typography-desktop.png');
 await navigate('index.html?topic=ziwei-reading');
 await evaluate(`document.querySelector('#pageSelect').value='10';document.querySelector('#pageSelect').dispatchEvent(new Event('change'));true`);
 await check('format change preserved on reload',`[...document.querySelectorAll('#stageFrame p')].some(p=>getComputedStyle(p).fontSize==='24px'&&getComputedStyle(p).color==='rgb(161, 38, 63)')`);
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await delay(200);
 await evaluate(`const select=document.querySelector('#elTextTarget');select.value=String([...select.options].find(o=>o.textContent.startsWith('正文')).value);select.dispatchEvent(new Event('change'));true`);
 await check('mobile typography choices enabled','!document.querySelector("#elFontFamily").disabled&&!document.querySelector("#elFontSize").disabled&&!document.querySelector("#elTextColor").disabled');
 await screenshot('typography-mobile.png');
 fs.writeFileSync(path.join(out,'typography-results.json'),JSON.stringify({passed:6-errors.length,failures:errors},null,2));
 if(errors.length)throw Error(errors.join(', '));await send('Browser.close');
}catch(e){console.error(e);process.exitCode=1;}finally{ws?.close();server.kill();browser.kill();}
