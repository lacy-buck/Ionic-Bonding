import React, { useState } from 'react';
import { MAIN_GROUP_ELEMENTS, formatIonSymbol } from '../data/chemistry';
import { ChemicalElement } from '../types';
import { LewisDot } from './LewisDot';
import { CheckCircle2, Sparkles, ArrowRight, HelpCircle, RotateCcw, Check, Trophy } from 'lucide-react';

interface IonChargePracticeProps {
  onCorrectAnswer: () => void;
  streak: number;
  totalCorrect: number;
  onRoundComplete?: () => void;
  onProceedToBuild?: () => void;
}

// Function to generate a diverse, randomized set of exactly 6 elements across different charges
function generateMixedSixElements(): ChemicalElement[] {
  // Charge categories: +1, +2, +3, -1, -2, -3
  const plus1 = MAIN_GROUP_ELEMENTS.filter((e) => e.typicalCharge === 1);
  const plus2 = MAIN_GROUP_ELEMENTS.filter((e) => e.typicalCharge === 2);
  const plus3 = MAIN_GROUP_ELEMENTS.filter((e) => e.typicalCharge === 3);
  const minus1 = MAIN_GROUP_ELEMENTS.filter((e) => e.typicalCharge === -1);
  const minus2 = MAIN_GROUP_ELEMENTS.filter((e) => e.typicalCharge === -2);
  const minus3 = MAIN_GROUP_ELEMENTS.filter((e) => e.typicalCharge === -3);

  const pickRandom = (arr: ChemicalElement[]) => arr[Math.floor(Math.random() * arr.length)];

  const selected: ChemicalElement[] = [
    pickRandom(plus1),
    pickRandom(plus2),
    pickRandom(plus3),
    pickRandom(minus1),
    pickRandom(minus2),
    pickRandom(minus3),
  ];

  // Shuffle the selected 6 elements so cations & anions and charges are thoroughly mixed
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected;
}

