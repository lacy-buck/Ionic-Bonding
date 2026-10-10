export type ElementCategory =
  | 'alkali'
  | 'alkaline'
  | 'transition'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export interface PeriodicElement {
  num: number;
  sym: string;
  name: string;
  mass: string;
  group: number; // 1-18 (0 for f-block)
  period: number; // 1-7
  cat: ElementCategory;
  phase?: 'Gas' | 'Liquid' | 'Solid' | 'Synthetic';
  fBlockIndex?: number; // 1-15 for lanthanides/actinides
}

export const CATEGORY_STYLES: Record<
  ElementCategory,
  { label: string; bg: string; text: string; border: string; cellBg: string }
> = {
  alkali: {
    label: 'Alkali Metals',
    bg: 'bg-red-500',
    text: 'text-red-900',
    border: 'border-red-300',
    cellBg: 'bg-red-50/90 hover:bg-red-100 text-red-950 border-red-200',
  },
  alkaline: {
    label: 'Alkaline Earth',
    bg: 'bg-amber-500',
    text: 'text-amber-900',
    border: 'border-amber-300',
    cellBg: 'bg-amber-50/90 hover:bg-amber-100 text-amber-950 border-amber-200',
  },
  transition: {
    label: 'Transition Metals',
    bg: 'bg-blue-500',
    text: 'text-blue-900',
    border: 'border-blue-300',
    cellBg: 'bg-blue-50/90 hover:bg-blue-100 text-blue-950 border-blue-200',
  },
  'post-transition': {
    label: 'Post-Transition Metals',
    bg: 'bg-emerald-500',
    text: 'text-emerald-900',
    border: 'border-emerald-300',
    cellBg: 'bg-emerald-50/90 hover:bg-emerald-100 text-emerald-950 border-emerald-200',
  },
  metalloid: {
    label: 'Metalloids',
    bg: 'bg-teal-500',
    text: 'text-teal-900',
    border: 'border-teal-300',
    cellBg: 'bg-teal-50/90 hover:bg-teal-100 text-teal-950 border-teal-200',
  },
  nonmetal: {
    label: 'Reactive Nonmetals',
    bg: 'bg-sky-500',
    text: 'text-sky-900',
    border: 'border-sky-300',
    cellBg: 'bg-sky-50/90 hover:bg-sky-100 text-sky-950 border-sky-200',
  },
  halogen: {
    label: 'Halogens',
    bg: 'bg-purple-500',
    text: 'text-purple-900',
    border: 'border-purple-300',
    cellBg: 'bg-purple-50/90 hover:bg-purple-100 text-purple-950 border-purple-200',
  },
  'noble-gas': {
    label: 'Noble Gases',
    bg: 'bg-slate-500',
    text: 'text-slate-900',
    border: 'border-slate-300',
    cellBg: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300',
  },
  lanthanide: {
    label: 'Lanthanides',
    bg: 'bg-pink-500',
    text: 'text-pink-900',
    border: 'border-pink-300',
    cellBg: 'bg-pink-50/90 hover:bg-pink-100 text-pink-950 border-pink-200',
  },
  actinide: {
    label: 'Actinides',
    bg: 'bg-orange-500',
    text: 'text-orange-900',
    border: 'border-orange-300',
    cellBg: 'bg-orange-50/90 hover:bg-orange-100 text-orange-950 border-orange-200',
  },
};

