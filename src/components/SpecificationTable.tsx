import React from 'react';
import { SpecificationRow } from '../types/exam';
import { FileSpreadsheet, BookmarkCheck } from 'lucide-react';

interface SpecificationTableProps {
  specifications: SpecificationRow[];
  readOnly?: boolean;
}

export const SpecificationTable: React.FC<SpecificationTableProps> = ({
  specifications,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-teal-50/50 to-emerald-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-600 text-white rounded-xl shadow-sm">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ
            </h3>
            <p className="text-xs text-slate-500">
              Chi tiết yêu cầu cần đạt (YCCĐ) và định vị số câu hỏi theo từng mức độ nhận thức
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
              <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-12">
                STT
              </th>
              <th rowSpan={2} className="p-3 border-r border-slate-200 min-w-[140px]">
                Chủ đề / Mạch nội dung
              </th>
              <th rowSpan={2} className="p-3 border-r border-slate-200 min-w-[150px]">
                Đơn vị kiến thức / Kĩ năng
              </th>
              <th rowSpan={2} className="p-3 border-r border-slate-200 min-w-[260px]">
                Mức độ đánh giá / Yêu cầu cần đạt (YCCĐ)
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-200 text-center bg-blue-50/70 text-blue-900">
                Mức 1 (Nhận biết)
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-200 text-center bg-indigo-50/70 text-indigo-900">
                Mức 2 (Thông hiểu)
              </th>
              <th colSpan={2} className="p-2 text-center bg-purple-50/70 text-purple-900">
                Mức 3 (Vận dụng)
              </th>
            </tr>
            <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200 text-center">
              <th className="p-2 border-r border-slate-200 w-16">TN</th>
              <th className="p-2 border-r border-slate-200 w-16">TL</th>
              <th className="p-2 border-r border-slate-200 w-16">TN</th>
              <th className="p-2 border-r border-slate-200 w-16">TL</th>
              <th className="p-2 border-r border-slate-200 w-16">TN</th>
              <th className="p-2 w-16">TL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {specifications.map((spec, index) => (
              <tr key={spec.id || index} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 text-center font-semibold text-slate-500 border-r border-slate-200">
                  {index + 1}
                </td>
                <td className="p-3 font-semibold text-slate-800 border-r border-slate-200">
                  {spec.topic}
                </td>
                <td className="p-3 font-medium text-slate-700 border-r border-slate-200">
                  {spec.subTopic}
                </td>
                <td className="p-3 text-slate-600 border-r border-slate-200 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{spec.requirements}</span>
                  </div>
                </td>
                {/* Mức 1 */}
                <td className="p-2 text-center border-r border-slate-200 font-medium text-blue-700 bg-blue-50/20">
                  {spec.m1_tn || '-'}
                </td>
                <td className="p-2 text-center border-r border-slate-200 font-medium text-blue-700 bg-blue-50/20">
                  {spec.m1_tl || '-'}
                </td>
                {/* Mức 2 */}
                <td className="p-2 text-center border-r border-slate-200 font-medium text-indigo-700 bg-indigo-50/20">
                  {spec.m2_tn || '-'}
                </td>
                <td className="p-2 text-center border-r border-slate-200 font-medium text-indigo-700 bg-indigo-50/20">
                  {spec.m2_tl || '-'}
                </td>
                {/* Mức 3 */}
                <td className="p-2 text-center border-r border-slate-200 font-medium text-purple-700 bg-purple-50/20">
                  {spec.m3_tn || '-'}
                </td>
                <td className="p-2 text-center font-medium text-purple-700 bg-purple-50/20">
                  {spec.m3_tl || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-right">
        * Bản đặc tả là căn cứ khoa học trực tiếp để biên soạn câu hỏi và thẩm định tính giá trị của đề thi.
      </div>
    </div>
  );
};
