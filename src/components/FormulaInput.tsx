import React, { useRef } from 'react';

interface FormulaInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const FormulaInput: React.FC<FormulaInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type chemical formula (e.g. XY₂)...',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const insertChar = (char: string) => {
    if (disabled) return;
    onChange(value + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBackspace = () => {
    if (disabled || !value) return;
    onChange(value.slice(0, -1));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    if (disabled) return;
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const convertDigitsToSubscripts = (str: string): string => {
    const subscriptMap: Record<string, string> = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
      '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };
    return str.replace(/[0-9]/g, (d) => subscriptMap[d] || d);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Automatically convert typed ASCII numbers 0-9 into Unicode subscripts ₀-₉
    const converted = convertDigitsToSubscripts(e.target.value);
    onChange(converted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-md space-y-2.5">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-lg font-mono tracking-wide text-slate-900 bg-white border-2 border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
          autoComplete="off"
          spellCheck={false}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs font-semibold"
            title="Clear input"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Quick Chemistry Subscript Keypad Helper */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
        <span className="text-xs text-slate-500 font-medium mr-1 hidden sm:inline">
          Subscript keypad:
        </span>
        <div className="flex items-center gap-1">
          {['₂', '₃', '₄', '₅'].map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => insertChar(sub)}
              disabled={disabled}
              className="w-8 h-8 flex items-center justify-center font-mono font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 active:scale-95 transition-all disabled:opacity-50"
            >
              {sub}
            </button>
          ))}
          <button
            key="("
            type="button"
            onClick={() => insertChar('(')}
            disabled={disabled}
            className="w-8 h-8 flex items-center justify-center font-mono font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 active:scale-95 transition-all disabled:opacity-50"
          >
            (
          </button>
          <button
            key=")"
            type="button"
            onClick={() => insertChar(')')}
            disabled={disabled}
            className="w-8 h-8 flex items-center justify-center font-mono font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 active:scale-95 transition-all disabled:opacity-50"
          >
            )
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            disabled={disabled || !value}
            className="px-2.5 h-8 flex items-center justify-center text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 active:scale-95 transition-all disabled:opacity-50"
            title="Backspace"
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
};
