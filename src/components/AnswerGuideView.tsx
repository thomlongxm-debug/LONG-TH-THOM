import React from 'react';
import { AnswerItem } from '../types/exam';
import { Award, CheckCircle, Info } from 'lucide-react';

interface AnswerGuideViewProps {
  answerGuide: AnswerItem[];
  evaluationNotes?: string;
  readOnly?: boolean;
}

export const AnswerGuideView: React.FC<AnswerGuideViewProps> = ({
  answerGuide,
  evaluationNotes,
}) => {
  const tnAnswers = answerGuide.filter((a) => a.type === 'TN');
  const tlAnswers = answerGuide.filter((a) => a.type === 'TL');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM ĐIỂM
            </h3>
            <p className="text-xs text-slate-500">
              Biểu điểm chi tiết và định hướng chấm theo Thông tư 27/2020/TT-BGDĐT
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Quick Multiple Choice Table */}
        {tnAnswers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              I. BẢNG ĐÁP ÁN TRẮC NGHIỆM KHÁCH QUAN
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    {tnAnswers.map((item) => (
                      <th key={item.id} className="p-2.5 border-r border-slate-200 min-w-[65px]">
                        {item.questionNumber}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-white font-bold text-emerald-700">
                    {tnAnswers.map((item) => {
                      // Extract option letter if available
                      const match = item.solution.match(/Đáp án ([A-D])/i) || item.solution.match(/([A-D])/);
                      const displayKey = match ? match[1].toUpperCase() : item.solution.slice(0, 10);
                      return (
                        <td key={item.id} className="p-3 border-r border-slate-200 text-sm">
                          {displayKey}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-slate-50 text-[11px] text-slate-500 font-medium">
                    {tnAnswers.map((item) => (
                      <td key={item.id} className="p-1.5 border-r border-slate-200">
                        {item.score}đ
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Solutions for All Questions */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            II. HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM CHI TIẾT
          </h4>

          <div className="space-y-3">
            {answerGuide.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{item.questionNumber}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                      {item.score} điểm
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {item.level} ({item.type === 'TN' ? 'Trắc nghiệm' : 'Tự luận'})
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                  <span className="font-semibold text-slate-700">Đáp án / Lời giải: </span>
                  {item.solution}
                </div>

                {item.notes && (
                  <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
                    <span className="font-semibold">Lưu ý chấm: </span>
                    {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Thông tư 27 Evaluation Principles */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 space-y-2">
          <div className="font-bold text-blue-900 flex items-center gap-1.5 text-xs uppercase">
            <Info className="w-4 h-4 text-blue-700" />
            NGUYÊN TẮC ĐÁNH GIÁ ĐỊNH KỲ THEO THÔNG TƯ 27/2020/TT-BGDĐT:
          </div>
          <p className="leading-relaxed text-slate-600 text-[11px]">
            {evaluationNotes ||
              '1. Đánh giá vì sự tiến bộ của học sinh; coi trọng việc động viên, khuyến khích sự cố gắng trong học tập, rèn luyện của học sinh; giúp học sinh phát huy nhiều nhất khả năng, năng lực.\\n2. Không so sánh học sinh này với học sinh khác, không tạo áp lực cho học sinh, giáo viên và cha mẹ học sinh.\\n3. Điểm của bài kiểm tra định kỳ không dùng để xếp loại học sinh mà là một kênh thông tin để giáo viên điều chỉnh phương pháp dạy học và hỗ trợ kịp thời.'}
          </p>
        </div>
      </div>
    </div>
  );
};