// Full IUPAC 118 Elements (Periods 1-7, Groups 1-18 + Lanthanides & Actinides)
// NO CHARGES INCLUDED
export const FULL_PERIODIC_TABLE: PeriodicElement[] = [
  // Period 1
  { num: 1, sym: 'H', name: 'Hydrogen', mass: '1.008', group: 1, period: 1, cat: 'nonmetal', phase: 'Gas' },
  { num: 2, sym: 'He', name: 'Helium', mass: '4.0026', group: 18, period: 1, cat: 'noble-gas', phase: 'Gas' },

  // Period 2
  { num: 3, sym: 'Li', name: 'Lithium', mass: '6.94', group: 1, period: 2, cat: 'alkali', phase: 'Solid' },
  { num: 4, sym: 'Be', name: 'Beryllium', mass: '9.0122', group: 2, period: 2, cat: 'alkaline', phase: 'Solid' },
  { num: 5, sym: 'B', name: 'Boron', mass: '10.81', group: 13, period: 2, cat: 'metalloid', phase: 'Solid' },
  { num: 6, sym: 'C', name: 'Carbon', mass: '12.011', group: 14, period: 2, cat: 'nonmetal', phase: 'Solid' },
  { num: 7, sym: 'N', name: 'Nitrogen', mass: '14.007', group: 15, period: 2, cat: 'nonmetal', phase: 'Gas' },
  { num: 8, sym: 'O', name: 'Oxygen', mass: '15.999', group: 16, period: 2, cat: 'nonmetal', phase: 'Gas' },
  { num: 9, sym: 'F', name: 'Fluorine', mass: '18.998', group: 17, period: 2, cat: 'halogen', phase: 'Gas' },
  { num: 10, sym: 'Ne', name: 'Neon', mass: '20.180', group: 18, period: 2, cat: 'noble-gas', phase: 'Gas' },

  // Period 3
  { num: 11, sym: 'Na', name: 'Sodium', mass: '22.990', group: 1, period: 3, cat: 'alkali', phase: 'Solid' },
  { num: 12, sym: 'Mg', name: 'Magnesium', mass: '24.305', group: 2, period: 3, cat: 'alkaline', phase: 'Solid' },
  { num: 13, sym: 'Al', name: 'Aluminum', mass: '26.982', group: 13, period: 3, cat: 'post-transition', phase: 'Solid' },
  { num: 14, sym: 'Si', name: 'Silicon', mass: '28.085', group: 14, period: 3, cat: 'metalloid', phase: 'Solid' },
  { num: 15, sym: 'P', name: 'Phosphorus', mass: '30.974', group: 15, period: 3, cat: 'nonmetal', phase: 'Solid' },
  { num: 16, sym: 'S', name: 'Sulfur', mass: '32.06', group: 16, period: 3, cat: 'nonmetal', phase: 'Solid' },
  { num: 17, sym: 'Cl', name: 'Chlorine', mass: '35.45', group: 17, period: 3, cat: 'halogen', phase: 'Gas' },
  { num: 18, sym: 'Ar', name: 'Argon', mass: '39.948', group: 18, period: 3, cat: 'noble-gas', phase: 'Gas' },

  // Period 4
  { num: 19, sym: 'K', name: 'Potassium', mass: '39.098', group: 1, period: 4, cat: 'alkali', phase: 'Solid' },
  { num: 20, sym: 'Ca', name: 'Calcium', mass: '40.078', group: 2, period: 4, cat: 'alkaline', phase: 'Solid' },
  { num: 21, sym: 'Sc', name: 'Scandium', mass: '44.956', group: 3, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 22, sym: 'Ti', name: 'Titanium', mass: '47.867', group: 4, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 23, sym: 'V', name: 'Vanadium', mass: '50.942', group: 5, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 24, sym: 'Cr', name: 'Chromium', mass: '51.996', group: 6, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 25, sym: 'Mn', name: 'Manganese', mass: '54.938', group: 7, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 26, sym: 'Fe', name: 'Iron', mass: '55.845', group: 8, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 27, sym: 'Co', name: 'Cobalt', mass: '58.933', group: 9, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 28, sym: 'Ni', name: 'Nickel', mass: '58.693', group: 10, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 29, sym: 'Cu', name: 'Copper', mass: '63.546', group: 11, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 30, sym: 'Zn', name: 'Zinc', mass: '65.38', group: 12, period: 4, cat: 'transition', phase: 'Solid' },
  { num: 31, sym: 'Ga', name: 'Gallium', mass: '69.723', group: 13, period: 4, cat: 'post-transition', phase: 'Solid' },
  { num: 32, sym: 'Ge', name: 'Germanium', mass: '72.630', group: 14, period: 4, cat: 'metalloid', phase: 'Solid' },
  { num: 33, sym: 'As', name: 'Arsenic', mass: '74.922', group: 15, period: 4, cat: 'metalloid', phase: 'Solid' },
  { num: 34, sym: 'Se', name: 'Selenium', mass: '78.971', group: 16, period: 4, cat: 'nonmetal', phase: 'Solid' },
  { num: 35, sym: 'Br', name: 'Bromine', mass: '79.904', group: 17, period: 4, cat: 'halogen', phase: 'Liquid' },
  { num: 36, sym: 'Kr', name: 'Krypton', mass: '83.798', group: 18, period: 4, cat: 'noble-gas', phase: 'Gas' },

  // Period 5
  { num: 37, sym: 'Rb', name: 'Rubidium', mass: '85.468', group: 1, period: 5, cat: 'alkali', phase: 'Solid' },
  { num: 38, sym: 'Sr', name: 'Strontium', mass: '87.62', group: 2, period: 5, cat: 'alkaline', phase: 'Solid' },
  { num: 39, sym: 'Y', name: 'Yttrium', mass: '88.906', group: 3, period: 5, cat: 'transition', phase: 'Solid' },
  { num: 40, sym: 'Zr', name: 'Zirconium', mass: '91.224', group: 4, period: 5, cat: 'transition', phase: 'Solid' },
  { num: 41, sym: 'Nb', name: 'Niobium', mass: '92.906', group: 5, period: 5, cat: 'transition', phase: 'Solid' },
  { num: 42, sym: 'Mo', name: 'Molybdenum', mass: '95.95', group: 6, period: 5, cat: 'transition', phase: 'Solid' },
  { num: 43, sym: 'Tc', name: 'Technetium', mass: '(98)', group: 7, period: 5, cat: 'transition', phase: 'Synthetic' },
  { num: 44, sym: 'Ru', name: 'Ruthenium', mass: '101.07', group: 8, period: 5, cat: 'transition', phase: 'Solid' },
  { num: 45, sym: 'Rh', name: 'Rhodium', mass: '102.91', group: 9, period: 5, cat: 'transition', phase: 'Solid' },
  { num: 46, sym: 'Pd', name: 'Palladium', mass: '106.42', group: 10, period: 5, cat: 'transition', phase: 'Solid' },
  { num: 47, sym: 'Ag', name: 'Silver', mass: '107.87', group: 11, period: 5, cat: 'transition', phase: 'Solid' },
  { num: 48, sym: 'Cd', name: 'Cadmium', mass: '112.41', group: 12, period: 5, cat: 'transition', phase: 'Solid' },
  { num: 49, sym: 'In', name: 'Indium', mass: '114.82', group: 13, period: 5, cat: 'post-transition', phase: 'Solid' },
  { num: 50, sym: 'Sn', name: 'Tin', mass: '118.71', group: 14, period: 5, cat: 'post-transition', phase: 'Solid' },
  { num: 51, sym: 'Sb', name: 'Antimony', mass: '121.76', group: 15, period: 5, cat: 'metalloid', phase: 'Solid' },
  { num: 52, sym: 'Te', name: 'Tellurium', mass: '127.60', group: 16, period: 5, cat: 'metalloid', phase: 'Solid' },
  { num: 53, sym: 'I', name: 'Iodine', mass: '126.90', group: 17, period: 5, cat: 'halogen', phase: 'Solid' },
  { num: 54, sym: 'Xe', name: 'Xenon', mass: '131.29', group: 18, period: 5, cat: 'noble-gas', phase: 'Gas' },

  // Period 6
  { num: 55, sym: 'Cs', name: 'Cesium', mass: '132.91', group: 1, period: 6, cat: 'alkali', phase: 'Solid' },
  { num: 56, sym: 'Ba', name: 'Barium', mass: '137.33', group: 2, period: 6, cat: 'alkaline', phase: 'Solid' },
  // Lanthanides (57-71)
  { num: 57, sym: 'La', name: 'Lanthanum', mass: '138.91', group: 3, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 1 },
  { num: 58, sym: 'Ce', name: 'Cerium', mass: '140.12', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 2 },
  { num: 59, sym: 'Pr', name: 'Praseodymium', mass: '140.91', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 3 },
  { num: 60, sym: 'Nd', name: 'Neodymium', mass: '144.24', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 4 },
  { num: 61, sym: 'Pm', name: 'Promethium', mass: '(145)', group: 0, period: 6, cat: 'lanthanide', phase: 'Synthetic', fBlockIndex: 5 },
  { num: 62, sym: 'Sm', name: 'Samarium', mass: '150.36', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 6 },
  { num: 63, sym: 'Eu', name: 'Europium', mass: '151.96', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 7 },
  { num: 64, sym: 'Gd', name: 'Gadolinium', mass: '157.25', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 8 },
  { num: 65, sym: 'Tb', name: 'Terbium', mass: '158.93', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 9 },
  { num: 66, sym: 'Dy', name: 'Dysprosium', mass: '162.50', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 10 },
  { num: 67, sym: 'Ho', name: 'Holmium', mass: '164.93', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 11 },
  { num: 68, sym: 'Er', name: 'Erbium', mass: '167.26', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 12 },
  { num: 69, sym: 'Tm', name: 'Thulium', mass: '168.93', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 13 },
  { num: 70, sym: 'Yb', name: 'Ytterbium', mass: '173.05', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 14 },
  { num: 71, sym: 'Lu', name: 'Lutetium', mass: '174.97', group: 0, period: 6, cat: 'lanthanide', phase: 'Solid', fBlockIndex: 15 },
  // Period 6 post-lanthanides
  { num: 72, sym: 'Hf', name: 'Hafnium', mass: '178.49', group: 4, period: 6, cat: 'transition', phase: 'Solid' },
  { num: 73, sym: 'Ta', name: 'Tantalum', mass: '180.95', group: 5, period: 6, cat: 'transition', phase: 'Solid' },
  { num: 74, sym: 'W', name: 'Tungsten', mass: '183.84', group: 6, period: 6, cat: 'transition', phase: 'Solid' },
  { num: 75, sym: 'Re', name: 'Rhenium', mass: '186.21', group: 7, period: 6, cat: 'transition', phase: 'Solid' },
  { num: 76, sym: 'Os', name: 'Osmium', mass: '190.23', group: 8, period: 6, cat: 'transition', phase: 'Solid' },
  { num: 77, sym: 'Ir', name: 'Iridium', mass: '192.22', group: 9, period: 6, cat: 'transition', phase: 'Solid' },
  { num: 78, sym: 'Pt', name: 'Platinum', mass: '195.08', group: 10, period: 6, cat: 'transition', phase: 'Solid' },
  { num: 79, sym: 'Au', name: 'Gold', mass: '196.97', group: 11, period: 6, cat: 'transition', phase: 'Solid' },
  { num: 80, sym: 'Hg', name: 'Mercury', mass: '200.59', group: 12, period: 6, cat: 'transition', phase: 'Liquid' },
  { num: 81, sym: 'Tl', name: 'Thallium', mass: '204.38', group: 13, period: 6, cat: 'post-transition', phase: 'Solid' },
  { num: 82, sym: 'Pb', name: 'Lead', mass: '207.2', group: 14, period: 6, cat: 'post-transition', phase: 'Solid' },
  { num: 83, sym: 'Bi', name: 'Bismuth', mass: '208.98', group: 15, period: 6, cat: 'post-transition', phase: 'Solid' },
  { num: 84, sym: 'Po', name: 'Polonium', mass: '(209)', group: 16, period: 6, cat: 'post-transition', phase: 'Solid' },
  { num: 85, sym: 'At', name: 'Astatine', mass: '(210)', group: 17, period: 6, cat: 'halogen', phase: 'Solid' },
  { num: 86, sym: 'Rn', name: 'Radon', mass: '(222)', group: 18, period: 6, cat: 'noble-gas', phase: 'Gas' },

  // Period 7
  { num: 87, sym: 'Fr', name: 'Francium', mass: '(223)', group: 1, period: 7, cat: 'alkali', phase: 'Solid' },
  { num: 88, sym: 'Ra', name: 'Radium', mass: '(226)', group: 2, period: 7, cat: 'alkaline', phase: 'Solid' },
  // Actinides (89-103)
  { num: 89, sym: 'Ac', name: 'Actinium', mass: '(227)', group: 3, period: 7, cat: 'actinide', phase: 'Solid', fBlockIndex: 1 },
  { num: 90, sym: 'Th', name: 'Thorium', mass: '232.04', group: 0, period: 7, cat: 'actinide', phase: 'Solid', fBlockIndex: 2 },
  { num: 91, sym: 'Pa', name: 'Protactinium', mass: '231.04', group: 0, period: 7, cat: 'actinide', phase: 'Solid', fBlockIndex: 3 },
  { num: 92, sym: 'U', name: 'Uranium', mass: '238.03', group: 0, period: 7, cat: 'actinide', phase: 'Solid', fBlockIndex: 4 },
  { num: 93, sym: 'Np', name: 'Neptunium', mass: '(237)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 5 },
  { num: 94, sym: 'Pu', name: 'Plutonium', mass: '(244)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 6 },
  { num: 95, sym: 'Am', name: 'Americium', mass: '(243)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 7 },
  { num: 96, sym: 'Cm', name: 'Curium', mass: '(247)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 8 },
  { num: 97, sym: 'Bk', name: 'Berkelium', mass: '(247)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 9 },
  { num: 98, sym: 'Cf', name: 'Californium', mass: '(251)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 10 },
  { num: 99, sym: 'Es', name: 'Einsteinium', mass: '(252)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 11 },
  { num: 100, sym: 'Fm', name: 'Fermium', mass: '(257)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 12 },
  { num: 101, sym: 'Md', name: 'Mendelevium', mass: '(258)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 13 },
  { num: 102, sym: 'No', name: 'Nobelium', mass: '(259)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 14 },
  { num: 103, sym: 'Lr', name: 'Lawrencium', mass: '(266)', group: 0, period: 7, cat: 'actinide', phase: 'Synthetic', fBlockIndex: 15 },
  // Period 7 post-actinides
  { num: 104, sym: 'Rf', name: 'Rutherfordium', mass: '(267)', group: 4, period: 7, cat: 'transition', phase: 'Synthetic' },
  { num: 105, sym: 'Db', name: 'Dubnium', mass: '(268)', group: 5, period: 7, cat: 'transition', phase: 'Synthetic' },
  { num: 106, sym: 'Sg', name: 'Seaborgium', mass: '(269)', group: 6, period: 7, cat: 'transition', phase: 'Synthetic' },
  { num: 107, sym: 'Bh', name: 'Bohrium', mass: '(270)', group: 7, period: 7, cat: 'transition', phase: 'Synthetic' },
  { num: 108, sym: 'Hs', name: 'Hassium', mass: '(270)', group: 8, period: 7, cat: 'transition', phase: 'Synthetic' },
  { num: 109, sym: 'Mt', name: 'Meitnerium', mass: '(278)', group: 9, period: 7, cat: 'transition', phase: 'Synthetic' },
  { num: 110, sym: 'Ds', name: 'Darmstadtium', mass: '(281)', group: 10, period: 7, cat: 'transition', phase: 'Synthetic' },
  { num: 111, sym: 'Rg', name: 'Roentgenium', mass: '(282)', group: 11, period: 7, cat: 'transition', phase: 'Synthetic' },
  { num: 112, sym: 'Cn', name: 'Copernicium', mass: '(285)', group: 12, period: 7, cat: 'transition', phase: 'Synthetic' },
  { num: 113, sym: 'Nh', name: 'Nihonium', mass: '(286)', group: 13, period: 7, cat: 'post-transition', phase: 'Synthetic' },
  { num: 114, sym: 'Fl', name: 'Flerovium', mass: '(289)', group: 14, period: 7, cat: 'post-transition', phase: 'Synthetic' },
  { num: 115, sym: 'Mc', name: 'Moscovium', mass: '(290)', group: 15, period: 7, cat: 'post-transition', phase: 'Synthetic' },
  { num: 116, sym: 'Lv', name: 'Livermorium', mass: '(293)', group: 16, period: 7, cat: 'post-transition', phase: 'Synthetic' },
  { num: 117, sym: 'Ts', name: 'Tennessine', mass: '(294)', group: 17, period: 7, cat: 'halogen', phase: 'Synthetic' },
  { num: 118, sym: 'Og', name: 'Oganesson', mass: '(294)', group: 18, period: 7, cat: 'noble-gas', phase: 'Synthetic' },
];

export const LANTHANIDES = FULL_PERIODIC_TABLE.filter((e) => e.cat === 'lanthanide');
export const ACTINIDES = FULL_PERIODIC_TABLE.filter((e) => e.cat === 'actinide');

// Helper to look up an element in the main grid (groups 1-18, periods 1-7)
export function getMainGridElement(period: number, group: number): PeriodicElement | null {
  // Group 3, Period 6 slot is marked for Lanthanides (57-71)
  // Group 3, Period 7 slot is marked for Actinides (89-103)
  return FULL_PERIODIC_TABLE.find((e) => e.period === period && e.group === group) || null;
}
