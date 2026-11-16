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

  function trimAtBoundary(str, maxLen = 160) {
    const clean = String(str || "").replace(/\s+/g, " ").trim();
    if (clean.length <= maxLen) return clean;
    const head = clean.slice(0, maxLen);
    for (let i = head.length - 1; i >= Math.floor(maxLen * 0.5); i--) {
      if ("。！？；，、.!?;,".includes(head[i])) {
        return head.slice(0, i + 1).replace(/[，、,;]+$/, "").trim();
      }
    }
    const lastSpace = head.lastIndexOf(" ");
    if (lastSpace > Math.floor(maxLen * 0.5)) {
      return head.slice(0, lastSpace).trim();
    }
    return head.trim() + "…";
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
            num: String(idx + 1).padStart(2, "0"),
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
        num: String(idx + 1).padStart(2, "0"),
        title,
        stat: metric,
        statLabel: metric ? "關鍵數據" : "",
        desc,
        action: ""
      };
    });
  }

  function chunkPointsForSlides(points) {
    const n = points.length;
    if (n <= 4) return [points];
    const numSlides = Math.ceil(n / 4);
    const base = Math.floor(n / numSlides);
    const rem = n % numSlides;
    const chunks = [];
    let offset = 0;
    for (let i = 0; i < numSlides; i++) {
      const size = base + (i < rem ? 1 : 0);
      chunks.push(
        points.slice(offset, offset + size).map((pt, idx) => ({
          ...pt,
          num: String(idx + 1).padStart(2, "0")
        }))
      );
      offset += size;
    }
    return chunks;
  }

  function buildStructuredExtras(sec, points, mode) {
    const extras = {
      dualGroups: null,
      modelNodes: null,
      scaleNodes: null,
      matrixTable: null,
      r2Bars: null
    };

    if (mode === "bars-insight-split" || mode === "vertical-columns-split" || mode === "donut-kpi-cards") {
      const barPoints = points.slice(0, 4);
      const nums = barPoints.map((pt) => extractRealNumber(`${pt.stat} ${pt.desc} ${pt.title}`));
      if (barPoints.length > 0 && nums.every((n) => n !== null)) {
        const maxVal = Math.max(...nums);
        const allPercentScale = maxVal <= 100;
        extras.r2Bars = barPoints.map((pt, i) => ({
          name: pt.title,
          val: allPercentScale
            ? Math.min(100, Math.max(1, Math.round(nums[i])))
            : Math.max(5, Math.round((nums[i] / (maxVal || 1)) * 100)),
          desc: pt.desc || pt.action || ""
        }));
      }
    }

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
    const pages = Array.isArray(rawDeck) ? rawDeck : rawDeck.pages;
    if (!Array.isArray(pages) || !pages.length) throw new Error("JSON 內找不到 pages 陣列");
    const chapters = Array.isArray(rawDeck.chapters) && rawDeck.chapters.length === 5
      ? rawDeck.chapters
      : ["核心主題", "現況脈絡", "方法架構", "重點數據", "結論行動"];
    const normalizedPages = pages.slice(0, 20).map((p, idx) => {
      const image = p.image || "";
      const mode = p.mode || (idx === 0 ? (image ? "cover-split-photo" : "cover-centered") : "banner-3-rows");
      const points = Array.isArray(p.points) && p.points.length
        ? p.points.map((pt, j) => ({
            num: pt.num || String(j + 1).padStart(2, "0"),
            title: pt.title || "",
            stat: pt.stat || "",
            statLabel: pt.statLabel || "",
            desc: pt.desc || "",
            action: pt.action || ""
          }))
        : [{ num: "01", title: p.title || "", stat: "", statLabel: "", desc: "", action: "" }];
      const chIdx = typeof p.chapterIdx === "number" ? Math.max(0, Math.min(4, p.chapterIdx)) : Math.min(4, Math.floor((idx / Math.max(1, pages.length)) * 5));
      const firstStat = points[0]?.stat || "";
      return {
        mode,
        chapterIdx: chIdx,
        chapter: p.chapter || chapters[chIdx],
        kicker: p.kicker || (idx === 0 ? "IMPORTED PRESENTATION" : `${String(idx).padStart(2, "0")} · ${chapters[chIdx]}`),
        title: p.title || `簡報第 ${idx + 1} 頁`,
        sub: p.sub || "",
        summary: p.summary || "",
        highlightStat: p.highlightStat || (firstStat ? { value: firstStat, label: points[0]?.title || "", desc: "" } : { value: "", label: "", desc: "" }),
        points,
        image,
        dualGroups: p.dualGroups || null,
        modelNodes: p.modelNodes || null,
        scaleNodes: p.scaleNodes || null,
        matrixTable: p.matrixTable || null,
        r2Bars: p.r2Bars || null
      };
    });
    const deckTitle = rawDeck.title || titleHint || normalizedPages[0].title || "匯入簡報";
    return {
      id: rawDeck.id || `custom-${Date.now()}`,
      isCustom: true,
      label: `${trimAtBoundary(deckTitle, 24)}（自訂匯入・${normalizedPages.length}頁）`,
      shortLabel: trimAtBoundary(deckTitle, 14),
      count: normalizedPages.length,
      chapters,
      pages: normalizedPages
    };
  }

  function parseRawContentToDeck(rawText, titleHint = "") {
    const trimmed = String(rawText || "").trim();
    if (!trimmed) throw new Error("請先貼上文字內容，或上傳檔案。");

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeImportedDeck(parsed, titleHint);
      } catch {
        // Fallback to text parser if not valid JSON
      }
    }

    const rawSections = splitIntoSections(trimmed);
    // Filter out empty TOC-only sections (headings with 0 body lines) unless ALL sections are empty
    const nonEmptySections = rawSections.filter((s) => s.lines && s.lines.some((l) => l.trim().length > 0));
    const sections = (nonEmptySections.length ? nonEmptySections : rawSections).slice(0, 19);
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
        num: String(idx + 1).padStart(2, "0"),
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
      chapter: chapters[0],
      kicker: "CUSTOM CONTENT BRIEF",
      title: deckTitle,
      sub: "",
      summary: "",
      highlightStat: { value: "", label: "", desc: "" },
      points: coverPoints.length ? coverPoints : [{ num: "01", title: deckTitle, stat: "", statLabel: "", desc: "", action: "" }],
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
          chapter: chapters[chIdx],
          kicker: "",
          title: slideTitle,
          sub: chunkIdx === 0 ? sub : "",
          summary: chunkIdx === chunks.length - 1 ? summary : "",
          highlightStat: chunkMetric
            ? { value: chunkMetric, label: slideTitle, desc: "" }
            : { value: "", label: "", desc: "" },
          points: chunkPoints,
          image: "",
          ...extras
        });
      });
    });

    return {
      id: `custom-${Date.now()}`,
      isCustom: true,
      label: `${trimAtBoundary(deckTitle, 24)}（自訂匯入・${pages.length}頁）`,
      shortLabel: trimAtBoundary(deckTitle, 14),
      count: pages.length,
      chapters,
      pages
    };
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
    } catch {}
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
    const trimmed = saved.slice(0, 8);
    saveCustomTopics(trimmed);
    if (SR && typeof SR.registerCustomTopic === "function") {
      SR.registerCustomTopic(deck);
    }
    return deck;
  }

  function getAiPromptTemplate() {
    return `請幫我把以下原始資料整理成 Slide Atelier 支援的 Canonical Slide Content JSON（繁體中文），直接輸出純 JSON：
規則：
- 每頁使用「結論式標題」，直接點出核心洞察，不要只寫名詞標籤。
- 每頁 points 建議 2～4 點；若同一主題超過 4 點，請拆成多頁（例如「標題（1/2）」、「標題（2/2）」）。
- kicker、sub、summary、stat、statLabel、action、image 皆為選填：若無真實內容或原文未提供，請直接留空字串 ""，嚴禁編造任何數字、百分比或假標籤。
- 封面若無專屬圖片請使用 "cover-centered" 並將 image 設為 ""。

{
  "title": "簡報總標題（一句話點出核心結論）",
  "chapters": ["章節一", "章節二", "章節三", "章節四", "章節五"],
  "pages": [
    {
      "mode": "cover-centered",
      "chapterIdx": 0,
      "kicker": "選填，無則留空",
      "title": "封面結論式主標題",
      "sub": "選填，一句副標題說明核心價值（不與 points 重複）",
      "image": "",
      "points": [
        { "num": "01", "title": "重點一", "stat": "", "statLabel": "", "desc": "簡短說明", "action": "" },
        { "num": "02", "title": "重點二", "stat": "", "statLabel": "", "desc": "簡短說明", "action": "" }
      ]
    },
    {
      "mode": "bars-insight-split",
      "chapterIdx": 1,
      "kicker": "",
      "title": "結論式內頁標題（例如：導入自動化後處理時間縮短 42%）",
      "sub": "",
      "summary": "選填，整頁一句核心總結（不與 points 重複，可用 **重點** 強調）",
      "image": "",
      "points": [
        { "num": "01", "title": "真實指標項目", "stat": "42%", "statLabel": "效率提升", "desc": "具體事實說明", "action": "選填，若無明確行動項目請留空" }
      ]
    }
  ]
}`;
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
