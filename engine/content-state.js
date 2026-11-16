/* Canonical text survives presentation changes; rendered HTML is only a visual cache. */
(function (root) {
  "use strict";
  const allowed = new Set(["title", "sub", "summary", "kicker", "chapter", "author", "presenter", "dateLabel", "bannerPill", "points", "highlightStat", "dualGroups", "matrixTable", "modelNodes", "scaleNodes", "r2Bars", "notes"]);
  const skip = new Set(["num", "id", "mode", "image", "url", "href", "src", "color", "width", "height"]);
  const norm = value => String(value ?? "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
  const clone = value => JSON.parse(JSON.stringify(value));
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function fields(data) {
    const out = [];
    function walk(value, path) {
      if (typeof value === "string") { out.push({path:path.join("."), value}); return; }
      if (!value || typeof value !== "object") return;
      Object.entries(value).forEach(([key, item]) => { if (!skip.has(key)) walk(item, [...path, key]); });
    }
    Object.entries(data).forEach(([key, value]) => { if (allowed.has(key)) walk(value, [key]); });
    return out;
  }
  function set(data, path, value) {
    const parts=path.split(".");
    if (!allowed.has(parts[0]) || parts.some(k=>["__proto__","prototype","constructor"].includes(k))) return;
    let node=data;
    parts.slice(0,-1).forEach((key,i)=>{ if (!node[key] || typeof node[key]!=="object") node[key]=/^\d+$/.test(parts[i+1])?[]:{}; node=node[key]; });
    node[parts.at(-1)]=value;
  }
  function bind(host, data) {
    const texts=new Map();
    fields(data).forEach(field=>{ const key=norm(field.value); if(key) {if(!texts.has(key))texts.set(key,[]);texts.get(key).push(field.path);} });
    const bound=new Set();
    host.querySelectorAll("[data-content-path]").forEach(el=>{el.removeAttribute("data-content-path");el.removeAttribute("data-content-original");});
    host.querySelectorAll("h1,h2,h3,h4,p,span,strong,li,blockquote,div,td,th").forEach(el=>{
      if(el.closest("[data-atelier-extra],svg,.notes"))return;
      const key=norm(el.textContent), paths=texts.get(key);
      if(!paths || paths.length!==1 || el.querySelector("h1,h2,h3,h4,p,div,li,td,th"))return;
      const parent=el.parentElement?.closest("[data-content-path]"); if(parent)return;
      el.dataset.contentPath=paths[0];el.dataset.contentOriginal=norm(el.textContent);bound.add(paths[0]);
    });
    host.dataset.contentBound=JSON.stringify([...bound]);
  }
  function capture(host, data) {
    const result=clone(data), groups=new Map();
    host.querySelectorAll("[data-content-path]").forEach(el=>{ const path=el.dataset.contentPath; if(!groups.has(path))groups.set(path,[]);groups.get(path).push(el); });
    groups.forEach((nodes,path)=>{
      const changed=nodes.find(el=>norm(el.textContent)!==el.dataset.contentOriginal);
      const selected=changed||nodes[0];
      const source=path.split('.').reduce((value,key)=>value?.[key],data);
      if(changed||norm(source)!==norm(selected.textContent))set(result,path,selected.textContent.trim());
      nodes.forEach(el=>{el.dataset.contentOriginal=norm(el.textContent);});
    });
    let bound=[];try{bound=JSON.parse(host.dataset.contentBound||"[]");}catch{}
    bound.forEach(path=>{if(!groups.has(path))set(result,path,"");});
    result.annotations=Array.from(host.querySelectorAll("[data-atelier-extra]")).map(el=>({tag:el.tagName==="IMG"?"img":"div",text:el.textContent,style:el.style.cssText,src:el.tagName==="IMG"?el.getAttribute("src"):undefined}));
    return Object.fromEntries(Object.entries(result).filter(([key])=>allowed.has(key)||key==="annotations"));
  }
  function renderExtras(items) {
    return (Array.isArray(items)?items:[]).map(item=>{
      const attr=`data-atelier-extra="true" style="${esc(item.style)}"`;
      if(item.tag==="img") return /^(?:data:image\/(?:png|jpeg|webp|gif);base64,|https?:\/\/|\.\.?\/)/i.test(item.src||"")?`<img ${attr} src="${esc(item.src)}" alt="使用者圖片">`:"";
      return `<div ${attr}>${esc(item.text)}</div>`;
    }).join("");
  }
  root.SlideContent={fields,set,bind,capture,renderExtras};
})(globalThis);
