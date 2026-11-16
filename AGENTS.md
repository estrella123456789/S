# AGENTS.md — Slide Atelier 結構化簡報設計與開發規範

## 專案目的與可重複擴充入口

### 保護既有內容與版面目錄

網站保留三份原有完整二十頁範例，以及三十種實際可用版面；下文十種核心版面為推薦子集，其餘二十種為延伸設計，均需在工作室及放映頁開放選擇。修復功能時不可擅自刪除、縮寫或替換既有範例，也不可把不同版面統一改成同一套條列外觀。格式示範與教學 JSON 應另存於 examples，不能取代既有內容。保留原範例明確指定的圖片；新匯入內容仍遵守不自動補圖的規則。原範例中的研究及商業數據不視為已查證事實，新內容不得據此編造延伸數據。

本專案讓使用者用同一套設計規則製作不同主題的網頁簡報。新增內容優先採資料驅動方式，沿用既有舞台、渲染與匯出引擎。

- `project.html`：向訪客說明專案目的、規則及擴充流程。
- `examples/rules-demo.json`：不含個資、數據或圖片的三頁匯入範例。
- `examples/<英文小寫主題名稱>.json`：新增內容的命名與存放位置，使用小寫英文及連字號。
- `SUBMISSION.md`：作業繳交內容及 GitHub Pages 部署流程，不填入虛構公開網址。

新增主題時先參考範例的 `{ "title": "簡報名稱", "pages": [...] }` 外層結構，再依下方 Canonical Slide Content 建立各頁。從工作室匯入 JSON 預覽，確認沒有補圖、編造數字或句子截斷。匯入結果只保存在使用者瀏覽器；要讓其他人重用內容，必須一併提供 JSON 檔。網站發布採靜態根目錄部署，所有站內連結及素材路徑使用相對路徑。

> AI 開發與擴充簡報前的必讀工作手冊。本文件定義 **Slide Atelier** 的核心設計哲學、零填充資料契約（Canonical Slide Content）、4 套鎖定美學風格、10 種核心版面、Design Tokens 與視覺截圖驗收迴圈。

---

## 1. 核心設計哲學：克制與一致（Restraint & Consistency）

1. **同一份簡報使用單一視覺語言**：
   - 整份簡報應鎖定同一套協調的風格組合（Style Preset），**相同類型的內容應使用相同的版面**，建立可預期的閱讀節奏。
   - **明確廢除「相鄰頁面不得重複版面」規則**：切勿為了追求表面變化而強行輪換版面。
2. **單一視覺焦點與呼吸留白**：
   - 每一頁投影片只能有 **1 個** 視覺焦點；強調色（Accent）僅能用於該焦點元素，禁止使用 `i % 2` 交替變色或到處塗色裝飾。
   - 每頁須保留 **約 30% 以上** 的呼吸留白，避免滿版塞字。
   - 容器最多 **1 層**（Max 1 container layer），嚴禁「盒中盒」多層嵌套框。
3. **精簡文字密度，寧可拆頁也不硬塞**：
   - 每頁最多 **3–4 個要點**，每個要點控制在 **約 30 字以內**。
   - 若內容過多，應主動拆分為兩頁，嚴禁硬截斷句子或縮小字級硬塞。

---

## 2. 零填充鐵則（Zero-Fabrication Rule）

1. **嚴禁編造任何數字、百分比或佔位標籤**：
   - 禁止自動生成假數據、假百分比圖表，或無意義的機器標籤（如 `要點 01`、`重點 01`、`PART 01`）。
   - 若來源資料沒有真實數據，不得渲染圖表或統計框；選填欄位留空時，版面必須能**優雅降級（Graceful Degradation）**。
2. **嚴禁附加無關預設圖片**：
   - 透過 [importer.js](engine/importer.js) 匯入簡報時，除非使用者明確提供圖片，否則嚴禁自動掛載不相關的展示圖片（如 `hero-pourover.jpg` 或 `cafe-space.jpg`）。
3. **嚴禁重複填字與截斷句子**：
   - 禁止將同一句話重複填入 `sub`、`summary`、`desc`、`action` 欄位來湊版面。
   - 禁止在句子中間硬截斷（mid-thought truncation）。
4. **頁碼、導讀與去識別化規範**：
   - **封面頁不顯示頁碼**；**內頁右下角依序顯示 `01..N`**。
   - `kicker` 為選填欄位，無內容時不佔位；**已移除底部 5 顆章節膠囊列**。
   - 全專案嚴禁包含任何個人姓名、學號、系級等 PII，亦嚴禁抄襲外部模板品牌字樣。
