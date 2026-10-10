import { ChemicalElement, PolyatomicIon, LearnExample } from '../types';

export const MAIN_GROUP_ELEMENTS: ChemicalElement[] = [
  // Group 1
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, group: 1, groupName: 'Alkali Metal', valenceElectrons: 1, typicalCharge: 1, type: 'metal', period: 2 },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, group: 1, groupName: 'Alkali Metal', valenceElectrons: 1, typicalCharge: 1, type: 'metal', period: 3 },
  { symbol: 'K', name: 'Potassium', atomicNumber: 19, group: 1, groupName: 'Alkali Metal', valenceElectrons: 1, typicalCharge: 1, type: 'metal', period: 4 },
  
  // Group 2
  { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, group: 2, groupName: 'Alkaline Earth', valenceElectrons: 2, typicalCharge: 2, type: 'metal', period: 2 },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, group: 2, groupName: 'Alkaline Earth', valenceElectrons: 2, typicalCharge: 2, type: 'metal', period: 3 },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, group: 2, groupName: 'Alkaline Earth', valenceElectrons: 2, typicalCharge: 2, type: 'metal', period: 4 },
  { symbol: 'Ba', name: 'Barium', atomicNumber: 56, group: 2, groupName: 'Alkaline Earth', valenceElectrons: 2, typicalCharge: 2, type: 'metal', period: 6 },
  
  // Group 13
  { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, group: 13, groupName: 'Post-transition Metal', valenceElectrons: 3, typicalCharge: 3, type: 'metal', period: 3 },
  { symbol: 'Ga', name: 'Gallium', atomicNumber: 31, group: 13, groupName: 'Post-transition Metal', valenceElectrons: 3, typicalCharge: 3, type: 'metal', period: 4 },
  
  // Group 15
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, group: 15, groupName: 'Pnictogen', valenceElectrons: 5, typicalCharge: -3, type: 'nonmetal', period: 2 },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, group: 15, groupName: 'Pnictogen', valenceElectrons: 5, typicalCharge: -3, type: 'nonmetal', period: 3 },
  
  // Group 16
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, group: 16, groupName: 'Chalcogen', valenceElectrons: 6, typicalCharge: -2, type: 'nonmetal', period: 2 },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, group: 16, groupName: 'Chalcogen', valenceElectrons: 6, typicalCharge: -2, type: 'nonmetal', period: 3 },
  
  // Group 17
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, group: 17, groupName: 'Halogen', valenceElectrons: 7, typicalCharge: -1, type: 'nonmetal', period: 2 },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, group: 17, groupName: 'Halogen', valenceElectrons: 7, typicalCharge: -1, type: 'nonmetal', period: 3 },
  { symbol: 'Br', name: 'Bromine', atomicNumber: 35, group: 17, groupName: 'Halogen', valenceElectrons: 7, typicalCharge: -1, type: 'nonmetal', period: 4 },
  { symbol: 'I', name: 'Iodine', atomicNumber: 53, group: 17, groupName: 'Halogen', valenceElectrons: 7, typicalCharge: -1, type: 'nonmetal', period: 5 },
];

export const POLYATOMIC_IONS: PolyatomicIon[] = [
  { formula: 'NH4', name: 'Ammonium', charge: 1, formattedHtml: 'NH₄⁺' },
  { formula: 'OH', name: 'Hydroxide', charge: -1, formattedHtml: 'OH⁻' },
  { formula: 'NO3', name: 'Nitrate', charge: -1, formattedHtml: 'NO₃⁻' },
  { formula: 'SO4', name: 'Sulfate', charge: -2, formattedHtml: 'SO₄²⁻' },
  { formula: 'CO3', name: 'Carbonate', charge: -2, formattedHtml: 'CO₃²⁻' },
  { formula: 'PO4', name: 'Phosphate', charge: -3, formattedHtml: 'PO₄³⁻' },
];

