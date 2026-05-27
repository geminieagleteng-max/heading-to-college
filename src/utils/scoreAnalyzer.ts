import { Department } from '../types';

export interface ScoreRequirement {
  subjects: string[]; // ['chinese', 'english', ...]
  totalScore: number;
}

export const SUBJECT_MAP: { [key: string]: string } = {
  '國': 'chinese',
  '國文': 'chinese',
  '英': 'english',
  '英文': 'english',
  '數A': 'mathA',
  '數學A': 'mathA',
  '數B': 'mathB',
  '數學B': 'mathB',
  '社': 'social',
  '社會': 'social',
  '自': 'science',
  '自然': 'science'
};

export const LEVEL_MAP: { [key: string]: number } = {
  '頂標': 13,
  '前標': 11,
  '均標': 8,
  '後標': 5,
  '底標': 0,
  '無': 0,
  '-': 0
};

// Convert score to level string
export function getLevelName(score: number): string {
  if (score >= 13) return '頂標';
  if (score >= 11) return '前標';
  if (score >= 8) return '均標';
  if (score >= 5) return '後標';
  return '底標';
}

// Parse last year's score string like "國+英+社=45級分"
export function parseLastYearScore(scoreStr: string): ScoreRequirement | null {
  if (!scoreStr) return null;
  const match = scoreStr.match(/(.+)=(\d+)級分/);
  if (!match) return null;
  
  const subjectsStr = match[1];
  const totalScore = parseInt(match[2]);
  
  const rawSubjects = subjectsStr.split('+').map(s => s.trim());
  const subjects: string[] = [];
  
  rawSubjects.forEach(sub => {
    const mapped = SUBJECT_MAP[sub];
    if (mapped) {
      subjects.push(mapped);
    }
  });
  
  return { subjects, totalScore };
}

export type AdvantageLevel = 'highly-advantageous' | 'safe' | 'challenge' | 'conservative' | 'disqualified';

export interface AnalysisResult {
  status: AdvantageLevel;
  statusLabel: string;
  margin: number | null; // studentSum - requiredSum
  failedSubjects: string[]; // Subjects where student failed to meet required standard
  passedRequirements: boolean;
  highlyWeightedAdvantage: boolean; // True if student has high score in highly-multiplied subjects
  multiplierDetail: string;
}

export function analyzeDepartmentAdvantage(
  studentScores: { [key: string]: number },
  dept: Department
): AnalysisResult {
  const failedSubjects: string[] = [];
  
  // 1. Check subject requirements (檢定)
  const reqs = dept.subjectRequirements;
  const subjectsToCheck: { name: string; key: keyof typeof reqs; label: string }[] = [
    { name: 'chinese', key: 'chinese', label: '國文' },
    { name: 'english', key: 'english', label: '英文' },
    { name: 'mathA', key: 'mathA', label: '數學A' },
    { name: 'mathB', key: 'mathB', label: '數學B' },
    { name: 'social', key: 'social', label: '社會' },
    { name: 'science', key: 'science', label: '自然' }
  ];
  
  subjectsToCheck.forEach(sub => {
    const requiredLevel = reqs[sub.key];
    const requiredMinScore = LEVEL_MAP[requiredLevel] || 0;
    const studentScore = studentScores[sub.name] || 0;
    
    if (studentScore < requiredMinScore) {
      failedSubjects.push(`${sub.label} (${requiredLevel})`);
    }
  });
  
  const passedRequirements = failedSubjects.length === 0;
  
  if (!passedRequirements) {
    return {
      status: 'disqualified',
      statusLabel: '未達檢定',
      margin: null,
      failedSubjects,
      passedRequirements: false,
      highlyWeightedAdvantage: false,
      multiplierDetail: '檢定未通過，不進行倍率與去年分數計算。'
    };
  }
  
  // 2. Parse last year's score and compare
  const parsedScore = parseLastYearScore(dept.lastYearScore);
  let margin: number | null = null;
  
  if (parsedScore) {
    let studentSum = 0;
    parsedScore.subjects.forEach(sub => {
      studentSum += studentScores[sub] || 0;
    });
    margin = studentSum - parsedScore.totalScore;
  }
  
  // 3. Check multiplier advantage (加權/倍率優勢)
  let highlyWeightedAdvantage = false;
  let maxMultiplierVal = 0;
  let maxMultiplierSubject = '';
  
  dept.multipliers.forEach(mul => {
    if (mul.value > maxMultiplierVal) {
      maxMultiplierVal = mul.value;
      maxMultiplierSubject = mul.subject;
    }
  });
  
  const multiplierSubjects = maxMultiplierSubject.split('+').map(s => s.trim());
  let hasHighVal = false;
  
  multiplierSubjects.forEach(sub => {
    const mapped = SUBJECT_MAP[sub];
    if (mapped) {
      const studentScore = studentScores[mapped] || 0;
      if (studentScore >= 14) {
        hasHighVal = true;
      }
    }
  });
  
  if (hasHighVal && maxMultiplierVal >= 4) {
    highlyWeightedAdvantage = true;
  }
  
  const multiplierDetail = maxMultiplierSubject 
    ? `此科系篩選倍率最高為 ${maxMultiplierSubject} (${maxMultiplierVal}倍)，且您的該科成績優異，在倍率篩選中非常吃香。` 
    : '無特別高倍率篩選科目。';

  // Determine final status
  let status: AdvantageLevel = 'safe';
  let statusLabel = '安全/優勢';
  
  if (margin !== null) {
    if (margin >= 2) {
      status = 'highly-advantageous';
      statusLabel = '極具優勢';
    } else if (margin >= 0) {
      status = 'safe';
      statusLabel = '安全/優勢';
    } else if (margin >= -2) {
      status = 'challenge';
      statusLabel = '挑戰/偏難';
    } else {
      status = 'conservative';
      statusLabel = '保守/難度高';
    }
  } else {
    status = 'safe';
    statusLabel = '安全/優勢';
  }
  
  // If margin is safe but student has highly weighted advantage, upgrade to highly advantageous
  if (status === 'safe' && highlyWeightedAdvantage) {
    status = 'highly-advantageous';
    statusLabel = '極具優勢';
  }
  
  return {
    status,
    statusLabel,
    margin,
    failedSubjects,
    passedRequirements: true,
    highlyWeightedAdvantage,
    multiplierDetail
  };
}
