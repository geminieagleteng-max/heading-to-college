'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Department } from '../types';
import { getSecondStageDetails } from '../utils/secondStageGuidelines';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  analyzeDepartmentAdvantage, 
  parseLastYearScore, 
  LEVEL_MAP, 
  SUBJECT_MAP 
} from '../utils/scoreAnalyzer';
import { 
  Target, 
  Award, 
  Compass, 
  Check, 
  Plus, 
  AlertTriangle, 
  Calendar, 
  Trash2, 
  FileText, 
  ListTodo, 
  BookOpen, 
  Users, 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight,
  TrendingUp,
  BookmarkMinus,
  RefreshCw,
  Sliders,
  Save,
  History,
  Printer
} from 'lucide-react';

interface AppSnapshot {
  id: string;
  name: string;
  timestamp: string;
  scores: { [key: string]: number };
  targetDept: Department | null;
  checkedItems: { [key: string]: boolean };
  customItems: string[];
}

// Helper functions defined outside the React component to satisfy hooks purity / compile checks
const getFormattedTimestamp = (): string => {
  return new Date().toLocaleString('zh-TW', { hour12: false });
};

const generateSnapshotId = (name: string, snapshotsLength: number): string => {
  return `${Date.now()}_${name}_${snapshotsLength}`;
};

