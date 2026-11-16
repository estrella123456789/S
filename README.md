# Slide Atelier

以 `AGENTS.md` 定義開發規則的純前端簡報工作室。把設計規則與內容格式固定下來，讓 AI 能持續新增主題，沿用同一套風格、版面及驗收流程。

- [公開網站](https://estrella123456789.github.io/S/)
- [GitHub Repository](https://github.com/estrella123456789/S)
- [專案介紹與擴充流程](project.html)
- [AI 開發規則](AGENTS.md)
- [設計規格](DESIGN_CATALOG.md)
- [作業繳交說明](SUBMISSION.md)

## 可以做什麼

- 選擇四套完整風格，使用規格書中的十種核心版面。
- 匯入文字、Markdown、JSON 與文件內容，預覽自己的簡報。
- 在 1280 × 720 等比舞台上修改文字、拖拉物件與調整樣式。
- 將編修內容帶到放映頁，使用翻頁、總覽與 PDF 列印。
- 逐元素匯出可編輯的 PowerPoint，保留文字與圖形物件。

內建「專案規則導覽、學習筆記方法、閱讀分享流程」示範以同一套規則延伸不同內容。示範不使用虛構商業數據或外部品牌模板文字。

## 本機啟動

不需安裝套件或建置。在專案根目錄執行：

```powershell
python -m http.server 8765
```

開啟 `http://127.0.0.1:8765/`。Google Fonts、文件解析函式庫及 PPTX 匯出函式庫需要網路；載入失敗時，相關功能會顯示錯誤。核心頁面和 JSON／文字匯入使用專案本身的程式。

## 如何新增內容

1. 讓 AI 先讀取 `AGENTS.md`。
2. 參考 [examples/rules-demo.json](examples/rules-demo.json)，建立 `examples/英文小寫主題名稱.json`。
3. 使用 `{ "title": "簡報名稱", "pages": [...] }`；每頁填寫 `title`、核心版面的 `mode` 與需要的內容。
4. 在工作室按「匯入資料」，貼上或上傳 JSON，按「解析並套用」。
5. 選擇風格並逐頁確認文字、對齊和留白。同類內容沿用同一版面。

沒有來源的數字、圖片與選填欄位留空。要點過多會拆頁；不要以重複文字填滿版面。JSON 格式錯誤或缺少必填標題時，會顯示修正訊息。

匯入內容與舞台編修保存在目前瀏覽器，不會自動同步到 GitHub 或其他裝置。請保留原始 JSON，並在需要時下載 PPTX。舊版產生的 `.pptx` 檔不列入公開原始碼；最新檔案請由網站匯出。

## 檔案分工

| 路徑 | 責任 |
| --- | --- |
| `AGENTS.md` | 專案目的、內容契約、開發與驗收規則 |
| `DESIGN_CATALOG.md` | 鎖定風格、字級、間距與版面規格 |
| `index.html` | 互動工作室及舞台編修 |
| `project.html` | 專案說明與新增內容流程 |
| `examples/*.json` | 可分享、可重用的內容資料 |
| `engine/renderer.js` | 鎖定風格、核心版面與內建主題 |
| `engine/importer.js` | 文件解析、資料正規化與瀏覽器儲存 |
| `engine/stage.css`、`engine/deck.js` | 等比舞台、放映與列印 |
| `engine/pptx-exporter.js` | DOM 轉原生 PowerPoint 物件 |
| `decks/studio-deck.html` | 承接工作室內容的放映頁 |
| `tools/` | 內容與瀏覽器驗收工具 |

## 驗收

```powershell
node --check engine/renderer.js
node --check engine/importer.js
node --check engine/template-svgs.js
node tools/check-content.cjs
```

修改畫面後還必須實際截圖檢視。開發驗收工具 `node tools/browser-audit.mjs` 使用 Windows 上的 Edge、Python 與 Node.js 22 以上，將本機截圖和結果存入不發布的 `.verification/`。

## GitHub Pages

網站由 Repository 根目錄發布。在 GitHub 的 Settings → Pages 選擇 Deploy from a branch → main → / (root)。所有站內連結使用相對路徑，適用 `/S/` 子路徑。`.nojekyll` 讓原始靜態檔案直接發布。
