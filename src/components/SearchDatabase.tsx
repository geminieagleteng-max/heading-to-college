'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, CLUSTERS } from '../data/mockData';
import { Department } from '../types';
import { getSecondStageDetails } from '../utils/secondStageGuidelines';
import { Search, SlidersHorizontal, BookOpen, Calendar, HelpCircle, ArrowLeftRight, Check, Plus, AlertCircle, ChevronRight, ChevronDown, Target } from 'lucide-react';

export default function SearchDatabase() {
  const { addToCompare, removeFromCompare, isCompared, compareList, setActiveTab, targetDept, setTargetDept } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('全部學校');
  const [selectedGroup, setSelectedGroup] = useState('全部學群');
  const [selectedRatioFilter, setSelectedRatioFilter] = useState('全部佔比');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(18);


  // 整理出所有不重複的學校清單
  const schools = useMemo(() => {
    const list = new Set(DEPARTMENTS.map((d) => d.university));
    return ['全部學校', ...Array.from(list)];
  }, []);

  // 篩選邏輯
  const filteredDepartments = useMemo(() => {
    return DEPARTMENTS.filter((dept) => {
      const matchesSearch = 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.group.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSchool = selectedSchool === '全部學校' || dept.university === selectedSchool;
      const matchesGroup = selectedGroup === '全部學群' || dept.group === selectedGroup;

      let matchesRatio = true;
      if (selectedRatioFilter !== '全部佔比' && dept.secondStage) {
        const { document, interview, exam, other } = dept.secondStage;
        if (selectedRatioFilter === '審查文件占比最重') {
          matchesRatio = document >= interview && document >= exam && document >= other;
        } else if (selectedRatioFilter === '口試面試占比最重') {
          matchesRatio = interview >= document && interview >= exam && interview >= other;
        } else if (selectedRatioFilter === '筆試實作占比最重') {
          matchesRatio = exam >= document && exam >= interview && exam >= other;
        } else if (selectedRatioFilter === '學測成績占比最重') {
          matchesRatio = other >= document && other >= interview && other >= exam;
        }
      }

      return matchesSearch && matchesSchool && matchesGroup && matchesRatio;
    });
  }, [searchTerm, selectedSchool, selectedGroup, selectedRatioFilter]);

  // 限制單次顯示數量以優化渲染效能並避免畫面雜亂
  const displayedDepartments = useMemo(() => {
    return filteredDepartments.slice(0, visibleCount);
  }, [filteredDepartments, visibleCount]);

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

  // 輔助函式：將採計科目格式化呈現
  const renderSubjectBadges = (requirements: Department['subjectRequirements']) => {
    const subjects = [
      { name: '國', value: requirements.chinese },
      { name: '英', value: requirements.english },
      { name: '數A', value: requirements.mathA },
      { name: '數B', value: requirements.mathB },
      { name: '社', value: requirements.social },
      { name: '自', value: requirements.science },
    ];

    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {subjects.map((sub) => {
          const hasReq = sub.value && sub.value !== '無' && sub.value !== '-';
          return (
            <span
              key={sub.name}
              className={`text-xs px-2 py-0.5 rounded-md font-bold transition-colors ${
                hasReq
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/35'
                  : 'bg-slate-900/40 text-slate-500 border border-slate-800'
              }`}
              title={hasReq ? `${sub.name}文檢定：${sub.value}` : `${sub.name}文：未採計`}
            >
              {sub.name}
              {hasReq && <span className="text-[10px] ml-0.5 text-indigo-400">({sub.value})</span>}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      {/* 搜尋與篩選區域 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋學校、科系名稱、或學群 (例如：資訊工程、台灣大學)..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(18); }}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-input text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all ${
              showFilters || selectedSchool !== '全部學校' || selectedGroup !== '全部學群' || selectedRatioFilter !== '全部佔比'
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:bg-slate-900/60'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            高級篩選
            {(selectedSchool !== '全部學校' || selectedGroup !== '全部學群' || selectedRatioFilter !== '全部佔比') && (
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
            )}
          </button>
        </div>

        {/* 展開篩選面版 */}
        {(showFilters || selectedSchool !== '全部學校' || selectedGroup !== '全部學群' || selectedRatioFilter !== '全部佔比') && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 grid sm:grid-cols-3 gap-4 animate-fade-in">
            {/* 學校篩選 */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                篩選頂尖學校
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => { setSelectedSchool(e.target.value); setVisibleCount(18); }}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
              >
                {schools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </div>

            {/* 學群篩選 */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                篩選大考 18 學群
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => { setSelectedGroup(e.target.value); setVisibleCount(18); }}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="全部學群">全部學群</option>
                {CLUSTERS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* 二階佔比篩選 */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                二階甄試佔比偏好
              </label>
              <select
                value={selectedRatioFilter}
                onChange={(e) => { setSelectedRatioFilter(e.target.value); setVisibleCount(18); }}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="全部佔比">全部佔比</option>
                <option value="審查文件占比最重">審查文件占比最重</option>
                <option value="口試面試占比最重">口試面試占比最重</option>
                <option value="筆試實作占比最重">筆試實作占比最重</option>
                <option value="學測成績占比最重">學測成績占比最重</option>
              </select>
            </div>

            {/* 清除篩選器 */}
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={() => {
                  setSelectedSchool('全部學校');
                  setSelectedGroup('全部學群');
                  setSelectedRatioFilter('全部佔比');
                  setSearchTerm('');
                  setVisibleCount(18);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                清除所有篩選條件
              </button>
            </div>
          </div>
        )}

        {/* 作用中的篩選條件標籤，提供清澈明瞭的視覺回饋 */}
        {(selectedSchool !== '全部學校' || selectedGroup !== '全部學群' || selectedRatioFilter !== '全部佔比' || searchTerm !== '') && (
          <div className="flex flex-wrap gap-2 items-center mt-4 animate-fade-in">
            <span className="text-xs text-slate-500 font-bold mr-1">當前篩選：</span>
            {selectedSchool !== '全部學校' && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                學校：{selectedSchool}
                <button onClick={() => { setSelectedSchool('全部學校'); setVisibleCount(18); }} className="hover:text-red-400 font-bold cursor-pointer ml-1">✕</button>
              </span>
            )}
            {selectedGroup !== '全部學群' && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                學群：{selectedGroup}
                <button onClick={() => { setSelectedGroup('全部學群'); setVisibleCount(18); }} className="hover:text-red-400 font-bold cursor-pointer ml-1">✕</button>
              </span>
            )}
            {selectedRatioFilter !== '全部佔比' && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                佔比：{selectedRatioFilter}
                <button onClick={() => { setSelectedRatioFilter('全部佔比'); setVisibleCount(18); }} className="hover:text-red-400 font-bold cursor-pointer ml-1">✕</button>
              </span>
            )}
            {searchTerm !== '' && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {'關鍵字："' + searchTerm + '"'}
                <button onClick={() => { setSearchTerm(''); setVisibleCount(18); }} className="hover:text-red-400 font-bold cursor-pointer ml-1">✕</button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedSchool('全部學校');
                setSelectedGroup('全部學群');
                setSelectedRatioFilter('全部佔比');
                setSearchTerm('');
                setVisibleCount(18);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer ml-2 hover:underline"
            >
              全部清除
            </button>
          </div>
        )}
      </div>

      {/* 搜尋結果筆數 */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-slate-400">
          共找到 <span className="text-indigo-400 font-bold">{filteredDepartments.length}</span> 個學科系所
        </p>
      </div>

      {/* 搜尋結果卡片網格 */}
      {filteredDepartments.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDepartments.map((dept) => {
              const isAdded = isCompared(dept.id);
              return (
                <div
                  key={dept.id}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-lg"
                >
                  {/* 學校與科系標題 */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-slate-400 font-medium">
                        {dept.university}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700/60">
                        {dept.group}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-100 mb-4 group-hover:text-indigo-300 transition-colors">
                      {dept.name}
                    </h4>

                    {/* 詳細資訊欄位 */}
                    <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> 招生名額:
                        </span>
                        <span className="font-bold text-slate-100">{dept.quota} 名</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> 面試日期:
                        </span>
                        <span className="font-bold text-slate-100">{dept.interviewDate}</span>
                      </div>

                      <div className="flex flex-col gap-1 mt-2">
                        <span className="text-slate-400 flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" /> 去年一階通過級分:
                        </span>
                        <span className="font-bold text-indigo-300 bg-indigo-500/5 px-2 py-1 rounded-lg border border-indigo-500/10 text-center w-full mt-1">
                          {dept.lastYearScore}
                        </span>
                      </div>

                      {/* 採計科目 */}
                      <div className="mt-3">
                        <span className="text-slate-400 block mb-1">學測採計檢定標準:</span>
                        {renderSubjectBadges(dept.subjectRequirements)}
                      </div>
                    </div>
                  </div>

                  {/* 二階指引摺疊按鈕 */}
                  <div className="mt-4 border-t border-slate-800/50 pt-3">
                    <button
                      onClick={() => setExpandedDeptId(expandedDeptId === dept.id ? null : dept.id)}
                      className="w-full flex items-center justify-between text-[11px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                    >
                      <span>🔎 備審指引與口試重點</span>
                      <ChevronDown className={`h-3.5 w-3.5 transform transition-transform ${expandedDeptId === dept.id ? 'rotate-180' : ''}`} />
                    </button>

                    {/* 收合抽屜 */}
                    {expandedDeptId === dept.id && (() => {
                      const details = getSecondStageDetails(dept);
                      return (
                        <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-[11px] text-slate-300 space-y-2.5 animate-fade-in">
                          <div>
                            <span className="font-bold text-indigo-300 block mb-0.5">📚 修課紀錄採計重點</span>
                            <p className="text-slate-400 leading-normal">{details.courseRecord}</p>
                          </div>
                          <div>
                            <span className="font-bold text-purple-300 block mb-0.5">成果 課程學習成果</span>
                            <p className="text-slate-400 leading-normal">{details.learningOutcomes}</p>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-300 block mb-0.5">🌟 多元表現建議項目</span>
                            <p className="text-slate-400 leading-normal">{details.multiplePerformances}</p>
                          </div>
                          <div>
                            <span className="font-bold text-amber-300 block mb-0.5">🎤 面試/筆試準備重點</span>
                            <p className="text-slate-400 leading-normal">{details.interviewFocus}</p>
                          </div>
                          {details.additionalRequirements && (
                            <div className="pt-2 border-t border-slate-900">
                              <span className="font-bold text-rose-300 block mb-0.5">📌 加分檢定與特別備註</span>
                              <p className="text-slate-400 leading-normal">{details.additionalRequirements}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>


                  {/* 底部按鈕 */}
                  <div className="mt-6 border-t border-slate-800/50 pt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        const isCurrentTarget = targetDept?.id === dept.id;
                        if (isCurrentTarget) {
                          setActiveTab('target');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          setTargetDept(dept);
                        }
                      }}
                      className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        targetDept?.id === dept.id
                          ? 'bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 border border-pink-500/40 hover:scale-[1.02]'
                          : 'bg-slate-900/60 hover:bg-slate-800 text-slate-350 border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <Target className="h-3.5 w-3.5" />
                      {targetDept?.id === dept.id ? '分析目標' : '設為目標'}
                    </button>
                    
                    <button
                      onClick={() => handleCompareClick(dept)}
                      className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isAdded
                          ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-900/60 hover:bg-slate-800 text-slate-350 border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          已比較
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          加入比較
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 載入更多按鈕，讓介面保持整齊乾淨 */}
          {filteredDepartments.length > visibleCount && (
            <div className="flex justify-center mt-12 mb-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="px-8 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                顯示更多科系 (還有 {filteredDepartments.length - visibleCount} 個)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-slate-900/20 border border-slate-800/50 rounded-3xl">
          <AlertCircle className="h-10 w-10 text-slate-500 mx-auto mb-3 animate-pulse" />
          <p className="text-slate-400 text-sm">找不到符合篩選條件的科系，請嘗試調整關鍵字或重設篩選條件。</p>
        </div>
      )}

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
