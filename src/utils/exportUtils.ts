import { ExamPackage } from '../types/exam';

export function exportExamToWord(exam: ExamPackage) {
  const { title, subject, grade, durationMinutes, schoolHeader, matrix, specifications, examPaper, answerGuide } = exam;

  // Generate HTML formatted for MS Word
  const htmlContent = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.35;
      color: #000;
      margin: 1.5cm;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    table, th, td {
      border: 1px solid #000;
    }
    th, td {
      padding: 6px 8px;
      font-size: 11pt;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
      text-align: center;
    }
    .header-table {
      border: none;
      margin-bottom: 20px;
    }
    .header-table td {
      border: none;
      padding: 2px 4px;
      font-size: 12pt;
    }
    .box-info {
      border: 2px solid #000;
      margin: 15px 0;
    }
    .box-info td {
      border: 1px solid #000;
      padding: 8px;
    }
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 15px;
      margin-bottom: 8px;
    }
    .reading-box {
      border: 1px dashed #666;
      padding: 12px;
      margin: 10px 0;
      background-color: #fafafa;
    }
    .question-row {
      margin-bottom: 12px;
    }
    .options-table {
      border: none;
      margin: 6px 0;
    }
    .options-table td {
      border: none;
      padding: 4px 10px;
      font-size: 12pt;
    }
    .page-break {
      page-break-before: always;
    }
    .grid-box {
      border: 1px solid #999;
      background-color: #f9f9f9;
      padding: 10px;
      text-align: center;
      margin: 10px 0;
      font-size: 10pt;
    }
  </style>
