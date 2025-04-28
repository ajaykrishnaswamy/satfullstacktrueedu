export interface SATQuestion {
  id: number;
  type: 'reading' | 'writing' | 'math_no_calc' | 'math_calc';
  options: string[];
  passage?: string;
  question: string;
  explanation: string;
  correctAnswer: string;
}

export interface SATSection {
  type: 'reading' | 'writing' | 'math_no_calc' | 'math_calc';
  questions: SATQuestion[];
  timeLimit: number;
}

export interface SATTest {
  id: number;
  name: string;
  questions: any;
  status: string;
  created_at: string;
  share_id: string | null;
  sections: any;
  total_time: number;
} 