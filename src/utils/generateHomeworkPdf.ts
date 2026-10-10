import { jsPDF } from 'jspdf';
import { HomeworkQuestion, HomeworkAnswer } from '../types';

export interface GeneratePdfOptions {
  studentName: string;
  classPeriod: string;
  teacherName: string;
  date: string;
  questions: HomeworkQuestion[];
  answers: Record<string, HomeworkAnswer>;
}

// Converts unicode chemical symbols into clean standard text safe for standard PDF fonts
export function toPdfSafeChemicalText(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
    '⁺': '(+)', '⁻': '(-)',
    '¹⁺': '(1+)', '²⁺': '(2+)', '³⁺': '(3+)', '⁴⁺': '(4+)',
    '¹⁻': '(1-)', '²⁻': '(2-)', '³⁻': '(3-)', '⁴⁻': '(4-)',
    '·': '-', '→': '->', '✓': '[OK]', '✗': '[X]',
  };
  return text.replace(/[₀-₉⁺⁻¹²³⁴·→✓✗]/g, (char) => map[char] || char);
}

export function generateHomeworkPdf(options: GeneratePdfOptions): void {
  const {
    studentName,
    classPeriod,
    teacherName,
    date,
    questions,
    answers,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawHeaderSmall();
    }
  };

  const drawHeaderSmall = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Ionic Bonding Homework Submission · Student: ${toPdfSafeChemicalText(studentName || 'Student')} · ${date}`, margin, y);
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 7;
  };

  // --- TOP TITLE BANNER ---
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('IONIC BONDING & CHEMICAL FORMULAS', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // Slate-300
  doc.text('Homework Assignment Submission · Upload to Toddle for Teacher Grading', margin + 6, y + 14);

  // Status Badge on the right
  const answeredCount = Object.keys(answers).length;
  doc.setFillColor(79, 70, 229); // Indigo-600
  doc.roundedRect(margin + contentWidth - 46, y + 4, 42, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`${answeredCount} / ${questions.length} Answered`, margin + contentWidth - 25, y + 11.5, { align: 'center' });

  y += 24;

  // --- STUDENT INFO CARD ---
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // Slate-700

  // Left col
  doc.text('Student Name:', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(toPdfSafeChemicalText(studentName || 'Not specified'), margin + 30, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Class / Period:', margin + 4, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(toPdfSafeChemicalText(classPeriod || 'Not specified'), margin + 30, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Teacher:', margin + 4, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(toPdfSafeChemicalText(teacherName || 'Not specified'), margin + 30, y + 18);

  // Right col
  const midX = margin + contentWidth / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Submission Date:', midX, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(date, midX + 32, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Assignment Status:', midX, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 140, 70);
  doc.text(answeredCount === questions.length ? 'Completed (Ready for Toddle)' : `${answeredCount} of ${questions.length} Responses Submitted`, midX + 32, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Teacher Grade:', midX, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('________ / 15 pts', midX + 32, y + 18);

  y += 28;

  // --- SECTION BREAKDOWN SUMMARY ---
  const sections = [
    { title: 'Part 1: Charges & Transfers (Q1-4)', items: questions.filter(q => q.section === 'ion-charges') },
    { title: 'Part 2: Compounds & Ratios (Q5-8)', items: questions.filter(q => q.section === 'binary-compounds') },
    { title: 'Part 3: Polyatomics & Parentheses (Q9-12)', items: questions.filter(q => q.section === 'polyatomic-ions') },
    { title: 'Part 4: Mixed Formulas (Q13-15)', items: questions.filter(q => q.section === 'mixed-formulas') },
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('Assignment Overview by Section', margin, y);
  y += 4;

  const colWidth = contentWidth / 4;
  sections.forEach((sec, idx) => {
    const secAnswered = sec.items.filter(item => answers[item.id]?.studentAnswer?.trim()).length;
    const secTotal = sec.items.length;
    const secX = margin + idx * colWidth;

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(secX + 1, y, colWidth - 2, 12, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Part ${idx + 1}`, secX + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`${secAnswered} / ${secTotal} Submitted`, secX + 3, y + 9.5);
  });

  y += 16;

  // --- STUDENT RESPONSES LOG (ALL OPTIONS SHOWN FOR MCQS, NO ANSWER KEY SPOILERS) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Student Question Responses', margin, y);
  y += 5;

  let currentSection = '';

  questions.forEach((q) => {
    // Print section header if changed
    if (q.sectionTitle !== currentSection) {
      currentSection = q.sectionTitle;
      checkPageBreak(14);
      y += 2;
      doc.setFillColor(224, 231, 255); // Indigo-100
      doc.roundedRect(margin, y, contentWidth, 6, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(49, 46, 129); // Indigo-900
      doc.text(toPdfSafeChemicalText(currentSection.toUpperCase()), margin + 3, y + 4.2);
      y += 8;
    }

    const answerRecord = answers[q.id];
    const studentAns = (answerRecord?.displayAnswer || answerRecord?.studentAnswer || '').trim();
    const hasAnswer = studentAns.length > 0;

    const isMcq = !!(q.options && q.options.length > 0);

    // Compute Prompt Lines
    doc.setFontSize(8.5);
    const promptLines = doc.splitTextToSize(`Q${q.questionNumber}. ${toPdfSafeChemicalText(q.prompt)}`, contentWidth - 8);

    interface McqOptionRender {
      letter: string;
      isSelected: boolean;
      lines: string[];
    }

    const mcqRenders: McqOptionRender[] = [];
    let optionsHeight = 0;

    if (isMcq && q.options) {
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const isSelected = hasAnswer && (
          studentAns === opt.trim() ||
          studentAns.toLowerCase() === opt.trim().toLowerCase() ||
          opt.trim().startsWith(studentAns) ||
          studentAns.startsWith(opt.trim())
        );

        const prefix = isSelected ? `[X] (${letter}) ` : `[ ] (${letter}) `;
        const suffix = isSelected ? '   [STUDENT PICKED]' : '';
        const lines = doc.splitTextToSize(prefix + toPdfSafeChemicalText(opt) + suffix, contentWidth - 12);
        mcqRenders.push({ letter, isSelected, lines });
        optionsHeight += lines.length * 3.4 + 2.2;
      });
    }

    let qBoxHeight = 0;
    if (isMcq) {
      // Prompt + choices header + options list + student selection summary + teacher score line + paddings
      qBoxHeight = 12 + promptLines.length * 3.6 + 5 + optionsHeight + 6 + 7;
    } else {
      const ansLines = doc.splitTextToSize(hasAnswer ? toPdfSafeChemicalText(studentAns) : '(No response provided)', contentWidth - 44);
      qBoxHeight = 14 + promptLines.length * 3.6 + Math.max(ansLines.length * 3.5, 4.5) + 8;
    }

    checkPageBreak(qBoxHeight + 4);

    // Question container box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, qBoxHeight, 1.5, 1.5, 'FD');

    // Title & prompt
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(promptLines, margin + 4, y + 4.5);

    let innerY = y + 5 + promptLines.length * 3.6;

    if (isMcq && q.options) {
      // Header for choices
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Multiple Choice Options (Student selection marked with [X]):', margin + 4, innerY);
      innerY += 4.5;

      // Render each option
      mcqRenders.forEach((item) => {
        const itemBoxHeight = item.lines.length * 3.4 + 1.2;

        if (item.isSelected) {
          // Subtle highlight box behind student's picked option
          doc.setFillColor(238, 242, 255); // Indigo-50
          doc.setDrawColor(199, 210, 254); // Indigo-200
          doc.setLineWidth(0.2);
          doc.roundedRect(margin + 3, innerY - 2.5, contentWidth - 6, itemBoxHeight + 1, 1, 1, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.8);
          doc.setTextColor(49, 46, 129); // Indigo-900
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.8);
          doc.setTextColor(71, 85, 105); // Slate-600
        }

        doc.text(item.lines, margin + 5, innerY);
        innerY += itemBoxHeight + 1.2;
      });

      // Selection summary line
      const chosen = mcqRenders.find(it => it.isSelected);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      if (chosen) {
        doc.setTextColor(15, 23, 42);
        doc.text(`Student Selection: Option (${chosen.letter})`, margin + 4, innerY);
      } else {
        doc.setTextColor(148, 163, 184);
        doc.text("Student Selection: (No option chosen)", margin + 4, innerY);
      }
      innerY += 5.5;
    } else {
      // Free-response formula writing
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("Student's Response:", margin + 4, innerY);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42); // Slate-900
      const ansLines = doc.splitTextToSize(hasAnswer ? toPdfSafeChemicalText(studentAns) : '(No response provided)', contentWidth - 44);
      doc.text(ansLines, margin + 38, innerY);

      innerY += Math.max(ansLines.length * 3.5, 4.5) + 3;
    }

    // Teacher scoring line (blank for grading)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Score: [  / 1 pt ]     Teacher Feedback / Notes: ____________________________________________________________________', margin + 4, innerY);

    y += qBoxHeight + 3.5;
  });

  // --- TEACHER SIGNATURE & FINAL GRADE BLOCK ---
  checkPageBreak(28);
  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Teacher / Grader Assessment & Final Grade', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Teacher Signature: _____________________________________', margin + 4, y + 12);
  doc.text('Date Graded: _______________________', margin + contentWidth - 62, y + 12);
  doc.text('Final Assignment Score: _________ / 15 points        Letter Grade: _________', margin + 4, y + 17);

  // --- PAGE NUMBERING & FOOTER ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Ionic Bonding Challenge · Student Homework Submission (Upload to Toddle) · Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // Sanitize student name for filename
  const cleanName = (studentName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Ionic_Bonding_Homework_${cleanName}.pdf`;

  // Trigger download
  doc.save(filename);
}
