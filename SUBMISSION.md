# 作業繳交內容

繳交標題請在課程平台填入老師要求的學校、學號、系級、姓名；公開專案不放個人資料。

## 專案簡介

Slide Atelier 是一個以規則驅動的網頁簡報工作室。我將簡報的風格、版面、資料格式與驗收流程寫進 AGENTS.md，讓 AI 之後能依相同規範延伸內容，而不必每次重新設計整個網站。網站提供風格切換、內容匯入、簡報預覽與匯出功能。

## 繳交連結

- GitHub Repository：https://github.com/estrella123456789/S
- 網頁成果：https://estrella123456789.github.io/S/
- 規則文件：https://github.com/estrella123456789/S/blob/main/AGENTS.md

## 如何讓 AI 繼續新增內容

AGENTS.md 定義檔案分工、四套鎖定風格、三十種實際版面（十種核心與二十種延伸），以及 Canonical Slide Content 資料格式。原有三份二十頁簡報完整保留。新增內容時，可請 AI 先讀取規則，再參考 examples/rules-demo.json 建立新的 JSON 檔，透過工作室匯入預覽。相同內容類型沿用同一版面；沒有來源的數據和圖片留空，內容過多就拆頁。修改渲染程式後，還需通過語法檢查與實際截圖檢視。這樣能重複新增不同主題，並維持一致的設計與資料品質。

## 實際延伸證據

原有 `examples/rules-demo.json` 是三頁格式範例；依相同規則新增 `examples/review-checklist.json`，產生四頁「簡報驗收清單」。新增內容只需建立 JSON，透過既有匯入器套用風格與版面，不需重寫引擎，也不刪改原本六十頁示範。

AGENTS.md 是給 AI 開發助手閱讀的規則，網站目前沒有自動呼叫線上 AI；按「複製給 AI 的整理指令」可將規則交給自己使用的 AI，再匯入產生的 JSON。

## 發布與驗證步驟（不需安裝工具）

1. 登入 GitHub，開啟既有 Repository：https://github.com/estrella123456789/S 。
2. 在 Repository 選 Add file → Upload files，把本專案內容上傳到根目錄。index.html 必須在根目錄，engine、assets 等資料夾須保留。不要上傳 ZIP 本身。
3. 提交檔案後，開 Settings → Pages。
4. Source 選 Deploy from a branch，Branch 選 main，資料夾選 / (root)，按 Save。
5. 等 Pages 完成部署，使用該頁顯示的 Visit site 開啟網站，並測試首頁、專案介紹與內容匯入。
6. 把實際 Repository 與網站網址填回上方，再貼到課程平台。
