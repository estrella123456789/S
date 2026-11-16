/* ==========================================================================
   Slide Atelier V5 — Multi-Archetype Editorial, Archival & Interactive Engine
   - Zero broken style attributes (single-quoted font stacks)
   - Separate Structural Templates (6) × Color Palettes (8) × Font Pairings (4)
   - Editorial, Academic, Swiss, Geometric, Organic-SVG & Keynote Dark Archetypes
   - Adaptive grids (zero 2x2 blank corner on 3-item slides), larger readable type, inner pages 01..19
   ========================================================================== */
window.SlideRenderer = (() => {
  const MASTER_TEMPLATES = [
    {
      id: "botanical-line",
      name: "自然線繪 × 方格紙感風",
      en: "BOTANICAL PAPER",
      defaultColor: "emerald-paper",
      defaultFont: "serif-classic",
      radius: 2,
      innerRadius: 2,
      borderWidth: "1.2px",
      chrome: "botanical",
      svgType: "botanical"
    },
    {
      id: "editorial-magazine",
      name: "人文雜誌編輯風",
      en: "EDITORIAL MAGAZINE",
      defaultColor: "cafe-terracotta",
      defaultFont: "serif-classic",
      radius: 8,
      innerRadius: 6,
      borderWidth: "1px",
      chrome: "editorial",
      svgType: "editorial"
    },
    {
      id: "academic-thesis",
      name: "經典學術論文風",
      en: "ACADEMIC THESIS",
      defaultColor: "teal-cream",
      defaultFont: "serif-classic",
      radius: 14,
      innerRadius: 10,
      borderWidth: "1.5px",
      chrome: "academic",
      svgType: "academic"
    },
    {
      id: "corporate-geometric",
      name: "現代商務幾何風",
      en: "CORPORATE GEOMETRIC",
      defaultColor: "amber-graphite",
      defaultFont: "sans-modern",
      radius: 10,
      innerRadius: 8,
      borderWidth: "1.2px",
      chrome: "diagonal",
      svgType: "diagonal"
    },
    {
      id: "organic-atelier",
      name: "溫潤流體插畫風",
      en: "ORGANIC ATELIER",
      defaultColor: "teal-cream",
      defaultFont: "serif-classic",
      radius: 20,
      innerRadius: 14,
      borderWidth: "1.2px",
      chrome: "organic",
      svgType: "atelier"
    },
    {
      id: "keynote-dark",
      name: "科技發表會暗黑風",
      en: "KEYNOTE DARK",
      defaultColor: "obsidian-cyan",
      defaultFont: "sans-modern",
      radius: 14,
      innerRadius: 10,
      borderWidth: "1px",
      chrome: "dark",
      svgType: "dark"
    }
  ];

  const COLOR_PALETTES = [
    { id: "emerald-paper", name: "翠綠紙感", isDark: false, bg: "#FAF8F3", surface: "#FFFFFF", tint: "#EBF5EE", primary: "#2E9B68", secondary: "#1E242B", mist: "#C5E8D5", fg: "#141413", muted: "#57605B", border: "#1E242B" },
    { id: "forest-parchment", name: "森林羊皮紙", isDark: false, bg: "#F7F5EF", surface: "#FFFFFF", tint: "#EDF3EE", primary: "#1F5E43", secondary: "#3E5448", mist: "#CFE3D5", fg: "#18201C", muted: "#55635C", border: "#CBD6CE" },
    { id: "teal-cream", name: "松綠奶油", isDark: false, bg: "#FAF6EE", surface: "#FFFFFF", tint: "#F2EBDD", primary: "#0D4F4F", secondary: "#6A9E9E", mist: "#C8DFDF", fg: "#233030", muted: "#576868", border: "#94BABA" },
    { id: "obsidian-cyan", name: "曜石霓虹", isDark: true, bg: "#0B0F17", surface: "#151E2E", tint: "#1E293B", primary: "#38BDF8", secondary: "#F59E0B", mist: "#0284C7", fg: "#F8FAFC", muted: "#94A3B8", border: "#334155" },
    { id: "obsidian-neon", name: "曜石霓虹", isDark: true, bg: "#0B0F17", surface: "#151E2E", tint: "#1E293B", primary: "#38BDF8", secondary: "#94A3B8", mist: "#0284C7", fg: "#F8FAFC", muted: "#94A3B8", border: "#334155" },
    { id: "amber-graphite", name: "亮黃石墨", isDark: false, bg: "#F4F4F6", surface: "#FFFFFF", tint: "#FEF3C7", primary: "#D97706", secondary: "#27272A", mist: "#FDE68A", fg: "#18181B", muted: "#52525B", border: "#D4D4D8" },
    { id: "noir-champagne", name: "黑金奢華", isDark: true, bg: "#121316", surface: "#1C1E24", tint: "#28251E", primary: "#D4AF37", secondary: "#A8A29E", mist: "#786221", fg: "#F5F3EF", muted: "#A8A29E", border: "#44403C" },
    { id: "cafe-terracotta", name: "燕麥赤陶", isDark: false, bg: "#FAF6EE", surface: "#FFFDF9", tint: "#F1E8D7", primary: "#9E5A38", secondary: "#4A6652", mist: "#E4EBE5", fg: "#2C1E16", muted: "#6B584C", border: "#DFD3C0" },
    { id: "nordic-cobalt", name: "北歐鈷藍", isDark: false, bg: "#F4F7FB", surface: "#FFFFFF", tint: "#E6EEF9", primary: "#1E3A8A", secondary: "#3B82F6", mist: "#BFDBFE", fg: "#111827", muted: "#4B5563", border: "#93C5FD" },
    { id: "mono-ink", name: "極簡黑白", isDark: false, bg: "#FFFFFF", surface: "#FFFFFF", tint: "#F3F4F6", primary: "#111111", secondary: "#52525B", mist: "#E4E4E7", fg: "#111111", muted: "#52525B", border: "#111111" }
  ];

  const FONT_PAIRINGS = [
    { id: "serif-classic", name: "人文襯線明體", titleFont: "'Noto Serif TC', 'PMingLiU', Georgia, serif", bodyFont: "'Noto Sans TC', 'Microsoft JhengHei', system-ui, sans-serif", monoFont: "'JetBrains Mono', Consolas, monospace" },
    { id: "sans-modern", name: "現代俐落黑體", titleFont: "'Noto Sans TC', 'Microsoft JhengHei', 'Helvetica Neue', sans-serif", bodyFont: "'Noto Sans TC', 'Microsoft JhengHei', system-ui, sans-serif", monoFont: "'JetBrains Mono', Consolas, monospace" },
    { id: "display-editorial", name: "歐美畫報襯線", titleFont: "'Cormorant Garamond', 'Noto Serif TC', Georgia, serif", bodyFont: "'Noto Sans TC', 'Microsoft JhengHei', system-ui, sans-serif", monoFont: "'JetBrains Mono', Consolas, monospace" },
    { id: "archival-mono", name: "工程圖紙等寬", titleFont: "'JetBrains Mono', 'Noto Sans TC', Consolas, monospace", bodyFont: "'Noto Sans TC', 'Microsoft JhengHei', system-ui, sans-serif", monoFont: "'JetBrains Mono', Consolas, monospace" }
  ];

  const STYLE_PRESETS = [
    {
      id: "editorial-magazine",
      name: "人文雜誌 × 燕麥赤陶",
      desc: "雜誌留白導邊 · 燕麥赤陶 · 人文襯線",
      templateId: "editorial-magazine",
      colorId: "cafe-terracotta",
      fontId: "serif-classic"
    },
    {
      id: "botanical-line",
      name: "自然線繪 × 森林羊皮紙",
      desc: "方格紙感定位 · 森林深綠 · 現代黑體",
      templateId: "botanical-line",
      colorId: "forest-parchment",
      fontId: "sans-modern"
    },
    {
      id: "academic-thesis",
      name: "經典學術 × 北歐鈷藍",
      desc: "學者細框結構 · 北歐鈷藍 · 人文襯線",
      templateId: "academic-thesis",
      colorId: "nordic-cobalt",
      fontId: "serif-classic"
    },
    {
      id: "keynote-dark",
      name: "科技發表 × 曜石霓虹",
      desc: "高對比暗黑舞台 · 曜石霓虹 · 現代黑體",
      templateId: "keynote-dark",
      colorId: "obsidian-neon",
      fontId: "sans-modern"
    }
  ];

  const LEGACY_TEMPLATE_MAP = {
    "archival-line": { templateId: "botanical-line", colorId: "emerald-paper", fontId: "serif-classic" },
    "swiss-grid": { templateId: "botanical-line", colorId: "emerald-paper", fontId: "sans-modern" },
    "bfa-sphere": { templateId: "keynote-dark", colorId: "obsidian-cyan", fontId: "display-editorial" },
    "diagonal-corporate": { templateId: "corporate-geometric", colorId: "amber-graphite", fontId: "sans-modern" },
    "noir-luxury": { templateId: "editorial-magazine", colorId: "noir-champagne", fontId: "display-editorial" },
    "atelier-organic": { templateId: "organic-atelier", colorId: "teal-cream", fontId: "serif-classic" },
    "industrial-mono": { templateId: "botanical-line", colorId: "mono-ink", fontId: "sans-modern" },
    "teal-academic": { templateId: "academic-thesis", colorId: "teal-cream", fontId: "serif-classic" },
    "cafe-editorial": { templateId: "editorial-magazine", colorId: "cafe-terracotta", fontId: "serif-classic" },
    "sage-botanical": { templateId: "botanical-line", colorId: "emerald-paper", fontId: "serif-classic" },
    "terracotta-magazine": { templateId: "editorial-magazine", colorId: "cafe-terracotta", fontId: "serif-classic" },
    "nordic-cobalt": { templateId: "corporate-geometric", colorId: "nordic-cobalt", fontId: "sans-modern" },
    "midnight-pitch": { templateId: "keynote-dark", colorId: "obsidian-cyan", fontId: "sans-modern" }
  };

  const COMPOUND_LAYOUTS = [
    { id: "cover-centered", cat: "封面與過場", label: "經典居中封面", desc: "主標題、副標與核心焦點列" },
    { id: "cover-split-photo", cat: "封面與過場", label: "左文右視覺封面", desc: "左欄摘要結論＋右框攝影或指標" },
    { id: "cover-editorial-bleed", cat: "封面與過場", label: "雜誌跨欄封面", desc: "跨欄大標題＋自適應網格要點" },
    { id: "cover-framed-grid", cat: "封面與過場", label: "雙層畫框封面", desc: "內外雙框＋指標與並列重點" },
    { id: "section-monolith", cat: "封面與過場", label: "巨字焦點分屏", desc: "左大型焦點卡＋右自適應細節列" },

    { id: "dual-nested-stat", cat: "卡片與網格", label: "單層雙欄對比", desc: "同層雙欄呈現內容，不嵌套卡片" },
    { id: "four-col-nested", cat: "卡片與網格", label: "多環百分比圖表", desc: "SVG 圓環進度圖＋大字指標＋結論" },
    { id: "profile-2x2-grid", cat: "卡片與網格", label: "左圓卡＋自適應宮格", desc: "左大圓樣本核心＋右零缺角宮格" },
    { id: "three-col-defense", cat: "卡片與網格", label: "策略對焦並排欄", desc: "大指標醒目標籤＋內文＋底部策略" },
    { id: "bento-1-3", cat: "卡片與網格", label: "Bento 一大配小卡", desc: "左深色核心主卡＋右側堆疊細項" },
    { id: "grid-2x2-headers", cat: "卡片與網格", label: "實心表頭結構格", desc: "自適應欄數＋大指標帶＋實心表頭" },
    { id: "triptych-gallery", cat: "卡片與網格", label: "雙三圓交集圖", desc: "重疊交集 SVG 圓圖＋右側細項解析" },

    { id: "banner-3-rows", cat: "清單與導讀", label: "橫幅導讀＋條列", desc: "頂部強調色導讀條＋下方結構條列" },
    { id: "left-thesis-right-list", cat: "清單與導讀", label: "左論點＋右編號", desc: "左 36% 深色主張＋右編號清單" },
    { id: "header-cards-scale", cat: "清單與導讀", label: "表頭卡＋量尺圖", desc: "左分類要點清單＋右連線量尺與說明" },
    { id: "stepped-bars-4", cat: "清單與導讀", label: "遞進寬度階梯條", desc: "階梯寬度漸增條列配右側數據" },
    { id: "banner-dashed-split", cat: "清單與導讀", label: "結構引線對照圖", desc: "左側幾何座標同心圖＋右結構詳述" },

    { id: "snake-flow-8", cat: "流程與架構", label: "U型蛇行軌跡圖", desc: "上排右行彎折接續下排完整流程" },
    { id: "model-hypotheses", cat: "流程與架構", label: "路徑圖＋驗證卡", desc: "頂部節點箭頭圖＋下方假說詳述" },
    { id: "horizontal-timeline", cat: "流程與架構", label: "交替節點時間軸", desc: "水平軸線上下交替呈現各階段" },
    { id: "hub-spoke-4", cat: "流程與架構", label: "中心輻射放射圖", desc: "中央核心指標連結周圍重點卡片" },
    { id: "chevron-pipeline", cat: "流程與架構", label: "階段色塊管線圖", desc: "頂部推進色條＋下方詳述與結論" },

    { id: "bars-insight-split", cat: "數據與表格", label: "長條排行＋深洞察", desc: "左百分比橫軌＋右深色發現大卡" },
    { id: "matrix-table-split", cat: "數據與表格", label: "實證矩陣＋雙結論", desc: "左結構矩陣表格＋右門檻與結論卡" },
    { id: "monolith-stat-split", cat: "數據與表格", label: "巨字指標＋拆解格", desc: "左超大指標卡＋右網格細項拆解" },
    { id: "vertical-columns-split", cat: "數據與表格", label: "垂直柱圖＋詳解", desc: "左量化柱狀比較＋右對應條列解讀" },
    { id: "donut-kpi-cards", cat: "數據與表格", label: "圓環視覺＋KPI卡", desc: "左 SVG 圓環焦點＋右雙層指標卡" },

    { id: "photo-story-split", cat: "圖文與對比", label: "斜角切圖＋重點列", desc: "左攝影或主視覺＋右結構重點" },
    { id: "before-after-compare", cat: "圖文與對比", label: "現況 vs 對策雙欄", desc: "左課題欄＋右數據行動對照" },
    { id: "quote-pillars", cat: "圖文與對比", label: "引號宣言＋支柱卡", desc: "上方引號核心結語＋下方支柱並列" }
  ];

  const CORE_LAYOUT_IDS = [
    "cover-centered", "cover-split-photo", "banner-3-rows", "three-col-defense",
    "dual-nested-stat", "before-after-compare", "bars-insight-split",
    "matrix-table-split", "horizontal-timeline", "photo-story-split"
  ];
  const CORE_LAYOUTS = CORE_LAYOUT_IDS.map((id) => COMPOUND_LAYOUTS.find((l) => l.id === id)).filter(Boolean);

  const TOPICS = [
    { id: "rules-guide", label: "專案規則導覽（5頁）", shortLabel: "專案規則導覽", count: 5 },
    { id: "study-notes", label: "學習筆記方法（4頁）", shortLabel: "學習筆記方法", count: 4 },
    { id: "reading-notes", label: "閱讀分享流程（4頁）", shortLabel: "閱讀分享流程", count: 4 }
  ];

  const CUSTOM_TOPICS = {};
  function registerCustomTopic(topicObj) {
    if (!topicObj || !topicObj.id || !Array.isArray(topicObj.pages) || !topicObj.pages.length) return;
    CUSTOM_TOPICS[topicObj.id] = topicObj;
    const idx = TOPICS.findIndex((t) => t.id === topicObj.id);
    const meta = {
      id: topicObj.id,
      label: topicObj.label || `${topicObj.shortLabel || "自訂簡報"}（${topicObj.pages.length}頁）`,
      shortLabel: topicObj.shortLabel || "自訂簡報",
      count: topicObj.pages.length
    };
    if (idx >= 0) TOPICS[idx] = meta;
    else TOPICS.push(meta);
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  function formatRich(str, accentColor) {
    return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, `<strong style="color:${accentColor};font-weight:800;">$1</strong>`);
  }

  function contrastFg(hex) {
    if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return "#FFFFFF";
    const h = hex.length === 4 ? hex.slice(1).split("").map((c) => c + c).join("") : hex.slice(1, 7);
    const n = parseInt(h, 16);
    if (Number.isNaN(n)) return "#FFFFFF";
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 158 ? "#0B1120" : "#FFFFFF";
  }

  function getTemplate(recipeOrId) {
    let tid = typeof recipeOrId === "string"
      ? recipeOrId
      : (recipeOrId?.templateId || recipeOrId?.template || recipeOrId?.styles?.templateId);
    let cid = typeof recipeOrId === "object" && recipeOrId ? (recipeOrId.colorId || recipeOrId.color) : null;
    let fid = typeof recipeOrId === "object" && recipeOrId ? (recipeOrId.fontId || recipeOrId.font) : null;

    if (tid && LEGACY_TEMPLATE_MAP[tid]) {
      const leg = LEGACY_TEMPLATE_MAP[tid];
      tid = leg.templateId;
      if (!cid) cid = leg.colorId;
      if (!fid) fid = leg.fontId;
    }

    const preset = STYLE_PRESETS.find((p) => p.templateId === tid) || STYLE_PRESETS[0];
    tid = preset.templateId;
    cid = preset.colorId;
    fid = preset.fontId;
    const tpl = MASTER_TEMPLATES.find((t) => t.id === tid);
    const color = COLOR_PALETTES.find((c) => c.id === cid) || COLOR_PALETTES.find((c) => c.id === tpl.defaultColor) || COLOR_PALETTES[0];
    const font = FONT_PAIRINGS.find((f) => f.id === fid) || FONT_PAIRINGS.find((f) => f.id === tpl.defaultFont) || FONT_PAIRINGS[0];

    return {
      ...tpl,
      ...color,
      ...font,
      id: tpl.id,
      tplId: tpl.id,
      name: tpl.name,
      templateName: tpl.name,
      colorId: color.id,
      colorName: color.name,
      fontId: font.id,
      fontName: font.name
    };
  }

  function getPreset(styleObj) {
    const tpl = getTemplate(styleObj);
    return { font: tpl.bodyFont, titleFont: tpl.titleFont, border: `${tpl.borderWidth} solid ${tpl.border}`, radius: `${tpl.radius}px`, skin: tpl.id };
  }

  function cardChromeCss(tpl, mode = "card") {
    if (tpl.chrome === "botanical") {
      return mode === "tint"
        ? `background:${tpl.tint};border:1.2px solid ${tpl.fg};border-radius:2px;box-shadow:4px 4px 0 ${tpl.primary}30;`
        : `background:${tpl.surface};border:1.2px solid ${tpl.fg};border-radius:2px;box-shadow:5px 5px 0 ${tpl.primary}26;`;
    }
    if (tpl.chrome === "editorial") {
      return mode === "tint"
        ? `background:${tpl.tint};border:none;border-left:5px solid ${tpl.primary};border-radius:0px;`
        : `background:transparent;border:none;border-top:2px solid ${tpl.primary};border-radius:0px;`;
    }
    if (tpl.chrome === "academic") {
      return mode === "tint"
        ? `background:${tpl.tint};border:1.5px solid ${tpl.border};border-radius:${tpl.innerRadius}px;`
        : `background:${tpl.surface};border:1.5px solid ${tpl.border};border-radius:${tpl.radius}px;`;
    }
    if (tpl.chrome === "diagonal") {
      return mode === "tint"
        ? `background:${tpl.tint};border:none;border-left:6px solid ${tpl.primary};border-radius:${tpl.innerRadius}px;box-shadow:0 6px 18px rgba(0,0,0,0.05);`
        : `background:${tpl.surface};border:none;border-left:5px solid ${tpl.primary};border-radius:${tpl.innerRadius}px;box-shadow:0 8px 24px rgba(0,0,0,0.06);`;
    }
    if (tpl.chrome === "dark") {
      return mode === "tint"
        ? `background:${tpl.tint};border:1px solid ${tpl.primary}66;border-top:2.5px solid ${tpl.primary};border-radius:${tpl.innerRadius}px;`
        : `background:${tpl.surface};border:1px solid ${tpl.border};border-top:2px solid ${tpl.primary};border-radius:${tpl.radius}px;box-shadow:0 12px 30px rgba(0,0,0,0.28);`;
    }
    return mode === "tint"
      ? `background:${tpl.tint};border:${tpl.borderWidth} solid ${tpl.border};border-radius:${tpl.innerRadius}px;`
      : `background:${tpl.surface};border:${tpl.borderWidth} solid ${tpl.border};border-radius:${tpl.radius}px;`;
  }

  function adaptiveCols(n) {
    if (n <= 1) return 1;
    if (n === 2) return 2;
    if (n === 3) return 3;
    return 2;
  }

  function getRecommendedLayouts(data) {
    const pts = Array.isArray(data?.points) ? data.points : [];
    const n = pts.length;
    const isCover = Number(data?.num) === 1;
    const out = new Set();
    if (data?.image) { out.add("photo-story-split"); out.add("cover-split-photo"); }
    if (data?.matrixTable) { out.add("matrix-table-split"); }
    if (data?.modelNodes) { out.add("model-hypotheses"); }
    if (data?.scaleNodes) { out.add("header-cards-scale"); }
    if (data?.dualGroups) { out.add("dual-nested-stat"); }
    if (isCover) { out.add("cover-centered"); out.add("cover-split-photo"); out.add("cover-editorial-bleed"); out.add("cover-framed-grid"); }
    if (n >= 6) {
      out.add("snake-flow-8"); out.add("horizontal-timeline"); out.add("bars-insight-split");
    } else if (n === 5) {
      out.add("bars-insight-split"); out.add("stepped-bars-4"); out.add("vertical-columns-split"); out.add("left-thesis-right-list");
    } else if (n === 3) {
      out.add("three-col-defense"); out.add("banner-3-rows"); out.add("triptych-gallery"); out.add("quote-pillars"); out.add("grid-2x2-headers"); out.add("four-col-nested"); out.add("left-thesis-right-list");
    } else if (n === 2) {
      out.add("before-after-compare"); out.add("dual-nested-stat"); out.add("banner-dashed-split"); out.add("left-thesis-right-list"); out.add("triptych-gallery");
    } else {
      out.add("four-col-nested"); out.add("grid-2x2-headers"); out.add("chevron-pipeline"); out.add("hub-spoke-4"); out.add("monolith-stat-split"); out.add("donut-kpi-cards"); out.add("vertical-columns-split");
    }
    return Array.from(out);
  }

  // --- De-duplication: never show the same sentence twice on one slide ---
  const PLACEHOLDER_RE = /^(?:要點|重點|PART)\s*0?\d+$/i;
  function normText(s) {
    return String(s || "").replace(/\*\*/g, "").replace(/[…\s，。、,.：:；;！!？?]/g, "").toLowerCase();
  }
  function overlaps(a, b) {
    const x = normText(a), y = normText(b);
    if (!x || !y) return false;
    return x === y || x.startsWith(y) || y.startsWith(x) || (x.length >= 8 && y.includes(x)) || (y.length >= 8 && x.includes(y));
  }

  function getCanon(data) {
    const rawPts = Array.isArray(data.points) ? data.points : [];
    const pts = rawPts.map((p) => {
      const title = p.title || "";
      let desc = p.desc || "";
      let action = p.action || "";
        let stat = p.stat ?? "";
      let statLabel = p.statLabel || "";
      if (overlaps(desc, title) && desc.length <= title.length + 6) desc = "";
      if (overlaps(action, desc) || overlaps(action, title)) action = "";
      if (PLACEHOLDER_RE.test(String(stat).trim())) { stat = ""; statLabel = ""; }
      return { num: p.num || "", title, stat, statLabel, desc, action };
    });
    const ptTexts = pts.flatMap((p) => [p.title, p.desc, p.action]);
    let sub = data.sub || "";
    let summary = data.summary || "";
    if (overlaps(sub, data.title)) sub = "";
    if (sub && ptTexts.some((t) => overlaps(sub, t))) sub = "";
    if (overlaps(summary, data.title) || overlaps(summary, sub) || ptTexts.some((t) => overlaps(summary, t))) summary = "";
    let hs = data.highlightStat && (data.highlightStat.value || data.highlightStat.label || data.highlightStat.desc)
      ? data.highlightStat
      : null;
    if (hs && PLACEHOLDER_RE.test(String(hs.value || "").trim())) hs = null;
    if (hs && hs.desc && (overlaps(hs.desc, sub) || overlaps(hs.desc, summary) || ptTexts.some((t) => overlaps(hs.desc, t)))) hs = { ...hs, desc: "" };
    return {
      title: data.title || "",
      sub,
      summary,
      kicker: data.kicker ? String(data.kicker).replace(/^\d+\s*[·|｜.]\s*/, "") : "",
      chapter: data.chapter || "",
      image: data.image || "",
      author: data.author || "",
      presenter: data.presenter || "",
      dateLabel: data.dateLabel || "",
      bannerPill: data.bannerPill || "",
      hs,
      pts,
      dualGroups: data.dualGroups || null,
      modelNodes: data.modelNodes || null,
      scaleNodes: data.scaleNodes || null,
      matrixTable: data.matrixTable || null,
      r2Bars: data.r2Bars || null
    };
  }

  function extractPct(statStr, _idx = 0, maxVal = 100) {
    if (!statStr) return null;
    const raw = String(statStr).trim();
    if (raw.includes("%")) {
      const m = raw.match(/(\d+(?:\.\d+)?)/);
      if (m) {
        const v = parseFloat(m[1]);
        if (!Number.isNaN(v)) return Math.max(0, Math.min(100, Math.round((v / maxVal) * 100)));
      }
    }
    if (/^\d+(?:\.\d+)?$/.test(raw)) {
      const v = parseFloat(raw);
      if (!Number.isNaN(v) && v > 0 && v <= maxVal) return Math.max(0, Math.min(100, Math.round((v / maxVal) * 100)));
    }
    return null;
  }

  function badgeHtml(num, tpl, filled = true, size = 32) {
    if (!num) return "";
    const bg = filled ? tpl.primary : tpl.tint;
    const fg = filled ? contrastFg(bg) : tpl.fg;
    const border = filled ? "none" : `1px solid ${tpl.border}`;
    const rad = tpl.chrome === "botanical" ? "2px" : (tpl.chrome === "diagonal" || tpl.chrome === "editorial" ? "6px" : "50%");
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:${size}px;height:${size}px;padding:0 8px;border-radius:${rad};background:${bg};color:${fg};border:${border};font-family:${tpl.monoFont};font-size:13px;font-weight:700;flex-shrink:0;">${escapeHtml(num)}</span>`;
  }

  function industrialDetachedHead(num, title, stat, tpl) {
    const onP = contrastFg(tpl.primary);
    return `<div style="display:flex;align-items:stretch;margin-bottom:8px;flex-shrink:0;">
      ${num ? `<div style="background:${tpl.primary};color:${onP};font-family:${tpl.monoFont};font-size:13px;font-weight:700;padding:8px 16px;display:flex;align-items:center;justify-content:center;min-width:48px;">${escapeHtml(num)}</div>` : ""}
      <div style="flex:1;background:${tpl.surface};border:${tpl.borderWidth} solid ${tpl.border};${num ? "border-left:none;" : ""}padding:8px 16px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <span style="font-size:21px;font-weight:700;color:${tpl.fg};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(title)}</span>
        ${stat ? `<span style="font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${tpl.primary};white-space:nowrap;">${escapeHtml(stat)}</span>` : ""}
      </div>
    </div>`;
  }

  function buildTemplateBackdropSvg(tpl, slideIdx) {
    const svgs = window.SLIDE_TEMPLATE_SVGS;

    if (tpl.svgType === "botanical") {
      const gid = `botGrid_${slideIdx}`;
      return `<svg viewBox="0 0 1280 720" width="1280" height="720" data-el="botanical-bg" style="position:absolute;inset:0;pointer-events:none;z-index:1;">
        <defs>
          <pattern id="${gid}" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="${tpl.fg}" stroke-width="0.6" opacity="0.06"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="1280" height="720" fill="url(#${gid})"/>
        <path d="M 16,32 L 16,16 L 32,16 M 1248,16 L 1264,16 L 1264,32 M 16,688 L 16,704 L 32,704 M 1248,704 L 1264,704 L 1264,688" fill="none" stroke="${tpl.primary}" stroke-width="1.5" opacity="0.65"/>
      </svg>`;
    }

    if (tpl.svgType === "editorial") {
      return `<div data-el="editorial-frame" style="position:absolute;inset:12px;border:1px solid ${tpl.border}77;pointer-events:none;z-index:1;"></div>`;
    }

    if (tpl.svgType === "academic") {
      return `<svg viewBox="0 0 1280 720" width="1280" height="720" data-el="academic-bg" style="position:absolute;inset:0;pointer-events:none;z-index:1;">
        <rect x="16" y="16" width="1248" height="688" rx="14" fill="none" stroke="${tpl.border}" stroke-width="1" stroke-opacity="0.45"/>
        <circle cx="38" cy="38" r="4" fill="${tpl.primary}" opacity="0.4"/>
        <circle cx="1242" cy="38" r="4" fill="${tpl.primary}" opacity="0.4"/>
      </svg>`;
    }

    if (tpl.svgType === "diagonal") {
      return `<svg viewBox="0 0 1280 720" width="1280" height="720" data-el="diagonal-bg" style="position:absolute;inset:0;pointer-events:none;z-index:1;">
        <polygon points="990,0 1280,0 1280,58 1035,58" fill="${tpl.primary}" opacity="0.22"/>
        <circle cx="1235" cy="675" r="44" fill="${tpl.secondary}" opacity="0.14"/>
        <rect x="0" y="0" width="1280" height="5" fill="${tpl.primary}"/>
      </svg>`;
    }

    if (tpl.svgType === "dark") {
      const orbId = `darkOrb_${slideIdx}`;
      return `<svg viewBox="0 0 1280 720" width="1280" height="720" data-el="dark-bg" style="position:absolute;inset:0;pointer-events:none;z-index:1;">
        <defs>
          <radialGradient id="${orbId}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${tpl.primary}" stop-opacity="0.24"/>
            <stop offset="100%" stop-color="${tpl.primary}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="1140" cy="110" r="240" fill="url(#${orbId})"/>
        <circle cx="1185" cy="610" r="140" fill="none" stroke="${tpl.primary}" stroke-width="1" stroke-opacity="0.22"/>
        <circle cx="1210" cy="635" r="85" fill="none" stroke="${tpl.secondary}" stroke-width="1" stroke-dasharray="4 5" stroke-opacity="0.24"/>
      </svg>`;
    }

    if (tpl.svgType === "atelier" && svgs && Array.isArray(svgs.atelier) && svgs.atelier.length) {
      let raw = svgs.atelier[slideIdx % svgs.atelier.length];
      raw = raw
        .replace(/__PRIMARY__/g, tpl.primary)
        .replace(/__SECONDARY__/g, tpl.secondary)
        .replace(/__MIST__/g, tpl.mist || tpl.tint)
        .replace(/__TINT__/g, tpl.tint)
        .replace(/__SAND__/g, tpl.tint)
        .replace(/__MUTED__/g, "#8A9494")
        .replace(/__SURFACE__/g, tpl.surface);
      return `<svg viewBox="0 0 1280 720" width="1280" height="720" data-el="atelier-bg" style="position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0.85;">${raw}</svg>`;
    }
    return "";
  }

  function renderHeader(c, tpl) {
    return `<header style="padding:40px 64px 16px;position:relative;z-index:4;flex-shrink:0;">
      ${c.kicker ? `<div data-el="kicker" style="font-size:13px;color:${tpl.muted};margin-bottom:8px;">${escapeHtml(c.kicker)}</div>` : ""}
      <h2 data-el="title" style="margin:0;font-family:${tpl.titleFont};font-size:32px;font-weight:700;line-height:1.3;color:${tpl.fg};overflow-wrap:anywhere;">${escapeHtml(c.title)}</h2>
      ${c.sub ? `<p data-el="sub" style="margin:16px 0 0;font-size:17px;color:${tpl.muted};line-height:1.6;">${escapeHtml(c.sub)}</p>` : ""}
    </header>`;
  }

  function renderFooter(data, tpl, slideIdx) {
    // Rule: Cover (slideIdx === 0) has NO page number. Inner slides start at 01, 02, ... 19.
    const numStr = slideIdx > 0 ? String(slideIdx).padStart(2, "0") : "";
    const sectionLabel = data.chapter ? String(data.chapter).trim() : "";

    return `<div style="height:48px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:4;flex-shrink:0;">
      <div style="position:absolute;left:48px;right:48px;top:0;height:1px;background:${tpl.border};opacity:0.45;"></div>
      <span style="font-size:13px;font-weight:500;color:${tpl.muted};">${sectionLabel ? escapeHtml(sectionLabel) : ""}</span>
      ${numStr ? `<span style="font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${tpl.muted};letter-spacing:0.06em;">${numStr}</span>` : "<span></span>"}
    </div>`;
  }

  // The public layouts share one type scale and use only supplied content.
  function renderCoreContent(mode, c, tpl) {
    if (!c.pts.length && c.r2Bars?.length) c = {...c,pts:c.r2Bars.map(bar=>({title:bar.name || "",stat:bar.val == null ? "" : `${bar.val}${bar.unit === "%" ? "%" : ""}`,desc:bar.desc || ""}))};
    const text = (s) => escapeHtml(s ?? "");
    const p = (s) => s ? `<p data-el="body" style="margin:0;font-size:17px;line-height:1.65;color:${tpl.muted};overflow-wrap:anywhere;">${text(s)}</p>` : "";
    const card = `background:${tpl.surface};border:1px solid ${tpl.border};border-radius:${tpl.radius}px;padding:24px;`;
    const point = (pt, i) => `<div data-el="point-${i}" style="display:flex;flex-direction:column;gap:8px;min-width:0;">
      ${pt.title ? `<h3 data-el="point-title-${i}" style="margin:0;font-size:22px;line-height:1.35;color:${i === 0 ? tpl.primary : tpl.fg};overflow-wrap:anywhere;">${text(pt.title)}</h3>` : ""}
      ${pt.stat ? `<div data-el="stat-${i}" style="font-family:${tpl.monoFont};font-size:22px;color:${tpl.fg};">${text(pt.stat)}${pt.statLabel ? ` · ${text(pt.statLabel)}` : ""}</div>` : ""}
      ${p(pt.desc)}${p(pt.action)}</div>`;
    const rows = () => `<div style="display:flex;flex-direction:column;gap:24px;">${c.pts.map((pt, i) => `<div style="${i ? `border-top:1px solid ${tpl.border};padding-top:24px;` : ""}">${point(pt, i)}</div>`).join("")}</div>`;
    const summary = c.summary ? `<div data-el="summary" style="margin-top:24px;max-width:880px;">${p(c.summary)}</div>` : "";
    const wrap = (body) => `<div style="flex:1;min-height:0;padding:24px 64px 40px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:4;">${c.hs?.value ? `<div data-el="highlight-stat" style="margin-bottom:24px;">${point({title:c.hs.label,stat:c.hs.value,desc:c.hs.desc},0)}</div>` : ""}${body}${summary}</div>`;
    if (mode === "cover-centered" || mode === "cover-split-photo") {
      const cover = `<div style="max-width:960px;display:flex;flex-direction:column;gap:24px;">
        ${c.kicker ? `<div data-el="kicker" style="font-size:13px;color:${tpl.muted};">${text(c.kicker)}</div>` : ""}
        <h1 data-el="title" style="font-family:${tpl.titleFont};font-size:52px;line-height:1.25;color:${tpl.primary};margin:0;overflow-wrap:anywhere;">${text(c.title)}</h1>
        ${p(c.sub)}${c.pts.length ? `<div style="margin-top:24px;display:grid;grid-template-columns:repeat(${Math.min(c.pts.length, 2)},1fr);gap:24px;">${c.pts.map((pt,i)=>point(pt,i+1)).join("")}</div>` : ""}${summary}</div>`;
      if (mode === "cover-split-photo" && c.image) return `<div style="flex:1;padding:64px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;position:relative;z-index:4;">${cover}<img data-el="image" src="${text(c.image)}" alt="${text(c.title)}" style="width:100%;height:480px;object-fit:cover;"></div>`;
      return `<div style="flex:1;padding:80px 96px;display:flex;align-items:center;justify-content:center;position:relative;z-index:4;">${cover}</div>`;
    }
    if (mode === "three-col-defense") return wrap(`<div style="display:grid;grid-template-columns:repeat(${Math.min(Math.max(c.pts.length, 1), 4)},1fr);gap:32px;">${c.pts.map((pt,i)=>`<div style="${i ? `border-left:1px solid ${tpl.border};padding-left:24px;` : ""}">${point(pt,i)}</div>`).join("")}</div>`);
    if (mode === "dual-nested-stat" && c.dualGroups?.length) return wrap(`<div style="display:grid;grid-template-columns:repeat(${c.dualGroups.length},1fr);gap:32px;">${c.dualGroups.map((g,i)=>`<div style="${card}display:flex;flex-direction:column;gap:16px;">${point({title:g.title,desc:g.summary},i)}${(g.stats || []).map(st=>p(`${st.value || ""}${st.label ? ` · ${st.label}` : ""}`)).join("")}</div>`).join("")}</div>`);
    if (mode === "dual-nested-stat") {
      const mid=Math.ceil(c.pts.length/2);
      const groups=[c.pts.slice(0,mid),c.pts.slice(mid)].filter(group=>group.length);
      return wrap(`<div style="display:grid;grid-template-columns:repeat(${groups.length || 1},1fr);gap:32px;">${groups.map((group,i)=>`<div style="${card}display:flex;flex-direction:column;gap:24px;">${group.map((pt,j)=>point(pt,i*mid+j)).join("")}</div>`).join("")}</div>`);
    }
    if (mode === "before-after-compare" && c.pts.some(pt=>pt.action)) return wrap(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;"><div>${c.pts.map((pt,i)=>`<div style="margin-bottom:24px;">${point({...pt,action:""},i)}</div>`).join("")}</div><div style="border-left:1px solid ${tpl.border};padding-left:32px;">${c.pts.filter(pt=>pt.action).map(pt=>`<div style="margin-bottom:24px;">${p(pt.action)}</div>`).join("")}</div></div>`);
    if (mode === "horizontal-timeline") return wrap(`<div style="display:grid;grid-template-columns:repeat(${c.pts.length || 1},1fr);gap:24px;">${c.pts.map((pt,i)=>`<div style="border-top:2px solid ${i===0 ? tpl.primary : tpl.border};padding-top:24px;">${point(pt,i)}</div>`).join("")}</div>`);
    if (mode === "photo-story-split" && c.image) return wrap(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;"><img data-el="image" src="${text(c.image)}" alt="${text(c.title)}" style="width:100%;height:360px;object-fit:cover;">${rows()}</div>`);
    if (mode === "matrix-table-split" && c.matrixTable?.headers?.length && c.matrixTable?.rows?.length) {
      const mt = c.matrixTable;
      const cells = (cells, tag) => cells.map(cell=>`<${tag} style="text-align:left;padding:16px;border-bottom:1px solid ${tpl.border};font-size:17px;overflow-wrap:anywhere;">${text(cell)}</${tag}>`).join("");
      return wrap(`<table data-el="matrix" style="border-collapse:collapse;table-layout:fixed;width:100%;color:${tpl.fg};"><thead><tr>${cells(mt.headers,"th")}</tr></thead><tbody>${mt.rows.map(row=>`<tr>${cells(row,"td")}</tr>`).join("")}</tbody></table>${p(mt.thresholdTitle)}${p(mt.thresholdStat)}${p(mt.thresholdNote)}${p(mt.conclusionTitle)}${p(mt.conclusionBody)}`);
    }
    if (mode === "bars-insight-split") {
      const percent = (s) => { const m=String(s || "").match(/^(\d+(?:\.\d+)?)%$/); return m && +m[1]<=100 ? +m[1] : null; };
      // A bare number has no known scale. Only explicit percentages become bars.
      if (c.pts.some(pt=>percent(pt.stat)!==null)) return wrap(`<div style="display:flex;flex-direction:column;gap:24px;">${c.pts.map((pt,i)=>`<div>${point(pt,i)}${percent(pt.stat)!==null ? `<div style="height:8px;margin-top:16px;background:${tpl.tint};"><div data-el="bar-${i}" style="height:8px;width:${percent(pt.stat)}%;background:${i===0 ? tpl.primary : tpl.muted};"></div></div>` : ""}</div>`).join("")}</div>`);
    }
    return wrap(rows());
  }

  function renderSlideInner(recipeOrId, data) {
    const tpl = getTemplate(recipeOrId);
    const c = getCanon(data);
    const mode = data.mode || "dual-nested-stat";
    const total = data.total || 20;
    const idx = Math.max(0, (parseInt(data.num || "1", 10) || 1) - 1);

    const topStrip = "";

    const isCoverMode = mode === "cover-centered" || mode === "cover-split-photo" || mode === "cover-editorial-bleed" || mode === "cover-framed-grid";
    const renderFn = CORE_LAYOUT_IDS.includes(mode) ? ((c, tpl) => renderCoreContent(mode, c, tpl)) : ((c, tpl) => renderCoreContent("banner-3-rows", c, tpl));
    const coverPageNumBadge = (isCoverMode && idx > 0)
      ? `<div style="position:absolute;right:48px;bottom:16px;z-index:5;font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${tpl.muted};letter-spacing:0.06em;">${String(idx).padStart(2, "0")}</div>`
      : "";

    const mainContent = isCoverMode
      ? `${renderFn(c, tpl)}${coverPageNumBadge}`
      : `${renderHeader(c, tpl)}${renderFn(c, tpl)}${renderFooter(data, tpl, idx, total, data.chapters)}`;

    return `<div style="position:relative;width:1280px;height:720px;box-sizing:border-box;background:${tpl.bg};color:${tpl.fg};font-family:${tpl.bodyFont};display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;">
      ${buildTemplateBackdropSvg(tpl, idx)}
      ${topStrip}
      ${mainContent}
    </div>`;
  }

  // ==================== 3 COMPLETE FAITHFUL 20-SLIDE DECKS ====================

  const BUILTIN_DECKS = {
  "rules-guide": [
    {
      "mode": "cover-centered",
      "title": "讓下一份簡報有規則可循",
      "sub": "Slide Atelier：以文件定義設計，以資料延伸內容。"
    },
    {
      "mode": "banner-3-rows",
      "title": "規則先行，讓內容保持一致",
      "points": [
        {
          "title": "閱讀規範",
          "desc": "先確認風格、資料格式與檔案責任。"
        },
        {
          "title": "整理來源",
          "desc": "沒有來源的數字與圖片留空。"
        },
        {
          "title": "套用版面",
          "desc": "同類內容使用相同版面。"
        }
      ]
    },
    {
      "mode": "banner-3-rows",
      "title": "新增內容沿用同一套流程",
      "points": [
        {
          "title": "建立資料",
          "desc": "參考範例建立新的 JSON 簡報。"
        },
        {
          "title": "匯入預覽",
          "desc": "將資料匯入工作室，選擇鎖定風格。"
        },
        {
          "title": "逐頁驗收",
          "desc": "確認文字完整、留白與對齊。"
        }
      ]
    },
    {
      "mode": "three-col-defense",
      "title": "檔案分工讓修改範圍清楚",
      "points": [
        {
          "title": "內容資料",
          "desc": "examples 儲存可重用的 JSON 內容。"
        },
        {
          "title": "呈現引擎",
          "desc": "renderer 負責版面，stage 負責舞台。"
        },
        {
          "title": "開發規範",
          "desc": "AGENTS.md 定義擴充與驗收流程。"
        }
      ]
    },
    {
      "mode": "horizontal-timeline",
      "title": "從來源到成果保留檢查節點",
      "points": [
        {
          "title": "整理來源",
          "desc": "保留原意，不補寫不存在的事實。"
        },
        {
          "title": "建立內容",
          "desc": "依標準格式整理標題與要點。"
        },
        {
          "title": "檢查畫面",
          "desc": "完成語法檢查與逐頁截圖。"
        }
      ]
    }
  ],
  "study-notes": [
    {
      "mode": "cover-centered",
      "title": "把學習內容整理成可重用筆記",
      "sub": "一份筆記先回答一個問題，再整理概念與練習。"
    },
    {
      "mode": "banner-3-rows",
      "title": "先理解問題，再整理概念",
      "points": [
        {
          "title": "設定問題",
          "desc": "寫下這份筆記要解決的問題。"
        },
        {
          "title": "整理概念",
          "desc": "用自己的話說明關鍵想法。"
        },
        {
          "title": "保留來源",
          "desc": "標示參考資料，方便回頭確認。"
        }
      ]
    },
    {
      "mode": "banner-3-rows",
      "title": "把理解轉成可檢查的練習",
      "points": [
        {
          "title": "提出例子",
          "desc": "建立能說明概念的具體例子。"
        },
        {
          "title": "檢查推理",
          "desc": "逐步核對條件與推論。"
        },
        {
          "title": "記錄疑問",
          "desc": "保留尚待確認的問題。"
        }
      ]
    },
    {
      "mode": "banner-3-rows",
      "title": "複習時更新同一份筆記",
      "points": [
        {
          "title": "回想重點",
          "desc": "先回想，再對照原筆記。"
        },
        {
          "title": "修正理解",
          "desc": "補上新證據與更清楚的說明。"
        },
        {
          "title": "整理版本",
          "desc": "用清楚的檔名保存更新內容。"
        }
      ]
    }
  ],
  "reading-notes": [
    {
      "mode": "cover-centered",
      "title": "讓閱讀分享有清楚的脈絡",
      "sub": "先區分作者主張與自己的理解，再提出討論問題。"
    },
    {
      "mode": "banner-3-rows",
      "title": "建立分享的閱讀脈絡",
      "points": [
        {
          "title": "交代背景",
          "desc": "說明選書原因與閱讀目的。"
        },
        {
          "title": "整理主張",
          "desc": "引用前確認原文與上下文。"
        },
        {
          "title": "提出理解",
          "desc": "明確區分原文與個人詮釋。"
        }
      ]
    },
    {
      "mode": "banner-3-rows",
      "title": "用例子與問題延伸討論",
      "points": [
        {
          "title": "選擇例子",
          "desc": "找出能說明主張的具體情境。"
        },
        {
          "title": "提出疑問",
          "desc": "檢查假設、限制與不同觀點。"
        },
        {
          "title": "連結經驗",
          "desc": "說明與日常觀察的關聯。"
        }
      ]
    },
    {
      "mode": "banner-3-rows",
      "title": "分享後保留可延伸的紀錄",
      "points": [
        {
          "title": "彙整回饋",
          "desc": "記錄討論中出現的新問題。"
        },
        {
          "title": "查證資料",
          "desc": "把待確認的說法回到來源核對。"
        },
        {
          "title": "更新內容",
          "desc": "沿用同一份格式補充筆記。"
        }
      ]
    }
  ]
};

  function buildAiSecurityDeck() { return BUILTIN_DECKS["rules-guide"]; }
  function buildCafeBrandDeck() { return BUILTIN_DECKS["study-notes"]; }
  function buildLuminaPitchDeck() { return BUILTIN_DECKS["reading-notes"]; }

  function getDeckPlan(recipeOrId, pageOverrides = {}, topicId = "rules-guide", assetBase = "./assets/") {
    topicId = ({"ai-security":"rules-guide","cafe-brand":"study-notes","lumina-pitch":"reading-notes"})[topicId] || topicId;
    let list;
    let chapters;
    if (CUSTOM_TOPICS[topicId]) {
      const custom = CUSTOM_TOPICS[topicId];
      list = custom.pages.map((p) => ({
        ...p,
        image: p.image && p.image.startsWith("./assets/") && assetBase !== "./assets/"
          ? p.image.replace("./assets/", assetBase)
          : (p.image || null)
      }));
      chapters = custom.chapters || [];
    } else if (topicId === "study-notes") {
      list = buildCafeBrandDeck(assetBase);
      chapters = ["品牌初心", "品牌歷程", "空間體驗", "烘焙工藝", "獎項與未來"];
    } else if (topicId === "reading-notes") {
      list = buildLuminaPitchDeck();
      chapters = ["市場機會", "產品技術", "商業模式", "成長實績", "募資規劃"];
    } else {
      list = buildAiSecurityDeck();
      chapters = ["研究動機", "文獻探討", "研究方法", "實證分析", "結論建議"];
    }

    return list.map((item, idx) => {
      const ov = pageOverrides[idx];
      const overrideMode = typeof ov === "string" ? ov : (ov && ov.mode);
      return {
        ...item,
        num: String(idx + 1).padStart(2, "0"),
        total: list.length,
        chapters,
        defaultMode: item.mode,
        mode: overrideMode || item.mode
      };
    });
  }

  function get20SlidePlan(recipeOrId, pageOverrides = {}, topicId = "rules-guide", assetBase = "./assets/") {
    return getDeckPlan(recipeOrId, pageOverrides, topicId, assetBase);
  }

  function render20Slides(deckEl, recipeOrId, pageOverrides = {}, topicId = "rules-guide", assetBase = "./assets/") {
    const slidesData = getDeckPlan(recipeOrId, pageOverrides, topicId, assetBase);
    const tpl = getTemplate(recipeOrId);
    deckEl.innerHTML = slidesData.map((data) => {
      const html = renderSlideInner(recipeOrId, data);
      return `<section class="slide">
        ${html}
        <aside class="notes">第 ${data.num} 頁（版面：${data.mode}｜母版：${tpl.name}）— ${escapeHtml(data.title)}。</aside>
      </section>`;
    }).join("");
  }

  return {
    MASTER_TEMPLATES,
    COLOR_PALETTES,
    FONT_PAIRINGS,
    STYLE_PRESETS,
    COMPOUND_LAYOUTS,
    CORE_LAYOUTS,
    TOPICS,
    registerCustomTopic,
    getTemplate,
    getPreset,
    getRecommendedLayouts,
    renderSlideInner,
    getDeckPlan,
    get20SlidePlan,
    render20Slides
  };
})();
