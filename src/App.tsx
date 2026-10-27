import React, { useState, useEffect } from 'react';
import { ExamPackage } from './types/exam';
import { STANDARD_EXAMS_BANK } from './data/standardExamsBank';
import { MatrixTable } from './components/MatrixTable';
import { SpecificationTable } from './components/SpecificationTable';
import { ExamPaperView } from './components/ExamPaperView';
import { AnswerGuideView } from './components/AnswerGuideView';
import { ExamConfigModal } from './components/ExamConfigModal';
import { MathGridDrawer } from './components/MathGridDrawer';
import { exportExamToWord } from './utils/exportUtils';
import {
  FileText,
  TableProperties,
  FileSpreadsheet,
  Award,
  Printer,
  Download,
  PlusCircle,
  Grid,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Share2,
} from 'lucide-react';

type TabType = 'matrix' | 'specifications' | 'exam' | 'answers';

export default function App() {
  // Current active exam (default to high-quality Math Grade 4 CKI)
  const [exam, setExam] = useState<ExamPackage>(() => {
    const saved = localStorage.getItem('tieuhoc_active_exam');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return STANDARD_EXAMS_BANK['math-grade4-cki'];
  });

  const [activeTab, setActiveTab] = useState<TabType>('exam');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isGridToolModalOpen, setIsGridToolModalOpen] = useState(false);
  const [showCurriculumGuide, setShowCurriculumGuide] = useState(false);

  // Sync active exam to LocalStorage
  useEffect(() => {
    localStorage.setItem('tieuhoc_active_exam', JSON.stringify(exam));
  }, [exam]);

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Export Word
  const handleExportWord = () => {
    exportExamToWord(exam);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Application Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg">
              TH
            </div>
            <div>
              <h1 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                APP TẠO ĐỀ MA TRẬN VÀ ĐỀ KIỂM TRA TIỂU HỌC
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  GDPT 2018
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Chuẩn Thông tư 27/2020/TT-BGDĐT • Toán, Tiếng Việt, Khoa học, Lịch sử - Địa lý, Công nghệ
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Math Grid Quick Tool button */}
            <button
              onClick={() => setIsGridToolModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              title="Mở công cụ vẽ hình lưới ô vuông"
            >
              <Grid className="w-4 h-4 text-blue-600" />
              <span>Vẽ lưới ô vuông</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              title="In đề thi chuẩn A4"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">In Đề (A4)</span>
            </button>

            {/* Export Word Button */}
            <button
              onClick={handleExportWord}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition shadow-xs"
              title="Xuất trọn bộ đề thi và ma trận ra file Microsoft Word"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Xuất Word (.doc)</span>
            </button>

            {/* Create / Configure New Exam Button */}
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Tạo Đề / Đổi Môn</span>
              <span className="sm:hidden">Tạo Đề</span>
            </button>
          </div>
        </div>

        {/* Subheader: Active Exam Status Bar & Tab Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 py-2">
            {/* Active exam badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-800">Đang xem:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-bold">
                {exam.subject} - Lớp {exam.grade}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 font-medium">
                {exam.semester === 'GKI'
                  ? 'Giữa Học kỳ I'
                  : exam.semester === 'CKI'
                  ? 'Cuối Học kỳ I'
                  : exam.semester === 'GKII'
                  ? 'Giữa Học kỳ II'
                  : 'Cuối năm (CKII)'}
              </span>
              <span className="hidden md:inline-block text-slate-500 text-[11px]">
                {exam.bookSeries} • {exam.durationMinutes} phút
              </span>
            </div>

            {/* 4 Professional Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'matrix'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5 text-blue-600" />
                <span>1. Ma Trận Đề</span>
              </button>

              <button
                onClick={() => setActiveTab('specifications')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'specifications'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                <span>2. Bản Đặc Tả</span>
              </button>

              <button
                onClick={() => setActiveTab('exam')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'exam'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>3. Đề Kiểm Tra</span>
              </button>

              <button
                onClick={() => setActiveTab('answers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'answers'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>4. Hướng Dẫn Chấm</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Collapsible GDPT 2018 Primary Curriculum Rules Reference */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs print:hidden">
          <button
            type="button"
            onClick={() => setShowCurriculumGuide(!showCurriculumGuide)}
            className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/20 text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">
                  Cẩm Nang & Tiêu Chuẩn Ra Đề GDPT 2018 (Thông tư 27)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Quy định tỷ lệ 50-30-20%, 60% TN - 40% TL, phân phối mạch kiến thức và độ dài văn bản Tiếng Việt
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
              <span>{showCurriculumGuide ? 'Thu gọn' : 'Xem chi tiết'}</span>
              {showCurriculumGuide ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {showCurriculumGuide && (
            <div className="p-5 border-t border-slate-100 text-xs text-slate-700 space-y-4 bg-slate-50/40">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Toán */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-blue-700 flex items-center gap-1">
                    📐 Môn Toán:
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li>• Mức 1 - 2 - 3: <strong>50% – 30% – 20%</strong></li>
                    <li>• Hình thức: <strong>Trắc nghiệm 60% – Tự luận 40%</strong></li>
                    <li>• Lớp 1: Kỳ I: Số & PT 80%, HH&ĐL 20%; Kỳ II: Số & PT 80%, HH&ĐL 20%</li>
                    <li>• Lớp 2, 3: Kỳ I: Số 70%, HH&ĐL 30%; Kỳ II: Số 70%, HH&ĐL 20%, TK&XS 10%</li>
                    <li>• Lớp 4: CKI: Số 50%, HH&ĐL 50%; CN: Số 70%, HH&ĐL 20%, TK&XS 10%</li>
                    <li>• Lớp 5: GKI: Số 80%, HH&ĐL 20%; CKI: Số 60%, HH&ĐL 40%; GKII: Số 50%, HH&ĐL 50%</li>
                    <li className="text-blue-800 font-semibold">• Lưu ý: Vẽ hình và tính trên lưới ô vuông (Lớp 1-5)</li>
                  </ul>
                </div>

                {/* Tiếng Việt */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-sky-700 flex items-center gap-1">
                    📖 Môn Tiếng Việt:
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li>• Bài đọc hiểu ngoài SGK, đúng số chữ quy định:</li>
                    <li>- Lớp 1: truyện/miêu tả 90–130 chữ, thơ 50–70 chữ</li>
                    <li>- Lớp 2: truyện 180–200 chữ, miêu tả 150–180 chữ, thơ 70–90 chữ</li>
                    <li>- Lớp 3: truyện 200–250 chữ, miêu tả 180–200 chữ, thơ 80–100 chữ</li>
                    <li>- Lớp 4: truyện 280–330 chữ, miêu tả 200–250 chữ, thơ 100–120 chữ</li>
                    <li>- Lớp 5: truyện 300–350 chữ, miêu tả 200–250 chữ, thơ 110–130 chữ</li>
                    <li>• Lớp 2-3: 9 câu đọc hiểu (6đ) + Đọc TT (4đ) + Viết (10đ)</li>
                    <li>• Lớp 4-5: 11 câu đọc hiểu (7đ) + Đọc TT (3đ) + Viết (10đ)</li>
                  </ul>
                </div>

                {/* Các môn khác */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-emerald-700 flex items-center gap-1">
                    🌿 Khoa học, Lịch sử - Địa lý, Công nghệ:
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li>• Mức 1 - 2 - 3: <strong>50% – 30% – 20%</strong></li>
                    <li>• Hình thức: <strong>Trắc nghiệm 60% – Tự luận 40%</strong></li>
                    <li>• Thời lượng làm bài: 40 phút</li>
                    <li>• Câu hỏi bám sát mạch nội dung chủ đề từng khối lớp</li>
                    <li>• Tự luận gắn liền với các tình huống vận dụng thực tiễn cuộc sống của học sinh</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: Ma Trận Đề Kiểm Tra */}
        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <MatrixTable matrix={exam.matrix} readOnly={false} />
          </div>
        )}

        {/* Tab 2: Bản Đặc Tả Ma Trận */}
        {activeTab === 'specifications' && (
          <div className="space-y-4">
            <SpecificationTable specifications={exam.specifications} />
          </div>
        )}

        {/* Tab 3: Đề Kiểm Tra Chính Thức */}
        {activeTab === 'exam' && (
          <div className="space-y-4">
            <ExamPaperView exam={exam} onUpdateExam={(updated) => setExam(updated)} />
          </div>
        )}

        {/* Tab 4: Đáp Án Và Hướng Dẫn Chấm */}
        {activeTab === 'answers' && (
          <div className="space-y-4">
            <AnswerGuideView
              answerGuide={exam.answerGuide}
              evaluationNotes={exam.evaluationNotes}
            />
          </div>
        )}
      </main>

      {/* Standalone Math Grid Drawer Modal */}
      {isGridToolModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Công Cụ Vẽ Lưới Ô Vuông Toán Học (Lớp 1 - 5)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ tạo các bài toán đếm ô vuông, tính diện tích, chu vi hình chữ nhật, hình bình hành, tam giác
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGridToolModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <MathGridDrawer />

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsGridToolModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Đóng công cụ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Configuration & AI Generator Modal */}
      <ExamConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentExam={exam}
        onExamLoaded={(newExam) => {
          setExam(newExam);
          setActiveTab('exam');
        }}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-slate-200 text-center text-xs text-slate-500 print:hidden">
        <p className="font-medium text-slate-700">
          Hệ Thống Xây Dựng Ma Trận, Bản Đặc Tả & Đề Kiểm Tra Định Kỳ Tiểu Học
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Bám sát Chương trình GDPT 2018 và Thông tư 27/2020/TT-BGDĐT của Bộ Giáo dục và Đào tạo
        </p>
      </footer>
    </div>
  );
}