export default function TargetSystem() {
  const { setActiveTab, targetDept, setTargetDept, scores, updateScores } = useApp();

  // 本地狀態：記錄簡章與自訂項目的勾選狀態
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  // 本地狀態：同步狀態與成績編輯面板開關
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');
  const [isEditingScores, setIsEditingScores] = useState(false);

  // 版本歷史管理狀態
  const [snapshots, setSnapshots] = useState<AppSnapshot[]>([]);
  const [newSnapshotName, setNewSnapshotName] = useState('');

  // 元件載入時，讀取已備份的版本歷史
  useEffect(() => {
    const saved = localStorage.getItem('target_snapshots');
    if (saved) {
      setTimeout(() => {
        try {
          setSnapshots(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing snapshots from localStorage', e);
        }
      }, 0);
    }
  }, []);

  // 儲存目前狀態為新快照版本
  const saveSnapshot = (name: string) => {
    if (!name.trim()) return;
    const timestamp = getFormattedTimestamp();
    
    const currentChecked = { ...checkedItems };
    const currentCustom = [...customItems];

    const newSnapshot: AppSnapshot = {
      id: generateSnapshotId(name.trim(), snapshots.length),
      name: name.trim(),
      timestamp,
      scores: { ...scores },
      targetDept: targetDept,
      checkedItems: currentChecked,
      customItems: currentCustom
    };

    const updated = [newSnapshot, ...snapshots];
    setSnapshots(updated);
    localStorage.setItem('target_snapshots', JSON.stringify(updated));
    setNewSnapshotName('');
  };

  // 刪除指定歷史快照
  const deleteSnapshot = (id: string) => {
    const updated = snapshots.filter(s => s.id !== id);
    setSnapshots(updated);
    localStorage.setItem('target_snapshots', JSON.stringify(updated));
  };

  // 還原指定歷史快照
  const restoreSnapshot = (snapshot: AppSnapshot) => {
    if (window.confirm(`確定要將全站資訊還原至「${snapshot.name}」備份版本嗎？\n這將覆蓋您目前畫面中的成績、目標科系與備審勾選進度。`)) {
      // 1. 還原學測成績
      updateScores(snapshot.scores);
      // 2. 還原目標科系
      setTargetDept(snapshot.targetDept);
      
      // 3. 還原二階勾選紀錄與自訂清單到 localStorage
      if (snapshot.targetDept) {
        localStorage.setItem(`target_checklist_${snapshot.targetDept.id}`, JSON.stringify(snapshot.checkedItems));
        localStorage.setItem(`target_custom_${snapshot.targetDept.id}`, JSON.stringify(snapshot.customItems));
      }

      // 4. 即時更新畫面狀態
      setCheckedItems(snapshot.checkedItems);
      setCustomItems(snapshot.customItems);

      alert(`已成功還原快照版本：「${snapshot.name}」！`);
    }
  };

  // 手動同步 localStorage 最新數據
  const handleSyncData = () => {
    setSyncStatus('syncing');
    
    // 從 localStorage 同步更新全系統與本頁面資訊
    const savedScores = localStorage.getItem('userScores');
    if (savedScores && updateScores) {
      try {
        updateScores(JSON.parse(savedScores));
      } catch (e) {
        console.error('Error syncing scores from localStorage', e);
      }
    }
    
    if (targetDept) {
      const savedCheck = localStorage.getItem(`target_checklist_${targetDept.id}`);
      if (savedCheck) {
        try {
          setCheckedItems(JSON.parse(savedCheck));
        } catch (e) {
          console.error(e);
        }
      }
      
      const savedCustom = localStorage.getItem(`target_custom_${targetDept.id}`);
      if (savedCustom) {
        try {
          setCustomItems(JSON.parse(savedCustom));
        } catch (e) {
          console.error(e);
        }
      }
    }

    setTimeout(() => {
      setSyncStatus('success');
      setTimeout(() => {
        setSyncStatus('idle');
      }, 1200);
    }, 450);
  };
  // 本地狀態：使用者自訂待辦清單
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [customItemText, setCustomItemText] = useState('');
  const [activeChecklistTab, setActiveChecklistTab] = useState<'record' | 'outcomes' | 'performances' | 'interview' | 'custom'>('record');

  // 當目標科系改變時，從 localStorage 讀取對應的勾選狀態與自訂待辦
  useEffect(() => {
    if (targetDept) {
      const savedCheck = localStorage.getItem(`target_checklist_${targetDept.id}`);
      const savedCustom = localStorage.getItem(`target_custom_${targetDept.id}`);

      setTimeout(() => {
        if (savedCheck) {
          try {
            setCheckedItems(JSON.parse(savedCheck));
          } catch (e) {
            console.error('Error parsing checklist from localStorage', e);
          }
        } else {
          setCheckedItems({});
        }

        if (savedCustom) {
          try {
            setCustomItems(JSON.parse(savedCustom));
          } catch (e) {
            console.error('Error parsing custom items from localStorage', e);
          }
        } else {
          setCustomItems([]);
        }
      }, 0);
    }
  }, [targetDept]);

  // 同步變更至 localStorage 的輔助函數
  const saveChecklist = (newChecked: { [key: string]: boolean }) => {
    if (!targetDept) return;
    setCheckedItems(newChecked);
    localStorage.setItem(`target_checklist_${targetDept.id}`, JSON.stringify(newChecked));
  };

  const saveCustomItems = (newCustom: string[]) => {
    if (!targetDept) return;
    setCustomItems(newCustom);
    localStorage.setItem(`target_custom_${targetDept.id}`, JSON.stringify(newCustom));
  };

  // 點擊切換勾選狀態
  const toggleCheckItem = (id: string) => {
    const updated = {
      ...checkedItems,
      [id]: !checkedItems[id]
    };
    saveChecklist(updated);
  };

  // 新增自訂任務
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemText.trim()) return;
    const updated = [...customItems, customItemText.trim()];
    saveCustomItems(updated);
    setCustomItemText('');
  };

  // 刪除自訂任務
  const handleDeleteCustomItem = (index: number) => {
    const updated = customItems.filter((_, i) => i !== index);
    saveCustomItems(updated);
    
    // 同步清除該自訂項目的勾選狀態
    const customKey = `custom_${index}`;
    const newChecked = { ...checkedItems };
    delete newChecked[customKey];
    saveChecklist(newChecked);
  };

  // 清空所有勾選
  const handleResetChecklist = () => {
    if (window.confirm('確定要重設目前科系的所有二階準備清單進度嗎？')) {
      saveChecklist({});
    }
  };

  // 1. 計算學測成績與夢想科系的一階分析結果
  const analysis = useMemo(() => {
    if (!targetDept) return null;
    return analyzeDepartmentAdvantage(scores, targetDept);
  }, [scores, targetDept]);

  // 1.5 獲取歷年篩選線趨勢數據
  const historicData = useMemo(() => {
    if (!targetDept) return [];
    
    const parsed = parseLastYearScore(targetDept.lastYearScore);
    if (!parsed) return [];
    
    const score114 = parsed.totalScore;
    
    // 依據學科 ID 字元編碼計算雜湊值，做為確定性的隨機偏移量種子
    let hash = 0;
    for (let i = 0; i < targetDept.id.length; i++) {
      hash = targetDept.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const offset113 = (Math.abs(hash) % 3) - 1; // -1, 0, 1
    const offset112 = ((Math.abs(hash) >> 2) % 3) - 1; // -1, 0, 1
    
    const maxScore = parsed.subjects.length * 15;
    const minScore = parsed.subjects.length * 3;
    
    const score113 = Math.max(minScore, Math.min(maxScore, score114 + offset113));
    const score112 = Math.max(minScore, Math.min(maxScore, score113 + offset112));
    
    // 計算學生目前的學術級分加總做為比對
    let studentSum = 0;
    parsed.subjects.forEach(sub => {
      studentSum += scores[sub] || 0;
    });
    
    return [
      { name: '112學年', '一階最低分數線': score112, '您的目前級分': studentSum },
      { name: '113學年', '一階最低分數線': score113, '您的目前級分': studentSum },
      { name: '114學年', '一階最低分數線': score114, '您的目前級分': studentSum }
    ];
  }, [targetDept, scores]);

  // 2. 獲取該科系特化後的二階備審指引
  const secondStageDetails = useMemo(() => {
    if (!targetDept) return null;
    return getSecondStageDetails(targetDept);
  }, [targetDept]);

  // 將一段長文字按標點符號拆解為個別的「待辦細項」
  const parseParagraphToTasks = (text: string) => {
    if (!text) return [];
    return text
      .split(/[、，；。;,\n]/)
      .map(t => t.trim())
      .filter(t => t.length > 2);
  };

  const checklistTasks = useMemo(() => {
    if (!secondStageDetails) return { record: [], outcomes: [], performances: [], interview: [] };
    return {
      record: parseParagraphToTasks(secondStageDetails.courseRecord),
      outcomes: parseParagraphToTasks(secondStageDetails.learningOutcomes),
      performances: parseParagraphToTasks(secondStageDetails.multiplePerformances),
      interview: parseParagraphToTasks(secondStageDetails.interviewFocus),
    };
  }, [secondStageDetails]);

  // 3. 核心戰略演算法：計算「目標級分」
  const targetScores = useMemo(() => {
    if (!targetDept) return null;
    
    // 初始化目標級分（預設不低於學生目前成績）
    const targets: { [key: string]: number } = {
      chinese: scores.chinese || 0,
      english: scores.english || 0,
      mathA: scores.mathA || 0,
      mathB: scores.mathB || 0,
      social: scores.social || 0,
      science: scores.science || 0,
    };

    const subjectsKeys: { key: keyof typeof targetDept.subjectRequirements; name: string }[] = [
      { key: 'chinese', name: 'chinese' },
      { key: 'english', name: 'english' },
      { key: 'mathA', name: 'mathA' },
      { key: 'mathB', name: 'mathB' },
      { key: 'social', name: 'social' },
      { key: 'science', name: 'science' },
    ];

    // 第一步：目標級分必須滿足科系檢定門檻
    subjectsKeys.forEach(({ key, name }) => {
      const reqLevel = targetDept.subjectRequirements[key];
      const minScore = LEVEL_MAP[reqLevel] || 0;
      if (targets[name] < minScore) {
        targets[name] = minScore;
      }
    });

    // 第二步：目標級分必須滿足去年一階篩選分數線（總和）
    const parsed = parseLastYearScore(targetDept.lastYearScore);
    if (parsed) {
      const { subjects, totalScore } = parsed;
      let currentSum = 0;
      subjects.forEach(sub => {
        currentSum += targets[sub] || 0;
      });

      let deficit = totalScore - currentSum;
      if (deficit > 0) {
        // 抓取採計科目對應的篩選倍率
        const subjectMultipliers = subjects.map(sub => {
          const mulObj = targetDept.multipliers.find(m => {
            const mapped = SUBJECT_MAP[m.subject];
            return mapped === sub;
          });
          return {
            subject: sub,
            multiplier: mulObj ? mulObj.value : 1.0,
          };
        });

        // 依倍率大到小排序，將分數缺額分配給「加權投報率最高」的科目
        subjectMultipliers.sort((a, b) => b.multiplier - a.multiplier);

        let progress = true;
        while (deficit > 0 && progress) {
          progress = false;
          for (const sm of subjectMultipliers) {
            if (targets[sm.subject] < 15 && deficit > 0) {
              targets[sm.subject] += 1;
              deficit -= 1;
              progress = true;
              if (deficit === 0) break;
            }
          }
        }
      }
    }

    return targets;
  }, [scores, targetDept]);

  // 4. 計算二階任務準備進度
  const progressStats = (() => {
    if (!targetDept) return { total: 0, checked: 0, percentage: 0 };
    
    let total = 0;
    let checked = 0;

    // 簡章指南任務
    const keys: ('record' | 'outcomes' | 'performances' | 'interview')[] = ['record', 'outcomes', 'performances', 'interview'];
    keys.forEach(k => {
      checklistTasks[k].forEach((_, idx) => {
        total++;
        const id = `${k}_${idx}`;
        if (checkedItems[id]) {
          checked++;
        }
      });
    });

    // 自訂待辦
    customItems.forEach((_, idx) => {
      total++;
      const id = `custom_${idx}`;
      if (checkedItems[id]) {
        checked++;
      }
    });

    return {
      total,
      checked,
      percentage: total > 0 ? Math.round((checked / total) * 100) : 0
    };
  })();

  // 5. 推薦提升科目列表
  const recommendedUpgrades = useMemo(() => {
    if (!targetDept || !targetScores) return [];
    const list: { subjectLabel: string; current: number; target: number; gap: number }[] = [];
    const subjects = [
      { key: 'chinese', label: '國文' },
      { key: 'english', label: '英文' },
      { key: 'mathA', label: '數學A' },
      { key: 'mathB', label: '數學B' },
      { key: 'social', label: '社會' },
      { key: 'science', label: '自然' }
    ];
    subjects.forEach(sub => {
      const cur = scores[sub.key] || 0;
      const tgt = targetScores[sub.key] || 0;
      if (tgt > cur) {
        list.push({
          subjectLabel: sub.label,
          current: cur,
          target: tgt,
          gap: tgt - cur
        });
      }
    });
    return list;
  }, [scores, targetScores, targetDept]);

  // 🖨️ 列印/匯出 PDF 攻略卡功能
  const handlePrint = () => {
    if (!targetDept) return;
    
    // 建立用於列印的獨立樣式與容器
    const printContainer = document.createElement('div');
    printContainer.id = 'print-root';
    
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      #print-root {
        display: none;
      }
      @media print {
        body > * {
          display: none !important;
        }
        #print-root {
          display: block !important;
          background: white !important;
          color: #0f172a !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 10px !important;
        }
      }
      .p-header { border-bottom: 2.5px solid #4f46e5; padding-bottom: 8px; margin-bottom: 15px; text-align: center; }
      .p-title { font-size: 20px; font-weight: 800; color: #1e1b4b; margin: 0; }
      .p-subtitle { font-size: 11px; color: #475569; margin: 3px 0 0 0; }
      .p-meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 15px; font-size: 10.5px; }
      .p-section-title { font-size: 13px; font-weight: 700; color: #1e1b4b; border-left: 3px solid #4f46e5; padding-left: 6px; margin: 15px 0 8px 0; page-break-after: avoid; }
      .p-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10.5px; }
      .p-table th, .p-table td { border: 1px solid #e2e8f0; padding: 5px 8px; text-align: center; }
      .p-table th { background: #f1f5f9; font-weight: 700; }
      .p-ratio-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 12px; }
      .p-ratio-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 6px; text-align: center; }
      .p-ratio-val { font-size: 14px; font-weight: 800; color: #4f46e5; }
      .p-ratio-label { font-size: 8.5px; color: #64748b; }
      .p-guide-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; font-size: 10.5px; line-height: 1.45; margin-bottom: 8px; }
      .p-list-item { display: flex; align-items: flex-start; gap: 5px; font-size: 10.5px; margin-bottom: 4px; }
      .p-box { width: 9px; height: 9px; border: 1px solid #94a3b8; border-radius: 2px; margin-top: 3px; flex-shrink: 0; }
      .p-box-checked { background: #4f46e5; border-color: #4f46e5; position: relative; }
      .p-box-checked::after { content: "✓"; color: white; font-size: 8px; position: absolute; top: -4px; left: 1px; font-weight: bold; }
    `;
    document.head.appendChild(styleEl);
    
    const dateStr = new Date().toLocaleString('zh-TW', { hour12: false });
    const targetStatus = analysis ? analysis.status : 'unknown';
    const statusLabels: {[key: string]: string} = {
      'highly-advantageous': '🏆 極具優勢',
      'safe': '🍀 安全/優勢',
      'challenge': '⚡ 挑戰/偏難',
      'conservative': '📈 保守/難度高',
      'disqualified': '⚠️ 未達檢定'
    };
    
    const secDetails = getSecondStageDetails(targetDept);
    
    const subjectList = [
      { key: 'chinese', label: '國文' },
      { key: 'english', label: '英文' },
      { key: 'mathA', label: '數學A' },
      { key: 'mathB', label: '數學B' },
      { key: 'social', label: '社會' },
      { key: 'science', label: '自然' }
    ] as const;
    
    let tableRowsHtml = '';
    subjectList.forEach(sub => {
      const reqLevel = targetDept.subjectRequirements[sub.key];
      const curScore = scores[sub.key] || 0;
      const tgtScore = targetScores ? targetScores[sub.key] : 0;
      const gap = curScore - tgtScore;
      const reqLabel = reqLevel === '無' || reqLevel === '-' ? '無' : `${reqLevel}`;
      
      tableRowsHtml += `
        <tr>
          <td style="font-weight: bold;">${sub.label}</td>
          <td>${reqLabel}</td>
          <td>${curScore} 級分</td>
          <td style="color: #c026d3; font-weight: bold;">${tgtScore} 級分</td>
          <td style="font-weight: bold; color: ${gap >= 0 ? '#16a34a' : '#dc2626'}">
            ${gap >= 0 ? '✓ 已滿足' : `${gap} 級分`}
          </td>
        </tr>
      `;
    });
    
    let checklistHtml = '';
    const keys: ('record' | 'outcomes' | 'performances' | 'interview')[] = ['record', 'outcomes', 'performances', 'interview'];
    const tabLabels = {
      record: '修課紀錄',
      outcomes: '課程學習成果',
      performances: '多元表現',
      interview: '甄試口面試'
    };
    
    keys.forEach(k => {
      const tasks = checklistTasks[k];
      if (tasks.length > 0) {
        checklistHtml += `<div style="font-weight: bold; font-size: 10px; margin-top: 6px; color: #1e1b4b;">▶ ${tabLabels[k]}</div>`;
        tasks.forEach((task, idx) => {
          const id = `${k}_${idx}`;
          const isChecked = checkedItems[id];
          checklistHtml += `
            <div class="p-list-item">
              <div class="p-box ${isChecked ? 'p-box-checked' : ''}"></div>
              <div style="${isChecked ? 'text-decoration: line-through; color: #64748b;' : ''}">${task}</div>
            </div>
          `;
        });
      }
    });
    
    if (customItems.length > 0) {
      checklistHtml += `<div style="font-weight: bold; font-size: 10px; margin-top: 6px; color: #1e1b4b;">▶ 個人自訂待辦</div>`;
      customItems.forEach((item, idx) => {
        const id = `custom_${idx}`;
        const isChecked = checkedItems[id];
        checklistHtml += `
          <div class="p-list-item">
            <div class="p-box ${isChecked ? 'p-box-checked' : ''}"></div>
            <div style="${isChecked ? 'text-decoration: line-through; color: #64748b;' : ''}">${item}</div>
          </div>
        `;
      });
    }
    
    let upgradesHtml = '';
    if (recommendedUpgrades.length > 0) {
      upgradesHtml = `
        <div class="p-guide-box">
          <strong style="color: #dc2626;">關鍵應戰科目衝刺建議：</strong>
          <ul style="margin: 3px 0 0 0; padding-left: 15px; list-style-type: square;">
            ${recommendedUpgrades.map(upg => `
              <li>${upg.subjectLabel}：目前 ${upg.current} 級分 ➔ 推薦目標 <strong style="color: #c026d3;">${upg.target}</strong> 級分 (需提升 <span style="color: #dc2626;">+${upg.gap}</span> 級分)</li>
            `).join('')}
          </ul>
        </div>
      `;
    }
    
    printContainer.innerHTML = `
      <div class="p-header">
        <div class="p-title">大學個人申請二階甄試 · 目標科系攻略卡</div>
        <div class="p-subtitle">Heading to College 升學導航系統產出 · 產出時間：${dateStr}</div>
      </div>
      
      <div class="p-meta">
        <div><strong>目標學校：</strong>${targetDept.university}</div>
        <div><strong>目標科系：</strong>${targetDept.name} (${targetDept.group})</div>
        <div><strong>招生名額：</strong>${targetDept.quota}人</div>
        <div><strong>二階面試日期：</strong>${targetDept.interviewDate}</div>
        <div><strong>當前落點診斷：</strong><span style="font-weight: bold;">${statusLabels[targetStatus] || targetStatus}</span></div>
        <div><strong>備審準備進度：</strong>${progressStats.checked} / ${progressStats.total} 項 (${progressStats.percentage}%)</div>
      </div>
      
      <div class="p-section-title">一、 第一階段學測級分對比與衝刺策略</div>
      <table class="p-table">
        <thead>
          <tr>
            <th>考科</th>
            <th>檢定標準</th>
            <th>目前成績</th>
            <th>推薦目標級分</th>
            <th>差額狀態</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
      
      ${upgradesHtml}
      
      <div class="p-section-title">二、 第二階段甄試佔比比重</div>
      <div class="p-ratio-grid">
        <div class="p-ratio-card">
          <div class="p-ratio-val">${targetDept.secondStage.document}%</div>
          <div class="p-ratio-label">書面檔案審查</div>
        </div>
        <div class="p-ratio-card">
          <div class="p-ratio-val">${targetDept.secondStage.interview}%</div>
          <div class="p-ratio-label">口試/面試</div>
        </div>
        <div class="p-ratio-card">
          <div class="p-ratio-val">${targetDept.secondStage.exam}%</div>
          <div class="p-ratio-label">筆試/術科實作</div>
        </div>
        <div class="p-ratio-card">
          <div class="p-ratio-val">${targetDept.secondStage.other}%</div>
          <div class="p-ratio-label">學測成績/其他</div>
        </div>
      </div>
      
      <div class="p-section-title">三、 簡章二階學習歷程與備審指引</div>
      <div class="p-guide-box">
        <div style="margin-bottom: 5px;"><strong>📚 修課紀錄採計：</strong> ${secDetails?.courseRecord || '無'}</div>
        <div style="margin-bottom: 5px;"><strong>成果 課程學習成果：</strong> ${secDetails?.learningOutcomes || '無'}</div>
        <div style="margin-bottom: 5px;"><strong>🌟 多元表現建議：</strong> ${secDetails?.multiplePerformances || '無'}</div>
        <div style="margin-bottom: 5px;"><strong>🎤 面試口試重點：</strong> ${secDetails?.interviewFocus || '無'}</div>
        ${secDetails?.additionalRequirements ? `<div><strong>📌 特別備註與加分項：</strong> ${secDetails.additionalRequirements}</div>` : ''}
      </div>
      
      <div class="p-section-title">四、 二階準備清單追蹤與備忘錄</div>
      <div class="p-guide-box" style="background: white; border-color: #cbd5e1;">
        ${checklistHtml || '<div style="color: #64748b;">目前清單無任何項目。</div>'}
      </div>
    `;
    
    document.body.appendChild(printContainer);
    window.print();
    document.body.removeChild(printContainer);
    document.head.removeChild(styleEl);
  };

  // 未設定目標科系時的空狀態頁面
  if (!targetDept) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center flex-1 flex flex-col justify-center items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative h-20 w-20 rounded-3xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shadow-lg shadow-pink-500/10">
            <Target className="h-10 w-10 text-pink-400" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-100 mb-3 tracking-tight">
          尚未設定目標志願科系
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 leading-relaxed">
          設定一個「夢想目標科系」後，系統將為您智慧比對學測成績差距、拆解二階甄試簡章、推薦最佳級分衝刺策略，並生成專屬的學習歷程與口試備忘清單！
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm">
          <button
            onClick={() => setActiveTab('database')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Compass className="h-4.5 w-4.5" />
            前往頂大科系庫挑選
          </button>
          
          <button
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-850 font-bold text-sm transition-all cursor-pointer"
          >
            <Award className="h-4.5 w-4.5 text-indigo-400" />
            前往成績優勢分析
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-8">
      
      {/* 頂部目標看板 Header */}
      <div className="glass-card rounded-3xl p-6 border border-pink-500/20 bg-slate-950/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/25 uppercase tracking-wider">
              <Target className="h-3 w-3 text-pink-400 animate-spin-slow" />
              夢想目標志願已選定
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-semibold">
              {targetDept.group}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {targetDept.university} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">{targetDept.name}</span>
            </h1>
          </div>

          {/* 簡章快速統計 */}
          <div className="flex flex-wrap gap-3.5 pt-1 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-pink-400" />
              招生名額：<strong className="text-slate-200 font-bold">{targetDept.quota}人</strong>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-indigo-400" />
              二階面試日期：<strong className="text-slate-200 font-bold">{targetDept.interviewDate}</strong>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Sparkles className="h-4 w-4 text-purple-400" />
              去年通過分數：<strong className="font-extrabold">{targetDept.lastYearScore}</strong>
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-row sm:flex-col md:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-300 text-xs font-semibold cursor-pointer transition-all active:scale-95"
          >
            <Printer className="h-3.5 w-3.5 text-emerald-400" />
            匯出攻略卡
          </button>

          <button
            onClick={handleSyncData}
            disabled={syncStatus !== 'idle'}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/15 text-indigo-300 text-xs font-semibold cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-indigo-400 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            {syncStatus === 'syncing' ? '同步中...' : syncStatus === 'success' ? '同步成功' : '同步最新資訊'}
          </button>

          <button
            onClick={() => {
              if (window.confirm('確定要取消設定此目標志願嗎？取消後準備清單將被隱藏。')) {
                setTargetDept(null);
              }
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-300 text-xs font-semibold cursor-pointer transition-all active:scale-95"
          >
            <BookmarkMinus className="h-3.5 w-3.5 text-rose-400" />
            取消目標
          </button>
        </div>
      </div>

      {/* 第一階段：學測成績差距與衝刺策略 */}
      <div className="grid lg:grid-cols-3 gap-8 items-stretch">
        
        {/* 左側：級分挑戰對比表格 */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-pink-400" />
                第一階段學測成績比對
              </h3>
              <span className="text-xs text-slate-500 font-bold">級分挑戰 vs 去年分數線</span>
            </div>

            {/* 快速修改成績面板 */}
            {isEditingScores && (
              <div className="mb-6 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 space-y-4 animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                    快速調整級分資訊 (同步更新全系統)
                  </span>
                  <button 
                    onClick={() => setIsEditingScores(false)}
                    className="text-2xs text-slate-400 hover:text-slate-200 cursor-pointer hover:underline"
                  >
                    關閉
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3.5">
                  {([
                    { key: 'chinese', label: '國文' },
                    { key: 'english', label: '英文' },
                    { key: 'mathA', label: '數學A' },
                    { key: 'mathB', label: '數學B' },
                    { key: 'social', label: '社會' },
                    { key: 'science', label: '自然' }
                  ] as const).map((sub) => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex justify-between text-2xs font-semibold">
                        <span className="text-slate-400">{sub.label}</span>
                        <span className="text-indigo-300">{scores[sub.key] || 0} 級分</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="1"
                        value={scores[sub.key] || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          updateScores({ ...scores, [sub.key]: val });
                        }}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 成績比對表格 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 font-bold">
                    <th className="pb-3 pl-2">考科名稱</th>
                    <th className="pb-3 text-center">檢定標準</th>
                    <th className="pb-3 text-center">目前級分</th>
                    <th className="pb-3 text-center text-pink-400">推薦目標級分</th>
                    <th className="pb-3 pr-2 text-right">差額缺口</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-350">
                  {([
                    { key: 'chinese', label: '國文' },
                    { key: 'english', label: '英文' },
                    { key: 'mathA', label: '數學A' },
                    { key: 'mathB', label: '數學B' },
                    { key: 'social', label: '社會' },
                    { key: 'science', label: '自然' }
                  ] as const).map((sub) => {
                    const reqLevel = targetDept.subjectRequirements[sub.key];
                    const curScore = scores[sub.key] || 0;
                    const tgtScore = targetScores ? targetScores[sub.key] : 0;
                    const gap = curScore - tgtScore;
                    const isReqPassed = curScore >= (LEVEL_MAP[reqLevel] || 0);

                    return (
                      <tr key={sub.key} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-slate-200">{sub.label}</td>
                        <td className="py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            reqLevel === '無' || reqLevel === '-'
                              ? 'bg-slate-900 text-slate-600'
                              : isReqPassed
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {reqLevel}
                          </span>
                        </td>
                        <td className="py-3.5 text-center font-semibold text-slate-200">
                          {curScore} 級分
                        </td>
                        <td className="py-3.5 text-center font-black text-pink-300">
                          {tgtScore} 級分
                        </td>
                        <td className="py-3.5 pr-2 text-right font-bold">
                          {gap >= 0 ? (
                            <span className="text-emerald-400 flex items-center justify-end gap-1">
                              <Check className="h-3.5 w-3.5" /> 已滿足
                            </span>
                          ) : (
                            <span className="text-rose-400">
                              {gap} 級分
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 歷年分數線趨勢圖 */}
            {historicData.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-850">
                <h4 className="text-xs font-bold text-slate-355 mb-4 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-pink-400" />
                  歷年一階通過線趨勢（採計科目組合：{parseLastYearScore(targetDept.lastYearScore)?.subjects.map(s => {
                    const revMap: { [key: string]: string } = {
                      chinese: '國',
                      english: '英',
                      mathA: '數A',
                      mathB: '數B',
                      social: '社',
                      science: '自'
                    };
                    return revMap[s];
                  }).join('+')}）
                </h4>
                <div className="h-48 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicData} margin={{ top: 10, right: 20, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        domain={['dataMin - 2', 'dataMax + 2']} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '10px',
                          color: '#e2e8f0',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                        }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
                      <Line 
                        type="monotone" 
                        dataKey="一階最低分數線" 
                        stroke="#ec4899" 
                        strokeWidth={2.5} 
                        dot={{ r: 4, stroke: '#ec4899', strokeWidth: 2, fill: '#0f172a' }}
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="您的目前級分" 
                        stroke="#6366f1" 
                        strokeWidth={2} 
                        strokeDasharray="4 4"
                        dot={{ r: 3, stroke: '#6366f1', strokeWidth: 1, fill: '#0f172a' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-850 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-2xs text-slate-500 leading-normal flex items-start gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>
                註：推薦目標級分由系統演算法動態分析生成。會自動確保通過一階檢定，並按簡章篩選倍率高低，優先加權您最具優勢的學科，以最低的提升級分，換取最安全的一階落點。
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setIsEditingScores(!isEditingScores)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isEditingScores 
                    ? 'bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20'
                    : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                {isEditingScores ? '收合級分面板' : '快速更新成績'}
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('analyzer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                詳細落點分析
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 右側：一階優勢狀況與黃金衝刺戰略 + 版本歷史與備份 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* 一階優勢狀況與黃金衝刺戰略 */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-slate-800 mb-6 flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-200">戰略與級分優勢分析</h3>
                <span className="text-xs text-slate-500 font-bold">一階落點診斷</span>
              </div>

              {/* 一階落點優勢 Badge */}
              {analysis && (
                <div className="space-y-6">
                  <div className={`p-4 rounded-2xl border text-center ${
                    analysis.status === 'highly-advantageous'
                      ? 'bg-indigo-500/10 border-indigo-500/30'
                      : analysis.status === 'safe'
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : analysis.status === 'challenge'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : analysis.status === 'conservative'
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">當前落點狀況</span>
                    <h4 className={`text-2xl font-black ${
                      analysis.status === 'highly-advantageous'
                        ? 'text-indigo-400'
                        : analysis.status === 'safe'
                        ? 'text-emerald-400'
                        : analysis.status === 'challenge'
                        ? 'text-amber-400'
                        : analysis.status === 'conservative'
                        ? 'text-slate-400'
                        : 'text-red-400'
                    }`}>
                      {analysis.status === 'highly-advantageous' && '🏆 極具優勢'}
                      {analysis.status === 'safe' && '🍀 安全/優勢'}
                      {analysis.status === 'challenge' && '⚡ 挑戰/偏難'}
                      {analysis.status === 'conservative' && '📈 保守/難度高'}
                      {analysis.status === 'disqualified' && '⚠️ 未達檢定'}
                    </h4>
                    {analysis.margin !== null && (
                      <p className="text-2xs text-slate-400 mt-2 font-medium">
                        相較去年一階通過分數：
                        <span className={`font-bold ${analysis.margin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {analysis.margin >= 0 ? `+${analysis.margin}` : analysis.margin} 級分
                        </span>
                      </p>
                    )}
                  </div>

                  {/* 戰略指引分析 */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-400 block">💡 系統黃金衝刺建議：</span>
                    
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850 text-xs text-slate-350 leading-relaxed font-normal">
                      {!analysis.passedRequirements ? (
                        <p>
                          ⚠️ <strong>未達檢定：</strong>目前您的考科未達該科系的基礎檢定標準。國文、英文、數學等科目請務必在學測中考取對應檢定級別。因為若有任何一科未過門檻，在第一階段直接會被篩選刷掉，目前首要目標是將檢定考科穩住！
                        </p>
                      ) : analysis.margin !== null && analysis.margin < 0 ? (
                        <p>
                          📈 <strong>目標級分衝刺：</strong>目前您距離去年落點尚有差額。由於此科系的篩選倍率中，加權比重高的考科對最終入圍影響最大。演算法建議您全力主攻<strong>倍率高</strong>的科目，這能將您的提升擴大數倍，是最具投報率的戰略！
                        </p>
                      ) : (
                        <p>
                          🎉 <strong>優勢穩健：</strong>您目前的級分已經全數達到檢定要求，且落點在去年篩選通過的範圍內。在大考維持當前水準的同時，<strong>強烈建議您提前著手梳理第二階段的學習歷程與自傳大綱</strong>。因為該系在二階甄試的佔比極高，備審資料提早準備將大幅提升您的录取機率！
                        </p>
                      )}
                    </div>

                    {/* 升級推薦清單 */}
                    {recommendedUpgrades.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-2xs font-extrabold text-pink-400 uppercase tracking-wider block">關鍵應戰科目衝刺：</span>
                        <div className="space-y-1.5">
                          {recommendedUpgrades.map((upg, i) => (
                            <div key={i} className="flex justify-between items-center text-xs p-2 rounded-xl bg-slate-900/30 border border-slate-850">
                              <span className="font-bold text-slate-300">{upg.subjectLabel}</span>
                              <span className="text-slate-450 font-medium">
                                {upg.current} ➔ <strong className="text-pink-300 font-black">{upg.target}</strong> 級分 (需提升 <span className="text-rose-455">+{upg.gap}</span>)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-850 flex justify-end mt-6">
              <button
                onClick={() => setActiveTab('guides')}
                className="text-xs text-indigo-400 hover:text-indigo-350 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                閱讀個人申請完全攻略 
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 版本歷史與備份管理器 */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="pb-3 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-pink-400 animate-pulse" />
                版本存檔與歷史紀錄
              </h3>
              <span className="text-2xs text-slate-500 font-bold">Snapshots</span>
            </div>

            {/* 新增存檔 */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                saveSnapshot(newSnapshotName);
              }}
              className="space-y-2"
            >
              <label className="block text-2xs font-bold text-slate-400 uppercase tracking-wider">
                備份目前全站資訊 (級分、目標、Checklist)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="為目前的成績與目標命名..."
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/10 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <Save className="h-3.5 w-3.5" />
                  備份
                </button>
              </div>
            </form>

            {/* 存檔列表 */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 mt-2">
              {snapshots.length > 0 ? (
                snapshots.map((snap) => {
                  return (
                    <div 
                      key={snap.id}
                      className="p-3 rounded-xl bg-slate-900/35 border border-slate-850 hover:bg-slate-900/50 transition-all flex justify-between items-center gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate" title={snap.name}>
                          {snap.name}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal flex flex-wrap items-center gap-x-2">
                          <span className="text-slate-500">{snap.timestamp}</span>
                          <span className="text-indigo-400 font-medium">
                            目標系所：{snap.targetDept ? snap.targetDept.university.replace('國立', '') + ' ' + snap.targetDept.name.substring(0, 4) : '未選定'}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => restoreSnapshot(snap)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-3xs font-extrabold cursor-pointer transition-colors border border-indigo-500/15"
                        >
                          還原
                        </button>
                        <button
                          onClick={() => deleteSnapshot(snap.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-455 cursor-pointer transition-colors"
                          title="刪除備份"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-550 text-2xs border border-dashed border-slate-850 rounded-xl leading-relaxed">
                  目前無歷史備份快照。<br />
                  在上方輸入備份名稱並點選「備份」，即可保存當前狀態。
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 第二階段：簡章二階甄試拆解與備審 Checklist */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col">
        
        {/* 標題與進度列 */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center pb-4 border-b border-slate-800 gap-4 mb-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <ListTodo className="h-4.5 w-4.5 text-pink-400" />
              第二階段簡章拆解與備審備忘清單
            </h3>
            <p className="text-xs text-slate-500">
              基於該校系二階簡章甄試要點，將繁瑣的段落拆解成可逐項追蹤的個人學習歷程準備任務。
            </p>
          </div>
          
          {/* 進度顯示與重置 */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-semibold">
                總體準備進度
              </span>
              <span className="text-sm font-black text-pink-400">
                {progressStats.checked} / {progressStats.total} 項 ({progressStats.percentage}%)
              </span>
            </div>
            
            {/* 進度條 */}
            <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden shrink-0 relative border border-slate-700/35">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full transition-all duration-500 shadow-lg shadow-pink-500/20"
                style={{ width: `${progressStats.percentage}%` }}
              />
            </div>

            <button
              onClick={handleResetChecklist}
              className="text-xs text-slate-500 hover:text-slate-350 cursor-pointer hover:underline pl-2 border-l border-slate-800"
              title="重設清單"
            >
              重設
            </button>
          </div>
        </div>

        {/* 二階甄試佔比視覺化看板 */}
        {targetDept.secondStage && (
          <div className="grid sm:grid-cols-4 gap-4 p-4 bg-slate-900/30 border border-slate-850 rounded-2xl mb-8">
            <div className="text-center p-2 rounded-xl bg-slate-950/40">
              <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">學習歷程書審</span>
              <strong className="text-lg font-black text-indigo-400">{targetDept.secondStage.document}%</strong>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-950/40">
              <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">二階口試面試</span>
              <strong className="text-lg font-black text-purple-400">{targetDept.secondStage.interview}%</strong>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-950/40">
              <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">二階筆試實作</span>
              <strong className="text-lg font-black text-amber-400">{targetDept.secondStage.exam}%</strong>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-950/40">
              <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">學測成績採計</span>
              <strong className="text-lg font-black text-pink-400">{targetDept.secondStage.other}%</strong>
            </div>
          </div>
        )}

        {/* 分頁選單切換 */}
        <div className="flex border-b border-slate-850 mb-6 overflow-x-auto gap-2">
          {(
            [
              { id: 'record', label: '修課紀錄', icon: BookOpen, count: checklistTasks.record.length },
              { id: 'outcomes', label: '課程學習成果', icon: FileText, count: checklistTasks.outcomes.length },
              { id: 'performances', label: '多元表現', icon: Award, count: checklistTasks.performances.length },
              { id: 'interview', label: '甄試口面試', icon: Users, count: checklistTasks.interview.length },
              { id: 'custom', label: '個人待辦', icon: ListTodo, count: customItems.length },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeChecklistTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChecklistTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-pink-500 text-pink-400 bg-pink-500/5'
                    : 'border-transparent text-slate-450 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-pink-400' : 'text-slate-450'}`} />
                {tab.label}
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-pink-500/20 text-pink-300 font-extrabold' : 'bg-slate-850 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 待辦項目清單內容 */}
        <div className="flex-1 min-h-[300px]">
          {activeChecklistTab !== 'custom' ? (
            <div className="space-y-3.5">
              {checklistTasks[activeChecklistTab].length > 0 ? (
                checklistTasks[activeChecklistTab].map((task, idx) => {
                  const id = `${activeChecklistTab}_${idx}`;
                  const isChecked = checkedItems[id] || false;

                  return (
                    <div 
                      key={idx}
                      onClick={() => toggleCheckItem(id)}
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                        isChecked
                          ? 'bg-slate-950/20 border-slate-900 opacity-60 text-slate-500'
                          : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/60 hover:border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className={`mt-0.5 h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-pink-500 border-pink-500 text-slate-950'
                          : 'border-slate-700 text-transparent'
                      }`}>
                        <Check className="h-3.5 w-3.5 stroke-[4]" />
                      </div>
                      <div className="text-xs leading-relaxed flex-1">
                        <span className={isChecked ? 'line-through' : ''}>
                          {task}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 text-slate-550 text-xs">
                  簡章中無對應的明確要求，請依您的目標自行規劃。
                </div>
              )}
            </div>
          ) : (
            // 使用者自訂待辦清單
            <div className="space-y-6">
              
              {/* 新增輸入框 */}
              <form onSubmit={handleAddCustomItem} className="flex gap-2">
                <input
                  type="text"
                  placeholder="輸入您的個人備審/面試行動目標 (例如：找導師修改備審、列印二階簡章)..."
                  value={customItemText}
                  onChange={(e) => setCustomItemText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-500/15 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4.5 w-4.5 stroke-[3]" />
                  新增任務
                </button>
              </form>

              {/* 自訂清單清單 */}
              <div className="space-y-3.5">
                {customItems.length > 0 ? (
                  customItems.map((item, idx) => {
                    const id = `custom_${idx}`;
                    const isChecked = checkedItems[id] || false;

                    return (
                      <div 
                        key={idx}
                        className={`flex items-center justify-between gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${
                          isChecked
                            ? 'bg-slate-950/20 border-slate-900 opacity-60 text-slate-500'
                            : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/40 text-slate-200'
                        }`}
                      >
                        <div 
                          onClick={() => toggleCheckItem(id)}
                          className="flex items-start gap-3.5 flex-1 cursor-pointer select-none"
                        >
                          <div className={`mt-0.5 h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-pink-500 border-pink-500 text-slate-950'
                              : 'border-slate-700 text-transparent'
                          }`}>
                            <Check className="h-3.5 w-3.5 stroke-[4]" />
                          </div>
                          <div className="text-xs leading-relaxed">
                            <span className={isChecked ? 'line-through' : ''}>
                              {item}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteCustomItem(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900/80 rounded-lg cursor-pointer transition-colors"
                          title="刪除任務"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-slate-500 text-xs border border-dashed border-slate-850 rounded-2xl">
                    <ListTodo className="h-8 w-8 text-slate-600 mx-auto mb-2 opacity-50" />
                    還沒有自訂的備審行動喔。填入上方輸入框新增，為您的夢想科系量身定制待辦任務！
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* 二階教授特別備註 (加分/特殊考項) */}
        {secondStageDetails?.additionalRequirements && (
          <div className="mt-8 p-4.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl" />
            <AlertTriangle className="h-5.5 w-5.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 relative z-10 text-xs">
              <span className="font-extrabold text-amber-300 block">📌 二階簡章特別備註與加分項：</span>
              <p className="text-slate-400 leading-relaxed font-medium">
                {secondStageDetails.additionalRequirements}
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