export const LEARN_EXAMPLES: LearnExample[] = [
  {
    id: 'na-cl',
    title: 'Na + Cl (1:1 Ratio)',
    metalSymbol: 'Na',
    nonmetalSymbol: 'Cl',
    ratio: { metal: 1, nonmetal: 1 },
    totalElectronsTransferred: 1,
    electronsPerMetal: 1,
    electronsPerNonmetal: 1,
    resultingFormula: 'NaCl',
    compoundName: 'Sodium chloride',
    summaryReasoning: 'One Na atom transfers 1 valence electron to one Cl atom. Na becomes Na⁺ and Cl becomes Cl⁻. The +1 and -1 charges balance 1:1 to form neutral NaCl.'
  },
  {
    id: 'mg-o',
    title: 'Mg + O (1:1 Ratio with 2 electrons)',
    metalSymbol: 'Mg',
    nonmetalSymbol: 'O',
    ratio: { metal: 1, nonmetal: 1 },
    totalElectronsTransferred: 2,
    electronsPerMetal: 2,
    electronsPerNonmetal: 2,
    resultingFormula: 'MgO',
    compoundName: 'Magnesium oxide',
    summaryReasoning: 'One Mg atom transfers 2 valence electrons to one O atom. Mg becomes Mg²⁺ and O becomes O²⁻. The +2 and -2 charges balance 1:1 to form neutral MgO.'
  },
  {
    id: 'mg-cl',
    title: 'Mg + Cl (1:2 Ratio)',
    metalSymbol: 'Mg',
    nonmetalSymbol: 'Cl',
    ratio: { metal: 1, nonmetal: 2 },
    totalElectronsTransferred: 2,
    electronsPerMetal: 2,
    electronsPerNonmetal: 1,
    resultingFormula: 'MgCl2',
    compoundName: 'Magnesium chloride',
    summaryReasoning: 'Mg has 2 valence electrons to lose, but each Cl atom can only accept 1 electron. Therefore, Mg needs TWO Cl atoms! Mg²⁺ balances with two Cl⁻ ions to form neutral MgCl₂.'
  },
  {
    id: 'na-o',
    title: 'Na + O (2:1 Ratio)',
    metalSymbol: 'Na',
    nonmetalSymbol: 'O',
    ratio: { metal: 2, nonmetal: 1 },
    totalElectronsTransferred: 2,
    electronsPerMetal: 1,
    electronsPerNonmetal: 2,
    resultingFormula: 'Na2O',
    compoundName: 'Sodium oxide',
    summaryReasoning: 'Oxygen needs 2 electrons to complete its valence shell, but each Na atom can only give 1 electron. Therefore, TWO Na atoms are needed! Two Na⁺ ions balance with one O²⁻ ion to form neutral Na₂O.'
  },
  {
    id: 'al-cl',
    title: 'Al + Cl (1:3 Ratio)',
    metalSymbol: 'Al',
    nonmetalSymbol: 'Cl',
    ratio: { metal: 1, nonmetal: 3 },
    totalElectronsTransferred: 3,
    electronsPerMetal: 3,
    electronsPerNonmetal: 1,
    resultingFormula: 'AlCl3',
    compoundName: 'Aluminum chloride',
    summaryReasoning: 'Aluminum has 3 valence electrons to lose. Since each Cl accepts only 1 electron, Al transfers 1 electron to each of THREE Cl atoms. Al³⁺ balances with three Cl⁻ ions to form neutral AlCl₃.'
  },
  {
    id: 'ca-n',
    title: 'Ca + N (3:2 Ratio)',
    metalSymbol: 'Ca',
    nonmetalSymbol: 'N',
    ratio: { metal: 3, nonmetal: 2 },
    totalElectronsTransferred: 6,
    electronsPerMetal: 2,
    electronsPerNonmetal: 3,
    resultingFormula: 'Ca3N2',
    compoundName: 'Calcium nitride',
    summaryReasoning: 'Each Ca wants to lose 2 electrons (+2 each), while each N wants to gain 3 electrons (-3 each). The lowest common multiple is 6 electrons! 3 Ca atoms give 6 electrons in total, which are accepted by 2 N atoms: 3(Ca²⁺) = +6 and 2(N³⁻) = -6, giving neutral Ca₃N₂.'
  }
];

// Helper to format ionic symbol with superscript charge, e.g. Mg2+ -> Mg²⁺
export function formatIonSymbol(symbol: string, charge: number): string {
  const absCharge = Math.abs(charge);
  const sign = charge > 0 ? '+' : '-';
  const superscriptDigits: Record<string, string> = {
    '1': '¹', '2': '²', '3': '³', '4': '⁴', '+': '⁺', '-': '⁻'
  };
  
  let chargeStr = '';
  if (absCharge === 1) {
    chargeStr = sign === '+' ? '⁺' : '⁻';
  } else {
    chargeStr = `${superscriptDigits[absCharge.toString()] || absCharge}${superscriptDigits[sign] || sign}`;
  }
  return `${symbol}${chargeStr}`;
}

// Convert subscript numbers, e.g., CaCl2 -> CaCl₂
export function toSubscripts(formula: string): string {
  const subscriptMap: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return formula.replace(/[0-9]/g, (digit) => subscriptMap[digit] || digit);
}

