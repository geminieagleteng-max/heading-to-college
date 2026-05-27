'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Settings, 
  MapPin, 
  Award, 
  Layers, 
  BookOpenCheck, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  HelpCircle 
} from 'lucide-react';


export default function AdmissionsGuides() {
  const [activeSubTab, setActiveSubTab] = useState<'guides' | 'tools'>('guides');
  
  // 攻略庫專用的狀態
  const [activeGuideId, setActiveGuideId] = useState<number>(1);
  
  // 工具箱專用的狀態
  const [activeToolId, setActiveToolId] = useState<'commute' | 'stars' | 'box' | 'vocab'>('commute');

  // ==========================================
  // 1. 通勤評估器狀態
  // ==========================================
  const [selectedSchool, setSelectedSchool] = useState<string>('大同高中');
  const [commuteTime, setCommuteTime] = useState<number>(30);
  const [transportMode, setTransportMode] = useState<string>('捷運+公車');

  const schoolsData: {
    [key: string]: {
      name: string;
      level: string;
      commuteRating: string;
      schoolStyle: string;
      strategy: string;
      note: string;
    };
  } = {
    '大同高中': {
      name: '大同高中',
      level: '夢幻志願',
      commuteRating: '極佳 (位於圓山，對林口通勤非常方便)',
      schoolStyle: '偏向自然組，數理科及國文、社會科表現突出。',
      strategy: '適合數理強但英文相對弱勢的理科傾向學生，建議放在前五志願大膽填寫。',
      note: '林口出發通勤時間約 30-40 分鐘，通勤負擔低。'
    },
    '板橋高中': {
      name: '板橋高中',
      level: '安全保底',
      commuteRating: '極方便 (新北第一志願，交通最順暢)',
      schoolStyle: '規模大 (年級高達20幾班)，同樣偏向自然組。',
      strategy: '校內競爭激烈，繁星排名非常難搶 (前20%極度辛苦)，一般建議作為拼「個人申請」管道的主戰場。',
      note: '若分數在此區間，板中是很好的保底牌。'
    },
    '中崙高中': {
      name: '中崙高中',
      level: '安全/繁星優勢',
      commuteRating: '良好 (放學通勤能趕上 6:30 回林口補習)',
      schoolStyle: '較小型學校 (年級約十幾個班)，自然組偏多。',
      strategy: '競爭力相對板中較小，若能穩定保持在班上前十名，在「繁星推薦」上會佔據巨大優勢。',
      note: '大約晚上 6:00 前能回到林口，通勤時間約 45 分鐘。'
    },
    '成淵高中': {
      name: '成淵高中',
      level: '落點安全牌',
      commuteRating: '尚可 (通勤約 45-50 分鐘)',
      schoolStyle: '校風相對封閉，班級數不多，社會組與自然組大約各半。',
      strategy: '適合穩紮穩打型學生，不論走繁星或申請皆有合理機會。',
      note: '交通在可接受範圍，放學回林口時間充足。'
    },
    '政大附中': {
      name: '政大附中',
      level: '極不推薦',
      commuteRating: '極差 (位於木柵，通勤遙遠)',
      schoolStyle: '自由校風，但交通不便。',
      strategy: '不建議填寫！每天早上通勤去木柵會「超級痛苦」，極大消耗體力，會嚴重摧毀高中學習效率。',
      note: '單程通勤通常超過 75-90 分鐘。'
    },
    '麗山高中': {
      name: '麗山高中',
      level: '不推薦',
      commuteRating: '差 (位於內湖，距離過遠)',
      schoolStyle: '偏向自然組，特色為專題研究。',
      strategy: '不建議就讀！雖然有公車，但內湖距離林口太遠，體力負擔極重。',
      note: '單程通勤通常超過 60-70 分鐘，林口極少數學生前往。'
    }
  };

  // ==========================================
  // 2. 繁星資格檢索器狀態
  // ==========================================
  const [starsPercentage, setStarsPercentage] = useState<number>(10);

  // ==========================================
  // 3. 箱子理論模擬器狀態
  // ==========================================
  const [userScore, setUserScore] = useState<number>(27.6);
  const [strategyOption, setStrategyOption] = useState<'A' | 'B'>('A');
  const [simResult, setSimResult] = useState<{
    status: 'success' | 'warning' | 'info' | null;
    message: string;
    details: string;
  }>({ status: null, message: '', details: '' });

  const handleSimulate = () => {
    if (strategyOption === 'B') {
      // 安全牌放在第一志願
      setSimResult({
        status: 'warning',
        message: '⚠️ 殘酷警告：你被「卡死」在安全牌學校的箱子裡了！',
        details: `你的成績有 ${userScore} 分，原本完全足夠錄取 27.6 分的「夢幻高中」（如成淵或大同）。但因為你把 15 分的「林口高中」填在第一志願，電腦第一步就把你的卡片放進了林口高中箱子。因為你的分數非常高，在箱子額滿 PK 時，你永遠不會被踢出來，導致你被「卡死」在此志願，後面二、三志願的夢幻高分學校再也無緣錄取。這不僅高分低就，還擠掉了原本 15 分學生上林口高中的機會！`
      });
    } else {
      // 夢幻放在第一志願
      if (userScore >= 27.6) {
        setSimResult({
          status: 'success',
          message: '🎉 恭喜！你成功錄取了「夢幻高中」！',
          details: `你的會考分數是 ${userScore} 分，符合或超過了夢幻志願的門檻（27.6分）。由於你勇敢地把最想去、分數剛好符合的夢幻學校放在第一志願（前五志願），電腦分發在第一輪就把你成功錄取。這證明了「第一組志願（1-5志願）大膽選填夢幻學校」是完全正確的策略！`
        });
      } else {
        setSimResult({
          status: 'info',
          message: '👍 安全退路！雖然夢幻學校沒上，但你順利進入第二志願安全牌！',
          details: `你的分數是 ${userScore} 分，雖然不夠上 27.6 分的夢幻學校，電腦會把你從夢幻箱子踢出來；但你的卡片會立刻滾落到第二志願「安全牌高中（15分）」，並憑藉高分優勢直接在該箱子穩穩錄取！因為前五個志願的「志願序分數」都是滿分 36 分，你填寫夢幻志願「完全沒有任何被扣分的風險」，安全牌依然非常安全！`
        });
      }
    }
  };

  // ==========================================
  // 4. 英文單字累積規劃器狀態
  // ==========================================
  const [dailyWords, setDailyWords] = useState<number>(10);
  const totalDays = 912; // 2.5 年

  const totalWordsReached = dailyWords * totalDays;
  const syllabusPercent = Math.min(100, Math.round((totalWordsReached / 7000) * 100));
  const examPercent = Math.min(100, Math.round((totalWordsReached / 13000) * 100));

  // ==========================================
  // 攻略內容資料
  // ==========================================
  const guidesData = [
    {
      id: 1,
      title: '國中升學路徑與免試攻略',
      summary: '會考後的優先免試（優免）與大免選填技巧。避開高分低就陷阱，理解志願序「箱子理論」電腦分發邏輯，並打聽高中「班群」校風。',
      content: (
        <div className="space-y-6">
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 className="text-lg font-bold text-indigo-300">一、 國中畢業的三大升學基本路徑</h4>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              國中畢業後，主要方向可分為三大類。不同的路徑將深刻影響三年後報考大學的便利度：
            </p>
            <ul className="list-disc list-inside text-slate-400 text-xs mt-2 space-y-1">
              <li><strong className="text-slate-200">普通高中 (普高)</strong>：升學主力為普通大學，但亦可透過個人申請報考科技大學 (例如台科大、北科大等限定名額)。</li>
              <li><strong className="text-slate-200">技術高中 (高職/高工)</strong>：主力為科技大學 (四技二專) 管道，若想考普通大學難度極高，升學路徑在起點即被限縮。</li>
              <li><strong className="text-slate-200">五年制專科學校 (五專)</strong>：名額大量減少，但其中的「護專」因應高齡化與國際護理師短缺，在就業市場極度搶手，出國薪資可翻倍。</li>
            </ul>
          </div>

          <div className="border-l-4 border-emerald-500 pl-4 py-1">
            <h4 className="text-lg font-bold text-emerald-300">二、 免試入學兩大管道與選填天條</h4>
            
            <div className="mt-4 space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <span className="inline-block text-xs font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded mb-2">管道 A：優先免試入學 (優免)</span>
                <p className="text-slate-300 text-sm leading-relaxed">
                  提供學生選擇「住家附近」的公立高中職。每人<strong className="text-emerald-400">「只能選填一個志願」</strong>，一拿到成績即須決定。
                </p>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-3">
                  <p className="text-xs text-red-300 leading-relaxed font-bold">
                    ⚠️ 避開優免的「高分低就」重災區：
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    優免因只能填一校，許多家長為求安全，會拿高分（如 26 分）去填家附近的學校（如 15 分的林口高中）。錄取後才發現自己大免能上台北市前三志願，造成悔恨。因此優免請「大膽填寫最理想的志願」，沒上再走大免即可。
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <span className="inline-block text-xs font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded mb-2">管道 B：全區免試入學 (大免)</span>
                <p className="text-slate-300 text-sm leading-relaxed">
                  可選填基北區所有學校，最多可填 30 個志願。
                </p>
                <ul className="list-disc list-inside text-slate-400 text-xs mt-2 space-y-1">
                  <li><strong className="text-slate-200">志願序計分</strong>：第 1 到 5 志願（第一組）給予滿分 36 分；第 6 到 10 志願（第二組）降為 35 分。</li>
                  <li><strong className="text-slate-200">志願序扣分不影響大局</strong>：當電腦比對到第 6 志願時，該校錄取門檻早已下降不只一分。因此第一組前五個志願務必「填滿夢幻學校」，絕對不要將安全牌放首位。</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4 py-1">
            <h4 className="text-lg font-bold text-purple-300">三、 高中選校實務：通勤距離與情報戰</h4>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              選填高中時應徹底排除不切實際的交通距離（例如林口到內湖麗山或木柵政附，通勤將摧毀學習體力）。應在平日早上尖峰時段，讓學生親自搭車走一趟。此外，高中的「班群」校風（社會組與自然組的班級比例）要提前上網打聽，前段學校自然組班級通常遠多於社會組，關乎未來同儕氛圍。
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '大學多元入學四大管道攻略',
      summary: '理解高中升大學「沒有總分概念」的核心！詳解特殊選才、繁星推薦、申請入學、考試分發四大管道的時程、門檻與對應策略。',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-indigo-500/10">
            <p className="text-slate-300 text-sm leading-relaxed font-bold">
              💡 核心觀念：高中升學沒有總分！
            </p>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              大學科系只挑選他們看重的科目進行比拼（例如台大資工只比英、數A、自然，不看社會）。學生如果提前確定方向，可將讀書重心專注於特定學科，不需為弱勢科目過度沮喪。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <h5 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 text-xs bg-indigo-500/10 rounded">管道 1</span>
                特殊選才 (佔 2%~3%)
              </h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                學測前即完成錄取。要求科系設定的「特殊條件」（如資安金盾獎、國際科學競賽、學科前5%等）。此管道不限定各校推薦人數，屬於全國奇才的大混戰，建議高一即鎖定營隊與特殊表現來累積。
              </p>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <h5 className="text-sm font-bold text-purple-400 flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 text-xs bg-purple-500/10 rounded">管道 2</span>
                繁星推薦 (佔 10%~20%)
              </h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                極度看重<strong className="text-purple-300">「在校成績百分比 (校排)」</strong>。頂尖大學要求校排前 20% 以內。此管道「不看高中名氣」，只看你在校內打敗多少人。因此「寧為雞首」在偏遠或競爭較弱的高中取得校排 1%，在繁星中極具優勢。
              </p>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <h5 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 text-xs bg-emerald-500/10 rounded">管道 3</span>
                申請入學 (最高，佔 50%~60%)
              </h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                第一階段以學測科目倍率篩選（刷掉多數人）；第二階段決戰在於佔比達 40% 的<strong className="text-emerald-300">「學習歷程檔案（審查資料）」</strong>及現場口筆試。高中時期應提早取得英檢、數檢等證照，豐富備審履歷。
              </p>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <h5 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 text-xs bg-amber-500/10 rounded">管道 4</span>
                考試分發 (最後餘額)
              </h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                接收前三個管道未招滿的名額。採計「學測成績」加上 7 月份「分科測驗」特定科目成績，如同傳統聯考般按級分分發，適合學科基礎扎實、大考抗壓性強的考生。
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '準高中生目標設定與補習實戰',
      summary: '進入高中前的心理建設。如何利用「反向淘汰法」縮減 18 學群，段考與繁星的命運連結，以及補習班提供的「附加升學資源」真相。',
      content: (
        <div className="space-y-6">
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 className="text-lg font-bold text-indigo-300">一、 提早探索興趣：反向淘汰法</h4>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              高中最忌諱盲目讀書。建議將大考中心 18 學群印出，採用「反向淘汰」：先劃掉絕對不想觸碰的領域（如怕血劃掉醫學、對數字沒興趣劃掉財經）。從餘下的交集中尋找目標校系，並提早研讀繁星與個人申請簡章，確定高一、高二所需累積的表現。
            </p>
          </div>

          <div className="border-l-4 border-amber-500 pl-4 py-1">
            <h4 className="text-lg font-bold text-amber-300">二、 補習的殘酷現實：第一次段考決定繁星</h4>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              會考已將同程度學生分流到同高中，校內競爭的關鍵在於「讀書效率」。高一第一次段考即計入繁星的在校排名，許多學生會參加高一先修班，就是為了避免段考墊底、提早出局。
            </p>
          </div>

          <div className="border-l-4 border-emerald-500 pl-4 py-1">
            <h4 className="text-lg font-bold text-emerald-300">三、 大型補習班的「附加價值」</h4>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              頂尖名師因少子化多集中於大型補習班。除了授課，專業高中補習班的附加價值在於「全職導師的升學輔導機制」。他們會提醒考照時程，甚至帶學生參加特定的大學或官方營隊（例如新北市量子電腦營隊），直接協助獲取關鍵的「結業證書」與「學習歷程檔案」。
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-red-500/20">
            <h4 className="text-sm font-bold text-red-300 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              秘密讀書與情報保密
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              高中升學是排位競爭，名額是限量的。同校同學就是最直接的競爭對手。建議妥善保護自己的升學情報、考照規劃與營隊資訊。學會「低調努力、高效讀書」的秘密讀書藝術。
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: '高中選校落點與實務校系分析',
      summary: '詳細分析大同、板中、中崙、成淵等公立高中之通勤交通、校風與繁星/申請定位，並點出高中英文「單字量暴增 6 倍」的關鍵警訊。',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-base font-bold text-slate-200 mb-3">📍 區域公立高中實戰定位分析</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl">
                <span className="font-bold text-indigo-400">大同高中 (夢幻志願)</span>：位於圓山，對林口通勤友善。偏向自然組，數理、國文、社會科表現皆突出，適合數理強但英文相對弱的同學。
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl">
                <span className="font-bold text-purple-400">板橋高中 (安全牌/申請主力)</span>：通勤最方便，規模大 (年級高達20幾班)，偏向自然組。但校內競爭極為激烈，繁星前 20% 極辛苦，主要拼「個人申請」。
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl">
                <span className="font-bold text-emerald-400">中崙高中 (繁星優勢)</span>：放學通勤能趕上林口 6:30 補習，自然組偏多。競爭壓力較板中低，若能保持校內前段，極利於「繁星推薦」上頂大。
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl">
                <span className="font-bold text-amber-400">成淵高中 (落點保險)</span>：校風相對封閉，班級數不多，社會組與自然組大約各半。
              </div>
              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-300">
                <strong className="text-red-400">🚨 避開政大附中、麗山高中</strong>：政附在木柵、麗山在內湖，林口通勤極度遙遠，清晨上學會耗盡體力，直接排除。
              </div>
            </div>
          </div>

          <div className="border-l-4 border-red-500 pl-4 py-1">
            <h4 className="text-lg font-bold text-red-400">🚨 英文單字量的「暴增 6 倍」警訊</h4>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              這是國中升高中最嚴重的學習斷層：
            </p>
            <ul className="list-disc list-inside text-slate-400 text-xs mt-2 space-y-1">
              <li>國小到國三（共9年）：會考只需熟記 <strong className="text-slate-200">2,000 個單字</strong>。</li>
              <li>高中三年：課綱表定為 <strong className="text-slate-200">7,000 字</strong>，但學測大考實際會考到將近 <strong className="text-slate-200">13,000 個單字</strong>！</li>
            </ul>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              單字量在兩年多內暴增 6 倍。高一開始必須養成「每天背 5-10 個單字」的習慣，並拋棄死記硬背，改用「字根、字首及邏輯理解」來背誦。
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-start">
      
      {/* 頁面標題 */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-100 flex items-center justify-center sm:justify-start gap-2">
            <BookOpen className="h-8 w-8 text-emerald-400" />
            升學策略與規劃指南
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            基於專家升學文件解析，提供最真實的免試分發與升學實戰指南。
          </p>
        </div>
        
        {/* 切換子頁籤 */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 self-center sm:self-auto shadow-inner">
          <button
            onClick={() => setActiveSubTab('guides')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === 'guides'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpenCheck className="h-4 w-4" />
            升學攻略庫
          </button>
          <button
            onClick={() => setActiveSubTab('tools')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === 'tools'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="h-4 w-4" />
            規劃工具箱
          </button>
        </div>
      </div>

      {/* ========================================================
          子頁籤 A：升學攻略庫
          ======================================================== */}
      {activeSubTab === 'guides' && (
        <div className="grid md:grid-cols-4 gap-8 items-start">
          {/* 左側攻略導覽選單 */}
          <div className="md:col-span-1 space-y-2">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase px-2">主題指南</span>
            {guidesData.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setActiveGuideId(guide.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 ${
                  activeGuideId === guide.id
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <span className="text-sm line-clamp-1">{guide.title}</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${activeGuideId === guide.id ? 'translate-x-1' : ''}`} />
              </button>
            ))}
          </div>

          {/* 右側攻略內容呈現 */}
          <div className="md:col-span-3">
            {guidesData.map((guide) => {
              if (guide.id !== activeGuideId) return null;
              return (
                <div key={guide.id} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl animate-fade-in">
                  <span className="inline-block text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 mb-4">
                    主題 {guide.id} 指南
                  </span>
                  <h2 className="text-2xl font-black text-slate-100 mb-4">{guide.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 pb-6 border-b border-slate-800/80">
                    {guide.summary}
                  </p>
                  <div className="text-slate-300 font-normal leading-relaxed text-sm">
                    {guide.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          子頁籤 B：互動規劃工具箱
          ======================================================== */}
      {activeSubTab === 'tools' && (
        <div className="grid md:grid-cols-4 gap-8 items-start">
          {/* 左側工具切換 */}
          <div className="md:col-span-1 space-y-2">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase px-2">分析工具</span>
            
            <button
              onClick={() => setActiveToolId('commute')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                activeToolId === 'commute'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-bold ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <MapPin className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-semibold">通勤與校風評估</span>
            </button>

            <button
              onClick={() => setActiveToolId('box')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                activeToolId === 'box'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-bold ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Layers className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-semibold">箱子分發模擬器</span>
            </button>

            <button
              onClick={() => setActiveToolId('stars')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                activeToolId === 'stars'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-bold ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Award className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-semibold">繁星推薦校排檢索</span>
            </button>

            <button
              onClick={() => setActiveToolId('vocab')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                activeToolId === 'vocab'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-bold ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-semibold">高中英文單字規劃</span>
            </button>
          </div>

          {/* 右側工具內容與互動表單 */}
          <div className="md:col-span-3">
            
            {/* 1. 通勤與校風評估器 */}
            {activeToolId === 'commute' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl animate-fade-in">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 mb-4">
                  <MapPin className="h-3 w-3" />
                  通勤交通與選校評估器
                </span>
                
                <h3 className="text-xl font-bold text-slate-200 mb-2">高中選校戰略評估</h3>
                <p className="text-slate-400 text-xs mb-6">
                  根據專家建議分析特定公立高中（以林口出發為基準）的通勤合理度與升學定位。
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {/* 輸入 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        選擇目標高中
                      </label>
                      <select
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        {Object.keys(schoolsData).map((schName) => (
                          <option key={schName} value={schName}>{schName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        單程通勤時間: {commuteTime} 分鐘
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="120"
                        step="5"
                        value={commuteTime}
                        onChange={(e) => setCommuteTime(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex justify-between text-2xs text-slate-500 mt-1">
                        <span>10 分鐘</span>
                        <span>60 分鐘 (警示線)</span>
                        <span>120 分鐘</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        交通工具方式
                      </label>
                      <select
                        value={transportMode}
                        onChange={(e) => setTransportMode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="公車直達">公車直達</option>
                        <option value="捷運+公車">捷運+公車</option>
                        <option value="火車+公車">火車+公車</option>
                        <option value="家長接送">家長接送</option>
                        <option value="步行">步行</option>
                      </select>
                    </div>
                  </div>

                  {/* 輸出評級 */}
                  <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-2xs text-slate-500 uppercase font-bold tracking-wider">交通評級結果</span>
                      <div className="mt-2 flex items-center gap-2">
                        {commuteTime <= 35 ? (
                          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            🟢 理想通勤時間
                          </div>
                        ) : commuteTime <= 60 ? (
                          <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            🟡 尚可接受 (放學回林口補習OK)
                          </div>
                        ) : (
                          <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            🔴 極度痛苦 (體力消耗過大)
                          </div>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                        與目標高中實測交通：{schoolsData[selectedSchool]?.commuteRating}。
                      </p>
                      <p className="text-slate-300 text-xs mt-2 font-medium">
                        通勤實務分析：{schoolsData[selectedSchool]?.note}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-900">
                      <span className="text-2xs text-slate-500 font-bold uppercase block mb-1">學校戰略定位</span>
                      <p className="text-xs text-indigo-300 font-bold">
                        定位：{schoolsData[selectedSchool]?.level}
                      </p>
                      <p className="text-slate-400 text-2xs mt-1 leading-normal">
                        {schoolsData[selectedSchool]?.schoolStyle} {schoolsData[selectedSchool]?.strategy}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-2xs text-slate-400 leading-relaxed">
                  💡 專家叮嚀：高一生下午 4:10 放學後，約有 2 小時的交通空檔。若通勤時間在 45 分鐘以內，能完美銜接林口在地晚上 6:30 開課的高中先修/段考補習班，避免下課後滯留台北市區至 10:00 拖著疲憊身軀回林口的漫長消耗。
                </div>
              </div>
            )}

            {/* 2. 箱子理論模擬器 */}
            {activeToolId === 'box' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl animate-fade-in">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 mb-4">
                  <Layers className="h-3 w-3" />
                  大免志願分發「箱子理論」模擬器
                </span>

                <h3 className="text-xl font-bold text-slate-200 mb-2">免試志願序防卡死模擬</h3>
                <p className="text-slate-400 text-xs mb-6">
                  模擬基北區免試入學電腦分發邏輯，親自體驗為什麼「絕對不能把安全牌填第一志願」。
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {/* 輸入 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        設定你的會考分數: {userScore} 分
                      </label>
                      <input
                        type="range"
                        min="10.0"
                        max="36.0"
                        step="0.2"
                        value={userScore}
                        onChange={(e) => {
                          setUserScore(parseFloat(e.target.value));
                          setSimResult({ status: null, message: '', details: '' });
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex justify-between text-2xs text-slate-500 mt-1">
                        <span>10.0 分</span>
                        <span>27.6 分 (夢幻門檻)</span>
                        <span>36.0 分</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        設計你的志願順序
                      </label>
                      <div className="space-y-3">
                        <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          strategyOption === 'A' 
                            ? 'border-emerald-500 bg-emerald-500/5' 
                            : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'
                        }`}>
                          <input
                            type="radio"
                            name="strategy"
                            checked={strategyOption === 'A'}
                            onChange={() => {
                              setStrategyOption('A');
                              setSimResult({ status: null, message: '', details: '' });
                            }}
                            className="mt-1 accent-emerald-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">【策略 A】 夢幻放在最前面 (推薦)</span>
                            <span className="text-2xs text-slate-400">第一志願：大同/成淵 (27.6分) | 第二志願：林口高中 (15分)</span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          strategyOption === 'B' 
                            ? 'border-red-500 bg-red-500/5' 
                            : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'
                        }`}>
                          <input
                            type="radio"
                            name="strategy"
                            checked={strategyOption === 'B'}
                            onChange={() => {
                              setStrategyOption('B');
                              setSimResult({ status: null, message: '', details: '' });
                            }}
                            className="mt-1 accent-red-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">【策略 B】 安全牌填在第一位 (大忌)</span>
                            <span className="text-2xs text-slate-400">第一志願：林口高中 (15分) | 第二志願：大同/成淵 (27.6分)</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleSimulate}
                      className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/10 cursor-pointer"
                    >
                      進行模擬分發
                    </button>
                  </div>

                  {/* 模擬分發結果動畫與文字 */}
                  <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[220px]">
                    {simResult.status ? (
                      <div className="space-y-3">
                        <span className="text-2xs text-slate-500 uppercase font-bold tracking-wider block">分發狀態報告</span>
                        
                        {simResult.status === 'success' && (
                          <div className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4" />
                            {simResult.message}
                          </div>
                        )}
                        {simResult.status === 'warning' && (
                          <div className="text-red-400 text-xs font-bold flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 animate-bounce" />
                            {simResult.message}
                          </div>
                        )}
                        {simResult.status === 'info' && (
                          <div className="text-blue-400 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4" />
                            {simResult.message}
                          </div>
                        )}

                        <p className="text-slate-300 text-xs leading-relaxed">
                          {simResult.details}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-1 text-slate-500 text-xs text-center p-4">
                        <HelpCircle className="h-10 w-10 text-slate-600 mb-2 animate-pulse" />
                        設定好會考分數與選填策略後，<br/>點選「進行模擬分發」以觀察電腦箱子分發機制。
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-900 text-2xs text-slate-500">
                      📦 箱子理論：大免電腦依序掃描每個學生的第一志願放進學校「箱子」，滿了則將低分者踢出，踢出者立刻進入其第二志願箱子比拼，前五志願無志願序扣分，所以夢幻必填最前。
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 繁星推薦校排資格檢索 */}
            {activeToolId === 'stars' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl animate-fade-in">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 mb-4">
                  <Award className="h-3 w-3" />
                  繁星推薦在校成績排名檢索器
                </span>

                <h3 className="text-xl font-bold text-slate-200 mb-2">繁星校排資格檢定</h3>
                <p className="text-slate-400 text-xs mb-6">
                  輸入你的高中在校成績百分比（校排 %），檢索對應大學管道的資格限制。
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {/* 輸入 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        你的在校成績排名百分比 (校排 %): {starsPercentage}%
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        value={starsPercentage}
                        onChange={(e) => setStarsPercentage(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex justify-between text-2xs text-slate-500 mt-1">
                        <span>前 1% (頂尖學霸)</span>
                        <span>前 20% (頂大門檻)</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-2xs text-slate-400 leading-relaxed">
                      💡 升學戰略：「繁星推薦」由你就讀的高中直接向大學推薦。這個管道完全不在乎你高中多有名氣，只看你在自己學校的校排 %。在普通高中取得 1% 的難度，遠低於在明星高中取得 1%，此為「寧為雞首」之布局要領。
                    </div>
                  </div>

                  {/* 輸出比對結果 */}
                  <div className="space-y-3">
                    <span className="text-2xs text-slate-500 uppercase font-bold tracking-wider block">繁星推薦分發資格預估</span>
                    
                    <div className="space-y-2">
                      {/* 頂大層級 */}
                      <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">第一梯次：頂尖大學</span>
                          <span className="text-2xs text-slate-400">台大、清大、交大、成大、政大等</span>
                        </div>
                        {starsPercentage <= 20 ? (
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-2xs font-bold">
                            符合報名門檻 (≤20%)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-red-500/10 text-red-400 rounded-full text-2xs font-bold">
                            失去報名資格 ({starsPercentage}%)
                          </span>
                        )}
                      </div>

                      {/* 中段公立 */}
                      <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">第二梯次：中段公立大學</span>
                          <span className="text-2xs text-slate-400">中字輩、代表性地方公立大學</span>
                        </div>
                        {starsPercentage <= 30 ? (
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-2xs font-bold">
                            高度推薦 (≤30%)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 rounded-full text-2xs font-bold">
                            機會較小 ({starsPercentage}%)
                          </span>
                        )}
                      </div>

                      {/* 指標私大 */}
                      <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">第三梯次：指標私立大學</span>
                          <span className="text-2xs text-slate-400">輔大、東吳、淡江、中原等</span>
                        </div>
                        {starsPercentage <= 50 ? (
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-2xs font-bold">
                            極具優勢 (≤50%)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 rounded-full text-2xs font-bold">
                            機會較小 ({starsPercentage}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. 英文單字累積規劃 */}
            {activeToolId === 'vocab' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl animate-fade-in">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 mb-4">
                  <TrendingUp className="h-3 w-3" />
                  高中英文單字每日累積規劃器
                </span>

                <h3 className="text-xl font-bold text-slate-200 mb-2">英文單字累積規劃</h3>
                <p className="text-slate-400 text-xs mb-6">
                  高中三年學測實務單字量高達 13,000 字。輸入你每日預計記憶單字數，評估你高中的大考英語實力。
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {/* 輸入 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        每日背誦單字數量: {dailyWords} 個
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={dailyWords}
                        onChange={(e) => setDailyWords(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex justify-between text-2xs text-slate-500 mt-1">
                        <span>2 個</span>
                        <span>10 個 (精準平衡)</span>
                        <span>30 個</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <span className="text-2xs text-slate-500 font-bold uppercase block mb-1">高中三年累計字彙量</span>
                      <p className="text-2xl font-black text-indigo-400">{totalWordsReached.toLocaleString()} 字</p>
                      <p className="text-slate-400 text-2xs mt-1">
                        計算區間：高中前二年半 (共計 912 天，高三下為分科/申請衝刺期)。
                      </p>
                    </div>
                  </div>

                  {/* 輸出條比對 */}
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-2xs font-bold mb-1">
                        <span className="text-slate-300">教育部高中表定課綱 (7,000 字)</span>
                        <span className="text-indigo-400">{syllabusPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                          style={{ width: `${syllabusPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-2xs font-bold mb-1">
                        <span className="text-slate-300">實際大考與學測高分標準 (13,000 字)</span>
                        <span className="text-purple-400">{examPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                          style={{ width: `${examPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* 評價文字 */}
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <span className="text-2xs text-slate-500 font-bold uppercase block mb-1">專家規劃評語</span>
                      {dailyWords < 5 ? (
                        <p className="text-red-400 text-xs leading-normal">
                          ⚠️ 進度過慢！每天背 {dailyWords} 個單字，三年僅能記憶 {totalWordsReached} 字，連基本課綱都無法應付。請提升至每日至少 8-10 個，否則學測英文科將面臨巨大危機！
                        </p>
                      ) : dailyWords < 15 ? (
                        <p className="text-amber-400 text-xs leading-normal">
                          💡 穩定前進！每日背 {dailyWords} 個單字，能成功突破教育部 7,000 字大關。但若想在大考取得頂標/前標 (13,000字難度)，建議高一起除了課本外，需多讀英文雜誌、學習字首字根擴充單字庫。
                        </p>
                      ) : (
                        <p className="text-emerald-400 text-xs leading-normal">
                          🚀 超群卓越！每日背 {dailyWords} 個單字，三年能熟記 {totalWordsReached} 字，足以應付大考學測 13,000 字的最高標準。請注意持之以恆，背單字重在規律、不在突擊。
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
