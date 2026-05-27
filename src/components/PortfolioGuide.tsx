'use client';

import React, { useState } from 'react';
import { 
  FileText, BookOpen, AlertTriangle, Copy, Check, Info, 
  Calendar, Code, Award, BookOpenCheck, ArrowRight, 
  Layers, Lightbulb, RefreshCw, Eye, Sparkles, CheckSquare, ShieldCheck,
  ChevronRight, X, ExternalLink
} from 'lucide-react';

interface CodeDetail {
  code: string;
  name: string;
  category: 'course' | 'multiple' | 'statement' | 'other';
  limit: string;
  desc: string;
  focus: string;
  example: string;
}

export default function PortfolioGuide() {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'bar' | 'multiple' | 'statement' | 'ai' | 'exam'>('overview');
  
  // A-R 代號狀態
  const [selectedCode, setSelectedCode] = useState<CodeDetail | null>(null);

  // BAR 產生器狀態
  const [barInput, setBarInput] = useState({
    bg: '',
    action: '',
    result: ''
  });
  const [copiedBar, setCopiedBar] = useState(false);

  // N-Code 規劃器狀態
  const [selectedNList, setSelectedNList] = useState<string[]>(['F', 'K']);
  const [nInput, setNInput] = useState({
    grouping: '',
    connection: '',
    growth: ''
  });
  const [showNResult, setShowNResult] = useState(false);

  // AI 誠信自我檢測狀態
  const [aiChecks, setAiChecks] = useState({
    originalText: false,
    originalCode: false,
    declaredUse: false,
    keptPrompts: false,
    noFaking: false
  });
  const [aiTools, setAiTools] = useState({
    polish: false,
    translate: false,
    outline: false
  });
  const [copiedAiDecl, setCopiedAiDecl] = useState(false);

  // A-T 代號詳細資料
  const codeDetails: CodeDetail[] = [
    {
      code: 'A',
      name: '修課紀錄',
      category: 'course',
      limit: '由高中端系統直接傳送 (PDF 格式)',
      desc: '高中三年之在校成績單、核心與選修學科之修課軌跡與選課取向。',
      focus: '特定學群學科表現（如資工系著重數學 A、物理、資訊之級分與排名上升趨勢）。若修習加深加廣、大學先修 (AP) 微積分等課程，能顯著證明挑戰精神。',
      example: '在校成績單、AP 課程修課證明。'
    },
    {
      code: 'B',
      name: '書面報告',
      category: 'course',
      limit: 'PDF 格式，每件限 100 字摘要說明',
      desc: '各學科之期末專題報告、小論文、文學評論、歷史事件專題分析。',
      focus: '學術思辨能力、系統性論證邏輯、文獻引用規範與資料彙整能力。避免放平庸的作業堆疊，應凸顯探究的起點與獨立思考。',
      example: '期末學科專題、小論文、歷史探究研究報告。'
    },
    {
      code: 'C',
      name: '實作作品',
      category: 'course',
      limit: 'PDF、JPG、PNG、MP4 等，每件限 100 字摘要說明',
      desc: '程式代碼實作、網頁開發、微控制器硬體控制成果、創客工藝與實驗設計作品。',
      focus: '動手實作能力、除錯（Debugging）歷程、遭遇技術瓶頸時的探究與應對策略。教授極看重面對錯誤與瓶頸時的系統性解法。',
      example: '自製 Python 爬蟲專案、Arduino 智慧溫室硬體控制、網頁開發成果。'
    },
    {
      code: 'D',
      name: '自然科學領域探究與實作成果',
      category: 'course',
      limit: 'PDF 格式，每件限 100 字摘要說明',
      desc: '物理、化學、生物或地球科學等探究課程之實驗報告、科學探究成果紀錄。',
      focus: '提出假設、設計控制變因、分析實驗數據及進行因果推論之科學素養，以及如何利用實驗證明或證偽假說。',
      example: '物理單擺阻力實驗探究、化學反應速率控制變因報告。'
    },
    {
      code: 'E',
      name: '社會領域探究活動成果',
      category: 'course',
      limit: 'PDF 格式，每件限 100 字摘要說明',
      desc: '田野調查報告、社會議題研究、地方創生方案（如原住民文化流失分析報告）。',
      focus: '社會現象觀察力、多元觀點思辨、質性或量化社會研究方法之應用實力，呈現人文關懷與思辨。',
      example: '地方文史田野調查、弱勢群體就業議題分析。'
    },
    {
      code: 'F',
      name: '高中自主學習計畫與成果',
      category: 'multiple',
      limit: 'PDF 格式，每件限 100 字摘要說明，不需教師認證',
      desc: '高中三年自主學習時間的規劃、執行過程與最終成果報告。',
      focus: '自主規劃與時間管理能力、主動探索熱忱、面對學習瓶頸的應對手段。特別適合放 Coursera、edX 等線上 CS 修課證書與延伸實作。',
      example: '利用自主學習時間完成「Python 資料結構與演算法」線上課與實作專案成果。'
    },
    {
      code: 'G',
      name: '社團活動經驗',
      category: 'multiple',
      limit: 'PDF 格式，每件限 100 字摘要說明，不需教師認證',
      desc: '社團參與證明、成果發表手冊、校內外社團運作之成果紀錄與反思。',
      focus: '跨領域興趣、溝通協調能力、團隊協作與個人特質之發展軌跡。',
      example: '資訊研究社社員成果發表、手語社公演規劃與協調。'
    },
    {
      code: 'H',
      name: '擔任幹部經驗',
      category: 'multiple',
      limit: 'PDF 格式，每件限 100 字摘要說明，不需教師認證',
      desc: '班級幹部、社團幹部、校級組織幹部之聘書與執行成效。',
      focus: '領導特質、組織管理、解決團隊衝突與公共服務之責任感，說明如何克服幹部任內的具體挑戰。',
      example: '班長、社團公關、校學生會副會長之執行紀錄與省思。'
    },
    {
      code: 'I',
      name: '服務學習經驗',
      category: 'multiple',
      limit: 'PDF 格式，每件限 100 字摘要說明，不需教師認證',
      desc: '無償性質之偏鄉服務隊、志工服務、社區公益活動、機構關懷證明與心得。',
      focus: '社會責任感、利他主義特質、同理心及社會實踐精神。',
      example: '圖書館志工、偏鄉兒童電腦推廣服務隊。'
    },
    {
      code: 'J',
      name: '競賽表現',
      category: 'multiple',
      limit: 'PDF 格式，每件限 100 字摘要說明，不需教師認證',
      desc: '學科能力競賽、科展、奧林匹亞、APCS 程式競賽等得獎或參賽紀錄。',
      focus: '專業領域之競爭力、高壓環境下的抗壓性、學術深度與個人突破歷程。即使未得名，分析過程與解題反思依然極具價值。',
      example: '全國高中資訊學科能力競賽佳作、高中科展參賽成果。'
    },
    {
      code: 'K',
      name: '非修課紀錄之成果作品',
      category: 'multiple',
      limit: 'PDF 格式，每件限 100 字摘要說明，不需教師認證',
      desc: '自主開發成果（如個人發表的開源軟體專案、GitHub 貢獻紀錄、硬體控制實作）。',
      focus: '對特定技術的熱忱、課外主動研究能量、自發實作的潛能。資安組考生可在此呈現資安金盾獎專案代碼或 CTF 競賽實作。',
      example: 'GitHub 開源專案（如自製 Discord 機器人）、自主設計的 Unity 遊戲成品。'
    },
    {
      code: 'L',
      name: '檢定證照',
      category: 'multiple',
      limit: 'PDF 格式，每件限 100 字摘要說明，不需教師認證',
      desc: '語言能力檢定（TOEIC/GEPT）、程式能力檢定（APCS）、專業技術士證照。',
      focus: '特定技能之客觀第三方公信力證明。在資工申請中，APCS 達 3 級分以上是極強的第三方公信力指標。',
      example: 'APCS 程式檢定（識讀 4 級/實作 4 級）、多益 (TOEIC) 850 分證書。'
    },
    {
      code: 'M',
      name: '特殊優良表現證明',
      category: 'multiple',
      limit: 'PDF 格式，每件限 100 字摘要說明，不需教師認證',
      desc: '總統教育獎、捐血表揚、校外單位感謝狀、學術獎學金證明。',
      focus: '個人獨特成就、在逆境中奮鬥的精神、或具備高度社會價值的特殊事蹟。',
      example: '總統教育獎證書、校外基金會卓越青年表揚。'
    },
    {
      code: 'N',
      name: '多元表現綜整心得',
      category: 'statement',
      limit: '獨立 PDF 檔，建議 800 字與 3 張圖片內',
      desc: '針對上傳之 10 項多元表現進行高層次提煉與綜整心得撰寫。',
      focus: '能否系統性歸納個人特質、活動間的關聯脈絡、以及在其中獲得的實質成長與科系契合度。避免寫成流水帳。',
      example: '「多元表現綜整心得：探索資訊世界的奇幻旅程」PDF。'
    },
    {
      code: 'O',
      name: '高中學習歷程反思',
      category: 'statement',
      limit: '獨立 PDF 檔，建議 800 字內',
      desc: '就高中三年課程進行回顧，分析自身強弱科目、學習方法的調整與反思。',
      focus: '面對學業瓶頸時的成長型思維（Growth Mindset）、如何調度資源克服困難，並將其連結至目標科系所需的素養。',
      example: '「學習歷程反思：從被動記憶到自主解決問題」PDF。'
    },
    {
      code: 'P',
      name: '就讀動機',
      category: 'statement',
      limit: '獨立 PDF 檔，建議 800 字內',
      desc: '具體說明為何想就讀該特定校系，建立個人特質與該學門的強烈連結。',
      focus: '是否有真實的重大生命契機、特定專案實作或學術探索經驗支撐，避免滿篇溢美之詞，要展現「非此系不可」的必然關聯。',
      example: '「就讀動機：從自製編譯器開啟的清大資工夢」PDF。'
    },
    {
      code: 'Q',
      name: '未來學習計畫與生涯規劃',
      category: 'statement',
      limit: '獨立 PDF 檔，建議 800 字內',
      desc: '描繪大一至大四的專業核心修課、跨領域學習規劃，以及長期學術或科技產業生涯目標。',
      focus: '學習藍圖的具體程度。是否了解該系課程設計？是否有跨領域或五年學碩士對接規劃？展現高度自主學習規劃力。',
      example: '「未來學習計畫：專攻人工智慧與邊緣運算」PDF。'
    },
    {
      code: 'R',
      name: '其他有利審查資料',
      category: 'other',
      limit: '依各校系規範，通常為獨立 PDF 檔',
      desc: '自傳、無法被歸類於前述項目的獨特閃光點、或校系特定文件。',
      focus: '額外的有利資料，如 Coursera CS 專業證照、GitHub 社群貢獻軌跡、高難度小論文等，亦可用於呈現在逆境中成長的特質。',
      example: '自主研讀「Deep Learning Specialization」證照、GitHub 開源專案貢獻紀錄。'
    },
    {
      code: 'S',
      name: '經濟弱勢證明',
      category: 'other',
      limit: '獨立 PDF 檔，依各校系規範',
      desc: '低收入戶、中低收入戶證明，特殊境遇家庭證明。',
      focus: '通常配合「旭日組」或「願景組」招生使用，佐以在逆境中奮鬥成長之人格特質描述。',
      example: '低收入戶證明書、特殊境遇家庭扶助公文。'
    },
    {
      code: 'T',
      name: '其他自訂項目',
      category: 'other',
      limit: '獨立 PDF 檔，依校系自訂，十字以內說明',
      desc: '部分校系自訂的特殊表單、聲明書或特定切結書。',
      focus: '是否有完整配合填寫校系規定的特殊表件。',
      example: '考生誠信聲明切結書、健康檢查或特定術科報名表。'
    }
  ];

  // 輔助函式：複製文字到剪貼簿
  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 動態生成 BAR 段落
  const generateBarText = () => {
    const b = barInput.bg.trim();
    const a = barInput.action.trim();
    const r = barInput.result.trim();
    if (!b && !a && !r) return '請在上方輸入框輸入內容，此處將自動生成段落...';
    
    return `${b ? `【背景】${b}` : ''} ${a ? `【行動與突破】${a}` : ''} ${r ? `【結果與反思】${r}` : ''}`.trim();
  };

  // N-Code 心得大綱生成
  const generateNOutline = () => {
    const codesStr = selectedNList.map(c => `代號 ${c}（${codeDetails.find(d => d.code === c)?.name}）`).join('、');
    return `多元表現綜整心得架構大綱
一、歸納分類（先點名）
本人在此次申請中勾選上傳了 ${selectedNList.length} 項多元表現，包含：${codesStr}。我將其歸納為以下兩大核心素質：
1. 【${nInput.grouping || '核心能力A'}】：代表我在資訊領域的硬核實作與探索熱忱。
2. 【核心能力B】：展現了我的團隊合作能力與領導溝通特質。

二、因果脈絡（增脈絡）
這些活動並非孤立發生，而是呈現出相輔相成的學習軌跡：
* 【連結鏈結】：${nInput.connection || '因為自主學習(F)研讀了相關演算法，激發了我參與程式競賽(J)的決心，並在過程中自發開發了非修課作品(K)。'}

三、核心成長與價值提煉（寫成長）
這些多元經歷深刻地塑造了我的能力，並契合目標科系：
* 【具體成長】：${nInput.growth || '我不再只是個被動的程式碼撰寫者，而是學會了如何系統化定義問題、在大規模專案中與他人進行技術溝通，並具備面對瓶頸時調度文獻與工具除錯的韌性。這正符合貴系選拔兼具理論與實作資訊領袖人才的教育願景。'}`;
  };

  // AI 使用宣告生成
  const generateAiDeclaration = () => {
    const usedTools: string[] = [];
    if (aiTools.polish) usedTools.push('語言流暢度潤飾（如中英文語法檢查、修辭優化）');
    if (aiTools.translate) usedTools.push('外文參考文獻翻譯輔助');
    if (aiTools.outline) usedTools.push('研究筆記梳理與自述大綱邏輯整理');

    if (usedTools.length === 0) {
      return `【生成式 AI 工具使用聲明】
本人在此鄭重聲明：本備審資料之所有核心內容（包含學習歷程自述 O-Q、多元表現綜整心得 N、課程成果 B-D 等）及所有實作程式碼，均由本人親自撰寫與開發，未曾使用任何生成式 AI 工具進行內容代寫或虛構經歷。`;
    }

    return `【生成式 AI 工具使用聲明】
本人在此鄭重聲明：本備審資料之核心內容與程式碼專案均由本人親自研發與撰寫，保證經歷之真實性。在寫作與準備過程中，本人曾適度調度生成式 AI 工具（如 ChatGPT/Claude）輔助，具體協作範圍如下：
${usedTools.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}
本人保證 AI 僅作為語言流暢度與大綱整理之輔助工具，並已妥善保存原始開發手稿、與 AI 之原始對話紀錄（Prompts）以供備查，恪守學術誠信。`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-start">
      
      {/* 頁面標題 */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-3">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            大學二階指定項目甄試決勝兵法
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100 flex items-center justify-center sm:justify-start gap-2">
            <FileText className="h-9 w-9 text-indigo-400" />
            大學申請入學：備審與甄試全攻略
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            參考頂大選才標準，解密 108 課綱備審資料代號，提供 BAR 除錯原則寫作產生器及二階口筆試實戰攻略。
          </p>
        </div>
        
        {/* 切換子分頁標籤 */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 self-center sm:self-auto shadow-inner">
          {[
            { id: 'overview', name: '代號解密', icon: Layers },
            { id: 'bar', name: 'BAR 成果寫作', icon: Code },
            { id: 'multiple', name: '多元提煉 (N)', icon: BookOpenCheck },
            { id: 'statement', name: '自述規劃 (O-Q)', icon: BookOpen },
            { id: 'ai', name: 'AI 誠信邊界', icon: ShieldCheck },
            { id: 'exam', name: '二階甄試戰略', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          1. 網站首頁：108課綱審查資料（A-R代號）破關總覽
          ======================================================== */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* 最高指導原則宣導 */}
          <div className="glass-panel border border-indigo-500/20 bg-slate-950/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Info className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">大學教授審查的最高指導原則</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                審查資料秉持<strong className="text-indigo-300 font-bold">「重質不重量」</strong>與<strong className="text-indigo-300 font-bold">「綜合評量」</strong>之精神。不要盲目去累積無意義的證照與營隊結業證書（活動積點），因為排版多華麗並不能決定分數，教授看重的是考生在在校表現、學術反思、除錯歷程及真實學術誠信。
              </p>
            </div>
          </div>

          {/* 代號網格列表 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-200">108 課綱審查代號庫 (A 至 T)</h3>
              <span className="text-xs text-slate-500">點擊卡片解鎖詳細繳交規格與教授關注核心</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {codeDetails.map((detail) => (
                <div
                  key={detail.code}
                  onClick={() => setSelectedCode(detail)}
                  className="group cursor-pointer p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between h-36 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full filter blur-xl group-hover:bg-indigo-500/10 transition-colors" />
                  <div className="flex justify-between items-start">
                    <span className="text-2xl font-black text-slate-500 group-hover:text-indigo-400 transition-colors">
                      {detail.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      detail.category === 'course' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      detail.category === 'multiple' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      detail.category === 'statement' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {detail.category === 'course' ? '課程學習' :
                       detail.category === 'multiple' ? '多元表現' :
                       detail.category === 'statement' ? '綜整自述' : '其他補充'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-slate-100 transition-colors line-clamp-1">
                      {detail.name}
                    </h4>
                    <p className="text-slate-500 text-[10px] line-clamp-2 mt-1 leading-snug">
                      {detail.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 代號詳細資料彈窗 (Modal) */}
          {selectedCode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <button
                  onClick={() => setSelectedCode(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                
                {/* 彈窗內容 */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-indigo-400">
                      {selectedCode.code}
                    </span>
                    <div>
                      <h3 className="text-2xl font-black text-slate-100">{selectedCode.name}</h3>
                      <span className="text-xs text-slate-400 font-medium">代號分類：{
                        selectedCode.category === 'course' ? '在校成績與課程學習成果' :
                        selectedCode.category === 'multiple' ? '多元表現紀錄' :
                        selectedCode.category === 'statement' ? '多元表現綜整心得與學習歷程自述' : '其他不利或補充有利審查資料'
                      }</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-xs">
                    <strong className="text-indigo-300 block mb-1">📁 繳交格式與系統限制：</strong>
                    <span className="text-slate-300">{selectedCode.limit}</span>
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed">
                    <div>
                      <strong className="text-slate-200 block mb-1">🔍 實務內容說明：</strong>
                      <p className="text-slate-400">{selectedCode.desc}</p>
                    </div>

                    <div>
                      <strong className="text-indigo-400 block mb-1">💡 審查委員評分與關注核心：</strong>
                      <p className="text-slate-300 bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10">
                        {selectedCode.focus}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-200 block mb-1">📝 典型上傳範例：</strong>
                      <p className="text-slate-400 font-mono text-xs">{selectedCode.example}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => setSelectedCode(null)}
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      關閉視窗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          2. 核心戰區一：課程學習成果（代號 A-E）怎麼寫？
          ======================================================== */}
      {activeSubTab === 'bar' && (
        <div className="space-y-8 animate-fade-in">
          {/* BAR 說明區 */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                不要寫成流水帳！使用 BAR 原則進行動態敘事
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                教授最討厭的課程成果是「流水帳式」的實驗步驟、程式代碼貼上或課堂作業純堆疊。這無法展現你的思辨與能力。大學選才重視的是：
                <strong className="text-indigo-400 block mt-2">如何定義問題 ➔ 如何設計解法 ➔ 「遭遇系統性瓶頸時，如何 Debug、查閱文獻突破困境」的真實歷程。即使專案失敗，能深刻分析原因也是極大加分！</strong>
              </p>

              {/* BAR 定義 */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                  <span className="font-outfit font-black text-indigo-400 block text-lg">B</span>
                  <span className="text-xs font-bold text-slate-200">Background (背景)</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">遭遇了什麼問題？為什麼要做這項探究？目標是什麼？</p>
                </div>
                <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                  <span className="font-outfit font-black text-purple-400 block text-lg">A</span>
                  <span className="text-xs font-bold text-slate-200">Action (行動與除錯)</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">設計了什麼解法？遇到何種瓶頸？如何 Debug 或查找文獻解決？</p>
                </div>
                <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <span className="font-outfit font-black text-emerald-400 block text-lg">R</span>
                  <span className="text-xs font-bold text-slate-200">Result & Reflection</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">最終成果如何？有何量化成效？如果失敗了，原因與反思為何？</p>
                </div>
              </div>
            </div>

            {/* 清大資工範例對照 */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 block mb-2">CS 領域實務寫作範例對照</span>
                <h4 className="text-sm font-bold text-slate-200 mb-4">以資工系「程式實作成果 (C)」為例</h4>
                
                <div className="space-y-4">
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <span className="text-[10px] font-bold text-red-400 block">❌ 糟糕範例 (流水帳)</span>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      「高中期末作業是要寫一個貪食蛇遊戲，我使用 Python 寫了這個程式。我總共寫了 200 行代碼，並做出了畫面。我有用 class 來定義蛇，並用迴圈來偵測碰撞。我有順利交給老師拿到 90 分。」
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-400 block">✅ 優秀範例 (BAR 動態除錯)</span>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      「為解決期末專案在低延遲偵測碰撞的挑戰【B】，我自主規劃物件導向設計重構貪食蛇架構。開發中遭遇當蛇身長度大於 50 節時，碰撞迴圈產生明顯 Lag，幀率掉到 20fps 的瓶頸。經查閱文獻，我將傳統的 O(N^2) 遍歷碰撞演算法，優化為使用空間分割 (Spatial Partitioning) 的四元樹 (Quadtree) 演算法【A】。成功讓蛇身長度破百時，運算複雜度降至 O(N log N)，幀率穩定保持在 60fps。此專案讓我深刻反思演算法時間複雜度於實作中的關鍵性【R】。」
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAR 產生器輔助工具 */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 mb-4">
              <Code className="h-4 w-4" />
              動態 BAR 成果寫作產生器
            </span>
            <h3 className="text-xl font-bold text-slate-100 mb-2">撰寫您的課程實作精華</h3>
            <p className="text-slate-400 text-xs mb-6">
              在下方輸入框中填入您的專案經歷，右側會動態拼接成一個富含邏輯的 BAR 動態敘事段落。
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 左側輸入 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Step 1: Background - 研究/專案背景 (定義問題與目的)
                  </label>
                  <textarea
                    value={barInput.bg}
                    onChange={(e) => setBarInput({ ...barInput, bg: e.target.value })}
                    placeholder="範例：在進行『物理單擺擺動實驗』時，我發現傳統手動計時會帶來 0.2 秒以上的隨機人為誤差，導致無法精準分析阻力效應..."
                    className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Step 2: Action - 執行行動與除錯過程 (核心瓶頸與如何克服)
                  </label>
                  <textarea
                    value={barInput.action}
                    onChange={(e) => setBarInput({ ...barInput, action: e.target.value })}
                    placeholder="範例：為解決人為計時誤差，我決定用 Arduino 控制紅外線傳感器進行自動計時。開發中遭遇外部光線對光敏電阻的環境干擾，計時常隨機誤判。經除錯，我設計了一套動態門檻校準演算法 (Calibration Algorithm)，並查文獻改採紅外線接收頭進行光學解調..."
                    className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Step 3: Result & Reflection - 成果與反思效益 (成效與收穫)
                  </label>
                  <textarea
                    value={barInput.result}
                    onChange={(e) => setBarInput({ ...barInput, result: e.target.value })}
                    placeholder="範例：最終成功將實驗誤差控制在 0.01 秒以內，精準計算出單擺擺動阻力衰減係數。這項探究讓我體會到，現實工程問題必須藉由主動除錯與感測器優化，才能取得可靠數據，並培養了我排查硬體錯誤的能力。"
                    className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* 右側即時生成與複製 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-2xs text-slate-500 uppercase font-bold tracking-wider block mb-2">動態拼接預覽</span>
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed min-h-[220px] whitespace-pre-wrap">
                    {generateBarText()}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex justify-between items-center">
                  <span className="text-2xs text-slate-500 font-medium">可直接複製此內容作為您成果說明書的核心敘事</span>
                  <button
                    onClick={() => copyToClipboard(generateBarText(), setCopiedBar)}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedBar ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedBar ? '複製成功' : '複製段落'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. 核心戰區二：多元表現與綜整心得（代號 F-N）的提煉術
          ======================================================== */}
      {activeSubTab === 'multiple' && (
        <div className="space-y-8 animate-fade-in">
          {/* 多元項目重點說明 */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-emerald-400" />
                多元表現核心認證與三步驟提煉心得 (N)
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                多元表現最多可上傳 10 項（自主學習 F、競賽 J、非修課作品 K、證照 L 等）。然而，教授並不想看到十個毫無關聯的參賽證明或檢定。
                <strong className="text-emerald-400 font-bold block mt-2">多元表現綜整心得（代號 N，限 800 字及 3 張圖片）是二階書審重中之重。它並非單純條列活動，而是一次高階的自我能力論證。</strong>
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">Step 1. 先點名 (歸納分類)</span>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    將勾選的多元表現按素養歸納（如將自主學習與 APCS 歸為「資訊熱忱」；社團幹部歸為「團隊協作」）。
                  </p>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">Step 2. 增脈絡 (建立關聯)</span>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    串聯活動的發展軌跡（如：因為自主學習 F 引發興趣，進而開發專案 K，並透過 J/L 檢定自身實力）。
                  </p>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">Step 3. 寫成長 (價值提煉)</span>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    說明活動如何改變你解決問題的思維、同理心、抗壓性，並對接科系核心特質。
                  </p>
                </div>
              </div>
            </div>

            {/* APCS 專區 */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 space-y-4">
              <span className="text-xs font-bold text-purple-400 block mb-1">🏆 資訊學群檢定指標：APCS</span>
              <h4 className="text-sm font-bold text-slate-200">APCS (大學程式設計先修檢測)</h4>
              <p className="text-slate-400 text-xs leading-normal">
                APCS 分為**「程式識讀」**與**「程式實作」**。識讀考查時間複雜度分析、遞迴追蹤與邏輯推理；實作考驗演算法實作，建議準備時使用語法相對精簡且容錯度高的 **Python**，降低語法錯誤機率。
              </p>
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-xl text-xs leading-normal font-bold">
                🎯 大學申請關鍵：APCS 實作與識讀若能取得 3 級分以上，將大幅提高個人申請 APCS 組及特殊選才的錄取機率！
              </div>
            </div>
          </div>

          {/* N碼 規劃輔助工具 */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 mb-4">
              <BookOpenCheck className="h-4 w-4" />
              多元表現綜整心得 (N) 結構規劃工具
            </span>
            <h3 className="text-xl font-bold text-slate-100 mb-2">提煉您的課外多元表現</h3>
            <p className="text-slate-400 text-xs mb-6">
              選擇您要勾選的多元表現，並回答三步驟問題，自動產出您的綜整心得寫作大綱。
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 左側輸入 */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    選擇已勾選上傳的項目 (複選)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].map((code) => {
                      const isSelected = selectedNList.includes(code);
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedNList(selectedNList.filter(c => c !== code));
                            } else {
                              setSelectedNList([...selectedNList, code]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' 
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {code} - {codeDetails.find(d => d.code === code)?.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Step 1: 先點名 - 分類與核心特質歸納 (例如「資訊硬核實力」、「溝通協作與社會服務」等)
                  </label>
                  <input
                    type="text"
                    value={nInput.grouping}
                    onChange={(e) => setNInput({ ...nInput, grouping: e.target.value })}
                    placeholder="範例：專注主動學習的資訊學科熱忱"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Step 2: 增脈絡 - 簡述這些活動的發展軌跡與內在關聯
                  </label>
                  <textarea
                    value={nInput.connection}
                    onChange={(e) => setNInput({ ...nInput, connection: e.target.value })}
                    placeholder="範例：在高一自主學習 (F) 線上研究演算法後，啟發了我參與學科能力競賽 (J) 的勇氣。為了解決競賽碰到的瓶頸，我自主開發了一套開源專案 (K) 並發布在 GitHub，隨後取得了 APCS 識讀與實作 4 級分 (L) 的認證。"
                    className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Step 3: 寫成長 - 這些表現如何證明你契合目標科系
                  </label>
                  <textarea
                    value={nInput.growth}
                    onChange={(e) => setNInput({ ...nInput, growth: e.target.value })}
                    placeholder="範例：這些課外實戰讓我跳脫傳統的課堂框架，培養了發現問題、除錯突破的工程師素養。並且社團幹部 (H) 經驗提升了技術溝通實力，讓我能將複雜的邏輯用口頭清晰表達，契合資工系重視實作與技術傳播的精神。"
                    className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <button
                  onClick={() => setShowNResult(true)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  生成 N-Code 大綱結構
                </button>
              </div>

              {/* 右側輸出與複製 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-2xs text-slate-500 uppercase font-bold tracking-wider block mb-2">心得大綱結果</span>
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed min-h-[300px] whitespace-pre-wrap font-mono">
                    {showNResult ? generateNOutline() : '請在左側輸入框中完成設定，並點擊下方「生成 N-Code 大綱結構」按鈕。'}
                  </div>
                </div>

                {showNResult && (
                  <div className="mt-4 pt-4 border-t border-slate-900 flex justify-end">
                    <button
                      onClick={() => copyToClipboard(generateNOutline(), () => {})}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      複製大綱架構
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. 核心戰區三：學習歷程自述（代號 O-Q）— 你的最強個人提案
          ======================================================== */}
      {activeSubTab === 'statement' && (
        <div className="space-y-8 animate-fade-in">
          {/* OPQ 三大維度說明 */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              自述三劍客 (O、P、Q)：把你的志願當作「商業提案」來寫
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              學習歷程自述是書面審查的決定性戰場。必須具備嚴密的邏輯與具體事證，嚴禁感性修辭或流水帳式的生平介紹。應圍繞三個核心維度展開：
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-outfit font-black text-indigo-400 text-xs">
                    O
                  </span>
                  <h4 className="text-sm font-bold text-slate-200">高中學習歷程反思</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  就高中三年課程進行回顧。分析自己強弱科目、面對瓶頸時如何調整學習策略。重點在展現「面對困難時的成長型思維」，並說明這些努力如何厚實了你修讀目標科系的基礎（如數理或英文）。
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-outfit font-black text-indigo-400 text-xs">
                    P
                  </span>
                  <h4 className="text-sm font-bold text-slate-200">就讀動機</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  結合個人重大生命契機、特定專案實作或學術探索經驗，具體說明想就讀該校系之原因。建立個人特質、專長與學門的強烈連結，論證「非就讀不可」的獨特說服力。
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-outfit font-black text-indigo-400 text-xs">
                    Q
                  </span>
                  <h4 className="text-sm font-bold text-slate-200">未來學習計畫與生涯規劃</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  描繪大一到大四的專業核心修課、跨領域學習與長期目標。計畫必須「可行且具體」，應與該系的修課地圖與重點子領域（如 AI、雲端、晶片設計）對接，展現高強度的自主規劃力。
                </p>
              </div>
            </div>
          </div>

          {/* 清大資工 CS 領域修課地圖與學習規劃對接參考 */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Code className="h-5 w-5 text-indigo-400" />
              清大資工系（示範）核心修課與未來計畫 (Q) 參考藍圖
            </h3>
            <p className="text-xs text-slate-400">
              撰寫未來學習計畫時，應避免寫出「努力讀書、考取英檢」等空泛計畫。可以將資工系大一至大四的修課與未來重點研究方向結合，展現專業度：
            </p>

            <div className="grid md:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                <span className="text-[10px] font-bold text-slate-500 block">大一 · 奠定數理與程式核心</span>
                <p className="text-xs text-indigo-300 font-bold mt-1">微積分、線性代數、計算機概論與程式設計</p>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">高一高二的 APCS 實作經歷可以作為免修或銜接加深學科的動機。</p>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                <span className="text-[10px] font-bold text-slate-500 block">大二 · 電腦核心架構與底層理論</span>
                <p className="text-xs text-indigo-300 font-bold mt-1">資料結構、演算法、離散數學、計算機組織</p>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">深入探討程式運行效率，為高階系統與演算法實作做準備。</p>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                <span className="text-[10px] font-bold text-slate-500 block">大三 · 專業次領域與專題開發</span>
                <p className="text-xs text-indigo-300 font-bold mt-1">作業系統、編譯器、AI/多媒體專題、企業實務工讀</p>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">清大資工強烈推薦暑期至國內外知名企業實務工讀，可作為計畫的亮點。</p>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                <span className="text-[10px] font-bold text-slate-500 block">大四 · 前沿整合與五年學碩士銜接</span>
                <p className="text-xs text-indigo-300 font-bold mt-1">機器學習、雲端計算、直攻博士/五年學碩士管道</p>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">計畫寫明對接五年學碩士雙學位，展現出高度的自主探索和明確的學術抱負。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. 關鍵警告：生成式 AI 使用邊界與學術誠信
          ======================================================== */}
      {activeSubTab === 'ai' && (
        <div className="space-y-8 animate-fade-in">
          {/* AI 使用紅線表格 */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
              學術誠信天條：生成式 AI 協作使用紅線
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              頂大（如清華大學）已建立極為明確的**「招生誠信聲明與 AI 使用樣態查驗機制」**。學系審查委員若對自述內容或程式碼專案真實性有懷疑，二階甄試期間有權要求考生限期提供電子或實體格式的**「原始提問紀錄 (Prompts)」與「開發軌跡」**以供查驗。一旦查證代寫、造假屬實，將面臨取消錄取資格等嚴重處分。
            </p>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              {/* 可接受 */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mb-3">
                  <CheckSquare className="h-4 w-4" />
                  誠信合規：可接受的 AI 工具輔助
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li><strong className="text-slate-200">語言流暢度潤飾</strong>：拼字檢查、修正基本語法錯誤，或優化既有文句之通順度與修辭表現。</li>
                  <li><strong className="text-slate-200">翻譯輔助</strong>：將外文參考文獻、技術規格書翻譯為中文，或將個人專案摘要譯為英文。</li>
                  <li><strong className="text-slate-200">邏輯大綱整理</strong>：協助梳理繁雜的研究筆記、構思備審大綱與重點分類，文字與反思仍親自執筆。</li>
                </ul>
              </div>

              {/* 禁止 */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-red-400 flex items-center gap-1.5 mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  違規越界：禁止之 AI 完全替代
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li><strong className="text-slate-200">代寫核心自陳</strong>：指使 AI 生成完整的就讀動機 (P)、讀書計畫 (Q) 或學習歷程反思 (O)。</li>
                  <li><strong className="text-slate-200">虛構學術與課外經歷</strong>：利用 AI 虛偽編造未曾實際參與的社團經歷、服務、競賽獲獎。</li>
                  <li><strong className="text-slate-200">非原創之 AI 產出作品</strong>：提交完全由 AI 自動生成的程式碼、演算法邏輯、工程設計或研究小論文。</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AI 誠信自檢清單 & 申報書生成器 */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 mb-4">
              <ShieldCheck className="h-4 w-4" />
              AI 誠信自我檢測清單與申報文字生成器
            </span>
            <h3 className="text-xl font-bold text-slate-100 mb-2">確認您的備審合規性</h3>
            <p className="text-slate-400 text-xs mb-6">
              勾選下方的誠信檢查項目與您曾使用的 AI 工具，系統將動態為您生成可貼在備審資料附錄的「AI 協作聲明」。
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 左側勾選 */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">誠信合規自檢表</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'originalText', label: '我的備審自述（N、O、P、Q）文字皆為親自撰寫，無 AI 代寫。' },
                      { id: 'originalCode', label: '我提交的專案程式碼與實作均為本人親自編寫與測試。' },
                      { id: 'noFaking', label: '我沒有透過 AI 虛構任何不曾參與的活動或經歷。' },
                      { id: 'declaredUse', label: '我願意在備審資料中主動誠實申報 AI 使用工具與範圍。' },
                      { id: 'keptPrompts', label: '我已妥善保存原始開發手稿及與 AI 交互的 Prompt 紀錄以防面試抽查。' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-900/50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={(aiChecks as any)[item.id]}
                          onChange={(e) => setAiChecks({ ...aiChecks, [item.id]: e.target.checked })}
                          className="mt-1 h-3.5 w-3.5 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                        />
                        <span className="text-xs text-slate-300 leading-normal">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">申報使用 AI 的協作範圍</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'polish', label: '拼字檢查與文句修辭語言潤飾' },
                      { id: 'translate', label: '外文文獻閱讀之翻譯輔助' },
                      { id: 'outline', label: '研究筆記大綱與邏輯整理' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-900/50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={(aiTools as any)[item.id]}
                          onChange={(e) => setAiTools({ ...aiTools, [item.id]: e.target.checked })}
                          className="h-3.5 w-3.5 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                        />
                        <span className="text-xs text-slate-300">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 右側聲明書輸出 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-2xs text-slate-500 uppercase font-bold tracking-wider block mb-2">自動產出：誠信使用 AI 申報書文字</span>
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed min-h-[220px] whitespace-pre-wrap font-mono">
                    {generateAiDeclaration()}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex justify-between items-center">
                  <span className="text-2xs text-slate-500 font-medium">請確認左側「誠信合規自檢表」皆符合規範！</span>
                  <button
                    onClick={() => copyToClipboard(generateAiDeclaration(), setCopiedAiDecl)}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedAiDecl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedAiDecl ? '複製成功' : '複製聲明書'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. 最終決戰：二階甄試（筆試與口試）實戰戰略
          ======================================================== */}
      {activeSubTab === 'exam' && (
        <div className="space-y-8 animate-fade-in">
          {/* 清大資工 115 招生與二階對照表 */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-400" />
              清大資工 115 學年度二階指定項目甄試對比與戰略
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              清華大學資訊工程學系針對不同專長學生，設計了差異化的二階甄試決勝關鍵：
            </p>

            <div className="grid md:grid-cols-3 gap-6 pt-2">
              {/* 乙組 */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-indigo-400 block">乙組 (資訊工程組)</span>
                <h4 className="text-sm font-bold text-slate-200">決勝戰場：共同數學筆試</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  二階加考數學筆試（禁止使用計算機）。命題深度超越一般高中學測數學 A 範圍，涵蓋高難度邏輯與組合數學推理、微積分初步與線性代數概念。必須大量演練邏輯證明題以培養手感。
                </p>
              </div>

              {/* APCS 組 */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-purple-400 block">APCS 組</span>
                <h4 className="text-sm font-bold text-slate-200">決勝戰場：專業口試</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  無筆試，決戰在於佔分極高的專業口試。口試委員將現場追問上傳專案的代碼邏輯。常見考法為：要求考生在白板上即時推演特定演算法邏輯、分析時間複雜度，極度考驗「技術溝通實力」。
                </p>
              </div>

              {/* 資安組 */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-emerald-400 block">資安組</span>
                <h4 className="text-sm font-bold text-slate-200">決勝戰場：資安實務口試</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  評估資安實務潛能與口試。考官會重點針對考生提交之資安實作、金盾獎專案等代碼進行追問，評估其面對漏洞防禦架構之邏輯思辨力。
                </p>
              </div>
            </div>
          </div>

          {/* 115 二階時程動態時間軸 */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-400" />
              清大資工 115 學年度個人申請二階重要日程動態時間軸
            </h3>
            
            <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-8">
              {[
                { date: '2026/04/15', title: '說明會報名截止', desc: '考生必須於今日截止前，完成清大資工系網頁之線上說明會報名登記。' },
                { date: '2026/04/18', title: '申請入學線上說明會', desc: '上午 10:00 - 12:00 線上進行。教授親自深入解析各組別課程設計、二階甄試與選才方向。' },
                { date: '2026/05/05 (或05/06)', title: '備審資料勾選上傳截止', desc: '最終版本之審查資料與學術誠信使用聲明書必須上傳至甄選會系統，切勿拖到最後一刻。' },
                { date: '2026/05/11 - 05/13', title: '二階甄試公告與座位查詢', desc: '至系網或招生策略中心查詢筆試試場分配、口試時間表及應考注意事項。' },
                { date: '2026/05/16 (六)', title: '第二階段指定項目甄試 (決戰日)', desc: '全天進行二階指定項目（乙組共同數學筆試，APCS與資安組專業口試）。' },
                { date: '2026/05/29 (五)', title: '甄選錄取結果公告', desc: '官方正式公告正備取名單及聯合分發注意事項，決定大學之路的最終站！' }
              ].map((event, idx) => (
                <div key={idx} className="relative">
                  {/* 時間軸圓點 */}
                  <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 border-2 border-indigo-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-indigo-400 font-mono">{event.date}</span>
                    <h4 className="text-sm font-bold text-slate-200 mt-0.5">{event.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 口試白板推演演算法邏輯技巧 */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Code className="h-5 w-5 text-indigo-400" />
                口試白板題技巧：如何展現工程師素養？
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                當被考官要求在白板上即時推演演算法（如二分搜尋法 Binary Search、動態規劃等）或分析時間複雜度時，千萬不要悶著頭寫。
                <strong className="text-indigo-300 block mt-1.5">
                  決勝關鍵是「技術溝通實力」！一邊在白板上寫邏輯，一邊清晰說出你的思考路徑（Thinking Out Loud）。若遇到卡住的未知問題，主動說明你發現的瓶頸與擬採取的優化手段，向委員展現你在高壓技術環境下的思維韌性與沉著素養。
                </strong>
              </p>
            </div>
            
            <a 
              href="https://dcs.site.nthu.edu.tw/p/406-1174-298552,r668.php" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 hover:text-slate-100 transition-all shrink-0 cursor-pointer"
            >
              清大資工指引官網
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
      
    </div>
  );
}
