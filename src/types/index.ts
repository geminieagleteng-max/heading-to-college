export interface Question {
  id: number;
  text: string;
  category: string; // 主對應的 18 學群名稱，例如 "資訊學群"
  weightMap: { [key: string]: number }; // 學群與權重的對應，支持多學群加權
}

export interface SubjectRequirements {
  chinese: string; // '頂標' | '前標' | '均標' | '後標' | '底標' | '無'
  english: string;
  mathA: string;
  mathB: string;
  social: string;
  science: string;
}

export interface Multiplier {
  subject: string; // 篩選科目，例如 "英文+數學A", "國文", "自然"
  value: number;   // 篩選倍率，例如 3, 4, 5.5 等
}

export interface SecondStageRatio {
  document: number;  // 學習歷程/檔案審查百分比 (%)
  interview: number; // 口試/面試百分比 (%)
  exam: number;      // 筆試/實作百分比 (%)
  other: number;     // 其他佔比 (%)
}

export interface SecondStageDetails {
  courseRecord: string;          // 修課紀錄採計重點
  learningOutcomes: string;      // 課程學習成果建議提交
  multiplePerformances: string;  // 多元表現建議提交
  interviewFocus: string;        // 面試準備重點
  additionalRequirements: string; // 其他特別要求或備註
}

export interface Department {
  id: string;
  university: string;      // 學校名稱，例如 "國立臺灣大學"
  name: string;            // 科系名稱，例如 "資訊工程學系"
  group: string;           // 隸屬 18 學群，例如 "資訊學群"
  subjectRequirements: SubjectRequirements;
  multipliers: Multiplier[];
  secondStage: SecondStageRatio;
  secondStageDetails?: SecondStageDetails; // 二階甄試詳細條件
  quota: number;           // 招生名額
  lastYearScore: string;   // 去年一階篩選分數，例如 "英+數A=29級分"
  interviewDate: string;   // 面試日期，格式為 YYYY-MM-DD
}


export interface QuizAnswer {
  questionId: number;
  score: number; // 李克特五分值 (1-5)：1(非常不同意), 2(不同意), 3(無意見), 4(同意), 5(非常同意)
}

export interface ClusterScore {
  category: string;    // 學群名稱
  score: number;       // 加權原始累計分
  maxPossible: number; // 該學群最大可能得分
  percentage: number;  // 適配百分比 (0 - 100)
}

export interface QuizResult {
  scores: ClusterScore[];
  topCategories: string[]; // 前三大推薦學群名稱
}
