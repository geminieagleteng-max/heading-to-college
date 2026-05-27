'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Department, QuizAnswer, QuizResult } from '../types';
import { calculateQuizResult } from '../utils/quizAlgorithm';

export type TabType = 'home' | 'quiz' | 'database' | 'compare' | 'guides' | 'analyzer' | 'target' | 'portfolio';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  answers: QuizAnswer[];
  results: QuizResult | null;
  compareList: Department[];
  targetDept: Department | null;
  setTargetDept: (dept: Department | null) => void;
  scores: { [key: string]: number };
  updateScores: (newScores: { [key: string]: number }) => void;
  saveAnswer: (questionId: number, score: number) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  addToCompare: (dept: Department) => boolean;
  removeFromCompare: (deptId: string) => void;
  clearCompareList: () => void;
  isCompared: (deptId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [compareList, setCompareList] = useState<Department[]>([]);
  const [targetDept, setTargetDeptState] = useState<Department | null>(null);
  const [scores, setScores] = useState<{ [key: string]: number }>({
    chinese: 12,
    english: 12,
    mathA: 11,
    mathB: 10,
    social: 11,
    science: 11
  });

  // 從 localStorage 讀取與儲存比較清單與測驗結果，以利重新整理時不遺失
  useEffect(() => {
    const savedCompare = localStorage.getItem('compareList');
    const savedAnswers = localStorage.getItem('quizAnswers');
    const savedResults = localStorage.getItem('quizResults');
    const savedTarget = localStorage.getItem('targetDept');
    const savedScores = localStorage.getItem('userScores');

    setTimeout(() => {
      if (savedCompare) {
        try {
          setCompareList(JSON.parse(savedCompare));
        } catch (e) {
          console.error('Error parsing compareList from localStorage', e);
        }
      }

      if (savedAnswers && savedResults) {
        try {
          setAnswers(JSON.parse(savedAnswers));
          setResults(JSON.parse(savedResults));
        } catch (e) {
          console.error('Error parsing quiz data from localStorage', e);
        }
      }

      if (savedTarget) {
        try {
          setTargetDeptState(JSON.parse(savedTarget));
        } catch (e) {
          console.error('Error parsing targetDept from localStorage', e);
        }
      }

      if (savedScores) {
        try {
          setScores(JSON.parse(savedScores));
        } catch (e) {
          console.error('Error parsing scores from localStorage', e);
        }
      }
    }, 0);
  }, []);

  const setTargetDept = (dept: Department | null) => {
    setTargetDeptState(dept);
    if (dept) {
      localStorage.setItem('targetDept', JSON.stringify(dept));
    } else {
      localStorage.removeItem('targetDept');
    }
  };

  const updateScores = (newScores: { [key: string]: number }) => {
    setScores(newScores);
    localStorage.setItem('userScores', JSON.stringify(newScores));
  };

  const saveAnswer = (questionId: number, score: number) => {
    setAnswers((prev) => {
      const existingIdx = prev.findIndex((a) => a.questionId === questionId);
      let updated;
      if (existingIdx > -1) {
        updated = [...prev];
        updated[existingIdx] = { questionId, score };
      } else {
        updated = [...prev, { questionId, score }];
      }
      localStorage.setItem('quizAnswers', JSON.stringify(updated));
      return updated;
    });
  };

  const submitQuiz = () => {
    if (answers.length === 0) return;
    const res = calculateQuizResult(answers);
    setResults(res);
    localStorage.setItem('quizResults', JSON.stringify(res));
  };

  const resetQuiz = () => {
    setAnswers([]);
    setResults(null);
    localStorage.removeItem('quizAnswers');
    localStorage.removeItem('quizResults');
  };

  const addToCompare = (dept: Department): boolean => {
    if (compareList.some((d) => d.id === dept.id)) {
      return false; // 已經在比較清單中
    }
    if (compareList.length >= 4) {
      return false; // 最多 4 個
    }
    const updated = [...compareList, dept];
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
    return true;
  };

  const removeFromCompare = (deptId: string) => {
    const updated = compareList.filter((d) => d.id !== deptId);
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
  };

  const clearCompareList = () => {
    setCompareList([]);
    localStorage.removeItem('compareList');
  };

  const isCompared = (deptId: string) => {
    return compareList.some((d) => d.id === deptId);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        answers,
        results,
        compareList,
        targetDept,
        setTargetDept,
        scores,
        updateScores,
        saveAnswer,
        submitQuiz,
        resetQuiz,
        addToCompare,
        removeFromCompare,
        clearCompareList,
        isCompared
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
