/* Slide Atelier — Content & File Importer (TXT / MD / JSON / CSV / DOCX / PPTX / PDF) */
window.SlideImporter = (() => {
  const CUSTOM_TOPICS_KEY = "slide_atelier_v6_custom_topics";
  const HIDDEN_EXAMPLES_KEY = "slide_atelier_v6_hidden_examples";
  const JSZIP_CDN = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
  const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const loadedScripts = {};
  function loadExternalScript(url) {
    if (loadedScripts[url]) return loadedScripts[url];
    loadedScripts[url] = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`無法載入外部解析函式庫：${url}`));
      document.head.appendChild(s);
    });
    return loadedScripts[url];
  }

  function decodeXmlEntities(str) {
    return String(str || "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  }

  function stripXmlTags(str) {
    return decodeXmlEntities(String(str || "").replace(/<[^>]+>/g, ""));
  }

  async function extractTextFromDocx(arrayBuffer) {
    if (!window.JSZip) await loadExternalScript(JSZIP_CDN);
    const zip = await window.JSZip.loadAsync(arrayBuffer);
    const docFile = zip.file("word/document.xml");
    if (!docFile) throw new Error("此 .docx 檔案缺少 word/document.xml");
    const xml = await docFile.async("string");
    const paragraphs = xml.split(/<\/w:p>/i).map((p) => {
      // Match <w:t>...</w:t> or <w:t xml:space="preserve">...</w:t>, NEVER self-closing <w:t/>
      const runs = [...p.matchAll(/<w:t(?:\s+[^>/]*)?>([^<]*)<\/w:t>/gi)].map((m) => stripXmlTags(m[1]));
      const text = runs.join("").replace(/\s+/g, " ").trim();
      if (!text) return "";
      const isToc = /w:pStyle[^>]*w:val="TOC/i.test(p);
      if (isToc) return "";
      const isHeading = /w:pStyle[^>]*w:val="(?:Heading|Title|Subtitle|[1-3])"/i.test(p);
      return isHeading ? `## ${text}` : text;
    }).filter(Boolean);
    return paragraphs.join("\n");
  }

  async function extractTextFromPptx(arrayBuffer) {
    if (!window.JSZip) await loadExternalScript(JSZIP_CDN);
    const zip = await window.JSZip.loadAsync(arrayBuffer);
    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const na = parseInt(a.match(/slide(\d+)\.xml/i)[1], 10);
        const nb = parseInt(b.match(/slide(\d+)\.xml/i)[1], 10);
        return na - nb;
      });
    if (!slideFiles.length) throw new Error("此 .pptx 檔案中找不到投影片內容");

    const sections = [];
    for (let i = 0; i < slideFiles.length; i++) {
      const xml = await zip.file(slideFiles[i]).async("string");
      const lines = xml.split(/<\/a:p>/i).map((p) => {
        const texts = [...p.matchAll(/<a:t(?:\s+[^>/]*)?>([^<]*)<\/a:t>/gi)].map((m) => stripXmlTags(m[1]));
        return texts.join("").replace(/\s+/g, " ").trim();
      }).filter((l) => l && !/^\d{1,3}$/.test(l));
      if (lines.length) {
        const title = lines[0];
        const body = lines.slice(1).map((l) => `- ${l}`).join("\n");
        sections.push(`## ${title}\n${body}`);
      }
    }
    return sections.join("\n\n");
  }

  async function extractTextFromPdf(arrayBuffer) {
    if (!window.pdfjsLib) await loadExternalScript(PDFJS_CDN);
    if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
    }
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];
    for (let p = 1; p <= Math.min(pdf.numPages, 40); p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const lineMap = new Map();
      for (const it of content.items) {
        const s = (it.str || "").trim();
        if (!s) continue;
        const y = Math.round((it.transform?.[5] || 0) / 4);
        if (!lineMap.has(y)) lineMap.set(y, []);
        lineMap.get(y).push(s);
      }
      const lines = Array.from(lineMap.values())
        .map((parts) => parts.join(" ").trim())
        .filter(Boolean);
      if (lines.length) {
        pages.push(lines.join("\n"));
      }
    }
    return pages.join("\n\n");
  }

  async function readFileAsText(file) {
    const name = (file.name || "").toLowerCase();
    if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".csv") || name.endsWith(".json")) {
      return await file.text();
    }
    const buf = await file.arrayBuffer();
    if (name.endsWith(".docx")) return await extractTextFromDocx(buf);
    if (name.endsWith(".pptx")) return await extractTextFromPptx(buf);
    if (name.endsWith(".pdf")) return await extractTextFromPdf(buf);
    if (name.endsWith(".doc") || name.endsWith(".ppt")) {
      throw new Error("舊版二進位 .doc / .ppt 請先另存為 .docx / .pptx / .pdf，或直接複製文字貼上。");
    }
    return await file.text();
  }

  function extractMetricToken(text) {
    const m = String(text || "").match(/(\d+(?:\.\d+)?\s*(?:%|倍|萬|億|年|小時|分鐘|天|項|人|次|篇|元|x|×|pts|ms|公噸|件))/i);
    if (m) return m[1].replace(/\s+/g, "");
    return "";
  }

  function extractRealNumber(text) {
    const m = String(text || "").match(/(\d+(?:\.\d+)?)\s*(?:%|倍|萬|億|年|小時|分鐘|天|項|人|次|篇|元|x|×|pts|ms|公噸|件)/i)
      || String(text || "").match(/(\d+(?:\.\d+)?)/);
    if (!m) return null;
    const n = parseFloat(m[1]);
    return Number.isFinite(n) ? n : null;
  }

  function trimAtBoundary(str, _maxLen = 160) {
    // Never discard source text to meet a presentation limit.
    return String(str || "").replace(/\s+/g, " ").trim();
  }

  function splitIntoSections(rawText) {
    const normalized = String(rawText || "").replace(/\r\n/g, "\n").trim();
    const lines = normalized.split("\n");
    const sections = [];
    let current = null;

    const headingRe = /^(?:#{1,3}\s+(.+)|(?:第[一二三四五六七八九十\d]+[章節頁回][\s：:、.]*(.+))|(?:[一二三四五六七八九十]+、\s*(.+))|(?:\d{1,2}[.)、]\s+(.{3,42})))$/;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      if (/^---+$/.test(line)) {
        if (current && current.lines.length) {
          sections.push(current);
          current = null;
        }
        continue;
      }
      const hm = line.match(headingRe);
      if (hm) {
        if (current) sections.push(current);
        const title = (hm[1] || hm[2] || hm[3] || hm[4] || line).replace(/^#+\s*/, "").trim();
        current = { title, lines: [] };
      } else {
        if (!current) current = { title: trimAtBoundary(line, 160), lines: [] };
        else current.lines.push(line);
      }
    }
    if (current) sections.push(current);

    if (sections.length === 0 || (sections.length === 1 && sections[0].lines.length <= 1)) {
      const chunks = normalized.split(/\n{2,}/).map((c) => c.trim()).filter(Boolean);
      if (chunks.length >= 2) {
        return chunks.map((chunk, i) => {
          const chunkLines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
          const first = chunkLines[0] || `重點單元 ${i + 1}`;
          const rest = chunkLines.slice(1);
          if (!rest.length) {
            const sentences = first.split(/[。！？!?]/).map((s) => s.trim()).filter(Boolean);
            return {
              title: trimAtBoundary(sentences[0] || first, 160),
              lines: sentences.slice(1)
            };
          }
          return { title: trimAtBoundary(first, 160), lines: rest };
        });
      }
      const sentences = normalized.split(/[。！？!?\n]+/).map((s) => s.trim()).filter((s) => s.length > 4);
      const grouped = [];
      for (let i = 0; i < sentences.length; i += 3) {
        const slice = sentences.slice(i, i + 3);
        grouped.push({
          title: trimAtBoundary(slice[0], 160),
          lines: slice.slice(1).length ? slice.slice(1) : slice
        });
      }
      return grouped.length ? grouped : [{ title: "核心摘要", lines: [normalized] }];
    }

    return sections;
  }

  function analyzeSectionSemantics(sec, points) {
    const fullText = `${sec.title} ${(sec.lines || []).join(" ")}`;
    const hasTablePipe = (sec.lines || []).some((l) => (l.match(/\|/g) || []).length >= 2);
    const barCandidates = points.slice(0, 4);
    const allPointsHaveNumbers = barCandidates.length >= 2 && barCandidates.every((pt) => {
      const text = `${pt.stat || ""} ${pt.desc || ""} ${pt.title || ""}`;
      return extractRealNumber(text) !== null && /\d+(?:\.\d+)?\s*(?:%|倍|萬|億|元|公噸|小時|分鐘|天|項|人|次|篇|件|x|×|pts|ms)/i.test(text);
    });
    const stepMarkers = points.filter((pt) => /^(?:步驟|階段|第[一二三四五六]|Phase\s*\d|Step\s*\d|202\d|Q[1-4])/i.test(pt.title || "")).length;
    const isProcess = stepMarkers >= 2 || /(?:時間軸|里程碑|執行流程|實作步驟|->|→)/i.test(sec.title || "");
    const isCompare = /(?:對比|比較|優缺|差異|改善前|改善後|vs\b|before|after)/i.test(sec.title || "");
    return { allPointsHaveNumbers, isProcess, isCompare, hasTablePipe, count: points.length };
  }

  function pickLayout(sec, points) {
    const sem = analyzeSectionSemantics(sec, points);
    let mode = "banner-3-rows";
    if (sem.hasTablePipe) {
      mode = "matrix-table-split";
    } else if (sem.allPointsHaveNumbers) {
      mode = "bars-insight-split";
    } else if (sem.isProcess) {
      mode = "horizontal-timeline";
    } else if (sem.isCompare) {
      mode = "before-after-compare";
    } else if (sem.count === 2) {
      mode = "dual-nested-stat";
    } else if (sem.count === 3) {
      mode = "three-col-defense";
    } else {
      mode = "banner-3-rows";
    }
    return { mode, sem };
  }

  function splitLineToTitleAndDesc(line) {
    const cleanLine = String(line || "").replace(/\s+/g, " ").trim();
    const colonSplit = cleanLine.split(/[：:]/);
    if (colonSplit.length >= 2 && colonSplit[0].trim().length > 0 && colonSplit[0].trim().length <= 24) {
      const right = colonSplit.slice(1).join("：").trim();
      if (right) {
        return {
          title: colonSplit[0].trim(),
          desc: trimAtBoundary(right, 160)
        };
      }
      return { title: colonSplit[0].trim(), desc: "" };
    }
    const sentMatch = line.match(/^([^。！？!?]+)[。！？!?]\s*(.+)$/);
    if (sentMatch && sentMatch[1].trim().length <= 24) {
      return {
        title: sentMatch[1].trim(),
        desc: trimAtBoundary(sentMatch[2].trim(), 160)
      };
    }
    const clauseMatch = line.match(/^([^，,；;]{2,24})[，,；;]\s*(.+)$/);
    if (clauseMatch) {
      return {
        title: clauseMatch[1].trim(),
        desc: trimAtBoundary(clauseMatch[2].trim(), 160)
      };
    }
    const clean = String(line || "").replace(/\s+/g, " ").trim();
    if (clean.length > 24) {
      let cut = clean.slice(0, 14);
      if (/^[\x00-\x7F]+$/.test(cut)) {
        const lastSpace = cut.lastIndexOf(" ");
        if (lastSpace > 4) cut = cut.slice(0, lastSpace);
      }
      return {
        title: cut.trim(),
        desc: clean
      };
    }
    return {
      title: clean,
      desc: ""
    };
  }

  function buildPointsFromLines(lines, fallbackTitle) {
    const cleanLines = (lines || [])
      .map((l) => l.replace(/^[-*•▪●]\s*/, "").replace(/^\d+[.)、]\s*/, "").trim())
      .filter((l) => l && !/^\d{1,3}$/.test(l));

    const rawSource = cleanLines.length ? cleanLines : [fallbackTitle];
    const source = [];
    for (const line of rawSource) {
      if (line.length > 50 && (line.match(/[。！？]/g) || []).length >= 2) {
        const sents = line.split(/[。！？]+/).map((s) => s.trim()).filter(Boolean);
        source.push(...sents);
      } else {
        source.push(line);
      }
    }
    if (source.length === 1) {
      const parts = source[0].split(/[，,；;]/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        return parts.map((p, idx) => {
          const metric = extractMetricToken(p);
          const { title, desc } = splitLineToTitleAndDesc(p);
          return {
            num: "",
            title,
            stat: metric,
            statLabel: metric ? "關鍵數據" : "",
            desc,
            action: ""
          };
        });
      }
    }

    return source.map((line, idx) => {
      const metric = extractMetricToken(line);
      const { title, desc } = splitLineToTitleAndDesc(line);
      return {
        num: "",
        title,
        stat: metric,
        statLabel: metric ? "關鍵數據" : "",
        desc,
        action: ""
      };
    });
  }

  function chunkPointsForSlides(points) {
    const size = p => Array.from(`${p.title || ""}${p.desc || ""}${p.action || ""}`).length;
    const sentences = value => {
      const text = String(value || "");
      if (text.length <= 160) return text ? [text] : [];
      const parts = text.match(/[^。！？!?]+[。！？!?]*/g) || [text];
      if (parts.some(part => part.length > 220)) {
        throw new Error("有一段內容過長且缺少完整句子的分隔。請先依語意補上句號或整理成較短要點；原文未被截斷。");
      }
      return parts;
    };
    const expanded = points.flatMap(pt => {
      if (size(pt) <= 180) return [pt];
      const fragments=[];
      for (const key of ["title","desc","action"]) {
        for (const sentence of sentences(pt[key])) {
          const last=fragments[fragments.length-1];
          if (last && !last[key] && size(last)+sentence.length<=180) last[key]=sentence;
          else fragments.push({title:"",desc:"",action:"",[key]:sentence});
        }
      }
      if (!fragments.length) return [pt];
      fragments[0]={...pt,...fragments[0]};
      return fragments;
    });
    const chunks=[];
    let current=[],chars=0;
    for (const pt of expanded) {
      if (current.length && (current.length>=4 || chars+size(pt)>180)) {chunks.push(current);current=[];chars=0;}
      current.push(pt);chars+=size(pt);
    }
    if (current.length) chunks.push(current);
    return chunks.length ? chunks : [[]];
  }

  function buildStructuredExtras(sec, points, mode) {
    const extras = {
      dualGroups: null,
      modelNodes: null,
      scaleNodes: null,
      matrixTable: null,
      r2Bars: null
    };


    if (mode === "dual-nested-stat" || mode === "before-after-compare") {
      const mid = Math.ceil(points.length / 2);
      const leftPts = points.slice(0, mid);
      const rightPts = points.slice(mid).length ? points.slice(mid) : points.slice(0, 1);
      extras.dualGroups = [
        { tag: "面向 A", title: leftPts[0]?.title || "現況觀察", items: leftPts.map((p) => (p.desc ? `${p.title}：${p.desc}` : p.title)) },
        { tag: "面向 B", title: rightPts[0]?.title || "執行對策", items: rightPts.map((p) => (p.desc ? `${p.title}：${p.desc}` : p.title)) }
      ];
    }

    if (mode === "model-hypotheses" || mode === "hub-spoke-4") {
      extras.modelNodes = {
        center: trimAtBoundary(sec.title, 160),
        nodes: points.slice(0, 4).map((p) => ({ code: p.num, title: p.title, rel: p.stat, desc: p.desc }))
      };
    }

    if (mode === "matrix-table-split") {
      const pipeRows = (sec.lines || []).filter((l) => l.includes("|") && !/^\|?[\s:-]+\|/.test(l));
      if (pipeRows.length >= 2) {
        const parsed = pipeRows.map((r) => r.split("|").map((c) => c.trim()).filter(Boolean));
        extras.matrixTable = {
          headers: parsed[0].slice(0, 4),
          rows: parsed.slice(1, 6).map((r) => r.slice(0, 4))
        };
      } else {
        extras.matrixTable = {
          headers: ["項目", "關鍵數據", "說明"],
          rows: points.slice(0, 4).map((p) => [p.title, p.stat, trimAtBoundary(p.desc, 160)])
        };
      }
    }

    return extras;
  }

  function normalizeImportedDeck(rawDeck, titleHint) {
    const input = Array.isArray(rawDeck) ? rawDeck : rawDeck?.pages;
    if (!Array.isArray(input) || !input.length) throw new Error("JSON 必須包含非空的 pages 陣列。");
    const allowedModes = new Set(["cover-centered","cover-split-photo","banner-3-rows","three-col-defense","dual-nested-stat","before-after-compare","bars-insight-split","matrix-table-split","horizontal-timeline","photo-story-split"]);
    const pages = input.flatMap((p, idx) => {
      if (!p || typeof p.title !== "string" || !p.title.trim()) throw new Error(`第 ${idx + 1} 頁缺少 title，請補上完整標題。`);
      if (p.title.length > 80) throw new Error(`第 ${idx + 1} 頁標題過長，請用完整的一句話整理標題，將詳細內容放進 points。`);
      if (p.mode && !allowedModes.has(p.mode)) throw new Error(`第 ${idx + 1} 頁的 mode 不在十種核心版面內。`);
      const points = Array.isArray(p.points) ? p.points.map(pt => typeof pt === "string" ? {title:pt} : ({...pt, num:pt.num || ""})) : [];
      const chunks = points.length ? chunkPointsForSlides(points) : [[]];
      return chunks.map((chunk, part) => ({
        ...p,
        title: chunks.length > 1 ? `${p.title}（${part + 1}/${chunks.length}）` : p.title,
        mode: p.mode || (idx === 0 ? (p.image ? "cover-split-photo" : "cover-centered") : "banner-3-rows"),
        kicker: p.kicker || "", chapter: p.chapter || "", image: p.image || null,
        sub: part === 0 ? (p.sub || "") : "",
        summary: part === chunks.length-1 ? (p.summary || "") : "",
        highlightStat: part === 0 ? (p.highlightStat || null) : null,
        points: chunk
      }));
    });
    const title = (!Array.isArray(rawDeck) && rawDeck.title) || titleHint || pages[0].title;
    return {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      isCustom:true, label:`${title}（自訂匯入・${pages.length}頁）`, shortLabel:title,
      count:pages.length, chapters:rawDeck.chapters || [], pages
    };
  }

  function parseRawContentToDeck(rawText, titleHint = "") {
    const trimmed = String(rawText || "").trim();
    if (!trimmed) throw new Error("請先貼上文字內容，或上傳檔案。");

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      let parsed;
      try { parsed = JSON.parse(trimmed); }
      catch { throw new Error("JSON 格式有誤，請檢查引號、逗號與括號。"); }
      return normalizeImportedDeck(parsed, titleHint);
    }

    const rawSections = splitIntoSections(trimmed);
    // Filter out empty TOC-only sections (headings with 0 body lines) unless ALL sections are empty
    const nonEmptySections = rawSections.filter((s) => s.lines && s.lines.some((l) => l.trim().length > 0));
    const sections = (nonEmptySections.length ? nonEmptySections : rawSections);
    const deckTitle = trimAtBoundary(titleHint || sections[0].title || "自訂主題簡報", 160);
    const chapters = [];
    for (let i = 0; i < 5; i++) {
      const sec = sections[Math.min(sections.length - 1, Math.floor((i / 5) * sections.length))];
      chapters.push(trimAtBoundary(sec ? sec.title : `章節 ${i + 1}`, 16));
    }

    const pages = [];
    const coverCandidates = sections.filter((s) => s.title && !deckTitle.includes(s.title) && !s.title.includes(deckTitle));
    const coverPoints = (coverCandidates.length ? coverCandidates : sections).slice(0, 3).map((s, idx) => {
      const secMetric = extractMetricToken(s.lines.join(" "));
      return {
        num: "",
        title: trimAtBoundary(s.title, 160),
        stat: secMetric,
        statLabel: secMetric ? "關鍵數據" : "",
        desc: "",
        action: ""
      };
    });
    pages.push({
      mode: "cover-centered",
      chapterIdx: 0,
      chapter: "",
      kicker: "",
      title: deckTitle,
      sub: "",
      summary: "",
      highlightStat: { value: "", label: "", desc: "" },
      points: [],
      image: ""
    });

    sections.forEach((sec, idx) => {
      const chIdx = Math.min(4, Math.floor((idx / Math.max(1, sections.length)) * 5));
      let bodyLines = [...(sec.lines || [])];
      let sub = "";
      let summary = "";

      const bulletRe = /^(?:[-*•▪●]|\d+[.)、])\s+/;
      if (bodyLines.length >= 2 && !bulletRe.test(bodyLines[0]) && bulletRe.test(bodyLines[1])) {
        sub = trimAtBoundary(bodyLines.shift(), 160);
      }
      if (bodyLines.length >= 2 && /^(?:小結|總結|結論|摘要|Summary)[：:]/i.test(bodyLines[bodyLines.length - 1])) {
        summary = trimAtBoundary(bodyLines.pop().replace(/^(?:小結|總結|結論|摘要|Summary)[：:]\s*/i, ""), 160);
      }

      const allPoints = buildPointsFromLines(bodyLines, sec.title);
      const chunks = chunkPointsForSlides(allPoints);
      const baseTitle = trimAtBoundary(sec.title, 160);

      chunks.forEach((chunkPoints, chunkIdx) => {
        const slideTitle = chunks.length > 1
          ? `${baseTitle}（${chunkIdx + 1}/${chunks.length}）`
          : baseTitle;
        const { mode } = pickLayout(sec, chunkPoints);
        const extras = buildStructuredExtras(sec, chunkPoints, mode);
        const chunkMetric = extractMetricToken(chunkPoints.map((p) => `${p.stat} ${p.title} ${p.desc}`).join(" "));

        pages.push({
          mode,
          chapterIdx: chIdx,
          chapter: "",
          kicker: "",
          title: slideTitle,
          sub: chunkIdx === 0 ? sub : "",
          summary: chunkIdx === chunks.length - 1 ? summary : "",
          highlightStat: null,
          points: chunkPoints,
          image: "",
          ...extras
        });
      });
    });

    return normalizeImportedDeck({title:deckTitle,chapters,pages},titleHint);
  }

  function loadSavedCustomTopics() {
    try {
      const raw = localStorage.getItem(CUSTOM_TOPICS_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function saveCustomTopics(topics) {
    try {
      localStorage.setItem(CUSTOM_TOPICS_KEY, JSON.stringify(topics));
    } catch { throw new Error("瀏覽器儲存空間不足，請先備份內容並清理舊資料後重試。"); }
  }

  function getHiddenExampleIds() {
    try {
      const raw = localStorage.getItem(HIDDEN_EXAMPLES_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function hideExampleId(id) {
    const cur = getHiddenExampleIds();
    if (!cur.includes(id)) {
      cur.push(id);
      try { localStorage.setItem(HIDDEN_EXAMPLES_KEY, JSON.stringify(cur)); } catch {}
    }
  }

  function restoreHiddenExamples() {
    try { localStorage.removeItem(HIDDEN_EXAMPLES_KEY); } catch {}
  }

  function deleteCustomTopic(SR, id) {
    const next = loadSavedCustomTopics().filter((t) => t.id !== id);
    saveCustomTopics(next);
    if (SR && Array.isArray(SR.TOPICS)) {
      const idx = SR.TOPICS.findIndex((t) => t.id === id);
      if (idx >= 0) SR.TOPICS.splice(idx, 1);
    }
  }

  function registerAllIntoRenderer(SR) {
    if (!SR || typeof SR.registerCustomTopic !== "function") return;
    const saved = loadSavedCustomTopics();
    saved.forEach((t) => SR.registerCustomTopic(t));
  }

  function importAndRegister(SR, rawText, titleHint) {
    const deck = parseRawContentToDeck(rawText, titleHint);
    const saved = loadSavedCustomTopics().filter((t) => t.id !== deck.id);
    saved.unshift(deck);
    saveCustomTopics(saved);
    if (SR && typeof SR.registerCustomTopic === "function") {
      SR.registerCustomTopic(deck);
    }
    return deck;
  }

  function getAiPromptTemplate() {
    return `請先讀取 AGENTS.md，根據我提供的原文輸出純 JSON：
- 外層使用 {"title":"簡報標題","pages":[]}。
- 每頁必須有 title；同類內容用相同版面。
- 每頁最多四個要點，每個要點約三十字；過長就依完整語意拆頁，不截斷句子。
- 沒有來源的數字、圖片與選填欄位留空；不要填入假指標、個人資料或佔位標籤。
- 無圖片的封面用 cover-centered，條列內頁用 banner-3-rows。
- 其他允許的 mode：cover-split-photo、three-col-defense、dual-nested-stat、before-after-compare、bars-insight-split、matrix-table-split、horizontal-timeline、photo-story-split。
- 參考 examples/rules-demo.json 的結構，請使用我提供的實際內容。`;
  }

  return {
    readFileAsText,
    parseRawContentToDeck,
    registerAllIntoRenderer,
    importAndRegister,
    deleteCustomTopic,
    getHiddenExampleIds,
    hideExampleId,
    restoreHiddenExamples,
    getAiPromptTemplate
  };
})();
