import React, { useState, useEffect } from 'react';
import { ActiveTab, TopNav, getTabLockStatus, arePreviousModulesCompleted } from './components/TopNav';
import { HomeScreen } from './components/HomeScreen';
import { IonChargePractice } from './components/IonChargePractice';
import { BuildCompounds } from './components/BuildCompounds';
import { PolyatomicPractice } from './components/PolyatomicPractice';
import { FormulaPractice } from './components/FormulaPractice';
import { FinalHomeworkPractice } from './components/FinalHomeworkPractice';
import { PeriodicTableModal } from './components/PeriodicTableModal';
import { IonicBondingReadingModal } from './components/IonicBondingReadingModal';
import { UserProgress } from './types';
import { Lock, X } from 'lucide-react';

const INITIAL_PROGRESS: UserProgress = {
  learnCompleted: [],
  chargePracticeTotal: 0,
  chargePracticeCorrect: 0,
  chargePracticeStreak: 0,
  chargeRoundCompleted: false,
  compoundsBuilt: 0,
  polyatomicCompleted: false,
  formulasSolved: 0,
  formulasStreak: 0,
  homeworkCompleted: false,
  homeworkScore: 0,
};

const STORAGE_KEY = 'ionic_bonding_challenge_progress_v3';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);
  const [isReadingOpen, setIsReadingOpen] = useState<boolean>(false);
  const [lockNotice, setLockNotice] = useState<string | null>(null);

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PROGRESS;
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Auto-dismiss lock notice after 4 seconds
  useEffect(() => {
    if (!lockNotice) return;
    const timer = setTimeout(() => {
      setLockNotice(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [lockNotice]);

  const handleChargePracticeCorrect = () => {
    setProgress((prev) => {
      const nextCorrect = prev.chargePracticeCorrect + 1;
      return {
        ...prev,
        chargePracticeTotal: prev.chargePracticeTotal + 1,
        chargePracticeCorrect: nextCorrect,
        chargePracticeStreak: prev.chargePracticeStreak + 1,
        chargeRoundCompleted: prev.chargeRoundCompleted || nextCorrect >= 6,
      };
    });
  };

  const handleChargeRoundComplete = () => {
    setProgress((prev) => ({
      ...prev,
      chargeRoundCompleted: true,
    }));
  };

  const handleCompoundMastered = () => {
    setProgress((prev) => ({
      ...prev,
      compoundsBuilt: prev.compoundsBuilt + 1,
    }));
  };

  const handlePolyatomicComplete = () => {
    setProgress((prev) => ({
      ...prev,
      polyatomicCompleted: true,
    }));
  };

  const handleFormulaSolved = () => {
    setProgress((prev) => ({
      ...prev,
      formulasSolved: prev.formulasSolved + 1,
      formulasStreak: prev.formulasStreak + 1,
    }));
  };

  const handleHomeworkComplete = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      homeworkCompleted: true,
      homeworkScore: score,
    }));
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your study progress?')) {
      setProgress(INITIAL_PROGRESS);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const handleLockedTabClick = (reason: string) => {
    setLockNotice(reason);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar with Navigation & Quick Actions */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReference={() => setIsReferenceOpen(true)}
        onOpenReading={() => setIsReadingOpen(true)}
        progress={progress}
        onLockedTabClick={handleLockedTabClick}
      />

      {/* Lock Warning Banner */}
      {lockNotice && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs font-semibold text-amber-900 flex items-center justify-between gap-2 shadow-2xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{lockNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setLockNotice(null)}
            className="p-1 text-amber-700 hover:text-amber-900 rounded"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className={`flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 ${
        activeTab !== 'home' ? 'py-2 sm:py-2.5' : 'py-5 sm:py-6'
      }`}>
        {activeTab === 'home' && (
          <HomeScreen
            setActiveTab={setActiveTab}
            progress={progress}
            onResetProgress={handleResetProgress}
            onOpenReading={() => setIsReadingOpen(true)}
            onLockedTabClick={handleLockedTabClick}
          />
        )}

        {activeTab === 'charge-practice' && (
          <IonChargePractice
            onCorrectAnswer={handleChargePracticeCorrect}
            streak={progress.chargePracticeStreak}
            totalCorrect={progress.chargePracticeCorrect}
            onRoundComplete={handleChargeRoundComplete}
            onProceedToBuild={() => setActiveTab('build-compounds')}
          />
        )}

        {activeTab === 'build-compounds' && (
          <BuildCompounds
            onCompoundMastered={handleCompoundMastered}
            compoundsBuilt={progress.compoundsBuilt}
            onProceedToPolyatomic={() => setActiveTab('polyatomic')}
          />
        )}

        {activeTab === 'polyatomic' && (
          <PolyatomicPractice
            onChallengeComplete={handlePolyatomicComplete}
            onProceedToChallenge={() => setActiveTab('formula-practice')}
          />
        )}

        {activeTab === 'formula-practice' && (
          <FormulaPractice
            onFormulaSolved={handleFormulaSolved}
            streak={progress.formulasStreak}
            totalSolved={progress.formulasSolved}
            onProceedToHomework={() => setActiveTab('homework')}
          />
        )}

        {activeTab === 'homework' && (
          <FinalHomeworkPractice
            onCompleteHomework={handleHomeworkComplete}
            onOpenReference={() => setIsReferenceOpen(true)}
            onOpenReading={() => setIsReadingOpen(true)}
          />
        )}
      </main>

      {/* Reading Guide Modal: How Ionic Bonds Form */}
      <IonicBondingReadingModal
        isOpen={isReadingOpen}
        onClose={() => setIsReadingOpen(false)}
      />

      {/* Periodic Table & Chemistry Reference Drawer/Modal */}
      <PeriodicTableModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      {/* Clean footer */}
      <footer className={`border-t border-slate-200 bg-white/70 ${
        activeTab !== 'home' ? 'py-2 mt-2' : 'py-5 mt-8'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>Ionic Bonding Challenge</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Valence Electrons → Electron Transfer → Ion Charges → Neutral Compound</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsReadingOpen(true)}
              className="hover:text-indigo-600 transition-colors font-medium text-indigo-600"
            >
              How Ionic Bonds Form (Guide)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsReferenceOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Periodic Table
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('homework')}
              className="hover:text-indigo-600 transition-colors font-medium text-slate-700"
            >
              Final Homework & PDF
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleResetProgress}
              className="hover:text-rose-600 transition-colors"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
