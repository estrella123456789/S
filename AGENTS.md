# AGENTS.md — Slide Atelier 簡報設計規範與擴充指南

> 本文件定義 **Slide Atelier** 的設計規則、視覺風格、標準內容格式與版面擴充方式，讓 AI 能持續新增不同主題簡報，沿用同一套風格與版面系統，並於網頁上即時切換不同呈現方式。

---

## 1. 專案目標與核心架構

1. **設計與內容分離**：
   - 將「內容資料」、「版面呈現」、「風格系統」與「`1280×720` 舞台／匯出引擎」明確分層。
   - 同一份簡報內容可在網頁上即時切換不同版面呈現方式，並保留已編輯的文字與版面狀態。
2. **風格一致與版面節奏**：
   - 整份簡報選定同一套協調的視覺風格；相同性質的內容採用相同版面，維持穩定一致的閱讀節奏。
   - 每頁只保留 1 個視覺焦點，強調色集中於該焦點元素，保留約 30% 以上呼吸留白，容器最多 1 層。
3. **內容充實且精煉（禁止空洞與文字牆）**：
   - 單頁內文總字數控制在 **80–120 字以內**，每頁安排 **3–4 個要點**；每個要點以 **2–6 字核心關鍵詞** 為標題（`title`），說明（`desc`）控制在 **18–25 字內**（可用 `**重點詞**` 標註強調），並補上具體指標或結論（`stat` / `action`）。
   - **數據與結構優先**：來源包含真實數字、百分比、步驟流程或優缺點對比時，優先選用對應的視覺化版面（比例條、時間軸、對比雙欄、矩陣表）；內容較多時拆分為多頁呈現，不編造假數據。
   - 封面頁不顯示頁碼；內頁右下角依序顯示 `01..N`。

---

## 2. 目錄結構與職責

```text
E:\slide-atelier\
├── AGENTS.md                   # 設計規範、標準內容格式與 AI 擴充指南
├── DESIGN_CATALOG.md           # 4 套風格、Design Tokens 與版面設計規格書
├── index.html                  # 簡報設計工作室（主題選擇、風格鎖定、版面切換、舞台編修與 PPTX 匯出）
├── project.html                # 專案架構與擴充說明頁
├── examples/                   # 標準化簡報內容資料（JSON）
├── engine/
│   ├── stage.css               # 1280×720 等比舞台與 16:9 @media print 樣式
│   ├── deck.js                 # 全螢幕放映、鍵盤導覽、總覽與列印調度
│   ├── content-state.js        # 內容欄位與舞台編修狀態保存
│   ├── pptx-exporter.js        # 逐元素 DOM -> 原生 PowerPoint Shape/TextBox/Image 匯出
│   ├── template-svgs.js        # 背景線繪與幾何裝飾 SVG 圖層
│   └── renderer.js             # 核心渲染引擎：風格定義、Design Tokens 與多版面渲染
├── assets/                     # 簡報專用攝影與視覺素材
└── decks/
    ├── studio-deck.html        # 承接工作室內容的全螢幕放映頁
    ├── showcase-20.html        # 獨立主題簡報入口
    └── 01-design-atlas-20.html # 獨立主題簡報入口
```

---

## 3. 視覺風格系統與 Design Tokens

### 3.1 四套鎖定風格（Style Presets）
每套風格將背景材質、色彩系統與字體搭配定義為單一整體，確保整份簡報視覺統一：

| Style ID | 名稱 | 色彩與材質基調 | 字體搭配 | 適用場景 |
| :--- | :--- | :--- | :--- | :--- |
| `editorial-magazine` | **人文雜誌編輯風** | 燕麥暖白底 × 陶土棕強調色 | 思源宋體（`Noto Serif TC`）主標 ＋ 無襯線正文 | 品牌策展、文化敘事、專題導讀 |
| `botanical-line` | **自然方格線繪風** | 米白工程方格底 × 松林翠綠強調色 | 思源黑體（`Noto Sans TC`） | 方法論、工作坊、流程拆解 |
| `academic-thesis` | **經典學術簡報風** | 純淨紙白底 × 深海靛藍強調色 | 思源宋體（`Noto Serif TC`）＋等寬數據字 | 學術論文、實證研究、技術報告 |
| `keynote-dark` | **科技發表會暗黑風** | 深邃夜黑底 × 冰川青藍強調色 | 現代無襯線（`Noto Sans TC`） | 產品發表、募資企劃、系統架構 |

