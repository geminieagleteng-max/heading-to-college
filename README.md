# 🎓 大學之路 (Heading to College)

> **全新 2026 年升學與個人申請落點全方位策略平台**
> 一站式整合「18學群性向測驗」、「15所頂大申請入學落點資料庫」，並深入結合免試、繁星、申請、分發等完整攻略指引，協助台灣高中生科學化定位與準備夢想科系。

---

## 🌟 核心特色功能

系統基於台灣高中升學流程，設計了六大核心步驟，引導學生從自我探索一路走到二階甄試準備：

1. **🧭 18 學群性向測驗 (`Quiz` / `Dashboard`)**
   - 大考中心 18 學群情境特質核心量表（18題精準情境測驗）。
   - 獨特「多重加權算法」：精算出前三大最適學群。
   - **適配雷達圖**：使用 Recharts 視覺化學群百分比，直觀分析個人優勢。
   - **智慧科系推薦**：根據測驗結果，自動推薦 15 所頂大中相符的代表科系。

2. **📊 學測落點與優勢分析 (`ScoreAnalyzer`)**
   - 級分輸入（0-15 級分）與快捷設定（滿級分、頂標、前標、均標）。
   - **檢定標準智慧比對**：判定是否符合各科系第一階段的檢定標準（國/英/數A/數B/社/自）。
   - **落點優勢判定**：分析「去年一階級分差」，標註「極具優勢、安全、挑戰、保守、未達檢定」五大級別。
   - **科目加權優勢分析**：自動計算各科系篩選倍率對應的優質權重（如 國*4.5、英*5）。

3. **🎯 目標志願系統 (`TargetSystem`)**
   - 鎖定單一「夢想科系」進行深度戰略分析。
   - 自動生成二階書面審查與口筆試重點備戰資訊。
   - 提供**客製化二階倒數檢視清單**，追蹤學習歷程與自傳準備進度。

4. **📂 頂大科系庫與跨校系比較 (`SearchDatabase` / `CompareTable`)**
   - 收錄 15 所頂尖大學（約 500 個代表科系）的完整簡章採計標準與二階佔比。
   - 支援**最多 4 個校系並排橫向對比表**，直接對比招收名額、篩選倍率及二階權重。
   - **二階面試衝堂預警**：自動檢索並紅字高亮二階面試日期重疊之校系，規避衝堂風險。

5. **📖 升學攻略與策略工具 (`AdmissionsGuides`)**
   - 系統化整理「免試入學、繁星推薦、個人申請、分發入學」四大管道攻略。
   - 內建**「通勤與租屋性價比計算器」**：幫學生綜合評估大學通勤時間與住宿成本。
   - 內建**「繁星校百分比資格檢索」**與**「志願選填箱子理論模擬器」**。
   - 內建**「高頻英文單字複習規劃器」**。

6. **📝 備審與甄試實戰攻略 (`PortfolioGuide`)**
   - 完整解析 108 課綱 A-R 審查代號與評分指標。
   - **BAR 原則歷程寫作產出器**：引導學生依據情境 (Behavior)、行動 (Action)、成果 (Result) 填寫並產出高質感的自述草稿。
   - 提供多元表現綜整規劃與二階口筆試實戰模擬問答。

---

## 🛠️ 技術架構與開發工具

本專案採用最新 Web 前端技術開發，保障了系統的響應速度與視覺精緻度：

- **基礎框架**: [Next.js 16.2 (App Router)](https://nextjs.org/) & [React 19.2](https://react.dev/)
- **樣式設計**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **資料庫**: 靜態 JSON 大數據儲存於 `src/data/mockData.ts` (涵蓋 15所頂大約 500 個科系簡章)
- **資料視覺化**: [Recharts 3.8](https://recharts.org/) (用於 18學群適配雷達圖)
- **圖示庫**: [Lucide React](https://lucide.dev/)
- **狀態管理與同步**: React Context (`AppContext.tsx`) & `localStorage` (確保重新整理後選取紀錄、測驗答案、成績不丟失)

---

## 🚀 快速開始

### 1. 安裝依賴項目

在專案根目錄下，開啟終端機執行：

```bash
npm install
```

### 2. 啟動開發伺服器

執行以下指令啟動本地開發伺服器：

```bash
npm run dev
```

啟動後，瀏覽器打開 [http://localhost:3000](http://localhost:3000) 即可使用本系統。

### 3. 編譯生產版本

若要打包專案以進行部署，請執行：

```bash
npm run build
```

---

## 📂 專案目錄結構

```text
Heading to college/
├── public/                 # 靜態資源 (圖示、favicon)
├── src/
│   ├── app/                # Next.js 頁面路由與全域樣式 (layout, page, globals)
│   ├── components/         # 系統核心互動模組元件
│   │   ├── AdmissionsGuides.tsx  # 升學攻略與策略工具
│   │   ├── CompareTable.tsx      # 跨校系比較與面試衝堂預警
│   │   ├── Dashboard.tsx         # 測驗儀表板與雷達圖
│   │   ├── HeaderWrapper.tsx     # 頁面標題導覽列
│   │   ├── PortfolioGuide.tsx    # 備審寫作 (BAR產出器) 與口筆試攻略
│   │   ├── Quiz.tsx              # 18學群性向測驗
│   │   ├── ScoreAnalyzer.tsx     # 學測落點與優勢分析系統
│   │   ├── SearchDatabase.tsx    # 頂大科系庫搜尋與篩選
│   │   └── TargetSystem.tsx      # 目標志願二階戰備系統
│   ├── context/
│   │   └── AppContext.tsx        # 全域狀態管理器 (同步 localStorage)
│   ├── data/
│   │   └── mockData.ts           # 500+ 科系簡章與18學群大數據
│   ├── types/
│   │   └── index.ts              # TypeScript 型別定義
│   └── utils/
│       ├── quizAlgorithm.ts      # 測驗多重加權算法
│       ├── scoreAnalyzer.ts      # 落點檢定與級分差比對邏輯
│       └── secondStageGuidelines.ts # 二階簡章備審與口試準備指引
├── tsconfig.json           # TypeScript 配置
├── postcss.config.mjs      # PostCSS 配置
├── tailwind.config.ts      # Tailwind CSS 配置
├── next.config.ts          # Next.js 配置
└── package.json            # 專案依賴與腳本定義
```

---

## 📄 授權條款

本專案採用 MIT 授權條款。詳情請參閱 `LICENSE` 檔案。