export const IonChargePractice: React.FC<IonChargePracticeProps> = ({
  onCorrectAnswer,
  streak,
  totalCorrect,
  onRoundComplete,
  onProceedToBuild,
}) => {
  // Session pool of 6 mixed elements
  const [elements, setElements] = useState<ChemicalElement[]>(() => generateMixedSixElements());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRoundComplete, setIsRoundComplete] = useState<boolean>(false);

  const currentElement = elements[currentIndex];

  // Part 1: Valence Electrons state
  const [valenceInput, setValenceInput] = useState<string>('');
  const [valenceAttempts, setValenceAttempts] = useState<number>(0);
  const [valenceSolved, setValenceSolved] = useState<boolean>(false);
  const [valenceFeedback, setValenceFeedback] = useState<string>('');

  // Part 2: Ion Charge state
  const [chargeInput, setChargeInput] = useState<string>('');
  const [chargeAttempts, setChargeAttempts] = useState<number>(0);
  const [chargeSolved, setChargeSolved] = useState<boolean>(false);
  const [chargeFeedback, setChargeFeedback] = useState<string>('');

  const parseCharge = (raw: string): number | null => {
    const s = raw.trim().replace(/\s+/g, '');
    if (s === '+1' || s === '1+' || s === '1' || s === '+') return 1;
    if (s === '+2' || s === '2+' || s === '2') return 2;
    if (s === '+3' || s === '3+' || s === '3') return 3;
    if (s === '-1' || s === '1-' || s === '-') return -1;
    if (s === '-2' || s === '2-' || s === '-2') return -2;
    if (s === '-3' || s === '3-' || s === '-3') return -3;
    return null;
  };

  // Submit Part 1: Valence electrons
  const handleValenceSubmit = (numOverride?: number) => {
    const val = numOverride !== undefined ? numOverride : parseInt(valenceInput.trim(), 10);

    if (isNaN(val) || val < 1 || val > 8) {
      setValenceFeedback('Select valence electrons (1 to 8).');
      return;
    }

    const newAttempts = valenceAttempts + 1;
    setValenceAttempts(newAttempts);

    if (val === currentElement.valenceElectrons) {
      setValenceSolved(true);
      setValenceFeedback(
        `Correct! Neutral ${currentElement.name} has ${currentElement.valenceElectrons} valence e⁻ (Group ${currentElement.group}).`
      );
    } else {
      const lastDigit = currentElement.group > 10 ? currentElement.group - 10 : currentElement.group;
      if (newAttempts === 1) {
        setValenceFeedback(
          `Hint: Check Group ${currentElement.group} on the periodic table.`
        );
      } else {
        setValenceFeedback(
          `Remember: For Group ${currentElement.group}, the number of valence electrons is ${lastDigit}.`
        );
      }
    }
  };

  // Submit Part 2: Ion Charge
  const handleChargeSubmit = (chargeOverride?: string) => {
    const valStr = chargeOverride !== undefined ? chargeOverride : chargeInput;
    if (!valStr.trim()) {
      setChargeFeedback('Please enter or select a charge.');
      return;
    }

    const parsed = parseCharge(valStr);
    if (parsed === null) {
      setChargeFeedback('Enter a valid charge like +1, 2+, -2, etc.');
      return;
    }

    const newAttempts = chargeAttempts + 1;
    setChargeAttempts(newAttempts);

    if (parsed === currentElement.typicalCharge) {
      setChargeSolved(true);
      const isMetal = currentElement.typicalCharge > 0;
      const electronCount = Math.abs(currentElement.typicalCharge);
      const signStr = currentElement.typicalCharge > 0 ? `+${currentElement.typicalCharge}` : `${currentElement.typicalCharge}`;

      setChargeFeedback(
        `Correct! ${currentElement.name} (${currentElement.type}) ${
          isMetal ? `loses ${electronCount} e⁻` : `gains ${electronCount} e⁻ for 8 octet`
        }, forming ${signStr} (${formatIonSymbol(currentElement.symbol, currentElement.typicalCharge)}).`
      );
      onCorrectAnswer();
    } else {
      const isMetal = currentElement.typicalCharge > 0;
      const needed = 8 - currentElement.valenceElectrons;
      if (newAttempts === 1) {
        setChargeFeedback(
          `Hint: ${currentElement.name} has ${currentElement.valenceElectrons} valence e⁻. Does it lose ${currentElement.valenceElectrons} e⁻ or gain ${needed} e⁻ to reach 8?`
        );
      } else {
        setChargeFeedback(
          `Remember: Electrons carry -1 negative charge. ${isMetal ? 'Losing negative e⁻ leaves a positive charge.' : 'Gaining negative e⁻ creates a negative charge.'}`
        );
      }
    }
  };

  // Move to next question or complete round
  const handleNext = () => {
    if (currentIndex < elements.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setValenceInput('');
      setValenceAttempts(0);
      setValenceSolved(false);
      setValenceFeedback('');
      setChargeInput('');
      setChargeAttempts(0);
      setChargeSolved(false);
      setChargeFeedback('');
    } else {
      setIsRoundComplete(true);
      onRoundComplete?.();
    }
  };

  // Restart with a fresh set of 6 mixed elements
  const handleRestartNewRound = () => {
    setElements(generateMixedSixElements());
    setCurrentIndex(0);
    setIsRoundComplete(false);
    setValenceInput('');
    setValenceAttempts(0);
    setValenceSolved(false);
    setValenceFeedback('');
    setChargeInput('');
    setChargeAttempts(0);
    setChargeSolved(false);
    setChargeFeedback('');
  };

  if (isRoundComplete) {
    return (
      <div className="w-full max-w-4xl mx-auto py-2 animate-in fade-in duration-200">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto shadow-2xs">
            <Trophy className="w-6 h-6" />
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Set Complete!
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              6 of 6 Mixed Elements Mastered
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You found valence electrons and predicted stable ion charges across a mixed variety of cations and anions!
            </p>
          </div>

          {/* Review Grid of 6 Elements */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left text-xs max-w-2xl mx-auto">
            {elements.map((elem) => {
              const isMetal = elem.typicalCharge > 0;
              return (
                <div
                  key={elem.symbol}
                  className={`p-2.5 rounded-xl border ${
                    isMetal ? 'bg-sky-50/70 border-sky-200' : 'bg-rose-50/70 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{elem.name}</span>
                    <span className="font-mono font-extrabold text-sm">
                      {formatIonSymbol(elem.symbol, elem.typicalCharge)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Group {elem.group} · {elem.valenceElectrons} valence e⁻
                  </div>
                  <div className={`text-[11px] font-semibold mt-0.5 ${isMetal ? 'text-sky-700' : 'text-rose-700'}`}>
                    Charge: {elem.typicalCharge > 0 ? `+${elem.typicalCharge}` : elem.typicalCharge} ({elem.type})
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onProceedToBuild && (
              <button
                type="button"
                onClick={onProceedToBuild}
                className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                <span>Proceed to Step 2: Build Compounds</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleRestartNewRound}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Another Set (6 Elements)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isMetal = currentElement.typicalCharge > 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-1 space-y-2.5">
      {/* Compact Top Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2 shadow-2xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/60">
            Element {currentIndex + 1} of {elements.length}
          </span>
          <div className="flex items-center gap-1">
            {elements.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx < currentIndex
                    ? 'w-3.5 bg-emerald-500'
                    : idx === currentIndex
                    ? 'w-5 bg-indigo-600'
                    : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-semibold">
          {totalCorrect >= 6 && onProceedToBuild && (
            <button
              type="button"
              onClick={onProceedToBuild}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs transition-colors"
              title="You have 6 correct! Proceed to Build Compounds"
            >
              <span>Move to Step 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="text-slate-600">
            Correct: <span className="font-mono text-indigo-600">{totalCorrect}</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 text-xs">
              <Sparkles className="w-3 h-3" />
              <span>Streak: {streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Option Banner when 6 Correct Milestone Reached */}
      {totalCorrect >= 6 && (
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-emerald-950">
              🎉 <strong>Milestone Reached! ({totalCorrect} correct)</strong> You can now move on to Step 2: Build Compounds, or keep practicing here.
            </span>
          </div>
          {onProceedToBuild && (
            <button
              type="button"
              onClick={onProceedToBuild}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <span>Move to Step 2: Build Compounds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 2-Column Responsive Layout: Diagram on Left, Questions on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* LEFT COLUMN: THE DIAGRAM */}
        <div className="md:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between items-center text-center space-y-3">
          {/* Element Title & Meta */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isMetal ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {currentElement.type}
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500">
                Group {currentElement.group} · Period {currentElement.period}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentElement.name} ({currentElement.symbol})
            </h3>
          </div>

          {/* Lewis Dot Diagram Visual */}
          <div className="w-full py-2 px-3 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
            <LewisDot
              symbol={currentElement.symbol}
              valenceElectrons={currentElement.valenceElectrons}
              hideValenceDots={!valenceSolved}
              size="md"
              label={
                chargeSolved
                  ? `${currentElement.name} Ion (${formatIonSymbol(currentElement.symbol, currentElement.typicalCharge)})`
                  : valenceSolved
                  ? `Neutral Atom (${currentElement.valenceElectrons} valence e⁻)`
                  : `Neutral Atom`
              }
              subtext={
                chargeSolved
                  ? `Net Charge: ${currentElement.typicalCharge > 0 ? `+${currentElement.typicalCharge}` : currentElement.typicalCharge}`
                  : `Group ${currentElement.group}`
              }
            />

            {/* Sub-label under Lewis Dot */}
            <div className="mt-1 text-[11px] font-medium">
              {!valenceSolved ? (
                <span className="text-slate-500">
                  Valence dots hidden — count outer electrons from Group {currentElement.group}
                </span>
              ) : !chargeSolved ? (
                <span className="text-emerald-700 font-semibold">
                  ✓ {currentElement.valenceElectrons} valence electrons revealed
                </span>
              ) : (
                <span className="text-indigo-700 font-semibold font-mono">
                  ✓ Formed {formatIonSymbol(currentElement.symbol, currentElement.typicalCharge)} ion
                </span>
              )}
            </div>
          </div>

          {/* Quick Properties Table Bar */}
          <div className="w-full grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Group</span>
              <span className="font-mono font-bold text-slate-800 text-xs">{currentElement.group}</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Period</span>
              <span className="font-mono font-bold text-slate-800 text-xs">{currentElement.period}</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Atomic #</span>
              <span className="font-mono font-bold text-slate-800 text-xs">{currentElement.atomicNumber}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE QUESTIONS */}
        <div className="md:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
          {/* PART 1: VALENCE ELECTRONS */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                <span>Part 1: Valence Electrons</span>
              </span>
              {valenceSolved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Solved
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-tight">
              How many valence electrons does a neutral <strong>{currentElement.name}</strong> atom have?
            </p>

            {/* Valence selector (1 through 8 buttons) */}
            <div className="grid grid-cols-8 gap-1 pt-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setValenceInput(num.toString());
                    if (!valenceSolved) handleValenceSubmit(num);
                  }}
                  disabled={valenceSolved}
                  className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                    valenceInput === num.toString()
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 disabled:opacity-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Feedback for Part 1 */}
            {valenceFeedback && (
              <div
                className={`p-2 rounded-lg text-xs flex items-start gap-1.5 border leading-tight ${
                  valenceSolved
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {valenceSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>{valenceFeedback}</div>
              </div>
            )}
          </div>

          {/* PART 2: ION CHARGE */}
          <div
            className={`p-3 rounded-xl border transition-all space-y-2 ${
              valenceSolved
                ? 'bg-slate-50/80 border-slate-200'
                : 'bg-slate-100/40 border-slate-200 opacity-60 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
                <span>Part 2: Predict Ion Charge</span>
              </span>
              {chargeSolved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Solved
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-tight">
              What charge will <strong>{currentElement.name}</strong> have when it forms an ion?
            </p>

            {/* Quick Charge Buttons (+1, +2, +3, -3, -2, -1) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
              {['+1', '+2', '+3', '-3', '-2', '-1'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setChargeInput(c);
                    if (!chargeSolved && valenceSolved) handleChargeSubmit(c);
                  }}
                  disabled={!valenceSolved || chargeSolved}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                    chargeInput === c
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 disabled:opacity-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Input & Action Button */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <input
                type="text"
                value={chargeInput}
                onChange={(e) => setChargeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!chargeSolved) handleChargeSubmit();
                    else handleNext();
                  }
                }}
                disabled={!valenceSolved || chargeSolved}
                placeholder="e.g. +2, 2-"
                className="w-28 text-center text-xs font-mono font-bold px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:border-indigo-600 outline-none disabled:bg-slate-100"
              />

              {!chargeSolved ? (
                <button
                  type="button"
                  onClick={() => handleChargeSubmit()}
                  disabled={!valenceSolved}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors disabled:opacity-50"
                >
                  Check Charge
                </button>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
                  >
                    <span>{currentIndex < elements.length - 1 ? `Practice Next (${currentIndex + 2}/6)` : 'View Results'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {totalCorrect >= 6 && onProceedToBuild && (
                    <button
                      type="button"
                      onClick={onProceedToBuild}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                    >
                      <span>Move to Step 2 →</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Feedback for Part 2 */}
            {chargeFeedback && (
              <div
                className={`p-2 rounded-lg text-xs flex items-start gap-1.5 border leading-tight ${
                  chargeSolved
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {chargeSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>{chargeFeedback}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
