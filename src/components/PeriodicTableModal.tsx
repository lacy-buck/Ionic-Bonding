import React, { useState } from 'react';
import {
  FULL_PERIODIC_TABLE,
  LANTHANIDES,
  ACTINIDES,
  CATEGORY_STYLES,
  PeriodicElement,
  ElementCategory,
  getMainGridElement,
} from '../data/periodicTableData';
import { POLYATOMIC_IONS } from '../data/chemistry';
import { X, Table, Layers, Search, RotateCcw } from 'lucide-react';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement>(
    () => FULL_PERIODIC_TABLE.find((e) => e.sym === 'Na') || FULL_PERIODIC_TABLE[10]
  );
  const [activeTab, setActiveTab] = useState<'periodic-table' | 'polyatomic'>('periodic-table');
  const [categoryFilter, setCategoryFilter] = useState<ElementCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const periods = [1, 2, 3, 4, 5, 6, 7];
  const groups = Array.from({ length: 18 }, (_, i) => i + 1);

  const selectedCatStyle = CATEGORY_STYLES[selectedElement.cat];

  const handleSelectElement = (elem: PeriodicElement) => {
    setSelectedElement(elem);
  };

  const isHighlighted = (elem: PeriodicElement) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        elem.name.toLowerCase().includes(q) ||
        elem.sym.toLowerCase().includes(q) ||
        elem.num.toString() === q
      );
    }
    if (categoryFilter !== 'all') {
      return elem.cat === categoryFilter;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[96vh] flex flex-col border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="periodic-table-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h2 id="periodic-table-title" className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Periodic Table of Elements
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Standard IUPAC 118-Element Reference (Groups 1–18 · Periods 1–7)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Table vs Polyatomic */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('periodic-table')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'periodic-table'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Periodic Table</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('polyatomic')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'polyatomic'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Polyatomic Ions</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close periodic table"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {activeTab === 'periodic-table' ? (
            <>
              {/* Element Inspector & Quick Filter Tool bar */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-col lg:flex-row items-stretch justify-between gap-4">
                {/* Element Inspector Card (NO CHARGES) */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-20 h-20 rounded-2xl border-2 flex flex-col justify-between p-2 shadow-xs bg-white shrink-0 ${selectedCatStyle.border}`}
                  >
                    <div className="text-[11px] font-mono text-slate-500 font-bold leading-none">
                      {selectedElement.num}
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 text-center leading-none">
                      {selectedElement.sym}
                    </div>
                    <div className="text-[10px] text-center text-slate-500 truncate font-mono">
                      {selectedElement.mass}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {selectedElement.name}
                      </h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${selectedCatStyle.cellBg}`}>
                        {selectedCatStyle.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                      <span>
                        Atomic Number: <strong className="font-mono text-slate-900">{selectedElement.num}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Atomic Mass: <strong className="font-mono text-slate-900">{selectedElement.mass} u</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Standard State: <strong className="text-slate-900">{selectedElement.phase || 'Solid'}</strong>
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      {selectedElement.group > 0 ? (
                        <span>Group {selectedElement.group} · Period {selectedElement.period}</span>
                      ) : (
                        <span>{selectedCatStyle.label} (f-block) · Period {selectedElement.period}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-2 lg:max-w-xs w-full">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, symbol, or #"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as ElementCategory | 'all')}
                      aria-label="Filter periodic table elements by category"
                      className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-600 flex-1 text-slate-700 font-medium"
                    >
                      <option value="all">All Element Categories</option>
                      {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
                        <option key={key} value={key}>
                          {style.label}
                        </option>
                      ))}
                    </select>

                    {categoryFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setCategoryFilter('all')}
                        className="p-1.5 text-slate-500 hover:text-slate-700 bg-white border border-slate-300 rounded-lg"
                        title="Clear category filter"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* THE COMPLETE 118-ELEMENT PERIODIC TABLE GRID (NO CHARGES) */}
              <div className="overflow-x-auto pb-2 border border-slate-200/80 rounded-xl p-2 bg-slate-50/50">
                <div className="min-w-[920px]">
                  {/* Column Group Headers (1 to 18) - NO CHARGES */}
                  <div className="grid grid-cols-18 gap-1 mb-1 text-center">
                    {groups.map((grp) => (
                      <div key={grp} className="text-[10px] font-bold text-slate-500 font-mono py-0.5">
                        {grp}
                      </div>
                    ))}
                  </div>

                  {/* Main Grid: Periods 1 through 7 */}
                  <div className="space-y-1">
                    {periods.map((period) => (
                      <div key={period} className="grid grid-cols-18 gap-1">
                        {groups.map((group) => {
                          // Special Lanthanide placeholder in Group 3, Period 6
                          if (period === 6 && group === 3) {
                            return (
                              <div
                                key="la-slot"
                                className="h-12 p-0.5 rounded border border-pink-200 bg-pink-50 flex flex-col justify-center items-center text-center text-pink-900"
                                title="Lanthanides: Elements 57–71"
                              >
                                <span className="text-[8px] font-mono font-bold leading-none">57-71</span>
                                <span className="text-[10px] font-extrabold leading-none mt-0.5">La-Lu</span>
                                <span className="text-[7px] leading-none opacity-80">Lanthanides</span>
                              </div>
                            );
                          }

                          // Special Actinide placeholder in Group 3, Period 7
                          if (period === 7 && group === 3) {
                            return (
                              <div
                                key="ac-slot"
                                className="h-12 p-0.5 rounded border border-orange-200 bg-orange-50 flex flex-col justify-center items-center text-center text-orange-900"
                                title="Actinides: Elements 89–103"
                              >
                                <span className="text-[8px] font-mono font-bold leading-none">89-103</span>
                                <span className="text-[10px] font-extrabold leading-none mt-0.5">Ac-Lr</span>
                                <span className="text-[7px] leading-none opacity-80">Actinides</span>
                              </div>
                            );
                          }

                          const elem = getMainGridElement(period, group);
                          if (!elem) {
                            return <div key={group} className="h-12 rounded" />;
                          }

                          const isSelected = selectedElement.num === elem.num;
                          const highlighted = isHighlighted(elem);
                          const catStyle = CATEGORY_STYLES[elem.cat];

                          return (
                            <button
                              key={elem.sym}
                              type="button"
                              onClick={() => handleSelectElement(elem)}
                              className={`h-12 p-1 rounded border flex flex-col justify-between items-center text-center transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'ring-2 ring-indigo-600 shadow-md scale-105 z-10 bg-white border-indigo-600'
                                  : highlighted
                                  ? catStyle.cellBg
                                  : 'bg-slate-100 text-slate-400 border-slate-200 opacity-35'
                              }`}
                              title={`${elem.name} (${elem.sym}) · Atomic #${elem.num} · Mass: ${elem.mass}`}
                            >
                              <div className="w-full flex items-center justify-start text-[8px] font-mono leading-none opacity-75">
                                <span>{elem.num}</span>
                              </div>
                              <div className="text-xs sm:text-sm font-black leading-none my-0.5">
                                {elem.sym}
                              </div>
                              <div className="w-full text-[8px] font-mono truncate leading-none opacity-85">
                                {elem.mass}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* f-Block Gap Separator */}
                  <div className="my-2.5 border-t border-slate-200/80 relative">
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-slate-50 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      f-Block (Inner Transition Metals)
                    </span>
                  </div>

                  {/* Lanthanides Row (57 to 71) */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-18 gap-1 items-center">
                      <div className="col-span-3 text-right pr-2 text-[10px] font-bold text-pink-700">
                        Lanthanides:
                      </div>
                      {LANTHANIDES.map((elem) => {
                        const isSelected = selectedElement.num === elem.num;
                        const highlighted = isHighlighted(elem);
                        const catStyle = CATEGORY_STYLES[elem.cat];

                        return (
                          <button
                            key={elem.sym}
                            type="button"
                            onClick={() => handleSelectElement(elem)}
                            className={`h-11 p-1 rounded border flex flex-col justify-between items-center text-center transition-all cursor-pointer relative ${
                              isSelected
                                ? 'ring-2 ring-indigo-600 shadow-md scale-105 z-10 bg-white border-indigo-600'
                                : highlighted
                                ? catStyle.cellBg
                                : 'bg-slate-100 text-slate-400 border-slate-200 opacity-35'
                            }`}
                            title={`${elem.name} (${elem.sym}) · Atomic #${elem.num} · Mass: ${elem.mass}`}
                          >
                            <div className="w-full flex items-center justify-start text-[8px] font-mono leading-none opacity-75">
                              <span>{elem.num}</span>
                            </div>
                            <div className="text-xs font-black leading-none my-0.5">
                              {elem.sym}
                            </div>
                            <div className="w-full text-[7.5px] font-mono truncate leading-none opacity-85">
                              {elem.mass}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Actinides Row (89 to 103) */}
                    <div className="grid grid-cols-18 gap-1 items-center">
                      <div className="col-span-3 text-right pr-2 text-[10px] font-bold text-orange-700">
                        Actinides:
                      </div>
                      {ACTINIDES.map((elem) => {
                        const isSelected = selectedElement.num === elem.num;
                        const highlighted = isHighlighted(elem);
                        const catStyle = CATEGORY_STYLES[elem.cat];

                        return (
                          <button
                            key={elem.sym}
                            type="button"
                            onClick={() => handleSelectElement(elem)}
                            className={`h-11 p-1 rounded border flex flex-col justify-between items-center text-center transition-all cursor-pointer relative ${
                              isSelected
                                ? 'ring-2 ring-indigo-600 shadow-md scale-105 z-10 bg-white border-indigo-600'
                                : highlighted
                                ? catStyle.cellBg
                                : 'bg-slate-100 text-slate-400 border-slate-200 opacity-35'
                            }`}
                            title={`${elem.name} (${elem.sym}) · Atomic #${elem.num} · Mass: ${elem.mass}`}
                          >
                            <div className="w-full flex items-center justify-start text-[8px] font-mono leading-none opacity-75">
                              <span>{elem.num}</span>
                            </div>
                            <div className="text-xs font-black leading-none my-0.5">
                              {elem.sym}
                            </div>
                            <div className="w-full text-[7.5px] font-mono truncate leading-none opacity-85">
                              {elem.mass}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Color Legend (NO CHARGES) */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategoryFilter(categoryFilter === key ? 'all' : (key as ElementCategory))}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-left ${
                      categoryFilter === key
                        ? 'ring-2 ring-indigo-600 bg-white shadow-2xs font-bold border-indigo-400'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${style.bg}`} />
                    <span className="text-[11px]">{style.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Polyatomic Ions Reference Table */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Common Polyatomic Ions Reference
                  </h3>
                  <p className="text-xs text-slate-500">
                    Groups of bonded atoms that carry an overall ionic charge
                  </p>
                </div>
                <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  Total: {POLYATOMIC_IONS.length} ions
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {POLYATOMIC_IONS.map((ion) => {
                  const isCation = ion.charge > 0;
                  return (
                    <div
                      key={ion.formula}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                        isCation
                          ? 'bg-sky-50/70 border-sky-200 text-sky-950'
                          : 'bg-rose-50/70 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800">{ion.name}</span>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {isCation ? 'Polyatomic cation' : 'Polyatomic anion'}
                          </div>
                        </div>
                        <span className="font-mono text-base font-extrabold">
                          {ion.formattedHtml}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
