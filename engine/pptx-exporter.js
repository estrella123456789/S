/* ==========================================================================
   Slide Atelier V5 — True Element-By-Element PowerPoint (.pptx) Exporter
   - Fixes the black background bug (`rgba(0,0,0,0)` -> null instead of `#000000`)
   - Walks live unscaled 1280x720 DOM nodes to emit separate, independently
     movable & editable PowerPoint shapes, rich text boxes, images & SVG art
   ========================================================================== */
window.SlidePptxExporter = (() => {
  const SLIDE_W_PX = 1280;
  const SLIDE_H_PX = 720;
  const PPT_W_IN = 10.0;
  const PPT_H_IN = 5.625;

  function toInX(px) { return (px / SLIDE_W_PX) * PPT_W_IN; }
  function toInY(px) { return (px / SLIDE_H_PX) * PPT_H_IN; }

  function parseColorToHex(cssColor) {
    if (!cssColor || typeof cssColor !== "string") return null;
    const raw = cssColor.trim().toLowerCase();
    if (!raw || raw === "transparent" || raw === "none" || raw === "inherit") return null;

    if (raw.startsWith("#")) {
      let h = raw.slice(1);
      if (h.length === 3) h = h.split("").map((c) => c + c).join("");
      if (h.length === 8) {
        const alpha = parseInt(h.slice(6, 8), 16) / 255;
        if (alpha <= 0.02) return null;
        h = h.slice(0, 6);
      }
      if (/^[0-9a-f]{6}$/i.test(h)) return h.toUpperCase();
      return null;
    }

    const m = raw.match(/rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/);
    if (!m) return null;
    if (m[4] !== undefined && parseFloat(m[4]) <= 0.02) return null;
    const hex = [m[1], m[2], m[3]]
      .map((n) => Math.max(0, Math.min(255, Math.round(parseFloat(n)))).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
    return hex;
  }

  function parseAlpha(cssColor) {
    if (!cssColor || typeof cssColor !== "string") return 1;
    const m = cssColor.trim().match(/rgba?\([^)]*[,/]\s*([\d.]+)\s*\)/i);
    return m && m[1] !== undefined ? parseFloat(m[1]) : 1;
  }

  async function ensurePptxGen() {
    if (window.PptxGenJS) return window.PptxGenJS;
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js";
      s.onload = resolve;
      s.onerror = () => reject(new Error("無法載入 PptxGenJS（請確認網路連線）"));
      document.head.appendChild(s);
    });
    return window.PptxGenJS;
  }

  async function svgElementToPngData(svgEl, targetW, targetH) {
    try {
      const clone = svgEl.cloneNode(true);
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      clone.setAttribute("width", String(Math.max(10, Math.round(targetW))));
      clone.setAttribute("height", String(Math.max(10, Math.round(targetH))));
      if (!clone.getAttribute("viewBox")) {
        clone.setAttribute("viewBox", `0 0 ${Math.max(10, Math.round(targetW))} ${Math.max(10, Math.round(targetH))}`);
      }
      const xml = new XMLSerializer().serializeToString(clone);
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
      const img = await new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = url;
      });
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(20, Math.round(targetW * scale));
      canvas.height = Math.max(20, Math.round(targetH * scale));
      const ctx = canvas.getContext("2d");
      const opacity = parseFloat(getComputedStyle(svgEl).opacity || "1");
      ctx.globalAlpha = Number.isNaN(opacity) ? 1 : opacity;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    } catch {
      return null;
    }
  }

  function imgElementToPngData(imgEl, targetW, targetH) {
    try {
      if (!imgEl.complete || !imgEl.naturalWidth || !imgEl.naturalHeight) return null;
      const scale = 1.5;
      const cw = Math.max(20, Math.round(targetW * scale));
      const ch = Math.max(20, Math.round(targetH * scale));
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d");

      // Simulate object-fit: cover
      const iw = imgEl.naturalWidth;
      const ih = imgEl.naturalHeight;
      const ir = iw / ih;
      const cr = cw / ch;
      let sx = 0, sy = 0, sw = iw, sh = ih;
      if (ir > cr) {
        sw = ih * cr;
        sx = (iw - sw) / 2;
      } else {
        sh = iw / cr;
        sy = (ih - sh) / 2;
      }
      ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, cw, ch);
      return canvas.toDataURL("image/png");
    } catch {
      return null;
    }
  }

  function isBlockLike(el) {
    if (!el || el.nodeType !== 1) return false;
    const tag = el.tagName.toLowerCase();
    if (["div", "p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "section", "header", "footer", "svg"].includes(tag)) {
      return true;
    }
    const disp = getComputedStyle(el).display;
    return disp === "block" || disp === "flex" || disp === "grid";
  }

  function hasBlockChild(el) {
    return Array.from(el.children).some((ch) => isBlockLike(ch));
  }

  function buildRichRuns(el, baseColorHex, baseBold) {
    const runs = [];
    function walk(node, inheritedColor, inheritedBold) {
      if (node.nodeType === 3) {
        const txt = node.nodeValue.replace(/\s+/g, " ");
        if (txt.trim()) {
          runs.push({
            text: txt,
            options: {
              color: inheritedColor || baseColorHex,
              bold: inheritedBold
            }
          });
        }
        return;
      }
      if (node.nodeType !== 1) return;
      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const cHex = parseColorToHex(cs.color) || inheritedColor;
      const w = parseInt(cs.fontWeight, 10);
      const isB = inheritedBold || (!Number.isNaN(w) && w >= 600) || node.tagName === "STRONG" || node.tagName === "B";
      Array.from(node.childNodes).forEach((ch) => walk(ch, cHex, isB));
    }
    walk(el, baseColorHex, baseBold);
    return runs;
  }

  async function renderSlideDomToPptxSlide(pptx, slideRoot, fallbackBgHex = "FAF8F3") {
    const s = pptx.addSlide();
    const rootRect = slideRoot.getBoundingClientRect();
    const rootCs = getComputedStyle(slideRoot);
    const bgHex = parseColorToHex(rootCs.backgroundColor) || fallbackBgHex.replace("#", "").toUpperCase();
    s.background = { color: bgHex };

    const relRect = (el) => {
      const r = el.getBoundingClientRect();
      return {
        xPx: r.left - rootRect.left,
        yPx: r.top - rootRect.top,
        wPx: r.width,
        hPx: r.height
      };
    };

    // 1. Export all visible SVGs (backdrop + inline rings/diagrams) as crisp independent PNG objects
    const svgs = Array.from(slideRoot.querySelectorAll("svg"));
    for (const svg of svgs) {
      const rr = relRect(svg);
      if (rr.wPx < 4 || rr.hPx < 4) continue;
      const png = await svgElementToPngData(svg, rr.wPx, rr.hPx);
      if (png) {
        s.addImage({
          data: png,
          x: toInX(rr.xPx),
          y: toInY(rr.yPx),
          w: toInX(rr.wPx),
          h: toInY(rr.hPx)
        });
      }
    }

    // 2. Export optional background decorative numerals or watermark layers
    const decoBgs = Array.from(slideRoot.querySelectorAll('[data-el="watermark-bg"] > div'));
    for (const deco of decoBgs) {
      const txt = deco.innerText?.trim();
      if (!txt) continue;
      const rr = relRect(deco);
      const cs = getComputedStyle(deco);
      const col = parseColorToHex(cs.webkitTextStrokeColor || cs.color) || bgHex;
      s.addText(txt, {
        x: toInX(rr.xPx),
        y: toInY(rr.yPx),
        w: Math.max(1.2, toInX(rr.wPx) + 0.4),
        h: Math.max(0.6, toInY(rr.hPx) + 0.2),
        fontSize: Math.min(72, Math.max(24, Math.round(parseFloat(cs.fontSize) * 0.55))),
        bold: true,
        color: col,
        fontFace: "Georgia",
        margin: 0
      });
    }

    // 3. Export raster <img> elements cleanly
    const imgs = Array.from(slideRoot.querySelectorAll("img"));
    for (const im of imgs) {
      const cs = getComputedStyle(im);
      if (cs.display === "none") continue;
      const rr = relRect(im);
      if (rr.wPx < 10 || rr.hPx < 10) continue;
      const png = imgElementToPngData(im, rr.wPx, rr.hPx);
      if (png) {
        s.addImage({
          data: png,
          x: toInX(rr.xPx),
          y: toInY(rr.yPx),
          w: toInX(rr.wPx),
          h: toInY(rr.hPx)
        });
      }
    }

    // 4. Export card / badge / bar / border Shapes separately
    const allEls = Array.from(slideRoot.querySelectorAll("*")).filter((el) => {
      if (el.closest("svg") || el.closest('[data-el="bfa-bg"]') || el.closest('[data-el="noir-bg"]')) return false;
      const tag = el.tagName.toLowerCase();
      return tag !== "svg" && tag !== "img" && tag !== "aside";
    });

    for (const el of allEls) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const rr = relRect(el);
      if (rr.wPx < 4 || rr.hPx < 1.5) continue;
      // Avoid emitting an outer full-slide wrapper duplicate
      if (rr.wPx > 1270 && rr.hPx > 700) continue;

      const fillHex = parseColorToHex(cs.backgroundColor);
      const fillAlpha = parseAlpha(cs.backgroundColor);
      const bwTop = parseFloat(cs.borderTopWidth) || 0;
      const bwLeft = parseFloat(cs.borderLeftWidth) || 0;
      const borderHex = bwTop > 0 ? parseColorToHex(cs.borderTopColor) : null;
      const leftBorderHex = bwLeft >= 3 ? parseColorToHex(cs.borderLeftColor) : null;
      const radiusPx = parseFloat(cs.borderRadius) || 0;

      // Pure thin divider line (< 6px tall)
      if (rr.hPx <= 5 && fillHex) {
        s.addShape(pptx.ShapeType.rect, {
          x: toInX(rr.xPx),
          y: toInY(rr.yPx),
          w: toInX(rr.wPx),
          h: Math.max(0.018, toInY(rr.hPx)),
          fill: { color: fillHex },
          line: { type: "none" }
        });
        continue;
      }

      if (fillHex || borderHex) {
        const shapeOpts = {
          x: toInX(rr.xPx),
          y: toInY(rr.yPx),
          w: toInX(rr.wPx),
          h: toInY(rr.hPx),
          line: borderHex ? { color: borderHex, width: Math.max(0.5, bwTop * 0.75) } : { type: "none" }
        };
        if (fillHex) {
          shapeOpts.fill = { color: fillHex, transparency: fillAlpha < 0.98 ? Math.round((1 - fillAlpha) * 100) : 0 };
        }
        const shapeType = radiusPx >= Math.min(rr.wPx, rr.hPx) * 0.45 && Math.abs(rr.wPx - rr.hPx) < 10
          ? pptx.ShapeType.ellipse
          : (radiusPx >= 8 ? pptx.ShapeType.roundRect : pptx.ShapeType.rect);
        if (shapeType === pptx.ShapeType.roundRect) shapeOpts.rectRadius = 0.08;
        s.addShape(shapeType, shapeOpts);
      }

      if (leftBorderHex && bwLeft >= 3) {
        s.addShape(pptx.ShapeType.rect, {
          x: toInX(rr.xPx),
          y: toInY(rr.yPx),
          w: toInX(bwLeft),
          h: toInY(rr.hPx),
          fill: { color: leftBorderHex },
          line: { type: "none" }
        });
      }
    }

    // 5. Export each visible leaf text element as an individual PowerPoint TextBox
    const exportedNodes = new Set();
    const markTree = (node) => {
      exportedNodes.add(node);
      Array.from(node.childNodes || []).forEach(markTree);
    };

    for (const el of allEls) {
      if (exportedNodes.has(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (hasBlockChild(el)) continue;

      const rawText = (el.innerText || "").trim();
      if (!rawText) continue;

      const rr = relRect(el);
      if (rr.wPx < 4 || rr.hPx < 4) continue;

      markTree(el);
      const colorHex = parseColorToHex(cs.color) || "141413";
      const weightNum = parseInt(cs.fontWeight, 10);
      const bold = !Number.isNaN(weightNum) ? weightNum >= 600 : (cs.fontWeight === "bold");
      const fontSizePt = Math.max(8, Math.round(parseFloat(cs.fontSize) * 0.72));
      const align = cs.textAlign === "center" ? "center" : (cs.textAlign === "right" ? "right" : "left");

      const runs = buildRichRuns(el, colorHex, bold);
      if (!runs.length) continue;

      s.addText(runs.length === 1 ? runs[0].text : runs, {
        x: toInX(rr.xPx),
        y: toInY(rr.yPx),
        w: Math.max(toInX(rr.wPx) + 0.14, 0.45),
        h: Math.max(toInY(rr.hPx) + 0.05, 0.24),
        fontSize: fontSizePt,
        bold: runs.length === 1 ? runs[0].options.bold : undefined,
        color: runs.length === 1 ? runs[0].options.color : undefined,
        fontFace: "Microsoft JhengHei",
        align,
        valign: "middle",
        margin: 1
      });
    }

    return s;
  }

  async function exportDeck({
    topicId = "cafe-brand",
    recipe = {},
    pageOverrides = {},
    customHtmlByPage = {},
    assetBase = "./assets/",
    slideElements = null,
    deckTitle = "Slide Atelier 20 頁簡報"
  } = {}) {
    const PptxGenJS = await ensurePptxGen();
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_16x9";
    pptx.title = deckTitle;

    const SR = window.SlideRenderer;
    const tpl = SR ? SR.getTemplate(recipe) : { bg: "#FAF8F3" };
    const fallbackBg = (tpl.bg || "#FAF8F3").replace("#", "").toUpperCase();

    let host = null;
    try {
      if (slideElements && slideElements.length) {
        host = document.createElement("div");
        host.style.cssText = "position:fixed;left:-5000px;top:0;width:1280px;height:720px;z-index:-1;pointer-events:none;";
        document.body.appendChild(host);

        for (let idx = 0; idx < slideElements.length; idx++) {
          const orig = slideElements[idx];
          const inner = orig.firstElementChild;
          if (!inner) continue;
          host.innerHTML = "";
          const clone = inner.cloneNode(true);
          clone.style.transform = "none";
          host.appendChild(clone);
          const s = await renderSlideDomToPptxSlide(pptx, clone, fallbackBg);
          const note = orig.querySelector(".notes");
          if (note) s.addNotes(note.textContent.trim());
        }
      } else if (SR) {
        const plan = SR.getDeckPlan(recipe, pageOverrides, topicId, assetBase);
        host = document.createElement("div");
        host.style.cssText = "position:fixed;left:-5000px;top:0;width:1280px;height:720px;z-index:-1;pointer-events:none;";
        document.body.appendChild(host);

        for (let idx = 0; idx < plan.length; idx++) {
          const data = plan[idx];
          const key = `${topicId}_${idx}`;
          const html = customHtmlByPage && customHtmlByPage[key]
            ? customHtmlByPage[key]
            : SR.renderSlideInner(recipe, data);
          host.innerHTML = html;
          const slideRoot = host.firstElementChild;
          if (!slideRoot) continue;
          const s = await renderSlideDomToPptxSlide(pptx, slideRoot, fallbackBg);
          s.addNotes(`第 ${data.num} 頁（版面：${data.mode}）— ${data.title}`);
        }
      }
    } finally {
      if (host && host.parentNode) host.parentNode.removeChild(host);
    }

    const fileName = `${(deckTitle || "presentation").replace(/[^\w\u4e00-\u9fff-]+/g, "-")}.pptx`;
    await pptx.writeFile({ fileName });
    return fileName;
  }

  return {
    parseColorToHex,
    renderSlideDomToPptxSlide,
    exportDeck,
    exportFromStageOrDeck: exportDeck
  };
})();
