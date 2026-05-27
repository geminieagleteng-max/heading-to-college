import { Department, SecondStageDetails } from '../types';

const GROUP_BASE_GUIDELINES: { [key: string]: SecondStageDetails } = {
  '資訊學群': {
    courseRecord: '偏重科技領域（資訊科技、進階資訊科技）、數學領域（數學甲、專題研究）。',
    learningOutcomes: '建議提交個人程式設計專案成果、資訊科技課堂書面報告、或物理/資訊相關的探究與實作報告。',
    multiplePerformances: '自主學習計畫（如程式語言自學、網頁開發日誌）、APCS 檢定級分、資訊科學競賽或檢定證書。',
    interviewFocus: '著重程式邏輯思維（數理推理）、自傳專案開發細節、演算法解題概念與臨場問答。',
    additionalRequirements: '具備 APCS 檢定或大學程式能力檢定（CPE）等證照具備顯著加分優勢。'
  },
  '工程學群': {
    courseRecord: '偏重自然科學領域（物理、化學）、數學領域（數學甲）。',
    learningOutcomes: '物理或化學探究與實作報告、手作實體模型與機構設計成果報告、生活科技實作作品。',
    multiplePerformances: '自主學習計畫（創客/硬體實作、電子電路）、數理學科競賽、科展參與證明。',
    interviewFocus: '基本物理與電路觀念、創新問題解決邏輯、高中專題實作作品問答。',
    additionalRequirements: '重視動手實作的熱情與空間幾何概念，建議提供實體作品照片及設計圖面。'
  },
  '數理化學群': {
    courseRecord: '偏重數學領域（數學甲）、自然科學領域（物理、化學）。',
    learningOutcomes: '高中數學專題推導、物理/化學實驗日誌與深度探究報告、科展研究成果。',
    multiplePerformances: '奧林匹亞學科競賽參與、數學/科學能力檢定證明（如AMC）、學術探究自主學習計畫。',
    interviewFocus: '基礎數理概念現場口頭推理、學術探究熱忱、抽象邏輯分析能力。',
    additionalRequirements: '極度重視學術純粹探求的耐心與嚴謹的邏輯思維，適合對基礎科學研究有高度熱忱者。'
  },
  '地球環境學群': {
    courseRecord: '偏重自然科學領域（地球科學、地理、化學）、英文領域。',
    learningOutcomes: '野外地質考察報告、氣象或海洋議題小論文、環境探究與實作成果。',
    multiplePerformances: '地球科學或氣象營隊證明、淨灘或環保志工經歷、地理資訊系統（GIS）自主學習成果。',
    interviewFocus: '對環境永續（ESG）與氣候變遷的時事觀點、野外觀察與生態思維。',
    additionalRequirements: '重視對大自然野外考察的體能與熱忱，ESG 永續規劃師為未來熱門職涯。'
  },
  '生命科學學群': {
    courseRecord: '偏重自然科學領域（生物、化學）、英文領域。',
    learningOutcomes: '分子生物/基因工程相關實驗報告、生物學科小論文、探究與實作書面成果。',
    multiplePerformances: '生命科學營隊、大學實驗室短期參訪結業證書、生物領域自主學習計畫。',
    interviewFocus: '微觀生物學基礎觀念（如細胞、遺傳學）、實驗設計思維與邏輯推理。',
    additionalRequirements: '教授重視實驗室耐受度，建議於自傳中強調基礎實驗操作理解與細心態度。'
  },
  '醫藥衛生學群': {
    courseRecord: '偏重自然科學領域（生物、化學）、英文領域、健康與護理。',
    learningOutcomes: '探究與實作（生命科學相關）成果報告、生醫議題書面報告、科學探究成果。',
    multiplePerformances: '醫療院所志工服務時數證明、生醫/護理營隊證書、自主學習生醫倫理。',
    interviewFocus: '醫學倫理思辨（如安樂死、醫療資源分配）、同理心與抗壓性、即席情境問答。',
    additionalRequirements: '重視醫德、人際溝通與團隊合作能力。若為牙醫系，二階通常包含術科測驗（素描、雕刻實作）。'
  },
  '生物資源學群': {
    courseRecord: '偏重自然科學領域（生物、化學）、農業/食品科技。',
    learningOutcomes: '動植物觀察報告、食品安全與加工小專題、生態環境與農業發展探究報告。',
    multiplePerformances: '農牧場實習證書、獸醫/食品營隊、環境保育自主學習。',
    interviewFocus: '對農業科技永續、食安議題或獸醫倫理的見解，實務操作能力。',
    additionalRequirements: '重視對動植物保護、生命尊重及食安的價值觀，需具備親自走入產地或照護動物之熱忱。'
  },
  '康樂休閒學群': {
    courseRecord: '體育領域、語文領域、社會領域（公民與社會）。',
    learningOutcomes: '活動企劃書（如校內大型聚會、運動比賽）、觀光/運動休閒產業分析報告。',
    multiplePerformances: '運動校隊/社團主要幹部證明、飯店/觀光營隊結業證書、國際志工或社區服務經歷。',
    interviewFocus: '溝通協調與人際互動魅力、即席突發狀況解決邏輯、英文口說基礎表達。',
    additionalRequirements: '重視活潑、抗壓的外向性格與團隊合作組織能力，適合樂於與人接觸並分享健康生活者。'
  },
  '藝術學群': {
    courseRecord: '藝術領域（音樂、美術、表演藝術）、語文領域。',
    learningOutcomes: '個人藝術作品集、演出/創作紀錄影片、藝術展演企劃書。',
    multiplePerformances: '樂團/舞團/劇團參與經歷、藝術競賽得獎證明、展演策劃自主學習。',
    interviewFocus: '現場術科實作測驗（如演奏、即興編舞）、創作理念口頭闡述、美學理論問答。',
    additionalRequirements: '術科成績佔比極高，作品集需具備高度原創性與個人思想風格。'
  },
  '大眾傳播學群': {
    courseRecord: '語文領域（國文、英文）、社會領域（公民與社會）。',
    learningOutcomes: '影音剪輯作品、新聞採訪實作報告、社群行銷企劃案、多媒體創作。',
    multiplePerformances: '校園媒體/自媒體經營紀錄、新聞/傳播營隊證書、語文競賽證明。',
    interviewFocus: '對媒體識讀與社會時事評論之見解、口條流暢度、創意企劃思維。',
    additionalRequirements: '重視表達力、對社群時事的敏感度與獨立觀點陳述，面試時自信大方的表現極為吃香。'
  },
  '外語學群': {
    courseRecord: '語文領域（英文、第二外語）、社會領域（歷史、世界史）。',
    learningOutcomes: '英文配音或短劇創作紀錄、跨文化小論文、英文專題研究報告。',
    multiplePerformances: '多益（TOEIC）/全民英檢（GEPT）等檢定證照、英語演講/辯論賽參與、國際交流營隊。',
    interviewFocus: '全英語（或對應外語）面試、跨文化適應力問答、外語文學或語言學閱讀興趣。',
    additionalRequirements: '外語口說流暢度、標準發音與國際視野為教授關注要點，建議準備 3 分鐘流暢外語自我介紹。'
  },
  '文史哲學群': {
    courseRecord: '語文領域（國文）、社會領域（歷史、公民與社會）。',
    learningOutcomes: '散文/小說/詩歌創作集、歷史專題探究報告、哲學思辨小論文。',
    multiplePerformances: '文學社/讀書會幹部、校刊編輯證明、文學或歷史自主學習計畫成果。',
    interviewFocus: '人文素養問答、邏輯批判性思考能力、對特定歷史或哲學命題之深入闡述。',
    additionalRequirements: '著重深度閱讀、文字表達與批判思辨能力，教授看重自傳中的閱讀習慣與思考軌跡。'
  },
  '教育學群': {
    courseRecord: '語文領域、社會領域（公民與社會）、輔導領域。',
    learningOutcomes: '教案設計書、教學演示影片、助教服務報告、特殊教育/特殊幼兒專題。',
    multiplePerformances: '社團輔導服務經歷（如偏鄉課輔）、教育或心理營隊、童軍社幹部。',
    interviewFocus: '面對衝突學生或教學場景的引導情境問答、教學熱忱與特質、溝通說服力。',
    additionalRequirements: '重視親和力、耐心、人際溝通技巧與對教育志業的承諾。'
  },
  '法政學群': {
    courseRecord: '社會領域（公民與社會、歷史）、語文領域。',
    learningOutcomes: '法律判決思辨報告、公共政策分析小論文、模擬法庭企劃、社會議題研究。',
    multiplePerformances: '辯論社經歷、青年議會/模擬聯合國參與、社會倡議與志工活動。',
    interviewFocus: '社會正義與法律命題思辨（如死刑存廢、性平議題）、邏輯論述與反駁能力。',
    additionalRequirements: '重視思維的嚴謹度、辯論反應力與宏觀政策分析視野，面試口試通常以團體討論或即席論辯進行。'
  },
  '管理學群': {
    courseRecord: '數學領域（數學乙）、語文領域（英文）、社會領域。',
    learningOutcomes: '企業營運專案分析、商業行銷企劃、自主探究實作（管理或經濟相關）。',
    multiplePerformances: '學生會/大型社團主要幹部證明、商業競賽（如模擬商展）、青年領袖營。',
    interviewFocus: '團隊合作衝突處理解決、英語自我介紹與問答、創新思維。',
    additionalRequirements: '重視領導力、跨領域溝通能力與商業敏感度，建議準備具備商管潛力的多元表現佐證。'
  },
  '財經學群': {
    courseRecord: '數學領域（數學甲/乙）、語文領域（英文）、社會領域（歷史/地理）。',
    learningOutcomes: '總體經濟議題報告、投資模擬交易專案分析、會計與統計小專題報告。',
    multiplePerformances: '財金營隊證書、國際經濟學科競賽、數理/會計自主學習計畫成果。',
    interviewFocus: '對金融時事（如降息、通膨、美債）的解讀、數理邏輯推理、個人操守。',
    additionalRequirements: '高度看重數學與數據敏感度，以及金流分析與風險管理的基礎理解。'
  },
  '社會心理學群': {
    courseRecord: '社會領域（公民與社會）、輔導與心理諮商、語文領域。',
    learningOutcomes: '心理學研究小論文、社會學田野調查報告、諮商輔導案例讀書日誌。',
    multiplePerformances: '輔導機構/家扶中心志工、社會心理營隊、自主學習計畫。',
    interviewFocus: '傾聽與同理心測試、人際敏感度情境問答、輔導與諮商基本倫理理解。',
    additionalRequirements: '重視傾聽、包容力、高抗壓與對弱勢團體的關懷，適合具備高度同理特質的學生。'
  },
  '設計學群': {
    courseRecord: '藝術領域（美術）、科技領域（生活科技）、數學領域。',
    learningOutcomes: '個人設計作品集（建築/工業/視覺設計）、UI/UX 介面設計專案成果、手繪與 3D 建模紀錄。',
    multiplePerformances: '設計競賽參賽證明、設計工作坊證書、設計軟體自學成果證明。',
    interviewFocus: '作品集現場簡報說明、美學與人體工學設計思辨、即席素描或創意發想。',
    additionalRequirements: '作品集的原創性、實用性與視覺張力為最關鍵評分依據，建議準備實體作品現場展示。'
  }
};

