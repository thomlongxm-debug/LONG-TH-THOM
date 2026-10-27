import { Grade, Semester, Subject } from '../types/exam';

export interface MathStrandDistribution {
  soVaPhepTinh: number; // %
  hinhHocVaDoLuong: number; // %
  thongKeVaXacSuat: number; // %
  note?: string;
}

export interface ReadingTextGuideline {
  genre: string;
  wordRange: string;
  minWords: number;
  maxWords: number;
}

export interface VietnameseStructureRule {
  readingAloudScore: number;
  readingComprehensionScore: number;
  writingScore: number;
  readingTotalQuestions: number;
  readingQuestionsBreakdown: {
    docHieuScore: number;
    docHieuTN: { count: number; score: number };
    docHieuTL: { count: number; score: number };
    kttvScore: number;
    kttvTN: { count: number; score: number };
    kttvTL: { count: number; score: number };
  };
  levelsRatio: { m1: number; m2: number; m3: number }; // %
  writingDetails: {
    dictationScore: number;
    compositionScore: number;
    exerciseScore?: number;
    exerciseCount?: number;
    compositionNote: string;
  };
  texts: ReadingTextGuideline[];
}

// 1. Math Curriculum Standards
export const MATH_LESSON_HOURS: Record<Grade, { totalHours: number; soPct: number; hhPct: number; tkPct: number; hdtnPct: number }> = {
  1: { totalHours: 105, soPct: 80, hhPct: 15, tkPct: 0, hdtnPct: 5 },
  2: { totalHours: 175, soPct: 75, hhPct: 17, tkPct: 3, hdtnPct: 5 },
  3: { totalHours: 175, soPct: 70, hhPct: 22, tkPct: 3, hdtnPct: 5 },
  4: { totalHours: 175, soPct: 75, hhPct: 16, tkPct: 4, hdtnPct: 5 },
  5: { totalHours: 175, soPct: 50, hhPct: 40, tkPct: 5, hdtnPct: 5 },
};

// Math Exam Strands distribution by Grade and Semester
export function getMathStrandDistribution(grade: Grade, semester: Semester): MathStrandDistribution {
  if (grade === 1) {
    if (semester === 'GKI' || semester === 'CKI') {
      return {
        soVaPhepTinh: 80,
        hinhHocVaDoLuong: 20,
        thongKeVaXacSuat: 0,
        note: 'Kỳ I: Số = 80% (khoảng 3.5 - 4.5đ); Hình học & đo lường = 20% (11/54 tiết = 2.0đ)',
      };
    } else {
      return {
        soVaPhepTinh: 80,
        hinhHocVaDoLuong: 20,
        thongKeVaXacSuat: 0,
        note: 'Kỳ II: Số = 80%; Hình học & đo lường = 20% (Cả năm 29/105 tiết = 27.61%)',
      };
    }
  }

  if (grade === 2 || grade === 3) {
    if (semester === 'GKI' || semester === 'CKI') {
      const hhNote = grade === 2 ? 'CKI HH&ĐL = 28/90 = 31.1%' : 'CKI HH&ĐL = 23/90 = 25.55%';
      return {
        soVaPhepTinh: 70,
        hinhHocVaDoLuong: 30,
        thongKeVaXacSuat: 0,
        note: `Kỳ I: Số & PT = 70%; Hình học & đo lường = 30% (${hhNote})`,
      };
    } else {
      return {
        soVaPhepTinh: 70,
        hinhHocVaDoLuong: 20,
        thongKeVaXacSuat: 10,
        note: 'Kỳ II / Cả năm: Số & PT = 70%; HH&ĐL = 20%; Thống kê & xác suất = 10% (Cả năm 45/175 tiết = 25.7%)',
      };
    }
  }

  if (grade === 4) {
    if (semester === 'GKI') {
      return { soVaPhepTinh: 70, hinhHocVaDoLuong: 30, thongKeVaXacSuat: 0, note: 'GKI: Số & PT = 70%; HH&ĐL = 30% (16/45 = 35.55%)' };
    }
    if (semester === 'CKI') {
      return { soVaPhepTinh: 50, hinhHocVaDoLuong: 50, thongKeVaXacSuat: 0, note: 'CKI: Số & PT = 50%; HH&ĐL = 50% (44/90 = 48.88%)' };
    }
    if (semester === 'GKII') {
      return { soVaPhepTinh: 70, hinhHocVaDoLuong: 30, thongKeVaXacSuat: 0, note: 'GKII: Số & PT = 70%; HH&ĐL = 30% (44/135 = 32.59%)' };
    }
    return { soVaPhepTinh: 70, hinhHocVaDoLuong: 20, thongKeVaXacSuat: 10, note: 'Cuối năm: Số & PT = 70%; HH&ĐL = 20%; Thống kê & xác suất = 10% (47/175 = 26.85%)' };
  }

  // Grade 5
  if (semester === 'GKI') {
    return { soVaPhepTinh: 80, hinhHocVaDoLuong: 20, thongKeVaXacSuat: 0, note: 'GKI: Số & PT = 80%; HH&ĐL = 20% (8/45 = 17.77%)' };
  }
  if (semester === 'CKI') {
    return { soVaPhepTinh: 60, hinhHocVaDoLuong: 40, thongKeVaXacSuat: 0, note: 'CKI: Số & PT = 60%; HH&ĐL = 40% (34/90 = 37.77%)' };
  }
  if (semester === 'GKII') {
    return { soVaPhepTinh: 50, hinhHocVaDoLuong: 50, thongKeVaXacSuat: 0, note: 'GKII: Số & PT = 50%; HH&ĐL = 50% (75/135 = 55.55%)' };
  }
  return { soVaPhepTinh: 50, hinhHocVaDoLuong: 40, thongKeVaXacSuat: 10, note: 'Cuối năm: Số & PT = 50%; HH&ĐL = 40%; Thống kê & xác suất = 10% (83/175 = 47.42%)' };
}

