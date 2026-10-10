import React, { useState, useEffect } from 'react';
import { HOMEWORK_QUESTIONS } from '../data/homeworkData';
import { HomeworkQuestion, HomeworkAnswer } from '../types';
import { FormulaInput } from './FormulaInput';
import { generateHomeworkPdf } from '../utils/generateHomeworkPdf';
import { toSubscripts } from '../data/chemistry';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  User,
  GraduationCap,
  Calendar,
  ChevronRight,
  BookOpen,
  Edit3
} from 'lucide-react';

interface FinalHomeworkPracticeProps {
  onCompleteHomework?: (answeredCount: number) => void;
  onOpenReference: () => void;
  onOpenReading: () => void;
}

const STORAGE_HOMEWORK_ANSWERS = 'ionic_bonding_hw_answers_v2';
const STORAGE_STUDENT_INFO = 'ionic_bonding_hw_student_info_v2';

export const FinalHomeworkPractice: React.FC<FinalHomeworkPracticeProps> = ({
  onCompleteHomework,
  onOpenReference,
  onOpenReading,
}) => {
  // Student Metadata
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_STUDENT_INFO + '_name') || '';
    } catch {
      return '';
    }
  });

  const [classPeriod, setClassPeriod] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_STUDENT_INFO + '_period') || 'Period 1 - Chemistry';
    } catch {
      return 'Period 1 - Chemistry';
    }
  });

  const [teacherName, setTeacherName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_STUDENT_INFO + '_teacher') || '';
    } catch {
      return '';
    }
  });

  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  // Navigation state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'stepper' | 'all' | 'summary'>('stepper');
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  // Student answers map: questionId -> HomeworkAnswer
  const [answers, setAnswers] = useState<Record<string, HomeworkAnswer>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HOMEWORK_ANSWERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  // Current draft inputs for the active question
  const [formulaDraft, setFormulaDraft] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);

  const currentQ = HOMEWORK_QUESTIONS[currentQuestionIdx];

  // Sync draft input whenever active question changes
  useEffect(() => {
    const existing = answers[currentQ.id];
    if (existing) {
      if (currentQ.type === 'formula-input') {
        setFormulaDraft(existing.displayAnswer || existing.studentAnswer);
      } else {
        setSelectedOption(existing.studentAnswer);
      }
      setSaveStatusMsg(`Saved Response: ${existing.displayAnswer || existing.studentAnswer}`);
    } else {
      setFormulaDraft('');
      setSelectedOption('');
      setSaveStatusMsg(null);
    }
  }, [currentQuestionIdx, currentQ.id, currentQ.type]);

  // Persist answers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HOMEWORK_ANSWERS, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers]);

  // Persist student info
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STUDENT_INFO + '_name', studentName);
      localStorage.setItem(STORAGE_STUDENT_INFO + '_period', classPeriod);
      localStorage.setItem(STORAGE_STUDENT_INFO + '_teacher', teacherName);
    } catch {
      // ignore
    }
  }, [studentName, classPeriod, teacherName]);

  // Auto-dismiss download notice
  useEffect(() => {
    if (!downloadSuccessNotice) return;
    const t = setTimeout(() => setDownloadSuccessNotice(null), 6000);
    return () => clearTimeout(t);
  }, [downloadSuccessNotice]);

  const totalQuestions = HOMEWORK_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;

  const handleRecordAnswer = () => {
    const inputVal = currentQ.type === 'formula-input' ? formulaDraft : selectedOption;
    if (!inputVal.trim()) {
      setSaveStatusMsg('Please select or write a response before saving.');
      return;
    }

    const displayAns = currentQ.type === 'formula-input' ? toSubscripts(inputVal.trim()) : inputVal.trim();
    const newAnswer: HomeworkAnswer = {
      questionId: currentQ.id,
      studentAnswer: inputVal.trim(),
      displayAnswer: displayAns,
      isCorrect: true, // internal flag, never displayed or used to reveal answers
      answeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: newAnswer,
    }));

    setSaveStatusMsg(`✓ Response recorded: ${displayAns}`);

    if (onCompleteHomework) {
      const updatedCount = Object.keys({ ...answers, [currentQ.id]: newAnswer }).length;
      onCompleteHomework(updatedCount);
    }
  };

  const handleNextQuestion = () => {
    const inputVal = currentQ.type === 'formula-input' ? formulaDraft : selectedOption;
    if (inputVal.trim()) {
      handleRecordAnswer();
    }
    if (currentQuestionIdx < HOMEWORK_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setViewMode('summary');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleDownloadPdf = () => {
    if (!studentName.trim()) {
      alert('Please enter your Student Name in the header before generating your homework PDF.');
      return;
    }

    generateHomeworkPdf({
      studentName: studentName.trim(),
      classPeriod: classPeriod.trim(),
      teacherName: teacherName.trim(),
      date,
      questions: HOMEWORK_QUESTIONS,
      answers,
    });

    setDownloadSuccessNotice(
      `Homework PDF downloaded successfully for ${studentName}! Only your responses are recorded in the PDF for teacher grading. Please upload this document to Toddle.`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetHomework = () => {
    if (window.confirm('Are you sure you want to clear your homework responses? You will be able to start fresh with all 15 questions.')) {
      setAnswers({});
      setFormulaDraft('');
      setSelectedOption('');
      setSaveStatusMsg(null);
      setCurrentQuestionIdx(0);
      try {
        localStorage.removeItem(STORAGE_HOMEWORK_ANSWERS);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner & Submission Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                <FileText className="w-3.5 h-3.5" />
                Final Homework Assignment
              </span>
              <span className="text-xs text-slate-500 font-medium">
                15 Rigorous Mixed Questions · Student Submission
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              Ionic Bonding & Formula Writing Homework
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Complete all 15 questions below. When finished, export your responses into an official homework PDF and upload this document to Toddle for grading.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              title="Generate and download homework PDF with your responses"
            >
              <Download className="w-4 h-4" />
              <span>Download Homework PDF</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
              title="Print or Save as PDF via browser"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save</span>
            </button>
          </div>
        </div>

        {/* Student Information Fields for PDF Report Header */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-indigo-600" />
              Student Full Name *
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-indigo-600" />
              Class / Period
            </label>
            <input
              type="text"
              value={classPeriod}
              onChange={(e) => setClassPeriod(e.target.value)}
              placeholder="e.g. Period 3 Chemistry"
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-indigo-600" />
              Teacher Name
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="e.g. Ms. Davis"
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-600" />
              Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200 outline-none"
            />
          </div>
        </div>

        {/* Live Progress Bar & Helper Links */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Progress:</span>
              <span className="font-bold font-mono text-indigo-600">{answeredCount} of {totalQuestions} Questions Answered</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              {answeredCount === totalQuestions ? '✓ Ready to Download & Submit' : `${totalQuestions - answeredCount} remaining`}
            </span>
          </div>

          {/* Quick Reference Links */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenReference}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Periodic Table</span>
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={onOpenReading}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Bonding Guide</span>
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={handleResetHomework}
              className="text-xs font-medium text-slate-400 hover:text-rose-600"
            >
              Clear Responses
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 transition-all duration-300 rounded-full"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Success Notification Alert */}
      {downloadSuccessNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs font-medium flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation View Switcher (Stepper vs Full Review vs Summary) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('stepper')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'stepper' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Question by Question
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'all' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            View All 15 Questions
          </button>
          <button
            type="button"
            onClick={() => setViewMode('summary')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'summary' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Review & Export PDF ({answeredCount}/15)
          </button>
        </div>

        {/* Question Pager Dots */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
          {HOMEWORK_QUESTIONS.map((q, idx) => {
            const hasAns = !!answers[q.id]?.studentAnswer?.trim();
            const isCurrent = idx === currentQuestionIdx && viewMode === 'stepper';

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setCurrentQuestionIdx(idx);
                  setViewMode('stepper');
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white shadow-2xs'
                    : hasAns
                    ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
                title={`Question ${idx + 1}: ${q.title}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: STEPPER (Focus on current question) */}
      {viewMode === 'stepper' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Question Title & Section Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                {currentQ.sectionTitle} · Question {currentQ.questionNumber} of 15
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {currentQ.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {answers[currentQ.id] ? (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Response Recorded</span>
                </span>
              ) : (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-slate-50 text-slate-500 border-slate-200">
                  Unanswered
                </span>
              )}
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
            {currentQ.prompt}
          </div>

          {/* Chemical Visual Card if available */}
          {currentQ.elementDetails && (
            <div className="inline-flex items-center gap-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs">
              <div className="w-10 h-10 rounded-lg bg-white border border-indigo-200 flex flex-col items-center justify-center font-bold text-indigo-900 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-mono leading-none">
                  {currentQ.elementDetails.symbol === 'P' ? '15' : currentQ.elementDetails.symbol === 'Ca' ? '20' : '31'}
                </span>
                <span className="text-base">{currentQ.elementDetails.symbol}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{currentQ.elementDetails.name}</span>
                <span className="text-slate-600">
                  Group {currentQ.elementDetails.group} · {currentQ.elementDetails.type}
                </span>
              </div>
            </div>
          )}

          {currentQ.pairDetails && (
            <div className="flex flex-wrap items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1.5 bg-sky-100 text-sky-900 font-bold rounded-lg border border-sky-200 font-mono text-sm">
                  {currentQ.pairDetails.cationSymbol}
                  <sup>{currentQ.pairDetails.cationCharge > 0 ? `+${currentQ.pairDetails.cationCharge}` : currentQ.pairDetails.cationCharge}</sup>
                </div>
                <span className="font-semibold text-slate-700">{currentQ.pairDetails.cationName} (Cation)</span>
              </div>
              <span className="text-slate-400 font-bold">+</span>
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1.5 bg-rose-100 text-rose-900 font-bold rounded-lg border border-rose-200 font-mono text-sm">
                  {currentQ.pairDetails.anionSymbol}
                  <sup>{currentQ.pairDetails.anionCharge > 0 ? `+${currentQ.pairDetails.anionCharge}` : currentQ.pairDetails.anionCharge}</sup>
                </div>
                <span className="font-semibold text-slate-700">{currentQ.pairDetails.anionName} (Anion)</span>
              </div>
            </div>
          )}

          {/* Answer Input Section */}
          <div className="space-y-4 pt-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Your Homework Response:
            </label>

            {currentQ.type === 'formula-input' ? (
              <div className="space-y-3">
                <FormulaInput
                  value={formulaDraft}
                  onChange={setFormulaDraft}
                  onSubmit={handleRecordAnswer}
                  placeholder="Type chemical formula (e.g. XY₂, Z₂O₃)..."
                />
                <p className="text-xs text-slate-500">
                  Tip: Subscript numbers are added automatically as you type, or you can click the keypad buttons.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options?.map((opt, oIdx) => {
                  const isChecked = selectedOption === opt;
                  return (
                    <label
                      key={oIdx}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={opt}
                        checked={isChecked}
                        onChange={() => setSelectedOption(opt)}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-800 leading-snug">
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Save Status Notification (WITHOUT revealing any answers) */}
          {saveStatusMsg && (
            <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold">{saveStatusMsg}</span>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIdx === 0}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Question</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRecordAnswer}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Save Response</span>
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="flex items-center justify-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <span>{currentQuestionIdx === HOMEWORK_QUESTIONS.length - 1 ? 'Go to Review & Export' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ALL QUESTIONS LIST */}
      {viewMode === 'all' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 border border-slate-200 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">All 15 Questions Overview</h3>
              <p className="text-xs text-slate-500">Jump to any question to edit or review your response</p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('summary')}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Review & Export PDF ({answeredCount}/15)
            </button>
          </div>

          <div className="space-y-4">
            {HOMEWORK_QUESTIONS.map((q, idx) => {
              const ans = answers[q.id];
              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Question {q.questionNumber} of 15 · {q.sectionTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentQuestionIdx(idx);
                        setViewMode('stepper');
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Edit Response</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{q.title}</h4>
                  <p className="text-xs text-slate-700">{q.prompt}</p>

                  {q.options && q.options.length > 0 ? (
                    <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Options:
                      </span>
                      {q.options.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx);
                        const isSelected = ans?.studentAnswer && (
                          ans.studentAnswer.trim() === opt.trim() ||
                          ans.studentAnswer.toLowerCase() === opt.trim().toLowerCase()
                        );
                        return (
                          <div
                            key={oIdx}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs ${
                              isSelected
                                ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold'
                                : 'text-slate-600'
                            }`}
                          >
                            <span className="font-mono font-bold text-[11px]">({letter})</span>
                            <span className="flex-1">{opt}</span>
                            {isSelected && (
                              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                                Picked
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Your Response: </span>
                      {ans?.studentAnswer?.trim() ? (
                        <span className="font-bold text-slate-900 font-mono">
                          {ans.displayAnswer || ans.studentAnswer}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not yet answered</span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      {ans?.studentAnswer?.trim() ? '✓ Saved for PDF' : 'Pending response'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: SUMMARY & PDF EXPORT */}
      {viewMode === 'summary' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Submission Verification
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                Homework Responses Ready for Export
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Verify your name and details, check your recorded responses, then download your official Homework PDF to submit to your teacher.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Homework PDF</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
            <div>
              <span className="text-slate-500 block">Student Name:</span>
              <span className="text-sm font-bold text-slate-900">
                {studentName || <span className="text-rose-500 italic">Please enter name above</span>}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Class / Period:</span>
              <span className="text-sm font-bold text-slate-900">{classPeriod}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Teacher Name:</span>
              <span className="text-sm font-bold text-slate-900">{teacherName || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Completed:</span>
              <span className="text-sm font-bold text-indigo-600 font-mono">
                {answeredCount} of {totalQuestions} Questions Answered
              </span>
            </div>
          </div>

          {/* Section Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { title: 'Part 1: Charges & Transfers', items: HOMEWORK_QUESTIONS.filter((q) => q.section === 'ion-charges') },
              { title: 'Part 2: Compounds & Ratios', items: HOMEWORK_QUESTIONS.filter((q) => q.section === 'binary-compounds') },
              { title: 'Part 3: Polyatomics & Parentheses', items: HOMEWORK_QUESTIONS.filter((q) => q.section === 'polyatomic-ions') },
              { title: 'Part 4: Mixed Formulas', items: HOMEWORK_QUESTIONS.filter((q) => q.section === 'mixed-formulas') },
            ].map((sec, sIdx) => {
              const secAnswered = sec.items.filter((item) => answers[item.id]?.studentAnswer?.trim()).length;
              return (
                <div key={sIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">{sec.title}</span>
                  <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">
                    {secAnswered} / {sec.items.length}
                  </span>
                  <span className={`text-[11px] font-medium ${secAnswered === sec.items.length ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {secAnswered === sec.items.length ? '✓ Complete' : `${sec.items.length - secAnswered} remaining`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detailed Question Review Table (NO ANSWERS REVEALED) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Your Recorded Responses for Submission</span>
              <span>15 Questions</span>
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              {HOMEWORK_QUESTIONS.map((q) => {
                const ans = answers[q.id];
                return (
                  <div key={q.id} className="p-4 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-bold text-slate-900">
                        Q{q.questionNumber}. {q.title}
                      </span>
                      <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] self-start sm:self-auto ${
                        ans?.studentAnswer?.trim()
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {ans?.studentAnswer?.trim() ? '✓ Recorded' : 'Unanswered'}
                      </span>
                    </div>

                    <p className="text-slate-600">{q.prompt}</p>

                    {q.options && q.options.length > 0 ? (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">
                          Available Choices & Your Selection:
                        </span>
                        <div className="space-y-1.5 text-xs">
                          {q.options.map((opt, oIdx) => {
                            const letter = String.fromCharCode(65 + oIdx);
                            const isSelected = ans?.studentAnswer && (
                              ans.studentAnswer.trim() === opt.trim() ||
                              ans.studentAnswer.toLowerCase() === opt.trim().toLowerCase()
                            );
                            return (
                              <div
                                key={oIdx}
                                className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs transition-colors ${
                                  isSelected
                                    ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 font-bold shadow-2xs'
                                    : 'bg-slate-50/50 border-slate-200 text-slate-600'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {isSelected ? '✓' : letter}
                                </span>
                                <span className="flex-1 leading-snug">{opt}</span>
                                {isSelected && (
                                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                                    Your Pick
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono">
                        <span className="text-[10px] text-slate-400 block font-sans">Your Submitted Response:</span>
                        <span className={ans?.studentAnswer?.trim() ? 'text-slate-900 font-bold text-sm' : 'text-slate-400 italic'}>
                          {ans?.studentAnswer?.trim() ? (ans.displayAnswer || ans.studentAnswer) : '(No response provided)'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Instructions Callout */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-indigo-900 block">Ready to Submit to Your Teacher?</span>
              <p className="text-indigo-700">
                Click <strong>"Download Homework PDF"</strong>. Your browser will download a file named <code className="bg-white/80 px-1 py-0.5 rounded text-indigo-900 font-mono">Ionic_Bonding_Homework_{studentName ? studentName.replace(/\s+/g, '_') : 'Student'}.pdf</code> containing your responses. <strong>Upload this document to Toddle</strong> for your teacher to grade!
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold whitespace-nowrap shadow-xs transition-colors self-start sm:self-auto"
            >
              Download PDF Report
            </button>
          </div>
        </div>
      )}

      {/* PRINT-ONLY CONTAINER (Clean layout for browser printing with student responses only) */}
      <div className="hidden print:block p-8 font-sans text-slate-900 space-y-6">
        <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">IONIC BONDING & CHEMICAL FORMULAS</h1>
            <p className="text-sm text-slate-600">Student Homework Assignment Submission (15 Questions) · Upload to Toddle</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-700">{answeredCount} of {totalQuestions} Submitted</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 p-3 rounded">
          <div><strong>Student Name:</strong> {studentName || 'Student'}</div>
          <div><strong>Date:</strong> {date}</div>
          <div><strong>Class / Period:</strong> {classPeriod}</div>
          <div><strong>Teacher:</strong> {teacherName || 'Chemistry'}</div>
        </div>

        <div className="space-y-4 text-xs">
          {HOMEWORK_QUESTIONS.map((q) => {
            const ans = answers[q.id];
            return (
              <div key={q.id} className="border-b border-slate-200 pb-2">
                <div className="font-bold">Q{q.questionNumber}. {q.title} ({q.sectionTitle})</div>
                <div className="text-slate-600 mt-0.5">{q.prompt}</div>

                {q.options && q.options.length > 0 ? (
                  <div className="mt-1 space-y-0.5 pl-2 text-[11px]">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isSelected = ans?.studentAnswer && (
                        ans.studentAnswer.trim() === opt.trim() ||
                        ans.studentAnswer.toLowerCase() === opt.trim().toLowerCase()
                      );
                      return (
                        <div key={oIdx} className={isSelected ? 'font-bold text-black' : 'text-slate-600'}>
                          [{isSelected ? 'X' : ' '}] ({letter}) {opt} {isSelected ? '<-- STUDENT SELECTION' : ''}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-1 font-mono text-slate-900">
                    <strong className="font-sans">Student's Response:</strong> {ans ? ans.displayAnswer || ans.studentAnswer : '(None)'}
                  </div>
                )}

                <div className="text-slate-400 mt-0.5">Score: [  / 1 pt ]   Teacher Notes: __________________________________________________</div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 border-t border-slate-300 text-xs text-slate-500 flex justify-between">
          <div>Teacher Signature: ___________________________</div>
          <div>Date Graded: ____________________</div>
          <div>Final Score: ______ / 15</div>
        </div>
      </div>
    </div>
  );
};
