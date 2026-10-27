import React, { useState, useEffect } from 'react';
import { Subject, Grade, Semester, ExamPackage } from '../types/exam';
import { getSubjectRules, MATH_LESSON_HOURS } from '../data/curriculumRules';
import { STANDARD_EXAMS_BANK } from '../data/standardExamsBank';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Clock,
  Building,
  CheckCircle2,
  X,
  FileCheck,
  Zap,
} from 'lucide-react';

interface ExamConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamLoaded: (exam: ExamPackage) => void;
  currentExam?: ExamPackage;
}

export const ExamConfigModal: React.FC<ExamConfigModalProps> = ({
  isOpen,
  onClose,
  onExamLoaded,
  currentExam,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'bank'>('ai');

  // Form states
  const [subject, setSubject] = useState<Subject>(currentExam?.subject || 'Toán');
  const [grade, setGrade] = useState<Grade>(currentExam?.grade || 4);
  const [semester, setSemester] = useState<Semester>(currentExam?.semester || 'CKI');
  const [bookSeries, setBookSeries] = useState(
    currentExam?.bookSeries || 'Kết nối tri thức với cuộc sống'
  );
  const [schoolName, setSchoolName] = useState(
    currentExam?.schoolHeader.schoolName || 'TRƯỜNG TIỂU HỌC KIM ĐỒNG'
  );
  const [district, setDistrict] = useState(
    currentExam?.schoolHeader.district || 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO'
  );
  const [academicYear, setAcademicYear] = useState(
    currentExam?.schoolHeader.academicYear || '2024 - 2025'
  );
  const [duration, setDuration] = useState<number>(currentExam?.durationMinutes || 40);
  const [customRequirements, setCustomRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Subject and Grade rules validation
  const validGradesForSubject = (subj: Subject): Grade[] => {
    if (subj === 'Lịch sử và Địa lý' || subj === 'Khoa học') {
      return [4, 5];
    }
    if (subj === 'Công nghệ') {
      return [3, 4, 5];
    }
    return [1, 2, 3, 4, 5];
  };

  // Adjust grade when subject changes if current grade is invalid
  useEffect(() => {
    const valid = validGradesForSubject(subject);
    if (!valid.includes(grade)) {
      setGrade(valid[0]);
    }
  }, [subject]);

  // Adjust default duration based on subject
  useEffect(() => {
    if (subject === 'Tiếng Việt') {
      setDuration(grade <= 2 ? 60 : 70);
    } else {
      setDuration(grade === 1 ? 35 : 40);
    }
  }, [subject, grade]);

  // Current curriculum rules preview
  const rules = getSubjectRules(subject, grade, semester);
  const lessonHours = MATH_LESSON_HOURS[grade];

  // AI Exam Generator Handler
  const handleGenerateExam = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          semester,
          bookSeries,
          duration,
          schoolName,
          district,
          academicYear,
          customRequirements,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Lỗi từ máy chủ khi tạo đề.');
      }

      const generated: ExamPackage = {
        ...result.data,
        id: `exam-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };

      onExamLoaded(generated);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || 'Không thể tạo đề bằng AI. Bạn có thể chọn đề mẫu có sẵn từ kho đề chuẩn.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Load from prebuilt bank
  const handleLoadFromBank = (examKey: string) => {
    const prebuilt = STANDARD_EXAMS_BANK[examKey];
    if (prebuilt) {
      onExamLoaded(prebuilt);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden font-sans">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Thiết Lập Đề Kiểm Tra & Ma Trận Chuẩn GDPT 2018
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Quy chuẩn Thông tư 27/2020/TT-BGDĐT – Tỷ lệ 50-30-20% & 60% TN - 40% TL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition ${
              activeTab === 'ai'
                ? 'bg-white text-blue-700 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Trợ Lý AI Ra Đề GDPT 2018 (Gemini 3.8 Flash)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition ${
              activeTab === 'bank'
                ? 'bg-white text-blue-700 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Kho Đề Mẫu Chuẩn Có Sẵn (Tức thì)
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'ai' ? (
            <div className="space-y-6">
              {/* Configuration Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Môn học */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Môn học:
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="Toán">Toán học</option>
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="Khoa học">Khoa học (Lớp 4, 5)</option>
                    <option value="Lịch sử và Địa lý">Lịch sử & Địa lý (Lớp 4, 5)</option>
                    <option value="Công nghệ">Công nghệ (Lớp 3, 4, 5)</option>
                  </select>
                </div>

                {/* Khối lớp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Khối lớp:
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(parseInt(e.target.value) as Grade)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 transition"
                  >
                    {validGradesForSubject(subject).map((g) => (
                      <option key={g} value={g}>
                        Lớp {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kỳ kiểm tra */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Kỳ kiểm tra:
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as Semester)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="GKI">Giữa Học kỳ I (GKI)</option>
                    <option value="CKI">Cuối Học kỳ I (CKI)</option>
                    <option value="GKII">Giữa Học kỳ II (GKII)</option>
                    <option value="CKII">Cuối năm / Cuối Học kỳ II (CN/CKII)</option>
                  </select>
                </div>

                {/* Bộ sách */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-teal-600" />
                    Bộ sách giáo khoa:
                  </label>
                  <select
                    value={bookSeries}
                    onChange={(e) => setBookSeries(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="Kết nối tri thức với cuộc sống">
                      Kết nối tri thức với cuộc sống
                    </option>
                    <option value="Cánh Diều">Cánh Diều</option>
                    <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
                    <option value="Chuẩn GDPT 2018 (Dùng chung)">
                      Chuẩn GDPT 2018 (Dùng chung)
                    </option>
                  </select>
                </div>

                {/* Thời gian làm bài */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Thời gian làm bài:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={15}
                      max={120}
                      step={5}
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 40)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                    />
                    <span className="text-xs text-slate-500 whitespace-nowrap">phút</span>
                  </div>
                </div>

                {/* Năm học */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    Năm học:
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                    placeholder="2024 - 2025"
                  />
                </div>
              </div>

              {/* School headers info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    Tên trường Tiểu học:
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white"
                    placeholder="TRƯỜNG TIỂU HỌC KIM ĐỒNG"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    Phòng Giáo dục và Đào tạo:
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white"
                    placeholder="PHÒNG GIÁO DỤC VÀ ĐÀO TẠO QUẬN / HUYỆN..."
                  />
                </div>
              </div>

              {/* GDPT 2018 Regulation Live Preview Box */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700" />
                  Quy định chuẩn GDPT 2018 cho {subject} Lớp {grade} ({semester}):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 text-[11px] leading-relaxed">
                  <div className="p-2.5 bg-white/80 rounded-xl border border-blue-100">
                    <div className="font-semibold text-blue-800 mb-1">
                      Tỷ lệ mức độ & Hình thức thi:
                    </div>
                    <div>
                      • Mức độ nhận thức: <strong>Mức 1 (50%) - Mức 2 (30%) - Mức 3 (20%)</strong>
                    </div>
                    <div>
                      • Hình thức: <strong>Trắc nghiệm 60% (6đ) - Tự luận 40% (4đ)</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white/80 rounded-xl border border-blue-100">
                    <div className="font-semibold text-blue-800 mb-1">Mạch nội dung trọng tâm:</div>
                    {subject === 'Toán' && (
                      <div>
                        {rules.strands?.note}
                        <div className="mt-1 text-emerald-700 font-semibold">
                          ✓ Hỗ trợ câu hỏi vẽ & tính trên lưới ô vuông (1 ô = 1 cm²)
                        </div>
                      </div>
                    )}
                    {subject === 'Tiếng Việt' && (
                      <div>
                        {rules.instructions}
                        <div className="mt-1 text-sky-700">
                          {rules.tvRule?.texts.map((t) => (
                            <span key={t.genre} className="inline-block mr-2">
                              • {t.genre}: <strong>{t.wordRange}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {subject !== 'Toán' && subject !== 'Tiếng Việt' && (
                      <div>{rules.instructions}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Custom Teacher Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Yêu cầu chuyên môn bổ sung của giáo viên (tùy chọn):
                </label>
                <textarea
                  rows={2}
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  placeholder="Ví dụ: Tập trung vào giải toán chuyển động đều / Đọc hiểu bài ca ngợi tình yêu quê hương đất nước / Có câu hỏi hình vẽ lưới ô vuông tính chu vi..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {errorMsg}
                </div>
              )}
            </div>
          ) : (
            /* Tab: Kho Đề Mẫu Chuẩn Có Sẵn */
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Các bộ đề đã được thẩm định chuẩn xác 100% về cấu trúc, ma trận, bản đặc tả và thang
                điểm. Bạn có thể mở ngay mà không cần đợi kết nối AI.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(STANDARD_EXAMS_BANK).map(([key, exam]) => (
                  <div
                    key={key}
                    onClick={() => handleLoadFromBank(key)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition bg-white space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                        {exam.subject} - Lớp {exam.grade} ({exam.semester})
                      </span>
                      <span className="text-[11px] text-slate-400">{exam.durationMinutes} phút</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition">
                      {exam.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      Bộ sách: {exam.bookSeries} | Chuẩn Thông tư 27 | Tỷ lệ 50-30-20%
                    </p>
                    <div className="pt-2 flex justify-end">
                      <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:underline">
                        Mở đề này ngay →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {activeTab === 'ai' ? (
              <span>✨ Sinh đề chuẩn hóa: Ma trận + Đặc tả + Đề thi + Hướng dẫn chấm</span>
            ) : (
              <span>⚡ Mở ngay lập tức từ kho dữ liệu chuẩn</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Đóng
            </button>

            {activeTab === 'ai' && (
              <button
                type="button"
                onClick={handleGenerateExam}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang thẩm định & tạo đề bằng AI...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>Tạo Trọn Bộ Đề Bằng AI</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