// 2. Vietnamese Language Rules by Grade
export const VIETNAMESE_RULES: Record<Grade, VietnameseStructureRule> = {
  1: {
    readingAloudScore: 6,
    readingComprehensionScore: 4,
    writingScore: 10,
    readingTotalQuestions: 7,
    readingQuestionsBreakdown: {
      docHieuScore: 4,
      docHieuTN: { count: 6, score: 3.0 },
      docHieuTL: { count: 1, score: 1.0 },
      kttvScore: 0,
      kttvTN: { count: 0, score: 0 },
      kttvTL: { count: 0, score: 0 },
    },
    levelsRatio: { m1: 20, m2: 10, m3: 10 },
    writingDetails: {
      dictationScore: 6,
      compositionScore: 0,
      exerciseScore: 4,
      exerciseCount: 4,
      compositionNote: 'Nghe viết: 6đ; Bài tập chính tả/ngữ âm: 4đ (gồm 4 bài tập phân biệt vần/tiếng).',
    },
    texts: [
      { genre: 'Truyện kể / Miêu tả', wordRange: '90 – 130 chữ', minWords: 90, maxWords: 130 },
      { genre: 'Thơ', wordRange: '50 – 70 chữ', minWords: 50, maxWords: 70 },
    ],
  },
  2: {
    readingAloudScore: 4,
    readingComprehensionScore: 6,
    writingScore: 10,
    readingTotalQuestions: 9,
    readingQuestionsBreakdown: {
      docHieuScore: 4,
      docHieuTN: { count: 4, score: 2.0 },
      docHieuTL: { count: 2, score: 2.0 },
      kttvScore: 2,
      kttvTN: { count: 2, score: 1.0 },
      kttvTL: { count: 1, score: 1.0 },
    },
    levelsRatio: { m1: 30, m2: 20, m3: 10 },
    writingDetails: {
      dictationScore: 4,
      compositionScore: 6,
      compositionNote: 'Nghe viết: 4đ; Viết đoạn bài: 6đ (Viết 3 - 4 câu về một chủ đề quen thuộc).',
    },
    texts: [
      { genre: 'Truyện kể', wordRange: '180 – 200 chữ', minWords: 180, maxWords: 200 },
      { genre: 'Bài miêu tả', wordRange: '150 – 180 chữ', minWords: 150, maxWords: 180 },
      { genre: 'Thơ', wordRange: '70 – 90 chữ', minWords: 70, maxWords: 90 },
      { genre: 'Văn bản thông tin', wordRange: '110 – 140 chữ', minWords: 110, maxWords: 140 },
    ],
  },
  3: {
    readingAloudScore: 4,
    readingComprehensionScore: 6,
    writingScore: 10,
    readingTotalQuestions: 9,
    readingQuestionsBreakdown: {
      docHieuScore: 4,
      docHieuTN: { count: 4, score: 2.0 },
      docHieuTL: { count: 2, score: 2.0 },
      kttvScore: 2,
      kttvTN: { count: 2, score: 1.0 },
      kttvTL: { count: 1, score: 1.0 },
    },
    levelsRatio: { m1: 30, m2: 20, m3: 10 },
    writingDetails: {
      dictationScore: 4,
      compositionScore: 6,
      compositionNote: 'Nghe viết: 4đ; Viết đoạn bài: 6đ (Viết đoạn văn từ 4 - 5 câu).',
    },
    texts: [
      { genre: 'Truyện kể', wordRange: '200 – 250 chữ', minWords: 200, maxWords: 250 },
      { genre: 'Bài miêu tả', wordRange: '180 – 200 chữ', minWords: 180, maxWords: 200 },
      { genre: 'Thơ', wordRange: '80 – 100 chữ', minWords: 80, maxWords: 100 },
      { genre: 'Văn bản thông tin', wordRange: '120 – 150 chữ', minWords: 120, maxWords: 150 },
    ],
  },
  4: {
    readingAloudScore: 3,
    readingComprehensionScore: 7,
    writingScore: 10,
    readingTotalQuestions: 11,
    readingQuestionsBreakdown: {
      docHieuScore: 4,
      docHieuTN: { count: 4, score: 2.0 },
      docHieuTL: { count: 2, score: 2.0 },
      kttvScore: 3,
      kttvTN: { count: 4, score: 2.0 },
      kttvTL: { count: 1, score: 1.0 },
    },
    levelsRatio: { m1: 40, m2: 20, m3: 10 },
    writingDetails: {
      dictationScore: 0,
      compositionScore: 10,
      compositionNote: 'Viết bài văn: 10đ (Đoạn văn hoặc bài văn ngắn theo thể loại miêu tả cây cối, con vật hoặc kể chuyện).',
    },
    texts: [
      { genre: 'Truyện kể, kịch bản', wordRange: '280 – 330 chữ', minWords: 280, maxWords: 330 },
      { genre: 'Bài miêu tả', wordRange: '200 – 250 chữ', minWords: 200, maxWords: 250 },
      { genre: 'Thơ', wordRange: '100 – 120 chữ', minWords: 100, maxWords: 120 },
      { genre: 'Văn bản thông tin', wordRange: '150 – 180 chữ', minWords: 150, maxWords: 180 },
    ],
  },
  5: {
    readingAloudScore: 3,
    readingComprehensionScore: 7,
    writingScore: 10,
    readingTotalQuestions: 11,
    readingQuestionsBreakdown: {
      docHieuScore: 4,
      docHieuTN: { count: 4, score: 2.0 },
      docHieuTL: { count: 2, score: 2.0 },
      kttvScore: 3,
      kttvTN: { count: 4, score: 2.0 },
      kttvTL: { count: 1, score: 1.0 },
    },
    levelsRatio: { m1: 40, m2: 20, m3: 10 },
    writingDetails: {
      dictationScore: 0,
      compositionScore: 10,
      compositionNote: 'Viết bài văn hoàn chỉnh: 10đ (Tả người, tả cảnh hoặc viết đoạn văn nêu ý kiến).',
    },
    texts: [
      { genre: 'Truyện kể, kịch bản', wordRange: '300 – 350 chữ', minWords: 300, maxWords: 350 },
      { genre: 'Bài miêu tả', wordRange: '200 – 250 chữ', minWords: 200, maxWords: 250 },
      { genre: 'Thơ', wordRange: '110 – 130 chữ', minWords: 110, maxWords: 130 },
      { genre: 'Văn bản thông tin', wordRange: 'Khoảng 230 chữ', minWords: 210, maxWords: 250 },
    ],
  },
};