// Normalize student formula input (handle unicode subscripts, spaces, casing)
export function normalizeFormulaInput(input: string): string {
  const fromSubscripts: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
  };
  return input
    .trim()
    .replace(/[₀-₉]/g, (ch) => fromSubscripts[ch] || ch)
    .replace(/\s+/g, '');
}

// Greatest common divisor helper
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export interface IonItem {
  id: string;
  symbol: string;
  name: string;
  charge: number;
  isPolyatomic: boolean;
  baseFormula: string; // e.g. 'NH4' or 'Na'
  formattedHtml: string;
}

export function getIonItem(symbol: string): IonItem | null {
  const elem = MAIN_GROUP_ELEMENTS.find(e => e.symbol === symbol);
  if (elem) {
    return {
      id: elem.symbol,
      symbol: elem.symbol,
      name: elem.name,
      charge: elem.typicalCharge,
      isPolyatomic: false,
      baseFormula: elem.symbol,
      formattedHtml: formatIonSymbol(elem.symbol, elem.typicalCharge)
    };
  }
  const poly = POLYATOMIC_IONS.find(p => p.formula === symbol || p.name.toLowerCase() === symbol.toLowerCase());
  if (poly) {
    return {
      id: poly.formula,
      symbol: poly.formula,
      name: poly.name,
      charge: poly.charge,
      isPolyatomic: true,
      baseFormula: poly.formula,
      formattedHtml: poly.formattedHtml
    };
  }
  return null;
}

// Compute the correct chemical formula and expected counts
export function calculateCorrectCompound(cation: IonItem, anion: IonItem) {
  const cationCharge = Math.abs(cation.charge);
  const anionCharge = Math.abs(anion.charge);
  const divisor = gcd(cationCharge, anionCharge);

  // Smallest whole-number ratio:
  const cationCount = anionCharge / divisor;
  const anionCount = cationCharge / divisor;

  // Formula string generation:
  // Cation part
  let cationPart = cation.baseFormula;
  if (cation.isPolyatomic && cationCount > 1) {
    cationPart = `(${cation.baseFormula})${cationCount}`;
  } else if (cationCount > 1) {
    cationPart = `${cation.baseFormula}${cationCount}`;
  }

  // Anion part
  let anionPart = anion.baseFormula;
  if (anion.isPolyatomic && anionCount > 1) {
    anionPart = `(${anion.baseFormula})${anionCount}`;
  } else if (anionCount > 1) {
    anionPart = `${anion.baseFormula}${anionCount}`;
  }

  const standardFormula = `${cationPart}${anionPart}`;

  // Unreduced formula for detecting non-reduced error (e.g., Ca2O2 instead of CaO)
  let unreducedFormula = '';
  if (divisor > 1) {
    const rawCationPart = cation.isPolyatomic && anionCharge > 1 ? `(${cation.baseFormula})${anionCharge}` : `${cation.baseFormula}${anionCharge > 1 ? anionCharge : ''}`;
    const rawAnionPart = anion.isPolyatomic && cationCharge > 1 ? `(${anion.baseFormula})${cationCharge}` : `${anion.baseFormula}${cationCharge > 1 ? cationCharge : ''}`;
    unreducedFormula = `${rawCationPart}${rawAnionPart}`;
  }

  // Parentheses missing formula (e.g. CaNO32 instead of Ca(NO3)2)
  let missingParenthesesFormula = '';
  if (anion.isPolyatomic && anionCount > 1) {
    missingParenthesesFormula = `${cationCount > 1 ? `${cation.baseFormula}${cationCount}` : cation.baseFormula}${anion.baseFormula}${anionCount}`;
  }
  if (cation.isPolyatomic && cationCount > 1) {
    missingParenthesesFormula = `${cation.baseFormula}${cationCount}${anionCount > 1 ? `${anion.baseFormula}${anionCount}` : anion.baseFormula}`;
  }

  // Erroneous extra parentheses (e.g., Na(OH) or (Na)Cl)
  let unnecessaryParenthesesFormula = '';
  if (anion.isPolyatomic && anionCount === 1) {
    unnecessaryParenthesesFormula = `${cationPart}(${anion.baseFormula})`;
  }

  return {
    cationCount,
    anionCount,
    standardFormula,
    unreducedFormula,
    missingParenthesesFormula,
    unnecessaryParenthesesFormula,
    displayFormula: toSubscripts(standardFormula),
    totalPositiveCharge: cationCount * cationCharge,
    totalNegativeCharge: anionCount * anionCharge
  };
}

