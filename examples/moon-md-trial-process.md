# 月球主題：獨立 MD 工作流程紀錄

執行者為獨立子代理；依指定原始來源自行決定內容，未讀取或模仿 `examples/solar-system.json`、既有新主題成品或太陽系 review 頁。

## 實際讀取條款與決策

- `AGENTS.md` §1：每頁 3 點；標籤 2–6 字、desc 18–25 字；正文以 summary + points 的 title/stat/desc/action 計算，七頁依序 103、115、120、120、118、119、120 字。副標與來源註記另外保存。
- §3 與 `DESIGN_CATALOG.md` 一至三：選定 `academic-thesis` 作為推薦整體風格，使用既有 preset，不建立混搭色系或額外縮字。工作室仍可自行選四套風格；JSON 的 preferredStyle 是推薦值，現有工作室不會自動套用該欄位。
- §1、§4 與設計目錄四：不同單位的半徑、距離與漂移量不畫比例條；用矩陣整理。形成與水證據採時間軸；運動與環境採三欄；同類頁保持同版面。無來源圖片則 image=null。
- §5：每頁保留結論標題、副標、摘要、三個完整 point 與來源 notes。數值沿用 NASA 的近似值，不補假數據。
- §6：先閱讀 MD，再讀 NASA 原始網頁，才規劃七頁：開場→尺度→同步自轉→形成→地形→水→環境。接著建立 JSON、接入共用 topics.js，最後檢查。
- §7：跑語法與既有內容檢查，另做自訂主題四風格渲染及 28 張實際瀏覽器截圖；PowerPoint 下載、桌面開啟與預覽由主代理獨立驗收。

## 來源與整理的界線

唯一內容來源：[NASA Moon Facts](https://science.nasa.gov/moon/facts/)，2026-11-17 透過 web 工具實際讀取，頁面註明更新日 2026-02-12。

原網頁為英文科普文章，包含 Size and Distance、Orbit and Rotation、Formation、Surface、Water on the Moon、Atmosphere、Potential for Life 等段落。JSON sources 與逐頁 notes 保留原 URL、段落名稱與極短原文摘錄。中文結論標題、分頁、摘要、標籤及行動詞均由本代理重新整理；它們不是 NASA 原文標題，也不是 NASA 對簡報版面的背書。保留形成假說的「可能」；2008 年寫羥基、2020 年寫水分子，避免把不同探測結果混同。

本次是 AI 讀取 MD 後編寫檔案並註冊，不代表網站會自動讀 MD、呼叫 LLM 或匯入文件。

## 實測與限制

- 四套風格 × 七頁 = 28 頁均實際在 Edge headless 以 1280×720 渲染；DOM 邊界／隱藏溢出檢查 0 問題，0 執行錯誤；工作室可見新主題。結果在 `.verification/moon-md-trial/result.json`。
- 已人工查看學術風尺度矩陣、形成時間軸及工作室截圖，未見溢出或重疊；留白充足。未宣稱以面積算法精確量測 30% 留白。
- 保留共用引擎原樣：既有時間軸會以 13px 顯示部分正文，矩陣部分文字亦為 13px，與 MD 要求正文 17px 存在既有落差；本次不偷偷改 MD，也不以新主題局部樣式掩蓋。原矩陣同時有深色結論區與首列強調，單一焦點的嚴格視覺驗收仍須主代理判斷。
- 已驗證各版面以同一份 canonical points 渲染；沒有完成拖拉編修／切換版面後的端到端保存測試，也未完成 PowerPoint 桌面視覺檢查。不得把語法通過或 PPTX 解壓縮視為這些驗收已通過。

可重跑：`node tools/create-moon-md-trial.cjs` 產生資料；`node tools/moon-md-trial-audit.mjs` 執行此主題專用驗收（HTTP 8785、CDP 9355、獨立 Edge profile）。沒有 commit 或 push。
