import React from 'react';

interface ChargeEquationProps {
  cationSymbol: string;
  cationCharge: number; // e.g. 2 for Mg2+
  cationCount: number;
  anionSymbol: string;
  anionCharge: number; // e.g. -1 for Cl-
  anionCount: number;
  showSum?: boolean; // When false, the sum is left blank so students must calculate it
}

export const ChargeEquation: React.FC<ChargeEquationProps> = ({
  cationSymbol,
  cationCharge,
  cationCount,
  anionSymbol,
  anionCharge,
  anionCount,
  showSum = false,
}) => {
  const cationPositiveMag = Math.abs(cationCharge);
  const anionNegativeMag = Math.abs(anionCharge);

  const totalPositive = cationCount * cationPositiveMag;
  const totalNegative = anionCount * anionNegativeMag;
  const netCharge = totalPositive - totalNegative;
  const isBalanced = netCharge === 0;

  // Build individual charge tokens:
  // e.g. cationTokens = ['(+2)'] or ['(+1)', '(+1)']
  const cationTokens = Array.from({ length: cationCount }, () => `(+${cationPositiveMag})`);
  // e.g. anionTokens = ['(-1)', '(-1)']
  const anionTokens = Array.from({ length: anionCount }, () => `(-${anionNegativeMag})`);

  return (
    <div className="w-full bg-slate-50/90 border border-slate-200/90 rounded-xl p-3 sm:p-3.5 space-y-2">
      {/* Header with status badge */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
          <span>Charge Summation Equation</span>
        </span>
        {showSum ? (
          <span
            className={`font-mono font-bold px-2 py-0.5 rounded-md text-[11px] transition-colors ${
              isBalanced
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
                : 'bg-amber-100 text-amber-800 border border-amber-300/80'
            }`}
          >
            {isBalanced ? 'Net Charge = 0 (Balanced)' : `Net = ${netCharge > 0 ? `+${netCharge}` : netCharge} (≠ 0)`}
          </span>
        ) : (
          <span className="font-mono font-semibold px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-600 border border-slate-200">
            Sum: [ ? ] Calculate mentally
          </span>
        )}
      </div>

      {/* Main Visual Equation Strip with Blank Sum */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 shadow-2xs overflow-x-auto">
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 font-mono font-bold text-xs sm:text-sm min-h-[44px]">
          {/* Cation Tokens */}
          {cationTokens.map((token, idx) => (
            <React.Fragment key={`cat-tok-${idx}`}>
              {idx > 0 && <span className="text-slate-400 font-bold px-0.5">+</span>}
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-sky-600 font-sans font-bold -mb-0.5">{cationSymbol}</span>
                <span className="px-2 py-1 bg-sky-50 border border-sky-300 text-sky-800 rounded-md shadow-2xs">
                  {token}
                </span>
              </div>
            </React.Fragment>
          ))}

          {/* Plus sign between cations and anions */}
          <span className="text-slate-400 font-bold text-sm sm:text-base px-1">+</span>

          {/* Anion Tokens */}
          {anionTokens.map((token, idx) => (
            <React.Fragment key={`an-tok-${idx}`}>
              {idx > 0 && <span className="text-slate-400 font-bold px-0.5">+</span>}
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-rose-600 font-sans font-bold -mb-0.5">{anionSymbol}</span>
                <span className="px-2 py-1 bg-rose-50 border border-rose-300 text-rose-800 rounded-md shadow-2xs">
                  {token}
                </span>
              </div>
            </React.Fragment>
          ))}

          {/* Equals Sign */}
          <span className="text-slate-400 font-bold text-sm sm:text-base px-1">=</span>

          {/* Blank Sum Slot vs Revealed Sum */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-400 font-sans font-semibold -mb-0.5">
              {showSum ? 'Total' : 'Net'}
            </span>
            {showSum ? (
              <span
                className={`px-2.5 py-1 rounded-md border text-sm font-extrabold transition-colors shadow-2xs ${
                  isBalanced
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : 'bg-amber-100 border-amber-400 text-amber-800'
                }`}
              >
                {netCharge > 0 ? `+${netCharge}` : `${netCharge}`}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 font-bold text-sm">
                ___
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Helper text without spoiling the answer */}
      <div className="text-center text-[11px] text-slate-500">
        {showSum ? (
          <span>
            {isBalanced
              ? '✓ Total positive and total negative charges cancel to 0.'
              : `Total positive (+${totalPositive}) and negative (-${totalNegative}) sum to ${
                  netCharge > 0 ? `+${netCharge}` : netCharge
                }.`}
          </span>
        ) : (
          <span>
            Think: add the positive and negative charges together. Does your combination add up to exactly <strong>0</strong>?
          </span>
        )}
      </div>
    </div>
  );
};
