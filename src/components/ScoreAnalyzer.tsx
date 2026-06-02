'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS } from '../data/mockData';
import { 
  analyzeDepartmentAdvantage, 
  getLevelName, 
  AdvantageLevel 
} from '../utils/scoreAnalyzer';
import { Department } from '../types';
import { 
  Award, 
  Search, 
  Check, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowUpDown,
  Target
} from 'lucide-react';

export default function ScoreAnalyzer() {
  const { 
    addToCompare, 
    removeFromCompare, 
    isCompared, 
    compareList, 
    scores, 
    updateScores, 
    targetDept, 
    setTargetDept, 
    setActiveTab 
  } = useApp();

  // 2. 搜尋與篩選狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState('全部學校');
  const [selectedGroup, setSelectedGroup] = useState('全部學群');
  const [selectedStatus, setSelectedStatus] = useState('全部級別');
  const [sortBy, setSortBy] = useState<'advantage' | 'quota' | 'margin'>('advantage');
  const [visibleCount, setVisibleCount] = useState(15);

  // 取得所有不重複的學校清單
  const universitiesList = useMemo(() => {
    const unis = new Set<string>();
    DEPARTMENTS.forEach((d) => unis.add(d.university));
    return ['全部學校', ...Array.from(unis)];
  }, []);

  // 取得所有不重複的學群清單
  const groupsList = useMemo(() => {
    const groups = new Set<string>();
    DEPARTMENTS.forEach((d) => groups.add(d.group));
    return ['全部學群', ...Array.from(groups)];
  }, []);

  // 快捷設定分數
  const applyPreset = (preset: 'max' | 'top' | 'front' | 'avg') => {
    switch (preset) {
      case 'max':
        updateScores({ chinese: 15, english: 15, mathA: 15, mathB: 15, social: 15, science: 15 });
        break;
      case 'top':
        updateScores({ chinese: 13, english: 13, mathA: 13, mathB: 13, social: 13, science: 13 });
        break;
      case 'front':
        updateScores({ chinese: 11, english: 11, mathA: 11, mathB: 11, social: 11, science: 11 });
        break;
      case 'avg':
        updateScores({ chinese: 8, english: 8, mathA: 8, mathB: 8, social: 8, science: 8 });
        break;
    }
    setVisibleCount(15);
  };

  // 3. 核心分析計算 (將 500 個科系與學測分數進行優勢對比)
  const analyzedData = useMemo(() => {
    return DEPARTMENTS.map((dept) => {
      const analysis = analyzeDepartmentAdvantage(scores, dept);
      return {
        dept,
        analysis
      };
    });
  }, [scores]);

  // 4. 統計資料 (計算各狀態的校系數量)
  const stats = useMemo(() => {
    let highlyAdv = 0;
    let safe = 0;
    let challenge = 0;
    let conservative = 0;
    let disqualified = 0;

    analyzedData.forEach((item) => {
      switch (item.analysis.status) {
        case 'highly-advantageous':
          highlyAdv++;
          break;
        case 'safe':
          safe++;
          break;
        case 'challenge':
          challenge++;
          break;
        case 'conservative':
          conservative++;
          break;
        case 'disqualified':
          disqualified++;
          break;
      }
    });

    return { highlyAdv, safe, challenge, conservative, disqualified };
  }, [analyzedData]);

  // 5. 過濾與排序
  const filteredAndSortedData = useMemo(() => {
    return analyzedData
      .filter((item) => {
        // 關鍵字搜尋 (支援科系名與大學名)
        const matchesQuery = 
          item.dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.dept.university.toLowerCase().includes(searchQuery.toLowerCase());
        
        // 學校篩選
        const matchesUni = selectedUni === '全部學校' || item.dept.university === selectedUni;
        
        // 學群篩選
        const matchesGroup = selectedGroup === '全部學群' || item.dept.group === selectedGroup;
        
        // 優勢級別篩選
        let matchesStatus = true;
        if (selectedStatus !== '全部級別') {
          if (selectedStatus === '極具優勢') matchesStatus = item.analysis.status === 'highly-advantageous';
          else if (selectedStatus === '安全/優勢') matchesStatus = item.analysis.status === 'safe';
          else if (selectedStatus === '挑戰/偏難') matchesStatus = item.analysis.status === 'challenge';
          else if (selectedStatus === '保守/難度高') matchesStatus = item.analysis.status === 'conservative';
          else if (selectedStatus === '未達檢定') matchesStatus = item.analysis.status === 'disqualified';
        }

        return matchesQuery && matchesUni && matchesGroup && matchesStatus;
      })
      .sort((a, b) => {
        // 排序邏輯
        if (sortBy === 'quota') {
          return b.dept.quota - a.dept.quota; // 招生名額多到少
        }
        
        if (sortBy === 'margin') {
          const marginA = a.analysis.margin !== null ? a.analysis.margin : -99;
          const marginB = b.analysis.margin !== null ? b.analysis.margin : -99;
          return marginB - marginA; // 分數差距高到低
        }

        // 預設以「優勢高到低」排序：極具優勢 -> 安全/優勢 -> 挑戰/偏難 -> 保守 -> 未達檢定
        const statusWeights: { [key in AdvantageLevel]: number } = {
          'highly-advantageous': 5,
          'safe': 4,
          'challenge': 3,
          'conservative': 2,
          'disqualified': 1
        };

        const weightA = statusWeights[a.analysis.status];
        const weightB = statusWeights[b.analysis.status];

        if (weightA !== weightB) {
          return weightB - weightA;
        }

        // 若優勢相同，則以 margin 排序
        const marginA = a.analysis.margin !== null ? a.analysis.margin : -99;
        const marginB = b.analysis.margin !== null ? b.analysis.margin : -99;
        return marginB - marginA;
      });
  }, [analyzedData, searchQuery, selectedUni, selectedGroup, selectedStatus, sortBy]);

  // 限制單次顯示數量以優化渲染效能並避免畫面雜亂
  const displayedResults = useMemo(() => {
    return filteredAndSortedData.slice(0, visibleCount);
  }, [filteredAndSortedData, visibleCount]);

  // 處理點擊加入比較
  const handleCompareClick = (dept: Department) => {
    if (isCompared(dept.id)) {
      removeFromCompare(dept.id);
    } else {
      if (compareList.length >= 4) {
        alert('跨校系比較最多只能選擇 4 個科系喔！');
        return;
      }
      addToCompare(dept);
    }
  };

  const subjectSliders = [
    { key: 'chinese', label: '國文' },
    { key: 'english', label: '英文' },
    { key: 'mathA', label: '數學A' },
    { key: 'mathB', label: '數學B' },
    { key: 'social', label: '社會' },
    { key: 'science', label: '自然' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-8">
      
      {/* 頂部標題 */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-black tracking-tight text-slate-100 flex items-center justify-center sm:justify-start gap-2">
          <Award className="h-8 w-8 text-indigo-400" />
          學測落點與優勢分析系統
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          填入您的學測 1-15 級分，系統將智慧判定一階檢定標準，並與 15 所頂大 500 個科系的歷年錄取線進行大數據對比，找出您的加權競爭優勢。
        </p>
      </div>

      {/* ⚠️ 模擬數據提示橫幅 */}
      <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-400">系統重要提示：本平台學測數據為「展示用模擬數據」</h4>
            <p className="text-2xs text-slate-400 mt-1 leading-relaxed">
              系統內 15 所頂大之各學科系分數為常模模擬設定，並非最新學年度之官方真實篩選級分。真實落點數據請務必參閱官方簡章。
            </p>
          </div>
        </div>
        <a
          href="https://www.cac.edu.tw/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-2xs font-bold text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400 px-3 py-1.5 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 transition-all flex items-center gap-1 cursor-pointer"
        >
          前往大考甄選委會官網 ➔
        </a>
      </div>

      {/* 主內容區 */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* 左側：成績輸入面板 */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 sticky top-24">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-200">學測級分輸入 (0-15)</h3>
            <span className="text-2xs text-slate-500 font-semibold uppercase">級分設定</span>
          </div>

          {/* 快捷設定 */}
          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={() => applyPreset('max')} 
              className="py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-2xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
            >
              滿分組 (15)
            </button>
            <button 
              onClick={() => applyPreset('top')} 
              className="py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-2xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
            >
              頂標組 (13)
            </button>
            <button 
              onClick={() => applyPreset('front')} 
              className="py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-2xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
            >
              前標組 (11)
            </button>
            <button 
              onClick={() => applyPreset('avg')} 
              className="py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-2xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
            >
              均標組 (8)
            </button>
          </div>

          {/* 滑動輸入 */}
          <div className="space-y-4">
            {subjectSliders.map((sub) => (
              <div key={sub.key} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full" />
                    {sub.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {scores[sub.key]} 級分
                    </span>
                    <span className="text-2xs text-slate-500 font-bold">
                      ({getLevelName(scores[sub.key])})
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={scores[sub.key]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateScores({ ...scores, [sub.key]: val });
                    setVisibleCount(15);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            ))}
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 text-2xs text-slate-500 leading-relaxed">
            📢 級分換算五標標準：<br/>
            頂標 (13-15 級分) | 前標 (11-12 級分) | 均標 (8-10 級分) | 後標 (5-7 級分) | 底標 (0-4 級分)
          </div>
        </div>

        {/* 右側：統計面板與過濾結果 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 統計概覽 Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-2xl font-black block">
                {stats.highlyAdv}
              </span>
              <span className="text-[10px] font-bold text-indigo-300 block mt-1">極具優勢</span>
            </div>
            
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-center">
              <span className="text-emerald-400 text-2xl font-black block">
                {stats.safe}
              </span>
              <span className="text-[10px] font-bold text-emerald-300 block mt-1">安全/優勢</span>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-center">
              <span className="text-amber-400 text-2xl font-black block">
                {stats.challenge}
              </span>
              <span className="text-[10px] font-bold text-amber-300 block mt-1">挑戰/偏難</span>
            </div>

            <div className="bg-slate-800/10 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-slate-400 text-2xl font-black block">
                {stats.conservative}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block mt-1">保守/難度高</span>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
              <span className="text-red-400 text-2xl font-black block">
                {stats.disqualified}
              </span>
              <span className="text-[10px] font-bold text-red-300 block mt-1">未達檢定門檻</span>
            </div>
          </div>

          {/* 搜尋與過濾篩選欄 */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-4">
            
            {/* 搜尋 + 排序 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="搜尋大學名稱或科系 (如: 電機、國立臺灣大學)"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(15); }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* 排序 dropdown */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-500 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as 'advantage' | 'quota' | 'margin'); setVisibleCount(15); }}
                  className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="advantage">依 優勢高到低 排序</option>
                  <option value="margin">依 去年分數差距 排序</option>
                  <option value="quota">依 招生名額多到少 排序</option>
                </select>
              </div>
            </div>

            {/* 篩選下拉選單組 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-900">
              {/* 學校 */}
              <div>
                <select
                  value={selectedUni}
                  onChange={(e) => { setSelectedUni(e.target.value); setVisibleCount(15); }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 focus:outline-none"
                >
                  {universitiesList.map((uni) => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              {/* 學群 */}
              <div>
                <select
                  value={selectedGroup}
                  onChange={(e) => { setSelectedGroup(e.target.value); setVisibleCount(15); }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 focus:outline-none"
                >
                  {groupsList.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              {/* 優勢級別 */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setVisibleCount(15); }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 focus:outline-none"
                >
                  <option value="全部級別">全部級別</option>
                  <option value="極具優勢">極具優勢</option>
                  <option value="安全/優勢">安全/優勢</option>
                  <option value="挑戰/偏難">挑戰/偏難</option>
                  <option value="保守/難度高">保守/難度高</option>
                  <option value="未達檢定">未達檢定</option>
                </select>
              </div>
            </div>

            {/* 作用中的篩選條件標籤，提供清澈明瞭的視覺回饋 */}
            {(selectedUni !== '全部學校' || selectedGroup !== '全部學群' || selectedStatus !== '全部級別' || searchQuery !== '') && (
              <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-slate-850 animate-fade-in">
                <span className="text-[10px] text-slate-500 font-bold mr-1">當前篩選：</span>
                {selectedUni !== '全部學校' && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    學校：{selectedUni}
                    <button onClick={() => { setSelectedUni('全部學校'); setVisibleCount(15); }} className="hover:text-red-400 font-bold cursor-pointer ml-1">✕</button>
                  </span>
                )}
                {selectedGroup !== '全部學群' && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    學群：{selectedGroup}
                    <button onClick={() => { setSelectedGroup('全部學群'); setVisibleCount(15); }} className="hover:text-red-400 font-bold cursor-pointer ml-1">✕</button>
                  </span>
                )}
                {selectedStatus !== '全部級別' && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    優勢：{selectedStatus}
                    <button onClick={() => { setSelectedStatus('全部級別'); setVisibleCount(15); }} className="hover:text-red-400 font-bold cursor-pointer ml-1">✕</button>
                  </span>
                )}
                {searchQuery !== '' && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {'關鍵字："' + searchQuery + '"'}
                    <button onClick={() => { setSearchQuery(''); setVisibleCount(15); }} className="hover:text-red-400 font-bold cursor-pointer ml-1">✕</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedUni('全部學校');
                    setSelectedGroup('全部學群');
                    setSelectedStatus('全部級別');
                    setSearchQuery('');
                    setVisibleCount(15);
                  }}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer ml-2 hover:underline"
                >
                  全部清除
                </button>
              </div>
            )}
          </div>

          {/* 結果列表 */}
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center text-xs text-slate-500 font-bold px-1">
              <span>已過濾出 {filteredAndSortedData.length} 個符合校系</span>
              <span>符合上限最多 4 校對比</span>
            </div>

            {displayedResults.length > 0 ? (
              <>
                {displayedResults.map(({ dept, analysis }) => {
                  const isItemCompared = isCompared(dept.id);
                  return (
                    <div 
                      key={dept.id} 
                      className={`glass-card rounded-2xl p-5 border transition-all duration-300 ${
                        analysis.status === 'highly-advantageous' 
                          ? 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/50' 
                          : analysis.status === 'safe' 
                          ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40'
                          : analysis.status === 'challenge'
                          ? 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40'
                          : analysis.status === 'disqualified'
                          ? 'border-red-500/10 bg-red-500/5 opacity-75'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        
                        {/* 校系主體與學群 */}
                        <div className="space-y-2">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="text-[10px] text-slate-400 font-bold">
                              {dept.university}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-800 border border-slate-750 text-slate-300 rounded text-3xs font-semibold">
                              {dept.group}
                            </span>
                            
                            {/* 狀態標籤 */}
                            {analysis.status === 'highly-advantageous' && (
                              <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded text-3xs font-extrabold flex items-center gap-0.5 animate-pulse">
                                <CheckCircle2 className="h-3 w-3" />
                                極具優勢
                              </span>
                            )}
                            {analysis.status === 'safe' && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-3xs font-bold">
                                安全/優勢
                              </span>
                            )}
                            {analysis.status === 'challenge' && (
                              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-3xs font-bold">
                                挑戰/偏難
                              </span>
                            )}
                            {analysis.status === 'conservative' && (
                              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 rounded text-3xs font-bold">
                                難度高
                              </span>
                            )}
                            {analysis.status === 'disqualified' && (
                              <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-3xs font-bold flex items-center gap-0.5">
                                <XCircle className="h-3 w-3" />
                                未達檢定
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-slate-100">{dept.name}</h4>
                          
                          {/* 檢定詳情或去年過關分數差距 */}
                          <div className="text-2xs text-slate-400 space-y-1">
                            {analysis.passedRequirements ? (
                              <p className="text-emerald-400 font-semibold flex items-center gap-1">
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                通過一階檢定標準
                                {analysis.margin !== null && (
                                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-black ${
                                    analysis.margin >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                  }`}>
                                    去年落點差距：{analysis.margin >= 0 ? `+${analysis.margin}` : analysis.margin} 級分
                                  </span>
                                )}
                              </p>
                            ) : (
                              <p className="text-red-400 font-semibold flex items-start gap-1">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                                <span>
                                  未達檢定標準：{analysis.failedSubjects.join('、')} 級分不足。
                                </span>
                              </p>
                            )}
                            
                            {/* 採計與倍率 */}
                            <p className="leading-relaxed">
                              去年通過線：<strong className="text-slate-300 font-bold">{dept.lastYearScore}</strong>
                              <span className="mx-2 text-slate-700">|</span>
                              招生名額：<span className="text-slate-300 font-semibold">{dept.quota}人</span>
                            </p>

                            {/* 倍率加權分析文字 */}
                            {analysis.passedRequirements && (
                              <p className="text-indigo-300/90 italic leading-normal">
                                🎯 加權優勢：{analysis.multiplierDetail}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* 動作按鈕 */}
                        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
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
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              targetDept?.id === dept.id
                                ? 'bg-pink-500/15 border border-pink-500/30 text-pink-300 hover:bg-pink-500/25 hover:scale-[1.02]'
                                : 'bg-slate-900 border border-slate-800 text-slate-355 hover:bg-slate-805/60'
                            }`}
                          >
                            <Target className="h-3.5 w-3.5" />
                            {targetDept?.id === dept.id ? '分析目標' : '設為目標'}
                          </button>

                          <button
                            onClick={() => handleCompareClick(dept)}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isItemCompared
                                ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                                : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                            }`}
                          >
                            {isItemCompared ? (
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
                    </div>
                  );
                })}

                {/* 載入更多按鈕，讓介面保持整齊乾淨 */}
                {filteredAndSortedData.length > visibleCount && (
                  <div className="flex justify-center mt-6 mb-2">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 15)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      顯示更多分析結果 (還有 {filteredAndSortedData.length - visibleCount} 個)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 text-slate-500">
                無符合篩選條件的校系，請調整篩選器或會考成績重試。
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
