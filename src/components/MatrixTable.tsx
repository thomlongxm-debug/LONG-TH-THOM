import React from 'react';
import { MatrixData } from '../types/exam';
import { CheckCircle2, AlertTriangle, TableProperties } from 'lucide-react';

interface MatrixTableProps {
  matrix: MatrixData;
  onChange?: (matrix: MatrixData) => void;
  readOnly?: boolean;
}

export const MatrixTable: React.FC<MatrixTableProps> = ({ matrix, onChange, readOnly = false }) => {
  const { rows, summary } = matrix;

  // Validation checks
  const isScore10 = Math.abs(summary.grand_total_score - 10.0) < 0.05;
  const isRatioStandard =
    Math.abs(summary.m1_percentage - 50) <= 5 &&
    Math.abs(summary.m2_percentage - 30) <= 5 &&
    Math.abs(summary.m3_percentage - 20) <= 5;
  const isTnTlStandard =
    Math.abs(summary.tn_percentage - 60) <= 5 && Math.abs(summary.tl_percentage - 40) <= 5;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header Section */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
            <TableProperties className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ
            </h3>
            <p className="text-xs text-slate-500">
              Khung ma trận 3 mức độ theo chuẩn Thông tư 27/2020/TT-BGDĐT & GDPT 2018
            </p>
          </div>
        </div>

        {/* Status validation badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium ${
              isScore10
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isScore10 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            Tổng điểm: {summary.grand_total_score.toFixed(1)} / 10đ
          </span>

          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
              isRatioStandard
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Mức 1-2-3: {summary.m1_percentage}% - {summary.m2_percentage}% - {summary.m3_percentage}%
          </span>

          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
              isTnTlStandard
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            TN / TL: {summary.tn_percentage}% - {summary.tl_percentage}%
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
              <th rowSpan={2} className="p-3 border-r border-slate-200 text-left min-w-[180px]">
                Mạch kiến thức, kĩ năng
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-200 bg-blue-50/60 text-blue-900">
                Mức 1 (Nhận biết)
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-200 bg-indigo-50/60 text-indigo-900">
                Mức 2 (Thông hiểu)
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-200 bg-purple-50/60 text-purple-900">
                Mức 3 (Vận dụng)
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-200 bg-slate-200/60">
                Tổng cộng
              </th>
              <th rowSpan={2} className="p-3 min-w-[70px] bg-slate-200/80">
                Tỉ lệ %
              </th>
            </tr>
            <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <th className="p-2 border-r border-slate-200">TN</th>
              <th className="p-2 border-r border-slate-200">TL</th>
              <th className="p-2 border-r border-slate-200">TN</th>
              <th className="p-2 border-r border-slate-200">TL</th>
              <th className="p-2 border-r border-slate-200">TN</th>
              <th className="p-2 border-r border-slate-200">TL</th>
              <th className="p-2 border-r border-slate-200">Số câu</th>
              <th className="p-2 border-r border-slate-200">Số điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 text-left font-medium text-slate-800 border-r border-slate-200">
                  <div className="font-semibold text-slate-800">{row.topic}</div>
                  {row.subTopics && (
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-2">
                      {row.subTopics}
                    </div>
                  )}
                </td>
                {/* Mức 1 */}
                <td className="p-2 border-r border-slate-200">
                  {row.m1_tn_count > 0 ? (
                    <div>
                      <span className="font-bold text-slate-800">{row.m1_tn_count}</span>
                      <div className="text-[10px] text-slate-500">({row.m1_tn_score}đ)</div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-2 border-r border-slate-200">
                  {row.m1_tl_count > 0 ? (
                    <div>
                      <span className="font-bold text-slate-800">{row.m1_tl_count}</span>
                      <div className="text-[10px] text-slate-500">({row.m1_tl_score}đ)</div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                {/* Mức 2 */}
                <td className="p-2 border-r border-slate-200">
                  {row.m2_tn_count > 0 ? (
                    <div>
                      <span className="font-bold text-slate-800">{row.m2_tn_count}</span>
                      <div className="text-[10px] text-slate-500">({row.m2_tn_score}đ)</div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-2 border-r border-slate-200">
                  {row.m2_tl_count > 0 ? (
                    <div>
                      <span className="font-bold text-slate-800">{row.m2_tl_count}</span>
                      <div className="text-[10px] text-slate-500">({row.m2_tl_score}đ)</div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                {/* Mức 3 */}
                <td className="p-2 border-r border-slate-200">
                  {row.m3_tn_count > 0 ? (
                    <div>
                      <span className="font-bold text-slate-800">{row.m3_tn_count}</span>
                      <div className="text-[10px] text-slate-500">({row.m3_tn_score}đ)</div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-2 border-r border-slate-200">
                  {row.m3_tl_count > 0 ? (
                    <div>
                      <span className="font-bold text-slate-800">{row.m3_tl_count}</span>
                      <div className="text-[10px] text-slate-500">({row.m3_tl_score}đ)</div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                {/* Tổng row */}
                <td className="p-2 border-r border-slate-200 font-semibold text-slate-800 bg-slate-50/50">
                  {row.total_count}
                </td>
                <td className="p-2 border-r border-slate-200 font-bold text-blue-700 bg-slate-50/50">
                  {row.total_score.toFixed(1)}
                </td>
                <td className="p-2 font-bold text-slate-800 bg-slate-100/50">
                  {row.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
          {/* Summary Footer */}
          <tfoot>
            <tr className="bg-slate-100 font-semibold text-slate-800 border-t-2 border-slate-300">
              <td className="p-3 text-left border-r border-slate-200 font-bold">
                TỔNG SỐ ĐIỂM
              </td>
              <td colSpan={2} className="p-2 border-r border-slate-200 text-blue-700 font-bold">
                {summary.m1_total_score.toFixed(1)} điểm ({summary.m1_percentage}%)
              </td>
              <td colSpan={2} className="p-2 border-r border-slate-200 text-indigo-700 font-bold">
                {summary.m2_total_score.toFixed(1)} điểm ({summary.m2_percentage}%)
              </td>
              <td colSpan={2} className="p-2 border-r border-slate-200 text-purple-700 font-bold">
                {summary.m3_total_score.toFixed(1)} điểm ({summary.m3_percentage}%)
              </td>
              <td colSpan={2} className="p-2 border-r border-slate-200 text-rose-700 font-extrabold text-sm">
                {summary.grand_total_score.toFixed(1)} điểm
              </td>
              <td className="p-2 font-extrabold text-slate-900 bg-slate-200">100%</td>
            </tr>

            <tr className="bg-slate-50 text-slate-700 text-[11px] border-t border-slate-200">
              <td className="p-2 text-left font-medium border-r border-slate-200">
                Tỉ lệ hình thức kiểm tra
              </td>
              <td colSpan={4} className="p-2 border-r border-slate-200 text-center font-semibold text-slate-800">
                Trắc nghiệm (TN): <span className="text-blue-700 font-bold">{summary.tn_total_score.toFixed(1)} điểm ({summary.tn_percentage}%)</span>
              </td>
              <td colSpan={5} className="p-2 text-center font-semibold text-slate-800">
                Tự luận (TL): <span className="text-emerald-700 font-bold">{summary.tl_total_score.toFixed(1)} điểm ({summary.tl_percentage}%)</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div>
          * <strong>Mức 1:</strong> Nhận biết kiến thức trực tiếp. <strong>Mức 2:</strong> Kết nối, thông hiểu, suy luận đơn giản. <strong>Mức 3:</strong> Vận dụng vào thực tiễn, tư duy sáng tạo.
        </div>
        <div className="text-slate-400">
          Quy chuẩn theo Thông tư 27/2020/TT-BGDĐT
        </div>
      </div>
    </div>
  );
};