5. **保護共用舞台與逐元素匯出引擎**：
   - 禁止破壞 [stage.css](engine/stage.css)、[deck.js](engine/deck.js) 與 [pptx-exporter.js](engine/pptx-exporter.js) 的 `1280×720` 等比舞台、互動編修與逐元素原生 `.pptx` 匯出機制（禁止將透明 `rgba(0,0,0,0)` 背景誤轉為 `#000000`）。

---

## 3. 目錄結構與職責

```text
E:\slide-atelier\
├── AGENTS.md                   # 本專案設計哲學、資料契約、擴充指南與驗收標準
├── DESIGN_CATALOG.md           # 4 套鎖定風格、Design Tokens 與 10 種核心版面規格書
├── README.md                   # 專案概述、使用方式與作業說明
├── index.html                  # 互動簡報設計工作室（風格鎖定切換、舞台編修、匯入與 PPTX 匯出）
├── engine/
│   ├── stage.css               # 1280×720 等比舞台與 16:9 @media print 匯出樣式
│   ├── deck.js                 # 全螢幕簡報控制列、鍵盤導覽、現場編輯與匯出調度
│   ├── pptx-exporter.js        # 逐元素 DOM -> 原生 PowerPoint Shape/TextBox/Image 轉譯器
│   ├── template-svgs.js        # 背景線繪與幾何裝飾 SVG 圖層
│   ├── importer.js             # 零填充匯入解析引擎（純文字 / Markdown / JSON / .docx / .pptx / .pdf）
│   └── renderer.js             # 核心渲染引擎：4 套鎖定風格、Design Tokens 與 10 種核心版面
├── assets/                     # 咖啡品牌示範簡報專用攝影素材（僅供明確指定時使用）
└── decks/
    ├── studio-deck.html        # 承接 index.html 狀態的全螢幕放映頁
    ├── showcase-20.html        # 示範簡報入口
    └── 01-design-atlas-20.html # 示範簡報入口
```

---

## 4. 四套鎖定風格組合（Curated Style Presets）

本系統捨棄「模板 × 配色 × 字體自由亂配」的失控做法，改採 **4 套經完整協調設計的鎖定美學組合**（每套將骨架、色票與字體設計為單一整體）：

| Preset ID | 名稱 | 色彩與材質基調 | 字體搭配 | 適用場景 |
| :--- | :--- | :--- | :--- | :--- |
| `editorial-magazine` | **人文雜誌編輯風** | 燕麥暖白底 × 陶土棕強調色 | 思源宋體（`Noto Serif TC`）＋無襯線正文 | 品牌策展、文化敘事、深度評論 |
| `botanical-line` | **自然方格線繪風** | 米白工程方格底 × 松林翠綠強調色 | 思源黑體（`Noto Sans TC`） | 方法論、教育訓練、產品設計拆解 |
| `academic-thesis` | **經典學術簡報風** | 純淨紙白底 × 深海靛藍強調色 | 思源宋體（`Noto Serif TC`）＋等寬數據字 | 學術論文、實證研究、技術報告 |
| `keynote-dark` | **科技發表會暗黑風** | 深邃夜黑底 × 冰川青藍強調色 | 現代無襯線（`Noto Sans TC`） | 產品發表、募資簡報、系統架構 |

---

## 5. 十種核心版面與 Design Tokens

### 5.1 Design Tokens 與視覺層級
- **5 階字級尺度（Type Scale）**：`52px`（封面主標）／ `32px`（內頁標題）／ `22px`（區塊小標與焦點指標）／ `17px`（正文內容）／ `13px`（頁碼與輔助標註）。
- **間距基準（Spacing Base）**：以 `8px` 為最小單位（`8 / 16 / 24 / 32 / 48px`）。
- **層級規範**：最多 1 層容器、單一焦點使用強調色、無底部 5 顆章節膠囊列、`kicker` 選填、封面不編碼、內頁 `01..N`。

### 5.2 十種核心版面（Core Layouts）
- **封面**：`cover-centered`（經典居中封面）、`cover-split-photo`（左文右圖封面）
- **結構與條列**：`banner-3-rows`（導讀橫幅＋條列）、`three-col-defense`（三欄要點並列）
- **對比與雙欄**：`dual-nested-stat`（已重構為**單層**雙欄對比，禁止盒中盒嵌套）、`before-after-compare`（現況 vs 對策雙欄對比）
- **數據與表格**：`bars-insight-split`（水平比例條＋洞察結論）、`matrix-table-split`（結構矩陣表＋結論）
- **時間軸與圖文**：`horizontal-timeline`（水平時間軸）、`photo-story-split`（圖片＋故事重點分欄）

