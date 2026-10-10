import React, { useState } from 'react';
import {
  IonItem,
  calculateCorrectCompound,
  evaluateFormulaSubmission,
  formatIonSymbol,
  CURATED_PRACTICE_PAIRS,
  PracticePair,
} from '../data/chemistry';
import { ChargeEquation } from './ChargeEquation';
import { FormulaInput } from './FormulaInput';
import { CheckCircle2, AlertCircle, ArrowRight, Scale, Sparkles } from 'lucide-react';

interface BuildCompoundsProps {
  onCompoundMastered: () => void;
  compoundsBuilt: number;
  onProceedToPolyatomic?: () => void;
}

export const BuildCompounds: React.FC<BuildCompoundsProps> = ({
  onCompoundMastered,
  compoundsBuilt,
  onProceedToPolyatomic,
}) => {
  const [pairIndex, setPairIndex] = useState<number>(0);
  const currentPair: PracticePair = CURATED_PRACTICE_PAIRS[pairIndex];
  const { cation, anion, ratioLabel } = currentPair;

  // Quantities manipulated by student
  const [cationCount, setCationCount] = useState<number>(1);
  const [anionCount, setAnionCount] = useState<number>(1);

  // States: 'balancing' | 'formula' | 'completed'
  const [phase, setPhase] = useState<'balancing' | 'formula' | 'completed'>('balancing');
  const [balanceFeedback, setBalanceFeedback] = useState<string | null>(null);

  // Formula input
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [formulaSubmitted, setFormulaSubmitted] = useState<boolean>(false);
  const [formulaFeedback, setFormulaFeedback] = useState<string | null>(null);
  const [formulaIsCorrect, setFormulaIsCorrect] = useState<boolean>(false);

  const cationPositiveMagnitude = Math.abs(cation.charge);
  const anionNegativeMagnitude = Math.abs(anion.charge);

  const totalPositive = cationCount * cationPositiveMagnitude;
  const totalNegative = anionCount * anionNegativeMagnitude;
  const netCharge = totalPositive - totalNegative;

  const correctSolution = calculateCorrectCompound(cation, anion);

  const handleBalanceCheck = () => {
    if (netCharge === 0) {
      // Check if it's the simplest ratio or just a multiple
      if (cationCount === correctSolution.cationCount && anionCount === correctSolution.anionCount) {
        setBalanceFeedback(null);
        setPhase('formula');
      } else {
        setBalanceFeedback(
          `The charges balance (+${totalPositive} and -${totalNegative}), but check if you can simplify this to a smaller whole-number ratio!`
        );
      }
    } else {
      const sign = netCharge > 0 ? `+${netCharge}` : `${netCharge}`;
      setBalanceFeedback(
        `Not balanced yet: overall charge is ${sign}. Total positive must equal total negative (net charge = 0).`
      );
    }
  };

  const handleFormulaSubmit = () => {
    if (!formulaInput.trim()) {
      setFormulaFeedback('Please enter the formula for this compound.');
      setFormulaSubmitted(true);
      setFormulaIsCorrect(false);
      return;
    }

    const evaluation = evaluateFormulaSubmission(formulaInput, cation, anion);
    setFormulaSubmitted(true);
    setFormulaIsCorrect(evaluation.isCorrect);
    setFormulaFeedback(evaluation.feedback);

    if (evaluation.isCorrect) {
      setPhase('completed');
      onCompoundMastered();
    }
  };

  const loadPairAtIndex = (idx: number) => {
    setPairIndex(idx);
    setCationCount(1);
    setAnionCount(1);
    setPhase('balancing');
    setBalanceFeedback(null);
    setFormulaInput('');
    setFormulaSubmitted(false);
    setFormulaFeedback(null);
    setFormulaIsCorrect(false);
  };

  const handleNextChallenge = () => {
    const nextIdx = (pairIndex + 1) % CURATED_PRACTICE_PAIRS.length;
    loadPairAtIndex(nextIdx);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-1 space-y-3">
      {/* Compact Top Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-2xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/60">
            Compound #{pairIndex + 1} of {CURATED_PRACTICE_PAIRS.length}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {cation.name} & {anion.name}
          </h2>
          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
            ({ratioLabel})
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70">
            <Scale className="w-3.5 h-3.5" />
            <span>Built: {compoundsBuilt}</span>
          </div>
        </div>
      </div>

      {/* Main Single-Screen Responsive 2-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
        {/* Left Column: Cation / Anion Steppers + Compact Balance Scale */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
          {/* Side-by-side Ion Manipulator Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* Cation Card */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 flex flex-col items-center shadow-2xs">
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                Cation (Positive)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-900 my-1">
                {cation.formattedHtml}
              </div>
              <div className="text-[11px] text-sky-700 truncate max-w-[120px] mb-2 font-medium">
                {cation.name}
              </div>

              {/* Stepper Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCationCount(Math.max(1, cationCount - 1));
                    setBalanceFeedback(null);
                  }}
                  disabled={phase === 'completed'}
                  className="w-8 h-8 flex items-center justify-center font-bold text-lg bg-white border border-sky-300 rounded-lg text-sky-900 shadow-2xs hover:bg-sky-100 active:scale-95 disabled:opacity-40 transition-all"
                  aria-label="Decrease cation count"
                >
                  -
                </button>
                <div className="w-8 text-center font-mono font-bold text-xl text-slate-800">
                  {cationCount}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCationCount(Math.min(6, cationCount + 1));
                    setBalanceFeedback(null);
                  }}
                  disabled={phase === 'completed'}
                  className="w-8 h-8 flex items-center justify-center font-bold text-lg bg-white border border-sky-300 rounded-lg text-sky-900 shadow-2xs hover:bg-sky-100 active:scale-95 disabled:opacity-40 transition-all"
                  aria-label="Increase cation count"
                >
                  +
                </button>
              </div>

              <div className="text-[11px] font-mono text-sky-800 font-semibold mt-2">
                Charge: +{cationPositiveMagnitude} each
              </div>
            </div>

            {/* Anion Card */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 flex flex-col items-center shadow-2xs">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                Anion (Negative)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-900 my-1">
                {anion.formattedHtml}
              </div>
              <div className="text-[11px] text-rose-700 truncate max-w-[120px] mb-2 font-medium">
                {anion.name}
              </div>

              {/* Stepper Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAnionCount(Math.max(1, anionCount - 1));
                    setBalanceFeedback(null);
                  }}
                  disabled={phase === 'completed'}
                  className="w-8 h-8 flex items-center justify-center font-bold text-lg bg-white border border-rose-300 rounded-lg text-rose-900 shadow-2xs hover:bg-rose-100 active:scale-95 disabled:opacity-40 transition-all"
                  aria-label="Decrease anion count"
                >
                  -
                </button>
                <div className="w-8 text-center font-mono font-bold text-xl text-slate-800">
                  {anionCount}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAnionCount(Math.min(6, anionCount + 1));
                    setBalanceFeedback(null);
                  }}
                  disabled={phase === 'completed'}
                  className="w-8 h-8 flex items-center justify-center font-bold text-lg bg-white border border-rose-300 rounded-lg text-rose-900 shadow-2xs hover:bg-rose-100 active:scale-95 disabled:opacity-40 transition-all"
                  aria-label="Increase anion count"
                >
                  +
                </button>
              </div>

              <div className="text-[11px] font-mono text-rose-800 font-semibold mt-2">
                Charge: -{anionNegativeMagnitude} each
              </div>
            </div>
          </div>

          {/* Charge Summation Equation (Sum left blank while balancing) */}
          <ChargeEquation
            cationSymbol={cation.symbol}
            cationCharge={cationPositiveMagnitude}
            cationCount={cationCount}
            anionSymbol={anion.symbol}
            anionCharge={-anionNegativeMagnitude}
            anionCount={anionCount}
            showSum={phase !== 'balancing'}
          />
        </div>

        {/* Right Column: Dynamic Action Panel (Balancing vs Formula Entry) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between min-h-[300px]">
          {phase === 'balancing' ? (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Step 1: Balance to Zero
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  How many ions are needed to balance the compound?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust cations (+{cationPositiveMagnitude}) and anions (-{anionNegativeMagnitude}). Calculate the sum yourself to determine if they equal 0!
                </p>
              </div>

              {balanceFeedback && (
                <div className="p-3 rounded-xl text-xs flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>{balanceFeedback}</div>
                </div>
              )}

              <button
                type="button"
                onClick={handleBalanceCheck}
                className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                I think this is balanced!
              </button>
            </div>
          ) : (
            /* Phase 2: Enter Chemical Formula */
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Balanced! <strong>{cationCount} {cation.name}</strong> and <strong>{anionCount} {anion.name}</strong>.
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                  Step 2: Write Formula
                </span>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Write the neutral chemical formula:
                </label>
                <FormulaInput
                  value={formulaInput}
                  onChange={setFormulaInput}
                  onSubmit={handleFormulaSubmit}
                  disabled={phase === 'completed'}
                  placeholder="Type chemical formula..."
                />
              </div>

              {phase !== 'completed' ? (
                <button
                  type="button"
                  onClick={handleFormulaSubmit}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  Submit Formula
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleNextChallenge}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                  >
                    <span>Build Next Compound</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {compoundsBuilt >= 3 && onProceedToPolyatomic && (
                    <button
                      type="button"
                      onClick={onProceedToPolyatomic}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Proceed to Step 3: Polyatomic Ions Lab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {formulaSubmitted && formulaFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                    formulaIsCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  {formulaIsCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>{formulaFeedback}</div>
                </div>
              )}
            </div>
          )}

          {/* Quick ratio tip */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ratio type: {ratioLabel}</span>
            <button
              type="button"
              onClick={handleNextChallenge}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Skip →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
