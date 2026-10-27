import React, { useState } from 'react';
import { ExamPackage, ExamQuestion, GridConfig } from '../types/exam';
import { MathGridDrawer } from './MathGridDrawer';
import {
  FileText,
  Edit3,
  Trash2,
  Plus,
  Sparkles,
  Grid,
  BookOpen,
  PenTool,
  Volume2,
  Check,
  X,
} from 'lucide-react';

interface ExamPaperViewProps {
  exam: ExamPackage;
  onUpdateExam?: (updated: ExamPackage) => void;
  readOnly?: boolean;
}

export const ExamPaperView: React.FC<ExamPaperViewProps> = ({
  exam,
  onUpdateExam,
  readOnly = false,
}) => {
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null);
  const [activeGridModalQuestionId, setActiveGridModalQuestionId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { title, subject, grade, durationMinutes, schoolHeader, examPaper } = exam;
  const isVietnamese = subject === 'Tiếng Việt';
  const isMath = subject === 'Toán';

  // Handle edit question content
  const handleSaveQuestion = (updatedQ: ExamQuestion) => {
    if (!onUpdateExam) return;
    const newParts = examPaper.parts.map((part) => ({
      ...part,
      questions: part.questions.map((q) => (q.id === updatedQ.id ? updatedQ : q)),
    }));
    onUpdateExam({
      ...exam,
      examPaper: {
        ...examPaper,
        parts: newParts,
      },
    });
    setEditingQuestion(null);
  };

  // Handle delete question
  const handleDeleteQuestion = (questionId: string) => {
    if (!onUpdateExam || readOnly) return;
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi đề thi?')) return;
    const newParts = examPaper.parts.map((part) => ({
      ...part,
      questions: part.questions.filter((q) => q.id !== questionId),
    }));
    onUpdateExam({
      ...exam,
      examPaper: {
        ...examPaper,
        parts: newParts,
      },
    });
  };

  // Handle save grid configuration to question
  const handleSaveGridToQuestion = (qId: string, gridConfig: GridConfig) => {
    if (!onUpdateExam) return;
    const newParts = examPaper.parts.map((part) => ({
      ...part,
      questions: part.questions.map((q) =>
        q.id === qId ? { ...q, hasGrid: true, gridConfig } : q
      ),
    }));
    onUpdateExam({
      ...exam,
      examPaper: {
        ...examPaper,
        parts: newParts,
      },
    });
    setActiveGridModalQuestionId(null);
  };

  // AI Refine question
  const handleAiRefine = async (question: ExamQuestion, action: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/refine-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, action, subject, grade }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        handleSaveQuestion({
          ...question,
          content: data.data.content || question.content,
          options: data.data.options || question.options,
          level: data.data.level || question.level,
        });
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối AI hoặc chưa cấu hình API key.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* Official School and Exam Paper Header */}
      <div className="p-6 md:p-8 border-b-2 border-slate-800 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {/* Left: District & School */}
          <div className="text-center md:text-left">
            <h4 className="text-xs uppercase font-semibold text-slate-700 tracking-wider">
              {schoolHeader.district || 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO'}
            </h4>
            <h3 className="text-sm uppercase font-bold text-slate-900 tracking-wide mt-0.5">
              {schoolHeader.schoolName || 'TRƯỜNG TIỂU HỌC'}
            </h3>
            <div className="w-24 h-0.5 bg-slate-800 mx-auto md:mx-0 mt-1"></div>
          </div>

          {/* Right: Exam Title */}
          <div className="text-center md:text-right">
            <h3 className="text-sm uppercase font-extrabold text-slate-900 tracking-wide">
              {schoolHeader.examName || title}
            </h3>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              MÔN: <span className="text-blue-700 uppercase font-bold">{subject}</span> - LỚP{' '}
              <span className="font-bold">{grade}</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Năm học: {schoolHeader.academicYear} | Thời gian: {durationMinutes} phút
            </div>
          </div>
        </div>

        {/* Student identification & Grading box (Thông tư 27) */}
        <div className="mt-4 border-2 border-slate-800 rounded-lg overflow-hidden bg-slate-50/50">
          <div className="p-3 border-b border-slate-300 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-700">Họ và tên học sinh:</span>{' '}
              <span className="border-b border-dotted border-slate-500 inline-block w-48 text-slate-800">
                ....................................................................
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Lớp:</span>{' '}
              <span className="border-b border-dotted border-slate-500 inline-block w-20 text-slate-800">
                .....................
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-slate-300 text-xs">
            {/* Điểm số */}
            <div className="p-3 text-center md:col-span-1">
              <div className="font-bold uppercase text-slate-800 mb-1">ĐIỂM</div>
              <div className="h-14 flex items-center justify-center text-slate-400 italic">
                (Bằng số và bằng chữ)
              </div>
            </div>

            {/* Nhận xét của giáo viên */}
            <div className="p-3 md:col-span-2">
              <div className="font-bold uppercase text-slate-800 mb-1">
                LỜI NHẬN XÉT CỦA THẦY CÔ GIÁO (Thông tư 27)
              </div>
              <div className="h-14 text-slate-400 italic text-[11px] leading-relaxed">
                ....................................................................................................................................................................
                <br />
                ....................................................................................................................................................................
              </div>
            </div>
          </div>
        </div>

        {/* Paper instructions */}
        {examPaper.instructions && (
          <div className="mt-3 text-xs text-slate-500 italic text-center">
            * {examPaper.instructions}
          </div>
        )}
      </div>

      {/* Vietnamese Subject: Reading Aloud Section */}
      {isVietnamese && examPaper.vietnameseSpeakingExam && (
        <div className="p-6 md:p-8 border-b border-slate-200 bg-amber-50/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-amber-900 tracking-wide">
                {examPaper.vietnameseSpeakingExam.title}
              </h3>
              <p className="text-xs text-amber-800/80">
                {examPaper.vietnameseSpeakingExam.instructions}
              </p>
            </div>
          </div>

          {examPaper.vietnameseSpeakingExam.criteria && (
            <div className="bg-white p-3 rounded-lg border border-amber-200/70 text-xs space-y-1.5">
              <div className="font-semibold text-slate-700">Tiêu chí đánh giá đọc thành tiếng:</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-600">
                {examPaper.vietnameseSpeakingExam.criteria.map((c, idx) => (
                  <div key={idx} className="flex justify-between p-1.5 bg-slate-50 rounded">
                    <span>{c.name}</span>
                    <span className="font-bold text-amber-700">{c.score}đ</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vietnamese Subject: Reading Passage Section */}
      {isVietnamese && examPaper.readingPassage && (
        <div className="p-6 md:p-8 border-b border-slate-200 bg-sky-50/20">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-sky-900">
                  VĂN BẢN ĐỌC HIỂU (NGOÀI SGK)
                </h4>
                <div className="text-[11px] text-sky-700">
                  Thể loại: {examPaper.readingPassage.genre || 'Văn xuôi'} | Độ dài:{' '}
                  <strong className="text-sky-900 font-bold">
                    {examPaper.readingPassage.wordCount} chữ
                  </strong>{' '}
                  {examPaper.readingPassage.standardWordRange && (
                    <span>(Đúng quy định {examPaper.readingPassage.standardWordRange})</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="my-4 text-center">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
              {examPaper.readingPassage.title}
            </h3>
            {examPaper.readingPassage.author && (
              <div className="text-xs italic text-slate-500 mt-0.5">
                Theo {examPaper.readingPassage.author}
              </div>
            )}
          </div>

          <div className="p-5 bg-white rounded-xl border border-sky-100/80 text-sm leading-relaxed text-slate-800 whitespace-pre-line shadow-xs">
            {examPaper.readingPassage.content}
          </div>
        </div>
      )}

      {/* Exam Parts & Questions */}
      <div className="p-6 md:p-8 space-y-8">
        {examPaper.parts.map((part) => (
          <div key={part.id} className="space-y-4">
            {/* Part Title */}
            <div className="pb-2 border-b-2 border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase text-slate-900 tracking-wide">
                  {part.partName}
                </h3>
                {part.description && (
                  <p className="text-xs text-slate-500 italic mt-0.5">{part.description}</p>
                )}
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-5">
              {part.questions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-white relative group"
                >
                  {/* Top line: Question number, points, level badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{q.number}:</span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                        ({q.score} điểm)
                      </span>
                      <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {q.level}
                      </span>
                      {q.strand && (
                        <span className="text-[11px] px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-md">
                          {q.strand}
                        </span>
                      )}
                    </div>

                    {/* Action buttons (Edit, AI Refine, Delete) */}
                    {!readOnly && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        {isMath && (
                          <button
                            onClick={() => setActiveGridModalQuestionId(q.id)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs flex items-center gap-1"
                            title="Chèn / Vẽ lưới ô vuông toán học"
                          >
                            <Grid className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Lưới ô vuông</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleAiRefine(q, 'Tạo câu hỏi tương đương cùng mức độ')}
                          disabled={isAiLoading}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg text-xs flex items-center gap-1"
                          title="AI tạo câu hỏi tương đương"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="text-[11px]">AI đổi đề</span>
                        </button>
                        <button
                          onClick={() => setEditingQuestion(q)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="Sửa câu hỏi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Question Content */}
                  <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium mb-3">
                    {q.content}
                  </div>

                  {/* Multiple Choice Options (if TN) */}
                  {q.type === 'TN' && q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 my-2">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs font-medium text-slate-700 hover:bg-blue-50/50 hover:border-blue-200 transition"
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Math Grid Render (if hasGrid) */}
                  {q.hasGrid && (
                    <div className="my-3">
                      <MathGridDrawer initialConfig={q.gridConfig} readOnly={true} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Vietnamese Subject: Writing Exam Section */}
        {isVietnamese && examPaper.vietnameseWritingExam && (
          <div className="pt-6 border-t-2 border-slate-800 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase text-slate-900 tracking-wide">
                {examPaper.vietnameseWritingExam.title} (
                {examPaper.vietnameseWritingExam.totalScore} ĐIỂM)
              </h3>
            </div>

            {/* Dictation */}
            {examPaper.vietnameseWritingExam.dictation && (
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-xs uppercase">
                    {examPaper.vietnameseWritingExam.dictation.title}
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                    {examPaper.vietnameseWritingExam.dictation.score} điểm
                  </span>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                  "{examPaper.vietnameseWritingExam.dictation.content}"
                </div>
                {examPaper.vietnameseWritingExam.dictation.guide && (
                  <div className="text-[11px] text-slate-500">
                    * {examPaper.vietnameseWritingExam.dictation.guide}
                  </div>
                )}
              </div>
            )}

            {/* Composition */}
            {examPaper.vietnameseWritingExam.composition && (
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-xs uppercase">
                    {examPaper.vietnameseWritingExam.composition.title}
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                    {examPaper.vietnameseWritingExam.composition.score} điểm
                  </span>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200 text-xs text-slate-800 font-medium">
                  {examPaper.vietnameseWritingExam.composition.prompt}
                </div>

                {examPaper.vietnameseWritingExam.composition.rubric && (
                  <div className="text-xs space-y-1 pt-1">
                    <span className="font-semibold text-slate-700">Tiêu chí chấm điểm:</span>
                    <ul className="list-disc pl-4 text-slate-600 text-[11px] space-y-0.5">
                      {examPaper.vietnameseWritingExam.composition.rubric.map((r, rIdx) => (
                        <li key={rIdx}>
                          {r.criteria} ({r.score}đ)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">
                Chỉnh sửa: {editingQuestion.number}
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung câu hỏi:</label>
                <textarea
                  rows={3}
                  value={editingQuestion.content}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, content: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Điểm số:</label>
                  <input
                    type="number"
                    step="0.25"
                    value={editingQuestion.score}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        score: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mức độ:</label>
                  <select
                    value={editingQuestion.level}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        level: e.target.value as any,
                      })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Mức 1">Mức 1 (Nhận biết)</option>
                    <option value="Mức 2">Mức 2 (Thông hiểu)</option>
                    <option value="Mức 3">Mức 3 (Vận dụng)</option>
                  </select>
                </div>
              </div>

              {editingQuestion.type === 'TN' && editingQuestion.options && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Các lựa chọn trắc nghiệm (A, B, C, D):
                  </label>
                  <div className="space-y-1.5">
                    {editingQuestion.options.map((opt, i) => (
                      <input
                        key={i}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...(editingQuestion.options || [])];
                          newOpts[i] = e.target.value;
                          setEditingQuestion({ ...editingQuestion, options: newOpts });
                        }}
                        className="w-full p-1.5 border border-slate-200 rounded text-slate-800"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleSaveQuestion(editingQuestion)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Math Grid Drawer Modal */}
      {activeGridModalQuestionId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Grid className="w-5 h-5 text-blue-600" />
                Thiết kế hình vẽ trên lưới ô vuông (Lớp 1 - 5)
              </h3>
              <button
                onClick={() => setActiveGridModalQuestionId(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <MathGridDrawer
              onSave={(cfg) => handleSaveGridToQuestion(activeGridModalQuestionId, cfg)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