---

## 6. Canonical Slide Content 資料契約與 AI 擴充指南

### 6.1 標準化投影片物件格式
在 [renderer.js](engine/renderer.js) 新增主題或透過 [importer.js](engine/importer.js) 產出資料時，每頁物件結構如下（非必要欄位可省略或為 `null`，版面須優雅降級）：

```js
{
  mode: "banner-3-rows",          // 30 種目錄版面 ID 之一；優先使用 10 種核心（同類內容保持相同版面）
  title: "結論式簡報標題",          // 必填：精簡明確的一句話結論
  kicker: "SECTION TAG",          // 選填：短標籤（不填則不佔位）
  sub: "補充說明副標題",            // 選填：不得與 summary/desc 重複
  summary: "整頁核心摘要",          // 選填：簡短收斂（勿與 sub/desc 重複）
  highlightStat: {                // 選填：僅在有真實數據時提供，嚴禁編造
    value: "94.2%",
    label: "主核心指標",
    desc: "指標說明"
  },
  points: [                       // 建議最多 3–4 項，每項約 30 字內
    { title: "要點標題", stat: "", desc: "精簡一句說明（無需硬填 action）" }
  ],
  image: null,                    // 選填：僅於使用者提供或示範主題明確需要時填入
  dualGroups: null,               // 選填：供 dual-nested-stat 單層雙欄使用
  matrixTable: null,              // 選填：供 matrix-table-split 使用
  r2Bars: null                    // 選填：供 bars-insight-split 使用（僅限真實數值）
}
```

### 6.2 AI 如何依本手冊擴充內容、風格與版面
1. **新增簡報主題（Topics）**：
   - **免改程式碼**：使用者可直接於 `index.html` 使用資料匯入功能，貼上文字／Markdown／JSON 或上傳文件，由 `importer.js` 依零填充規則切分頁數（每頁 ≤ 4 點）。
   - **程式註冊**：在 `engine/renderer.js` 新增 `buildXxxDeck()` 並註冊至 `TOPICS` 與 `getDeckPlan()`；為整份簡報選定單一鎖定風格，並依每頁內容性質對應 10 種核心版面（同類內容用同版面）。
2. **新增鎖定風格（Style Preset）**：
   - 必須同時定義完整的「背景紋理/骨架 + 色票（含明確對比度）+ 字體搭配」，並遵守 5 階字級與 `8px` 間距基準，不得拆開拼湊半成品。
3. **新增核心版面（Core Layout）**：
   - 於 `engine/renderer.js` 註冊版面定義並實作渲染函數，所有可編輯節點須標記 `data-el="..."` 以相容舞台拖拉編修與 `pptx-exporter.js`。
   - 必須遵守「最多 1 層容器」、「單一焦點著色」、「~30%+ 留白」與「選填欄位缺席時優雅降級」。

---

## 7. 驗收標準與視覺回饋迴圈（Visual Feedback Loop）

每次修改渲染邏輯、風格、版面或新增簡報後，**必須通過以下程式檢查與實際視覺截圖檢查**：

1. **語法與結構檢查**：
   - `node --check E:\slide-atelier\engine\renderer.js`、`node --check E:\slide-atelier\engine\importer.js`、`node --check E:\slide-atelier\engine\template-svgs.js` 皆通過。
   - 行內 `style="..."` 屬性內禁止出現雙引號（字體名稱一律以單引號 `'...'` 包夾）。
   - 無 `undefined`、`NaN`、假數據或重複填字。
2. **實際渲染 PNG 與視覺檢視（必要步驟）**：
   - 啟動本地伺服器後，使用 headless Edge / Chrome（如 `msedge.exe --headless=new --screenshot=... --window-size=1280,720`）或 Playwright 將實際投影片渲染為 PNG 截圖並逐頁檢視：
   - [ ] **無文字溢出或截斷**：所有標題、要點與標籤皆完整顯示於 `1280×720` 安全區內，無重疊、無句子被硬截斷。
   - [ ] **單一視覺焦點**：每頁只有 1 個視覺重心與強調色焦點，無 `i % 2` 雜訊配色。
   - [ ] **約 30%+ 呼吸留白**：畫面舒展、無滿版壓迫感。
   - [ ] **對齊與層級乾淨**：文字與卡片邊緣對齊一致，容器最多 1 層（無盒中盒）。
   - [ ] **全簡報一致性**：整份簡報風格統一，同類頁面使用相同版面。
