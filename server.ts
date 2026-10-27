import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI instance server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Route: Generate Exam & Matrix via Gemini
app.post('/api/generate-exam', async (req: Request, res: Response) => {
  try {
    const {
      subject,
      grade,
      semester,
      bookSeries,
      duration,
      schoolName,
      district,
      customRequirements,
      ratioSettings,
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trong hệ thống. Vui lòng cấu hình biến môi trường hoặc sử dụng kho đề mẫu chuẩn có sẵn.',
      });
    }

    const systemPrompt = `Bạn là Chuyên gia Khảo thí và Đánh giá giáo dục Tiểu học hàng đầu Việt Nam, am hiểu sâu sắc Chương trình Giáo dục phổ thông (GDPT) 2018, Thông tư 27/2020/TT-BGDĐT quy định về đánh giá học sinh tiểu học.
Nhiệm vụ của bạn là xây dựng TRỌN BỘ HỒ SƠ KIỂM TRA ĐỊNH KỲ TIỂU HỌC gồm:
1. Ma trận đề kiểm tra (Bảng 3 mức độ chuẩn Thông tư 27).
2. Bản đặc tả ma trận đề kiểm tra (Yêu cầu cần đạt chi tiết).
3. Đề kiểm tra định kỳ chính thức (Đầy đủ tiêu đề, phần đọc hiểu/trắc nghiệm/tự luận).
4. Hướng dẫn chấm và thang điểm chi tiết (Đáp án chi tiết từng câu, từng ý).

QUY ĐỊNH BẮT BUỘC THEO TỪNG MÔN:
1. MÔN TOÁN:
- Tỷ lệ các mức độ nhận thức: Mức 1 (Nhận biết): 50% - Mức 2 (Thông hiểu/kết nối): 30% - Mức 3 (Vận dụng/vận dụng sáng tạo): 20%.
- Tỷ lệ hình thức: Trắc nghiệm khách quan (TN) = 60% (6 điểm) ; Tự luận (TL) = 40% (4 điểm). Tổng = 10 điểm.
- Phân bố mạch kiến thức:
  + Lớp 1: Kỳ I: Số & PT = 80%; Hình học & Đo lường = 20%. Kỳ II: Số & PT = 80%; Hình học & Đo lường = 20%.
  + Lớp 2, 3: Kỳ I: Số & PT = 70%; Hình học & Đo lường = 30%. Kỳ II: Số & PT = 70%; Hình học & Đo lường = 20%; Thống kê & Xác suất = 10%.
  + Lớp 4: Giữa kì I: Số & PT = 70%; HH&ĐL = 30%. Cuối kì I: Số & PT = 50%; HH&ĐL = 50%. Giữa kì II: Số & PT = 70%; HH&ĐL = 30%. Cuối năm: Số & PT = 70%; HH&ĐL = 20%; Thống kê & Xác suất = 10%.
  + Lớp 5: Giữa kì I: Số & PT = 80%; HH&ĐL = 20%. Cuối kì I: Số & PT = 60%; HH&ĐL = 40%. Giữa kì II: Số & PT = 50%; HH&ĐL = 50%. Cuối năm: Số & PT = 50%; HH&ĐL = 40%; Thống kê & Xác suất = 10%.
- Chú ý: Đề thi môn Toán phải có câu hỏi liên quan đến hình vẽ hoặc lưới ô vuông cho học sinh tính chu vi, diện tích hoặc đếm hình.

2. MÔN TIẾNG VIỆT:
- Lớp 1:
  + Đọc thành tiếng = 6đ (Vần, từ, câu); Đọc hiểu = 4đ (văn bản ngoài SGK, độ dài truyện/miêu tả 90-130 chữ, thơ 50-70 chữ). Đọc hiểu gồm: TN 6 câu = 3đ (M1 = 3 câu, M2 = 3 câu); TL 1 câu = 1đ (M3).
  + Viết: Nghe - viết = 6đ; Bài tập chính tả/ngữ âm = 4đ (4 bài tập).
- Lớp 2, 3:
  + Đọc thành tiếng = 4đ; Đọc hiểu = 6đ (văn bản ngoài SGK).
  + Viết: Nghe - viết = 4đ; Viết đoạn bài = 6đ (đoạn 3-5 câu).
  + Đọc hiểu 6đ (9 câu): Đọc hiểu văn bản 4đ (TN 4 câu = 2đ, TL 2 câu = 2đ); Kiến thức tiếng Việt 2đ (TN 2 câu = 1đ, TL 1 câu = 1đ). Mức 1 - 2 - 3 khoảng 30% - 20% - 10%.
  + Độ dài văn bản đọc hiểu: Lớp 2: truyện 180-200 chữ, miêu tả 150-180 chữ, thơ 70-90 chữ. Lớp 3: truyện 200-250 chữ, miêu tả 180-200 chữ, thơ 80-100 chữ.
- Lớp 4, 5:
  + Đọc thành tiếng = 3đ; Đọc hiểu = 7đ (văn bản đọc ngoài SGK).
  + Viết đoạn/bài văn = 10đ.
  + Đọc hiểu 7đ (11 câu): Đọc hiểu văn bản 4đ (TN 4 câu = 2đ, TL 2 câu = 2đ); Kiến thức tiếng Việt 3đ (TN 4 câu = 2đ, TL 1 câu = 1đ). Tỉ lệ Mức 1 - 2 - 3 khoảng 40% - 20% - 10%.
  + Độ dài văn bản: Lớp 4: truyện 280-330 chữ, miêu tả 200-250 chữ, thơ 100-120 chữ. Lớp 5: truyện 300-350 chữ, miêu tả 200-250 chữ, thơ 110-130 chữ.

3. MÔN LỊCH SỬ & ĐỊA LÝ (Lớp 4, 5):
- Tỷ lệ Mức 1 - 2 - 3: 50% - 30% - 20%.
- Tỷ lệ TN 60% (6 điểm) - TL 40% (4 điểm).
- Bám sát mạch kiến thức Địa phương em, Vùng đất nước, Các triều đại lịch sử, Địa lý Việt Nam.

4. MÔN KHOA HỌC (Lớp 4, 5):
- Tỷ lệ Mức 1 - 2 - 3: 50% - 30% - 20%.
- Tỷ lệ TN 60% (6 điểm) - TL 40% (4 điểm).
- Chủ đề: Chất, Năng lượng, Thực vật và động vật, Con người và sức khỏe, Nấm/Vi khuẩn/Sinh vật.

5. MÔN CÔNG NGHỆ (Lớp 3, 4, 5):
- Tỷ lệ Mức 1 - 2 - 3: 50% - 30% - 20%.
- Tỷ lệ TN 60% - TL 40%.
- Chủ đề: Công nghệ và đời sống, Thủ công kĩ thuật, An toàn kĩ thuật.

HÃY TRẢ VỀ DỮ LIỆU ĐỊNH DẠNG JSON HỢP LỆ THEO SCHEMA SAU ĐÂY:
{
  "title": "ĐỀ KIỂM TRA ĐỊNH KỲ...",
  "subject": "Toán" | "Tiếng Việt" | "Lịch sử và Địa lý" | "Khoa học" | "Công nghệ",
  "grade": 1 | 2 | 3 | 4 | 5,
  "semester": "GKI" | "CKI" | "GKII" | "CKII",
  "bookSeries": "Kết nối tri thức" | "Cánh Diều" | "Chân trời sáng tạo" | "Chuẩn GDPT 2018",
  "durationMinutes": 40,
  "schoolHeader": {
    "district": "PHÒNG GD&ĐT...",
    "schoolName": "TRƯỜNG TIỂU HỌC...",
    "academicYear": "2024 - 2025"
  },
  "matrix": {
    "rows": [
      {
        "id": "1",
        "topic": "Số và phép tính",
        "m1_tn_count": 2,
        "m1_tn_score": 1.0,
        "m1_tl_count": 1,
        "m1_tl_score": 1.0,
        "m2_tn_count": 2,
        "m2_tn_score": 1.0,
        "m2_tl_count": 1,
        "m2_tl_score": 1.0,
        "m3_tn_count": 0,
        "m3_tn_score": 0,
        "m3_tl_count": 1,
        "m3_tl_score": 1.0,
        "total_count": 7,
        "total_score": 5.0,
        "percentage": 50
      }
    ],
    "summary": {
      "m1_total_score": 5.0,
      "m1_percentage": 50,
      "m2_total_score": 3.0,
      "m2_percentage": 30,
      "m3_total_score": 2.0,
      "m3_percentage": 20,
      "tn_total_score": 6.0,
      "tn_percentage": 60,
      "tl_total_score": 4.0,
      "tl_percentage": 40,
      "grand_total_score": 10.0
    }
  },
  "specifications": [
    {
      "id": "1",
      "topic": "Số và phép tính",
      "subTopic": "Phép cộng, phép trừ có nhớ trong phạm vi 100",
      "requirements": "Nhận biết được thành phần và kết quả phép tính, thực hiện được phép cộng trừ...",
      "m1_tn": "Câu 1, Câu 2",
      "m1_tl": "Câu 7a",
      "m2_tn": "Câu 3, Câu 4",
      "m2_tl": "Câu 8",
      "m3_tn": "",
      "m3_tl": "Câu 10"
    }
  ],
  "readingPassage": {
    "title": "Tên bài đọc (nếu môn Tiếng Việt)",
    "author": "Tên tác giả",
    "wordCount": 185,
    "genre": "Truyện kể" | "Bài miêu tả" | "Thơ" | "Văn bản thông tin",
    "content": "Nội dung bài đọc..."
  },
  "examPaper": {
    "instructions": "Học sinh làm bài trực tiếp trên giấy kiểm tra này...",
    "parts": [
      {
        "partName": "PHẦN I. TRẮC NGHIỆM KHÁCH QUAN",
        "description": "Khoanh tròn vào chữ cái A, B, C, D đặt trước câu trả lời đúng...",
        "questions": [
          {
            "number": "Câu 1",
            "score": 0.5,
            "level": "Mức 1",
            "type": "TN",
            "content": "Số lớn nhất có hai chữ số là:",
            "options": ["A. 90", "B. 99", "C. 10", "D. 89"],
            "hasGrid": false,
            "gridConfig": null
          }
        ]
      },
      {
        "partName": "PHẦN II. TỰ LUẬN",
        "description": "Thực hiện các bài tập sau:",
        "questions": [
          {
            "number": "Câu 7",
            "score": 2.0,
            "level": "Mức 2",
            "type": "TL",
            "content": "Đặt tính rồi tính:\\na) 35 + 28\\nb) 72 - 46",
            "hasGrid": true,
            "gridConfig": {
              "type": "math-grid",
              "rows": 4,
              "cols": 8,
              "description": "Lưới ô vuông đặt tính"
            }
          }
        ]
      }
    ],
    "vietnameseSpeakingExam": {
      "title": "A. KIỂM TRA ĐỌC THÀNH TIẾNG (Dành riêng cho môn Tiếng Việt)",
      "score": 4.0,
      "instructions": "Giáo viên bốc thăm cho học sinh đọc một đoạn văn khoảng 50 - 70 từ và trả lời 1 câu hỏi nội dung."
    },
    "vietnameseWritingExam": {
      "title": "B. KIỂM TRA VIẾT (Dành riêng cho môn Tiếng Việt)",
      "dictation": {
        "title": "1. Nghe - viết chính tả (4 điểm)",
        "content": "Nội dung đoạn văn nghe viết..."
      },
      "composition": {
        "title": "2. Tập làm văn / Viết đoạn văn (6 điểm)",
        "prompt": "Viết đoạn văn từ 4 - 5 câu kể về một người bạn mà em yêu quý."
      }
    }
  },
  "answerGuide": [
    {
      "questionNumber": "Câu 1",
      "level": "Mức 1",
      "type": "TN",
      "score": 0.5,
      "solution": "Đáp án B (99)",
      "notes": "Khoanh đúng được 0.5 điểm"
    },
    {
      "questionNumber": "Câu 7",
      "level": "Mức 2",
      "type": "TL",
      "score": 2.0,
      "solution": "a) 35 + 28 = 63 (Đặt tính thẳng hàng: 0.5đ, tính đúng: 0.5đ)\\nb) 72 - 46 = 26 (Đặt tính thẳng hàng: 0.5đ, tính đúng: 0.5đ)",
      "notes": "Nếu không đặt tính mà ghi ngay kết quả chỉ được nửa số điểm."
    }
  ],
  "evaluationNotes": "Lưu ý khi chấm bài: Giáo viên linh hoạt đánh giá vì sự tiến bộ của học sinh theo Thông tư 27..."
}`;

    const userPrompt = `Hãy tạo một bộ đề kiểm tra hoàn chỉnh chuẩn GDPT 2018 với các thông số:
- Môn học: ${subject}
- Khối lớp: Lớp ${grade}
- Thời điểm kiểm tra: ${semester}
- Bộ sách: ${bookSeries || 'Chuẩn GDPT 2018'}
- Thời gian làm bài: ${duration || 40} phút
- Đơn vị: ${schoolName || 'Trường Tiểu học'} - ${district || 'Phòng GD&ĐT'}
- Tỷ lệ mức độ: ${ratioSettings?.levelRatio || 'Mức 1: 50% - Mức 2: 30% - Mức 3: 20%'}
- Tỷ lệ hình thức: ${ratioSettings?.typeRatio || 'Trắc nghiệm: 60% - Tự luận: 40%'}
- Yêu cầu bổ sung của giáo viên: ${customRequirements || 'Tạo đề bám sát trọng tâm kiến thức chương trình, câu hỏi phong phú, ngôn ngữ trong sáng phù hợp tâm lý lứa tuổi tiểu học, có câu hỏi hình vẽ trên lưới ô vuông nếu là môn Toán.'}

CHÚ Ý QUAN TRỌNG:
1. Đảm bảo tổng số điểm toàn đề = 10 điểm (đối với Tiếng Việt: Đọc hiểu + KTTV theo đúng thang quy định, có thêm phần đọc thành tiếng và kiểm tra viết).
2. Kiểm tra chặt chẽ số chữ bài đọc hiểu môn Tiếng Việt theo đúng độ dài quy định từng lớp.
3. Nếu môn Toán, cung cấp cấu hình lưới ô vuông (gridConfig) cho câu hỏi hình học / đặt tính.
4. Chỉ trả về một JSON duy nhất, không thêm markdown ngoài thẻ json, không chú thích thêm.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const responseText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      // Clean possible wrapping markdown if needed
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating exam:', error);
    return res.status(500).json({
      error: error.message || 'Có lỗi xảy ra khi tạo đề kiểm tra bằng AI.',
    });
  }
});

// API Route: AI Question Refinement & Variations
app.post('/api/refine-question', async (req: Request, res: Response) => {
  try {
    const { question, action, subject, grade } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'Chưa cấu hình GEMINI_API_KEY' });
    }

    const prompt = `Bạn là chuyên gia ra đề thi tiểu học. 
Môn: ${subject}, Lớp: ${grade}.
Câu hỏi hiện tại:
${JSON.stringify(question, null, 2)}

Hành động yêu cầu: ${action} (Ví dụ: "Tạo câu hỏi tương đương", "Nâng mức độ lên Mức 3", "Hạ mức độ xuống Mức 1", "Đổi số liệu toán học", "Làm cho ngôn ngữ sinh động hơn").

Hãy trả về câu hỏi mới dưới dạng JSON:
{
  "content": "Nội dung câu hỏi mới",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."], // nếu là trắc nghiệm
  "level": "Mức 1" | "Mức 2" | "Mức 3",
  "score": 1.0,
  "solution": "Lời giải / đáp án chi tiết"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const responseText = response.text || '';
    const parsedData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Lỗi xử lý câu hỏi.' });
  }
});

// Vite middleware for development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
