'use client';

import React, { useState } from 'react';
import { useApp, TabType } from '../context/AppContext';
import { GraduationCap, Sparkles, Database, ArrowLeftRight, Menu, X, BookOpen, Award, Target, FileText } from 'lucide-react';

export default function HeaderWrapper() {
  const { activeTab, setActiveTab, compareList } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation: { name: string; tab: TabType; icon: React.ComponentType<{ className?: string }> }[] = [
    { name: '18學群測驗', tab: 'quiz', icon: Sparkles },
    { name: '落點優勢分析', tab: 'analyzer', icon: Award },
    { name: '目標系統', tab: 'target', icon: Target },
    { name: '頂大科系庫', tab: 'database', icon: Database },
    { name: '跨校系比較', tab: 'compare', icon: ArrowLeftRight },
    { name: '備審與甄試攻略', tab: 'portfolio', icon: FileText },
    { name: '升學攻略', tab: 'guides', icon: BookOpen },
  ];

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    // 滾動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/65 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo 區 */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabClick('home')}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-outfit font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 text-lg sm:text-xl">
                HEADING TO COLLEGE
              </span>
            </div>
          </div>

          {/* Desktop 導覽選單 */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleTabClick(item.tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.name}
                  {item.tab === 'compare' && compareList.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full animate-pulse">
                      {compareList.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 行動端選單按鈕 */}
          <div className="flex md:hidden items-center gap-3">
            {compareList.length > 0 && activeTab !== 'compare' && (
              <button
                onClick={() => handleTabClick('compare')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
              >
                <ArrowLeftRight className="h-3 w-3" />
                比較中
                <span className="bg-indigo-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                  {compareList.length}
                </span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 行動端導覽選單 */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 bg-slate-950/95 transition-all duration-300">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-base font-medium ${
                activeTab === 'home' ? 'bg-indigo-500/10 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              首頁大廳
            </button>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleTabClick(item.tab)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-base font-medium ${
                    isActive ? 'bg-indigo-500/10 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    {item.name}
                  </div>
                  {item.tab === 'compare' && compareList.length > 0 && (
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full">
                      {compareList.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
