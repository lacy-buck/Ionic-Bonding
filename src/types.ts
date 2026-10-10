export type ElementType = 'metal' | 'nonmetal' | 'metalloid' | 'polyatomic';

export interface ChemicalElement {
  symbol: string;
  name: string;
  atomicNumber: number;
  group: number; // 1, 2, 13, 14, 15, 16, 17, 18
  groupName: string; // e.g. "Alkali Metal", "Halogen"
  valenceElectrons: number;
  typicalCharge: number; // e.g. +1, -2
  type: ElementType;
  period: number;
}

export interface PolyatomicIon {
  formula: string;
  name: string;
  charge: number; // e.g. +1 for NH4+, -1 for OH-
  formattedHtml: string;
}

export interface LearnExample {
  id: string;
  title: string;
  metalSymbol: string;
  nonmetalSymbol: string;
  ratio: { metal: number; nonmetal: number }; // e.g. { metal: 1, nonmetal: 2 } for MgCl2
  totalElectronsTransferred: number;
  electronsPerMetal: number;
  electronsPerNonmetal: number;
  resultingFormula: string;
  compoundName: string;
  summaryReasoning: string;
}

export interface UserProgress {
  learnCompleted: string[]; // ids of completed learn examples
  chargePracticeTotal: number;
  chargePracticeCorrect: number;
  chargePracticeStreak: number;
  chargeRoundCompleted: boolean; // completed at least one 6-element round
  compoundsBuilt: number;
  polyatomicCompleted: boolean; // completed polyatomic questions and builds
  formulasSolved: number;
  formulasStreak: number;
  homeworkCompleted?: boolean;
  homeworkScore?: number;
}

export type HomeworkSection = 'ion-charges' | 'binary-compounds' | 'polyatomic-ions' | 'mixed-formulas';

export interface HomeworkQuestion {
  id: string;
  section: HomeworkSection;
  sectionTitle: string;
  questionNumber: number;
  title: string;
  prompt: string;
  type: 'charge-prediction' | 'binary-build' | 'polyatomic-mcq' | 'formula-input';
  elementDetails?: {
    symbol: string;
    name: string;
    group: number;
    valenceElectrons: number;
    typicalCharge: number;
    type: 'metal' | 'nonmetal';
  };
  pairDetails?: {
    cationSymbol: string;
    cationName: string;
    cationCharge: number;
    anionSymbol: string;
    anionName: string;
    anionCharge: number;
    cationCount: number;
    anionCount: number;
  };
  options?: string[];
  correctAnswer: string;
  displayCorrectAnswer: string;
  explanation: string;
  conceptSummary: string;
}

export interface HomeworkAnswer {
  questionId: string;
  studentAnswer: string;
  displayAnswer: string;
  isCorrect: boolean;
  answeredAt: string;
}