### 3.2 Design Tokens
- **字級尺度（Type Scale）**：`52px`（封面主標）／ `32px`（內頁標題）／ `22px`（區塊小標與焦點指標）／ `17px`（正文內容）／ `13px`（頁碼與輔助標註）。
- **間距基準（Spacing Base）**：以 `8px` 為最小單位（`8 / 16 / 24 / 32 / 48px`）。
- **行內樣式規則**：行內 `style="..."` 屬性內禁止出現雙引號（字體名稱一律以單引號 `'...'` 包夾）。

---

## 4. 版面設計系統（可即時切換呈現方式）

系統提供 **10 種核心版面**（並於 `COMPOUND_LAYOUTS` 支援共 **30 種** 可切換呈現方式）：

- **封面與開場**：`cover-centered`（經典居中封面）、`cover-split-photo`（左文右圖封面）
- **結構與條列**：`banner-3-rows`（導讀橫幅＋條列）、`three-col-defense`（三欄要點並列）
- **對比與雙欄**：`dual-nested-stat`（單層雙欄重點對照）、`before-after-compare`（現況 vs 對策雙欄對比）
- **數據與表格**：`bars-insight-split`（水平比例條＋洞察結論）、`matrix-table-split`（結構矩陣表＋結論）
- **時間軸與圖文**：`horizontal-timeline`（水平時間軸）、`photo-story-split`（圖片＋故事重點分欄）

> 所有呈現元素皆須標記 `data-el="..."`，確保切換版面時內容不遺失，並能相容舞台拖拉編修與原生 `.pptx` 逐元素匯出。

---

## 5. 標準內容格式（Canonical Slide Content）

所有主題資料皆遵守統一的 JSON／物件契約。每一頁應具備清晰的結論標題、導讀副標、核心摘要與 **3–4 個結構完整的要點**（含關鍵詞標籤、說明與行動結論），以維持與內建示範簡報一致的資訊密度與視覺完成度：

```json
{
  "title": "結論式簡報標題",
  "pages": [
    {
      "mode": "cover-centered",
      "kicker": "PRESENTATION BRIEF",
      "title": "簡報封面主標題",
      "sub": "一句說明主題核心價值與背景脈絡的副標題",
      "points": [
        { "num": "01", "title": "章節重點一", "stat": "核心定位", "desc": "簡短一句說明" },
        { "num": "02", "title": "章節重點二", "stat": "關鍵方法", "desc": "簡短一句說明" },
        { "num": "03", "title": "章節重點三", "stat": "預期成果", "desc": "簡短一句說明" }
      ]
    },
    {
      "mode": "three-col-defense",
      "kicker": "01 · 核心分析",
      "title": "結論式內頁標題（一句話講清本頁重點）",
      "sub": "補充說明本頁脈絡與問題背景",
      "summary": "整頁最核心的收斂結論（可用 **重點詞** 自動強調著色）",
      "highlightStat": { "value": "3 項策略", "label": "核心架構", "desc": "指標補充說明（僅於有真實指標時填寫）" },
      "points": [
        { "num": "01", "title": "要點標題一", "stat": "關鍵詞或真實指標", "statLabel": "分類標籤", "desc": "具體說明這項要點的原因或現況", "action": "對應的具體作法或結論" },
        { "num": "02", "title": "要點標題二", "stat": "關鍵詞或真實指標", "statLabel": "分類標籤", "desc": "具體說明這項要點的原因或現況", "action": "對應的具體作法或結論" },
        { "num": "03", "title": "要點標題三", "stat": "關鍵詞或真實指標", "statLabel": "分類標籤", "desc": "具體說明這項要點的原因或現況", "action": "對應的具體作法或結論" }
      ],
      "image": null
    }
  ]
}
```