// General Subject rules
export function getSubjectRules(subject: Subject, grade: Grade, semester: Semester) {
  const commonRatio = {
    m1: 50,
    m2: 30,
    m3: 20,
    tn: 60,
    tl: 40,
  };

  if (subject === 'Toán') {
    const mathStrands = getMathStrandDistribution(grade, semester);
    return {
      ratio: commonRatio,
      strands: mathStrands,
      hasGridOption: true,
      duration: grade === 1 ? 35 : 40,
      instructions: 'Đề kiểm tra gồm Trắc nghiệm (6.0đ) và Tự luận (4.0đ). Cần có hình vẽ lưới ô vuông cho câu hỏi hình học.',
    };
  }

  if (subject === 'Tiếng Việt') {
    const tvRule = VIETNAMESE_RULES[grade];
    return {
      ratio: {
        m1: tvRule.levelsRatio.m1,
        m2: tvRule.levelsRatio.m2,
        m3: tvRule.levelsRatio.m3,
        tn: 60,
        tl: 40,
      },
      tvRule,
      hasGridOption: false,
      duration: grade <= 2 ? 60 : 70,
      instructions: `Gồm Kiểm tra Đọc (${tvRule.readingAloudScore + tvRule.readingComprehensionScore}đ) và Kiểm tra Viết (${tvRule.writingScore}đ). Bài đọc phải ngoài SGK, đúng số lượng chữ quy định.`,
    };
  }

  // Lịch sử & Địa lý, Khoa học, Công nghệ
  return {
    ratio: commonRatio,
    hasGridOption: false,
    duration: 40,
    instructions: 'Tỷ lệ Mức 1 - 2 - 3: 50% - 30% - 20%. Trắc nghiệm: 60% (6 câu/6đ) - Tự luận: 40% (4 câu/4đ).',
  };
}
