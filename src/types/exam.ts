export type Subject = 'Toán' | 'Tiếng Việt' | 'Lịch sử và Địa lý' | 'Khoa học' | 'Công nghệ';
export type Grade = 1 | 2 | 3 | 4 | 5;
export type Semester = 'GKI' | 'CKI' | 'GKII' | 'CKII';
export type QuestionLevel = 'Mức 1' | 'Mức 2' | 'Mức 3';
export type QuestionType = 'TN' | 'TL';

export interface MatrixRow {
  id: string;
  topic: string; // Mạch kiến thức (VD: Số và phép tính, Hình học và đo lường...)
  subTopics?: string;
  m1_tn_count: number;
  m1_tn_score: number;
  m1_tl_count: number;
  m1_tl_score: number;
  m2_tn_count: number;
  m2_tn_score: number;
  m2_tl_count: number;
  m2_tl_score: number;
  m3_tn_count: number;
  m3_tn_score: number;
  m3_tl_count: number;
  m3_tl_score: number;
  total_count: number;
  total_score: number;
  percentage: number;
}

export interface MatrixSummary {
  m1_total_score: number;
  m1_percentage: number;
  m2_total_score: number;
  m2_percentage: number;
  m3_total_score: number;
  m3_percentage: number;
  tn_total_score: number;
  tn_percentage: number;
  tl_total_score: number;
  tl_percentage: number;
  grand_total_score: number;
}

export interface MatrixData {
  rows: MatrixRow[];
  summary: MatrixSummary;
}

export interface SpecificationRow {
  id: string;
  topic: string; // Chủ đề / Mạch nội dung
  subTopic: string; // Đơn vị kiến thức / Kĩ năng
  requirements: string; // Mức độ đánh giá / Yêu cầu cần đạt
  m1_tn?: string; // Câu 1, Câu 2
  m1_tl?: string;
  m2_tn?: string;
  m2_tl?: string;
  m3_tn?: string;
  m3_tl?: string;
}

export interface GridCell {
  row: number;
  col: number;
  filled: boolean;
  color?: string;
  label?: string;
}

export interface GridConfig {
  type: 'math-grid';
  rows: number;
  cols: number;
  cellSize?: number;
  title?: string;
  cells?: GridCell[];
  shape?: 'rectangle' | 'triangle' | 'parallelogram' | 'custom' | 'none';
  widthLabel?: string;
  heightLabel?: string;
  description?: string;
}

export interface ExamQuestion {
  id: string;
  number: string; // "Câu 1", "Câu 2"...
  score: number;
  level: QuestionLevel;
  type: QuestionType;
  strand?: string; // Mạch kiến thức
  content: string;
  options?: string[]; // Cho câu TN: ["A. 12", "B. 24", "C. 36", "D. 48"]
  hasGrid?: boolean;
  gridConfig?: GridConfig | null;
  imageHint?: string;
}

export interface ExamPart {
  id: string;
  partName: string; // PHẦN I. TRẮC NGHIỆM KHÁCH QUAN / PHẦN II. TỰ LUẬN
  description?: string;
  score?: number;
  questions: ExamQuestion[];
}

export interface ReadingPassage {
  title: string;
  author?: string;
  genre?: string;
  wordCount: number;
  content: string;
  standardWordRange?: string; // Ví dụ "180 - 200 chữ"
  imageUrl?: string;
}

export interface VietnameseSpeakingExam {
  title: string;
  score: number;
  instructions: string;
  criteria?: { name: string; score: number }[];
}

export interface VietnameseWritingExam {
  title: string;
  totalScore: number;
  dictation?: {
    title: string;
    score: number;
    content: string;
    guide?: string;
  };
  exercises?: {
    title: string;
    score: number;
    content: string;
  };
  composition?: {
    title: string;
    score: number;
    prompt: string;
    wordRequirement?: string;
    rubric?: { criteria: string; score: number }[];
  };
}

export interface ExamPaper {
  instructions: string;
  readingPassage?: ReadingPassage | null;
  vietnameseSpeakingExam?: VietnameseSpeakingExam | null;
  vietnameseWritingExam?: VietnameseWritingExam | null;
  parts: ExamPart[];
}

export interface AnswerItem {
  id: string;
  questionNumber: string;
  level: QuestionLevel;
  type: QuestionType;
  score: number;
  solution: string;
  notes?: string;
}

export interface ExamPackage {
  id: string;
  title: string;
  subject: Subject;
  grade: Grade;
  semester: Semester;
  bookSeries: string;
  durationMinutes: number;
  createdAt: string;
  schoolHeader: {
    district: string;
    schoolName: string;
    academicYear: string;
    examName?: string;
  };
  matrix: MatrixData;
  specifications: SpecificationRow[];
  examPaper: ExamPaper;
  answerGuide: AnswerItem[];
  evaluationNotes?: string;
}