// Detailed analysis of student formula submission to provide smart pedagogical hints
export function evaluateFormulaSubmission(
  studentInput: string,
  cation: IonItem,
  anion: IonItem
): { isCorrect: boolean; feedback: string } {
  const trimmed = studentInput.trim();
  if (!trimmed) {
    return {
      isCorrect: false,
      feedback: 'Please enter a chemical formula.'
    };
  }

  // Reject formulas with plain ASCII digits (e.g. Na2O instead of Na₂O)
  if (/[0-9]/.test(trimmed)) {
    return {
      isCorrect: false,
      feedback: 'Use proper subscripts! Chemical formulas must be written with subscript numbers (e.g. Na₂O, not Na2O). Use the subscript keypad or type numbers to format subscripts.'
    };
  }

  const normalized = normalizeFormulaInput(trimmed);
  const correct = calculateCorrectCompound(cation, anion);

  // Exact match (case sensitive standard, e.g. MgCl2)
  if (normalized === correct.standardFormula) {
    return {
      isCorrect: true,
      feedback: `Correct! ${toSubscripts(correct.standardFormula)} has ${correct.cationCount} ${cation.name} ion${correct.cationCount > 1 ? 's' : ''} and ${correct.anionCount} ${anion.name} ion${correct.anionCount > 1 ? 's' : ''}, balancing the charge to exactly 0.`
    };
  }

  // Match ignoring case (e.g. mgcl2 instead of MgCl2)
  if (normalized.toLowerCase() === correct.standardFormula.toLowerCase()) {
    return {
      isCorrect: false,
      feedback: `Almost there! Remember to use proper chemical capitalization. Elements start with a capital letter (e.g., "${correct.standardFormula.slice(0, 2)}" not "${normalized.slice(0, 2)}").`
    };
  }

  // Check for non-reduced ratio mistake (e.g. Ca2O2, Mg2O2, Al3N3)
  if (correct.unreducedFormula && (normalized === correct.unreducedFormula || normalized.toLowerCase() === correct.unreducedFormula.toLowerCase())) {
    return {
      isCorrect: false,
      feedback: 'Hint: Your charges may balance, but check whether your subscripts are in the smallest whole-number ratio. Ionic formulas always represent the simplest ratio of ions (empirical formula).'
    };
  }

  // Check for missing parentheses on polyatomic ion (e.g. CaNO32 instead of Ca(NO3)2)
  if (correct.missingParenthesesFormula && (normalized === correct.missingParenthesesFormula || normalized.toLowerCase() === correct.missingParenthesesFormula.toLowerCase())) {
    return {
      isCorrect: false,
      feedback: 'Hint: You have more than one polyatomic ion. What punctuation should be used around a polyatomic ion when there is more than one? (Use parentheses, e.g. (NO₃)₂).'
    };
  }

  // Check for unnecessary parentheses (e.g., Na(OH) when only 1 polyatomic ion is present)
  if (correct.unnecessaryParenthesesFormula && normalized === correct.unnecessaryParenthesesFormula) {
    return {
      isCorrect: false,
      feedback: 'Hint: Parentheses are only needed around a polyatomic ion when there are TWO OR MORE of them. When there is only 1, parentheses are omitted.'
    };
  }

  // Check if cation and anion are backwards (e.g. Cl2Mg)
  const reversedStandard = `${anion.baseFormula}${correct.anionCount > 1 ? correct.anionCount : ''}${cation.baseFormula}${correct.cationCount > 1 ? correct.cationCount : ''}`;
  if (normalized === reversedStandard || normalized.toLowerCase() === reversedStandard.toLowerCase()) {
    return {
      isCorrect: false,
      feedback: 'Hint: In an ionic compound, the positive ion (cation / metal) is always written first, followed by the negative ion (anion).'
    };
  }

  // General charge balance hint
  return {
    isCorrect: false,
    feedback: `Hint: Add up all the positive charges (${cation.symbol}${formatIonSymbol('', cation.charge)}) and negative charges (${anion.symbol}${formatIonSymbol('', anion.charge)}). Do they equal zero? The total positive and negative charges must balance.`
  };
}

// Generate practice pairs covering varied ratios
export interface PracticePair {
  id: string;
  cation: IonItem;
  anion: IonItem;
  ratioLabel: string;
  category: 'monatomic' | 'polyatomic';
}

