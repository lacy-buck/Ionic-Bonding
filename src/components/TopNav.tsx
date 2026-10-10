import React from 'react';
import { BookOpen, Table, Lock } from 'lucide-react';
import { UserProgress } from '../types';

export type ActiveTab = 'home' | 'charge-practice' | 'build-compounds' | 'polyatomic' | 'formula-practice' | 'homework';

interface TopNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenReference: () => void;
  onOpenReading: () => void;
  progress: UserProgress;
  onLockedTabClick?: (message: string) => void;
}

export function arePreviousModulesCompleted(progress: UserProgress): {
  isComplete: boolean;
  step1Done: boolean;
  step2Done: boolean;
  step3Done: boolean;
  step4Done: boolean;
  missingMessage?: string;
} {
  const step1Done = progress.chargeRoundCompleted || progress.chargePracticeCorrect >= 6;
  const step2Done = step1Done && progress.compoundsBuilt >= 3;
  const step3Done = step2Done && progress.polyatomicCompleted;
  const step4Done = step3Done && progress.formulasSolved >= 3;

  if (!step1Done) {
    return {
      isComplete: false,
      step1Done,
      step2Done,
      step3Done,
      step4Done,
      missingMessage: 'Complete "Practice Ion Charges" (at least 6 correct elements) first.',
    };
  }
  if (!step2Done) {
    return {
      isComplete: false,
      step1Done,
      step2Done,
      step3Done,
      step4Done,
      missingMessage: 'Complete "Build Compounds" (build at least 3 compounds) first.',
    };
  }
  if (!step3Done) {
    return {
      isComplete: false,
      step1Done,
      step2Done,
      step3Done,
      step4Done,
      missingMessage: 'Complete the "Polyatomic Ions Lab" first.',
    };
  }
  if (!step4Done) {
    return {
      isComplete: false,
      step1Done,
      step2Done,
      step3Done,
      step4Done,
      missingMessage: `Complete the "Mixed Challenge" (solve at least 3 formulas; currently ${progress.formulasSolved}/3) first.`,
    };
  }

  return {
    isComplete: true,
    step1Done,
    step2Done,
    step3Done,
    step4Done,
  };
}

export function getTabLockStatus(tab: ActiveTab, progress: UserProgress): { isLocked: boolean; reason?: string } {
  if (tab === 'home' || tab === 'charge-practice') {
    return { isLocked: false };
  }
  if (tab === 'build-compounds') {
    const unlocked = progress.chargeRoundCompleted || progress.chargePracticeCorrect >= 6;
    return {
      isLocked: !unlocked,
      reason: 'Complete at least 6 elements in "Practice Ion Charges" first before moving on.',
    };
  }
  if (tab === 'polyatomic') {
    const priorDone = progress.chargeRoundCompleted || progress.chargePracticeCorrect >= 6;
    if (!priorDone) {
      return {
        isLocked: true,
        reason: 'Complete "Practice Ion Charges" and "Build Compounds" first before moving on.',
      };
    }
    const builtEnough = progress.compoundsBuilt >= 3;
    return {
      isLocked: !builtEnough,
      reason: 'Build at least 3 compounds in "Build Compounds" first before moving on.',
    };
  }
  if (tab === 'formula-practice') {
    return {
      isLocked: !progress.polyatomicCompleted,
      reason: 'Complete the questions and compound builds in "Polyatomic Ions Lab" first before taking the Mixed Challenge.',
    };
  }
  if (tab === 'homework') {
    return { isLocked: false };
  }
  return { isLocked: false };
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenReference,
  onOpenReading,
  progress,
  onLockedTabClick,
}) => {
  const handleTabClick = (tab: ActiveTab) => {
    const status = getTabLockStatus(tab, progress);
    if (status.isLocked) {
      if (onLockedTabClick && status.reason) {
        onLockedTabClick(status.reason);
      }
      return;
    }
    setActiveTab(tab);
  };

  const navItems: { tab: ActiveTab; label: string }[] = [
    { tab: 'home', label: 'Overview' },
    { tab: 'charge-practice', label: 'Practice Ion Charges' },
    { tab: 'build-compounds', label: 'Build Compounds' },
    { tab: 'polyatomic', label: 'Polyatomic Ions' },
    { tab: 'formula-practice', label: 'Mixed Challenge' },
    { tab: 'homework', label: 'Final Homework' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors text-left"
        >
          Ionic Bonding Challenge
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const { isLocked, reason } = getTabLockStatus(item.tab, progress);
            const isActive = activeTab === item.tab;

            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                title={isLocked ? reason : item.label}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                    : isLocked
                    ? 'text-slate-400 hover:text-slate-500 cursor-not-allowed opacity-75'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Reading Guide & Periodic Table */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
            title="Read how ionic bonds form step-by-step"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How Bonds Form</span>
          </button>

          <button
            onClick={onOpenReference}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
            title="Open Periodic Table of Elements"
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Periodic Table</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Bar */}
      <div className="flex md:hidden items-center justify-around px-2 py-1.5 bg-slate-100/90 border-t border-slate-200 text-xs overflow-x-auto">
        {navItems.map((item) => {
          const { isLocked } = getTabLockStatus(item.tab, progress);
          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => handleTabClick(item.tab)}
              className={`px-2 py-1 whitespace-nowrap rounded flex items-center gap-1 ${
                isActive
                  ? 'font-bold text-indigo-700 bg-white shadow-2xs'
                  : isLocked
                  ? 'text-slate-400 opacity-70'
                  : 'text-slate-600'
              }`}
            >
              <span>{item.tab === 'charge-practice' ? 'Charges' : item.tab === 'build-compounds' ? 'Build' : item.tab === 'polyatomic' ? 'Polyatomics' : item.tab === 'formula-practice' ? 'Challenge' : item.tab === 'homework' ? 'Homework' : 'Home'}</span>
              {isLocked && <Lock className="w-2.5 h-2.5 text-slate-400" />}
            </button>
          );
        })}
      </div>
    </header>
  );
};
