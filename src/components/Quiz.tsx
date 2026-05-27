'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QUESTIONS } from '../data/mockData';
import { ArrowLeft, ArrowRight, RotateCcw, Award } from 'lucide-react';

export default function Quiz() {
  const { saveAnswer, answers, submitQuiz, resetQuiz } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = QUESTIONS[currentIndex];
  
  // 尋找此題先前是否有回答紀錄
  const existingAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const selectedScore = existingAnswer ? existingAnswer.score : null;

  const handleOptionSelect = (score: number) => {
    saveAnswer(currentQuestion.id, score);
    
    // 如果不是最後一題，自動跳至下一題
    if (currentIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 250); // 微幅延遲讓使用者能看到點擊回饋，增加流暢感
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    if (confirm('確定要清除所有回答並重新開始測驗嗎？')) {
      resetQuiz();
      setCurrentIndex(0);
    }
  };

  const handleSubmit = () => {
    // 檢查是否所有題目都有回答
    if (answers.length < QUESTIONS.length) {
      const unansweredCount = QUESTIONS.length - answers.length;
      if (!confirm(`您還有 ${unansweredCount} 題尚未作答，確定要提交並進行分析嗎？（未作答題目將以「無意見」計算）`)) {
        return;
      }
    }
    submitQuiz();
  };

  const progressPercentage = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);
  const answeredCount = answers.length;

  const options = [
    { score: 5, label: '非常同意', color: 'border-emerald-500/20 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300' },
    { score: 4, label: '同意', color: 'border-blue-500/20 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 text-blue-300' },
    { score: 3, label: '無意見 / 普通', color: 'border-slate-700 hover:border-slate-400 bg-slate-800/10 hover:bg-slate-800/20 text-slate-300' },
    { score: 2, label: '不同意', color: 'border-orange-500/20 hover:border-orange-500 bg-orange-500/5 hover:bg-orange-500/10 text-orange-300' },
    { score: 1, label: '非常不同意', color: 'border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-300' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
      {/* 測驗進度資訊 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
            性向測驗進度
          </span>
          <span className="text-sm font-bold text-slate-300">
            第 {currentIndex + 1} 題 / 共 {QUESTIONS.length} 題
          </span>
        </div>
        
        {/* 進度條外框 */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>已作答: {answeredCount} 題</span>
          <span>完成度: {progressPercentage}%</span>
        </div>
      </div>

      {/* 題目主卡片 */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
        
        {/* 題目內容 */}
        <div className="mb-8">
          <span className="inline-block text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 font-bold mb-4">
            核心量表
          </span>
          <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-slate-100 min-h-[72px]">
            {currentQuestion.text}
          </h2>
        </div>

        {/* 五分量表選項 */}
        <div className="space-y-4">
          {options.map((opt) => {
            const isSelected = selectedScore === opt.score;
            return (
              <button
                key={opt.score}
                onClick={() => handleOptionSelect(opt.score)}
                className={`w-full likert-btn flex items-center justify-between p-5 rounded-2xl border text-left font-medium transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 ring-2 ring-indigo-500/30' 
                    : opt.color
                }`}
              >
                <span className="text-base">{opt.label}</span>
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'border-indigo-400 bg-indigo-500' 
                    : 'border-slate-500'
                }`}>
                  {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 下方操控列 */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-all"
          title="重新開始"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">重新開始</span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-slate-100 bg-slate-900 border border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            上一題
          </button>

          {currentIndex < QUESTIONS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={selectedScore === null}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-slate-100 bg-slate-900 border border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              下一題
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
            >
              提交分析結果
              <Award className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
