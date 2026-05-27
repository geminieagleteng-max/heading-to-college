'use client';

import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Department } from '../types';
import { getSecondStageDetails } from '../utils/secondStageGuidelines';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash2, AlertTriangle, Lightbulb, Search, ArrowLeftRight, Calendar, Users, Percent } from 'lucide-react';

export default function CompareTable() {
  const { compareList, removeFromCompare, clearCompareList, setActiveTab } = useApp();

  // 1. 偵測衝突 (衝堂與採計完全相同)
  const diagnostics = useMemo(() => {
    const conflicts: { a: Department; b: Department; date: string }[] = [];
    const identicalSubjects: { a: Department; b: Department }[] = [];

    for (let i = 0; i < compareList.length; i++) {
      for (let j = i + 1; j < compareList.length; j++) {
        const a = compareList[i];
        const b = compareList[j];

        // 檢查面試衝堂 (日期相同)
        if (a.interviewDate === b.interviewDate) {
          conflicts.push({ a, b, date: a.interviewDate });
        }

        // 檢查學測採計與檢定標準是否完全一致
        const sameChinese = a.subjectRequirements.chinese === b.subjectRequirements.chinese;
        const sameEnglish = a.subjectRequirements.english === b.subjectRequirements.english;
        const sameMathA = a.subjectRequirements.mathA === b.subjectRequirements.mathA;
        const sameMathB = a.subjectRequirements.mathB === b.subjectRequirements.mathB;
        const sameSocial = a.subjectRequirements.social === b.subjectRequirements.social;
        const sameScience = a.subjectRequirements.science === b.subjectRequirements.science;

        if (sameChinese && sameEnglish && sameMathA && sameMathB && sameSocial && sameScience) {
          identicalSubjects.push({ a, b });
        }
      }
    }

    return { conflicts, identicalSubjects };
  }, [compareList]);

  // 2. 整理二階佔比圖表資料
  const chartData = useMemo(() => {
    return compareList.map((dept) => {
      // 簡化縮寫以利 X 軸標籤呈現
      const uniAbbr = dept.university.replace('國立', '');
      const deptAbbr = dept.name.length > 5 ? dept.name.slice(0, 4) + '..' : dept.name;
      return {
        name: `${uniAbbr}\n${deptAbbr}`,
        '書面審查': dept.secondStage.document,
        '面試口試': dept.secondStage.interview,
        '筆試實作': dept.secondStage.exam,
        '其他項目': dept.secondStage.other || 0,
      };
    });
  }, [compareList]);

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 w-full flex-1 flex flex-col justify-center items-center text-center">
        <div className="h-16 w-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
          <ArrowLeftRight className="h-8 w-8 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-100 mb-2">比較清單為空</h3>
        <p className="text-slate-400 text-sm max-w-md mb-8">
          您目前尚未選取任何校系。請先前往「頂大科系庫」或進行「學群性向測驗」來挑選想要加入橫向對比的校系（上限 4 個）。
        </p>
        <button
          onClick={() => setActiveTab('database')}
          className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Search className="h-4 w-4" />
          去搜尋頂大科系
        </button>
      </div>
    );
  }

  // 輔助：檢測某一科系是否有與其他科系的面試日期衝突
  const hasInterviewConflict = (deptId: string) => {
    return diagnostics.conflicts.some(
      (c) => c.a.id === deptId || c.b.id === deptId
    );
  };

  // 輔助：檢測某一科系是否有採計科目與其他科系完全相同
  const hasSubjectIdentity = (deptId: string) => {
    return diagnostics.identicalSubjects.some(
      (i) => i.a.id === deptId || i.b.id === deptId
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-8">
      {/* 頂部標題 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ArrowLeftRight className="h-6 w-6 text-indigo-400" />
            跨校科系對比表 (Side-by-Side)
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            您已選取了 <span className="text-indigo-400 font-bold">{compareList.length}</span> / 4 個校系，系統已為您過濾出關鍵採計與日期。
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('database')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            繼續挑選科系
          </button>
          <button
            onClick={clearCompareList}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            全部清除
          </button>
        </div>
      </div>

      {/* 警示與亮點提示區塊 */}
      {(diagnostics.conflicts.length > 0 || diagnostics.identicalSubjects.length > 0) && (
        <div className="space-y-3">
          {/* 面試衝堂警告 */}
          {diagnostics.conflicts.map((c, idx) => (
            <div
              key={`conflict-${idx}`}
              className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/35 text-rose-300 text-xs animate-fade-in"
            >
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold text-rose-200 block mb-1">⚠️ 偵測到二階甄試面試日期重疊！</span>
                <span className="font-semibold text-slate-200">
                  {c.a.university} {c.a.name}
                </span>{' '}
                與{' '}
                <span className="font-semibold text-slate-200">
                  {c.b.university} {c.b.name}
                </span>{' '}
                皆排定於 <span className="underline font-bold text-rose-400">{c.date}</span> 進行二階面試，可能存在衝堂風險，請密切注意各校甄試梯次安排！
              </div>
            </div>
          ))}

          {/* 採計科目相同提示 */}
          {diagnostics.identicalSubjects.map((i, idx) => (
            <div
              key={`identical-${idx}`}
              className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs animate-fade-in"
            >
              <Lightbulb className="h-5 w-5 text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold text-indigo-200 block mb-1">💡 學測採計檢定完全相同</span>
                <span className="font-semibold text-slate-200">
                  {i.a.university} {i.a.name}
                </span>{' '}
                與{' '}
                <span className="font-semibold text-slate-200">
                  {i.b.university} {i.b.name}
                </span>{' '}
                在學測採計的科目與標準完全一樣！這意味著您可用同一份學測成績，直接達到這兩個校系的第一階段檢定標準。
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 橫向對比表格 (RWD 溢出捲軸) */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] table-fixed border-collapse text-left text-sm text-slate-300">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800">
                <th className="w-[180px] p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  校系比較指標
                </th>
                {compareList.map((dept) => (
                  <th key={dept.id} className="p-4 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-semibold mb-1">
                          {dept.university}
                        </span>
                        <span className="block font-bold text-slate-100 text-sm">
                          {dept.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCompare(dept.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all absolute top-2 right-2 cursor-pointer"
                        title="移除此科系"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/10">
              {/* 學群 */}
              <tr>
                <td className="p-4 font-semibold text-slate-400 text-xs">學群歸屬</td>
                {compareList.map((dept) => (
                  <td key={dept.id} className="p-4">
                    <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-medium text-slate-300">
                      {dept.group}
                    </span>
                  </td>
                ))}
              </tr>

              {/* 招生名額 */}
              <tr>
                <td className="p-4 font-semibold text-slate-400 text-xs">招生名額</td>
                {compareList.map((dept) => (
                  <td key={dept.id} className="p-4 font-bold text-slate-100">
                    <Users className="inline h-3.5 w-3.5 text-slate-400 mr-1" />
                    {dept.quota} 名
                  </td>
                ))}
              </tr>

              {/* 學測採計標準 */}
              <tr>
                <td className="p-4 font-semibold text-slate-400 text-xs">學測採計檢定</td>
                {compareList.map((dept) => {
                  const reqs = dept.subjectRequirements;
                  const subjects = [
                    { name: '國', val: reqs.chinese },
                    { name: '英', val: reqs.english },
                    { name: '數A', val: reqs.mathA },
                    { name: '數B', val: reqs.mathB },
                    { name: '社', val: reqs.social },
                    { name: '自', val: reqs.science },
                  ];
                  return (
                    <td
                      key={dept.id}
                      className={`p-4 transition-colors ${
                        hasSubjectIdentity(dept.id) ? 'bg-indigo-500/5' : ''
                      }`}
                    >
                      <div className="flex flex-wrap gap-1">
                        {subjects.map((sub) => {
                          const active = sub.val && sub.val !== '無' && sub.val !== '-';
                          return (
                            <span
                              key={sub.name}
                              className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                                active
                                  ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-500/40'
                                  : 'bg-slate-900 text-slate-600 border border-transparent'
                              }`}
                            >
                              {sub.name}:{active ? sub.val : '無'}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* 一階倍率篩選 */}
              <tr>
                <td className="p-4 font-semibold text-slate-400 text-xs">一階倍率篩選</td>
                {compareList.map((dept) => (
                  <td key={dept.id} className="p-4 text-xs">
                    <div className="space-y-1">
                      {dept.multipliers.map((m, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-200 bg-slate-950/40 px-2 py-1 rounded">
                          <span className="text-slate-400">{m.subject}</span>
                          <span className="font-black text-indigo-400">{m.value}倍</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* 二階比例 */}
              <tr>
                <td className="p-4 font-semibold text-slate-400 text-xs">二階甄試佔比</td>
                {compareList.map((dept) => (
                  <td key={dept.id} className="p-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">書面審查:</span>
                        <span className="font-bold text-indigo-300">{dept.secondStage.document}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">面試口試:</span>
                        <span className="font-bold text-fuchsia-300">{dept.secondStage.interview}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">筆試實作:</span>
                        <span className="font-bold text-cyan-300">{dept.secondStage.exam}%</span>
                      </div>
                      {dept.secondStage.other > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">其他佔比:</span>
                          <span className="font-bold text-slate-300">{dept.secondStage.other}%</span>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* 去年分數 */}
              <tr>
                <td className="p-4 font-semibold text-slate-400 text-xs">去年一階過關分數</td>
                {compareList.map((dept) => (
                  <td key={dept.id} className="p-4 font-extrabold text-indigo-300 bg-indigo-500/5">
                    {dept.lastYearScore}
                  </td>
                ))}
              </tr>

              {/* 面試日期 */}
              <tr>
                <td className="p-4 font-semibold text-slate-400 text-xs">二階面試日期</td>
                {compareList.map((dept) => {
                  const conflict = hasInterviewConflict(dept.id);
                  return (
                    <td
                      key={dept.id}
                      className={`p-4 font-bold text-sm transition-colors ${
                        conflict ? 'bg-rose-500/10 text-rose-300' : 'text-slate-200'
                      }`}
                    >
                      <Calendar className={`inline h-4 w-4 mr-1.5 ${conflict ? 'text-rose-400' : 'text-slate-400'}`} />
                      {dept.interviewDate}
                      {conflict && (
                        <span className="block text-[10px] text-rose-400 font-extrabold mt-1 uppercase animate-pulse">
                          [ 警告：面試日期衝堂 ]
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* 二階甄試指南 */}
              <tr>
                <td className="p-4 font-semibold text-slate-400 text-xs">二階備審與面試要領</td>
                {compareList.map((dept) => {
                  const details = getSecondStageDetails(dept);
                  return (
                    <td key={dept.id} className="p-4 text-2xs space-y-3">
                      <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-indigo-300 block mb-1">📚 修課紀錄與課程成果</span>
                        <p className="text-slate-400 leading-relaxed"><strong className="text-slate-300">修課：</strong>{details.courseRecord}</p>
                        <p className="text-slate-400 leading-relaxed mt-1.5"><strong className="text-slate-300">成果：</strong>{details.learningOutcomes}</p>
                      </div>
                      <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-emerald-300 block mb-1">🌟 多元表現與面試準備</span>
                        <p className="text-slate-400 leading-relaxed"><strong className="text-slate-300">多元：</strong>{details.multiplePerformances}</p>
                        <p className="text-slate-400 leading-relaxed mt-1.5"><strong className="text-slate-300">面試：</strong>{details.interviewFocus}</p>
                      </div>
                      {details.additionalRequirements && (
                        <div className="p-2.5 bg-rose-950/15 border border-rose-500/10 rounded-xl text-rose-300/90 leading-relaxed">
                          <strong className="text-rose-400 block mb-0.5">📌 特別備註與加分檢定</strong>
                          {details.additionalRequirements}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>

          </table>
        </div>
      </div>

      {/* 二階甄試項目佔比堆疊長條圖 (視覺化呈現) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-1.5">
            <Percent className="h-5 w-5 text-indigo-400" />
            二階甄試計分佔比對比圖
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            對比各個校系在第二階段是重書審（學習歷程）還是口筆試。
          </p>
        </div>

        <div className="w-full h-[320px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis 
                unit="%" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="書面審查" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="面試口試" stackId="a" fill="#d946ef" radius={[0, 0, 0, 0]} />
              <Bar dataKey="筆試實作" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
              <Bar dataKey="其他項目" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
