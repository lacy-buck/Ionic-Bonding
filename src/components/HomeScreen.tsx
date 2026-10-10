import React from 'react';
import { ActiveTab, getTabLockStatus, arePreviousModulesCompleted } from './TopNav';
import { UserProgress } from '../types';
import { BookOpen, Sparkles, Scale, Trophy, ArrowRight, RotateCcw, Layers, Lock, CheckCircle2, FileText, Download } from 'lucide-react';

interface HomeScreenProps {
  setActiveTab: (tab: ActiveTab) => void;
  progress: UserProgress;
  onResetProgress: () => void;
  onOpenReading: () => void;
  onLockedTabClick?: (message: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  setActiveTab,
  progress,
  onResetProgress,
  onOpenReading,
  onLockedTabClick,
}) => {
  const modulesCheck = arePreviousModulesCompleted(progress);
  const step1Done = modulesCheck.step1Done;
  const step2Done = modulesCheck.step2Done;
  const step3Done = modulesCheck.step3Done;
  const homeworkUnlocked = modulesCheck.isComplete;

  const handleCardClick = (tab: ActiveTab) => {
    const lock = getTabLockStatus(tab, progress);
    if (lock.isLocked) {
      if (onLockedTabClick && lock.reason) {
        onLockedTabClick(lock.reason);
      }
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Hero Welcome Header */}
      <div className="text-center space-y-3 pt-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Ionic Bonding Challenge
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
          Transfer electrons. Balance charges. Build the compound.
        </p>
      </div>

      {/* The 5-Step Core Sequence Visual Banner with Reading Quick-Link */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              The 5-Step Reasoning Pipeline
            </div>
            <div className="text-xs text-indigo-600 font-medium mt-0.5">
              Reason through the science, not just mechanical shortcuts
            </div>
          </div>
          <button
            onClick={onOpenReading}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors self-start sm:self-auto"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Study Guide</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 font-mono">STEP 01</span>
            <span className="text-xs font-semibold text-slate-800 mt-1">Valence Electrons</span>
            <span className="text-[11px] text-slate-500 mt-1">Check outer shell electrons using group number</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 font-mono">STEP 02</span>
            <span className="text-xs font-semibold text-slate-800 mt-1">Transfer Electrons</span>
            <span className="text-[11px] text-slate-500 mt-1">Metal loses electrons → Nonmetal gains electrons</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 font-mono">STEP 03</span>
            <span className="text-xs font-semibold text-slate-800 mt-1">Determine Charges</span>
            <span className="text-[11px] text-slate-500 mt-1">Compare lost/gained e⁻ to identify ion charges</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 font-mono">STEP 04</span>
            <span className="text-xs font-semibold text-slate-800 mt-1">Combine Ions</span>
            <span className="text-[11px] text-slate-500 mt-1">Add ions until Total Charge equals exactly 0</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 font-mono">STEP 05</span>
            <span className="text-xs font-semibold text-slate-800 mt-1">Write Formula</span>
            <span className="text-[11px] text-slate-500 mt-1">Simplest whole-number ratio (e.g. CaO, MgCl₂)</span>
          </div>
        </div>
      </div>

      {/* Main Sequential Learning Path Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Guided Learning & Practice Modules
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Sequential progression · Complete each step to unlock the next
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Practice Ion Charges (Step 1) */}
          <div
            onClick={() => handleCardClick('charge-practice')}
            className="group cursor-pointer bg-white border border-slate-200/90 hover:border-indigo-400/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {step1Done ? (
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Step 1 Complete</span>
                    </span>
                  ) : (
                    <span className="text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Step 1 (Start Here)
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  1. Practice Ion Charges
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Predict the charge of main-group atoms when they form ions. Answer-first feedback with smart hints that reinforce group number reasoning.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {progress.chargePracticeCorrect} correct {progress.chargePracticeStreak > 0 && `· ${progress.chargePracticeStreak} streak`}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                Practice Charges <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Build Compounds (Step 2) */}
          <div
            onClick={() => handleCardClick('build-compounds')}
            className={`group rounded-2xl p-6 shadow-xs transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
              !step1Done
                ? 'bg-slate-50/80 border border-slate-200 opacity-75 cursor-not-allowed'
                : 'bg-white border border-slate-200/90 hover:border-indigo-400/80 hover:shadow-md cursor-pointer'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  !step1Done
                    ? 'bg-slate-100 border-slate-200 text-slate-400'
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                }`}>
                  <Scale className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {!step1Done ? (
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Locked (Step 2)</span>
                    </span>
                  ) : step2Done ? (
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Step 2 Complete</span>
                    </span>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Step 2 Unlocked
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  2. Build Compounds
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Add and subtract ions to balance charges to zero with live summation equations like (+2) + (-1) + (-1) = 0, then write the neutral chemical formula.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {!step1Done ? 'Requires 6 correct charges' : `${progress.compoundsBuilt} balanced compounds built`}
              </span>
              <span className={`inline-flex items-center gap-1 font-semibold ${
                !step1Done ? 'text-slate-400' : 'text-indigo-600 group-hover:translate-x-1 transition-transform'
              }`}>
                {!step1Done ? 'Complete Step 1 First' : 'Build Compounds'} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Polyatomic Ions Lab (Step 3) */}
          <div
            onClick={() => handleCardClick('polyatomic')}
            className={`group rounded-2xl p-6 shadow-xs transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
              !step2Done
                ? 'bg-slate-50/80 border border-slate-200 opacity-75 cursor-not-allowed'
                : 'bg-white border border-slate-200/90 hover:border-indigo-400/80 hover:shadow-md cursor-pointer'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  !step2Done
                    ? 'bg-slate-100 border-slate-200 text-slate-400'
                    : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                }`}>
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {!step2Done ? (
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Locked (Step 3)</span>
                    </span>
                  ) : step3Done ? (
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Step 3 Complete</span>
                    </span>
                  ) : (
                    <span className="text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Step 3 Unlocked
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  3. Polyatomic Ions Lab
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Interact with polyatomic ions as single packages! Master the parentheses rules (e.g. Mg(OH)₂ vs CaSO₄) and count atoms across subscripts.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {!step2Done ? 'Build 3 compounds in Step 2 to unlock' : '6 questions + 5 builds'}
              </span>
              <span className={`inline-flex items-center gap-1 font-semibold ${
                !step2Done ? 'text-slate-400' : 'text-indigo-600 group-hover:translate-x-1 transition-transform'
              }`}>
                {!step2Done ? 'Complete Step 2 First' : 'Explore Polyatomics'} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 4: Mixed Challenge (Step 4) */}
          <div
            onClick={() => handleCardClick('formula-practice')}
            className={`group rounded-2xl p-6 shadow-xs transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
              !step3Done
                ? 'bg-slate-50/80 border border-slate-200 opacity-75 cursor-not-allowed'
                : 'bg-white border border-slate-200/90 hover:border-indigo-400/80 hover:shadow-md cursor-pointer'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  !step3Done
                    ? 'bg-slate-100 border-slate-200 text-slate-400'
                    : 'bg-amber-50 border-amber-100 text-amber-600'
                }`}>
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {!step3Done ? (
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Locked (Step 4)</span>
                    </span>
                  ) : (
                    <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Step 4 Final Challenge
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  4. Mixed Challenge
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Master formula writing across 1:1, 2:1, 1:2, 1:3, 2:3, and 3:2 ratios, including tricky reduced ratios (CaO) and polyatomic ions with parentheses!
                </p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {!step3Done ? 'Complete Polyatomic Ions Lab to unlock' : `${progress.formulasSolved} solved`}
              </span>
              <span className={`inline-flex items-center gap-1 font-semibold ${
                !step3Done ? 'text-slate-400' : 'text-indigo-600 group-hover:translate-x-1 transition-transform'
              }`}>
                {!step3Done ? 'Complete Step 3 First' : 'Take Challenge'} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Capstone: Final Practice & Homework Assignment (PDF Export) */}
      <div
        onClick={() => handleCardClick('homework')}
        className="cursor-pointer bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-7 transition-all duration-200 border border-indigo-700/50 shadow-md hover:shadow-xl hover:border-indigo-400 group relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-emerald-300 bg-emerald-400/10 border border-emerald-400/30">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Available Any Time · 15 Mixed Questions</span>
              </span>
              <span className="text-xs text-indigo-200 font-medium">
                Instant PDF Export for Toddle
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
              Final Homework Practice & PDF Report
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Open and available at any time! Work through all 15 mixed questions across ion charge predictions, neutral binary compounds, polyatomic parentheses rules, and reduced ratios. When finished, download your completed responses as an official PDF report to upload to Toddle for homework credit.
            </p>

            {/* Recommended preparation sequence */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1.5">
                Recommended Practice Modules (Optional Preparation):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                  modulesCheck.step1Done ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}>
                  {modulesCheck.step1Done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0" />}
                  <span>1. Predict Charges ({progress.chargePracticeCorrect}/6 correct)</span>
                </div>
                <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                  modulesCheck.step2Done ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}>
                  {modulesCheck.step2Done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0" />}
                  <span>2. Build Compounds ({progress.compoundsBuilt}/3 built)</span>
                </div>
                <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                  modulesCheck.step3Done ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}>
                  {modulesCheck.step3Done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0" />}
                  <span>3. Polyatomic Lab ({progress.polyatomicCompleted ? 'Completed' : 'Practice'})</span>
                </div>
                <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                  modulesCheck.step4Done ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}>
                  {modulesCheck.step4Done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0" />}
                  <span>4. Mixed Challenge ({progress.formulasSolved}/3 solved)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white group-hover:scale-102"
            >
              <Download className="w-4 h-4" />
              <span>Start Homework & Export PDF</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
            <span className="text-[11px] text-indigo-300">
              Upload completed PDF to Toddle
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Mastery Overview Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Your Practice Progress</h3>
            <p className="text-xs text-slate-500">Track your chemistry mastery across all practice modules</p>
          </div>
          <button
            onClick={onResetProgress}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 transition-colors self-start sm:self-auto"
            title="Reset your local study progress"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Progress</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Charges Predicted</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {progress.chargePracticeCorrect}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Compounds Built</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {progress.compoundsBuilt}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Polyatomic Lab</span>
            <span className={`text-sm font-bold mt-1 inline-block ${progress.polyatomicCompleted ? 'text-emerald-700' : 'text-slate-600'}`}>
              {progress.polyatomicCompleted ? '✓ Completed' : 'In Progress'}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Challenge Solved</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {progress.formulasSolved}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 block">Homework PDF</span>
            <span className={`text-sm font-bold mt-1 inline-block ${progress.homeworkCompleted ? 'text-emerald-700' : 'text-indigo-600'}`}>
              {progress.homeworkCompleted ? `✓ Ready (${progress.homeworkScore || 15}/15)` : '15 Mixed Questions'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
