import { QuizAnswer, QuizResult, ClusterScore } from '../types';
import { QUESTIONS, CLUSTERS } from '../data/mockData';

/**
 * 計算測驗結果
 * @param answers 使用者的測驗答題紀錄
 * @returns 包含各學群適配百分比與前三大推薦學群的 QuizResult
 */
export function calculateQuizResult(answers: QuizAnswer[]): QuizResult {
  // 建立答案 Map 以便快速查詢
  const answerMap = new Map<number, number>();
  answers.forEach((ans) => {
    answerMap.set(ans.questionId, ans.score);
  });

  // 初始化各學群的分數累加器
  const scoresMap: { [key: string]: { score: number; maxPossible: number } } = {};
  CLUSTERS.forEach((cluster) => {
    scoresMap[cluster] = { score: 0, maxPossible: 0 };
  });

  // 遍歷所有題目計算得分與最大可能得分
  QUESTIONS.forEach((q) => {
    const userScore = answerMap.get(q.id) || 3; // 預設為 3 (無意見)
    
    // 李克特五分量表平移計算：非常不同意(1) -> 0分，非常同意(5) -> 4分
    const shiftedScore = userScore - 1;
    const maxScoreForQuestion = 4;

    // 將此題的加權加載到各學群中
    Object.entries(q.weightMap).forEach(([cluster, weight]) => {
      if (scoresMap[cluster]) {
        scoresMap[cluster].score += shiftedScore * weight;
        scoresMap[cluster].maxPossible += maxScoreForQuestion * weight;
      }
    });
  });

  // 計算每個學群的適配百分比
  const scores: ClusterScore[] = CLUSTERS.map((cluster) => {
    const { score, maxPossible } = scoresMap[cluster];
    const percentage = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
    return {
      category: cluster,
      score: parseFloat(score.toFixed(2)),
      maxPossible: parseFloat(maxPossible.toFixed(2)),
      percentage
    };
  });

  // 排序：依據百分比降序排序，若相同則依據分數，若再相同則隨機/依字母
  const sortedScores = [...scores].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return b.score - a.score;
  });

  // 取得前三大推薦學群
  const topCategories = sortedScores.slice(0, 3).map((item) => item.category);

  return {
    scores: sortedScores,
    topCategories
  };
}
