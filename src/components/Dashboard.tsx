'use client';

import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CLUSTER_DETAILS, DEPARTMENTS } from '../data/mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Award, Compass, RotateCcw, BrainCircuit, ArrowLeftRight, Check, Plus, ChevronRight } from 'lucide-react';
import { Department } from '../types';

// 簡化學群名稱以便在雷達圖中呈現，防止手機端文字重疊
const CLUSTER_ABBR: { [key: string]: string } = {
  '資訊學群': '資訊',
  '工程學群': '工程',
  '數理化學群': '數理化',
  '地球環境學群': '地環',
  '生命科學學群': '生科',
  '醫藥衛生學群': '醫藥',
  '生物資源學群': '生資',
  '康樂休閒學群': '康樂',
  '藝術學群': '藝術',
  '大眾傳播學群': '大傳',
  '外語學群': '外語',
  '文史哲學群': '文史哲',
  '教育學群': '教育',
  '法政學群': '法政',
  '管理學群': '管理',
  '財經學群': '財經',
  '社會心理學群': '社心',
  '設計學群': '設計'
};

export default function Dashboard() {
  const { results, resetQuiz, compareList, addToCompare, removeFromCompare, isCompared, setActiveTab } = useApp();

  // 1. 整理雷達圖資料
  const chartData = useMemo(() => {
    if (!results) return [];
    return results.scores.map((item) => ({
      subject: CLUSTER_ABBR[item.category] || item.category,
      percentage: item.percentage,
      fullMark: 100
    }));
  }, [results]);

  // 2. 獲取前三大適配學群詳情
  const topThreeDetails = useMemo(() => {
    if (!results) return [];
    return results.topCategories.map((cat, idx) => {
      const details = CLUSTER_DETAILS[cat] || {
        description: '',
        traits: [],
        careers: [],
        color: 'from-slate-500 to-slate-700'
      };
      return {
        category: cat,
        rank: idx + 1,
        ...details
      };
    });
  }, [results]);

  // 3. 自動推薦科系（屬於前三大推薦學群的頂大科系）
  const recommendedDepts = useMemo(() => {
    if (!results) return [];
    return DEPARTMENTS.filter((dept) => 
      results.topCategories.includes(dept.group)
    ).slice(0, 6); // 最多顯示 6 個推薦科系
  }, [results]);

  const handleCompareClick = (dept: Department) => {
    if (isCompared(dept.id)) {
      removeFromCompare(dept.id);
    } else {
      const added = addToCompare(dept);
      if (!added && compareList.length >= 4) {
        alert('比較清單已滿！最多只能同時比較 4 個校系。');
      }
    }
  };

  if (!results) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col gap-10">
      {/* 頂部標題 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-3xl font-black text-slate-100 flex items-center gap-2.5">
            <BrainCircuit className="h-8 w-8 text-indigo-400" />
            您的 18 學群興趣分析儀表板
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            本分析報告根據您的 18 題性向測驗答案，加權精算而出。
          </p>
        </div>
        <button
          onClick={resetQuiz}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-all cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          重新測驗
        </button>
      </div>

      {/* 雷達圖與前三大推薦學群 */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* 雷達圖 (Recharts) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-1.5">
            <Compass className="h-5 w-5 text-indigo-400" />
            18學群適配雷達圖
          </h3>
          <div className="w-full h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: '#475569', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Radar
                  name="適配百分比"
                  dataKey="percentage"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 text-center">
            雷達圖顯示各學群的配對百分比，數值越向外延伸代表適配度越高。
          </p>
        </div>

        {/* 前三大推薦學群卡片 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-1.5">
            <Award className="h-5 w-5 text-indigo-400" />
            最適合您的前三大推薦學群
          </h3>

          <div className="flex-1 flex flex-col gap-4">
            {topThreeDetails.map((cat) => (
              <div
                key={cat.category}
                className="glass-card rounded-2xl p-6 relative overflow-hidden group shadow-lg flex-1 border-l-4 border-l-indigo-500"
              >
                {/* 排名背景亮點 */}
                <div className="absolute top-4 right-6 text-5xl font-black text-slate-800/30 font-outfit select-none">
                  0{cat.rank}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <span className={`text-xl font-black text-transparent bg-clip-text bg-gradient-to-r ${cat.color}`}>
                    {cat.category}
                  </span>
                  <span className="text-[10px] w-fit px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                    適配度排名 {cat.rank}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {cat.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-800/80">
                  {/* 人格特質 */}
                  <div>
                    <span className="text-indigo-400 font-bold block mb-1.5">適合您的特質：</span>
                    <div className="flex flex-wrap gap-1">
                      {cat.traits.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800/60">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 推薦職涯 */}
                  <div>
                    <span className="text-purple-400 font-bold block mb-1.5">代表性未來職涯：</span>
                    <div className="flex flex-wrap gap-1">
                      {cat.careers.map(c => (
                        <span key={c} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800/60">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 推薦科系區域 */}
      <div className="border-t border-slate-800/80 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-200">
              基於測驗推薦的頂大校系
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              自動篩選出屬於您前三大優勢學群的 15 所頂尖大學代表科系，您可直接將其加入對比表格。
            </p>
          </div>
          <button
            onClick={() => setActiveTab('database')}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
          >
            查看完整科系庫
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* 推薦科系網格 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedDepts.map((dept) => {
            const isAdded = isCompared(dept.id);
            return (
              <div
                key={dept.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group shadow-lg"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-slate-400 font-semibold">{dept.university}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/60 text-slate-300 font-bold border border-slate-850">
                      {dept.group}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 mb-3 group-hover:text-indigo-300 transition-colors">
                    {dept.name}
                  </h4>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>面試日期:</span>
                      <span className="text-slate-200 font-semibold">{dept.interviewDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>去年一階分數:</span>
                      <span className="text-indigo-300 font-bold">{dept.lastYearScore}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleCompareClick(dept)}
                    className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      isAdded
                        ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-3 w-3" />
                        已在比較中
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        加入比較
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 浮動比較控制列 */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/45">
              <ArrowLeftRight className="h-4.5 w-4.5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                已選取 <span className="text-indigo-400 text-sm font-black">{compareList.length}</span> / 4 個校系
              </p>
              <p className="text-[10px] text-slate-400">跨校系橫向對比採計標準與甄試佔比</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('compare')}
            className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            前往比較表
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