export const CURATED_PRACTICE_PAIRS: PracticePair[] = [
  // Mixed ratios right off the bat!
  { id: 'mg-cl', cation: getIonItem('Mg')!, anion: getIonItem('Cl')!, ratioLabel: '1:2 ratio', category: 'monatomic' },
  { id: 'na-o', cation: getIonItem('Na')!, anion: getIonItem('O')!, ratioLabel: '2:1 ratio', category: 'monatomic' },
  { id: 'al-o', cation: getIonItem('Al')!, anion: getIonItem('O')!, ratioLabel: '2:3 ratio', category: 'monatomic' },
  { id: 'ca-o', cation: getIonItem('Ca')!, anion: getIonItem('O')!, ratioLabel: '1:1 ratio (2+ and 2-, reduces to CaO)', category: 'monatomic' },
  { id: 'al-cl', cation: getIonItem('Al')!, anion: getIonItem('Cl')!, ratioLabel: '1:3 ratio', category: 'monatomic' },
  { id: 'ca-no3', cation: getIonItem('Ca')!, anion: getIonItem('NO3')!, ratioLabel: '1:2 polyatomic (parentheses needed)', category: 'polyatomic' },
  { id: 'ca-n', cation: getIonItem('Ca')!, anion: getIonItem('N')!, ratioLabel: '3:2 ratio', category: 'monatomic' },
  { id: 'na-cl', cation: getIonItem('Na')!, anion: getIonItem('Cl')!, ratioLabel: '1:1 ratio', category: 'monatomic' },
  { id: 'nh4-co3', cation: getIonItem('NH4')!, anion: getIonItem('CO3')!, ratioLabel: '2:1 polyatomic cation', category: 'polyatomic' },
  { id: 'mg-oh', cation: getIonItem('Mg')!, anion: getIonItem('OH')!, ratioLabel: '1:2 polyatomic (parentheses needed)', category: 'polyatomic' },
  { id: 'k-s', cation: getIonItem('K')!, anion: getIonItem('S')!, ratioLabel: '2:1 ratio', category: 'monatomic' },
  { id: 'al-so4', cation: getIonItem('Al')!, anion: getIonItem('SO4')!, ratioLabel: '2:3 polyatomic (parentheses needed)', category: 'polyatomic' },
  { id: 'ca-f', cation: getIonItem('Ca')!, anion: getIonItem('F')!, ratioLabel: '1:2 ratio', category: 'monatomic' },
  { id: 'na-n', cation: getIonItem('Na')!, anion: getIonItem('N')!, ratioLabel: '3:1 ratio', category: 'monatomic' },
  { id: 'k-br', cation: getIonItem('K')!, anion: getIonItem('Br')!, ratioLabel: '1:1 ratio', category: 'monatomic' },
  { id: 'ba-br', cation: getIonItem('Ba')!, anion: getIonItem('Br')!, ratioLabel: '1:2 ratio', category: 'monatomic' },
  { id: 'na-oh', cation: getIonItem('Na')!, anion: getIonItem('OH')!, ratioLabel: '1:1 polyatomic', category: 'polyatomic' },
  { id: 'mg-p', cation: getIonItem('Mg')!, anion: getIonItem('P')!, ratioLabel: '3:2 ratio', category: 'monatomic' },
  { id: 'al-f', cation: getIonItem('Al')!, anion: getIonItem('F')!, ratioLabel: '1:3 ratio', category: 'monatomic' },
  { id: 'al-s', cation: getIonItem('Al')!, anion: getIonItem('S')!, ratioLabel: '2:3 ratio', category: 'monatomic' },
  { id: 'ca-s', cation: getIonItem('Ca')!, anion: getIonItem('S')!, ratioLabel: '1:1 ratio (2+ and 2-)', category: 'monatomic' },
  { id: 'nh4-po4', cation: getIonItem('NH4')!, anion: getIonItem('PO4')!, ratioLabel: '3:1 polyatomic', category: 'polyatomic' },
  { id: 'ca-po4', cation: getIonItem('Ca')!, anion: getIonItem('PO4')!, ratioLabel: '3:2 polyatomic (parentheses needed)', category: 'polyatomic' },
  { id: 'ba-so4', cation: getIonItem('Ba')!, anion: getIonItem('SO4')!, ratioLabel: '1:1 polyatomic (simplest ratio)', category: 'polyatomic' },
  { id: 'k-no3', cation: getIonItem('K')!, anion: getIonItem('NO3')!, ratioLabel: '1:1 polyatomic', category: 'polyatomic' },
  { id: 'al-n', cation: getIonItem('Al')!, anion: getIonItem('N')!, ratioLabel: '1:1 ratio (3+ and 3-)', category: 'monatomic' },
];
