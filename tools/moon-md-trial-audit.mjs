import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const deck=JSON.parse(fs.readFileSync('examples/moon-md-trial.json','utf8'));
const ctx=vm.createContext({window:{},console});
for(const f of ['template-svgs','renderer'])vm.runInContext(fs.readFileSync(`engine/${f}.js`,'utf8'),ctx);
const SR=ctx.window.SlideRenderer;SR.registerCustomTopic(deck);
for(const p of deck.pages){assert.equal(p.points.length,3);const n=p.summary.length+p.points.reduce((n,x)=>n+(x.title+x.stat+x.desc+x.action).length,0);assert.ok(n>=80&&n<=120,`${p.title}: ${n}`);for(const x of p.points){assert.ok(x.title.length>=2&&x.title.length<=6);assert.ok(x.desc.length>=18&&x.desc.length<=25);}}
for(const preset of SR.STYLE_PRESETS)for(const p of SR.getDeckPlan(preset.templateId,{},deck.id))assert.ok(!/undefined|NaN/.test(SR.renderSlideInner(preset.templateId,p)));
const out=path.resolve('.verification/moon-md-trial');fs.mkdirSync(out,{recursive:true});
const server=spawn('python',['-m','http.server','8785','--bind','127.0.0.1'],{windowsHide:true,stdio:'ignore'});
const edge=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9355',`--user-data-dir=${path.join(out,'edge-profile')}`],{windowsHide:true,stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));let ws;const result={screens:[],errors:[]};
try{
 let targets;for(let i=0;i<100;i++){try{targets=await(await fetch('http://127.0.0.1:9355/json/list')).json();if(targets.some(t=>t.type==='page'))break;}catch{}await delay(100);}
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map();ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
 await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
 const navigate=async url=>{await send('Page.navigate',{url:`http://127.0.0.1:8785/${url}`});await delay(100);for(let i=0;i<200;i++){if(await evaluate('document.body?.dataset.ready === "true"'))break;await delay(50);}await evaluate('document.fonts.ready.then(()=>true)');};
 for(const style of SR.STYLE_PRESETS.map(p=>p.templateId))for(let page=0;page<deck.pages.length;page++){
  await navigate(`tools/render-fixture.html?topic=${deck.id}&style=${style}&page=${page}`);
  const issues=await evaluate(`(()=>{const stage=document.querySelector('#slide>div'),b=stage.getBoundingClientRect(),issues=[];for(const el of stage.querySelectorAll('*')){if(!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;const r=el.getBoundingClientRect();if(r.left<b.left-1||r.top<b.top-1||r.right>b.right+1||r.bottom>b.bottom+1)issues.push(el.textContent.slice(0,70));if(el.clientHeight&&el.scrollHeight>el.clientHeight+2&&getComputedStyle(el).overflowY==='hidden')issues.push('clipped:'+el.textContent.slice(0,70));}return issues;})()`);
  const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const file=`${style}-${page}.png`;fs.writeFileSync(path.join(out,file),Buffer.from(shot.data,'base64'));result.screens.push({style,page,file,issues});
 }
 await send('Page.navigate',{url:`http://127.0.0.1:8785/index.html?topic=${deck.id}`});await delay(1500);result.studioTopic=await evaluate(`!!document.querySelector('[data-topic="${deck.id}"]')`);const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'studio.png'),Buffer.from(shot.data,'base64'));
}catch(e){result.errors.push(e.stack);}finally{fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));ws?.close();edge.kill();server.kill();}
console.log(JSON.stringify({pages:result.screens.length,issues:result.screens.filter(p=>p.issues.length),studioTopic:result.studioTopic,errors:result.errors},null,2));
if(result.errors.length||result.screens.some(p=>p.issues.length))process.exitCode=1;
