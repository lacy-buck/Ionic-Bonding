import React, { useState } from 'react';
import { POLYATOMIC_IONS, toSubscripts, evaluateFormulaSubmission, getIonItem } from '../data/chemistry';
import { ChargeEquation } from './ChargeEquation';
import { FormulaInput } from './FormulaInput';
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Sparkles, Check, Layers, Hammer, Lock } from 'lucide-react';

interface PolyatomicPracticeProps {
  onChallengeComplete: () => void;
  onProceedToChallenge: () => void;
}

interface Question {
  id: number;
  type: 'parentheses' | 'atom-count' | 'charge';
  title: string;
  context: string;
  question: string;
  options: string[];
  correctIndex: number;
  highlightIon: string; // formula e.g. "OH"
  explanation: string;
}

const POLYATOMIC_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'parentheses',
    title: 'Question 1 of 6 · Parentheses Rule',
    context: 'Combining Magnesium (Mg²⁺) and Hydroxide (OH⁻).',
    question: 'Two Hydroxide ions (OH⁻) are needed to balance Mg²⁺. Which formula is written correctly?',
    options: ['Mg(OH)₂', 'MgOH₂', 'Mg₂OH'],
    correctIndex: 0,
    highlightIon: 'OH',
    explanation: 'MgOH₂ means 1 Mg, 1 O, and 2 H. To indicate two entire hydroxide groups (2 O and 2 H), you must enclose OH in parentheses: Mg(OH)₂.',
  },
  {
    id: 2,
    type: 'parentheses',
    title: 'Question 2 of 6 · The "Single Ion" Rule',
    context: 'Combining Calcium (Ca²⁺) and Sulfate (SO₄²⁻).',
    question: 'Ca²⁺ and SO₄²⁻ balance in a 1:1 ratio. Which formula is written correctly?',
    options: ['CaSO₄', 'Ca(SO₄)', 'Ca(SO₄)₁'],
    correctIndex: 0,
    highlightIon: 'SO4',
    explanation: 'Never use parentheses when there is only ONE polyatomic ion in the compound. Write CaSO₄, never Ca(SO₄).',
  },
  {
    id: 3,
    type: 'parentheses',
    title: 'Question 3 of 6 · Polyatomic Cation + Anion',
    context: 'Combining Ammonium (NH₄⁺) and Carbonate (CO₃²⁻).',
    question: 'Two Ammonium ions (NH₄⁺) balance one Carbonate ion (CO₃²⁻). Which formula is correct?',
    options: ['(NH₄)₂CO₃', 'NH₄₂CO₃', '(NH₄)₂(CO₃)'],
    correctIndex: 0,
    highlightIon: 'NH4',
    explanation: 'NH₄ gets parentheses because there are 2 of them: (NH₄)₂. Since there is only 1 carbonate, CO₃ does NOT get parentheses.',
  },
  {
    id: 4,
    type: 'atom-count',
    title: 'Question 4 of 6 · Counting Atoms',
    context: 'Examine Aluminum sulfate: Al₂(SO₄)₃.',
    question: 'In Al₂(SO₄)₃, how many total Oxygen (O) atoms are present in one formula unit?',
    options: ['4 Oxygen atoms', '7 Oxygen atoms', '12 Oxygen atoms', '3 Oxygen atoms'],
    correctIndex: 2,
    highlightIon: 'SO4',
    explanation: 'Multiply the subscript inside the parentheses by the subscript outside: 4 × 3 = 12 oxygen atoms.',
  },
  {
    id: 5,
    type: 'atom-count',
    title: 'Question 5 of 6 · Counting Atoms',
    context: 'Examine Calcium nitrate: Ca(NO₃)₂.',
    question: 'In Ca(NO₃)₂, how many total Nitrogen (N) atoms are present in one formula unit?',
    options: ['1 Nitrogen atom', '2 Nitrogen atoms', '3 Nitrogen atoms', '6 Nitrogen atoms'],
    correctIndex: 1,
    highlightIon: 'NO3',
    explanation: 'The subscript 2 outside the parentheses distributes to every atom inside: 1 N × 2 = 2 nitrogen atoms (and 3 × 2 = 6 oxygen atoms).',
  },
  {
    id: 6,
    type: 'charge',
    title: 'Question 6 of 6 · Polyatomic Charge Detective',
    context: 'In Sodium phosphate (Na₃PO₄), three Na⁺ ions balance one Phosphate ion.',
    question: 'What is the ionic charge of the Phosphate (PO₄³⁻) polyatomic ion?',
    options: ['-1', '-2', '-3', '+1'],
    correctIndex: 2,
    highlightIon: 'PO4',
    explanation: 'Three Na⁺ ions carry a total charge of +3. For the compound to be neutral (net charge 0), Phosphate must have a -3 charge (PO₄³⁻).',
  },
];

