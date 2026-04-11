export type UserRole = 'employer' | 'candidate';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  employeeId?: string;
}

export type QuestionType = 'radio' | 'checkbox' | 'text';

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string | string[];
  points?: number;
}

export interface QuestionSet {
  id: string;
  name: string;
  questions: Question[];
}

export interface ExamSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Exam {
  id: string;
  title: string;
  createdBy: string;
  totalCandidates: number;
  totalSlots: number;
  questionSets: QuestionSet[];
  slots: ExamSlot[];
  duration: number; // minutes
  negativeMarking: boolean;
  startTime: string;
  endTime: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export interface CandidateExamAttempt {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  examId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'violated';
  answers: Record<string, string | string[]>;
  score?: number;
  totalQuestions: number;
  violations: number;
  startedAt?: string;
  submittedAt?: string;
}

export interface ExamAnswer {
  questionId: string;
  answer: string | string[];
}

export interface CreateExamPayload {
  title: string;
  totalCandidates: number;
  totalSlots: number;
  questionSets: QuestionSet[];
  duration: number;
  startTime: string;
  endTime: string;
  negativeMarking: boolean;
}
