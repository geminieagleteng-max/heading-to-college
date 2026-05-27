'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import Quiz from '../components/Quiz';
import SearchDatabase from '../components/SearchDatabase';
import Dashboard from '../components/Dashboard';
import CompareTable from '../components/CompareTable';
import AdmissionsGuides from '../components/AdmissionsGuides';
import ScoreAnalyzer from '../components/ScoreAnalyzer';
import TargetSystem from '../components/TargetSystem';
import PortfolioGuide from '../components/PortfolioGuide';
import { Sparkles, Database, ChevronRight, BookOpen, Award, Target, FileText } from 'lucide-react';

export default function Home() {
  const { activeTab, setActiveTab, results } = useApp();

  // 根據 activeTab 渲染不同的主要區塊
  const renderContent = () => {
    switch (activeTab) {
      case 'quiz':
        // 如果已經有測驗結果，則直接顯示 Dashboard (包含雷達圖與科系推薦)
        return results ? <Dashboard /> : <Quiz />;
      case 'database':
        return <SearchDatabase />;
      case 'compare':
        return <CompareTable />;
      case 'guides':
        return <AdmissionsGuides />;
      case 'analyzer':
        return <ScoreAnalyzer />;
      case 'target':
        return <TargetSystem />;
      case 'portfolio':
        return <PortfolioGuide />;
      case 'home':
      default:
        return renderLandingPage();
    }
  };

  // 渲染首頁大廳
  const renderLandingPage = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            全新 2026 年升學與個人申請落點全方位策略
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6">
            啟航你的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">大學之路</span>
          </h1>
          <p className="text-lg text-slate-300 font-normal leading-relaxed">
            融合「18學群性向測驗」與「15所頂大申請入學落點資料庫」，提供最科學的升學規劃，並整合免試、繁星、申請、考試分發等完整攻略指引！
          </p>
        </div>

        {/* 核心功能入口 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 max-w-7xl mx-auto w-full mb-20">
          {/* 步驟 1：測驗入口卡片 */}
          <div 
            onClick={() => setActiveTab('quiz')}
            className="group cursor-pointer p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-slate-900/60 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <Sparkles className="h-5.5 w-5.5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                  步驟 01 · 探索興趣
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-indigo-300 transition-colors">
                18學群性向測驗
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                大考中心 18 學群之 18 題情境特質核心量表。利用多重加權計算出前 3 大最適學群，以精美雷達圖視覺化呈現！
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 gap-1 mt-auto">
              開始興趣探索 <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 步驟 2：學測落點與優勢分析入口卡片 */}
          <div 
            onClick={() => setActiveTab('analyzer')}
            className="group cursor-pointer p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-slate-900/60 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <Award className="h-5.5 w-5.5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                  步驟 02 · 落點評估
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-indigo-300 transition-colors">
                落點與優勢分析
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                填入您的學測成績，一鍵自動分析 15 所頂大 500 個科系，過濾檢定標準，判定去年分數差距與科目加權優勢！
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 gap-1 mt-auto">
              開始落點分析 <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 步驟 3：目標定位 */}
          <div 
            onClick={() => setActiveTab('target')}
            className="group cursor-pointer p-6 rounded-3xl bg-slate-900/40 border border-pink-500/20 hover:border-pink-500/50 hover:bg-slate-900/60 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full filter blur-3xl group-hover:bg-pink-500/20 transition-colors" />
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="h-11 w-11 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
                  <Target className="h-5.5 w-5.5 text-pink-400" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/20 uppercase tracking-wider">
                  步驟 03 · 目標定位
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-pink-300 transition-colors">
                目標志願系統
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                鎖定夢想科系，自動比對學測級分差距。串接二階簡章拆解客製化檢查清單，掌握備審口試要領！
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-pink-400 group-hover:text-pink-300 gap-1 mt-auto">
              進入目標系統 <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 步驟 4：資料庫與比較入口卡片 */}
          <div 
            onClick={() => setActiveTab('database')}
            className="group cursor-pointer p-6 rounded-3xl bg-slate-900/40 border border-purple-500/20 hover:border-purple-500/50 hover:bg-slate-900/60 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-3xl group-hover:bg-purple-500/20 transition-colors" />
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="h-11 w-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Database className="h-5.5 w-5.5 text-purple-400" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/20 uppercase tracking-wider">
                  步驟 04 · 二階與對比
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-purple-300 transition-colors">
                頂大科系庫與比較
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                收錄 15 所頂大之 500 個科系的學測採計、倍率篩選、二階佔比、錄取級分，支援 4 校系並排橫向對比與衝堂預警！
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-purple-400 group-hover:text-purple-300 gap-1 mt-auto">
              探索頂大科系 <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 步驟 5：升學攻略與規劃工具入口卡片 */}
          <div 
            onClick={() => setActiveTab('guides')}
            className="group cursor-pointer p-6 rounded-3xl bg-slate-900/40 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-slate-900/60 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full filter blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <BookOpen className="h-5.5 w-5.5 text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                  步驟 05 · 戰略規劃
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-emerald-300 transition-colors">
                升學攻略與工具
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                整合免試、四大升學管道攻略，包含選校通勤評估、繁星資格檢索、志願分發「箱子理論」模擬器及英文單字規劃！
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 gap-1 mt-auto">
              瀏覽升學攻略 <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 步驟 6：備審與甄試攻略入口卡片 */}
          <div 
            onClick={() => setActiveTab('portfolio')}
            className="group cursor-pointer p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-slate-900/60 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <FileText className="h-5.5 w-5.5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                  步驟 06 · 備審甄試
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-indigo-300 transition-colors">
                備審與甄試攻略
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                解析 108 課綱 A-R 審查代號與評分指標。提供 BAR 原則產出器、多元表現綜整規劃與二階口筆試實戰攻略！
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 gap-1 mt-auto">
              開始備審與甄試 <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>



        {/* 台灣個人申請入學核心流程指南 */}
        <div className="max-w-5xl mx-auto w-full border border-slate-800/80 bg-slate-950/40 rounded-3xl p-8 relative">
          <h3 className="text-xl font-bold mb-8 text-center text-slate-200">
            台灣大學個人申請入學篩選流程
          </h3>
          <div className="grid sm:grid-cols-4 gap-6 relative">
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-indigo-400 mb-3 border border-indigo-500/30">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">學測成績檢定</h4>
              <p className="text-xs text-slate-400 leading-normal">
                科系自訂國、英、數A、數B、社、自等考科標準（如：英文須達頂標）。
              </p>
            </div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-indigo-400 mb-3 border border-indigo-500/30">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">第一階段倍率篩選</h4>
              <p className="text-xs text-slate-400 leading-normal">
                依科目倍率（如：數學A篩選3倍）按學測級分由高至低篩選出二階面試名單。
              </p>
            </div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-indigo-400 mb-3 border border-indigo-500/30">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">二階學習歷程審查</h4>
              <p className="text-xs text-slate-400 leading-normal">
                繳交學習歷程檔案、多元表現與自傳，由科系教授進行書面審查評分。
              </p>
            </div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-indigo-400 mb-3 border border-indigo-500/30">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">二階口筆試甄試</h4>
              <p className="text-xs text-slate-400 leading-normal">
                參與各系舉辦的面試、筆試或實作。本系統能自動幫你抓出「面試日期衝突（衝堂）」的校系！
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {renderContent()}
    </div>
  );
}