// Curated polyatomic build challenges
interface PolyatomicBuildChallenge {
  id: string;
  name: string;
  cationSymbol: string;
  anionFormula: string;
  expectedCationCount: number;
  expectedAnionCount: number;
  expectedFormula: string;
  tip: string;
}

const POLYATOMIC_BUILD_CHALLENGES: PolyatomicBuildChallenge[] = [
  {
    id: 'mg-oh',
    name: 'Magnesium hydroxide',
    cationSymbol: 'Mg',
    anionFormula: 'OH',
    expectedCationCount: 1,
    expectedAnionCount: 2,
    expectedFormula: 'Mg(OH)₂',
    tip: 'Hydroxide needs parentheses because you need 2 of them: Mg(OH)₂.',
  },
  {
    id: 'na-so4',
    name: 'Sodium sulfate',
    cationSymbol: 'Na',
    anionFormula: 'SO4',
    expectedCationCount: 2,
    expectedAnionCount: 1,
    expectedFormula: 'Na₂SO₄',
    tip: 'Only 1 sulfate is needed, so do NOT put parentheses around SO₄: Na₂SO₄.',
  },
  {
    id: 'ca-no3',
    name: 'Calcium nitrate',
    cationSymbol: 'Ca',
    anionFormula: 'NO3',
    expectedCationCount: 1,
    expectedAnionCount: 2,
    expectedFormula: 'Ca(NO₃)₂',
    tip: 'Two nitrate ions require parentheses: Ca(NO₃)₂.',
  },
  {
    id: 'al-so4',
    name: 'Aluminum sulfate',
    cationSymbol: 'Al',
    anionFormula: 'SO4',
    expectedCationCount: 2,
    expectedAnionCount: 3,
    expectedFormula: 'Al₂(SO₄)₃',
    tip: 'Requires 2 Al³⁺ and 3 SO₄²⁻ to reach net 0: Al₂(SO₄)₃.',
  },
  {
    id: 'nh4-co3',
    name: 'Ammonium carbonate',
    cationSymbol: 'NH4',
    anionFormula: 'CO3',
    expectedCationCount: 2,
    expectedAnionCount: 1,
    expectedFormula: '(NH₄)₂CO₃',
    tip: 'Ammonium is polyatomic and needs parentheses: (NH₄)₂CO₃.',
  },
];