---

## 6. AI 擴充指南：如何持續新增主題與版面設計

1. **新增簡報主題（三步驟工作流）**：
   - **步驟一（大綱規劃）**：先依來源素材規劃投影片頁數、每頁結論式標題與選用的版面 ID（同類內容維持相同版面，數據／流程／對比優先對應視覺化版面）。
   - **步驟二（生成與註冊）**：依第 5 節標準格式建立 `examples/<topic>.json`（每頁 3–4 個結構完整要點，不編造數據或無關圖片），並透過註冊模組或 `engine/renderer.js` 註冊至 `TOPICS` 與 `getDeckPlan()`。
   - **步驟三（雙重檢查）**：確認於 4 套鎖定風格及網頁版面切換下皆能完整渲染，並維持 `engine/content-state.js` 編修保存正常。
2. **新增版面設計（於網頁上切換不同呈現方式）**：
   - 於 `engine/renderer.js` 的 `COMPOUND_LAYOUTS`（及 `CORE_LAYOUTS`）註冊新版面定義 `{ id, label, cat, desc }`。
   - 實作對應渲染函數 `layoutXxx(c, tpl)` 並掛載至 `RENDER_BY_MODE`（與 `renderCompactProse` 視需求適配），所有文字與區塊加上 `data-el="..."` 屬性。
   - 放映頁設定面板會顯示 `COMPOUND_LAYOUTS` 的版面；工作室以 `CORE_LAYOUTS` 為主。新增核心版面須同時註冊至核心清單，工作室才會自動顯示。
3. **保護共用引擎**：
   - 修改版面或新增主題時，維持 `engine/stage.css`、`engine/deck.js`、`engine/content-state.js` 與 `engine/pptx-exporter.js` 的等比舞台與逐元素匯出契約（透明背景維持 `null` 不轉為 `#000000`）。

---

## 7. 驗收標準

1. **程式與內容契約檢查**：
   - `node --check engine/renderer.js`、`node --check engine/content-state.js`、`node --check engine/template-svgs.js` 通過。
   - `node tools/check-content.cjs` 通過，無 `undefined`、`NaN` 或未處理的空欄位錯誤。
2. **實際畫面截圖檢查**：
   - 使用無頭瀏覽器（Edge / Chrome `--headless=new --screenshot` 或 Playwright）輸出 `1280×720` 投影片與工作室畫面截圖，確認無文字溢出或重疊、單一視覺焦點、留白充足、對齊一致，且切換版面後內容完整保留。
3. **實際 PowerPoint 檢查**：
   - 按網站下載按鈕取得 `.pptx`，再用 PowerPoint 開啟並輸出預覽；檢查字級、換行、圖表比例與邊框。檔案能解壓縮或包含文字物件，不等於視覺效果已通過。
   - 舞台的 `1280px` 對應匯出的 `10in`；字級應依 `px × 10 / 1280 × 72` 換算成 pt，不能直接套一般螢幕的 px→pt 係數。保留網頁實際換行與各側邊框，透明底不可誤變黑底。
   - 實際範例：`examples/solar-system.json` 保留來源、大綱、計算與七頁內容；`engine/topics.js` 共用載入資料。執行 `node tools/nasa-audit.mjs` 實際下載，再執行 `powershell -File tools/powerpoint-preview.ps1` 產生桌面 PowerPoint 預覽。放映控制列必須在主題資料與投影片建立完成後初始化。

本機啟動：於專案根目錄執行 `python -m http.server 8765`，開啟 `http://127.0.0.1:8765/`。目前網站不提供文件匯入；新主題須依上述資料格式由 AI 註冊。畫面驗收：`node tools/browser-audit.mjs`；字體工具驗收：`node tools/typography-audit.mjs`。
