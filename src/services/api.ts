import { User, Exam, CandidateExamAttempt, CreateExamPayload } from '@/types';
import { mockUsers } from '@/mock/mock-users';
import { mockExams } from '@/mock/mock-exams';
import { mockAttempts } from '@/mock/mock-candidates';

// Simulated delay
const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

// In-memory stores that persist during session
let exams = [...mockExams];
let attempts = [...mockAttempts];

export const api = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay(800);
    const user = mockUsers.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    const { password: _, ...userData } = user;
    return userData;
  },

  // Exams
  async getExams(userId?: string, role?: string): Promise<Exam[]> {
    await delay();
    if (role === 'employer' && userId) {
      return exams.filter((e) => e.createdBy === userId);
    }
    return exams.filter((e) => e.status === 'active');
  },

  async getExam(examId: string): Promise<Exam> {
    await delay(400);
    const exam = exams.find((e) => e.id === examId);
    if (!exam) throw new Error('Exam not found');
    return exam;
  },

  async createExam(payload: CreateExamPayload, userId: string): Promise<Exam> {
    await delay(1000);
    const newExam: Exam = {
      ...payload,
      id: `exam-${Date.now()}`,
      createdBy: userId,
      slots: payload.totalSlots > 0
        ? Array.from({ length: payload.totalSlots }, (_, i) => ({
            id: `slot-${Date.now()}-${i}`,
            startTime: payload.startTime,
            endTime: payload.endTime,
          }))
        : [],
      status: 'active',
    };
    exams = [...exams, newExam];
    return newExam;
  },

  // Candidates
  async getCandidatesForExam(examId: string): Promise<CandidateExamAttempt[]> {
    await delay();
    return attempts.filter((a) => a.examId === examId);
  },

  async getExamsForCandidate(candidateId: string): Promise<{ exam: Exam; attempt?: CandidateExamAttempt }[]> {
    await delay();
    const activeExams = exams.filter((e) => e.status === 'active');
    return activeExams.map((exam) => ({
      exam,
      attempt: attempts.find((a) => a.examId === exam.id && a.candidateId === candidateId),
    }));
  },

  async startExam(examId: string, candidateId: string, candidateName: string, candidateEmail: string): Promise<CandidateExamAttempt> {
    await delay(500);
    let attempt = attempts.find((a) => a.examId === examId && a.candidateId === candidateId);
    const exam = exams.find((e) => e.id === examId);
    if (!exam) throw new Error('Exam not found');

    const totalQuestions = exam.questionSets.reduce((sum, qs) => sum + qs.questions.length, 0);

    if (attempt) {
      attempt.status = 'in-progress';
      attempt.startedAt = new Date().toISOString();
    } else {
      attempt = {
        id: `att-${Date.now()}`,
        candidateId,
        candidateName,
        candidateEmail,
        examId,
        status: 'in-progress',
        answers: {},
        totalQuestions,
        violations: 0,
        startedAt: new Date().toISOString(),
      };
      attempts = [...attempts, attempt];
    }
    return attempt;
  },

  async submitExam(attemptId: string, answers: Record<string, string | string[]>, violations: number): Promise<CandidateExamAttempt> {
    await delay(800);
    const attempt = attempts.find((a) => a.id === attemptId);
    if (!attempt) throw new Error('Attempt not found');

    attempt.answers = answers;
    attempt.violations = violations;
    attempt.status = violations >= 3 ? 'violated' : 'completed';
    attempt.submittedAt = new Date().toISOString();
    // Mock score calculation
    attempt.score = Math.floor(Math.random() * 40) + 60;

    return { ...attempt };
  },
};
