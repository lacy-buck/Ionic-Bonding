import React, { useState } from 'react';
import { X, BookOpen, Lightbulb, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { toSubscripts } from '../data/chemistry';

interface IonicBondingReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SectionKey = 'overview' | 'steps' | 'charges' | 'formulas' | 'polyatomics' | 'pitfalls';

export const IonicBondingReadingModal: React.FC<IonicBondingReadingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                How Ionic Bonds Form: Illustrated Guide
              </h2>
              <p className="text-xs text-slate-500">
                The 5-step reasoning process from atoms to neutral compounds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close reading guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-6 py-2 border-b border-slate-100 bg-white overflow-x-auto text-xs font-semibold text-slate-600">
          {[
            { key: 'overview', label: '1. What is an Ionic Bond?' },
            { key: 'steps', label: '2. The 5-Step Process (Diagrams)' },
            { key: 'charges', label: '3. Predicting Ion Charges' },
            { key: 'formulas', label: '4. Writing Formulas' },
            { key: 'polyatomics', label: '5. Polyatomic Ions' },
            { key: 'pitfalls', label: '6. Common Pitfalls' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as SectionKey)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeSection === tab.key
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* SECTION 1: OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-4">
                <h3 className="text-base font-bold text-indigo-900 mb-1">
                  Core Concept: Ionic Bonds are Electron Transfers
                </h3>
                <p className="text-indigo-950 text-xs sm:text-sm">
                  An <strong>ionic bond</strong> is the strong electrostatic attraction between oppositely charged ions. It occurs when one or more valence electrons are <em>transferred</em> from a metal atom to a nonmetal atom.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2">
                  <div className="flex items-center gap-1.5 text-sky-900 font-bold">
                    <span className="w-5 h-5 rounded-full bg-sky-200 text-sky-800 text-xs flex items-center justify-center font-mono">
                      +
                    </span>
                    <span>The Metal (Cation)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Metals have 1, 2, or 3 valence electrons. Because they have low electronegativity, it is energetically favorable for them to <strong>lose</strong> these valence electrons to expose a full inner shell.
                  </p>
                  <div className="text-xs font-mono font-bold text-sky-800 bg-white/80 p-2 rounded-lg border border-sky-100">
                    Na (1 valence e⁻) — 1 e⁻ → Na⁺ (Sodium ion)
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                    <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-xs flex items-center justify-center font-mono">
                      -
                    </span>
                    <span>The Nonmetal (Anion)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Nonmetals have 5, 6, or 7 valence electrons. They have high electronegativity and <strong>gain</strong> electrons to achieve a stable outer octet of 8 electrons.
                  </p>
                  <div className="text-xs font-mono font-bold text-rose-800 bg-white/80 p-2 rounded-lg border border-rose-100">
                    Cl (7 valence e⁻) + 1 e⁻ → Cl⁻ (Chloride ion)
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-bold text-slate-900 mb-2">Why Do Atoms Form Ions? The Octet Rule</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Atoms are most stable when their outermost electron shell is completely full — typically with <strong>8 valence electrons</strong> (noble gas electron configuration). 
                  Metals lose outermost electrons to empty their valence shell, while nonmetals gain electrons until their outer shell reaches 8 electrons.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 2: THE 5 STEPS WITH DIAGRAMS */}
          {activeSection === 'steps' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  The 5-Step Reasoning Pipeline (With Visual Diagrams)
                </h3>
                <p className="text-xs text-slate-500">
                  Follow this sequence every time to reason through how ionic compounds form from atoms:
                </p>
              </div>

              {/* STEP 1 WITH DIAGRAM */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Step 1: Count & Draw Valence Electrons</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Use the periodic table group number: Group 1 = 1 e⁻, Group 2 = 2 e⁻, Group 13 = 3 e⁻, Group 15 = 5 e⁻, Group 16 = 6 e⁻, Group 17 = 7 e⁻.
                    </p>
                  </div>
                </div>

                {/* Diagram 1: Neutral Atoms with Valence Dots */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-sky-700 uppercase">Group 1 Metal (Sodium)</span>
                    <div className="relative w-20 h-20 flex items-center justify-center border-2 border-dashed border-sky-300 rounded-full my-2 bg-sky-50/40">
                      <span className="text-xl font-bold font-mono text-slate-800">Na</span>
                      {/* 1 valence dot at top */}
                      <span className="absolute top-1 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white shadow-xs" title="1 valence electron" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">1 Valence e⁻</span>
                  </div>

                  <span className="text-slate-300 font-bold text-2xl hidden sm:inline">+</span>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-rose-700 uppercase">Group 17 Nonmetal (Chlorine)</span>
                    <div className="relative w-20 h-20 flex items-center justify-center border-2 border-dashed border-rose-300 rounded-full my-2 bg-rose-50/40">
                      <span className="text-xl font-bold font-mono text-slate-800">Cl</span>
                      {/* 7 valence dots */}
                      <span className="absolute top-1 left-7 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white" />
                      <span className="absolute top-1 right-7 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white" />
                      <span className="absolute right-1 top-7 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white" />
                      <span className="absolute right-1 bottom-7 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white" />
                      <span className="absolute bottom-1 left-7 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white" />
                      <span className="absolute bottom-1 right-7 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white" />
                      <span className="absolute left-1 top-7 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white" />
                      {/* 1 empty spot */}
                      <span className="absolute left-1 bottom-7 w-3.5 h-3.5 border-2 border-dashed border-rose-400 rounded-full" title="Empty valence slot" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">7 Valence e⁻ (needs 1)</span>
                  </div>
                </div>
              </div>

              {/* STEP 2 WITH DIAGRAM */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Step 2: Transfer Electrons (Metal → Nonmetal)</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Metals have weak pull on valence electrons and lose them. Nonmetals have strong electronegativity and pull electrons in to complete their outer octet of 8.
                    </p>
                  </div>
                </div>

                {/* Diagram 2: Arrow showing electron jump */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-center gap-4 sm:gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-sky-50 border border-sky-300 flex items-center justify-center font-mono font-bold text-xl text-sky-900">
                      Na
                    </div>
                    <span className="text-[11px] text-sky-700 font-semibold block mt-1">Loses 1 e⁻</span>
                  </div>

                  {/* Electron transfer vector arrow */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-amber-600 font-mono text-xs font-bold">
                      <span className="w-3 h-3 bg-amber-500 rounded-full inline-block" />
                      <span>1 e⁻ transfer</span>
                    </div>
                    <svg className="w-24 sm:w-36 h-8 overflow-visible" viewBox="0 0 120 30">
                      <defs>
                        <marker id="guideArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill="#f59e0b" />
                        </marker>
                      </defs>
                      <path d="M 5 20 Q 60 -5 112 18" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 3" markerEnd="url(#guideArrow)" />
                    </svg>
                    <span className="text-[10px] text-slate-400">Metal to Nonmetal</span>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-center font-mono font-bold text-xl text-rose-900">
                      Cl
                    </div>
                    <span className="text-[11px] text-rose-700 font-semibold block mt-1">Gains 1 e⁻ (now 8)</span>
                  </div>
                </div>
              </div>

              {/* STEP 3 WITH DIAGRAM */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Step 3: Determine the Charge of Each Ion</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Protons and electrons are no longer equal! Losing negative electrons leaves positive charge; gaining negative electrons gives negative charge.
                    </p>
                  </div>
                </div>

                {/* Diagram 3: Proton vs Electron Math */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-sky-900">Sodium Cation: Na⁺</div>
                      <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                        11 protons (+11)<br />
                        10 electrons (-10)<br />
                        <span className="font-bold text-sky-800">Net charge = +1</span>
                      </div>
                    </div>
                    <div className="text-2xl font-mono font-extrabold text-sky-700 bg-white px-3 py-1.5 rounded-lg border border-sky-200">
                      [Na]⁺
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-900">Chloride Anion: Cl⁻</div>
                      <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                        17 protons (+17)<br />
                        18 electrons (-18)<br />
                        <span className="font-bold text-rose-800">Net charge = -1</span>
                      </div>
                    </div>
                    <div className="text-2xl font-mono font-extrabold text-rose-700 bg-white px-3 py-1.5 rounded-lg border border-rose-200">
                      [Cl]⁻
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 4 WITH DIAGRAM */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Step 4: Combine Ions to Balance Charges (Net Charge = 0)</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Ionic compounds are electrically neutral crystal lattices. The total positive charge must cancel the total negative charge.
                    </p>
                  </div>
                </div>

                {/* Diagram 4: Balance Scales (1:1 and 1:2) */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-slate-600 mb-1">
                    Example A: 1:1 Ratio (Equal Charges)
                  </div>
                  <div className="flex items-center justify-center gap-3 p-2.5 bg-slate-50 rounded-lg text-xs font-mono">
                    <span className="px-2 py-1 bg-sky-100 text-sky-900 rounded font-bold">1 × Na⁺ (+1)</span>
                    <span className="text-slate-400 font-bold">+</span>
                    <span className="px-2 py-1 bg-rose-100 text-rose-900 rounded font-bold">1 × Cl⁻ (-1)</span>
                    <span className="text-slate-400 font-bold">=</span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded font-bold">0 (Neutral)</span>
                  </div>

                  <div className="text-xs font-semibold text-slate-600 pt-2 mb-1">
                    Example B: 1:2 Ratio (Different Charges)
                  </div>
                  <div className="flex items-center justify-center gap-3 p-2.5 bg-slate-50 rounded-lg text-xs font-mono">
                    <span className="px-2 py-1 bg-sky-100 text-sky-900 rounded font-bold">1 × Mg²⁺ (+2)</span>
                    <span className="text-slate-400 font-bold">+</span>
                    <span className="px-2 py-1 bg-rose-100 text-rose-900 rounded font-bold">2 × Cl⁻ (2 × -1 = -2)</span>
                    <span className="text-slate-400 font-bold">=</span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded font-bold">0 (Neutral)</span>
                  </div>
                </div>
              </div>

              {/* STEP 5 WITH DIAGRAM */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Step 5: Write the Chemical Formula</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Write the metal cation first. Use subscripts for counts greater than 1 (never write "1"). Always reduce to the smallest whole-number ratio.
                    </p>
                  </div>
                </div>

                {/* Diagram 5: Anatomy of a Formula */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
                  <div className="flex items-center gap-1 font-mono text-3xl font-extrabold text-slate-900 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200">
                    <span className="text-sky-700">Mg</span>
                    <span className="text-rose-700">Cl</span>
                    <span className="text-indigo-600 text-2xl font-bold align-sub">₂</span>
                  </div>

                  <div className="text-left space-y-1 text-xs">
                    <div><span className="font-bold text-sky-700">Mg:</span> Metal cation (count is 1, so no subscript written)</div>
                    <div><span className="font-bold text-rose-700">Cl:</span> Nonmetal anion</div>
                    <div><span className="font-bold text-indigo-600">₂:</span> Subscript indicates <strong>two</strong> Cl⁻ ions are needed to balance +2</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: PREDICTING ION CHARGES */}
          {activeSection === 'charges' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Predicting Ion Charges from the Periodic Table
                </h3>
                <p className="text-xs text-slate-500">
                  Because elements in the same group have the same number of valence electrons, they form ions with predictable charges:
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Group</th>
                      <th className="p-2.5">Group Name</th>
                      <th className="p-2.5">Valence e⁻</th>
                      <th className="p-2.5">Action</th>
                      <th className="p-2.5">Ion Charge</th>
                      <th className="p-2.5">Common Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="bg-white">
                      <td className="p-2.5 font-bold font-mono text-indigo-700">Group 1</td>
                      <td className="p-2.5">Alkali metals</td>
                      <td className="p-2.5 font-mono">1</td>
                      <td className="p-2.5 text-sky-700">Loses 1 e⁻</td>
                      <td className="p-2.5 font-bold font-mono text-sky-800">+1</td>
                      <td className="p-2.5 font-mono">Li⁺, Na⁺, K⁺</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2.5 font-bold font-mono text-indigo-700">Group 2</td>
                      <td className="p-2.5">Alkaline earth metals</td>
                      <td className="p-2.5 font-mono">2</td>
                      <td className="p-2.5 text-sky-700">Loses 2 e⁻</td>
                      <td className="p-2.5 font-bold font-mono text-sky-800">+2</td>
                      <td className="p-2.5 font-mono">Mg²⁺, Ca²⁺, Ba²⁺</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2.5 font-bold font-mono text-indigo-700">Group 13</td>
                      <td className="p-2.5">Boron family (Metals)</td>
                      <td className="p-2.5 font-mono">3</td>
                      <td className="p-2.5 text-sky-700">Loses 3 e⁻</td>
                      <td className="p-2.5 font-bold font-mono text-sky-800">+3</td>
                      <td className="p-2.5 font-mono">Al³⁺, Ga³⁺</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2.5 font-bold font-mono text-indigo-700">Group 15</td>
                      <td className="p-2.5">Pnictogens (Nonmetals)</td>
                      <td className="p-2.5 font-mono">5</td>
                      <td className="p-2.5 text-rose-700">Gains 3 e⁻</td>
                      <td className="p-2.5 font-bold font-mono text-rose-800">-3</td>
                      <td className="p-2.5 font-mono">N³⁻ (nitride), P³⁻ (phosphide)</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2.5 font-bold font-mono text-indigo-700">Group 16</td>
                      <td className="p-2.5">Chalcogens</td>
                      <td className="p-2.5 font-mono">6</td>
                      <td className="p-2.5 text-rose-700">Gains 2 e⁻</td>
                      <td className="p-2.5 font-bold font-mono text-rose-800">-2</td>
                      <td className="p-2.5 font-mono">O²⁻ (oxide), S²⁻ (sulfide)</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2.5 font-bold font-mono text-indigo-700">Group 17</td>
                      <td className="p-2.5">Halogens</td>
                      <td className="p-2.5 font-mono">7</td>
                      <td className="p-2.5 text-rose-700">Gains 1 e⁻</td>
                      <td className="p-2.5 font-bold font-mono text-rose-800">-1</td>
                      <td className="p-2.5 font-mono">F⁻ (fluoride), Cl⁻ (chloride), Br⁻ (bromide), I⁻ (iodide)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Nonmetal Naming Note:</strong> When nonmetals gain electrons to form negative ions, their endings change to <strong>-ide</strong>: Oxygen → Oxide (O²⁻), Chlorine → Chloride (Cl⁻), Nitrogen → Nitride (N³⁻).
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: WRITING FORMULAS */}
          {activeSection === 'formulas' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  How to Write Ionic Formulas
                </h3>
                <p className="text-xs text-slate-500">
                  Key rules for combining ions into correct chemical formulas:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Rule 1: Metal Cation First, Nonmetal Anion Second</h4>
                  <p className="text-xs text-slate-600">
                    Always write the positive ion first, followed by the negative ion.
                    Example: write <strong>NaCl</strong>, never ClNa.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Rule 2: Subscripts Represent the Number of Ions</h4>
                  <p className="text-xs text-slate-600">
                    If more than one of an ion is needed to balance the charge, indicate the count with a subscript.
                    If only one ion is needed, <strong>do not write a 1</strong>. (Write <strong>CaCl₂</strong>, not Ca₁Cl₂).
                  </p>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                  <h4 className="font-bold text-amber-900 text-sm">Rule 3: Always Reduce to the Simplest Whole-Number Ratio!</h4>
                  <p className="text-xs text-amber-950">
                    Ionic formulas show the empirical formula (the lowest whole-number ratio of ions in the crystal lattice).
                    For example, Calcium is Ca²⁺ (+2) and Oxygen is O²⁻ (-2). One of each balances: (+2) + (-2) = 0.
                    The formula is <strong>CaO</strong>, NOT Ca₂O₂!
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Common Ratio Examples</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800">1:1 Ratio</div>
                      <div className="text-slate-500 mt-1">Na⁺ + Cl⁻ → <strong>NaCl</strong></div>
                      <div className="text-slate-500">Mg²⁺ + O²⁻ → <strong>MgO</strong></div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800">1:2 / 2:1 Ratio</div>
                      <div className="text-slate-500 mt-1">Mg²⁺ + 2 Cl⁻ → <strong>MgCl₂</strong></div>
                      <div className="text-slate-500">2 Na⁺ + O²⁻ → <strong>Na₂O</strong></div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800">2:3 / 3:2 Ratio</div>
                      <div className="text-slate-500 mt-1">2 Al³⁺ + 3 O²⁻ → <strong>Al₂O₃</strong></div>
                      <div className="text-slate-500">3 Ca²⁺ + 2 N³⁻ → <strong>Ca₃N₂</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: POLYATOMIC IONS */}
          {activeSection === 'polyatomics' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Polyatomic Ions & Using Parentheses
                </h3>
                <p className="text-xs text-slate-500">
                  A polyatomic ion is a group of covalently bonded atoms that carries an overall electrical charge.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Formula & Charge</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Example Compound</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="bg-white">
                      <td className="p-2.5">Ammonium</td>
                      <td className="p-2.5 font-mono font-bold text-sky-700">NH₄⁺ (+1)</td>
                      <td className="p-2.5 text-slate-500">Cation</td>
                      <td className="p-2.5 font-mono">NH₄Cl</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2.5">Hydroxide</td>
                      <td className="p-2.5 font-mono font-bold text-rose-700">OH⁻ (-1)</td>
                      <td className="p-2.5 text-slate-500">Anion</td>
                      <td className="p-2.5 font-mono">NaOH, Mg(OH)₂</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2.5">Nitrate</td>
                      <td className="p-2.5 font-mono font-bold text-rose-700">NO₃⁻ (-1)</td>
                      <td className="p-2.5 text-slate-500">Anion</td>
                      <td className="p-2.5 font-mono">KNO₃, Ca(NO₃)₂</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2.5">Sulfate</td>
                      <td className="p-2.5 font-mono font-bold text-rose-700">SO₄²⁻ (-2)</td>
                      <td className="p-2.5 text-slate-500">Anion</td>
                      <td className="p-2.5 font-mono">Na₂SO₄, Al₂(SO₄)₃</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2.5">Carbonate</td>
                      <td className="p-2.5 font-mono font-bold text-rose-700">CO₃²⁻ (-2)</td>
                      <td className="p-2.5 text-slate-500">Anion</td>
                      <td className="p-2.5 font-mono">CaCO₃, Na₂CO₃</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2.5">Phosphate</td>
                      <td className="p-2.5 font-mono font-bold text-rose-700">PO₄³⁻ (-3)</td>
                      <td className="p-2.5 text-slate-500">Anion</td>
                      <td className="p-2.5 font-mono">K₃PO₄, Mg₃(PO₄)₂</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-indigo-900 text-sm">When Do You Need Parentheses?</h4>
                <p className="text-xs text-indigo-950 leading-relaxed">
                  Only use parentheses around a polyatomic ion if <strong>MORE THAN ONE</strong> of that polyatomic ion is required in the compound:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-bold text-emerald-700">✓ Needs Parentheses (count &gt; 1):</span>
                    <ul className="mt-1 space-y-0.5 text-slate-700 font-mono">
                      <li>Mg²⁺ + 2 OH⁻ → <strong>Mg(OH)₂</strong></li>
                      <li>Ca²⁺ + 2 NO₃⁻ → <strong>Ca(NO₃)₂</strong></li>
                      <li>2 Al³⁺ + 3 SO₄²⁻ → <strong>Al₂(SO₄)₃</strong></li>
                    </ul>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-bold text-rose-700">✗ NO Parentheses (count = 1):</span>
                    <ul className="mt-1 space-y-0.5 text-slate-700 font-mono">
                      <li>Na⁺ + OH⁻ → <strong>NaOH</strong> (not Na(OH))</li>
                      <li>2 Na⁺ + SO₄²⁻ → <strong>Na₂SO₄</strong> (not Na₂(SO₄)₁)</li>
                      <li>Ca²⁺ + CO₃²⁻ → <strong>CaCO₃</strong> (not Ca(CO₃))</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: PITFALLS */}
          {activeSection === 'pitfalls' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Common Mistakes to Avoid
                </h3>
                <p className="text-xs text-slate-500">
                  Keep these high-frequency student errors in mind while completing challenges:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Mistake 1: Leaving charges in the final formula</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Students sometimes write <code className="font-mono bg-rose-100 text-rose-900 px-1 py-0.5 rounded">Na⁺Cl⁻</code>. 
                    Once ions combine to form a neutral compound, the net charge is zero, so individual charges are omitted in the formula: <code className="font-mono bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded">NaCl</code>.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Mistake 2: Blind criss-cross without simplifying</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    If you blindly criss-cross charges for Ca²⁺ and O²⁻, you might write <code className="font-mono bg-rose-100 text-rose-900 px-1 py-0.5 rounded">Ca₂O₂</code>. 
                    Always ask: <em>can the subscripts be reduced to smaller whole numbers?</em> 2:2 simplifies to 1:1, so the correct formula is <code className="font-mono bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded">CaO</code>.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Mistake 3: Putting parentheses when only 1 polyatomic ion is present</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Never write <code className="font-mono bg-rose-100 text-rose-900 px-1 py-0.5 rounded">Na(OH)</code> or <code className="font-mono bg-rose-100 text-rose-900 px-1 py-0.5 rounded">K(NO₃)</code>. 
                    Parentheses are only used when you have 2 or more of the entire polyatomic package (e.g. <code className="font-mono bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded">Ca(OH)₂</code>).
                  </p>
                </div>

                <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Mistake 4: Writing the nonmetal first</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    The positive metal cation always comes first in the formula and in the compound's chemical name. Write <code className="font-mono bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded">AlCl₃</code>, not <code className="font-mono bg-rose-100 text-rose-900 px-1 py-0.5 rounded">Cl₃Al</code>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Review completed? Head back into the practice modules:
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
          >
            Back to Practice
          </button>
        </div>
      </div>
    </div>
  );
};
