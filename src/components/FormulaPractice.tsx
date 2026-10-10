import React, { useState, useMemo } from 'react';
import { CURATED_PRACTICE_PAIRS, PracticePair, evaluateFormulaSubmission, calculateCorrectCompound } from '../data/chemistry';
import { FormulaInput } from './FormulaInput';
import { CheckCircle2, HelpCircle, ArrowRight, Sparkles, Lock } from 'lucide-react';

interface FormulaPracticeProps {
  onFormulaSolved: () => void;
  streak: number;
  totalSolved: number;
  onProceedToHomework?: () => void;
}

type FilterCategory = 'all' | 'monatomic' | 'polyatomic' | 'tricky';

export const FormulaPractice: React.FC<FormulaPracticeProps> = ({
  onFormulaSolved,
  streak,
  totalSolved,
  onProceedToHomework,
}) => {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Filter pairs
  const filteredPairs = useMemo(() => {
    if (filter === 'monatomic') {
      return CURATED_PRACTICE_PAIRS.filter(p => p.category === 'monatomic');
    }
    if (filter === 'polyatomic') {
      return CURATED_PRACTICE_PAIRS.filter(p => p.category === 'polyatomic');
    }
    if (filter === 'tricky') {
      return CURATED_PRACTICE_PAIRS.filter(p => 
        p.ratioLabel.includes('2:3') || 
        p.ratioLabel.includes('3:2') || 
        p.ratioLabel.includes('(2+ and 2-)') ||
        p.ratioLabel.includes('(3+ and 3-)') ||
        p.ratioLabel.includes('parentheses')
      );
    }
    return CURATED_PRACTICE_PAIRS;
  }, [filter]);

  const activeIndex = currentIndex % (filteredPairs.length || 1);
  const currentPair: PracticePair = filteredPairs[activeIndex] || CURATED_PRACTICE_PAIRS[0];

  const [inputVal, setInputVal] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);

  const correctComp = calculateCorrectCompound(currentPair.cation, currentPair.anion);

  const handleSubmit = () => {
    if (!inputVal.trim()) {
      setFeedback('Please write a formula before submitting.');
      setIsSubmitted(true);
      setIsCorrect(false);
      return;
    }

    const res = evaluateFormulaSubmission(inputVal, currentPair.cation, currentPair.anion);
    setIsSubmitted(true);
    setIsCorrect(res.isCorrect);
    setFeedback(res.feedback);
    setAttempts(attempts + 1);

    if (res.isCorrect) {
      onFormulaSolved();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredPairs.length);
    setInputVal('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setFeedback('');
    setAttempts(0);
  };

  const handleFilterChange = (newFilter: FilterCategory) => {
    setFilter(newFilter);
    setCurrentIndex(0);
    setInputVal('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setFeedback('');
    setAttempts(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-1 space-y-2.5">
      {/* Top Bar with Filter and Stats */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => handleFilterChange('monatomic')}
            className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
              filter === 'monatomic' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monatomic
          </button>
          <button
            onClick={() => handleFilterChange('polyatomic')}
            className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
              filter === 'polyatomic' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Polyatomic
          </button>
          <button
            onClick={() => handleFilterChange('tricky')}
            className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
              filter === 'tricky' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tricky Ratios
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold text-slate-600 pl-1">
            Solved: <strong className="font-mono text-indigo-600">{totalSolved}</strong>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Streak: {streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Responsive Layout: Diagram/Ions on Left, Questions on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* LEFT COLUMN: THE DIAGRAM / IONS */}
        <div className="md:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between items-center text-center space-y-3">
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
              Problem {activeIndex + 1} of {filteredPairs.length}
            </span>
            <span className="text-xs font-medium text-slate-500 truncate max-w-[170px]">
              {currentPair.ratioLabel}
            </span>
          </div>

          {/* Side-by-side Ion Display */}
          <div className="w-full py-3 px-2 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-around">
            {/* Cation */}
            <div className="text-center">
              <span className="text-[10px] text-sky-700 font-bold uppercase tracking-wider block mb-0.5">
                Cation (+)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-900">
                {currentPair.cation.formattedHtml}
              </div>
              <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[90px]">
                {currentPair.cation.name}
              </span>
            </div>

            <div className="text-xl font-bold text-slate-300 px-1">+</div>

            {/* Anion */}
            <div className="text-center">
              <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block mb-0.5">
                Anion (-)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-900">
                {currentPair.anion.formattedHtml}
              </div>
              <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[90px]">
                {currentPair.anion.name}
              </span>
            </div>
          </div>

          {/* Educational Breakdown / Summary */}
          {isCorrect ? (
            <div className="w-full bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 text-xs text-left space-y-0.5 text-emerald-950">
              <div className="font-bold text-[11px] text-emerald-800">Why this formula balances:</div>
              <div className="text-[11px]">
                • {correctComp.cationCount} × ({currentPair.cation.formattedHtml}) = +{correctComp.totalPositiveCharge}
              </div>
              <div className="text-[11px]">
                • {correctComp.anionCount} × ({currentPair.anion.formattedHtml}) = -{correctComp.totalNegativeCharge}
              </div>
              <div className="font-mono text-emerald-800 font-bold text-[11px] pt-0.5">
                Net Charge = 0 (Neutral)
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-500 text-left">
              <div className="font-semibold text-slate-700 text-[11px] mb-0.5">Objective:</div>
              <p className="text-[11px] leading-tight">
                Combine positive cations and negative anions so the sum of all charges equals 0. Use subscripts for counts &gt; 1.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: THE QUESTIONS & INPUT */}
        <div className="md:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Formula Writing
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              Write the empirical formula for {currentPair.cation.name} {currentPair.anion.name}:
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cation symbol comes first, followed by anion. Use parentheses only around polyatomic ions with subscript &gt; 1.
            </p>
          </div>

          {/* Formula Input */}
          <div className="space-y-2">
            <FormulaInput
              value={inputVal}
              onChange={setInputVal}
              onSubmit={handleSubmit}
              disabled={isCorrect}
              placeholder="Type chemical formula..."
            />

            <div className="pt-1">
              {!isCorrect ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Submit Formula
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                  >
                    <span>Next Problem</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {onProceedToHomework && (
                    <button
                      type="button"
                      onClick={onProceedToHomework}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                      title="Proceed to Final Homework assignment and PDF export."
                    >
                      <span>Final Homework & PDF</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Feedback Area */}
          {isSubmitted && feedback && (
            <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border leading-tight ${
              isCorrect 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block font-semibold mb-0.5">
                  {isCorrect ? 'Correct!' : `Attempt #${attempts}`}
                </strong>
                {feedback}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
