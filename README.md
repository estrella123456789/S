# Slide Atelier

以 `AGENTS.md` 定義開發規則的純前端簡報工作室。把設計規則與內容格式固定下來，讓 AI 能持續新增主題，沿用同一套風格、版面及驗收流程。

- [公開網站](https://estrella123456789.github.io/S/)
- [GitHub Repository](https://github.com/estrella123456789/S)
- [專案介紹與擴充流程](project.html)
- [AI 開發規則](AGENTS.md)
- [設計規格](DESIGN_CATALOG.md)
- [作業繳交說明](SUBMISSION.md)

## 可以做什麼

- 選擇四套完整風格，使用十種核心與二十種延伸版面，共三十種實際版面。
- 匯入文字、Markdown、JSON 與文件內容，預覽自己的簡報。
- 在 1280 × 720 等比舞台上修改文字、拖拉物件與調整樣式。
- 將編修內容帶到放映頁，使用翻頁、總覽與 PDF 列印。
- 逐元素匯出可編輯的 PowerPoint，保留文字與圖形物件。

保留原有三份完整二十頁範例：「中小企業生成式 AI 資安」、「Simple Kaffa 興波咖啡」、「Lumina Ring 智慧戒」，共六十頁。範例沿用專案原始內容與明確指定的示範圖片；其中研究與商業數據不視為已查證事實，正式使用時須依自己的資料來源替換。新增 JSON 範例只是擴充格式示範，不取代既有簡報。

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

## 規則如何實際延伸

`AGENTS.md` 是給 AI 開發助手閱讀的規則；網站目前沒有串接線上 LLM。匯入器負責文字解析與套版，AI 指令按鈕只複製整理指令。已依規則另增 [四頁驗收清單](examples/review-checklist.json)，可與 [三頁格式範例](examples/rules-demo.json) 對照，證明不修改引擎也能新增內容。

放映頁可下載包含樣式、圖片與播放程式的 HTML，保存編修結果後可獨立開啟；網頁字體和 PPTX 匯出函式庫仍可能需要網路。PDF 使用瀏覽器列印。沒有提供講者備忘時隱藏備忘按鈕；格式工具需先選取投影片元素才會啟用。

操作稽核可依序執行 `node tools/browser-audit.mjs --ui-only`、`python tools/build-audit-fixtures.py`、`node tools/button-audit.mjs`。前一步產生可供重新匯入驗證的 PPTX，測試產物都存於不發布的 `.verification/`。


## 使用自己的 PDF：紫微斗數全書

已依使用者指定的 PDF 製作 [二十頁三卷重點導讀](index.html?topic=ziwei-reading)，不是另一份操作清單。可直接 [放映](decks/studio-deck.html?topic=ziwei-reading)、[下載可編輯 PowerPoint](exports/ziwei-reading.pptx)，或 [下載內容 JSON](examples/ziwei-reading.json)。來源、缺字處理與摘要範圍見 [來源說明](examples/ZIWEI_SOURCE.md)，原始 PDF 不公開。

在工作室按「編輯本頁內容」修改標題、要點或備註，或直接點選舞台文字編輯。內容與設計分開儲存，切換四種風格、三十種版面或主題後仍保留文字與新增物件。「還原版面」保留已修改文字；「還原本頁編修」才恢復原始內容。可按「下載內容 JSON」備份修改後的版本；本機編修不自動同步到 GitHub。

這次 AGENTS.md 的實際用途是要求 AI：先核對來源、整理為標準資料、依內容挑版面、保留使用者修改，最後以實際截圖和 PowerPoint 驗收。網站本身仍是純前端工具，沒有自動讀懂任意書籍的線上模型。

本份簡報與內容保存功能的驗證：`node tools/personal-deck-audit.mjs`。原有三份示範內容仍由 `node tools/check-content.cjs` 的原始資料雜湊保護。