</head>
<body>

  <!-- ================= 1. ĐỀ KIỂM TRA CHÍNH THỨC ================= -->
  <table class="header-table">
    <tr>
      <td style="width: 50%; text-align: center;">
        <strong>${schoolHeader.district || 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO'}</strong><br/>
        <strong>${schoolHeader.schoolName || 'TRƯỜNG TIỂU HỌC'}</strong><br/>
        ----------------
      </td>
      <td style="width: 50%; text-align: center;">
        <strong>${schoolHeader.examName || title}</strong><br/>
        <strong>MÔN: ${subject.toUpperCase()} - LỚP ${grade}</strong><br/>
        <em>Năm học: ${schoolHeader.academicYear} | Thời gian: ${durationMinutes} phút</em>
      </td>
    </tr>
  </table>

  <!-- Student info & Grading Box -->
  <table class="box-info">
    <tr>
      <td colspan="2">
        <strong>Họ và tên học sinh:</strong> ............................................................................ 
        <strong>Lớp:</strong> .............
      </td>
    </tr>
    <tr>
      <td style="width: 30%; text-align: center; height: 70px; vertical-align: top;">
        <strong>ĐIỂM</strong><br/>
        <br/><br/>
        <em>(Bằng số và chữ)</em>
      </td>
      <td style="width: 70%; vertical-align: top;">
        <strong>LỜI NHẬN XÉT CỦA THẦY CÔ GIÁO:</strong><br/>
        ............................................................................................................................................<br/>
        ............................................................................................................................................
      </td>
    </tr>
  </table>

  ${
    examPaper.readingPassage
      ? `
    <div class="reading-box">
      <div style="text-align: center; font-weight: bold; font-size: 13pt; text-transform: uppercase;">
        ${examPaper.readingPassage.title}
      </div>
      ${
        examPaper.readingPassage.author
          ? `<div style="text-align: center; font-style: italic; font-size: 11pt; margin-bottom: 8px;">Theo ${examPaper.readingPassage.author}</div>`
          : ''
      }
      <div style="text-align: justify; font-size: 12pt; text-indent: 20px;">
        ${examPaper.readingPassage.content.replace(/\n/g, '<br/>')}
      </div>
    </div>
  `
      : ''
  }

  ${examPaper.parts
    .map(
      (part) => `
    <div class="section-title">${part.partName}</div>
    ${part.description ? `<div style="font-style: italic; margin-bottom: 10px;">${part.description}</div>` : ''}
    ${part.questions
      .map(
        (q) => `
      <div class="question-row">
        <strong>${q.number} (${q.score} điểm - ${q.level}):</strong> ${q.content.replace(/\n/g, '<br/>')}
        ${
          q.type === 'TN' && q.options && q.options.length > 0
            ? `
          <table class="options-table">
            <tr>
              ${q.options.map((opt) => `<td style="width: 25%;">${opt}</td>`).join('')}
            </tr>
          </table>
        `
            : ''
        }
        ${
          q.hasGrid
            ? `
          <div class="grid-box">
            [HÌNH VẼ TRÊN LƯỚI Ô VUÔNG: ${q.gridConfig?.title || 'Lưới ô vuông 1cm x 1cm'} - ${q.gridConfig?.description || ''}]
          </div>
        `
            : ''
        }
      </div>
    `
      )
      .join('')}
  `
    )
    .join('')}

  ${
    examPaper.vietnameseWritingExam
      ? `
    <div class="section-title">${examPaper.vietnameseWritingExam.title} (${examPaper.vietnameseWritingExam.totalScore} ĐIỂM)</div>
    ${
      examPaper.vietnameseWritingExam.dictation
        ? `
      <div style="margin-bottom: 12px;">
        <strong>${examPaper.vietnameseWritingExam.dictation.title} (${examPaper.vietnameseWritingExam.dictation.score}đ):</strong><br/>
        <em>"${examPaper.vietnameseWritingExam.dictation.content}"</em>
      </div>
    `
        : ''
    }
    ${
      examPaper.vietnameseWritingExam.composition
        ? `
      <div style="margin-bottom: 12px;">
        <strong>${examPaper.vietnameseWritingExam.composition.title} (${examPaper.vietnameseWritingExam.composition.score}đ):</strong><br/>
        ${examPaper.vietnameseWritingExam.composition.prompt}
      </div>
    `
        : ''
    }
  `
      : ''
  }

  <!-- ================= 2. ĐÁP ÁN & HƯỚNG DẪN CHẤM ================= -->
  <div class="page-break"></div>
  <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 15px; text-transform: uppercase;">
    ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM MÔN ${subject.toUpperCase()} - LỚP ${grade}
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Câu số</th>
        <th style="width: 15%;">Mức độ</th>
        <th style="width: 15%;">Điểm</th>
        <th style="width: 55%;">Đáp án / Hướng dẫn chấm chi tiết</th>
      </tr>
    </thead>
    <tbody>
      ${answerGuide
        .map(
          (ans) => `
        <tr>
          <td style="text-align: center; font-weight: bold;">${ans.questionNumber}</td>
          <td style="text-align: center;">${ans.level}</td>
          <td style="text-align: center; font-weight: bold;">${ans.score}đ</td>
          <td>
            ${ans.solution.replace(/\n/g, '<br/>')}
            ${ans.notes ? `<br/><em style="color: #666;">(Lưu ý: ${ans.notes})</em>` : ''}
          </td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <!-- ================= 3. MA TRẬN ĐỀ KIỂM TRA ================= -->
  <div class="page-break"></div>
  <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 15px; text-transform: uppercase;">
    MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ MÔN ${subject.toUpperCase()} - LỚP ${grade}
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2" style="width: 25%;">Mạch kiến thức, kĩ năng</th>
        <th colspan="2">Mức 1</th>
        <th colspan="2">Mức 2</th>
        <th colspan="2">Mức 3</th>
        <th colspan="2">Tổng cộng</th>
        <th rowspan="2">Tỉ lệ %</th>
      </tr>
      <tr>
        <th>TN</th><th>TL</th>
        <th>TN</th><th>TL</th>
        <th>TN</th><th>TL</th>
        <th>Số câu</th><th>Số điểm</th>
      </tr>
    </thead>
    <tbody>
      ${matrix.rows
        .map(
          (r) => `
        <tr>
          <td><strong>${r.topic}</strong>${r.subTopics ? `<br/><small>${r.subTopics}</small>` : ''}</td>
          <td style="text-align: center;">${r.m1_tn_count > 0 ? `${r.m1_tn_count} (${r.m1_tn_score}đ)` : '-'}</td>
          <td style="text-align: center;">${r.m1_tl_count > 0 ? `${r.m1_tl_count} (${r.m1_tl_score}đ)` : '-'}</td>
          <td style="text-align: center;">${r.m2_tn_count > 0 ? `${r.m2_tn_count} (${r.m2_tn_score}đ)` : '-'}</td>
          <td style="text-align: center;">${r.m2_tl_count > 0 ? `${r.m2_tl_count} (${r.m2_tl_score}đ)` : '-'}</td>
          <td style="text-align: center;">${r.m3_tn_count > 0 ? `${r.m3_tn_count} (${r.m3_tn_score}đ)` : '-'}</td>
          <td style="text-align: center;">${r.m3_tl_count > 0 ? `${r.m3_tl_count} (${r.m3_tl_score}đ)` : '-'}</td>
          <td style="text-align: center; font-weight: bold;">${r.total_count}</td>
          <td style="text-align: center; font-weight: bold;">${r.total_score}đ</td>
          <td style="text-align: center;">${r.percentage}%</td>
        </tr>
      `
        )
        .join('')}
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <td>TỔNG ĐIỂM</td>
        <td colspan="2" style="text-align: center;">${matrix.summary.m1_total_score}đ (${matrix.summary.m1_percentage}%)</td>
        <td colspan="2" style="text-align: center;">${matrix.summary.m2_total_score}đ (${matrix.summary.m2_percentage}%)</td>
        <td colspan="2" style="text-align: center;">${matrix.summary.m3_total_score}đ (${matrix.summary.m3_percentage}%)</td>
        <td colspan="2" style="text-align: center; color: red;">${matrix.summary.grand_total_score} điểm</td>
        <td style="text-align: center;">100%</td>
      </tr>
    </tbody>
  </table>

  <!-- ================= 4. BẢN ĐẶC TẢ MA TRẬN ================= -->
  <div class="page-break"></div>
  <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 15px; text-transform: uppercase;">
    BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2" style="width: 5%;">STT</th>
        <th rowspan="2" style="width: 20%;">Chủ đề</th>
        <th rowspan="2" style="width: 20%;">Đơn vị kiến thức</th>
        <th rowspan="2" style="width: 35%;">Yêu cầu cần đạt (YCCĐ)</th>
        <th colspan="2">Mức 1</th>
        <th colspan="2">Mức 2</th>
        <th colspan="2">Mức 3</th>
      </tr>
      <tr>
        <th>TN</th><th>TL</th>
        <th>TN</th><th>TL</th>
        <th>TN</th><th>TL</th>
      </tr>
    </thead>
    <tbody>
      ${specifications
        .map(
          (s, idx) => `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td><strong>${s.topic}</strong></td>
          <td>${s.subTopic}</td>
          <td>${s.requirements}</td>
          <td style="text-align: center;">${s.m1_tn || '-'}</td>
          <td style="text-align: center;">${s.m1_tl || '-'}</td>
          <td style="text-align: center;">${s.m2_tn || '-'}</td>
          <td style="text-align: center;">${s.m2_tl || '-'}</td>
          <td style="text-align: center;">${s.m3_tn || '-'}</td>
          <td style="text-align: center;">${s.m3_tl || '-'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

</body>
</html>
  `;

  // Create Blob and trigger download
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `De_Kiem_Tra_${subject}_Lop${grade}_${exam.semester}.doc`.replace(/\s+/g, '_');
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
