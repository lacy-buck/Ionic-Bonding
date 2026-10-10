import React from 'react';

interface LewisDotProps {
  symbol: string;
  valenceElectrons: number; // 0 to 8
  isIon?: boolean;
  charge?: number;
  hideValenceDots?: boolean;
  highlightElectrons?: boolean;
  onElectronsClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  subtext?: string;
  animatedTransfer?: boolean;
}

export const LewisDot: React.FC<LewisDotProps> = ({
  symbol,
  valenceElectrons,
  isIon = false,
  charge = 0,
  hideValenceDots = false,
  size = 'md',
  label,
  subtext,
}) => {
  // Dot placement positions around the symbol:
  const dots: { x: number; y: number }[] = [];
  const count = hideValenceDots ? 0 : Math.max(0, Math.min(8, valenceElectrons));

  if (count === 1) dots.push({ x: 50, y: 14 });
  else if (count === 2) { dots.push({ x: 50, y: 14 }); dots.push({ x: 86, y: 50 }); }
  else if (count === 3) { dots.push({ x: 50, y: 14 }); dots.push({ x: 86, y: 50 }); dots.push({ x: 50, y: 86 }); }
  else if (count === 4) { dots.push({ x: 50, y: 14 }); dots.push({ x: 86, y: 50 }); dots.push({ x: 50, y: 86 }); dots.push({ x: 14, y: 50 }); }
  else if (count === 5) { dots.push({ x: 42, y: 14 }); dots.push({ x: 58, y: 14 }); dots.push({ x: 86, y: 50 }); dots.push({ x: 50, y: 86 }); dots.push({ x: 14, y: 50 }); }
  else if (count === 6) { dots.push({ x: 42, y: 14 }); dots.push({ x: 58, y: 14 }); dots.push({ x: 86, y: 42 }); dots.push({ x: 86, y: 58 }); dots.push({ x: 50, y: 86 }); dots.push({ x: 14, y: 50 }); }
  else if (count === 7) { dots.push({ x: 42, y: 14 }); dots.push({ x: 58, y: 14 }); dots.push({ x: 86, y: 42 }); dots.push({ x: 86, y: 58 }); dots.push({ x: 42, y: 86 }); dots.push({ x: 58, y: 86 }); dots.push({ x: 14, y: 50 }); }
  else if (count === 8) {
    dots.push({ x: 42, y: 14 }, { x: 58, y: 14 });
    dots.push({ x: 86, y: 42 }, { x: 86, y: 58 });
    dots.push({ x: 42, y: 86 }, { x: 58, y: 86 });
    dots.push({ x: 14, y: 42 }, { x: 14, y: 58 });
  }

  const dimensionClass = {
    sm: 'w-20 h-20 text-lg',
    md: 'w-28 h-28 text-2xl',
    lg: 'w-36 h-36 text-3xl'
  }[size];

  const dotSize = {
    sm: 5,
    md: 7,
    lg: 9
  }[size];

  const chargeFormatted = charge !== 0 ? (
    Math.abs(charge) === 1 
      ? (charge > 0 ? '⁺' : '⁻') 
      : `${Math.abs(charge)}${charge > 0 ? '⁺' : '⁻'}`
  ) : null;

  return (
    <div className="flex flex-col items-center select-none">
      {label && <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</span>}
      <div className={`relative ${dimensionClass} flex items-center justify-center bg-white border border-slate-200/90 rounded-xl shadow-xs transition-transform duration-200 hover:scale-[1.02]`}>
        {/* Lewis diagram container */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {/* If valence dots are hidden before student answers, show dashed outer shell ring */}
          {hideValenceDots && (
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )}

          {/* If it's an ion, draw bracket indications */}
          {isIon && (
            <g stroke="#94a3b8" strokeWidth="2" fill="none">
              {/* Left bracket */}
              <path d="M 22 18 L 12 18 L 12 82 L 22 82" />
              {/* Right bracket */}
              <path d="M 78 18 L 88 18 L 88 82 L 78 82" />
            </g>
          )}

          {/* Dots */}
          {dots.map((dot, idx) => (
            <circle
              key={idx}
              cx={dot.x}
              cy={dot.y}
              r={dotSize}
              className="fill-amber-600 transition-all duration-300"
            />
          ))}
        </svg>

        {/* Central Element Symbol */}
        <div className="font-semibold text-slate-900 tracking-tight flex items-center">
          <span>{symbol}</span>
          {chargeFormatted && (
            <span className="text-sm -mt-3 ml-0.5 font-bold text-indigo-700">
              {chargeFormatted}
            </span>
          )}
        </div>
      </div>
      {subtext && <span className="text-xs text-slate-500 mt-1.5 text-center">{subtext}</span>}
    </div>
  );
};