/**
 * 依據科系名稱與學群動態生成極具個性化的二階個人申請條件
 * @param dept 科系資料
 * @returns 包含五大要領的二階詳細條件
 */
export function getSecondStageDetails(dept: Department): SecondStageDetails {
  const base = GROUP_BASE_GUIDELINES[dept.group] || {
    courseRecord: '偏重高中核心學群選修科目與語文領域。',
    learningOutcomes: '建議提交課堂書面報告、自主探究與實作成果。',
    multiplePerformances: '社團參與經歷、自主學習計畫成果、相關營隊結業證明。',
    interviewFocus: '著重基本觀念推理、自傳細節問答與學習熱忱。',
    additionalRequirements: '重視綜合學科表現與人際溝通協調能力。'
  };

  // 深拷貝基礎指引，進行科系特化
  const details = { ...base };
  const name = dept.name;

  if (name.includes('資工') || name.includes('資訊') || name.includes('計算機')) {
    details.additionalRequirements = '極度建議在高中考取 APCS 檢定，觀念與實作雙三級分以上者，一階篩選或二階審查將有顯著優勢。';
    details.interviewFocus = '面試包含基礎程式邏輯解題（有時為筆試或上機測驗），教授看重算法思維與專案解決細節。';
  } else if (name.includes('電機') || name.includes('電子') || name.includes('材料')) {
    details.learningOutcomes = '建議提供具備物理原理與硬體電路實作的作品，例如 Arduino 控制、感測器整合或簡易機構專案報告。';
    details.interviewFocus = '著重物理基本功（特別是電磁學、電路）以及基礎微積分觀念，口試常包含現場白板推導題目。';
  } else if (name.includes('醫學') && !name.includes('獸醫') && !name.includes('牙醫')) {
    details.interviewFocus = '口試採用多站式跑站面試（MMI），評估考生在緊急醫療情境、生醫倫理、同理心與溝通表達上的綜合表現，極具抗壓性考驗。';
    details.additionalRequirements = '不看校名只看綜合特質，志工經歷必備，極重視「行醫熱忱」與「心理韌性」。';
  } else if (name.includes('牙醫')) {
    details.interviewFocus = '二階包含術科考試（牙體形態素描、石膏或肥皂雕刻），極度考驗手部精細操作、空間立體感與美學素養。';
    details.learningOutcomes = '建議提交立體手作作品（如雕刻、陶藝、手工藝）、以及美術素描相關課程學習成果。';
  } else if (name.includes('法律') || name.includes('司法')) {
    details.interviewFocus = '口試通常會給予假想的社會爭議案件，要求考生在短時間內有條理陳述兩造立場，評估論證嚴謹度與法學批判思維。';
    details.multiplePerformances = '強烈建議提供辯論社、模擬法庭或法政營隊等多元表現證明，佐證其思辨能力。';
  } else if (name.includes('外文') || name.includes('英語') || name.includes('英文')) {
    details.interviewFocus = '第二階段口試通常採全英語進行，著重跨文化理解力，並可能包含英美文學或英語語言學基礎閱讀問答。';
    details.multiplePerformances = '建議取得多益 (TOEIC) 900分以上、全民英檢 (GEPT) 中高級以上、或托福/雅思證照，並提供英文演講/辯論成果。';
  } else if (name.includes('設計') || name.includes('建築')) {
    details.learningOutcomes = '作品集為決定錄取與否的絕對關鍵！建議提供 3D 建模作品、室內空間手繪草圖、或 UI/UX 介面設計報告。';
    details.interviewFocus = '面試時須對自己的作品集進行 3-5 分鐘簡報，教授將針對設計理念、人體工學、材質選用進行詰問。';
  } else if (name.includes('財金') || name.includes('金融') || name.includes('經濟')) {
    details.interviewFocus = '教授看重財經時事解讀（如降息影響、碳權、虛擬貨幣），並會對數學科表現進行細緻詢問，評估計量分析潛力。';
  }

  return details;
}
