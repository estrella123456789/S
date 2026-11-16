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
      svgType: "slidesgo"
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
      id: "editorial-terracotta",
      name: "人文雜誌 × 燕麥赤陶",
      desc: "雜誌留白導邊 · 燕麥赤陶 · 人文襯線",
      templateId: "editorial-magazine",
      colorId: "cafe-terracotta",
      fontId: "serif-classic"
    },
    {
      id: "botanical-forest",
      name: "自然線繪 × 森林羊皮紙",
      desc: "方格紙感定位 · 森林深綠 · 現代黑體",
      templateId: "botanical-line",
      colorId: "forest-parchment",
      fontId: "sans-modern"
    },
    {
      id: "academic-cobalt",
      name: "經典學術 × 北歐鈷藍",
      desc: "學者細框結構 · 北歐鈷藍 · 人文襯線",
      templateId: "academic-thesis",
      colorId: "nordic-cobalt",
      fontId: "serif-classic"
    },
    {
      id: "keynote-obsidian",
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
    "slidesgo-organic": { templateId: "organic-atelier", colorId: "teal-cream", fontId: "serif-classic" },
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

    { id: "dual-nested-stat", cat: "卡片與網格", label: "大卡嵌雙數據", desc: "雙外卡各嵌子數據格與底論盒" },
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
    "cover-centered",
    "cover-split-photo",
    "section-monolith",
    "dual-nested-stat",
    "three-col-defense",
    "four-col-nested",
    "banner-3-rows",
    "left-thesis-right-list",
    "bars-insight-split",
    "photo-story-split"
  ];
  const CORE_LAYOUTS = CORE_LAYOUT_IDS.map((id) => COMPOUND_LAYOUTS.find((l) => l.id === id)).filter(Boolean);

  const TOPICS = [
    { id: "ai-security", label: "中小企業生成式 AI 資安（學術論文・20頁）", shortLabel: "AI 資安論文", count: 20 },
    { id: "cafe-brand", label: "Simple Kaffa 興波咖啡（餐飲品牌・20頁）", shortLabel: "興波咖啡", count: 20 },
    { id: "lumina-pitch", label: "Lumina Ring 智慧戒發表（商業產品・20頁）", shortLabel: "Lumina 商業簡報", count: 20 }
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

    const tpl = MASTER_TEMPLATES.find((t) => t.id === tid) || MASTER_TEMPLATES[0];
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
      let stat = p.stat || "";
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
        if (!Number.isNaN(v)) return Math.max(8, Math.min(100, Math.round((v / maxVal) * 100)));
      }
    }
    if (/^\d+(?:\.\d+)?$/.test(raw)) {
      const v = parseFloat(raw);
      if (!Number.isNaN(v) && v > 0 && v <= maxVal) return Math.max(8, Math.min(100, Math.round((v / maxVal) * 100)));
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

    if (tpl.svgType === "slidesgo" && svgs && Array.isArray(svgs.slidesgo) && svgs.slidesgo.length) {
      let raw = svgs.slidesgo[slideIdx % svgs.slidesgo.length];
      raw = raw
        .replace(/__PRIMARY__/g, tpl.primary)
        .replace(/__SECONDARY__/g, tpl.secondary)
        .replace(/__MIST__/g, tpl.mist || tpl.tint)
        .replace(/__TINT__/g, tpl.tint)
        .replace(/__SAND__/g, tpl.tint)
        .replace(/__MUTED__/g, "#8A9494")
        .replace(/__SURFACE__/g, tpl.surface);
      return `<svg viewBox="0 0 1280 720" width="1280" height="720" data-el="slidesgo-bg" style="position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0.85;">${raw}</svg>`;
    }
    return "";
  }

  function renderHeader(c, tpl) {
    const kicker = c.kicker && c.kicker !== c.chapter && c.kicker !== c.title ? c.kicker : "";
    if (tpl.chrome === "botanical") {
      return `<div style="padding:24px 48px 16px;position:relative;z-index:4;flex-shrink:0;">
        ${kicker ? `<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid ${tpl.border};padding-bottom:8px;margin-bottom:8px;">
          <span style="display:inline-flex;align-items:center;gap:8px;font-family:${tpl.monoFont};font-size:13px;font-weight:700;letter-spacing:0.06em;color:${tpl.primary};"><span style="width:8px;height:8px;background:${tpl.primary};display:inline-block;"></span>${escapeHtml(kicker)}</span>
        </div>` : ""}
        <h2 style="margin:0;font-family:${tpl.titleFont};font-size:32px;font-weight:800;line-height:1.25;color:${tpl.fg};">${escapeHtml(c.title)}</h2>
        ${c.sub ? `<p style="margin:8px 0 0;font-size:17px;color:${tpl.muted};line-height:1.5;max-width:74ch;">${escapeHtml(c.sub)}</p>` : ""}
      </div>`;
    }
    if (tpl.chrome === "editorial") {
      return `<div style="padding:24px 48px 16px;position:relative;z-index:4;flex-shrink:0;">
        <div style="border-left:4px solid ${tpl.primary};padding-left:16px;">
          ${kicker ? `<span style="display:block;font-family:${tpl.monoFont};font-size:13px;font-weight:700;letter-spacing:0.06em;color:${tpl.primary};margin-bottom:4px;">${escapeHtml(kicker)}</span>` : ""}
          <h2 style="margin:0;font-family:${tpl.titleFont};font-size:32px;font-weight:800;line-height:1.25;color:${tpl.fg};">${escapeHtml(c.title)}</h2>
          ${c.sub ? `<p style="margin:8px 0 0;font-size:17px;color:${tpl.muted};line-height:1.5;max-width:74ch;">${escapeHtml(c.sub)}</p>` : ""}
        </div>
      </div>`;
    }
    if (tpl.chrome === "diagonal") {
      return `<div style="padding:24px 48px 16px;position:relative;z-index:4;flex-shrink:0;">
        <div style="border-left:6px solid ${tpl.primary};padding:4px 0 4px 16px;">
          ${kicker ? `<span style="display:inline-block;font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${tpl.primary};letter-spacing:0.06em;margin-bottom:4px;">${escapeHtml(kicker)}</span>` : ""}
          <h2 style="margin:0;font-family:${tpl.titleFont};font-size:32px;font-weight:800;line-height:1.25;color:${tpl.fg};">${escapeHtml(c.title)}</h2>
          ${c.sub ? `<p style="margin:8px 0 0;font-size:17px;color:${tpl.muted};line-height:1.5;">${escapeHtml(c.sub)}</p>` : ""}
        </div>
      </div>`;
    }
    if (tpl.chrome === "dark") {
      return `<div style="padding:24px 48px 16px;position:relative;z-index:4;flex-shrink:0;">
        ${kicker ? `<span style="display:inline-block;font-family:${tpl.monoFont};font-size:13px;font-weight:700;letter-spacing:0.06em;color:${tpl.primary};margin-bottom:8px;">${escapeHtml(kicker)}</span>` : ""}
        <h2 style="margin:0;font-family:${tpl.titleFont};font-size:32px;font-weight:800;line-height:1.25;color:${tpl.fg};">${escapeHtml(c.title)}</h2>
        ${c.sub ? `<p style="margin:8px 0 0;font-size:17px;color:${tpl.muted};line-height:1.5;max-width:74ch;">${escapeHtml(c.sub)}</p>` : ""}
        <div style="margin-top:16px;height:2px;width:64px;background:${tpl.primary};"></div>
      </div>`;
    }
    const centered = tpl.chrome === "academic" || tpl.chrome === "organic";
    return `<div style="padding:24px 48px 16px;position:relative;z-index:4;flex-shrink:0;${centered ? "text-align:center;" : ""}">
      ${kicker ? `<span style="display:inline-block;font-family:${tpl.monoFont};font-size:13px;font-weight:700;letter-spacing:0.06em;color:${tpl.primary};margin-bottom:4px;">${escapeHtml(kicker)}</span>` : ""}
      <h2 style="margin:0;font-family:${tpl.titleFont};font-size:32px;font-weight:800;line-height:1.25;color:${tpl.fg};">${escapeHtml(c.title)}</h2>
      ${c.sub ? `<p style="margin:8px ${centered ? "auto" : "0"} 0;font-size:17px;color:${tpl.muted};line-height:1.5;max-width:74ch;">${escapeHtml(c.sub)}</p>` : ""}
    </div>`;
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

  // ==================== 30 UNIFIED-CONTENT LAYOUTS (FULL HEIGHT, DYNAMIC COUNTS) ====================

  function layoutCoverCentered(c, tpl) {
    const n = c.pts.length;
    const footerText = c.presenter || c.summary.replace(/\*\*/g, "");
    return `<div style="flex:1;padding:48px 64px 32px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center;position:relative;z-index:4;min-height:0;">
      <div style="margin-top:24px;display:flex;flex-direction:column;align-items:center;gap:16px;">
        <h1 style="margin:0;font-family:${tpl.titleFont};font-size:52px;font-weight:800;line-height:1.2;color:${tpl.primary};max-width:19ch;">${escapeHtml(c.title)}</h1>
        ${c.sub ? `<p style="margin:0;font-family:${tpl.titleFont};font-size:21px;color:${tpl.fg};max-width:48ch;line-height:1.5;">${escapeHtml(c.sub)}</p>` : ""}
        ${c.author ? `<div style="margin-top:8px;font-size:17px;color:${tpl.muted};">${escapeHtml(c.author)}</div>` : ""}
      </div>
      ${n > 0 ? `<div style="width:100%;display:grid;grid-template-columns:repeat(${n},1fr);gap:16px;">
        ${c.pts.map((pt, i) => `<div style="${cardChromeCss(tpl, "card")}padding:16px;text-align:left;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
          ${(pt.num || pt.stat) ? `<div style="display:flex;justify-content:space-between;align-items:center;">
            ${pt.num ? `<span style="font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${tpl.muted};">${escapeHtml(pt.num)}</span>` : "<span></span>"}
            ${pt.stat ? `<span style="font-family:${tpl.titleFont};font-size:21px;font-weight:800;color:${i === 0 ? tpl.primary : tpl.fg};">${escapeHtml(pt.stat)}</span>` : ""}
          </div>` : ""}
          <div style="font-size:17px;font-weight:700;color:${tpl.fg};">${escapeHtml(pt.title)}</div>
          ${pt.desc ? `<div style="font-size:13px;color:${tpl.muted};line-height:1.5;">${escapeHtml(pt.desc)}</div>` : ""}
        </div>`).join("")}
      </div>` : ""}
      ${(footerText || c.dateLabel) ? `<div style="width:100%;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:${tpl.muted};border-top:1px solid ${tpl.border}66;padding-top:16px;">
        <span>${escapeHtml(footerText)}</span>
        <span>${escapeHtml(c.dateLabel || "")}</span>
      </div>` : ""}
    </div>`;
  }

  function layoutCoverSplitPhoto(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const rightVisual = c.image
      ? `<img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.title)}" onerror="this.style.display='none'" style="width:100%;height:100%;object-fit:cover;display:block;"/>`
      : `<div style="width:100%;height:100%;background:${tpl.primary};color:${onP};padding:32px;display:flex;flex-direction:column;justify-content:center;gap:16px;">
          ${c.hs ? `<div style="font-family:${tpl.titleFont};font-size:52px;font-weight:800;line-height:1.05;">${escapeHtml(c.hs.value)}</div>
          ${c.hs.label ? `<div style="font-size:21px;font-weight:700;">${escapeHtml(c.hs.label)}</div>` : ""}
          ${(c.hs.desc || c.summary) ? `<div style="height:1px;background:${onP}44;"></div>
          <p style="margin:0;font-size:17px;line-height:1.6;opacity:0.92;">${escapeHtml(c.hs.desc || c.summary.replace(/\*\*/g, ""))}</p>` : ""}` : (c.summary ? `<div style="font-family:${tpl.titleFont};font-size:32px;font-weight:700;line-height:1.35;">${escapeHtml(c.summary.replace(/\*\*/g, ""))}</div>` : "")}
        </div>`;

    return `<div style="flex:1;padding:32px 48px 24px;display:flex;flex-direction:column;gap:24px;position:relative;z-index:4;min-height:0;">
      <div style="flex:1;display:grid;grid-template-columns:1.06fr 0.94fr;gap:32px;min-height:0;align-items:stretch;">
        <div style="display:flex;flex-direction:column;justify-content:center;gap:16px;">
          ${c.kicker ? `<span style="display:inline-flex;width:fit-content;font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${tpl.primary};letter-spacing:0.06em;">${escapeHtml(c.kicker)}</span>` : ""}
          <h1 style="margin:0;font-family:${tpl.titleFont};font-size:52px;font-weight:800;line-height:1.18;color:${tpl.fg};">${escapeHtml(c.title)}</h1>
          ${c.sub ? `<p style="margin:0;font-size:17px;color:${tpl.muted};line-height:1.6;">${escapeHtml(c.sub)}</p>` : ""}
          ${c.summary ? `<div style="border-left:4px solid ${tpl.primary};padding:8px 0 8px 16px;font-size:17px;color:${tpl.fg};line-height:1.6;">${formatRich(c.summary, tpl.primary)}</div>` : ""}
        </div>
        <div style="border-radius:${tpl.radius}px;overflow:hidden;border:${tpl.borderWidth} solid ${tpl.border};">${rightVisual}</div>
      </div>
      ${c.pts.length ? `<div style="display:grid;grid-template-columns:repeat(${c.pts.length},1fr);gap:16px;flex-shrink:0;">
        ${c.pts.map((pt, i) => `<div style="${cardChromeCss(tpl, "card")}padding:16px;">
          <div style="font-size:17px;font-weight:700;color:${i === 0 ? tpl.primary : tpl.fg};">${pt.num ? `${escapeHtml(pt.num)} · ` : ""}${escapeHtml(pt.title)}</div>
          ${(pt.stat || pt.desc) ? `<div style="font-size:13px;color:${tpl.muted};margin-top:8px;line-height:1.5;">${escapeHtml(pt.stat ? `${pt.stat} — ` : "")}${escapeHtml(pt.desc)}</div>` : ""}
        </div>`).join("")}
      </div>` : ""}
    </div>`;
  }

  function layoutCoverEditorialBleed(c, tpl) {
    const n = c.pts.length;
    const cols = n === 3 ? 3 : (n <= 2 ? Math.max(1, n) : 2);
    return `<div style="flex:1;padding:28px 56px 24px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;position:relative;z-index:4;min-height:0;">
      <div style="border-top:3px solid ${tpl.primary};border-bottom:1.5px solid ${tpl.border};padding:18px 0;display:grid;grid-template-columns:1.5fr 0.5fr;gap:24px;align-items:center;">
        <div>
          <span style="font-family:${tpl.monoFont};font-size:12.5px;font-weight:700;color:${tpl.secondary};letter-spacing:0.08em;">${escapeHtml(c.kicker)}</span>
          <h1 style="margin:6px 0 0;font-family:${tpl.titleFont};font-size:40px;font-weight:900;line-height:1.2;color:${tpl.fg};">${escapeHtml(c.title)}</h1>
          ${c.sub ? `<p style="margin:8px 0 0;font-size:16.5px;color:${tpl.muted};">${escapeHtml(c.sub)}</p>` : ""}
        </div>
        ${c.hs ? `<div style="${cardChromeCss(tpl, "tint")}padding:16px 18px;text-align:right;">
          <div style="font-family:${tpl.titleFont};font-size:38px;font-weight:900;color:${tpl.primary};line-height:1;">${escapeHtml(c.hs.value)}</div>
          <div style="font-size:14px;color:${tpl.muted};margin-top:6px;">${escapeHtml(c.hs.label)}</div>
        </div>` : ""}
      </div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;min-height:0;align-items:stretch;">
        ${c.pts.map((pt, i) => `<div style="${n === 5 && i === 0 ? "grid-column:1 / -1;" : ""}${cardChromeCss(tpl, "card")}padding:18px 22px;display:flex;flex-direction:column;justify-content:center;gap:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:19px;color:${tpl.primary};">${escapeHtml(pt.num)} ${escapeHtml(pt.title)}</strong>
            ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:15px;font-weight:800;color:${tpl.secondary};background:${tpl.tint};padding:4px 12px;border-radius:6px;">${escapeHtml(pt.stat)}</span>` : ""}
          </div>
          <p style="margin:0;font-size:16px;color:${tpl.fg};line-height:1.62;">${formatRich(pt.desc, tpl.primary)}</p>
          ${pt.action ? `<div style="font-size:14.5px;color:${tpl.muted};font-weight:600;">▸ ${escapeHtml(pt.action)}</div>` : ""}
        </div>`).join("")}
      </div>
      ${c.summary ? `<div style="font-size:15.5px;color:${tpl.fg};background:${tpl.tint};padding:12px 18px;border-radius:${tpl.innerRadius}px;">${formatRich(c.summary, tpl.primary)}</div>` : ""}
    </div>`;
  }

  function layoutCoverFramedGrid(c, tpl) {
    const n = Math.max(1, c.pts.length);
    return `<div style="flex:1;padding:24px 52px 24px;display:flex;flex-direction:column;position:relative;z-index:4;min-height:0;">
      <div style="flex:1;border:2px solid ${tpl.primary};border-radius:${tpl.radius}px;padding:7px;display:flex;min-height:0;">
        <div style="flex:1;border:1px solid ${tpl.border};border-radius:${Math.max(0, tpl.radius - 4)}px;padding:24px 28px;display:flex;flex-direction:column;justify-content:space-between;background:${tpl.surface};">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;">
            <div>
              <span style="font-family:${tpl.monoFont};font-size:12px;color:${tpl.secondary};font-weight:700;">${escapeHtml(c.kicker)}</span>
              <h2 style="margin:6px 0;font-family:${tpl.titleFont};font-size:35px;font-weight:800;color:${tpl.primary};">${escapeHtml(c.title)}</h2>
              ${c.sub ? `<p style="margin:0;font-size:15.5px;color:${tpl.muted};">${escapeHtml(c.sub)}</p>` : ""}
            </div>
            ${c.hs ? `<div style="text-align:right;flex-shrink:0;">
              <div style="font-family:${tpl.titleFont};font-size:40px;font-weight:900;color:${tpl.primary};">${escapeHtml(c.hs.value)}</div>
              <div style="font-size:13px;color:${tpl.muted};">${escapeHtml(c.hs.label)}</div>
            </div>` : ""}
          </div>
          <div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:16px;flex:1;margin:18px 0;min-height:0;">
            ${c.pts.map((pt) => `<div style="background:${tpl.bg};border:1px solid ${tpl.border};border-radius:${tpl.innerRadius}px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="font-family:${tpl.monoFont};font-size:13px;font-weight:800;color:${tpl.secondary};">${escapeHtml(pt.num)}${pt.stat ? ` · ${escapeHtml(pt.stat)}` : ""}</div>
                <div style="font-size:16.5px;font-weight:800;color:${tpl.fg};margin-top:6px;">${escapeHtml(pt.title)}</div>
              </div>
              <p style="margin:8px 0;font-size:14px;color:${tpl.muted};line-height:1.55;">${formatRich(pt.desc, tpl.primary)}</p>
              ${pt.action ? `<div style="font-size:12.5px;font-weight:700;color:${tpl.primary};border-top:1px dashed ${tpl.border};padding-top:8px;">▸ ${escapeHtml(pt.action)}</div>` : ""}
            </div>`).join("")}
          </div>
          ${c.summary ? `<div style="font-size:14.5px;color:${tpl.fg};text-align:center;">${formatRich(c.summary, tpl.primary)}</div>` : ""}
        </div>
      </div>
    </div>`;
  }

  function layoutSectionMonolith(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const n = c.pts.length;
    const cols = n <= 3 ? 1 : 2;
    const leftSummary = c.summary || c.hs?.desc || "";
    return `<div style="flex:1;padding:16px 48px 16px;display:grid;grid-template-columns:0.84fr 1.16fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="background:${tpl.primary};color:${onP};border-radius:${tpl.radius}px;padding:32px;display:flex;flex-direction:column;justify-content:space-between;">
        ${c.kicker ? `<span style="font-family:${tpl.monoFont};font-size:13px;opacity:0.86;letter-spacing:0.08em;">${escapeHtml(c.kicker)}</span>` : "<span></span>"}
        ${c.hs ? `<div>
          <div style="font-family:${tpl.titleFont};font-size:52px;font-weight:800;line-height:1.05;">${escapeHtml(c.hs.value)}</div>
          ${c.hs.label ? `<div style="font-size:21px;font-weight:700;margin-top:8px;">${escapeHtml(c.hs.label)}</div>` : ""}
        </div>` : (c.chapter ? `<div><div style="font-size:32px;font-weight:800;">${escapeHtml(c.chapter)}</div></div>` : "<div></div>")}
        ${leftSummary ? `<p style="margin:0;font-size:17px;line-height:1.6;opacity:0.95;border-top:1px solid ${onP}33;padding-top:16px;">${escapeHtml(leftSummary).replace(/\*\*/g, "")}</p>` : ""}
      </div>
      <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;min-height:0;align-items:stretch;">
        ${c.pts.map((pt, i) => `<div style="${n === 5 && i === 0 ? "grid-column:1 / -1;" : ""}${cardChromeCss(tpl, "card")}padding:16px 24px;display:flex;flex-direction:column;justify-content:center;gap:8px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
            <div style="display:flex;align-items:center;gap:12px;">
              ${badgeHtml(pt.num, tpl, i === 0, 32)}
              <strong style="font-size:21px;font-weight:700;color:${tpl.fg};">${escapeHtml(pt.title)}</strong>
            </div>
            ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:17px;font-weight:700;color:${i === 0 ? tpl.primary : tpl.fg};">${escapeHtml(pt.stat)}</span>` : ""}
          </div>
          ${pt.desc ? `<p style="margin:0;font-size:17px;color:${tpl.muted};line-height:1.55;">${formatRich(pt.desc, tpl.primary)}</p>` : ""}
          ${pt.action ? `<div style="border-top:1px solid ${tpl.border}55;padding-top:8px;font-size:13px;color:${tpl.muted};font-weight:600;">▸ ${escapeHtml(pt.action)}</div>` : ""}
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutDualNestedStat(c, tpl) {
    // Use explicit dualGroups when provided, else split c.pts evenly — single container layer, hairline dividers
    let groups = c.dualGroups;
    if (!groups) {
      const mid = Math.ceil(c.pts.length / 2);
      const leftPts = c.pts.slice(0, mid);
      const rightPts = c.pts.slice(mid);
      groups = [leftPts, rightPts].filter((arr) => arr.length > 0).map((arr, idx) => ({
        num: `0${idx + 1}`,
        title: arr.map((p) => p.title).join(" · "),
        stats: arr.filter((p) => p.stat).map((p) => ({ value: p.stat, label: p.statLabel || p.title })),
        summary: arr.map((p) => `${p.title}：${p.desc}${p.action ? `（${p.action}）` : ""}`).join(" ")
      }));
    }

    return `<div style="flex:1;padding:16px 48px 16px;display:grid;grid-template-columns:repeat(${groups.length},1fr);gap:24px;min-height:0;position:relative;z-index:4;">
      ${groups.map((g, gi) => {
        const isFocal = gi === 0;
        const stats = g.stats || [];
        return `<div style="${cardChromeCss(tpl, "card")}padding:24px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
          <div style="display:flex;align-items:center;gap:12px;padding-bottom:16px;border-bottom:1px solid ${tpl.border};">
            ${badgeHtml(g.num, tpl, isFocal, 32)}
            <strong style="font-size:21px;font-weight:700;color:${isFocal ? tpl.primary : tpl.fg};">${escapeHtml(g.title)}</strong>
          </div>
          ${stats.length ? `<div style="display:grid;grid-template-columns:repeat(${stats.length},1fr);gap:16px;padding:8px 0;">
            ${stats.map((st, si) => `<div style="${si < stats.length - 1 ? `border-right:1px solid ${tpl.border}66;padding-right:16px;` : ""}">
              <div style="font-family:${tpl.titleFont};font-size:32px;font-weight:800;color:${isFocal ? tpl.primary : tpl.fg};line-height:1.15;">${escapeHtml(st.value)}</div>
              ${st.label ? `<div style="margin-top:6px;font-size:13px;color:${tpl.muted};line-height:1.4;">${escapeHtml(st.label)}</div>` : ""}
            </div>`).join("")}
          </div>` : ""}
          ${g.summary ? `<div style="border-top:1px solid ${tpl.border}66;padding-top:16px;flex:1;display:flex;align-items:center;">
            <p style="margin:0;font-size:17px;line-height:1.65;color:${tpl.fg};">${formatRich(g.summary, tpl.primary)}</p>
          </div>` : ""}
        </div>`;
      }).join("")}
    </div>`;
  }

  function layoutFourColNested(c, tpl) {
    const n = Math.max(1, c.pts.length);
    const circ = 2 * Math.PI * 38;
    return `<div style="flex:1;padding:16px 48px 16px;display:flex;flex-direction:column;gap:16px;min-height:0;position:relative;z-index:4;">
      ${c.summary ? `<div style="border-left:4px solid ${tpl.primary};padding:4px 0 4px 16px;font-size:17px;color:${tpl.fg};line-height:1.5;flex-shrink:0;">${formatRich(c.summary, tpl.primary)}</div>` : ""}
      <div style="flex:1;display:grid;grid-template-columns:repeat(${n},1fr);gap:16px;min-height:0;">
        ${c.pts.map((pt, i) => {
          const isFocal = i === 0;
          const pct = extractPct(pt.stat, i, 100);
          const dash = pct !== null ? Math.round((pct / 100) * circ) : 0;
          const accentColor = isFocal ? tpl.primary : tpl.fg;
          return `<div style="${cardChromeCss(tpl, "card")}padding:24px 16px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;text-align:center;">
            <div>
              <div style="font-size:21px;font-weight:700;color:${accentColor};line-height:1.25;">${escapeHtml(pt.title)}</div>
              ${pt.statLabel ? `<div style="font-family:${tpl.monoFont};font-size:13px;color:${tpl.muted};margin-top:4px;">${escapeHtml(pt.statLabel)}</div>` : ""}
            </div>
            ${pct !== null ? `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;">
              <svg viewBox="0 0 96 96" width="96" height="96">
                <circle cx="48" cy="48" r="38" fill="none" stroke="${tpl.border}" stroke-opacity="0.35" stroke-width="8"/>
                <circle cx="48" cy="48" r="38" fill="none" stroke="${isFocal ? tpl.primary : tpl.muted}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${dash} ${Math.round(circ)}" transform="rotate(-90 48 48)"/>
                <text x="48" y="54" text-anchor="middle" fill="${accentColor}" font-size="14" font-weight="800">${escapeHtml(String(pt.stat).slice(0, 7))}</text>
              </svg>
              ${pt.stat.length > 7 ? `<div style="font-family:${tpl.titleFont};font-size:21px;font-weight:800;color:${accentColor};">${escapeHtml(pt.stat)}</div>` : ""}
            </div>` : (pt.stat ? `<div style="font-family:${tpl.titleFont};font-size:32px;font-weight:800;color:${accentColor};line-height:1.15;">${escapeHtml(pt.stat)}</div>` : "")}
            ${pt.desc ? `<p style="margin:0;font-size:17px;color:${tpl.fg};line-height:1.55;">${formatRich(pt.desc, tpl.primary)}</p>` : ""}
            ${pt.action ? `<div style="border-top:1px solid ${tpl.border}66;padding-top:12px;font-size:13px;color:${tpl.muted};font-weight:600;line-height:1.45;">${escapeHtml(pt.action)}</div>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  function layoutProfile2x2Grid(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const n = c.pts.length;
    const cols = n <= 3 ? 1 : 2;
    return `<div style="flex:1;padding:12px 56px 16px;display:grid;grid-template-columns:0.84fr 1.86fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="${cardChromeCss(tpl, "tint")}padding:26px 22px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px;">
        <div style="width:128px;height:128px;border-radius:${tpl.chrome === "botanical" ? "2px" : "50%"};background:${tpl.primary};color:${onP};display:flex;align-items:center;justify-content:center;font-family:${tpl.monoFont};font-size:25px;font-weight:800;padding:10px;">${escapeHtml(c.hs ? c.hs.value : c.kicker)}</div>
        <div style="font-family:${tpl.titleFont};font-size:22px;font-weight:800;color:${tpl.primary};">${escapeHtml(c.hs ? c.hs.label : c.chapter)}</div>
        <div style="width:65%;height:1.5px;background:${tpl.border};"></div>
        <p style="margin:0;font-size:15.5px;color:${tpl.fg};line-height:1.65;">${formatRich(c.summary || c.hs?.desc || "", tpl.primary)}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;min-height:0;align-items:stretch;">
        ${c.pts.map((pt, i) => `<div style="${n === 5 && i === 0 ? "grid-column:1 / -1;" : ""}${cardChromeCss(tpl, "card")}overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="background:${tpl.chrome === "diagonal" ? tpl.primary : `${tpl.secondary}26`};color:${tpl.chrome === "diagonal" ? onP : tpl.primary};padding:12px 18px;display:flex;justify-content:space-between;align-items:center;font-weight:800;">
            <span style="font-size:18px;">${escapeHtml(pt.title)}</span>
            ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:15px;">${escapeHtml(pt.stat)}</span>` : ""}
          </div>
          <div style="padding:14px 18px;flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px;">
            <div style="font-size:16px;color:${tpl.fg};line-height:1.6;">${formatRich(pt.desc, tpl.primary)}</div>
            ${pt.action ? `<div style="font-size:14.5px;color:${tpl.primary};font-weight:700;">▸ ${escapeHtml(pt.action)}</div>` : ""}
          </div>
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutThreeColDefense(c, tpl) {
    const n = Math.max(1, c.pts.length);
    const hasRichBody = c.pts.some((pt) => pt.desc || pt.stat || pt.action);
    return `<div style="flex:1;padding:16px 48px 16px;display:flex;flex-direction:column;gap:16px;min-height:0;position:relative;z-index:4;">
      ${c.summary ? `<div style="border-left:4px solid ${tpl.primary};padding:4px 0 4px 16px;font-size:17px;color:${tpl.fg};line-height:1.5;flex-shrink:0;">${formatRich(c.summary, tpl.primary)}</div>` : ""}
      <div style="flex:1;display:grid;grid-template-columns:repeat(${n},1fr);gap:24px;min-height:0;${hasRichBody ? "" : "align-content:center;"}">
        ${c.pts.map((pt, i) => {
          const isFocal = i === 0;
          return `<div style="${cardChromeCss(tpl, "card")}padding:24px;display:flex;flex-direction:column;justify-content:${hasRichBody ? "space-between" : "flex-start"};gap:16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;${hasRichBody ? `padding-bottom:16px;border-bottom:1px solid ${tpl.border};` : ""}">
              <div style="display:flex;align-items:center;gap:12px;">${badgeHtml(pt.num, tpl, isFocal, 32)}<strong style="font-size:21px;font-weight:700;color:${isFocal ? tpl.primary : tpl.fg};">${escapeHtml(pt.title)}</strong></div>
              ${pt.statLabel ? `<span style="font-family:${tpl.monoFont};font-size:13px;font-weight:600;color:${tpl.muted};">${escapeHtml(pt.statLabel)}</span>` : ""}
            </div>
            ${pt.stat ? `<div style="font-family:${tpl.titleFont};font-size:32px;font-weight:800;color:${isFocal ? tpl.primary : tpl.fg};line-height:1.15;">${escapeHtml(pt.stat)}</div>` : ""}
            ${pt.desc ? `<p style="margin:0;font-size:17px;line-height:1.6;color:${tpl.fg};flex:1;display:flex;align-items:center;">${formatRich(pt.desc, tpl.primary)}</p>` : ""}
            ${pt.action ? `<div style="border-top:1px solid ${tpl.border}66;padding-top:12px;">
              <div style="font-size:13px;font-weight:700;color:${isFocal ? tpl.primary : tpl.muted};margin-bottom:4px;">▸ 重點結論</div>
              <div style="font-size:13px;line-height:1.5;color:${tpl.muted};">${escapeHtml(pt.action)}</div>
            </div>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  function layoutBento13(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const p0 = c.pts[0] || {
      num: "01",
      stat: c.hs?.value || "",
      statLabel: c.hs?.label || c.chapter,
      title: c.title,
      desc: c.summary,
      action: c.hs?.desc || ""
    };
    const rest = c.pts.slice(1);
    return `<div style="flex:1;padding:14px 56px 18px;display:grid;grid-template-columns:1fr 1.1fr;gap:22px;min-height:0;position:relative;z-index:4;">
      <div style="background:${tpl.primary};color:${onP};border-radius:${tpl.radius}px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="padding:4px 14px;border-radius:999px;background:rgba(255,255,255,0.18);font-family:${tpl.monoFont};font-size:12.5px;font-weight:700;">${escapeHtml(p0.num)} · ${escapeHtml(p0.statLabel || c.chapter)}</span>
        </div>
        <div>
          ${p0.stat ? `<div style="font-family:${tpl.titleFont};font-size:50px;font-weight:900;line-height:1.05;">${escapeHtml(p0.stat)}</div>` : ""}
          <h3 style="margin:10px 0;font-size:24px;font-weight:800;">${escapeHtml(p0.title)}</h3>
          <p style="margin:0;font-size:15.5px;line-height:1.65;opacity:0.94;">${escapeHtml(p0.desc)}</p>
        </div>
        ${p0.action ? `<div style="background:rgba(0,0,0,0.2);border-radius:${tpl.innerRadius}px;padding:14px 16px;font-size:14px;line-height:1.55;">▸ ${escapeHtml(p0.action)}</div>` : ""}
      </div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;gap:14px;min-height:0;">
        ${rest.map((pt) => `<div style="flex:1;background:${tpl.surface};border:${tpl.borderWidth} solid ${tpl.border};border-radius:${tpl.innerRadius}px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <div style="display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;align-items:center;gap:10px;">
              ${badgeHtml(pt.num, tpl, false, 28)}
              <strong style="font-size:17px;color:${tpl.primary};">${escapeHtml(pt.title)}</strong>
            </div>
            <p style="margin:0;font-size:14px;color:${tpl.fg};line-height:1.5;">${formatRich(pt.desc, tpl.primary)}</p>
            ${pt.action ? `<span style="font-size:13px;color:${tpl.muted};">▸ ${escapeHtml(pt.action)}</span>` : ""}
          </div>
          ${pt.stat ? `<div style="text-align:right;flex-shrink:0;min-width:100px;background:${tpl.tint};padding:10px 14px;border-radius:10px;">
            <div style="font-family:${tpl.titleFont};font-size:21px;font-weight:900;color:${tpl.primary};">${escapeHtml(pt.stat)}</div>
            ${pt.statLabel ? `<div style="font-size:11px;color:${tpl.muted};">${escapeHtml(pt.statLabel)}</div>` : ""}
          </div>` : ""}
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutGrid2x2Headers(c, tpl) {
    const n = c.pts.length;
    const cols = n === 3 ? 3 : adaptiveCols(n);
    return `<div style="flex:1;padding:10px 56px 16px;display:flex;flex-direction:column;gap:14px;min-height:0;position:relative;z-index:4;">
      ${c.summary ? `<div style="${cardChromeCss(tpl, "tint")}padding:11px 18px;font-size:15.5px;color:${tpl.fg};line-height:1.55;flex-shrink:0;">${formatRich(c.summary, tpl.primary)}</div>` : ""}
      <div style="flex:1;display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;min-height:0;align-items:stretch;">
        ${c.pts.map((pt, i) => {
          const isFocal = i === 0;
          const hdrBg = isFocal ? tpl.primary : tpl.tint;
          const hdrFg = isFocal ? contrastFg(tpl.primary) : tpl.fg;
          return `<div style="${n === 5 && i === 0 ? "grid-column:1 / -1;" : ""}${cardChromeCss(tpl, "card")}overflow:hidden;display:flex;flex-direction:column;">
            <div style="background:${hdrBg};color:${hdrFg};padding:12px 18px;display:flex;justify-content:space-between;align-items:center;gap:10px;">
              <strong style="font-size:18px;">${escapeHtml(pt.num)} ｜ ${escapeHtml(pt.title)}</strong>
              ${pt.statLabel ? `<span style="background:rgba(255,255,255,0.22);padding:3px 12px;border-radius:999px;font-family:${tpl.monoFont};font-size:12.5px;font-weight:800;white-space:nowrap;">${escapeHtml(pt.statLabel)}</span>` : ""}
            </div>
            <div style="padding:16px 20px;flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
              ${pt.stat ? `<div style="font-family:${tpl.titleFont};font-size:28px;font-weight:900;color:${tpl.primary};line-height:1.15;">${escapeHtml(pt.stat)}</div>` : ""}
              <p style="margin:0;font-size:16px;color:${tpl.fg};line-height:1.62;flex:1;display:flex;align-items:center;">${formatRich(pt.desc, tpl.primary)}</p>
              ${pt.action ? `<div style="font-size:14.5px;color:${tpl.primary};font-weight:700;background:${tpl.tint};padding:9px 14px;border-radius:6px;">▸ ${escapeHtml(pt.action)}</div>` : ""}
            </div>
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  function layoutTriptychGallery(c, tpl) {
    const pts = c.pts.slice(0, 4);
    const isTwo = pts.length <= 2;
    const coreText = (c.hs?.value || c.bannerPill || c.chapter).slice(0, 8);
    const vennSvg = isTwo
      ? `<svg viewBox="0 0 360 280" width="340" height="260">
          <circle cx="122" cy="140" r="96" fill="${tpl.primary}" fill-opacity="0.24" stroke="${tpl.primary}" stroke-width="2.5"/>
          <circle cx="238" cy="140" r="96" fill="${tpl.secondary}" fill-opacity="0.28" stroke="${tpl.secondary}" stroke-width="2.5"/>
          <text x="86" y="138" text-anchor="middle" fill="${tpl.fg}" font-size="14" font-weight="800">${escapeHtml((pts[0]?.title || "").slice(0, 7))}</text>
          <text x="274" y="138" text-anchor="middle" fill="${tpl.fg}" font-size="14" font-weight="800">${escapeHtml((pts[1]?.title || "").slice(0, 7))}</text>
          <text x="180" y="144" text-anchor="middle" fill="${tpl.primary}" font-size="17" font-weight="900">${escapeHtml(coreText)}</text>
        </svg>`
      : `<svg viewBox="0 0 360 300" width="340" height="280">
          <circle cx="180" cy="108" r="84" fill="${tpl.primary}" fill-opacity="0.24" stroke="${tpl.primary}" stroke-width="2.2"/>
          <circle cx="122" cy="194" r="84" fill="${tpl.secondary}" fill-opacity="0.26" stroke="${tpl.secondary}" stroke-width="2.2"/>
          <circle cx="238" cy="194" r="84" fill="${tpl.primary}" fill-opacity="0.16" stroke="${tpl.border}" stroke-width="2"/>
          <text x="180" y="74" text-anchor="middle" fill="${tpl.fg}" font-size="13.5" font-weight="800">${escapeHtml((pts[0]?.title || "").slice(0, 8))}</text>
          <text x="92" y="218" text-anchor="middle" fill="${tpl.fg}" font-size="13.5" font-weight="800">${escapeHtml((pts[1]?.title || "").slice(0, 8))}</text>
          <text x="268" y="218" text-anchor="middle" fill="${tpl.fg}" font-size="13.5" font-weight="800">${escapeHtml((pts[2]?.title || "").slice(0, 8))}</text>
          <text x="180" y="168" text-anchor="middle" fill="${tpl.primary}" font-size="16" font-weight="900">${escapeHtml(coreText)}</text>
        </svg>`;
    return `<div style="flex:1;padding:14px 56px 18px;display:grid;grid-template-columns:0.86fr 1.14fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="${cardChromeCss(tpl, "tint")}padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;">
        ${vennSvg}
        <p style="margin:0;font-size:15.5px;color:${tpl.fg};line-height:1.58;">${formatRich(c.summary, tpl.primary)}</p>
      </div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;gap:12px;min-height:0;">
        ${c.pts.map((pt, i) => `<div style="flex:1;${cardChromeCss(tpl, "card")}padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            ${badgeHtml(pt.num, tpl, i === 0, 32)}
            <div>
              <strong style="font-size:18px;color:${tpl.primary};">${escapeHtml(pt.title)}</strong>
              <p style="margin:4px 0 0;font-size:15.5px;color:${tpl.fg};line-height:1.52;">${formatRich(pt.desc, tpl.primary)}</p>
            </div>
          </div>
          ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:14.5px;font-weight:800;color:${tpl.primary};background:${tpl.tint};padding:5px 12px;border-radius:6px;white-space:nowrap;">${escapeHtml(pt.stat)}</span>` : ""}
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutBanner3Rows(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const single = c.pts.length <= 1;
    const dense = c.pts.length >= 4;
    return `<div style="flex:1;padding:16px 48px 16px;display:flex;flex-direction:column;justify-content:${single ? "center" : "space-between"};gap:${dense ? "10px" : "16px"};min-height:0;position:relative;z-index:4;">
      ${(c.bannerPill || c.summary) ? `<div style="${cardChromeCss(tpl, "tint")}padding:16px 24px;display:flex;align-items:center;gap:16px;flex-shrink:0;">
        ${c.bannerPill ? `<span style="padding:4px 16px;border-radius:${tpl.chrome === "botanical" ? "2px" : "999px"};background:${tpl.primary};color:${onP};font-size:13px;font-weight:700;white-space:nowrap;">${escapeHtml(c.bannerPill)}</span>` : ""}
        ${c.summary ? `<span style="font-size:17px;color:${tpl.fg};line-height:1.5;font-weight:500;">${formatRich(c.summary, tpl.primary)}</span>` : ""}
      </div>` : ""}
      <div style="flex:${single ? "0 0 auto" : "1"};display:flex;flex-direction:column;justify-content:space-between;gap:${dense ? "10px" : "16px"};min-height:0;">
        ${c.pts.map((pt, i) => {
          const isFocal = i === 0;
          const cols = pt.desc ? `240px 1fr${pt.stat ? " 160px" : ""}` : `1fr${pt.stat ? " 160px" : ""}`;
          return `<div style="flex:${single ? "0 0 auto" : "1"};min-height:0;overflow:hidden;${cardChromeCss(tpl, "card")}padding:${single ? "28px 32px" : (dense ? "10px 24px" : "16px 24px")};display:grid;grid-template-columns:${cols};gap:24px;align-items:center;">
            <div style="display:flex;align-items:center;gap:12px;${pt.desc ? `border-right:1px solid ${tpl.border}66;padding-right:16px;` : ""}height:100%;min-height:0;">
              ${badgeHtml(pt.num, tpl, isFocal, 32)}
              <div style="display:flex;flex-direction:column;gap:4px;min-width:0;">
                <strong style="font-size:21px;font-weight:700;color:${isFocal ? tpl.primary : tpl.fg};line-height:1.25;">${escapeHtml(pt.title)}</strong>
                ${pt.statLabel ? `<span style="font-size:13px;color:${tpl.muted};font-weight:500;">${escapeHtml(pt.statLabel)}</span>` : ""}
                ${!pt.desc && pt.action ? `<div style="font-size:13px;color:${tpl.muted};font-weight:600;">▸ ${escapeHtml(pt.action)}</div>` : ""}
              </div>
            </div>
            ${pt.desc ? `<div style="display:flex;flex-direction:column;justify-content:center;gap:6px;min-height:0;">
              <div style="font-size:17px;color:${tpl.fg};line-height:1.55;font-weight:400;">${formatRich(pt.desc, tpl.primary)}</div>
              ${pt.action ? `<div style="font-size:13px;color:${tpl.muted};font-weight:600;">▸ ${escapeHtml(pt.action)}</div>` : ""}
            </div>` : ""}
            ${pt.stat ? `<div style="text-align:right;border-left:1px solid ${tpl.border}66;padding-left:16px;">
              <span style="font-family:${tpl.titleFont};font-size:21px;font-weight:800;color:${isFocal ? tpl.primary : tpl.fg};">${escapeHtml(pt.stat)}</span>
            </div>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  function layoutLeftThesisRightList(c, tpl) {
    const onP = contrastFg(tpl.primary);
    return `<div style="flex:1;padding:16px 48px 16px;display:grid;grid-template-columns:0.8fr 1.2fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="background:${tpl.primary};color:${onP};border-radius:${tpl.radius}px;padding:32px;display:flex;flex-direction:column;justify-content:space-between;">
        ${c.kicker ? `<span style="font-family:${tpl.monoFont};font-size:13px;opacity:0.86;">${escapeHtml(c.kicker)}</span>` : "<span></span>"}
        ${c.hs ? `<div>
          <div style="font-family:${tpl.titleFont};font-size:52px;font-weight:800;line-height:1.05;">${escapeHtml(c.hs.value)}</div>
          ${c.hs.label ? `<div style="font-size:21px;font-weight:700;margin-top:8px;">${escapeHtml(c.hs.label)}</div>` : ""}
          ${c.hs.desc ? `<p style="margin:8px 0 0;font-size:17px;line-height:1.55;opacity:0.92;">${escapeHtml(c.hs.desc)}</p>` : ""}
        </div>` : ""}
        ${c.summary ? `<div style="border-top:1px solid ${onP}33;padding-top:16px;font-size:17px;line-height:1.6;opacity:0.95;">${escapeHtml(c.summary).replace(/\*\*/g, "")}</div>` : "<div></div>"}
      </div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;gap:${c.pts.length >= 4 ? "8px" : "16px"};min-height:0;">
        ${c.pts.map((pt, idx) => `<div style="flex:1;min-height:0;${cardChromeCss(tpl, "card")}padding:${c.pts.length >= 4 ? "8px 16px" : "16px 24px"};display:flex;justify-content:space-between;align-items:center;gap:16px;">
          <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:0;">
            ${badgeHtml(pt.num, tpl, idx === 0, c.pts.length >= 4 ? 28 : 32)}
            <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
              <strong style="font-size:${c.pts.length >= 4 ? "18px" : "21px"};font-weight:700;color:${idx === 0 ? tpl.primary : tpl.fg};">${escapeHtml(pt.title)}</strong>
              ${pt.desc ? `<p style="margin:0;font-size:${c.pts.length >= 4 ? "14px" : "17px"};color:${tpl.fg};line-height:1.4;">${formatRich(pt.desc, tpl.primary)}</p>` : ""}
              ${pt.action ? `<span style="color:${tpl.muted};font-size:13px;font-weight:600;line-height:1.3;">▸ ${escapeHtml(pt.action)}</span>` : ""}
            </div>
          </div>
          ${pt.stat ? `<span style="font-family:${tpl.titleFont};font-size:${c.pts.length >= 4 ? "17px" : "21px"};font-weight:800;color:${idx === 0 ? tpl.primary : tpl.fg};border-left:2px solid ${idx === 0 ? tpl.primary : tpl.border};padding-left:16px;white-space:nowrap;">${escapeHtml(pt.stat)}</span>` : ""}
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutHeaderCardsScale(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const scaleArr = c.scaleNodes || c.pts.map((pt) => ({ n: pt.num, label: pt.title }));
    return `<div style="flex:1;padding:12px 56px 16px;display:grid;grid-template-columns:1fr 1fr;gap:28px;min-height:0;position:relative;z-index:4;">
      <div style="background:${tpl.surface};border:${tpl.borderWidth} solid ${tpl.border};border-radius:${tpl.radius}px;overflow:hidden;display:flex;flex-direction:column;">
        <div style="background:${tpl.primary};color:${onP};padding:13px 20px;text-align:center;font-size:18px;font-weight:700;">${escapeHtml(c.chapter)} · 結構化架構清單</div>
        <div style="padding:18px 22px;flex:1;display:flex;flex-direction:column;justify-content:space-between;">
          ${c.pts.map((pt, i) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;${i < c.pts.length - 1 ? `border-bottom:1px dashed ${tpl.border}88;padding-bottom:10px;` : ""}">
            <div style="display:flex;align-items:flex-start;gap:12px;">
              ${badgeHtml(pt.num, tpl, false, 28)}
              <div>
                <div style="font-size:16.5px;font-weight:800;color:${tpl.primary};">${escapeHtml(pt.title)}</div>
                <div style="font-size:13.5px;color:${tpl.muted};margin-top:2px;">${escapeHtml(pt.desc)}</div>
              </div>
            </div>
            ${pt.stat ? `<span style="padding:4px 12px;border-radius:999px;background:${tpl.tint};color:${tpl.primary};font-family:${tpl.monoFont};font-size:12.5px;font-weight:700;white-space:nowrap;">${escapeHtml(pt.stat)}</span>` : ""}
          </div>`).join("")}
        </div>
      </div>

      <div style="background:${tpl.surface};border:${tpl.borderWidth} solid ${tpl.border};border-radius:${tpl.radius}px;overflow:hidden;display:flex;flex-direction:column;">
        <div style="background:${tpl.primary};color:${onP};padding:13px 20px;text-align:center;font-size:18px;font-weight:700;">評估尺度與核心判準</div>
        <div style="padding:20px 24px;flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
          <div style="position:relative;padding-top:6px;">
            <div style="position:absolute;left:10%;right:10%;top:26px;height:2.5px;background:${tpl.secondary};"></div>
            <div style="display:grid;grid-template-columns:repeat(${scaleArr.length},1fr);gap:6px;position:relative;z-index:2;text-align:center;">
              ${scaleArr.map((s, idx) => {
                const isLast = idx === scaleArr.length - 1;
                return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
                  <span style="width:40px;height:40px;border-radius:${tpl.chrome === "industrial" ? "0px" : "50%"};background:${isLast ? tpl.primary : tpl.surface};color:${isLast ? onP : tpl.primary};border:2px solid ${tpl.primary};display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;">${escapeHtml(s.n)}</span>
                  <span style="font-size:12.5px;color:${tpl.muted};line-height:1.25;">${escapeHtml(s.label)}</span>
                </div>`;
              }).join("")}
            </div>
          </div>
          <div style="background:${tpl.tint};border:1px solid ${tpl.border};border-radius:${tpl.innerRadius}px;padding:16px 18px;flex:1;display:flex;flex-direction:column;justify-content:center;gap:8px;">
            <div style="font-size:15.5px;font-weight:800;color:${tpl.primary};">▸ 核心摘要與判斷基準</div>
            <div style="font-size:14.5px;color:${tpl.fg};line-height:1.58;">${formatRich(c.summary, tpl.primary)}</div>
            ${c.pts.filter((p) => p.action).slice(0, 2).map((pt) => `<div style="font-size:13px;color:${tpl.muted};">· <strong>${escapeHtml(pt.title)}</strong>：${escapeHtml(pt.action)}</div>`).join("")}
          </div>
        </div>
      </div>
    </div>`;
  }

  function layoutSteppedBars4(c, tpl) {
    const n = c.pts.length;
    return `<div style="flex:1;padding:12px 56px 16px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;min-height:0;position:relative;z-index:4;">
      ${c.pts.map((pt, i) => {
        const w = Math.round(74 + ((i + 1) / Math.max(1, n)) * 26);
        return `<div style="width:${w}%;flex:1;${cardChromeCss(tpl, "card")}border-left:6px solid ${i === n - 1 ? tpl.primary : tpl.secondary};padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:18px;">
          <div style="display:flex;align-items:center;gap:16px;">
            ${badgeHtml(pt.num, tpl, i === n - 1, 36)}
            <div>
              <div style="font-size:19.5px;font-weight:800;color:${tpl.primary};">${escapeHtml(pt.title)}${pt.action ? ` <span style="font-weight:600;font-size:14.5px;color:${tpl.muted};">— ${escapeHtml(pt.action)}</span>` : ""}</div>
              <div style="font-size:16px;color:${tpl.fg};margin-top:4px;line-height:1.45;">${formatRich(pt.desc, tpl.primary)}</div>
            </div>
          </div>
          ${pt.stat ? `<span style="font-family:${tpl.titleFont};font-size:24px;font-weight:900;color:${tpl.primary};white-space:nowrap;">${escapeHtml(pt.stat)}</span>` : ""}
        </div>`;
      }).join("")}
    </div>`;
  }

  function layoutBannerDashedSplit(c, tpl) {
    return `<div style="flex:1;padding:12px 56px 16px;display:grid;grid-template-columns:0.86fr 1.14fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="${cardChromeCss(tpl, "tint")}padding:24px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
        <svg viewBox="0 0 360 210" width="100%" height="205" style="flex-shrink:0;">
          <circle cx="150" cy="105" r="82" fill="${tpl.primary}" fill-opacity="0.1" stroke="${tpl.primary}" stroke-width="1.5" stroke-dasharray="5 4"/>
          <circle cx="150" cy="105" r="50" fill="${tpl.primary}" fill-opacity="0.18" stroke="${tpl.primary}" stroke-width="2"/>
          <line x1="232" y1="70" x2="355" y2="70" stroke="${tpl.primary}" stroke-width="1.5" stroke-dasharray="4 3"/>
          <circle cx="232" cy="70" r="6" fill="${tpl.primary}"/>
          <line x1="232" y1="140" x2="355" y2="140" stroke="${tpl.secondary}" stroke-width="1.5" stroke-dasharray="4 3"/>
          <circle cx="232" cy="140" r="6" fill="${tpl.secondary}"/>
          <text x="150" y="112" text-anchor="middle" fill="${tpl.primary}" font-size="22" font-weight="900">${escapeHtml(String(c.hs?.value || c.chapter).slice(0, 7))}</text>
        </svg>
        <div style="border-top:1.5px solid ${tpl.border};padding-top:14px;">
          <div style="font-family:${tpl.titleFont};font-size:32px;font-weight:900;color:${tpl.primary};line-height:1.15;">${escapeHtml(c.hs ? c.hs.value : c.bannerPill)}</div>
          <p style="margin:8px 0 0;font-size:16.5px;color:${tpl.fg};line-height:1.6;">${formatRich(c.summary, tpl.primary)}</p>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;gap:12px;min-height:0;">
        ${c.pts.map((pt, i) => `<div style="flex:1;${cardChromeCss(tpl, "card")}padding:14px 20px;display:flex;flex-direction:column;justify-content:center;gap:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:19px;color:${tpl.primary};">${escapeHtml(pt.num)} · ${escapeHtml(pt.title)}</strong>
            ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:15px;font-weight:800;color:${tpl.secondary};background:${tpl.tint};padding:4px 12px;border-radius:6px;">${escapeHtml(pt.stat)}</span>` : ""}
          </div>
          <p style="margin:0;font-size:16px;color:${tpl.fg};line-height:1.56;">${formatRich(pt.desc, tpl.primary)}</p>
          ${pt.action ? `<div style="font-size:14.5px;color:${tpl.primary};font-weight:700;">▸ ${escapeHtml(pt.action)}</div>` : ""}
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutSnakeFlow8(c, tpl) {
    // If slide has 8 items -> 4 top (left-to-right) + 4 bottom (right-to-left) U-turn
    // If slide has <=4 items -> top row shows Problem/Phase (title + stat), bottom row shows Action/Details in matching order WITHOUT repeating the same stat badges!
    const isFull8 = c.pts.length >= 6;
    const topPts = isFull8 ? c.pts.slice(0, 4) : c.pts;
    const botPts = isFull8 ? c.pts.slice(4, 8).slice().reverse() : c.pts.slice().reverse();
    const n = topPts.length;
    const stepW = 1152 / Math.max(1, n);
    const xFirst = stepW / 2;
    const xLast = 1152 - stepW / 2;

    return `<div style="flex:1;padding:14px 64px 16px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:4;min-height:0;">
      <div style="position:relative;height:400px;">
        <svg viewBox="0 0 1152 400" width="100%" height="100%" style="position:absolute;inset:0;pointer-events:none;z-index:1;">
          <line x1="${xFirst}" y1="115" x2="${xLast}" y2="115" stroke="${tpl.primary}" stroke-width="2.5"/>
          <line x1="${xFirst}" y1="265" x2="${xLast}" y2="265" stroke="${tpl.secondary}" stroke-width="2.5"/>
          <path d="M${xLast},115 C${xLast + 85},115 ${xLast + 85},265 ${xLast},265" fill="none" stroke="${tpl.secondary}" stroke-width="2.5" stroke-dasharray="6 5"/>
          ${topPts.map((_, i) => `<line x1="${xFirst + i * stepW}" y1="72" x2="${xFirst + i * stepW}" y2="115" stroke="${tpl.primary}" stroke-width="1.5"/>`).join("")}
          ${botPts.map((_, i) => `<line x1="${xFirst + i * stepW}" y1="265" x2="${xFirst + i * stepW}" y2="302" stroke="${tpl.secondary}" stroke-width="1.5"/>`).join("")}
        </svg>
        <div style="position:relative;z-index:2;display:grid;grid-template-columns:repeat(${n},1fr);gap:14px;text-align:center;">
          ${topPts.map((pt) => `<div style="display:flex;flex-direction:column;align-items:center;">
            <div style="height:72px;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:8px;">
              <div style="font-size:16.5px;font-weight:800;color:${tpl.primary};">${escapeHtml(pt.title)}</div>
              ${pt.stat ? `<div style="font-family:${tpl.monoFont};font-size:12.5px;color:${tpl.muted};margin-top:2px;">${escapeHtml(pt.stat)}</div>` : ""}
            </div>
            <div style="margin-top:18px;">${badgeHtml(pt.num, tpl, true, 50)}</div>
          </div>`).join("")}
        </div>
        <div style="position:relative;z-index:2;display:grid;grid-template-columns:repeat(${n},1fr);gap:14px;text-align:center;margin-top:100px;">
          ${botPts.map((pt) => `<div style="display:flex;flex-direction:column;align-items:center;">
            <div>${badgeHtml(isFull8 ? pt.num : `對策${pt.num}`, tpl, false, 50)}</div>
            <div style="margin-top:14px;">
              ${isFull8 ? `<div style="font-size:16.5px;font-weight:800;color:${tpl.fg};">${escapeHtml(pt.title)}</div>` : ""}
              <div style="font-size:13.5px;color:${tpl.fg};line-height:1.45;margin-top:3px;">${escapeHtml(isFull8 ? pt.desc : (pt.action || pt.desc))}</div>
            </div>
          </div>`).join("")}
        </div>
      </div>
    </div>`;
  }

  function layoutModelHypotheses(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const nodes = c.modelNodes || c.pts.map((p) => ({ title: p.title, code: p.stat }));
    return `<div style="flex:1;padding:12px 56px 16px;display:flex;flex-direction:column;justify-content:space-between;gap:18px;min-height:0;position:relative;z-index:4;">
      <div style="background:${tpl.surface};border:${tpl.borderWidth} solid ${tpl.border};border-radius:${tpl.radius}px;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-shrink:0;">
        ${nodes.map((nd, i) => `
          <div style="flex:1;background:${tpl.primary};color:${onP};border-radius:${tpl.innerRadius}px;padding:16px 12px;text-align:center;">
            <div style="font-size:17px;font-weight:800;">${escapeHtml(nd.title)}</div>
            ${nd.code ? `<div style="font-family:${tpl.monoFont};font-size:13px;opacity:0.86;margin-top:3px;">${escapeHtml(nd.code)}</div>` : ""}
          </div>
          ${i < nodes.length - 1 ? `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;min-width:58px;">
            ${nd.edge ? badgeHtml(nd.edge, tpl, false, 26) : ""}
            <div style="width:100%;display:flex;align-items:center;">
              <div style="flex:1;height:2.5px;background:${tpl.primary};"></div>
              <span style="color:${tpl.primary};font-size:14px;font-weight:900;">▶</span>
            </div>
          </div>` : ""}
        `).join("")}
      </div>
      <div style="display:grid;grid-template-columns:repeat(${c.pts.length},1fr);gap:18px;flex:1;min-height:0;">
        ${c.pts.map((pt, i) => {
          const isPeak = i === c.pts.length - 1;
          return `<div style="background:${isPeak ? tpl.tint : tpl.surface};border:${isPeak ? "2px" : tpl.borderWidth} solid ${isPeak ? tpl.primary : tpl.border};border-radius:${tpl.innerRadius}px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:10px;border-bottom:1px dashed ${tpl.border};">
                <span style="padding:4px 12px;border-radius:999px;background:${tpl.primary};color:${onP};font-family:${tpl.monoFont};font-size:12.5px;font-weight:700;">${escapeHtml(pt.num)}</span>
                ${pt.statLabel ? `<span style="font-family:${tpl.monoFont};font-size:13.5px;font-weight:700;color:${tpl.secondary};">${escapeHtml(pt.statLabel)}</span>` : ""}
              </div>
              <h4 style="margin:10px 0 0;font-size:17px;font-weight:800;color:${tpl.primary};line-height:1.3;">${escapeHtml(pt.title)}</h4>
              <p style="margin:8px 0 0;font-size:14.5px;line-height:1.6;color:${tpl.fg};">${formatRich(pt.desc, tpl.primary)}</p>
            </div>
            ${(pt.stat || pt.action) ? `<div style="padding:8px 12px;border-radius:8px;background:${isPeak ? tpl.primary : tpl.bg};color:${isPeak ? onP : tpl.primary};font-family:${tpl.monoFont};font-size:13px;font-weight:700;text-align:center;">${escapeHtml(pt.stat)}${pt.action ? ` · ${escapeHtml(pt.action)}` : ""}</div>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  function layoutHorizontalTimeline(c, tpl) {
    const n = c.pts.length;
    return `<div style="flex:1;padding:24px 48px;position:relative;display:grid;grid-template-columns:repeat(${n},1fr);gap:16px;align-items:center;min-height:0;z-index:4;">
      <div style="position:absolute;left:6%;right:6%;top:50%;height:2px;background:${tpl.border};"></div>
      ${c.pts.map((pt, i) => {
        const isTop = i % 2 === 0;
        const isFocal = i === 0;
        return `<div style="height:100%;position:relative;z-index:2;">
          <div style="position:absolute;left:0;right:0;${isTop ? "bottom:calc(50% + 28px);" : "top:calc(50% + 28px);"}${cardChromeCss(tpl, "card")}padding:14px 16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <strong style="font-size:17px;font-weight:700;color:${isFocal ? tpl.primary : tpl.fg};">${escapeHtml(pt.title)}</strong>
              ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${isFocal ? tpl.primary : tpl.muted};">${escapeHtml(pt.stat)}</span>` : ""}
            </div>
            ${pt.desc ? `<p style="margin:6px 0 0;font-size:13px;color:${tpl.fg};line-height:1.45;">${formatRich(pt.desc, tpl.primary)}</p>` : ""}
            ${pt.action ? `<div style="margin-top:6px;font-size:13px;color:${tpl.muted};font-weight:600;">▸ ${escapeHtml(pt.action)}</div>` : ""}
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);">${badgeHtml(pt.num, tpl, isFocal, 32)}</div>
        </div>`;
      }).join("")}
    </div>`;
  }

  function layoutHubSpoke4(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const pts = c.pts.slice(0, 4);
    const positions = [[1, 1], [3, 1], [1, 2], [3, 2]];
    return `<div style="flex:1;padding:14px 56px 18px;display:grid;grid-template-columns:1fr 0.72fr 1fr;grid-template-rows:1fr 1fr;gap:16px;min-height:0;position:relative;z-index:4;">
      ${pts.map((pt, i) => {
        const [col, row] = positions[i];
        return `<div style="grid-column:${col};grid-row:${row};background:${tpl.surface};border:${tpl.borderWidth} solid ${tpl.border};border-radius:${tpl.innerRadius}px;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:16px;color:${tpl.primary};">${escapeHtml(pt.num)} · ${escapeHtml(pt.title)}</strong>
            ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:14px;font-weight:800;color:${tpl.secondary};">${escapeHtml(pt.stat)}</span>` : ""}
          </div>
          <p style="margin:6px 0;font-size:14px;color:${tpl.fg};line-height:1.52;">${formatRich(pt.desc, tpl.primary)}</p>
          ${pt.action ? `<div style="background:${tpl.tint};padding:7px 12px;border-radius:8px;font-size:12.5px;color:${tpl.primary};font-weight:700;">▸ ${escapeHtml(pt.action)}</div>` : ""}
        </div>`;
      }).join("")}
      <div style="grid-column:2;grid-row:1 / span 2;display:flex;align-items:center;justify-content:center;">
        <div style="width:100%;aspect-ratio:1/1;max-height:310px;border-radius:${tpl.chrome === "industrial" ? "0px" : "50%"};background:${tpl.primary};color:${onP};padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;box-shadow:0 14px 34px rgba(0,0,0,0.12);">
          <div style="font-family:${tpl.titleFont};font-size:40px;font-weight:900;line-height:1;">${escapeHtml(c.hs ? c.hs.value : c.chapter)}</div>
          ${c.hs?.label ? `<div style="font-size:15px;font-weight:700;">${escapeHtml(c.hs.label)}</div>` : ""}
          <div style="font-size:12.5px;opacity:0.92;line-height:1.48;">${escapeHtml(c.summary).replace(/\*\*/g, "").slice(0, 52)}</div>
        </div>
      </div>
    </div>`;
  }

  function layoutChevronPipeline(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const onS = contrastFg(tpl.secondary);
    const n = c.pts.length;
    return `<div style="flex:1;padding:10px 56px 16px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;min-height:0;position:relative;z-index:4;">
      ${c.summary ? `<div style="${cardChromeCss(tpl, "tint")}padding:11px 18px;font-size:16px;color:${tpl.fg};line-height:1.55;flex-shrink:0;">${formatRich(c.summary, tpl.primary)}</div>` : ""}
      <div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:12px;flex-shrink:0;">
        ${c.pts.map((pt, i) => {
          const bg = i === n - 1 ? tpl.primary : tpl.secondary;
          const fg = i === n - 1 ? onP : onS;
          return `<div style="background:${bg};color:${fg};padding:14px 16px;border-radius:${tpl.innerRadius}px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:800;font-size:18px;">${escapeHtml(pt.num)} ${escapeHtml(pt.title)}</span>
            ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:14.5px;font-weight:800;">${escapeHtml(pt.stat)}</span>` : ""}
          </div>`;
        }).join("")}
      </div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(${n},1fr);gap:14px;min-height:0;">
        ${c.pts.map((pt) => `<div style="${cardChromeCss(tpl, "card")}padding:18px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
          <div>
            ${pt.statLabel ? `<div style="font-size:13.5px;color:${tpl.muted};font-weight:700;">${escapeHtml(pt.statLabel)}</div>` : ""}
            ${pt.stat ? `<div style="font-family:${tpl.titleFont};font-size:26px;font-weight:900;color:${tpl.primary};margin-top:6px;">${escapeHtml(pt.stat)}</div>` : ""}
            <p style="margin:10px 0 0;font-size:16.5px;color:${tpl.fg};line-height:1.6;">${formatRich(pt.desc, tpl.primary)}</p>
          </div>
          ${pt.action ? `<div style="background:${tpl.tint};border-radius:8px;padding:10px 12px;font-size:14.5px;color:${tpl.primary};font-weight:700;">▸ ${escapeHtml(pt.action)}</div>` : ""}
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutBarsInsightSplit(c, tpl) {
    const rightBg = tpl.primary;
    const onRight = contrastFg(rightBg);
    const heroVal = c.hs ? c.hs.value : (c.pts[0]?.stat || "");
    const heroLabel = c.hs ? c.hs.label : (c.pts[0]?.title || "");
    const heroDesc = c.summary || c.hs?.desc || "";
    return `<div style="flex:1;padding:16px 48px 16px;display:grid;grid-template-columns:1.44fr 1fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="${cardChromeCss(tpl, "card")}padding:24px 32px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
        ${c.pts.map((pt, i) => {
          const isFocal = i === 0;
          const w = extractPct(pt.stat, i, 25);
          return `<div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;">
              <span style="font-size:17px;font-weight:${isFocal ? "700" : "500"};color:${isFocal ? tpl.fg : tpl.muted};">${i + 1}. ${escapeHtml(pt.title)}</span>
              ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:17px;font-weight:700;color:${isFocal ? tpl.primary : tpl.fg};white-space:nowrap;">${escapeHtml(pt.stat)}</span>` : ""}
            </div>
            ${w !== null ? `<div style="width:100%;height:12px;background:${tpl.tint};border-radius:${tpl.chrome === "botanical" ? "2px" : "999px"};overflow:hidden;">
              <div style="width:${w}%;height:100%;background:${isFocal ? tpl.primary : tpl.muted};border-radius:${tpl.chrome === "botanical" ? "2px" : "999px"};"></div>
            </div>` : `<div style="height:1px;background:${tpl.border}55;"></div>`}
          </div>`;
        }).join("")}
      </div>
      <div style="background:${rightBg};color:${onRight};border-radius:${tpl.radius}px;padding:32px;display:flex;flex-direction:column;justify-content:center;gap:16px;">
        ${c.kicker ? `<span style="font-family:${tpl.monoFont};font-size:13px;font-weight:700;opacity:0.86;">${escapeHtml(c.kicker)}</span>` : ""}
        ${heroVal ? `<div style="font-family:${tpl.titleFont};font-size:52px;font-weight:800;line-height:1.05;">${escapeHtml(heroVal)}</div>` : ""}
        ${heroLabel ? `<div style="font-size:21px;font-weight:700;">${escapeHtml(heroLabel)}</div>` : ""}
        ${heroDesc ? `<div style="height:1px;background:${onRight}33;"></div>
        <p style="margin:0;font-size:17px;line-height:1.6;opacity:0.94;">${escapeHtml(heroDesc).replace(/\*\*/g, "")}</p>` : ""}
      </div>
    </div>`;
  }

  function layoutMatrixTableSplit(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const mt = c.matrixTable;
    const headers = mt ? mt.headers : ["#", "構面項目", "關鍵指標", "要點說明"];
    const colGrid = `repeat(${headers.length}, 1fr)`;
    const rows = mt ? mt.rows : c.pts.map((pt) => [pt.num, pt.title, pt.stat, pt.desc]);
    const threshTitle = mt ? mt.thresholdTitle : (c.hs?.label || "");
    const threshStat = mt ? mt.thresholdStat : (c.hs?.value || "");
    const threshNote = mt ? mt.thresholdNote : (c.hs?.desc || "");
    const concTitle = mt ? mt.conclusionTitle : (c.summary ? "核心結論" : "");
    const concBody = mt ? mt.conclusionBody : c.summary;

    return `<div style="flex:1;padding:16px 48px 16px;display:grid;grid-template-columns:1.42fr 1fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="${cardChromeCss(tpl, "card")}padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="display:grid;grid-template-columns:${mt ? colGrid : "0.35fr 1fr 0.7fr 1.35fr"};border-bottom:2px solid ${tpl.primary};padding:8px 8px 12px;font-size:13px;font-weight:700;color:${tpl.primary};text-align:${mt ? "center" : "left"};">
          ${headers.map((h) => `<span>${escapeHtml(h)}</span>`).join("")}
        </div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-around;">
          ${rows.map((row, r) => `<div style="display:grid;grid-template-columns:${mt ? colGrid : "0.35fr 1fr 0.7fr 1.35fr"};align-items:center;text-align:${mt ? "center" : "left"};padding:12px 8px;${r < rows.length - 1 ? `border-bottom:1px solid ${tpl.border}55;` : ""}gap:8px;">
            ${row.map((cell, cIdx) => {
              const isHi = mt ? (r === mt.highlightRow && cIdx === mt.highlightCol) : (cIdx === 2 && r === 0);
              return `<span style="font-size:${cIdx <= 1 || isHi ? "17px" : "13px"};font-weight:${isHi ? "800" : (cIdx <= 1 ? "700" : "400")};color:${isHi ? tpl.primary : tpl.fg};">${escapeHtml(cell)}</span>`;
            }).join("")}
          </div>`).join("")}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:24px;">
        ${(threshTitle || threshStat || threshNote) ? `<div style="${cardChromeCss(tpl, "card")}padding:24px;flex:0.9;display:flex;flex-direction:column;justify-content:center;gap:8px;">
          ${threshTitle ? `<div style="font-size:13px;font-weight:700;color:${tpl.muted};">${escapeHtml(threshTitle)}</div>` : ""}
          ${threshStat ? `<div style="font-family:${tpl.titleFont};font-size:32px;font-weight:800;color:${tpl.fg};line-height:1.1;">${escapeHtml(threshStat)}</div>` : ""}
          ${threshNote ? `<div style="font-size:17px;color:${tpl.muted};line-height:1.5;">${formatRich(threshNote, tpl.primary)}</div>` : ""}
        </div>` : ""}
        ${(concTitle || concBody) ? `<div style="background:${tpl.primary};color:${onP};border-radius:${tpl.radius}px;padding:24px;flex:1.1;display:flex;flex-direction:column;justify-content:center;gap:12px;">
          ${concTitle ? `<div style="font-size:21px;font-weight:700;">${escapeHtml(concTitle)}</div>` : ""}
          ${concBody ? `<p style="margin:0;font-size:17px;line-height:1.6;opacity:0.94;">${escapeHtml(concBody).replace(/\*\*/g, "")}</p>` : ""}
        </div>` : ""}
      </div>
    </div>`;
  }

  function layoutMonolithStatSplit(c, tpl) {
    const n = c.pts.length;
    const cols = n <= 3 ? 1 : 2;
    return `<div style="flex:1;padding:14px 56px 18px;display:grid;grid-template-columns:0.84fr 1.16fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="${cardChromeCss(tpl, "tint")}padding:28px;display:flex;flex-direction:column;justify-content:center;gap:14px;">
        <span style="font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${tpl.secondary};">${escapeHtml(c.kicker)}</span>
        <div style="font-family:${tpl.titleFont};font-size:66px;font-weight:900;color:${tpl.primary};line-height:1;">${escapeHtml(c.hs ? c.hs.value : c.pts[0]?.stat || "")}</div>
        <div style="font-size:22px;font-weight:800;color:${tpl.fg};">${escapeHtml(c.hs ? c.hs.label : c.pts[0]?.title || "")}</div>
        <div style="height:2px;width:56px;background:${tpl.primary};"></div>
        <p style="margin:0;font-size:16px;color:${tpl.fg};line-height:1.65;">${formatRich(c.summary, tpl.primary)}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:14px;min-height:0;align-items:stretch;">
        ${c.pts.map((pt, i) => `<div style="${n === 5 && i === 0 ? "grid-column:1 / -1;" : ""}${cardChromeCss(tpl, "card")}padding:16px 18px;display:flex;flex-direction:column;justify-content:center;gap:8px;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <strong style="font-size:18px;color:${tpl.fg};">${escapeHtml(pt.title)}</strong>
            ${pt.stat ? `<span style="font-family:${tpl.titleFont};font-size:24px;font-weight:900;color:${tpl.primary};">${escapeHtml(pt.stat)}</span>` : ""}
          </div>
          <p style="margin:0;font-size:15.5px;color:${tpl.muted};line-height:1.58;">${formatRich(pt.desc, tpl.primary)}</p>
          ${pt.action ? `<div style="font-size:14px;color:${tpl.primary};font-weight:700;">▸ ${escapeHtml(pt.action)}</div>` : ""}
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutVerticalColumnsSplit(c, tpl) {
    const n = c.pts.length;
    return `<div style="flex:1;padding:14px 56px 18px;display:grid;grid-template-columns:0.94fr 1.06fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="background:${tpl.surface};border:${tpl.borderWidth} solid ${tpl.border};border-radius:${tpl.radius}px;padding:22px;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="font-size:16px;color:${tpl.primary};">${escapeHtml(c.hs ? c.hs.label : c.chapter)}</strong>
          ${c.hs?.value ? `<span style="font-family:${tpl.titleFont};font-size:24px;font-weight:900;color:${tpl.primary};">${escapeHtml(c.hs.value)}</span>` : ""}
        </div>
        <div style="flex:1;display:grid;grid-template-columns:repeat(${n},1fr);gap:14px;align-items:end;padding:20px 8px 8px;border-bottom:1.5px solid ${tpl.border};">
          ${c.pts.map((pt, i) => {
            const h = extractPct(pt.stat, i, 100);
            return `<div style="height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:8px;">
              ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${i === 0 ? tpl.primary : tpl.fg};text-align:center;">${escapeHtml(pt.stat)}</span>` : ""}
              ${h !== null ? `<div style="width:100%;max-width:64px;height:${h}%;background:${i === 0 ? tpl.primary : tpl.muted};border-radius:${tpl.chrome === "botanical" ? "2px" : "6px 6px 0 0"};"></div>` : ""}
            </div>`;
          }).join("")}
        </div>
        <div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:8px;text-align:center;padding-top:10px;">
          ${c.pts.map((pt) => `<span style="font-size:12.5px;font-weight:700;color:${tpl.fg};">${escapeHtml(pt.title)}</span>`).join("")}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;gap:12px;min-height:0;">
        ${c.pts.map((pt, i) => `<div style="flex:1;background:${tpl.surface};border:${tpl.borderWidth} solid ${tpl.border};border-radius:${tpl.innerRadius}px;padding:12px 16px;display:flex;align-items:center;gap:14px;">
          ${badgeHtml(pt.num, tpl, i === 0, 30)}
          <div>
            <div style="font-size:15.5px;font-weight:800;color:${tpl.primary};">${escapeHtml(pt.title)} ${pt.stat ? `<span style="font-weight:600;color:${tpl.secondary};">(${escapeHtml(pt.stat)})</span>` : ""}</div>
            <div style="font-size:13.5px;color:${tpl.fg};line-height:1.45;margin-top:2px;">${formatRich(pt.desc, tpl.primary)}${pt.action ? ` · <span style="color:${tpl.muted};">${escapeHtml(pt.action)}</span>` : ""}</div>
          </div>
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutDonutKpiCards(c, tpl) {
    const pct = extractPct(c.hs?.value || "", 0, 100);
    const outerCirc = Math.round(2 * Math.PI * 62);
    const outerDash = pct !== null ? Math.round((pct / 100) * outerCirc) : 0;
    const innerCirc = Math.round(2 * Math.PI * 44);
    const innerDash = pct !== null ? Math.round(((Math.max(40, pct - 14)) / 100) * innerCirc) : 0;
    const n = c.pts.length;
    const cols = n <= 3 ? 1 : 2;
    const onP = contrastFg(tpl.primary);
    return `<div style="flex:1;padding:16px 48px 16px;display:grid;grid-template-columns:0.84fr 1.16fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="${cardChromeCss(tpl, "tint")}padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:16px;">
        ${pct !== null ? `<svg viewBox="0 0 176 176" width="176" height="176">
          <circle cx="88" cy="88" r="62" fill="none" stroke="${tpl.border}" stroke-opacity="0.32" stroke-width="12"/>
          <circle cx="88" cy="88" r="62" fill="none" stroke="${tpl.primary}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${outerDash} ${outerCirc}" transform="rotate(-90 88 88)"/>
          <circle cx="88" cy="88" r="44" fill="none" stroke="${tpl.border}" stroke-opacity="0.24" stroke-width="8"/>
          <circle cx="88" cy="88" r="44" fill="none" stroke="${tpl.muted}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${innerDash} ${innerCirc}" transform="rotate(-90 88 88)"/>
          <text x="88" y="96" text-anchor="middle" fill="${tpl.primary}" font-size="22" font-weight="800">${escapeHtml((c.hs?.value || "").slice(0, 7))}</text>
        </svg>` : (c.hs?.value ? `<div style="font-family:${tpl.titleFont};font-size:52px;font-weight:800;color:${tpl.primary};line-height:1;">${escapeHtml(c.hs.value)}</div>` : "")}
        ${(c.hs?.label || c.chapter) ? `<div style="font-size:21px;font-weight:700;color:${tpl.fg};">${escapeHtml(c.hs ? c.hs.label : c.chapter)}</div>` : ""}
        ${c.summary ? `<p style="margin:0;font-size:17px;color:${tpl.fg};line-height:1.55;">${formatRich(c.summary, tpl.primary)}</p>` : ""}
        ${c.bannerPill ? `<span style="padding:4px 16px;border-radius:999px;background:${tpl.primary};color:${onP};font-family:${tpl.monoFont};font-size:13px;font-weight:700;">${escapeHtml(c.bannerPill)}</span>` : ""}
      </div>
      <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;min-height:0;align-items:stretch;">
        ${c.pts.map((pt, i) => {
          const isFocal = i === 0;
          const barW = extractPct(pt.stat, i, 100);
          return `<div style="${n === 5 && i === 0 ? "grid-column:1 / -1;" : ""}${cardChromeCss(tpl, "card")}padding:16px 24px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
            ${(pt.statLabel || pt.num || pt.stat) ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
              ${(pt.statLabel || pt.num) ? `<span style="font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${tpl.muted};">${escapeHtml(pt.statLabel || pt.num)}</span>` : "<span></span>"}
              ${pt.stat ? `<span style="font-family:${tpl.titleFont};font-size:21px;font-weight:800;color:${isFocal ? tpl.primary : tpl.fg};line-height:1;">${escapeHtml(pt.stat)}</span>` : ""}
            </div>` : ""}
            <div>
              <div style="font-size:21px;font-weight:700;color:${tpl.fg};margin-bottom:6px;">${escapeHtml(pt.title)}</div>
              ${barW !== null ? `<div style="width:100%;height:6px;background:${tpl.tint};border-radius:999px;overflow:hidden;">
                <div style="width:${barW}%;height:100%;background:${isFocal ? tpl.primary : tpl.muted};border-radius:999px;"></div>
              </div>` : ""}
            </div>
            ${pt.desc ? `<div style="font-size:17px;color:${tpl.muted};line-height:1.5;">${formatRich(pt.desc, tpl.primary)}</div>` : ""}
            ${pt.action ? `<div style="border-top:1px solid ${tpl.border}55;padding-top:8px;font-size:13px;color:${tpl.muted};font-weight:600;">▸ ${escapeHtml(pt.action)}</div>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  function layoutPhotoStorySplit(c, tpl) {
    const onP = contrastFg(tpl.primary);
    const clip = tpl.chrome === "diagonal" ? "clip-path:polygon(0 0,100% 0,92% 100%,0 100%);" : "";
    const leftBlock = c.image
      ? `<img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.title)}" onerror="this.style.display='none'" style="width:100%;height:100%;object-fit:cover;display:block;${clip}"/>`
      : `<div style="width:100%;height:100%;background:${tpl.primary};color:${onP};padding:32px;display:flex;flex-direction:column;justify-content:space-between;${clip}">
          ${c.kicker ? `<span style="font-family:${tpl.monoFont};font-size:13px;opacity:0.86;">${escapeHtml(c.kicker)}</span>` : "<span></span>"}
          ${c.hs ? `<div>
            <div style="font-family:${tpl.titleFont};font-size:52px;font-weight:800;line-height:1.05;">${escapeHtml(c.hs.value)}</div>
            ${c.hs.label ? `<div style="font-size:21px;font-weight:700;margin-top:8px;">${escapeHtml(c.hs.label)}</div>` : ""}
          </div>` : ""}
          ${c.summary ? `<p style="margin:0;font-size:17px;line-height:1.6;opacity:0.95;">${escapeHtml(c.summary).replace(/\*\*/g, "")}</p>` : "<span></span>"}
        </div>`;

    return `<div style="flex:1;padding:16px 48px 16px;display:grid;grid-template-columns:0.96fr 1.04fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="border-radius:${tpl.radius}px;overflow:hidden;border:${tpl.borderWidth} solid ${tpl.border};">${leftBlock}</div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;min-height:0;">
        ${c.pts.map((pt, i) => `<div style="flex:1;${cardChromeCss(tpl, "card")}padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            ${badgeHtml(pt.num, tpl, i === 0, 32)}
            <div>
              <div style="font-size:21px;font-weight:700;color:${i === 0 ? tpl.primary : tpl.fg};">${escapeHtml(pt.title)}</div>
              ${pt.desc ? `<div style="font-size:17px;color:${tpl.muted};line-height:1.5;margin-top:4px;">${formatRich(pt.desc, tpl.primary)}</div>` : ""}
            </div>
          </div>
          ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:13px;font-weight:700;color:${i === 0 ? tpl.primary : tpl.fg};white-space:nowrap;">${escapeHtml(pt.stat)}</span>` : ""}
        </div>`).join("")}
      </div>
    </div>`;
  }

  function layoutBeforeAfterCompare(c, tpl) {
    return `<div style="flex:1;padding:16px 48px 16px;display:grid;grid-template-columns:1fr 1fr;gap:24px;min-height:0;position:relative;z-index:4;">
      <div style="${cardChromeCss(tpl, "card")}padding:24px;display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:21px;font-weight:700;color:${tpl.fg};padding-bottom:12px;border-bottom:2px solid ${tpl.border};">現況與重點脈絡</div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-around;">
          ${c.pts.map((pt, i) => `<div style="padding:12px 0;${i < c.pts.length - 1 ? `border-bottom:1px solid ${tpl.border}55;` : ""}">
            <strong style="font-size:21px;font-weight:700;color:${tpl.fg};">${pt.num ? `${escapeHtml(pt.num)} ` : ""}${escapeHtml(pt.title)}</strong>
            ${pt.desc ? `<div style="font-size:17px;color:${tpl.muted};margin-top:6px;line-height:1.5;">${formatRich(pt.desc, tpl.primary)}</div>` : ""}
          </div>`).join("")}
        </div>
      </div>
      <div style="${cardChromeCss(tpl, "card")}padding:24px;display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:21px;font-weight:700;color:${tpl.primary};padding-bottom:12px;border-bottom:2px solid ${tpl.primary};">關鍵數據與行動對策</div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-around;">
          ${c.pts.map((pt, i) => `<div style="padding:12px 0;${i < c.pts.length - 1 ? `border-bottom:1px solid ${tpl.border}55;` : ""}display:flex;justify-content:space-between;align-items:center;gap:16px;">
            <span style="font-size:17px;font-weight:600;color:${tpl.fg};line-height:1.5;">▸ ${escapeHtml(pt.action || pt.desc)}</span>
            ${pt.stat ? `<span style="font-family:${tpl.monoFont};font-size:17px;font-weight:700;color:${tpl.primary};white-space:nowrap;">${escapeHtml(pt.stat)}</span>` : ""}
          </div>`).join("")}
        </div>
      </div>
    </div>`;
  }

  function layoutQuotePillars(c, tpl) {
    const n = c.pts.length;
    return `<div style="flex:1;padding:12px 56px 16px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;min-height:0;position:relative;z-index:4;">
      <div style="${cardChromeCss(tpl, "tint")}padding:20px 28px;display:grid;grid-template-columns:0.1fr 1fr;align-items:center;gap:14px;">
        <div style="font-family:Georgia,serif;font-size:88px;line-height:0.5;color:${tpl.primary};padding-top:24px;">“</div>
        <div style="font-family:${tpl.titleFont};font-size:22px;font-weight:700;line-height:1.5;color:${tpl.fg};">${formatRich(c.summary, tpl.primary)}</div>
      </div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(${n},1fr);gap:16px;min-height:0;">
        ${c.pts.map((pt) => `<div style="${cardChromeCss(tpl, "card")}padding:18px 20px;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="font-family:${tpl.monoFont};font-size:14px;font-weight:800;color:${tpl.secondary};">${escapeHtml(pt.num)}${pt.stat ? ` · ${escapeHtml(pt.stat)}` : ""}</div>
            <div style="font-size:19px;font-weight:800;color:${tpl.primary};margin-top:8px;">${escapeHtml(pt.title)}</div>
            <p style="margin:10px 0 0;font-size:16px;color:${tpl.fg};line-height:1.6;">${formatRich(pt.desc, tpl.primary)}</p>
          </div>
          ${pt.action ? `<div style="font-size:14.5px;font-weight:700;color:${tpl.primary};border-top:1px solid ${tpl.border}55;padding-top:10px;">▸ ${escapeHtml(pt.action)}</div>` : ""}
        </div>`).join("")}
      </div>
    </div>`;
  }

  const RENDER_BY_MODE = {
    "cover-centered": layoutCoverCentered,
    "cover-split-photo": layoutCoverSplitPhoto,
    "cover-editorial-bleed": layoutCoverEditorialBleed,
    "cover-framed-grid": layoutCoverFramedGrid,
    "section-monolith": layoutSectionMonolith,
    "dual-nested-stat": layoutDualNestedStat,
    "four-col-nested": layoutFourColNested,
    "profile-2x2-grid": layoutProfile2x2Grid,
    "three-col-defense": layoutThreeColDefense,
    "bento-1-3": layoutBento13,
    "grid-2x2-headers": layoutGrid2x2Headers,
    "triptych-gallery": layoutTriptychGallery,
    "banner-3-rows": layoutBanner3Rows,
    "left-thesis-right-list": layoutLeftThesisRightList,
    "header-cards-scale": layoutHeaderCardsScale,
    "stepped-bars-4": layoutSteppedBars4,
    "banner-dashed-split": layoutBannerDashedSplit,
    "snake-flow-8": layoutSnakeFlow8,
    "model-hypotheses": layoutModelHypotheses,
    "horizontal-timeline": layoutHorizontalTimeline,
    "hub-spoke-4": layoutHubSpoke4,
    "chevron-pipeline": layoutChevronPipeline,
    "bars-insight-split": layoutBarsInsightSplit,
    "matrix-table-split": layoutMatrixTableSplit,
    "monolith-stat-split": layoutMonolithStatSplit,
    "vertical-columns-split": layoutVerticalColumnsSplit,
    "donut-kpi-cards": layoutDonutKpiCards,
    "photo-story-split": layoutPhotoStorySplit,
    "before-after-compare": layoutBeforeAfterCompare,
    "quote-pillars": layoutQuotePillars
  };

  function renderSlideInner(recipeOrId, data) {
    const tpl = getTemplate(recipeOrId);
    const c = getCanon(data);
    const mode = data.mode || "dual-nested-stat";
    const total = data.total || 20;
    const idx = Math.max(0, (parseInt(data.num || "1", 10) || 1) - 1);

    const topStrip = "";

    const isCoverMode = mode === "cover-centered" || mode === "cover-split-photo" || mode === "cover-editorial-bleed" || mode === "cover-framed-grid";
    const renderFn = RENDER_BY_MODE[mode] || layoutDualNestedStat;
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

  function buildAiSecurityDeck() {
    return [
      {
        mode: "cover-centered", chapterIdx: 0, chapter: "研究動機",
        kicker: "01 · 實證論文報告",
        title: "中小企業在生成式 AI 使用情境下的資訊安全管理",
        sub: "基於組織認同、組織信任與溝通隱私管理之 PLS-SEM 實證研究",
        author: "企業生成式 AI 治理實證研究  ·  資訊安全管理學術簡報範例",
        presenter: "研究脈絡：組織認同 (OI) × 組織信任 (TR) × 溝通隱私管理 (CPM)",
        dateLabel: "學術實證簡報範例",
        summary: "實證探討中小企業員工如何因組織認同與信任而建立 AI 資訊邊界，並推動資安遵循意圖 (BI)。",
        highlightStat: { value: "N = 141", label: "有效問卷樣本", desc: "PLS-SEM 模型解釋行為意圖達 58.9%" },
        points: [
          { num: "01", title: "四構面理論鏈", stat: "OI→TR→CPM→BI", statLabel: "PLS-SEM 架構", desc: "串聯組織認同、組織信任與溝通隱私管理解釋資安意圖", action: "檢驗 H1–H3 三條中介傳導路徑" },
          { num: "02", title: "實證樣本基礎", stat: "N = 141", statLabel: "有效問卷", desc: "回收中小企業在職人員有效問卷進行拔靴法千次檢定", action: "涵蓋微中小型組織跨層級使用者" },
          { num: "03", title: "核心實證發現", stat: "R² = 58.9%", statLabel: "解釋力指標", desc: "溝通隱私管理 (CPM) 對行為意圖具最強推動效果 (f²=1.431)", action: "建立明確邊界指引勝過純技術防堵" }
        ]
      },
      {
        mode: "before-after-compare", chapterIdx: 0, chapter: "研究動機",
        kicker: "02 · 挑戰背景",
        title: "生成式 AI 的工作滲透與治理挑戰",
        sub: "AI 已滲入企業日常核心作業流程，風險焦點從系統外部轉向員工操作輸入端。",
        summary: "傳統資安防線無法阻攔員工主動將**內部文件與客戶機密輸入公開 AI 模型**的日常操作行為。",
        highlightStat: { value: "風險轉移", label: "工作輸入端揭露風險", desc: "技術控制已不足以覆蓋人因互動情境" },
        points: [
          { num: "01", title: "技術普及", stat: "日常核心", statLabel: "工作轉變", desc: "大語言模型迅速進入日常工作提升產能，從資訊部門工具轉為影響企業決策的核心技術", action: "生成式 AI 已成為多數員工日常必用助手" },
          { num: "02", title: "風險轉移", stat: "輸入外洩", statLabel: "主要風險", desc: "資安風險由系統外部漏洞延伸至員工將內部文件與客戶機密貼入公開 AI 模型的日常行為", action: "亟需建立員工對資訊邊界與授權的敏感度" }
        ]
      },
      {
        mode: "dual-nested-stat", chapterIdx: 0, chapter: "研究動機",
        kicker: "03 · 雙重困境",
        title: "痛點剖析：中小企業的雙重資安困境",
        sub: "有限的資源人才配置與內部信任防護缺口，使中小企業承受更高的洩密代價。",
        summary: "僅 **14%** 組織具備資安人力下，單次內部操作損失卻平均達 **492 萬美元**且需 **260 天**才能遏制。",
        highlightStat: { value: "492 萬美元", label: "內部事件平均損失", desc: "自識別至遏制平均歷時高達 260 天" },
        dualGroups: [
          {
            num: "01", title: "資源與人才匱乏",
            stats: [{ value: "35%", label: "認為自身網路韌性不足" }, { value: "14%", label: "具備所需資安人力與技能" }],
            summary: "調查顯示約 **35%** 小型組織認為自身網路韌性不足，且只有 **14%** 受訪組織具備當前所需資安人力與技能。"
          },
          {
            num: "02", title: "內部信任風險",
            stats: [{ value: "492 萬美元", label: "內部操作平均損失" }, { value: "260 天", label: "識別至遏制平均天數" }],
            summary: "惡意內部人員操作平均造成 **492 萬美元**損失，且自識別至遏制平均需 **260 天**，員工行為與治理成為防禦關鍵。"
          }
        ],
        points: [
          { num: "01", title: "網路韌性不足", stat: "35%", statLabel: "小型組織", desc: "認為自身網路韌性不足面對新型態威脅", action: "缺乏專職防禦與事件演練預算" },
          { num: "02", title: "資安人力缺乏", stat: "14%", statLabel: "受訪組織", desc: "僅一成四組織具備當前所需資安人力技能", action: "無法高度依賴高價技術監控系統" },
          { num: "03", title: "內部事件損失", stat: "492 萬美元", statLabel: "平均損失", desc: "內部操作與洩密平均帶來鉅額損失", action: "事前防範遠比事後處置更具效益" },
          { num: "04", title: "漫長遏制週期", stat: "260 天", statLabel: "識別到遏制", desc: "從察覺外洩至完成止血平均耗時近九個月", action: "員工主動維護隱私邊界才是關鍵防線" }
        ]
      },
      {
        mode: "bars-insight-split", chapterIdx: 0, chapter: "研究動機",
        kicker: "04 · 風險類型調查",
        title: "企業最關注的生成式 AI 資安風險類型",
        sub: "依 CIO Taiwan 調查數據整理前五大企業憂慮來源。",
        summary: "排名第一的風險來自**員工未經授權輸入機密資訊導致資料外洩 (21%)**，而非單純系統漏洞或外部駭客。",
        highlightStat: { value: "21%", label: "最高風險類別：人為數據外洩", desc: "佔比遠高於資安治理複雜化或 LLM 攻擊腳本" },
        points: [
          { num: "01", title: "非授權輸入機密資料導致資料外洩", stat: "21%", statLabel: "第一名風險", desc: "員工在未核准情況下輸入客戶名冊或機密簡報", action: "界定清楚資料分級紅綠燈邊界" },
          { num: "02", title: "資安治理複雜化", stat: "12%", statLabel: "並列第二", desc: "各部門混用眾多外部工具使管理規範與稽核困難", action: "建立簡明易懂一致的使用規範" },
          { num: "03", title: "加速設備滲透及漏洞攻擊", stat: "12%", statLabel: "並列第二", desc: "外部威脅者更快速探測端點弱點發動攻擊", action: "落實基礎端點權限與帳號防護" },
          { num: "04", title: "駭客利用 LLM 建立自動化攻擊腳本", stat: "12%", statLabel: "並列第二", desc: "降低惡意程式碼與漏洞測試門檻與開發時間", action: "提升異常行為感知與通報反應" },
          { num: "05", title: "AI 驅動之社交工程攻擊（模仿主管語氣）", stat: "11%", statLabel: "第五名風險", desc: "高擬真偽造信件或對話誘騙經辦輸出機密檔案", action: "重要資料流向需遵循雙重授權核可" }
        ]
      },
      {
        mode: "banner-3-rows", chapterIdx: 0, chapter: "研究動機",
        kicker: "05 · 研究目的",
        title: "研究動機與三大研究目的",
        sub: "現有研究多偏重技術與治理框架，本研究改由員工心理認同與資訊邊界管理視角出發。",
        bannerPill: "研究動機",
        summary: "現有研究多聚焦於技術控制、風險辨識與治理框架建置，較少從**員工心理認同與資訊邊界管理視角**解析資安行為。",
        highlightStat: { value: "3 大目的", label: "核心因果問題", desc: "依序探討 OI → TR → CPM → BI 影響路徑" },
        points: [
          { num: "01", title: "認同對信任之影響", stat: "OI → TR", statLabel: "目的 01", desc: "探討在生成式 AI 使用情境下，中小企業員工的**組織認同**對**組織信任**的影響。", action: "確認歸屬感能否轉化為對制度信任" },
          { num: "02", title: "信任對隱私邊界影響", stat: "TR → CPM", statLabel: "目的 02", desc: "探討中小企業員工的**組織信任**對**溝通隱私管理**的影響。", action: "驗證制度信任是否促進自律邊界調節" },
          { num: "03", title: "邊界對行為意圖影響", stat: "CPM → BI", statLabel: "目的 03", desc: "探討中小企業員工的**溝通隱私管理**對**遵循資訊安全行為意圖**的影響。", action: "找出推動實際防洩密意願的關鍵槓桿" }
        ]
      },
      {
        mode: "snake-flow-8", chapterIdx: 2, chapter: "研究方法",
        kicker: "06 · 研究執行步驟",
        title: "研究流程圖",
        sub: "從研究動機與文獻推導出發，歷經問卷設計與 SmartPLS 4 實證統計的完整八階段流程。",
        summary: "採系統化實證設計流程，以 141 份中小企業有效問卷進行 PLS-SEM 測量與結構模型雙重驗證。",
        highlightStat: { value: "8 階段", label: "實證研究閉環", desc: "由問題探索收斂至管理意涵與 QA 防守" },
        points: [
          { num: "01", title: "研究動機與目的", stat: "Stage 1", statLabel: "問題界定", desc: "聚焦中小企業 AI 人因洩密缺口", action: "確立三大因果研究問題" },
          { num: "02", title: "文獻探討", stat: "Stage 2", statLabel: "理論基礎", desc: "統整 OI、TR、CPM 與 TPB 文獻", action: "發展測量構念定義" },
          { num: "03", title: "研究架構與假設", stat: "Stage 3", statLabel: "模型推導", desc: "建立 OI→TR→CPM→BI 假說鏈", action: "定義 H1 至 H3 因果路徑" },
          { num: "04", title: "問卷設計", stat: "Stage 4", statLabel: "30題量表", desc: "改編 AI 使用情境李克特五點問卷", action: "預試修正題項語意清晰度" },
          { num: "05", title: "資料蒐集", stat: "Stage 5", statLabel: "N = 141", desc: "針對中小企業員工蒐集有效問卷", action: "達成 100% 有效樣本回收" },
          { num: "06", title: "SmartPLS 4 統計分析", stat: "Stage 6", statLabel: "PLS-SEM", desc: "檢定信效度 (α/CR/AVE/HTMT) 與路徑", action: "執行 Bootstrapping 10,000 次" },
          { num: "07", title: "討論與結論", stat: "Stage 7", statLabel: "實證詮釋", desc: "解讀模型解釋力 R² 與效果量 f²", action: "提煉實務操作邊界管理建議" },
          { num: "08", title: "研究限制與建議", stat: "Stage 8", statLabel: "QA 防守", desc: "辨識樣本與橫斷面自陳問卷限制", action: "提出縱貫追蹤與實地驗證規劃" }
        ]
      },
      {
        mode: "dual-nested-stat", chapterIdx: 1, chapter: "文獻探討",
        kicker: "07 · 組織認同理論",
        title: "理論基礎（一）：組織認同理論 (OI)",
        sub: "基於社會認同觀點，成員透過將組織價值納入自我概念來指引護衛態度與行為。",
        summary: "強烈的組織認同使員工自發將公司資安政策內化為共同目標，進而**支持組織治理政策**。",
        highlightStat: { value: "社會認同", label: "Organizational Identification", desc: "解答「我是誰」與組織歸屬一體感" },
        dualGroups: [
          {
            num: "01", title: "定義依據",
            stats: [{ value: "社會認同", label: "Social Identity Theory 觀點" }, { value: "一體歸屬", label: "自我概念納入所屬組織群體" }],
            summary: "基於**社會認同**觀點，個體的**自我概念**包含個人特質與所屬群體，形成一體感與歸屬感，透過組織定位回答「**我是誰**」。"
          },
          {
            num: "02", title: "作用機制",
            stats: [{ value: "心理機制", label: "影響工作態度與行為基礎" }, { value: "主動支持", label: "護衛組織目標與資安治理政策" }],
            summary: "影響工作態度與行為的基礎性**心理機制**；強烈的組織認同能促使員工在無人監督時仍**支持組織目標與治理政策**。"
          }
        ],
        points: [
          { num: "01", title: "定義依據", stat: "社會認同", statLabel: "自我概念", desc: "個體自我概念形成一體感與歸屬感，透過組織回答我是誰", action: "凝聚共同組織榮譽心理基礎" },
          { num: "02", title: "作用機制", stat: "支持政策", statLabel: "行為驅動", desc: "強烈的組織認同促使員工主動支持組織目標與治理政策", action: "構成對制度產生組織信任的前提" }
        ]
      },
      {
        mode: "left-thesis-right-list", chapterIdx: 1, chapter: "文獻探討",
        kicker: "08 · 組織信任理論",
        title: "理論基礎（二）：組織信任 (Organizational Trust)",
        sub: "員工對「組織及其管理安排」的正向期待，包含能力、善意與正直三個關鍵構面。",
        summary: "在生成式 AI 使用情境下，組織信任有助於員工將資訊安全制度理解為**保護與支持**，而非單純的控制或監視。",
        highlightStat: { value: "3 構面", label: "能力 · 善意 · 正直", desc: "對組織管理安排的正向預期與脆弱性承擔" },
        points: [
          { num: "01", title: "心理狀態與脆弱性", stat: "正向期待", statLabel: "核心定義", desc: "基於對組織意圖的正向期待，而願意在不確定情境中接受脆弱性與規範要求", action: "願意誠實回報 AI 使用情境" },
          { num: "02", title: "能力 (Ability)", stat: "3 題衡量", statLabel: "構面一", desc: "相信組織管理層具備足夠專業知識與執行技能來設計可行的 AI 保護措施", action: "避免不切實際的一刀切封鎖" },
          { num: "03", title: "善意 (Benevolence)", stat: "3 題衡量", statLabel: "構面二", desc: "相信公司訂立規範是出於關懷照顧員工免於誤觸法規風險，而非單純懲罰", action: "讓員工感受到制度保護而非監視" },
          { num: "04", title: "正直 (Integrity)", stat: "3 題衡量", statLabel: "構面三", desc: "相信公司長期秉持誠信公開溝通與公平一致的道德執法原則", action: "促進員工自律遵守資訊邊界共管" }
        ]
      },
      {
        mode: "banner-3-rows", chapterIdx: 1, chapter: "文獻探討",
        kicker: "09 · 溝通隱私管理",
        title: "理論基礎（三）：溝通隱私管理理論 (CPM)",
        sub: "說明個體如何區分私人與公開邊界並透過邊界滲透性調節管理資訊流動，延伸至人機共管情境。",
        bannerPill: "理論核心",
        summary: "用以說明個體如何區分私人與公開關係，並透過**邊界滲透性的調節管理資訊流動**，延伸至人機互動與工作資訊共管情境。",
        highlightStat: { value: "CPM", label: "Privacy Boundary Management", desc: "邊界所有權 (Ownership) × 邊界連結 (Linkage)" },
        points: [
          { num: "01", title: "邊界所有權 (Boundary Ownership)", stat: "5 題衡量", statLabel: "保護權責", desc: "員工自覺對經手的工作資訊、業務機密與客戶資料負有**主要管理與保護責任**。", action: "認知資料屬於組織共同資產而非個人便利" },
          { num: "02", title: "邊界連結 (Boundary Linkage)", stat: "4 題衡量", statLabel: "第三方識別", desc: "員工接受工作資訊在 AI 使用過程中，需依規範進入人機共管狀態並**確認哪些第三方可接觸該資訊**。", action: "避免將公司機密送入未經核准之公開伺服器" }
        ]
      },
      {
        mode: "dual-nested-stat", chapterIdx: 1, chapter: "文獻探討",
        kicker: "10 · 計劃行為理論",
        title: "理論基礎（四）：計劃行為理論 (TPB) 與行為意圖",
        sub: "以行為意圖 (BI) 衡量員工在日常與時間壓力下主動防洩密的真實心理傾向。",
        summary: "行為意圖為實際遵循行為最直接之前因指標，能明確反映員工在**壓力情境下避免洩密與遵循規範**的意願。",
        highlightStat: { value: "BI", label: "Behavioral Intention", desc: "實際遵循資安規範最直接前導指標" },
        dualGroups: [
          {
            num: "01", title: "理論依據",
            stats: [{ value: "前因指標", label: "最直接預測實際資安行為" }, { value: "願意投入", label: "反映執行保護措施的承諾度" }],
            summary: "**行為意圖 (BI)** 為實際行為最直接之前因指標，反映個體願意嘗試、投入努力並計畫實際執行該行為的程度。"
          },
          {
            num: "02", title: "情境操作",
            stats: [{ value: "壓力日常", label: "貼近趕工與高頻 AI 使用情境" }, { value: "主動避險", label: "避免洩密與遵循規範心理意願" }],
            summary: "聚焦於員工未來在壓力或日常使用 AI 時，**主動避免洩密與遵循規範**的心理意願，明確反映其遵循資安規範的傾向。"
          }
        ],
        points: [
          { num: "01", title: "理論依據", stat: "前因指標", statLabel: "TPB 模型", desc: "行為意圖為實際行為最直接前因並反映投入計畫執行程度", action: "提供高度有效的保護意願代理指標" },
          { num: "02", title: "情境操作", stat: "壓力情境", statLabel: "實務操作", desc: "聚焦在壓力或日常用 AI 時主動避免洩密與遵循規範意願", action: "測量貼近真實職場掙扎的保護抉擇" }
        ]
      },
      {
        mode: "model-hypotheses", chapterIdx: 2, chapter: "研究方法",
        kicker: "11 · 研究架構與假說",
        title: "研究架構與假說推導",
        sub: "建立「組織認同 (OI) → 組織信任 (TR) → 溝通隱私管理 (CPM) → 行為意圖 (BI)」三段式假說鏈。",
        summary: "透過實證模型檢驗心理認同如何經由對管理制度的信任，進一步推動人機隱私邊界管理與遵循資安意圖。",
        highlightStat: { value: "H1–H3", label: "三條正向因果假說", desc: "建構串聯認知、信任與行為的完整路徑" },
        modelNodes: [
          { title: "組織認同", code: "(OI)", edge: "H1" },
          { title: "組織信任", code: "(TR)", edge: "H2" },
          { title: "溝通隱私管理", code: "(CPM)", edge: "H3" },
          { title: "行為意圖", code: "(BI)" }
        ],
        points: [
          { num: "H1", title: "H1：認同正向影響信任", stat: "OI ──▶ TR", statLabel: "OI → TR", desc: "在生成式 AI 使用情境下，員工之**組織認同**對**組織信任**具有顯著正向影響。", action: "歸屬感越高越能信任公司規範用意" },
          { num: "H2", title: "H2：信任正向影響隱私管理", stat: "TR ──▶ CPM", statLabel: "TR → CPM", desc: "在生成式 AI 使用情境下，員工之**組織信任**對**溝通隱私管理**具有顯著正向影響。", action: "信任感越高越願遵守資訊邊界共管" },
          { num: "H3", title: "H3：隱私管理影響行為意圖", stat: "CPM ──▶ BI", statLabel: "CPM → BI", desc: "在生成式 AI 使用情境下，員工之**溝通隱私管理**對**資訊安全行為意圖**具有顯著正向影響。", action: "邊界意識是阻止洩密最直接心理驅力" }
        ]
      },
      {
        mode: "header-cards-scale", chapterIdx: 2, chapter: "研究方法",
        kicker: "12 · 問卷工具",
        title: "研究工具與問卷設計",
        sub: "全卷合計 30 題結構化指標，全面採用標準李克特五點量表進行量化衡量。",
        summary: "計分從 **1 分（非常不同意）至 5 分（非常同意）**，得分愈高代表受試者對該構面題項同意程度愈高。",
        highlightStat: { value: "30 題", label: "四大構面問卷題數", desc: "6 題 OI + 9 題 TR + 9 題 CPM + 6 題 BI" },
        scaleNodes: [
          { n: "1", label: "非常不同意" },
          { n: "2", label: "不同意" },
          { n: "3", label: "普通" },
          { n: "4", label: "同意" },
          { n: "5", label: "非常同意" }
        ],
        points: [
          { num: "01", title: "組織認同 (OI)", stat: "6 題", statLabel: "社會認同", desc: "衡量員工對所屬中小企業之歸屬與共榮一體感", action: "採五點李克特量表 1–5 分計分" },
          { num: "02", title: "組織信任 (TR)", stat: "9 題", statLabel: "能力·善意·正直", desc: "能力（3 題）· 善意（3 題）· 正直（3 題）", action: "檢視員工對規範公正與支持度認知" },
          { num: "03", title: "溝通隱私管理 (CPM)", stat: "9 題", statLabel: "邊界控制", desc: "邊界所有權（5 題）· 邊界連結（4 題）", action: "測度資料共管責任與第三方連結警覺" },
          { num: "04", title: "行為意圖 (BI)", stat: "6 題", statLabel: "遵循傾向", desc: "衡量在工作使用 AI 時主動避免洩密之行為意向", action: "分數愈高表示資安遵循意願愈強" }
        ]
      },
      {
        mode: "profile-2x2-grid", chapterIdx: 3, chapter: "實證分析",
        kicker: "13 · 樣本結構",
        title: "樣本統計與結構分析",
        sub: "針對台灣中小企業員工進行問卷調查，總計回收 141 份 100% 有效樣本。",
        summary: "有效樣本以 **5～49 人小型企業 (41.84%)**、**10 年以上資深員工 (75.89%)** 與 **管理職 (65.25%)** 為主。",
        highlightStat: { value: "N = 141", label: "樣本特徵 · 有效率 100%", desc: "製造業與服務業合計佔整體樣本過半" },
        points: [
          { num: "01", title: "公司規模", stat: "未滿 50 人 53.19%", statLabel: "企業規模", desc: "5～49 人 占 41.84% 為最大宗，未滿 50 人合計占 53.19%", action: "標準小型企業資安資源受限族群" },
          { num: "02", title: "工作年資", stat: "10 年以上 75.89%", statLabel: "職場資歷", desc: "十年以上深厚資歷員工高達 75.89%", action: "工作經驗顯著偏向資深成員" },
          { num: "03", title: "職位分佈", stat: "管理職 65.25%", statLabel: "職級比重", desc: "管理職佔 65.25%、非管理職佔 34.75%", action: "於研究限制列為後續擴大基層對照項" },
          { num: "04", title: "產業類別", stat: "製造+服務 56.74%", statLabel: "產業背景", desc: "製造業占 40.43%、服務業占 16.31%", action: "兩者合計過半為本次樣本核心主體" }
        ]
      },
      {
        mode: "four-col-nested", chapterIdx: 3, chapter: "實證分析",
        kicker: "14 · 敘述統計",
        title: "各構面敘述性統計分析",
        sub: "檢視四大構面之平均數 (M) 與標準差 (SD)，辨識員工態度趨同度與管理破口。",
        summary: "**行為意圖得分最高且意見最一致 (M=4.365)**；反之**組織信任均值最低且意見分歧最大 (M=3.836, SD=0.723)**。",
        highlightStat: { value: "3.836 vs 4.365", label: "信任最低 vs 意圖最高", desc: "顯示員工有意願遵守但對管理制度尚未充分信任" },
        points: [
          { num: "01", title: "行為意圖 (BI)", stat: "M = 4.365", statLabel: "SD = 0.506", desc: "均值最高且標準差最小呈現高度共識", action: "★ Key Insight：得分最高且意見最一致" },
          { num: "02", title: "溝通隱私 (CPM)", stat: "M = 4.277", statLabel: "SD = 0.544", desc: "整體呈現高認同度構面且離散程度低", action: "員工普遍認可區分工作資料界線重要" },
          { num: "03", title: "組織認同 (OI)", stat: "M = 4.057", statLabel: "SD = 0.685", desc: "維持中高程度認同且意見呈現中度趨同", action: "可善用團隊歸屬感帶動整體防禦文化" },
          { num: "04", title: "組織信任 (TR)", stat: "M = 3.836", statLabel: "SD = 0.723", desc: "所有構面中均值最低且標準差意見分歧最大", action: "⚠ 關鍵觀察：建立制度信任為首要破口" }
        ]
      },
      {
        mode: "chevron-pipeline", chapterIdx: 3, chapter: "實證分析",
        kicker: "15 · 信效度檢驗",
        title: "測量模型檢驗：信度與收斂效度",
        sub: "檢核 Cronbach's α、組合信度 (CR)、AVE 與外部負荷量，全面評估測量品質。",
        summary: "各構面 **Cronbach's α (0.868–0.941)**、**CR (0.901–0.950)** 與 **AVE (0.602–0.760)** 全數高於學術門檻。",
        highlightStat: { value: "全數通過", label: "信度與收斂效度檢驗", desc: "僅單一 OI_1 負荷量 0.703 仍屬可接受範圍" },
        points: [
          { num: "01", title: "外部負荷量", stat: "0.703～0.924", statLabel: "標準 > 0.708", desc: "OI_1 為 0.703 略低於 0.708 仍屬可接受保留範圍", action: "其餘指標全數 > 0.708 符合理想標準" },
          { num: "02", title: "Cronbach's α", stat: "0.868～0.941", statLabel: "標準 > 0.70", desc: "OI(0.868)、TR(0.941)、CPM(0.928)、BI(0.936)", action: "全構面遠大於 0.70 具備高度內部信度" },
          { num: "03", title: "組合信度 (CR)", stat: "0.901～0.950", statLabel: "標準 > 0.70", desc: "四個潛在構面組合信度皆突破 0.90 高水準", action: "證明潛在變數指標衡量穩定可靠" },
          { num: "04", title: "平均變異萃取 AVE", stat: "0.602～0.760", statLabel: "標準 > 0.50", desc: "各構面收斂效度平均變異萃取量均在 0.60 以上", action: "全數超過 0.50 收斂效度檢核標準" }
        ]
      },
      {
        mode: "matrix-table-split", chapterIdx: 3, chapter: "實證分析",
        kicker: "16 · 區別效度 HTMT",
        title: "測量模型檢驗：區別效度分析 (HTMT 檢驗)",
        sub: "檢核各構面間異質-單質比率是否均低於 0.85 建議門檻。",
        summary: "所有 HTMT 數值皆低於 0.85 建議標準（最高值為 CPM ↔ BI 之 **0.819**），各構面具良好區別效度。",
        highlightStat: { value: "< 0.85", label: "HTMT 檢驗門檻", desc: "最高值：CPM ↔ BI (0.819)" },
        matrixTable: {
          headers: ["構面", "CPM", "BI", "OI", "TR"],
          rows: [
            ["CPM", "-", "", "", ""],
            ["BI", "0.819", "-", "", ""],
            ["OI", "0.448", "0.397", "-", ""],
            ["TR", "0.513", "0.441", "0.555", "-"]
          ],
          highlightRow: 1,
          highlightCol: 1,
          thresholdTitle: "HTMT 檢驗門檻（符合標準）",
          thresholdStat: "< 0.85",
          thresholdNote: "最高值：CPM ↔ BI (**0.819**)",
          conclusionTitle: "檢驗結論",
          conclusionBody: "所有 HTMT 數值皆低於 0.85 建議標準，證明本模型各構面之間具有良好的區別效度 (Discriminant Validity)。"
        },
        points: [
          { num: "01", title: "CPM ↔ BI", stat: "0.819", statLabel: "最高對照值", desc: "隱私管理與行為意圖比率 0.819 低於 0.85 門檻", action: "兩構念概念清楚獨立不重疊" },
          { num: "02", title: "OI ↔ TR", stat: "0.555", statLabel: "良好區辨", desc: "組織認同與組織信任之異質單質比率為 0.555", action: "確實測度不同心理組織構念" },
          { num: "03", title: "TR ↔ CPM", stat: "0.513", statLabel: "良好區辨", desc: "組織信任與溝通隱私管理之比率僅為 0.513", action: "無共線性混淆誤差干擾推論" },
          { num: "04", title: "OI ↔ BI / CPM", stat: "0.397 / 0.448", statLabel: "高度獨立", desc: "組織認同對後續中介與結果變數區辨表現優良", action: "全面通過測量模型結構驗證" }
        ]
      },
      {
        mode: "model-hypotheses", chapterIdx: 3, chapter: "實證分析",
        kicker: "17 · 假說實證檢定",
        title: "結構模型實證結果：假說驗證",
        sub: "採 Bootstrapping 10,000 次重複抽樣，檢驗 H1、H2、H3 路徑係數與統計顯著性。",
        summary: "三大研究假說全數成立 (**p < 0.001 ****)，其中 **H3 (CPM → BI) β 高達 0.767** 為全模型最強路徑。",
        highlightStat: { value: "3 / 3 Supported", label: "萬次抽樣全數顯著支持", desc: "所有 t 檢定值介於 6.561 至 20.281 之間" },
        modelNodes: [
          { title: "組織認同", code: "OI", edge: "β 0.525" },
          { title: "組織信任", code: "TR", edge: "β 0.482" },
          { title: "溝通隱私管理", code: "CPM", edge: "β 0.767" },
          { title: "行為意圖", code: "BI" }
        ],
        points: [
          { num: "H1 成立", title: "組織認同 → 組織信任", stat: "β = 0.525", statLabel: "OI → TR", desc: "員工對組織之認同對信任產生顯著正向推動效果。", action: "t = 9.129 · p < 0.001 ***" },
          { num: "H2 成立", title: "組織信任 → 溝通隱私管理", stat: "β = 0.482", statLabel: "TR → CPM", desc: "員工之組織信任正向強化其溝通隱私邊界管理意識。", action: "t = 6.561 · p < 0.001 ***" },
          { num: "H3 成立", title: "溝通隱私管理 → 行為意圖", stat: "β = 0.767", statLabel: "CPM → BI", desc: "溝通隱私管理對資安行為意圖具**全模型最強路徑效果**。", action: "t = 20.281 · ★ 最強路徑" }
        ]
      },
      {
        mode: "dual-nested-stat", chapterIdx: 3, chapter: "實證分析",
        kicker: "18 · 模型解釋力",
        title: "模型解釋力 (R²) 與效果量 (f²) 解析",
        sub: "評估模型對內生潛在變數之解釋幅度，並檢驗核心路徑推動效果強度。",
        summary: "行為意圖 (BI) 解釋力達 **58.9%**，且 **CPM → BI 效果量 f² 高達 1.431**（遠超 0.35 大效果門檻）。",
        highlightStat: { value: "f² = 1.431", label: "核心推動槓桿（大效果）", desc: "模型對行為意圖 BI 整體解釋力 R² = 0.589" },
        dualGroups: [
          {
            num: "01", title: "模型解釋力 (R²)",
            stats: [{ value: "0.589", label: "行為意圖 (BI) 達 58.9% 中高度解釋力" }, { value: "0.276 / 0.233", label: "組織信任 (TR) 與隱私管理 (CPM)" }],
            summary: "終極依變數**行為意圖 (BI)** R² 達 **0.589**（解釋力 58.9%），TR 與 CPM 分別達 0.276 與 0.233 基礎適中解釋效益。"
          },
          {
            num: "02", title: "效果量 (f²) 關鍵發現",
            stats: [{ value: "1.431", label: "CPM → BI（大效果）" }, { value: "> 0.35", label: "遠超 Cohen 大效果門檻" }],
            summary: "★ **核心推動槓桿**：CPM → BI 效果量高達 **1.431**，遠超越 0.35 大效果門檻，證實強化邊界管理最能帶動遵循意願。"
          }
        ],
        points: [
          { num: "01", title: "行為意圖解釋力", stat: "R² = 0.589", statLabel: "中高度解釋力", desc: "解釋力達 58.9% 成功解釋近六成資安遵循變異", action: "驗證人因心理路徑具備強大解釋表現" },
          { num: "02", title: "組織信任解釋力", stat: "R² = 0.276", statLabel: "適中效益", desc: "由組織認同解釋近兩成八之組織信任差異", action: "團隊認同感有助凝聚管理制度信任度" },
          { num: "03", title: "隱私管理解釋力", stat: "R² = 0.233", statLabel: "適中效益", desc: "組織信任解釋兩成三以上之資訊邊界意識變異", action: "高信任環境降低規避規範的防衛動機" },
          { num: "04", title: "關鍵推動效果量", stat: "f² = 1.431", statLabel: "遠超 0.35 門檻", desc: "CPM → BI 呈現極高推動效果量為全模型核心", action: "實務治理應優先釐清資料邊界指引" }
        ]
      },
      {
        mode: "three-col-defense", chapterIdx: 4, chapter: "結論建議",
        kicker: "19 · 管理意涵",
        title: "實務意涵：中小企業 AI 資安管理實踐建議",
        sub: "轉化實證發現為中小企業在資源受限情境下立即可落地的三項人因治理策略。",
        summary: "從「技術圍堵」轉為「**操作型邊界指引 × 透明溝通建立信任 × 連結專業與企業聲譽**」。",
        highlightStat: { value: "3 大策略", label: "低成本可行人因治理", desc: "針對 CPM 最強槓桿與信任缺口精準發力" },
        points: [
          { num: "01", title: "建立操作型邊界指引", stat: "策略一", statLabel: "事前邊界", desc: "明確界定可公開、內部工作、機密與個資四類分級標準，讓員工輸入前有清楚依據。", action: "避免規定抽象導致日常誤傳" },
          { num: "02", title: "建立溝通與信任機制", stat: "策略二", statLabel: "制度透明", desc: "透過透明溝通與主管示範建立信任，避免落入純管制防堵，使員工理解規範目的。", action: "針對信任最低均值有效補課" },
          { num: "03", title: "連結專業與企業聲譽", stat: "策略三", statLabel: "角色連結", desc: "將資安遵循與員工專業角色及企業共同聲譽連結，使其成為維護專業體面的一部分。", action: "把外在規定轉為內在職業認同" }
        ]
      },
      {
        mode: "quote-pillars", chapterIdx: 4, chapter: "結論建議",
        kicker: "20 · 研究限制與 QA",
        title: "研究限制與防守策略",
        sub: "客觀檢視樣本與方法論限制，並具體說明後續研究延伸與檢證補齊方向。",
        summary: "誠實指出管理職占比過高、橫斷面問卷偏差與意圖行為差距三項邊界，提出嚴謹防守設計。",
        highlightStat: { value: "3 項 QA", label: "研究邊界與防守策略", desc: "兼顧學術誠實與後續驗證路徑" },
        points: [
          { num: "01", title: "樣本結構", stat: "65.25% 管理職", statLabel: "研究限制", desc: "本次樣本中管理職占 65.25% 比例偏高。", action: "未來需擴大基層與不同頻率使用者跨族群比較驗證" },
          { num: "02", title: "研究方法", stat: "橫斷面問卷", statLabel: "研究限制", desc: "橫斷面自陳問卷可能存有社會期許偏誤。", action: "未來建議結合客觀系統操作 Log 或採縱貫追蹤設計" },
          { num: "03", title: "變數衡量", stat: "BI ≠ 實際行為", statLabel: "研究限制", desc: "行為意圖並不完全百分之百等同於實際執行行為。", action: "未來可透過情境模擬實驗或實地觀察驗證意圖行為落差" }
        ]
      }
    ];
  }

  function buildCafeBrandDeck(assetBase) {
    const base = assetBase.endsWith("/") ? assetBase : `${assetBase}/`;
    const heroImg = `${base}hero-pourover.jpg`;
    const spaceImg = `${base}cafe-space.jpg`;
    return [
      {
        mode: "cover-split-photo", chapterIdx: 0, chapter: "品牌初心",
        kicker: "SIMPLE KAFFA 興波咖啡",
        title: "從一台三輪車到世界第一的咖啡森林",
        sub: "以「簡單好咖啡」為名，結合科學數據紀錄與職人手感溫度，打造台北最具代表性的精品咖啡體驗。",
        summary: "2016 WBC 世界咖啡大師賽冠軍，並在 2019、2020 連續兩年獲選全球 50 間最棒咖啡館第一名。",
        highlightStat: { value: "#1", label: "全球 50 間最棒咖啡館", desc: "連續兩年獲 Big 7 Travel 評選世界榜首" },
        image: heroImg,
        points: [
          { num: "01", title: "品牌語源", stat: "Simple Kaffa", statLabel: "初心精神", desc: "純粹風味結合衣索比亞古老咖啡森林概念", action: "在繁忙都市打造呼吸感的咖啡森林" },
          { num: "02", title: "草創起步", stat: "2009 年", statLabel: "街頭攤車", desc: "由吳則霖與盧嘉琦於台北街頭三輪攤車出發", action: "以手沖溫暖對話累積忠實顧客" },
          { num: "03", title: "世界冠軍", stat: "2016 WBC", statLabel: "都柏林奪冠", desc: "吳則霖成為台灣首位世界咖啡大師賽總冠軍", action: "讓台灣精品咖啡水準站上國際視野" }
        ]
      },
      {
        mode: "banner-3-rows", chapterIdx: 0, chapter: "品牌初心",
        kicker: "02 · 品牌命名由來",
        title: "為什麼叫做 Simple Kaffa？",
        sub: "兩個英文單字承載了興波對一杯咖啡純粹風味的追求，以及對咖啡發源地的敬意。",
        bannerPill: "命名初心",
        summary: "**Simple** 象徵「簡單好咖啡」；**Kaffa** 源自衣索比亞傳說發現第一株咖啡樹的古老森林。",
        highlightStat: { value: "簡單好咖啡", label: "Simple + Kaffa", desc: "專注風味本質與森林系空間語言" },
        points: [
          { num: "01", title: "Simple｜簡單好咖啡", stat: "純粹風味", statLabel: "核心理念", desc: "不刻意堆砌花俏詞藻與浮誇包裝，專注將每一支生豆的風土、甜感與乾淨度做到極致", action: "讓每位客人都能輕鬆喝懂一杯好咖啡" },
          { num: "02", title: "Kaffa｜古老咖啡森林", stat: "衣索比亞", statLabel: "起源致敬", desc: "源自發現第一株咖啡樹的 Kaffa 古老森林傳說，成為興波打造都市「咖啡森林」空間靈感", action: "在門市融入老屋、木質與植物自然天光" },
          { num: "03", title: "興波｜掀起的味覺漣漪", stat: "日常共鳴", statLabel: "中文譯名", desc: "期望把比賽規格的好咖啡帶入日常生活，讓每一杯都在味蕾留下溫柔記憶波瀾", action: "打破冠軍咖啡高不可攀的距離感" }
        ]
      },
      {
        mode: "dual-nested-stat", chapterIdx: 0, chapter: "品牌初心",
        kicker: "03 · 創辦團隊核心",
        title: "吳則霖 Berg Wu & 盧嘉琦：理性數據與感性策展",
        sub: "臺大電子研究所工程背景跨界精品咖啡，用科學方法穩定守護職人的每一杯溫度。",
        summary: "吳則霖把電子實驗室的**量化紀錄思維**帶進烘豆與萃取，搭配盧嘉琦對空間與台灣風土的細膩策展。",
        highlightStat: { value: "理性 × 感性", label: "工程思維結合咖啡美學", desc: "讓好喝成為可被驗證與重現的日常標準" },
        dualGroups: [
          {
            num: "01", title: "吳則霖 · 科學數據派冠軍",
            stats: [{ value: "NTUEE", label: "臺大電子研究所工程背景" }, { value: "2016", label: "台灣首位 WBC 世界冠軍" }],
            summary: "建立水溫、研磨粒徑與**烘焙升溫曲線的完整量化紀錄**，確保門市每天每一杯都能穩定重現理想風味。"
          },
          {
            num: "02", title: "盧嘉琦 · 空間與在地風味策展",
            stats: [{ value: "2009", label: "街頭三輪車共同創辦起點" }, { value: "在地連結", label: "台灣茶韻與季節物產跨界" }],
            summary: "主導門市建築選址與品牌美學，並將台灣高山茶與在地食材融進創意飲品，建立無法取代的品牌個性。"
          }
        ],
        points: [
          { num: "01", title: "科學數據紀錄", stat: "量化萃取", statLabel: "吳則霖", desc: "系統化記錄粉水比、水溫與烘焙曲線穩定品質", action: "讓日常門店維持冠軍賽水準" },
          { num: "02", title: "感性空間與茶韻", stat: "在地策展", statLabel: "盧嘉琦", desc: "營造吧台人際對話溫度並融入台灣茶葉等食材", action: "創造獨一無二的台北精品風格" }
        ]
      },
      {
        mode: "snake-flow-8", chapterIdx: 1, chapter: "品牌歷程",
        kicker: "04 · 發展里程碑",
        title: "從街角三輪車到世界舞台的關鍵里程碑",
        sub: "自 2009 年起歷經街頭攤車、地下室首店、世界冠軍到高空門市，穩紮穩打每一步。",
        summary: "超過十五年深耕台灣精品咖啡領域，將冠軍榮耀化作遍布日常場景的咖啡森林據點。",
        highlightStat: { value: "2009 → 今", label: "十五年以上深耕歷程", desc: "始終把咖啡本身品質放在擴張之前" },
        points: [
          { num: "01", title: "2009 三輪車起家", stat: "品牌誕生", statLabel: "起步", desc: "台北街頭推著行動三輪車擺攤沖煮咖啡", action: "累積最單純直接的顧客交流" },
          { num: "02", title: "2011 東區首店開幕", stat: "實體門市", statLabel: "深耕", desc: "於台北東區成立第一間實體門市空間", action: "聚集死忠精品咖啡迷常客群" },
          { num: "03", title: "2013–15 台灣三連霸", stat: "台灣冠軍", statLabel: "備戰", desc: "連續在國內賽事奪冠並反覆赴海外進修磨練", action: "累積衝刺世界冠軍舞台底氣" },
          { num: "04", title: "2016 WBC 世界冠軍", stat: "都柏林奪冠", statLabel: "突破", desc: "吳則霖奪得台灣史上首座世界咖啡大師冠軍", action: "奠定品牌國際級精品技術聲望" },
          { num: "05", title: "2019 華山旗艦店", stat: "5 月開幕", statLabel: "地標", desc: "進駐忠孝東路二段兩層樓紅磚老宅天井空間", action: "完整實現 Kaffa 森林空間美學" },
          { num: "06", title: "2019–20 蟬聯世界第一", stat: "全球 #1", statLabel: "肯定", desc: "連兩年獲評全球 50 間最棒咖啡館第一名", action: "躍升全球旅人赴台必訪咖啡地標" },
          { num: "07", title: "2023 天空興波 88F", stat: "台北 101", statLabel: "跨界", desc: "登上 101 大樓 88 樓打造高空景觀與咖啡調酒", action: "拓展精品咖啡在夜間高空場景體驗" },
          { num: "08", title: "日常樞紐與零售版圖", stat: "全台據點", statLabel: "日常化", desc: "延伸桃園機場、高鐵站與掛耳禮盒居家產品線", action: "真正落實每天都能輕鬆喝到一杯" }
        ]
      },
      {
        mode: "photo-story-split", chapterIdx: 2, chapter: "空間體驗",
        kicker: "05 · 華山旗艦空間",
        title: "華山旗艦店：老屋裡的咖啡森林",
        sub: "台北市中正區忠孝東路二段 27 號，將歷史老屋肌理與自然光影帶進日常。",
        summary: "透過紅磚原木、兩層樓天井自然採光與中島手沖吧台，打造兼具建築溫度與咖啡香氣的都市空間。",
        highlightStat: { value: "27 號", label: "忠孝東路二段老屋再生", desc: "保留歷史建築紋理融入自然木質植栽" },
        image: spaceImg,
        points: [
          { num: "01", title: "紅磚老屋 × 木質溫潤", stat: "歷史肌理", statLabel: "建築改造", desc: "保留老建築原始磚牆與時間痕跡，搭配溫潤原木桌椅柔化空間線條", action: "取代冰冷極簡營造親切感" },
          { num: "02", title: "天井自然採光", stat: "光影變化", statLabel: "自然引入", desc: "把陽光自然引入兩層樓室內空間，隨清晨與午後時段呈現豐富光影表情", action: "讓顧客宛如置身真實森林中" },
          { num: "03", title: "中島吧台零距離", stat: "開放互動", statLabel: "吧台體驗", desc: "採開放式手沖中島舞台，讓磨豆香氣與細緻注水過程成為共同感官體驗", action: "鼓勵客人與咖啡師直接對話交流" }
        ]
      },
      {
        mode: "three-col-defense", chapterIdx: 2, chapter: "空間體驗",
        kicker: "06 · 招牌經典選單",
        title: "來興波咖啡必點的三大經典風味",
        sub: "從雙重感受的義式配方、細膩高海拔手沖單品到融合台灣茶韻的冠軍創意系列。",
        summary: "不需背誦艱深咖啡術語，菜單清楚依循香氣酸甜引導每位顧客找到最合拍的一杯。",
        highlightStat: { value: "3 大經典", label: "必點招牌類別", desc: "義式 1+1 · 藝伎單品 · 台灣創意" },
        points: [
          { num: "01", title: "義式咖啡 1+1", stat: "鎮店招牌", statLabel: "ESPRESSO + CAPPUCCINO", desc: "同一支配方豆同時出杯一杯濃縮咖啡與一杯小卡布奇諾，一次體驗黑咖啡張力與奶泡甜感。", action: "最推薦初次來訪的入門必點組合" },
          { num: "02", title: "藝伎單品手沖", stat: "花果茶香", statLabel: "GEISHA POUR-OVER", desc: "嚴選高海拔單品批次並精控水溫段數，展現細膩茉莉花香、柑橘酸質與如茶湯般乾淨尾韻。", action: "適合細品產地風土透亮感者" },
          { num: "03", title: "台灣在地創意咖啡", stat: "島嶼靈感", statLabel: "LOCAL SIGNATURE", desc: "將台灣優質茶葉與在地季節物產巧妙融入咖啡創作，延伸自吳則霖世界冠軍賽舞台思路。", action: "喝到屬於台北的獨家特調風味" }
        ]
      },
      {
        mode: "bars-insight-split", chapterIdx: 3, chapter: "烘焙工藝",
        kicker: "07 · 顧客體驗指標",
        title: "高回訪口碑背後的五大體驗支柱",
        sub: "好喝不只是比賽名次帶來的短期話題，而是每一家門市每日反覆維持高水準的結果。",
        summary: "**產區豆質與風味乾淨度**結合**穩定一致的出杯技術**，才讓世界排名第一的榮譽轉為長期熟客支持。",
        highlightStat: { value: "100%", label: "每日開吧前反覆杯測把關", desc: "不靠感覺出杯，用數據與味蕾雙重檢核" },
        points: [
          { num: "01", title: "產區生豆風土與乾淨甜感", stat: "95%", statLabel: "風味核心", desc: "追求明亮乾淨卻帶有圓潤焦糖尾韻", action: "嚴選微批次新鮮產季生豆" },
          { num: "02", title: "跨門市一致的數據萃取度", stat: "92%", statLabel: "穩定品管", desc: "依據各地水質微調濾芯與粉水比參數", action: "確保週一至週末風味穩定一致" },
          { num: "03", title: "親切不炫技的吧台風土導覽", stat: "88%", statLabel: "服務對話", desc: "用白話描述協助挑選酸甜或厚實苦甜口味", action: "消除精品咖啡生疏距離感" },
          { num: "04", title: "空間採光與森林療癒氛圍", stat: "85%", statLabel: "空間設計", desc: "自然光、紅磚木作與植栽調和出放鬆感", action: "成為朋友聚會與獨處好去處" },
          { num: "05", title: "自家烘焙豆與掛耳便利延伸", stat: "82%", statLabel: "居家延伸", desc: "把喜歡的風味帶回家隨時簡單沖出好咖啡", action: "延伸日常咖啡習慣與伴手禮選品" }
        ]
      },
      {
        mode: "chevron-pipeline", chapterIdx: 3, chapter: "烘焙工藝",
        kicker: "08 · 四道科學把關",
        title: "從生豆到杯中的四道科學把關",
        sub: "理性記錄每一段烘焙升溫曲線與水質變數，只為完整釋放咖啡豆最動人的自然甜感。",
        summary: "從源頭挑選到每日開吧前試飲，透過嚴謹四階段閉環消除人為誤差。",
        highlightStat: { value: "4 道把關", label: "從生豆到吧台的品管流程", desc: "物理紀錄 × 團隊盲飲杯測雙重校正" },
        points: [
          { num: "01", title: "產區生豆挑選", stat: "步驟 01", statLabel: "微批次嚴選", desc: "嚴選衣索比亞、巴拿馬等高潛力產區微批次生豆，檢查密度與含水狀況。", action: "挑除瑕疵豆維持純淨風味基礎" },
          { num: "02", title: "烘焙曲線數據化", stat: "步驟 02", statLabel: "即時監測", desc: "即時記錄每批次豆溫與升溫率變化曲線，追求淺中焙甜感與花果香平衡。", action: "讓理想火候曲線得以批次重現" },
          { num: "03", title: "精準研磨與水質", stat: "步驟 03", statLabel: "參數微調", desc: "依每支豆子特性微調磨豆機刻度、水質軟硬度與沖煮水溫粉水比例。", action: "最大化釋放產區芳香成分" },
          { num: "04", title: "感官杯測校準", stat: "步驟 04", statLabel: "開吧檢核", desc: "每日開吧前由咖啡師團隊反覆試飲品評，確認甜感均衡才正式出杯。", action: "守住穩定如一的冠軍品質" }
        ]
      },
      {
        mode: "four-col-nested", chapterIdx: 3, chapter: "烘焙工藝",
        kicker: "09 · 烘焙曲線細節",
        title: "咖啡烘焙升溫曲線四大核心階段",
        sub: "以電子科學記錄爐內豆溫轉折，精準拿捏淺中焙特有的潔淨酸質與蜜糖甜韻。",
        summary: "在一爆過後的發展期維持平穩熱能推進，決定了咖啡入口時是否順口不焦燥。",
        highlightStat: { value: "淺中焙", label: "興波指標烘焙定位", desc: "兼顧明亮香氣與焦糖甜感的黃金平衡點" },
        points: [
          { num: "01", title: "入豆回溫期", stat: "95°C", statLabel: "Stage 1", desc: "生豆吸熱達成內外熱能均衡準備進入烘乾", action: "打好均勻受熱基礎" },
          { num: "02", title: "脫水期", stat: "150°C", statLabel: "Stage 2", desc: "勻速散逸豆體自由水分避免外焦內生夾雜", action: "消除青草生澀雜味" },
          { num: "03", title: "梅納反應", stat: "150–196°C", statLabel: "Stage 3", desc: "胺基酸與糖類交會轉化產生堅果與花果香", action: "構築香氣與甜感主體" },
          { num: "04", title: "風味發展期", stat: "一爆後", statLabel: "Stage 4", desc: "聽見一爆脆響後精控下豆秒數保留透亮酸甜", action: "★ 核心目標：高甜感潔淨尾韻" }
        ]
      },
      {
        mode: "profile-2x2-grid", chapterIdx: 2, chapter: "空間體驗",
        kicker: "10 · 全台據點介紹",
        title: "走進不同城市場景的興波空間",
        sub: "每間門市依據所在建築性格與人群節奏，量身設計獨一無二的品飲體驗。",
        summary: "從需要靜心坐下來的**華山老宅**、台北 101 **88 樓雲端視野**到**機場高鐵旅途據點**，讓好咖啡自然出現在每個生活時刻。",
        highlightStat: { value: "多元場景", label: "旗艦 × 高空 × 旅途", desc: "打破精品咖啡只能在一種空間喝到的限制" },
        points: [
          { num: "01", title: "華山旗艦店", stat: "忠孝東路二段", statLabel: "咖啡森林", desc: "結合老屋紅磚、大片天井採光與中島手沖吧台，提供完整單品與招牌甜點。", action: "沉浸式品飲首選地標" },
          { num: "02", title: "天空興波 88F", stat: "台北 101 大樓", statLabel: "雲端夜景", desc: "位於台北 101 大樓 88 樓坐擁高空城市全景視野。", action: "獨家結合高空咖啡調酒體驗" },
          { num: "03", title: "交通樞紐據點", stat: "機場 · 高鐵", statLabel: "啟程補給", desc: "進駐桃園機場、桃園高鐵與台南高鐵等移動樞紐提供快速外帶吧台。", action: "讓出發與返程都有好咖啡相伴" },
          { num: "04", title: "百貨選品與禮盒", stat: "新光三越等", statLabel: "日常選購", desc: "陳列自家烘焙淺中深焙豆與掛耳包禮盒，提供上班族日常補貨。", action: "把門市香氣輕鬆延續進家中" }
        ]
      },
      {
        mode: "header-cards-scale", chapterIdx: 3, chapter: "烘焙工藝",
        kicker: "11 · 每日五維杯測",
        title: "開吧前團隊五維感官評分標準",
        sub: "配合物理萃取濃度調整，咖啡師每天須共同確認五大味覺維度皆達平衡。",
        summary: "只有物理參數精準且團隊感官一致通過「**平衡感**」標準的批次，才會在當天正式開放出杯。",
        highlightStat: { value: "5 維度", label: "每日感官品評檢核", desc: "香氣 · 酸質 · 甜感 · 醇厚度 · 平衡感" },
        scaleNodes: [
          { n: "1", label: "乾濕香氣" },
          { n: "2", label: "明亮酸質" },
          { n: "3", label: "焦糖甜感" },
          { n: "4", label: "滑順醇厚" },
          { n: "5", label: "整體平衡" }
        ],
        points: [
          { num: "01", title: "花果香氣清晰度", stat: "開香確認", statLabel: "嗅覺", desc: "研磨瞬間須展現乾淨花果或堅果可可乾香無陳舊味", action: "淘汰受潮或過期磨粉批次" },
          { num: "02", title: "明亮果酸不尖銳", stat: "淺焙靈魂", statLabel: "酸質", desc: "果酸應如新鮮柑橘梅果般生津爽口不咬舌", action: "過於尖澀即調整研磨變細或升溫" },
          { num: "03", title: "貫穿前後的甜感", stat: "耐喝關鍵", statLabel: "甜度", desc: "從熱飲到微溫皆應保有明顯蔗糖甜潤感受", action: "微調發展期時間與粉水比確保甜潤" },
          { num: "04", title: "餘韻乾淨度與茶感", stat: "尾韻", statLabel: "平衡", desc: "喝完口腔潔淨回甘不留苦澀與雜感負擔", action: "每日營前五分鐘團隊盲飲拍板" }
        ]
      },
      {
        mode: "matrix-table-split", chapterIdx: 3, chapter: "烘焙工藝",
        kicker: "12 · 咖啡豆款指南",
        title: "興波自家烘焙豆單分類與挑選指南",
        sub: "無論偏愛明亮白花香手沖或溫厚焦糖拿鐵，都能依焙度與調性找到最適配方。",
        summary: "從淺焙單品到深焙配方皆經自家烘焙廠精細調校，並推出充氮鎖鮮**掛耳包禮盒**照顧沒有磨豆機的顧客。",
        highlightStat: { value: "淺 / 中 / 深", label: "全焙度自家烘焙光譜", desc: "涵蓋單品手沖與日常配方拿鐵基底" },
        points: [
          { num: "01", title: "衣索比亞 / 藝伎單品", stat: "淺焙", statLabel: "花果茶香", desc: "白花香、柑橘、水蜜桃與如茶湯般澄澈質感", action: "推薦以手沖濾杯呈現細節層次" },
          { num: "02", title: "日曬果香精選批次", stat: "淺中焙", statLabel: "熱帶莓果", desc: "帶有熟莓果香、熱帶水果甜感與圓潤微酸", action: "手沖或冰鎮手沖皆相當討喜" },
          { num: "03", title: "阿寶綜合招牌配方", stat: "中焙", statLabel: "焦糖堅果", desc: "兼具焦糖可可厚度與柔和果甜，奶香融合度極高", action: "門市義式 1+1 與居家拿鐵首選" },
          { num: "04", title: "經典醇厚深焙系列", stat: "中深焙", statLabel: "黑巧奶油", desc: "極低酸度帶有黑巧克力甘甜與絲滑包覆口感", action: "適合偏好傳統美式與黑咖啡族群" }
        ]
      },
      {
        mode: "monolith-stat-split", chapterIdx: 4, chapter: "獎項與未來",
        kicker: "13 · 國際評選榮耀",
        title: "讓世界透過一杯咖啡認識台灣的關鍵成就",
        sub: "從都柏林世界賽場到國際美食旅遊權威榜單，寫下亞洲精品咖啡重要里程碑。",
        summary: "不只是得過一次冠軍，興波以長期的穩定品質**連續兩年站上全球 50 間最棒咖啡館第一名**。",
        highlightStat: { value: "1st / #1", label: "台灣首位 WBC 冠軍 × 全球最佳 #1", desc: "2016 世界賽冠軍 · 2019–2020 蟬聯榜首" },
        points: [
          { num: "01", title: "台灣首位 WBC 冠軍", stat: "2016", statLabel: "都柏林奪冠", desc: "吳則霖代表台灣勇奪世界咖啡大師賽總冠軍", action: "將台灣茶韻帶上全球最高咖啡殿堂" },
          { num: "02", title: "首次奪得全球第一", stat: "2019", statLabel: "Big 7 Travel", desc: "華山旗艦店開幕即獲全球最棒 50 間咖啡館榜首", action: "台灣咖啡空間設計獲得國際關注" },
          { num: "03", title: "強勢蟬聯世界榜首", stat: "2020", statLabel: "連兩年第一", desc: "在萬眾矚目壓力下依然蟬聯全球第一名寶座", action: "證實日常穩健出杯與體驗真實力" },
          { num: "04", title: "十五年以上持續打磨", stat: "15+ 年", statLabel: "自 2009 起", desc: "從街邊三輪攤車開始對好咖啡堅持逾十五年", action: "持續培育新生代咖啡師推動台灣文化" }
        ]
      },
      {
        mode: "bento-1-3", chapterIdx: 4, chapter: "獎項與未來",
        kicker: "14 · 文化跨界連結",
        title: "台灣風土 × 世界莊園豆的雙向品味橋樑",
        sub: "將產地農民的心血與台灣在地的島嶼物產，透過吧台串聯進城市生活裡。",
        summary: "以精挑**微批次產區豆**結合**台灣茶葉、果乾與在地食材**，打造外地旅客喝一次就記住的台灣風味。",
        highlightStat: { value: "台灣風土", label: "島嶼食材創意融合", desc: "茶韻與咖啡交會出獨一無二的台北滋味" },
        points: [
          { num: "01", title: "世界微批次產區直挑", stat: "莊園精神", statLabel: "產地連結", desc: "嚴選衣索比亞、巴拿馬等兼具風土特色與生態友善的獨立微批次生豆。", action: "讓世界各地產區特色在台灣忠實發聲" },
          { num: "02", title: "台灣茶韻融入特調", stat: "茶咖啡", statLabel: "在地跨界", desc: "運用台灣高山茶焙火與萃取概念融入創意咖啡製作層次豐富的冰熱調飲。", action: "成為世界冠軍賽至今的品牌標誌技法" },
          { num: "03", title: "高空夜間微醺探索", stat: "咖啡調酒", statLabel: "夜間延長", desc: "在 101 天空興波延伸咖啡與基酒調飲合作打破咖啡只在白天的想像。", action: "把精品咖啡風味推向台北夜生活場景" },
          { num: "04", title: "減法包裝環境友善", stat: "Simple Packaging", statLabel: "永續責任", desc: "熟豆與掛耳包設計簡潔實用減少繁複過度塑膠包裝浪費。", action: "貫徹 Simple 簡單而真誠的永續態度" }
        ]
      },
      {
        mode: "left-thesis-right-list", chapterIdx: 4, chapter: "獎項與未來",
        kicker: "15 · 經營三大難題",
        title: "走紅之後守住品質與體驗的三大策略",
        sub: "名氣帶來排隊人潮與跨據點擴展需求，團隊靠制度設計與數據校準守住初心。",
        summary: "走紅後最怕「候位太久失去寧靜、分店一多口味走鐘」，興波靠**候位分流、統一濾水規格與人才手冊**穩住品質。",
        highlightStat: { value: "3 大策略", label: "規模化下守住手作質感", desc: "不因人潮增多而對每一杯妥協" },
        points: [
          { num: "01", title: "排隊候位與外帶分流", stat: "預約分流", statLabel: "體驗保護", desc: "尖峰時段內用人潮眾多容易壓縮純外帶顧客時間", action: "設獨立外帶吧台並優化線上候位提醒節奏" },
          { num: "02", title: "跨店水質與萃取一致", stat: "標準濾水", statLabel: "品質不走鐘", desc: "老宅、高樓與車站各自水質軟硬度皆不相同", action: "各店客製軟水濾芯規格與 TDS 每日檢核" },
          { num: "03", title: "科學數據培訓咖啡師", stat: "團隊傳承", statLabel: "技藝複製", desc: "確保新加入夥伴能精準重現世界冠軍級別手法", action: "透過量化配方與團隊開吧盲飲快速校準成長" }
        ]
      },
      {
        mode: "donut-kpi-cards", chapterIdx: 4, chapter: "獎項與未來",
        kicker: "16 · 品牌四維布局",
        title: "從堂食咖啡館延伸至多元日常場景的四塊拼圖",
        sub: "不依賴單一內用座位翻桌，透過高空體驗、移動通勤與零售商品建立健康結構。",
        summary: "讓顧客無論身處**街邊旗艦、101 雲端、高鐵月台或自家客廳書桌**，都能遇見一樣標準的好咖啡。",
        highlightStat: { value: "4 大場景", label: "全方位生活觸及網", desc: "旗艦空間 · 雲端地標 · 交通通勤 · 居家選物" },
        points: [
          { num: "01", title: "都市咖啡森林堂食", stat: "華山旗艦", statLabel: "深度體驗", desc: "老宅建築結合完整手沖、義式與精緻甜點菜單", action: "建立高記憶度品牌核心文化基地" },
          { num: "02", title: "高空極致景觀據點", stat: "101 88F", statLabel: "城市地標", desc: "將單純喝咖啡升級為台灣最具高度的台北景觀體驗", action: "吸引海內外旅客與高規格商務聚會" },
          { num: "03", title: "高鐵機場快速通勤", stat: "交通樞紐", statLabel: "日常便利", desc: "以精簡動線供應高效率高品質現煮美式拿鐵", action: "切入商務人士與旅人日常移動需求" },
          { num: "04", title: "熟豆與掛耳包零售", stat: "線上 / 百貨", statLabel: "居家複利", desc: "將各焙度熱門配方化作充氮保鮮包與禮盒銷售", action: "把品牌延伸進顧客每日早晨餐桌" }
        ]
      },
      {
        mode: "horizontal-timeline", chapterIdx: 4, chapter: "獎項與未來",
        kicker: "17 · 顧客感官動線",
        title: "走進興波咖啡的四大感官時刻",
        sub: "從推開大門看見光影、聽見磨豆、近賞手沖到回家繼續沖煮的連貫記憶。",
        summary: "空間設計、吧台互動與菜單語言共同協力，讓精品咖啡成為一段毫無壓力的日常療癒時刻。",
        highlightStat: { value: "4 個時刻", label: "五感品牌記憶點", desc: "視覺空間 × 嗅覺現磨 × 手沖展演 × 日常延續" },
        points: [
          { num: "01", title: "踏入空間放慢呼吸", stat: "進門 0 分", statLabel: "視覺定調", desc: "紅磚、木質、陽光天井與大樹植栽隔絕市區吵雜", action: "自然降低緊繃感準備享受一杯好咖啡" },
          { num: "02", title: "親切明瞭風味選單", stat: "點餐 3 分", statLabel: "無門檻", desc: "清楚標示花果明亮、焦糖堅果或濃厚口感方向", action: "不須先讀懂難懂產區產字即可挑選所愛" },
          { num: "03", title: "中島吧台手沖對話", stat: "沖煮 5 分", statLabel: "互動香氣", desc: "近看電子秤與細水流繞圈注水，與吧台手聊豆子故事", action: "把等咖啡的時間變成有趣知識小旅行" },
          { num: "04", title: "帶著香氣回到日常", stat: "離店延續", statLabel: "居家再現", desc: "順手帶走同款配方掛耳或熟豆禮盒並附沖煮建議", action: "明天在家只用熱水壺就能複製今日記憶" }
        ]
      },
      {
        mode: "grid-2x2-headers", chapterIdx: 4, chapter: "獎項與未來",
        kicker: "18 · 品牌經營心法",
        title: "興波給餐飲創業與個人品牌的四項啟發",
        sub: "為什麼在連鎖咖啡林立的台北，一個從三輪攤車出發的小品牌能站上世界第一？",
        summary: "**先用極致專業證明自己，再用最親民簡單的方式走進人群生活**，是興波最具參考價值的品牌策略。",
        highlightStat: { value: "4 大啟發", label: "跨領域品牌方法論", desc: "專注核心本業比急著大規模加盟更長久" },
        points: [
          { num: "01", title: "跨界思維反成武器", stat: "工程師背景", statLabel: "差異優勢", desc: "不拘泥傳統師徒口傳心法，以工程實驗精神解構溫度烘焙變數", action: "讓品質進步速度遠超同業平均" },
          { num: "02", title: "比賽是為了練基本功", stat: "以賽促研", statLabel: "長期主義", desc: "透過備賽測試成千上萬組配方累積出門市真正穩定好喝的核心配方", action: "得獎之後立刻回歸日常吧台做減法" },
          { num: "03", title: "空間本身即無聲代言", stat: "建築策展", statLabel: "自媒體時代", desc: "捨棄大量喧嘩廣告只把旗艦老屋與高空光影打磨到極致好拍舒服", action: "靠每位來訪客人的口碑照片走向世界" },
          { num: "04", title: "尊重本土文化根基", stat: "在地轉譯", statLabel: "全球化策略", desc: "不在台灣模仿歐美咖啡館樣貌，而是自信融入紅磚、木構與台灣茶香", action: "越有台灣靈魂越容易被國際媒體看見" }
        ]
      },
      {
        mode: "quote-pillars", chapterIdx: 4, chapter: "獎項與未來",
        kicker: "19 · 品牌核心金句",
        title: "把世界級的咖啡，做成每天都能輕鬆喝到的一杯",
        sub: "技術數據與世界第一頭銜只是背後看不見的支撐，最終留下來的只有手中溫暖那一杯。",
        summary: "「**把世界級的咖啡，做成每天都能輕鬆喝到的一杯。**」",
        highlightStat: { value: "Simple Kaffa", label: "初心不變的品牌承諾", desc: "科學把關 · 空間呼吸 · 台灣風味" },
        points: [
          { num: "01", title: "Simple 純粹本質", stat: "不炫技", statLabel: "初心一", desc: "去除多餘繁複口號把力氣留在生豆與甜感上", action: "讓第一口就明確喝見乾淨好風味" },
          { num: "02", title: "Kaffa 城市森林", stat: "能呼吸", statLabel: "初心二", desc: "用陽光、老磚與原木構築都市放鬆咖啡角落", action: "留住人與人面對面交流溫度" },
          { num: "03", title: "數據守護手感", stat: "穩定一致", statLabel: "初心三", desc: "用科學紀錄陪伴每天重複上百次的手沖注水", action: "確保無論何時來訪都有水準表現" },
          { num: "04", title: "從台北走向日常", stat: "自在陪伴", statLabel: "初心四", desc: "不論華山慢坐、高鐵外帶或清晨書桌皆能隨手泡", action: "讓冠軍精品真正成為台灣人生活風景" }
        ]
      },
      {
        mode: "cover-framed-grid", chapterIdx: 4, chapter: "獎項與未來",
        kicker: "20 · 品牌資訊與參考資料",
        title: "Simple Kaffa 興波咖啡 · 造訪與資料來源",
        sub: "台北市中正區忠孝東路二段 27 號（華山旗艦店） · simplekaffa.com",
        summary: "資料參考來源：**Simple Kaffa 官方網站 (simplekaffa.com)、Shopping Design、Heho 健康**。",
        highlightStat: { value: "Welcome", label: "歡迎造訪咖啡森林", desc: "台北華山旗艦 · 101 天空興波 · 全台交通據點" },
        points: [
          { num: "01", title: "華山旗艦店", stat: "忠孝東路 27 號", statLabel: "旗艦空間", desc: "老宅兩層樓紅磚天井＋完整手沖與經典甜點", action: "體驗 Kaffa 森林空間美學首選" },
          { num: "02", title: "天空興波 88F", stat: "台北 101 大樓", statLabel: "雲端視野", desc: "高空眺望台北盆地全景並提供限定咖啡調酒", action: "建議事前線上預約高空座席" },
          { num: "03", title: "全台移動據點", stat: "機場 / 高鐵站", statLabel: "外帶補給", desc: "桃園機場與高鐵站動線旁快速供應世界級現煮杯", action: "輕鬆帶上一杯好咖啡踏上旅程" },
          { num: "04", title: "官方資訊來源", stat: "simplekaffa.com", statLabel: "官網選購", desc: "提供當季單品豆單與充氮保鮮掛耳包禮盒資訊", action: "線上選購隨時帶進每日晨間日常" }
        ]
      }
    ];
  }

  function buildLuminaPitchDeck() {
    return [
      {
        mode: "cover-split-photo", chapterIdx: 0, chapter: "市場機會",
        kicker: "LUMINA RING · SERIES A PITCH DECK",
        title: "Lumina Ring：無感微穿戴的亞洲睡眠與恢復革命",
        sub: "重僅 2.8 公克航太鈦合金無螢幕智慧戒，以指端雙波長光電感測結合 AI 恢復教練，協助都會高壓族群真正改善夜間修復。",
        summary: "上線首年已累積 **18,500 位活躍用戶**、**NT$ 4,200 萬年化營收 (ARR)**，正募集 **NT$ 6,000 萬 A 輪資金**拓展台日韓通路。",
        highlightStat: { value: "2.8 g", label: "無螢幕航太鈦金屬戒身", desc: "PSG 睡眠分期吻合 94.2% · 單次充電續航 7 天" },
        points: [
          { num: "01", title: "極致無感硬體", stat: "2.8g / 7天", statLabel: "零螢幕設計", desc: "告別夜戴智慧手錶壓手腕與每天睡前充電焦慮", action: "半年留存率高達 87% 遠超業界手環" },
          { num: "02", title: "準醫療級精度", stat: "94.2%", statLabel: "PSG 吻合度", desc: "雙波長 PPG 與微米溫度感測捕捉深睡及 HRV 變化", action: "通過睡眠醫學中心 120 例整夜雙盲驗證" },
          { num: "03", title: "訂閱商業模式", stat: "4.2×", statLabel: "LTV / CAC", desc: "硬體入門 NT$ 6,800 搭低摩擦 AI 教練月費訂閱", action: "64% 購機用戶轉換為長期付費訂閱會員" }
        ]
      },
      {
        mode: "dual-nested-stat", chapterIdx: 0, chapter: "市場機會",
        kicker: "02 · 痛點洞察",
        title: "為什麼多數人買了智慧手錶，卻在睡覺時摘掉？",
        sub: "手腕錶身的夜戴壓迫、每天一充的電量焦慮與難懂折線圖，讓消費者錯失睡眠關鍵修復數據。",
        summary: "調查顯示 **68% 傳統智慧手錶用戶在睡前摘除手錶**，使夜間 8 小時黃金修復訊號幾乎空白。",
        highlightStat: { value: "68%", label: "睡前摘除手錶使用者比例", desc: "市面需要專為「夜間無感穿戴」打造的設計" },
        dualGroups: [
          {
            num: "01", title: "手錶夜戴與續航衝突",
            stats: [{ value: "68%", label: "使用者因手腕不適在睡前摘下手錶" }, { value: "18 小時", label: "每天須趁晚上拔下充電導致睡眠紀錄斷裂" }],
            summary: "厚重金屬錶殼翻身易壓迫手腕且半夜亮光驚醒，多數人買了運動表只測了白天的步數卻測不到夜晚修復。"
          },
          {
            num: "02", title: "腕部雜訊與數據看不懂",
            stats: [{ value: "3 倍清晰度", label: "手指掌動脈訊號強度高於手腕背面" }, { value: "無行動建議", label: "傳統 App 堆滿圖表卻沒說今天該怎麼調" }],
            summary: "手指指腹微血管密集能測得穩健脈動；Lumina 將複雜數值濃縮成隔天早上 30 秒看懂的一句身體建議。"
          }
        ],
        points: [
          { num: "01", title: "夜戴壓迫摘除", stat: "68%", statLabel: "睡眠追蹤斷層", desc: "手錶過重發光且翻身卡手腕使人睡前拆下", action: "轉為 2.8g 鈦戒徹底消除皮膚異物感" },
          { num: "02", title: "電量每日焦慮", stat: "7 天續航", statLabel: "免拆待機", desc: "傳統智能表一天一充常在夜晚放上充電盤", action: "每週僅需 35 分鐘快充保留連續紀錄" },
          { num: "03", title: "腕背血管訊號弱", stat: "3× 清晰", statLabel: "光電優勢", desc: "腕骨結構與錶帶鬆動易在翻身時掉失訊號", action: "指腹雙向光學路徑抗干擾能力更強" },
          { num: "04", title: "複雜圖表疲乏", stat: "1 句話教練", statLabel: "易讀轉譯", desc: "上班族看不懂生硬 HRV 毫秒曲線背後意義", action: "早上簡報直接提示昨晚影響睡眠的習慣原因" }
        ]
      },
      {
        mode: "bars-insight-split", chapterIdx: 0, chapter: "市場機會",
        kicker: "03 · 市場規模評估",
        title: "搶佔台日韓高壓白領睡眠經濟藍海",
        sub: "亞洲高工時都會族群積極尋找科技健康解方，但歐美品牌定價破萬且缺少中文在地教練。",
        summary: "Lumina 以 **NT$ 6,800**（僅歐美龍頭戒一半價格）搭配本土化中文教練與試戴服務，三年目標鎖定 **NT$ 180 億 SOM 市場**。",
        highlightStat: { value: "NT$ 180億", label: "台日韓核心可獲市場 (SOM)", desc: "以 50% 親民價格切出歐美高價戒未覆蓋族群" },
        points: [
          { num: "01", title: "亞太整體睡眠與預防科技市場 (TAM)", stat: "84%", statLabel: "亞太高成長領域", desc: "預防保健支出快速由治療疾病轉向居家日常管理", action: "非手錶形式之無感戒為增速最快品類" },
          { num: "02", title: "台日韓都會高意識受雇白領 (SAM)", stat: "62%", statLabel: "淺眠困擾族群", desc: "逾六成一線城市知識工作者願為改善睡眠品質付費", action: "更偏好能配正裝與日常穿搭的飾品級外型" },
          { num: "03", title: "Lumina 三年可獲市場份額 (SOM)", stat: "45%", statLabel: "預計轉換訂閱", desc: "切入對生活質感敏感、關注經期恢復或過勞管理族群", action: "透過電商預購與健檢機構聯名加速滲透" },
          { num: "04", title: "歐美進口競品留下之定價缺口", stat: "50%", statLabel: "價格優勢幅度", desc: "歐美戒售價連稅逾一萬四台幣且欠缺在地尺寸更換網", action: "掌握台灣精密製造鏈兼顧親民價格與高毛利" }
        ]
      },
      {
        mode: "banner-3-rows", chapterIdx: 1, chapter: "產品技術",
        kicker: "04 · 核心產品方案",
        title: "Lumina Ring 三層一體化無感睡眠系統",
        sub: "堅持把 0 螢幕做到極致優雅，將全部重量與工程預算投資在精準感測與好懂的軟體體驗。",
        bannerPill: "產品設計",
        summary: "不做縮小版手錶，而是打造一枚「**外觀宛如極簡對戒、夜間無聲守護神經恢復的生理雷達**」。",
        highlightStat: { value: "0 螢幕", label: "不打擾睡眠的微穿戴哲學", desc: "專注夜間靜音採樣 × 早晨 30 秒重點簡報" },
        points: [
          { num: "01", title: "航太級 Grade 5 鈦合金微殼", stat: "2.55mm 超薄", statLabel: "工業設計", desc: "比市場同級智慧戒再薄 15%，內側低敏樹脂灌封與皮膚柔和貼合。", action: "整天敲擊鍵盤或握手皆宛若配戴經典飾品戒" },
          { num: "02", title: "指端雙波長光電＋0.01°C 熱敏計", stat: "醫療準級", statLabel: "雙重感測", desc: "綠光心率搭紅外線血氧再加上精微皮膚體溫漂移梯度校正算法。", action: "提前預警隱性發燒發炎與追蹤女性排卵期" },
          { num: "03", title: "早安恢復簡報與生活微調教練", stat: "2.4 分鐘", statLabel: "極低摩擦力", desc: "每天醒來只提供準備度總分與昨晚三個核心影響生活習慣因子。", action: "告訴使用者今天該衝刺工作或提早放鬆減負" }
        ]
      },
      {
        mode: "bento-1-3", chapterIdx: 1, chapter: "產品技術",
        kicker: "05 · 微型精密結構",
        title: "2.8 公克輕巧戒圈內的四大硬體工程突破",
        sub: "依賴台灣頂尖精密模具與軟板電池供應鏈，突破微型指環最難克服的防水與防旋讀數問題。",
        summary: "從客製弧形電芯、5ATM 全氣密灌膠到內置離線快閃記憶體，維持 24 小時全天候不間斷記錄。",
        highlightStat: { value: "2.55 mm", label: "超纖薄一體成型厚度", desc: "兼顧配戴手指伸展舒適度與 7 天超長續航" },
        points: [
          { num: "01", title: "客製弧度柔性鋰電芯", stat: "7 天續航", statLabel: "低功耗電芯", desc: "貼合圓弧內壁的定製電池配合低功耗藍牙晶片，快充座僅需 35 分鐘即能充滿。", action: "旅遊出差一週出門無需攜帶專屬充電線" },
          { num: "02", title: "防旋轉三點微凸內環", stat: "貼合穩定", statLabel: "結構專利", desc: "內側極微凸光學導窗確保戒指不隨洗手或睡眠翻滾偏移手指正腹血管。", action: "配戴兩分鐘即自然服貼並消除滑動掉訊號" },
          { num: "03", title: "100 公尺全氣密 5ATM 防水", stat: "全天候免脫", statLabel: "真空封裝", desc: "通過冷熱水溫差與洗手精洗滌劑長時間浸泡測試，完全無接縫進水疑慮。", action: "洗澡、泡湯與海泳皆無須拔下戒子" },
          { num: "04", title: "內置離線 7 日波形快取", stat: "2MB 快閃", statLabel: "飛航備份", desc: "未連線手機狀態下可安全加密存儲連續整週生理感測脈搏特徵點資料。", action: "開啟手機飛航安心睡覺隔早開啟 App 即刻同步" }
        ]
      },
      {
        mode: "four-col-nested", chapterIdx: 1, chapter: "產品技術",
        kicker: "06 · 臨床驗證數據",
        title: "醫學中心多導睡眠圖 (PSG) 雙盲對照成績",
        sub: "與台灣睡眠實驗室合作蒐集 120 位成年受試者整夜多導腦波儀同步配對資料之盲測統計。",
        summary: "在最難區分的深睡與快速動眼 (REM) 分期項目，指端 Lumina 均顯著超越市售傳統手腕裝置。",
        highlightStat: { value: "94.2%", label: "與醫院腦波 PSG 整體吻合度", desc: "具備支援預防保健與專業諮詢的真實信賴力" },
        points: [
          { num: "01", title: "靜止心率吻合度", stat: "96.4%", statLabel: "vs ECG", desc: "整夜每分鐘心跳讀數平均誤差低於 ±0.8 bpm 水準", action: "★ 核心強項：捕捉熟睡最低心率谷底" },
          { num: "02", title: "四期睡眠分期", stat: "91.8%", statLabel: "vs PSG 腦波", desc: "清楚區分深眠修復、作夢 REM 與微覺醒比例", action: "助使用者釐清為何睡滿 8 小時依然疲累" },
          { num: "03", title: "心率變異 HRV", stat: "r = 0.95", statLabel: "相關係數", desc: "RMSSD 取樣高度同步醫院貼片電極黃金標準", action: "準確反映前天重訓與交感神經修復負荷" },
          { num: "04", title: "體表微溫偏移", stat: "±0.05°C", statLabel: "核心校正", desc: "扣除深夜冷氣室溫漂移單獨抽離出核心體溫趨勢", action: "女性週期預測精準高於傳統耳溫舌溫法" }
        ]
      },
      {
        mode: "chevron-pipeline", chapterIdx: 1, chapter: "產品技術",
        kicker: "07 · AI 教練軟體工作流",
        title: "從無聲採樣到早晨一句具體建議的四段轉換",
        sub: "讓使用者不需具備醫學知識，每天花不到三分鐘就能完成一天生理節律校準。",
        summary: "透過簡單明確的生活回饋機制，使半年用戶依然保持驚人的 **87% 每週開啟習慣**。",
        highlightStat: { value: "2.4 分鐘", label: "每日平均瀏覽體驗時間", desc: "高價值歸因簡報創造 87% 半年高黏著留存" },
        points: [
          { num: "01", title: "無聲高頻自動感測", stat: "250 Hz", statLabel: "步驟 01", desc: "偵測靜止臥床自動開始精密記錄指端動脈與動作頻率。", action: "免手動按開始睡覺按鈕徹底融入生活" },
          { num: "02", title: "醒來背景極速去雜訊", stat: "3 秒同步", statLabel: "步驟 02", desc: "扣除個人長週期身體基礎基準線換算成今日恢復準備分。", action: "分數直接呈現在手機桌布極簡小工具" },
          { num: "03", title: "AI 歸因生活干擾習慣", stat: "行為連結", statLabel: "步驟 03", desc: "比對過去記錄點出昨晚晚吃消夜或過晚重訓對深睡衝擊。", action: "讓抽象健康知識變成對自己身體的頓悟" },
          { num: "04", title: "給出今日最佳作息提議", stat: "減法建議", statLabel: "步驟 04", desc: "建議本日工作專注時段分配並提前預約今夜放鬆黃金入睡窗。", action: "形成每日微調、持續睡得更好的正向循環" }
        ]
      },
      {
        mode: "matrix-table-split", chapterIdx: 2, chapter: "商業模式",
        kicker: "08 · 競爭矩陣定位",
        title: "市面主流穿戴與智慧戒產品競爭定位對照",
        sub: "在設計質感、配戴重量、中文服務支援度與價格甜蜜點上精準卡位空白地帶。",
        summary: "憑藉台灣製造良率把價格壓在歐美對手的 **50%**，同時享有 **58%** 健康初始硬體毛利率。",
        highlightStat: { value: "58%", label: "Lumina Ring 初始硬體毛利", desc: "價格更具親和力同時保有利潤支撐出海" },
        matrixTable: {
          headers: ["品牌類型", "定價級距", "配戴感與續航", "在地睡眠優勢定位"],
          rows: [
            ["Lumina Ring (本案)", "NT$ 6,800", "2.8g / 7天 / 無感", "亞太最薄鈦戒 · 中文 AI 教練"],
            ["歐美龍頭戒品牌", "NT$ 14,500+", "4g+ / 月費另計高", "全英文分析 · 無在地尺寸保固"],
            ["科技廠全能智慧表", "NT$ 12,900+", "32g / 一天一充", "功能多但睡覺卡腕且螢幕耗電"],
            ["平價塑料運動手環", "NT$ 1,200", "外觀塑膠易敏", "難搭正裝 · 數據僅粗略推估"]
          ],
          highlightRow: 0,
          highlightCol: 1,
          thresholdTitle: "亞太定價與毛利平衡點",
          thresholdStat: "NT$ 6,800",
          thresholdNote: "價格僅歐美競品一半卻仍保有 **58% 硬體毛利率**",
          conclusionTitle: "難以被抄襲的綜合門檻",
          conclusionBody: "歐美高價戒難以下調售價搶攻亞洲首購；低價手環受限光路精度無法建立專業醫療合作與訂閱付費價值。"
        },
        points: [
          { num: "01", title: "Lumina Ring (本產品)", stat: "NT$ 6,800", statLabel: "高性價極簡", desc: "2.8g 無螢幕超薄鈦戒搭載中文個人教練與 7 天續航", action: "亞太都會男女無痛跨入智慧戒首選" },
          { num: "02", title: "歐美龍頭戒品牌", stat: "NT$ 14,500+", statLabel: "高定價壁壘", desc: "加計運費關稅過昂且介面語言衛生習慣全偏歐美生活型態", action: "高價阻隔多數亞洲潛在都會顧客" },
          { num: "03", title: "高階智慧型手錶", stat: "NT$ 12,900+", statLabel: "腕戴負荷", desc: "夜間通知光害與每日充電週期導致不適合長期追蹤睡眠", action: "Lumina 反而與白天戴手錶者形成互補" },
          { num: "04", title: "百元低價塑膠手環", stat: "NT$ 1,200", statLabel: "精度有限", desc: "感測模組受翻身運動偽影干擾大且難搭配正式商務穿著", action: "無法支撐高留存長期付費軟體商業價值" }
        ]
      },
      {
        mode: "monolith-stat-split", chapterIdx: 2, chapter: "商業模式",
        kicker: "09 · 單位經濟模型",
        title: "軟硬整合與 B2B 雙輪驅動的獲利引擎",
        sub: "不只賺一次性硬體毛利，更依靠 AI 教練訂閱複利推高單一顧客終身貢獻度 (LTV)。",
        summary: "目前 **64% 硬體消費者在免月費期過後轉為付費會員**，使單客終身價值 LTV 達 CAC 的 **4.2 倍**。",
        highlightStat: { value: "4.2×", label: "LTV / CAC 健康倍數", desc: "平均不到 5 個月回收單筆廣告獲客成本" },
        points: [
          { num: "01", title: "硬體入門與雙人禮盒", stat: "NT$ 6,800", statLabel: "58% 毛利率", desc: "官網與精品通路直銷附贈試戴卡確保一次送對尺寸", action: "單賣硬體即創造穩健正向現金流" },
          { num: "02", title: "Lumina Care 進階訂閱", stat: "64% 轉換", statLabel: "NT$ 180 / 月", desc: "基礎昨晚數據免費；進階疾病趨勢預測與月報開放會員訂閱", action: "享有軟體高達 86% 毛利之持續複利營收" },
          { num: "03", title: "企業高階健檢福利方案", stat: "B2B2C", statLabel: "團購簽約", desc: "科技業與顧問公司採購贈送員工搭配團隊壓力疲勞健康看盤", action: "單次簽約 50 至 300 枚大幅降低獲客費" },
          { num: "04", title: "專科醫療與運動指導聯營", stat: "生態加值", statLabel: "報表匯出", desc: "支持與診所營養師一鍵共享睡眠生理日誌優化生活治療介入", action: "提高特定高黏著社群之長期會員不流失度" }
        ]
      },
      {
        mode: "donut-kpi-cards", chapterIdx: 3, chapter: "成長實績",
        kicker: "10 · 實戰市場牽引力",
        title: "過去 12 個月真實出貨與活躍穿戴成長指標",
        sub: "團隊已度過早期眾籌與試產磨合期，邁入製造良率穩定與口碑自然擴散軌道。",
        summary: "累計已服務超過 **18,500 名真實活躍穿戴者**，且藉由試戴套環流程將退換貨率控制在驚人的 **2.1% 以內**。",
        highlightStat: { value: "87%", label: "半年持續配戴高留存", desc: "自然親友口碑轉介紹佔總新增訂單達 34%" },
        points: [
          { num: "01", title: "累計付費出貨活躍人數", stat: "18,500+", statLabel: "真實客戶", desc: "準時交付台灣首批與早期海外體驗訂單零重大延宕", action: "量產良率已穩定爬坡維持在 96.8% 以上" },
          { num: "02", title: "年化經常性收入 (ARR)", stat: "NT$ 4,200萬", statLabel: "季度複成長", desc: "近四季保持平均 38% 季增長動能快速逼近營運損平點", action: "驗證品牌定價策略與亞洲消費接受力" },
          { num: "03", title: "親友推薦分享自然訂單", stat: "34%", statLabel: "自然流量", desc: "用戶日常因戒指外形受到詢問而自發分享睡醒準備分數", action: "使廣告單一獲客成本壓在 NT$ 3,200 以內" },
          { num: "04", title: "先寄試戴指圍塑環機制", stat: "< 2.1%", statLabel: "極低退貨", desc: "先花 48 小時試戴不同戒圍再正式寄出成品鋁盒鈦戒", action: "徹底解決網購穿戴戒指尺寸不合最大痛點" }
        ]
      },
      {
        mode: "horizontal-timeline", chapterIdx: 3, chapter: "成長實績",
        kicker: "11 · 亞太出海路線圖",
        title: "從台灣出發跨越日韓與新加坡的亞太擴張節奏",
        sub: "依循地緣文化與高壓消費能力相似性，循序打通東亞高意識健康都會市場。",
        summary: "已完成台灣站穩腳跟與健檢連鎖簽約，接下來 **18 個月將以日本、韓國及新加坡為擴張核心引擎**。",
        highlightStat: { value: "100,000+", label: "2027 年底累計會員目標", desc: "建立亞太最大亞洲生活習慣睡眠數據庫" },
        points: [
          { num: "01", title: "站穩台灣精品通路", stat: "2026 Q1–Q3", statLabel: "已完成", desc: "上線直營官網與設立設計選物門市試戴專櫃累積首批萬名粉絲", action: "打通全尺度快速試戴與在地保固更換網" },
          { num: "02", title: "醫療健檢企業採購啟動", stat: "2026 Q4", statLabel: "已簽約", desc: "攜手大型連鎖健檢中心將智慧戒納入年度中高階主管健康專案", action: "帶來穩定高轉換率長期企業訂閱會員池" },
          { num: "03", title: "日本 Makuake 與設計展店", stat: "2027 H1", statLabel: "籌備就緒", desc: "推出完整日文版介面與日本職人極簡包裝搶攻東京高壓力上班族", action: "對接超過 40 家設計複合百貨實體驗店" },
          { num: "04", title: "韓國與新加坡全面跨出", stat: "2027 H2", statLabel: "規模成長", desc: "發表韓文英文 AI 語意教練與 NFC 支付 Gen 3 次世代款式", action: "邁向十萬付費穿戴用戶開啟 Series B 視野" }
        ]
      },
      {
        mode: "profile-2x2-grid", chapterIdx: 3, chapter: "成長實績",
        kicker: "12 · 核心客群畫像",
        title: "四大高轉換主力使用者輪廓觀察",
        sub: "透過 18,500 位早期買家問卷回饋，團隊精準看見誰最離不開 Lumina Ring。",
        summary: "不同於一般科技配件男客居多，Lumina 的購買者中**女性比例高達 52%**，成為品牌極強社群推手。",
        highlightStat: { value: "52% 女性", label: "打破 3C 穿戴產品男女結構", desc: "美型珠寶感與經期預測贏得女性高評價" },
        points: [
          { num: "01", title: "都會風格女性上班族", stat: "34%", statLabel: "核心客群一", desc: "重視搭配西裝洋裝美觀度與免量基礎體溫就能預測生理經期", action: "最常推坑姊妹與伴侶購買成對情侶組合" },
          { num: "02", title: "高壓工程師與顧問主管", stat: "31%", statLabel: "核心客群二", desc: "用早上恢復分數決定何時該早睡減少加班以免陷入高壓職業過勞", action: "Lumina Care 年訂付費率超過 75%" },
          { num: "03", title: "進階運動與馬拉松跑者", stat: "22%", statLabel: "核心客群三", desc: "夜間利用 HRV 評估身體發炎與恢復進度判斷當天是否適合高強度課表", action: "日常睡覺上班配戴彌補運動錶空白時段" },
          { num: "04", title: "子女送給長輩之關懷禮", stat: "13%", statLabel: "核心客群四", desc: "買給怕戴塑膠防走失老人表但重視心率體溫變化的體面退休爸媽", action: "透過家庭授權在異常體溫漂移時即時通知" }
        ]
      },
      {
        mode: "header-cards-scale", chapterIdx: 1, chapter: "產品技術",
        kicker: "13 · 專利技術牆",
        title: "防止競爭者快速跟進的四道硬軟整合壁壘",
        sub: "微小指環涉及極端密集物理成型與演算法雜訊消去門檻，建立超過一年半先發防護牆。",
        summary: "從**結構彈性線路專利**到**逾百萬晚亞洲作息睡眠資料庫**，形成硬體規格外更難被複製的軟實力。",
        highlightStat: { value: "120萬+ 晚", label: "亞洲獨家睡眠脈搏語料", desc: "相較歐美模型對台灣作息與午睡判斷更精準" },
        scaleNodes: [
          { n: "P1", label: "柔性佈線專利" },
          { n: "P2", label: "防手抖降噪算法" },
          { n: "P3", label: "亞洲百萬晚語料" },
          { n: "P4", label: "零錯誤試圍體驗" }
        ],
        points: [
          { num: "01", title: "微曲度柔性佈線封裝專利", stat: "硬體專利", statLabel: "高良率", desc: "解決小型彎曲主板長期受力容易微裂造成光電元件提早失效頑疾", action: "使產品預期耐用年限提升至三年以上" },
          { num: "02", title: "動態水腫與翻身偽影演算法", stat: "核心演算法", statLabel: "高信噪比", desc: "自動補償夜間手掌溫度微膨脹與戒圈些微空隙之光影衰減偏差", action: "保持各階段精準脈搏提取不中斷" },
          { num: "03", title: "亞洲本土化作息訓練語料", stat: "120萬+ 晚", statLabel: "數據壁壘", desc: "涵蓋亞洲常見高壓補眠、零散分段睡眠與亞熱帶氣溫特徵訓練集", action: "分數回饋更貼近台日韓真實生活步調" },
          { num: "04", title: "標準化指圍寄測低退貨網", stat: "營運壁壘", statLabel: "規模擴張", desc: "先郵寄低成本測圍套盒並線上自動配號大幅減輕跨國退換貨風險", action: "支持迅速登入無門市跨境電商國家" }
        ]
      },
      {
        mode: "stepped-bars-4", chapterIdx: 2, chapter: "商業模式",
        kicker: "14 · 風險防禦架構",
        title: "企業擴張過程的四大風險識別與緩衝設計",
        sub: "正視消費性硬體在供應鏈、法規合規與電池老化壽命上的實務挑戰，預先設計安全墊。",
        summary: "透過明確**法規主張劃分**、**雙廠關鍵零件保量簽約**與 **Gen 3 舊換新計劃**，化解硬體新創常見脆弱點。",
        highlightStat: { value: "零召回", label: "嚴格品保交付紀錄", desc: "建構完備安全規範與會員生命週期方案" },
        points: [
          { num: "01", title: "雙供應商關鍵光感備料契約", stat: "供應鏈", statLabel: "風險備援", desc: "避免單一半導體大廠交期波動拖累季節性促銷檔期與群募交貨", action: "已與兩家一線封測與感測供應商完成簽約" },
          { num: "02", title: "明確區隔非二級醫材宣傳邊界", stat: "法遵安全", statLabel: "合規定位", desc: "所有 App 與文案界定為「生活健康促進與長期個人趨勢觀察工具」", action: "確保穩健進駐亞太多國消費通道而不受阻" },
          { num: "03", title: "金融等級端到端個人生理加密", stat: "資安合規", statLabel: "隱私護盾", desc: "心跳睡眠波形資料皆行脫敏分庫存放並給予使用者隨時一鍵刪除權利", action: "完全符合 GDPR 與日本個人資訊保護基準" },
          { num: "04", title: "會員兩年期滿半價換新計畫", stat: "舊換新", statLabel: "續訂保固", desc: "因應微型電池使用約六百次充電循環後蓄電力隨物理規律下降", action: "憑舊戒優惠升規新世代機型同時鎖住訂閱流" }
        ]
      },
      {
        mode: "grid-2x2-headers", chapterIdx: 3, chapter: "成長實績",
        kicker: "15 · 實戰創辦團隊",
        title: "跨越精密硬體、生醫演算法與品牌體驗的核心團隊",
        sub: "既有把硬體準時量產交付的工程硬功夫，又有讓品牌跨越性別打動消費者的人文眼光。",
        summary: "核心團隊曾共同打造並量產百萬級規模國際穿戴設備，與台灣供應鏈大廠具備長期默契信任關係。",
        highlightStat: { value: "8+ 年", label: "核心四人平均產業資歷", desc: "具備完整從 0 到 10 萬量產與上市經驗" },
        points: [
          { num: "01", title: "執行長 · 陳柏宇", stat: "CEO", statLabel: "策略募資", desc: "前全球穿戴產品線總監主導千萬美金級市場規劃與大中華品牌談判", action: "熟稔軟硬整合成長與企業 B2B2C 導入" },
          { num: "02", title: "技術長 · 林思妤", stat: "CTO", statLabel: "生醫演算法", desc: "生醫電子博士專攻光電脈搏除噪與睡眠神經修復模型建構訓練", action: "主導北醫臨床對照試驗與四項專利申請" },
          { num: "03", title: "硬體副總 · 張志遠", stat: "VP Hardware", statLabel: "量產製造", desc: "深耕台灣微組裝精密供應鏈十五年將首版試產迅速推升近九成七良率", action: "嚴控生產週期與零件單體製造採購成本" },
          { num: "04", title: "設計增長總監 · 許雅婷", stat: "Head Design", statLabel: "消費品牌", desc: "主導無感飾品外型設計與簡單好懂的每日清晨三十秒摘要互動流程", action: "促成半數女性客群與三成親友自然分享率" }
        ]
      },
      {
        mode: "photo-story-split", chapterIdx: 2, chapter: "商業模式",
        kicker: "16 · B2B2C 生態延伸",
        title: "從個人健康穿戴延伸至運動科學與預防醫療場域",
        sub: "連續數個月的靜止心率與睡眠趨勢紀錄，對專業機構來說比一年一次的單點體檢更有價值。",
        summary: "正與**國內外大型健檢中心、保險科技與職業競技隊伍**合作試點，開拓純消費硬體之外的高毛利數據價值。",
        highlightStat: { value: "B2B2C", label: "跨界生態商機擴張", desc: "健檢機構 · 職業運動 · 職場福祉" },
        points: [
          { num: "01", title: "職業運動隊伍疲勞與時差調控", stat: "競技體能", statLabel: "實戰試點", desc: "教練透過全隊晨間 HRV 掌握長途客場征戰選手生理恢復就緒狀態", action: "動態微調訓練強度防範疲勞性運動拉傷" },
          { num: "02", title: "高階預防健康檢驗追蹤閉環", stat: "健檢機構", statLabel: "醫療連動", desc: "結合健檢抽血報告搭配居家三個月持續夜間紀錄呈現更完整健康圖譜", action: "作為尊榮健檢套組差異化加值核心服務" },
          { num: "03", title: "女性科技孕前備孕週期輔助", stat: "專科合作", statLabel: "垂直生態", desc: "以 0.01 度體溫趨勢追蹤取代每天醒前含測口溫之傳統辛苦作法", action: "成為增長最迅速且續訂意願最強細分群" },
          { num: "04", title: "企業輪班人員健康保護專案", stat: "職場福祉", statLabel: "企業採購", desc: "幫助科技輪班與高工時顧問業即時關懷團隊睡眠債累積過勞訊號", action: "打造企業守護人才健康兼具隱私的新福利" }
        ]
      },
      {
        mode: "vertical-columns-split", chapterIdx: 3, chapter: "成長實績",
        kicker: "17 · 三年財務成長軌跡",
        title: "未來三年出貨規模與訂閱軟體營收雙重躍升",
        sub: "隨硬體出貨倍增與老客戶訂閱累積疊加，純高毛利軟體貢獻度將從一成四翻倍成長。",
        summary: "預估 **2027 年營收達成 NT$ 1.85 億元**、2028 年邁向 **4.6 億元規模**，展現軟硬雙飛輪的槓桿威力。",
        highlightStat: { value: "NT$ 4.6億", label: "2028 年亞太領跑營收預測", desc: "目標累計用戶跨越十六萬人、淨利率破兩成" },
        points: [
          { num: "01", title: "2026 年基礎實績", stat: "4,200萬", statLabel: "1.8萬活躍", desc: "台灣市場站穩腳跟並達成健康單體單位利潤表現", action: "完成產線磨合跨近營運損益平衡點" },
          { num: "02", title: "2027 年亞太起飛", stat: "1.85億", statLabel: "6.5萬活躍", desc: "日本通路順利上線搭企業團單推動業績翻升逾四倍", action: "訂閱軟體佔整體毛利貢獻比顯著攀升" },
          { num: "03", title: "2028 年全面規模", stat: "4.6億", statLabel: "16萬活躍", desc: "日韓星三大跨境樞紐成熟加上 Gen 3 支付換機潮啟動", action: "預估企業整體淨利率達到健康 22% 以上" },
          { num: "04", title: "軟體訂閱營收佔比", stat: "28% 比重", statLabel: "86% 毛利", desc: "隨累積活躍用戶突破十萬訂閱現金流即可支撐核心研發", action: "形成不受硬體折扣戰影響的穩固底座" }
        ]
      },
      {
        mode: "bars-insight-split", chapterIdx: 4, chapter: "募資規劃",
        kicker: "18 · A 輪資金分配",
        title: "本輪募資 NT$ 6,000 萬精準用途與比例分配",
        sub: "每一元投資資金皆鎖定具體技術升級與亞太出海銷售里程碑，力求極大化資本運用效率。",
        summary: "本輪資金預計支持公司穩健推進 **18 個月關鍵期**，達成十萬枚累計銷量並啟動下輪擴張談判。",
        highlightStat: { value: "NT$ 6,000萬", label: "Series A 目標募集金額", desc: "七成精準投向次世代研發與日韓市場破冰" },
        points: [
          { num: "01", title: "次世代 Gen 3 感測模塊與法規認證研發", stat: "40%", statLabel: "技術領先", desc: "開發體積再減輕感測模組、非接觸付款 NFC 天線與法規申請", action: "持續擴大技術差距護城河" },
          { num: "02", title: "日本、韓國跨境上線及品牌通路行銷推廣", stat: "30%", statLabel: "海外出海", desc: "投入 Makuake 群募宣傳、東京體驗快閃店及在地健康內容合作", action: "迅速搶佔十萬級東亞先發用戶群" },
          { num: "03", title: "多尺碼鈦合金外殼量產模具與安全備貨", stat: "20%", statLabel: "產能供給", desc: "支應跨八個戒圍尺碼安全庫存週轉確保各大促檔期不斷貨", action: "穩固準時交付品質口碑" },
          { num: "04", title: "關鍵 AI 生醫資料科學家與 B2B 業務擴編", stat: "10%", statLabel: "團隊強化", desc: "補強長週期疲勞預測算法科學家及企業福祉通道業務專才", action: "推升進階會員轉訂與企業大單進帳" }
        ]
      },
      {
        mode: "banner-dashed-split", chapterIdx: 4, chapter: "募資規劃",
        kicker: "19 · 18 個月驗證計畫",
        title: "資金到位後下一個 18 個月四大里程碑驗收點",
        sub: "我們用清晰透明的季度交付檢核基準與投資夥伴緊密同步推進。",
        bannerPill: "投資里程碑",
        summary: "核心檢核點為第 18 個月完成「**累計交付十萬枚、日本設計選物店進駐破 40 家、年化經常收入突破新台幣一億**」。",
        highlightStat: { value: "100,000 枚", label: "18 個月出貨總目標", desc: "奠定亞太智慧健康戒第一領跑品牌" },
        points: [
          { num: "01", title: "Month 06｜Gen 3 工程定型", stat: "硬體定案", statLabel: "節點一", desc: "完成新世代感測模組試產驗證並啟動睡眠異常風險模型升級", action: "同步報名多項國際工業設計評選大獎" },
          { num: "02", title: "Month 09｜日本眾籌大檔開賣", stat: "出海破冰", statLabel: "節點二", desc: "日本首波線上突破千萬日圓並進駐超過四十家東京高質感選品店", action: "確立跨海雙引擎直營現金流平衡路徑" },
          { num: "03", title: "Month 15｜累計跨越十萬活躍", stat: "規模躍升", statLabel: "節點三", desc: "橫跨台日活躍配戴總數突破十萬大關累積亞洲最大真實睡眠資料庫", action: "開啟戰略保險夥伴與健康保險大單合作" },
          { num: "04", title: "Month 18｜ARR 突破台幣一億", stat: "商業成熟", statLabel: "節點四", desc: "純軟體與 B2B2C 授權占比穩超五成並展開下輪成長資本對接", action: "替前期 A 輪投資者締造穩健倍數成長" }
        ]
      },
      {
        mode: "cover-framed-grid", chapterIdx: 4, chapter: "募資規劃",
        kicker: "20 · THANK YOU & CONTACT",
        title: "讓好好睡覺，成為這代人最無痛的每日健康投資",
        sub: "Lumina Ring Series A 募資團隊 · founders@lumina-ring.example · 現場備妥實品與 App 歡迎親自試戴",
        summary: "誠摯邀請看好**亞洲預防健康與無感微穿戴科技**的投資夥伴，共同成就十萬用戶與下一個睡眠時代！",
        highlightStat: { value: "Series A", label: "募資 NT$ 6,000 萬開放洽談", desc: "備有完整北醫 PSG 比對資料與財務模型包" },
        points: [
          { num: "01", title: "臨床精度已驗證", stat: "94.2%", statLabel: "PSG 一致", desc: "醫療研究級精度融入 2.8g 航太鈦合金無感防水戒圈", action: "半年留存高達 87% 徹底解決手錶夜戴痛點" },
          { num: "02", title: "健康單位經濟體", stat: "4.2×", statLabel: "LTV / CAC", desc: "58% 硬體高毛利結合 64% 付費軟體長尾訂閱複利效應", action: "目前年經常營收 ARR 已穩步突破 NT$ 4,200 萬" },
          { num: "03", title: "深耕亞洲市場優勢", stat: "50% 定價", statLabel: "在地上場", desc: "價格僅歐美龍頭一半並精通台灣製造鏈與東亞中文體驗", action: "精準吃下台日韓高意識上班族巨大藍海需求" },
          { num: "04", title: "盡職調查與試戴體驗", stat: "實機測試", statLabel: "歡迎交流", desc: "誠摯歡迎安排深度技術檢閱、財務模型對帳與現場指圍試戴", action: "期待與理念契合夥伴共同加速亞太健康生活圈" }
        ]
      }
    ];
  }

  function getDeckPlan(recipeOrId, pageOverrides = {}, topicId = "ai-security", assetBase = "./assets/") {
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
      chapters = custom.chapters || ["核心主題", "現況脈絡", "方法架構", "重點數據", "結論行動"];
    } else if (topicId === "cafe-brand") {
      list = buildCafeBrandDeck(assetBase);
      chapters = ["品牌初心", "品牌歷程", "空間體驗", "烘焙工藝", "獎項與未來"];
    } else if (topicId === "lumina-pitch") {
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

  function get20SlidePlan(recipeOrId, pageOverrides = {}, topicId = "ai-security", assetBase = "./assets/") {
    return getDeckPlan(recipeOrId, pageOverrides, topicId, assetBase);
  }

  function render20Slides(deckEl, recipeOrId, pageOverrides = {}, topicId = "ai-security", assetBase = "./assets/") {
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
