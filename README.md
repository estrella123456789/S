# Slide Atelier — 克制一致、零填充的網頁簡報設計與原生 PPTX 匯出系統

## 作業展示與發布

- [專案介紹與擴充流程](project.html)：說明規則如何對應網站功能。
- [可匯入範例](examples/rules-demo.json)：三頁資料，示範同類內容沿用相同版面，且不附加圖片或數據。
- [繳交文字與 GitHub Pages 發布步驟](SUBMISSION.md)：發布後填入實際 Repository 與網頁網址。

此專案是靜態網站，不需安裝套件或建置。將完整專案放在公開 Repository 根目錄，於 Settings → Pages 選擇從 main 分支的根目錄部署即可。公開部署狀態須以 GitHub Pages 的實際結果為準。

本機啟動：`python -m http.server 8765`，開啟 `http://127.0.0.1:8765/`。下載範例 JSON，從工作室匯入功能上傳並按「解析並套用」，即可驗證新增內容流程。

以 [AGENTS.md](AGENTS.md) 與 [DESIGN_CATALOG.md](DESIGN_CATALOG.md) 規範驅動的純前端簡報系統：將 **`1280×720` 等比舞台引擎**（[stage.css](engine/stage.css)、[deck.js](engine/deck.js)）、**4 套鎖定協調美學風格**、**10 種核心版面**、**零填充資料匯入引擎**（[importer.js](engine/importer.js)）與 **逐元素 `.pptx` 匯出器**（[pptx-exporter.js](engine/pptx-exporter.js)）清楚分層；支援在網頁舞台直接拖拉編修與改字，並匯出每個物件皆獨立可編輯的 PowerPoint 檔案。

---

## 一、核心設計理念

1. **克制與一致，而非為變而變**：
   - 整份簡報鎖定單一視覺語言，相同性質的內容使用相同版面（不強制相鄰頁面換版面）。
   - 每頁維持 **1 個視覺焦點**、**最多 1 層容器**（無盒中盒嵌套）、**約 30%+ 呼吸留白**，以及 **最多 3–4 個要點**（每點約 30 字內，超過則拆頁）。
2. **零填充匯入（Zero-Fabrication）**：
   - 嚴禁自動編造假數字、假百分比圖表或 `要點 01`／`PART 01` 等佔位標籤；沒有真實數據就不畫圖表。
   - 匯入純文字／Markdown／文件時，絕不自動塞入不相關的預設圖片，亦不重複複製句子或硬截斷文意。
3. **統一的 Design Tokens**：
   - 採用 **5 階字級尺度**（`52px / 32px / 22px / 17px / 13px`）與 **`8px` 間距基準**；移除底部 5 顆章節膠囊列；`kicker` 為選填；封面無頁碼、內頁右下角依序顯示 `01..N`。

---

## 二、4 套鎖定風格 × 10 種核心版面

* **4 套鎖定風格組合（Style Presets）**（每套將骨架、色票與字體設計為協調整體）：
  1. `editorial-magazine`：人文雜誌編輯風（燕麥暖白 × 陶土棕 × 思源宋體）
  2. `botanical-line`：自然方格線繪風（米白方格 × 松林翠綠 × 思源黑體）
  3. `academic-thesis`：經典學術簡報風（純淨紙白 × 深海靛藍 × 思源宋體）
  4. `keynote-dark`：科技發表會暗黑風（深邃夜黑 × 冰川青藍 × 現代無襯線）
* **10 種核心版面（Core Layouts）**：
  `cover-centered`、`cover-split-photo`、`banner-3-rows`、`three-col-defense`、`dual-nested-stat`（單層對比）、`before-after-compare`、`bars-insight-split`、`matrix-table-split`、`horizontal-timeline`、`photo-story-split`。

---

## 三、檔案結構與本地預覽

- [index.html](index.html)：互動設計工作室（選擇主題與 4 套鎖定風格、切換 10 種核心版面、匯入資料生成簡報、舞台直接編修並匯出 `.pptx`）。
- `decks/studio-deck.html`：承接工作室狀態的全螢幕放映與匯出頁（支援 `←`/`→`、`O` 總覽、`N` 備忘、`E` 現場改字、PDF 與 `.pptx` 匯出）。
- `decks/showcase-20.html`、`decks/01-design-atlas-20.html`：內建示範簡報入口。
- 內建三組示範主題：`ai-security`（中小企業生成式 AI 資安研究）、`cafe-brand`（品牌策展）、`lumina-pitch`（智慧穿戴產品企劃）。

本地啟動方式：
```powershell
python -m http.server 8765 --directory "E:\slide-atelier"
```
開啟瀏覽器前往 `http://127.0.0.1:8765/index.html` 即可使用。

---

## 四、作業繳交參考說明

* **專案簡介**：
  **Slide Atelier** 是一個以 [AGENTS.md](AGENTS.md) 規範驅動的網頁簡報設計與匯出系統。系統將 `1280×720` 共用舞台引擎、4 套鎖定美學風格、10 種支援優雅降級的核心版面、零填充內容匯入器與逐元素 `.pptx` 匯出器分離設計，讓使用者與 AI 能以一致、克制且高可讀性的排版原則快速產出、微調並匯出簡報。
* **簡短說明：如果之後要新增一個新的頁面或內容，你設計的規則可以如何幫助 AI 繼續完成？**：
  我在 [AGENTS.md](AGENTS.md) 定義了清楚的「**Canonical Slide Content 資料契約**」、「**零填充與單一焦點鐵則**」以及「**Design Tokens（5 階字級與 8px 間距）**」：AI 讀完文件後不需重寫任何舞台或匯出引擎，只需依實際內容填寫標題與精簡要點（無數據不畫圖、無圖片不硬塞、超過 3–4 點即自動拆頁），為整份簡報選定 4 套鎖定風格之一並對應 10 種核心版面，最後透過 headless 瀏覽器輸出 PNG 截圖逐頁檢查溢出、留白與一致性即可完成擴充。
