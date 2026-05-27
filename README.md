# 🎓 大學之路 (Heading to College)

> **全新 2026 年升學與個人申請落點全方位策略平台**
> 
> 一站式整合「18學群性向測驗」、「15所頂大申請入學落點資料庫」，並深入結合免試、繁星、申請、分發等完整攻略指引，協助台灣高中生科學化定位與準備夢想科系。

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.dot.js&style=flat-square)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react&style=flat-square)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.0-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![Recharts](https://img.shields.io/badge/Recharts-3.8-22B5BF?style=flat-square)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 🗺️ 學生升學與決策歷程

系統基於台灣高中升學與大學個人申請流程，設計了六大核心步驟，引導學生從自我探索一路走到二階甄試準備。以下是系統的運作流程圖：

```mermaid
graph TD
    A["🧭 1. 18學群性向測驗 (Quiz)"] -->|計算學群匹配度| B["📊 2. 學群雷達圖與科系推薦 (Dashboard)"]
    B -->|探索感興趣的科系| C["📂 3. 頂大科系庫與校系比較 (SearchDatabase)"]
    C -->|最多4校系橫向對比| D["⚠️ 面試衝堂預警系統 (CompareTable)"]
    E["📝 4. 學測成績登錄 (Scores)"] -->|進行檢定標準與去年篩選級分比對| F["🔍 5. 落點與優勢分析 (ScoreAnalyzer)"]
    F -->|判定落點級別 (極具優勢/安全/挑戰/保守/未達檢定)| G["🎯 6. 目標志願二階戰備系統 (TargetSystem)"]
    D -->|選定為目標志願| G
    G -->|客製化二階倒數檢視清單| H["📝 7. 備審歷程與二階實戰攻略 (PortfolioGuide)"]
    H -->|利用 BAR 原則產出器與 AI 誠信聲明| I["🎓 成功前進夢想科系"]
```

---

## 🌟 核心特色功能解析

### 1. 🧭 18 學群性向測驗 (`Quiz` / `Dashboard`)
* **功能描述**：提供大考中心 18 學群情境特質核心量表（18題精準情境測驗），引導學生探索興趣。
* **科學演算法 ([quizAlgorithm.ts](file:///d:/projects/Heading%20to%20college/src/utils/quizAlgorithm.ts))**：
  * 使用**李克特五分量表平移算法**，將答案（1-5分）轉換為 0-4 分的得分值。
  * 結合各題目的**多重學群權重矩陣**，精算出學生在 18 個學群的適配百分比。
* **視覺化呈現**：使用 Recharts 繪製適配雷達圖（Radar Chart），直觀分析學生的個人興趣優勢。
* **智慧科系推薦**：根據測驗結果的前三大推薦學群，自動從資料庫中檢索並推薦 15 所頂尖大學的相符代表科系。

### 2. 📊 學測落點與優勢分析 (`ScoreAnalyzer`)
* **功能描述**：學生輸入學測各科級分（0-15 級分），系統自動進行一階篩選評估。
* **檢定標準智慧比對**：判定成績是否通過科系自訂的學測檢定標準（國/英/數A/數B/社/自，如「英文須達頂標」）。
* **落點優勢判定 ([scoreAnalyzer.ts](file:///d:/projects/Heading%20to%20college/src/utils/scoreAnalyzer.ts))**：
  * 計算學生級分總和與去年一階篩選分數的差距（Margin）。
  * 判定為**「極具優勢、安全/優勢、挑戰/偏難、保守/難度高、未達檢定」**五大落點級別。
  * **科目加權優勢分析**：自動找出科系篩選倍率最高的科目（如：數學A篩選倍率 3 倍），若學生該科取得 14-15 級分，則標註具備加權優勢。

### 3. 🎯 目標志願系統 (`TargetSystem`)
* **功能描述**：鎖定單一夢想科系進行深度戰略分析。
* **二階戰備指南**：自動呈現目標校系二階甄試的簡章採計佔比（學習歷程審查 %、口試 %、筆試 % 等）。
* **客製化檢視清單**：自動生成二階學習歷程自述、多元表現與面試準備進度追蹤表，提供每日倒數提醒，幫助考生有條不紊地準備。

### 4. 📂 頂大科系庫與跨校系比較 (`SearchDatabase` / `CompareTable`)
* **功能描述**：收錄台灣 15 所頂尖大學（約 500 個代表科系）的完整簡章採計標準、招生名額、二階佔比與面試日期。
* **橫向對比表**：支援最多 4 個校系並排對比，方便對比名額、倍率及二階權重。
* **⚠️ 二階面試衝堂預警**：動態偵測比較清單中的校系二階面試日期是否重疊，若有重疊則自動以紅字高亮警示，協助考生避開面試時間衝突的校系。

### 5. 📖 升學攻略與策略工具 (`AdmissionsGuides`)
* 提供「免試入學、繁星推薦、個人申請、分發入學」台灣四大管道的完整升學指南。
* 內建豐富的輔助策略工具：
  * 🏠 **通勤與租屋性價比計算器**：評估大學通勤時間與住宿成本，協助選填志願時的現實考量。
  * ⭐ **繁星校百分比資格檢索**：快速查閱繁星比序要領。
  * 📦 **志願選填「箱子理論」模擬器**：引導學生合理分配安全、挑戰、保守的 6 個志願名額。
  * 📝 **高頻英文單字複習規劃器**：規劃學測與分科測驗英文單字的準備進度。

### 6. 📝 備審與甄試實戰攻略 (`PortfolioGuide`)
* 完整解析 108 課綱 A-T 審查代號（如 A 修課紀錄、F 自主學習計畫、N 多元表現綜整心得、O-Q 學習歷程自述）與教授審查的評分核心指標。
* **BAR 原則歷程寫作產出器**：引導學生依據背景 (Background)、行動 (Action)、結果與反思 (Result/Reflection) 填寫，產出具備 Debug 精神的高量化自述段落，拒絕流水帳。
* **多元表現 (N-Code) 心得大綱生成器**：自動依照「先點名、增脈絡、寫成長」的三步驟原則，提煉並生成 800 字的多元表現綜整心得大綱。
* **AI 使用誠信聲明生成器**：協助考生生成符合學術倫理與誠信原則的 AI 協作使用宣告。

---

## 🛠️ 技術架構與開發工具

本專案採用最新 Web 前端技術開發，保障了系統的響應速度與視覺精緻度：

| 技術 / 依賴 | 版本 | 用途描述 |
| :--- | :--- | :--- |
| **Next.js** | 16.2.x | 基礎 Web 框架，採用最新 App Router 路由架構 |
| **React** | 19.2.x | 聲明式元件 UI 渲染與互動邏輯控制 |
| **Tailwind CSS** | 4.0.x | 全新 CSS v4 樣式設計，實現精緻的現代暗色調 UI 與平滑微動畫 |
| **Recharts** | 3.8.x | 用於 18 學群測驗適配百分比的視覺化雷達圖繪製 |
| **Lucide React** | 1.16.x | 現代化精緻 icon 系統，增強視覺互動體驗 |
| **狀態管理與同步** | - | 使用 React Context ([AppContext.tsx](file:///d:/projects/Heading%20to%20college/src/context/AppContext.tsx)) 與 `localStorage` 進行狀態同步，確保瀏覽器重新整理後選取紀錄、測驗答案、學測成績、目標志願等核心數據不丟失 |

---

## 📂 專案目錄結構

```text
Heading to college/
├── public/                 # 靜態資源 (圖示、favicon、字型)
├── src/
│   ├── app/                # Next.js 頁面路由與全域樣式
│   │   ├── layout.tsx      # 全域版面配置與 AppProvider 狀態注入
│   │   ├── page.tsx        # 首頁大廳與各子功能模組 Tab 切換調度器
│   │   └── globals.css     # 全域 Tailwind v4 樣式與動畫定義
│   ├── components/         # 系統核心互動模組元件
│   │   ├── AdmissionsGuides.tsx  # 升學攻略指南與四大策略工具 (通勤租屋、箱子理論等)
│   │   ├── CompareTable.tsx      # 跨校系比較與面試衝堂紅字預警系統
│   │   ├── Dashboard.tsx         # 測驗儀表板 (Recharts雷達圖與科系推薦)
│   │   ├── HeaderWrapper.tsx     # 頁面標題導覽與狀態重設控制列
│   │   ├── PortfolioGuide.tsx    # 備審代號解析、BAR寫作產出器、N碼規劃與AI聲明
│   │   ├── Quiz.tsx              # 18學群李克特量表性向測驗
│   │   ├── ScoreAnalyzer.tsx     # 學測落點與加權優勢分析系統
│   │   ├── SearchDatabase.tsx    # 500+頂大科系簡章搜尋與篩選器
│   │   └── TargetSystem.tsx      # 目標志願二階倒數與自製檢查清單系統
│   ├── context/
│   │   └── AppContext.tsx        # 全域狀態管理器 (處理 localStorage 自動持久化)
│   ├── data/
│   │   └── mockData.ts           # 15所頂大、500+科系簡章大數據與18學群測驗題目
│   ├── types/
│   │   └── index.ts              # TypeScript 型別與簡章結構定義
│   └── utils/
│       ├── quizAlgorithm.ts      # 測驗多重加權與百分比計算演算法
│       ├── scoreAnalyzer.ts      # 成績檢定標準過濾與去年級分差 Margin 分析邏輯
│       └── secondStageGuidelines.ts # 二階簡章備審與口面試準備指引大數據
├── tsconfig.json           # TypeScript 配置
├── postcss.config.mjs      # PostCSS 配置
├── tailwind.config.ts      # Tailwind CSS 配置 (搭配 v4 運作)
├── next.config.ts          # Next.js 專案配置
└── package.json            # 專案依賴與執行腳本定義
```

---

## 🚀 快速開始

### 前置準備
- 本專案建議使用 **Node.js 18.x 或以上版本**。

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
啟動後，在瀏覽器打開 [http://localhost:3000](http://localhost:3000) 即可開始體驗平台。

### 3. 程式碼檢查 (Linting)
執行以下指令檢查程式碼規範與語法錯誤：
```bash
npm run lint
```

### 4. 編譯生產版本
若要打包專案以進行部署，請執行：
```bash
npm run build
```
編譯完成後，可使用以下指令在本機運行編譯後版本：
```bash
npm run start
```

---

## 📄 授權條款

本專案採用 **MIT 授權條款**。詳情請參閱 `LICENSE` 檔案。