export const PolyatomicPractice: React.FC<PolyatomicPracticeProps> = ({
  onChallengeComplete,
  onProceedToChallenge,
}) => {
  // Mode: questions vs build
  const [activeTab, setActiveTab] = useState<'questions' | 'build'>('questions');

  // Questions state
  const [selectedIonFormula, setSelectedIonFormula] = useState<string>('SO4');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [questionScore, setQuestionScore] = useState<number>(0);
  const [questionsFinished, setQuestionsFinished] = useState<boolean>(false);

  // Build state
  const [buildIndex, setBuildIndex] = useState<number>(0);
  const [buildCationCount, setBuildCationCount] = useState<number>(1);
  const [buildAnionCount, setBuildAnionCount] = useState<number>(1);
  const [buildPhase, setBuildPhase] = useState<'balance' | 'formula' | 'completed'>('balance');
  const [buildBalanceFeedback, setBuildBalanceFeedback] = useState<string | null>(null);
  const [buildFormulaInput, setBuildFormulaInput] = useState<string>('');
  const [buildFormulaFeedback, setBuildFormulaFeedback] = useState<string | null>(null);
  const [buildFormulaIsCorrect, setBuildFormulaIsCorrect] = useState<boolean>(false);
  const [buildsCompletedCount, setBuildsCompletedCount] = useState<number>(0);

  const currentQuestion = POLYATOMIC_QUESTIONS[currentIndex];
  const currentBuild = POLYATOMIC_BUILD_CHALLENGES[buildIndex];
  const cationItem = getIonItem(currentBuild.cationSymbol)!;
  const anionItem = getIonItem(currentBuild.anionFormula)!;

  const cationPositiveMag = Math.abs(cationItem.charge);
  const anionNegativeMag = Math.abs(anionItem.charge);
  const buildTotalPositive = buildCationCount * cationPositiveMag;
  const buildTotalNegative = buildAnionCount * anionNegativeMag;
  const buildNetCharge = buildTotalPositive - buildTotalNegative;

  const selectedIon =
    POLYATOMIC_IONS.find((i) => i.formula === selectedIonFormula) || POLYATOMIC_IONS[3];

  // Atom composition breakdown for inspector
  const getIonAtomBreakdown = (formula: string) => {
    switch (formula) {
      case 'SO4':
        return '1 Sulfur (S) + 4 Oxygen (O) atoms · -2 overall package charge';
      case 'NO3':
        return '1 Nitrogen (N) + 3 Oxygen (O) atoms · -1 overall package charge';
      case 'OH':
        return '1 Oxygen (O) + 1 Hydrogen (H) atom · -1 overall package charge';
      case 'CO3':
        return '1 Carbon (C) + 3 Oxygen (O) atoms · -2 overall package charge';
      case 'PO4':
        return '1 Phosphorus (P) + 4 Oxygen (O) atoms · -3 overall package charge';
      case 'NH4':
        return '1 Nitrogen (N) + 4 Hydrogen (H) atoms · +1 overall package charge';
      default:
        return 'Group of covalently bonded atoms with an overall charge';
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQuestion.correctIndex) {
      setQuestionScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < POLYATOMIC_QUESTIONS.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);
      setSelectedIonFormula(POLYATOMIC_QUESTIONS[nextIdx].highlightIon);
    } else {
      // Switch to build mode!
      setQuestionsFinished(true);
      setActiveTab('build');
    }
  };

  // Build handlers
  const handleCheckBuildBalance = () => {
    if (buildNetCharge === 0) {
      if (
        buildCationCount === currentBuild.expectedCationCount &&
        buildAnionCount === currentBuild.expectedAnionCount
      ) {
        setBuildBalanceFeedback(null);
        setBuildPhase('formula');
      } else {
        setBuildBalanceFeedback(
          'The charges cancel, but simplify to the smallest whole-number ratio!'
        );
      }
    } else {
      const sign = buildNetCharge > 0 ? `+${buildNetCharge}` : `${buildNetCharge}`;
      setBuildBalanceFeedback(
        `Not balanced yet: the charges sum to ${sign} (not 0). Calculate how many cations and anions are needed so the sum equals 0.`
      );
    }
  };

  const handleBuildFormulaSubmit = () => {
    if (!buildFormulaInput.trim()) {
      setBuildFormulaFeedback('Please write a formula.');
      return;
    }

    const res = evaluateFormulaSubmission(buildFormulaInput, cationItem, anionItem);
    setBuildFormulaIsCorrect(res.isCorrect);
    setBuildFormulaFeedback(res.feedback);

    if (res.isCorrect) {
      setBuildPhase('completed');
      setBuildsCompletedCount((c) => c + 1);
    }
  };

  const handleNextBuildChallenge = () => {
    if (buildIndex < POLYATOMIC_BUILD_CHALLENGES.length - 1) {
      setBuildIndex(buildIndex + 1);
      setBuildCationCount(1);
      setBuildAnionCount(1);
      setBuildPhase('balance');
      setBuildBalanceFeedback(null);
      setBuildFormulaInput('');
      setBuildFormulaFeedback(null);
      setBuildFormulaIsCorrect(false);
    } else {
      onChallengeComplete();
      onProceedToChallenge();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-1 space-y-2.5">
      {/* Top Banner with Section Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/60">
            Polyatomic Ions Lab
          </span>
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'questions'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Rules & Questions ({questionsFinished ? 6 : currentIndex + (isAnswered ? 1 : 0)}/6)</span>
            </button>
            <button
              type="button"
              disabled={!questionsFinished}
              onClick={() => {
                if (questionsFinished) setActiveTab('build');
              }}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'build'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : questionsFinished
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 opacity-60 cursor-not-allowed'
              }`}
              title={questionsFinished ? 'Build Compounds' : 'Answer all 6 questions in Step 1 to unlock'}
            >
              {questionsFinished ? <Hammer className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 text-slate-400" />}
              <span>2. Build Compounds ({buildsCompletedCount}/{POLYATOMIC_BUILD_CHALLENGES.length})</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          {activeTab === 'questions' ? 'Part 1 of 2: Essential Rules' : 'Part 2 of 2: Compound Synthesis'}
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* LEFT COLUMN: THE POLYATOMIC ION INSPECTOR WITH PROPER SUBSCRIPTS */}
        <div className="md:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3" />
                <span>Polyatomic Inspector</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Click to inspect</span>
            </div>

            {/* Quick Ion Switcher Tabs with Proper Subscripts */}
            <div className="grid grid-cols-6 gap-1 mb-2.5">
              {POLYATOMIC_IONS.map((ion) => (
                <button
                  key={ion.formula}
                  type="button"
                  onClick={() => setSelectedIonFormula(ion.formula)}
                  className={`py-1 text-[11px] font-mono font-bold rounded-lg border transition-all ${
                    selectedIonFormula === ion.formula
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={ion.name}
                >
                  {ion.formattedHtml}
                </button>
              ))}
            </div>

            {/* Bracketed Visual with PROPER SUBSCRIPTS: e.g. [SO₄]²⁻ */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Group of Atoms as a Single Unit
              </div>

              {/* Bracketed Visual with Subscripts */}
              <div className="flex items-center justify-center font-mono py-1">
                <span className="text-3xl text-slate-400 font-light">[</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 px-1.5 tracking-tight">
                  {toSubscripts(selectedIon.formula)}
                </span>
                <span className="text-3xl text-slate-400 font-light">]</span>
                <span
                  className={`text-base font-extrabold -mt-3 px-1 rounded ${
                    selectedIon.charge > 0 ? 'text-sky-700' : 'text-rose-700'
                  }`}
                >
                  {selectedIon.charge > 0
                    ? `+${selectedIon.charge}`
                    : `${selectedIon.charge}`}
                </span>
              </div>

              <div className="text-sm font-bold text-slate-800">
                {selectedIon.name} Ion ({selectedIon.formattedHtml})
              </div>
              <div
                className={`text-xs font-semibold ${
                  selectedIon.charge > 0 ? 'text-sky-700' : 'text-rose-700'
                }`}
              >
                Overall Ionic Charge: {selectedIon.charge > 0 ? `+${selectedIon.charge}` : `${selectedIon.charge}`}
              </div>

              {/* Composition */}
              <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/70 text-left mt-1 leading-tight">
                <span className="font-semibold text-slate-800 block text-[10px] uppercase tracking-wider mb-0.5">
                  Internal Composition:
                </span>
                {getIonAtomBreakdown(selectedIon.formula)}
              </div>
            </div>
          </div>

          {/* Golden Rules Box */}
          <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-1">
            <span className="font-bold text-[11px] text-indigo-900 block">
              💡 Essential Parentheses Rules:
            </span>
            <ul className="list-disc list-inside text-[11px] leading-tight text-indigo-900/90 space-y-0.5">
              <li>
                <strong>2 or more of the ion:</strong> Use parentheses: <strong>Mg(OH)₂</strong>, <strong>Al₂(SO₄)₃</strong>.
              </li>
              <li>
                <strong>Only 1 of the ion:</strong> NO parentheses: <strong>CaSO₄</strong>, <strong>NaNO₃</strong>.
              </li>
              <li>
                Never change the subscripts <em>inside</em> the formula: <strong>SO₄</strong> is permanent!
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: EITHER QUESTIONS OR BUILD SECTION */}
        <div className="md:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
          {activeTab === 'questions' ? (
            /* PART 1: QUESTIONS */
            <>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    {currentQuestion.title}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                    {currentQuestion.type}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium mb-1">
                  {currentQuestion.context}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Interactive Multiple Choice Options with Proper Subscripts */}
              <div className="space-y-2">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                    } else {
                      btnStyle = 'bg-white border-slate-100 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-2.5 text-xs text-left rounded-xl border transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="font-mono text-sm font-semibold">{option}</span>
                      {isAnswered && isCorrect && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Correct
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pedagogical Feedback */}
              {isAnswered && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border leading-tight ${
                    selectedOption === currentQuestion.correctIndex
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  {selectedOption === currentQuestion.correctIndex ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>{currentQuestion.explanation}</div>
                </div>
              )}

              {/* Next Question / Switch to Build Button */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Question {currentIndex + 1} of {POLYATOMIC_QUESTIONS.length}
                </span>

                {isAnswered ? (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                  >
                    <span>
                      {currentIndex < POLYATOMIC_QUESTIONS.length - 1
                        ? `Next Question (${currentIndex + 2}/6)`
                        : 'Next: Build Polyatomic Compounds!'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Select an answer to continue
                  </span>
                )}
              </div>
            </>
          ) : (
            /* PART 2: BUILD POLYATOMIC COMPOUNDS */
            <>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    Build Compound #{buildIndex + 1} of {POLYATOMIC_BUILD_CHALLENGES.length}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    Polyatomic Build
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Build {currentBuild.name}:
                </h3>
                <p className="text-xs text-slate-500">
                  Combine {cationItem.formattedHtml} and {anionItem.formattedHtml}. Calculate the charges mentally to make the equation equal 0!
                </p>
              </div>

              {/* Ion Steppers */}
              <div className="grid grid-cols-2 gap-2.5 py-1">
                {/* Cation */}
                <div className="p-2.5 bg-sky-50/70 border border-sky-200 rounded-xl text-center flex flex-col items-center">
                  <span className="text-[10px] text-sky-700 font-bold uppercase tracking-wider">
                    Cation
                  </span>
                  <div className="text-xl font-bold font-mono text-sky-900 my-0.5">
                    {cationItem.formattedHtml}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBuildCationCount(Math.max(1, buildCationCount - 1));
                        setBuildBalanceFeedback(null);
                      }}
                      disabled={buildPhase === 'completed'}
                      className="w-7 h-7 flex items-center justify-center font-bold bg-white border border-sky-300 rounded text-sky-900 shadow-2xs hover:bg-sky-100"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-base text-slate-800">
                      {buildCationCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setBuildCationCount(Math.min(5, buildCationCount + 1));
                        setBuildBalanceFeedback(null);
                      }}
                      disabled={buildPhase === 'completed'}
                      className="w-7 h-7 flex items-center justify-center font-bold bg-white border border-sky-300 rounded text-sky-900 shadow-2xs hover:bg-sky-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-sky-800 mt-1">
                    Charge: +{cationPositiveMag} each
                  </span>
                </div>

                {/* Anion */}
                <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl text-center flex flex-col items-center">
                  <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">
                    Polyatomic Anion
                  </span>
                  <div className="text-xl font-bold font-mono text-rose-900 my-0.5">
                    {anionItem.formattedHtml}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBuildAnionCount(Math.max(1, buildAnionCount - 1));
                        setBuildBalanceFeedback(null);
                      }}
                      disabled={buildPhase === 'completed'}
                      className="w-7 h-7 flex items-center justify-center font-bold bg-white border border-rose-300 rounded text-rose-900 shadow-2xs hover:bg-rose-100"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-base text-slate-800">
                      {buildAnionCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setBuildAnionCount(Math.min(5, buildAnionCount + 1));
                        setBuildBalanceFeedback(null);
                      }}
                      disabled={buildPhase === 'completed'}
                      className="w-7 h-7 flex items-center justify-center font-bold bg-white border border-rose-300 rounded text-rose-900 shadow-2xs hover:bg-rose-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-rose-800 mt-1">
                    Charge: -{anionNegativeMag} each
                  </span>
                </div>
              </div>

              {/* Live Charge Equation with Blank Sum */}
              <ChargeEquation
                cationSymbol={toSubscripts(cationItem.symbol)}
                cationCharge={cationPositiveMag}
                cationCount={buildCationCount}
                anionSymbol={toSubscripts(anionItem.symbol)}
                anionCharge={-anionNegativeMag}
                anionCount={buildAnionCount}
                showSum={buildPhase !== 'balance'}
              />

              {/* Action Area: Step 1 vs Step 2 */}
              {buildPhase === 'balance' ? (
                <div className="space-y-2 pt-1">
                  {buildBalanceFeedback && (
                    <div className="p-2.5 rounded-xl text-xs flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>{buildBalanceFeedback}</div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleCheckBuildBalance}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    Check Balance (Step 1)
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    ✓ Balanced to 0! Now write the formula using proper subscripts and parentheses:
                  </div>

                  <FormulaInput
                    value={buildFormulaInput}
                    onChange={setBuildFormulaInput}
                    onSubmit={handleBuildFormulaSubmit}
                    disabled={buildPhase === 'completed'}
                    placeholder="Type chemical formula..."
                  />

                  {buildFormulaFeedback && (
                    <div
                      className={`p-2 rounded-lg text-xs flex items-start gap-1.5 border ${
                        buildFormulaIsCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      {buildFormulaIsCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>{buildFormulaFeedback}</div>
                    </div>
                  )}

                  {buildPhase === 'formula' ? (
                    <button
                      type="button"
                      onClick={handleBuildFormulaSubmit}
                      className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                    >
                      Submit Formula
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextBuildChallenge}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                    >
                      <span>
                        {buildIndex < POLYATOMIC_BUILD_CHALLENGES.length - 1
                          ? 'Next Polyatomic Compound'
                          : 'Proceed to Mixed Challenge!'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
