import React from 'react';

interface ChargeBalanceScaleProps {
  positiveCharge: number;
  negativeCharge: number; // positive number representing magnitude of negative charge, e.g. 2 for -2
  showDetails?: boolean;
  compact?: boolean;
}

export const ChargeBalanceScale: React.FC<ChargeBalanceScaleProps> = ({
  positiveCharge,
  negativeCharge,
  showDetails = true,
  compact = false,
}) => {
  const netCharge = positiveCharge - negativeCharge;
  const isBalanced = netCharge === 0 && positiveCharge > 0;
  const isEmpty = positiveCharge === 0 && negativeCharge === 0;

  // Max tilt angle is ±12 degrees
  const tiltAngle = Math.max(-12, Math.min(12, -netCharge * 4));

  return (
    <div className={`w-full bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center ${
      compact ? 'p-2.5' : 'p-4 sm:p-5'
    }`}>
      <div className={`flex items-center justify-between w-full text-slate-500 font-medium ${
        compact ? 'text-[11px] mb-1' : 'text-xs mb-3'
      }`}>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
          <span>Cations (+{positiveCharge})</span>
        </span>
        <span className="flex items-center gap-1">
          <span>Anions (-{negativeCharge})</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
        </span>
      </div>

      {/* SVG Balance Scale Visualizer */}
      <div className={`w-full max-w-sm relative flex items-center justify-center ${
        compact ? 'h-24' : 'h-32'
      }`}>
        <svg viewBox="0 0 300 130" className="w-full h-full overflow-visible">
          {/* Base Stand */}
          <polygon points="135,120 165,120 155,75 145,75" fill="#64748b" />
          <rect x="120" y="120" width="60" height="6" rx="2" fill="#475569" />
          {/* Fulcrum Point */}
          <circle cx="150" cy="75" r="5" fill="#334155" />

          {/* Tilting Lever Beam */}
          <g
            style={{
              transformOrigin: '150px 75px',
              transform: `rotate(${isEmpty ? 0 : tiltAngle}deg)`,
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* The Beam */}
            <rect x="40" y="73" width="220" height="5" rx="2.5" fill="#475569" />

            {/* Left Pan Strings & Pan (Positive) */}
            <line x1="55" y1="75" x2="40" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="55" y1="75" x2="70" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 32 100 Q 55 110 78 100 Z" fill="#38bdf8" />
            {/* Left Pan Label */}
            <text x="55" y="122" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0369a1" className="font-mono">
              +{positiveCharge}
            </text>

            {/* Right Pan Strings & Pan (Negative) */}
            <line x1="245" y1="75" x2="230" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="245" y1="75" x2="260" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 222 100 Q 245 110 268 100 Z" fill="#fb7185" />
            {/* Right Pan Label */}
            <text x="245" y="122" textAnchor="middle" fontSize="11" fontWeight="700" fill="#be123c" className="font-mono">
              -{negativeCharge}
            </text>
          </g>
        </svg>
      </div>

      {/* Charge Status Summary Bar */}
      {showDetails && (
        <div className={`w-full border-t border-slate-200/80 grid grid-cols-3 gap-1.5 text-center text-xs ${
          compact ? 'mt-1 pt-1.5' : 'mt-2 pt-3'
        }`}>
          <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
            <div className="text-slate-400 text-[10px]">Positive</div>
            <div className="font-mono font-bold text-sky-700 text-xs">+{positiveCharge}</div>
          </div>
          <div className="bg-white p-1.5 rounded-lg border border-slate-200/60">
            <div className="text-slate-400 text-[10px]">Negative</div>
            <div className="font-mono font-bold text-rose-700 text-xs">-{negativeCharge}</div>
          </div>
          <div className={`p-1.5 rounded-lg border transition-colors ${
            isBalanced 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
              : isEmpty 
                ? 'bg-white border-slate-200/60 text-slate-600'
                : 'bg-amber-50 border-amber-300 text-amber-800'
          }`}>
            <div className="text-[10px] opacity-80">Net Charge</div>
            <div className="font-mono font-bold text-xs">
              {netCharge > 0 ? `+${netCharge}` : netCharge === 0 ? '0 (Balanced)' : `${netCharge}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
