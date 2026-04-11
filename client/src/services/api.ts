import {
  CandidateExamAttempt,
  CreateExamPayload,
  Exam,
  ExamSlot,
  Question,
  QuestionSet,
  User,
} from "@/types";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://online-assessment-backend-2hei.onrender.com/api";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: User["role"];
  employeeId?: string;
}

interface BackendQuestion {
  _id?: string;
  title: string;
  type: Question["type"];
  options?: string[];
  correctAnswer?: string | string[];
  points?: number;
}

interface BackendQuestionSet {
  _id?: string;
  name: string;
  questions: BackendQuestion[];
}

interface BackendExamSlot {
  _id?: string;
  startTime: string;
  endTime: string;
}

interface BackendExam {
  _id?: string;
  title: string;
  createdBy: string;
  totalCandidates: number;
  totalSlots: number;
  questionSets: BackendQuestionSet[];
  slots: BackendExamSlot[];
  duration: number;
  negativeMarking: boolean;
  startTime: string;
  endTime: string;
  status: Exam["status"];
}

interface BackendAttempt {
  _id?: string;
  examId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  status: "in-progress" | "completed" | "violated";
  answers: Record<string, string | string[]>;
  score?: number;
  totalQuestions: number;
  violations: number;
  startedAt?: string;
  submittedAt?: string;
}

// Reads the current auth token for authenticated API requests.
const getToken = () => {
  return useAuthStore.getState().token;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// General HTTP helper for the client API layer.
// Ensures errors from the backend are surfaced as meaningful messages.
// Executes API requests and normalizes backend error messages.
const request = async <T>(
  method: "get" | "post",
  path: string,
  data?: unknown,
): Promise<T> => {
  try {
    const response = await apiClient.request<ApiEnvelope<T>>({
      url: path,
      method,
      data,
    });

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || error.message || "Request failed",
      );
    }

    throw error;
  }
};

// Converts a backend question payload into the client question model.
const mapQuestion = (question: BackendQuestion): Question => {
  return {
    id: question._id || `question-${Math.random().toString(36).slice(2, 9)}`,
    title: question.title,
    type: question.type,
    options: question.options,
    correctAnswer: question.correctAnswer,
    points: question.points,
  };
};

// Converts a backend question set payload into the client question set model.
const mapQuestionSet = (questionSet: BackendQuestionSet): QuestionSet => {
  return {
    id:
      questionSet._id ||
      `question-set-${Math.random().toString(36).slice(2, 9)}`,
    name: questionSet.name,
    questions: questionSet.questions.map(mapQuestion),
  };
};

// Converts a backend exam slot payload into the client slot model.
const mapSlot = (slot: BackendExamSlot): ExamSlot => {
  return {
    id: slot._id || `slot-${Math.random().toString(36).slice(2, 9)}`,
    startTime: slot.startTime,
    endTime: slot.endTime,
  };
};

// Map backend exam payloads into client exam models.
// Converts a backend exam payload into the client exam model.
const mapExam = (exam: BackendExam): Exam => {
  return {
    id: exam._id || "",
    title: exam.title,
    createdBy: exam.createdBy,
    totalCandidates: exam.totalCandidates,
    totalSlots: exam.totalSlots,
    questionSets: exam.questionSets.map(mapQuestionSet),
    slots: exam.slots.map(mapSlot),
    duration: exam.duration,
    negativeMarking: exam.negativeMarking,
    startTime: exam.startTime,
    endTime: exam.endTime,
    status: exam.status,
  };
};

// Converts a backend attempt payload into the client attempt model.
const mapAttempt = (attempt: BackendAttempt): CandidateExamAttempt => {
  return {
    id: attempt._id || "",
    examId: attempt.examId,
    candidateId: attempt.candidateId,
    candidateName: attempt.candidateName,
    candidateEmail: attempt.candidateEmail,
    status: attempt.status,
    answers: attempt.answers || {},
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    violations: attempt.violations,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
  };
};

// Converts client exam form state into the backend create-exam payload.
const toCreateExamBody = (payload: CreateExamPayload) => {
  return {
    ...payload,
    questionSets: payload.questionSets.map((questionSet) => ({
      name: questionSet.name,
      questions: questionSet.questions.map((question) => ({
        title: question.title,
        type: question.type,
        options: question.options?.filter(Boolean),
        correctAnswer: question.correctAnswer,
        points: question.points || 1,
      })),
    })),
  };
};

export const api = {
  // Authenticates a user and maps the backend response into client auth state.
  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const data = await request<{ token: string; user: BackendUser }>(
      "post",
      "/auth/login",
      { email, password },
    );

    return {
      token: data.token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        employeeId: data.user.employeeId,
      },
    };
  },

  // Loads exams and filters them according to the active user role.
  async getExams(userId?: string, role?: string): Promise<Exam[]> {
    const exams = await request<BackendExam[]>("get", "/exams");
    const mapped = exams.map(mapExam);

    if (role === "employer" && userId) {
      return mapped.filter((exam) => exam.createdBy === userId);
    }

    return mapped.filter((exam) => exam.status === "active");
  },

  // Loads one exam and maps it into the client exam model.
  async getExam(examId: string): Promise<Exam> {
    const exam = await request<BackendExam>("get", `/exams/${examId}`);
    return mapExam(exam);
  },

  // Creates an exam through the backend API and returns the mapped exam.
  async createExam(payload: CreateExamPayload, _userId: string): Promise<Exam> {
    const exam = await request<BackendExam>(
      "post",
      "/exams",
      toCreateExamBody(payload),
    );

    return mapExam(exam);
  },

  // Loads candidate attempts for a specific employer exam.
  async getCandidatesForExam(examId: string): Promise<CandidateExamAttempt[]> {
    const attempts = await request<BackendAttempt[]>(
      "get",
      `/exam-submissions/exam/${examId}`,
    );
    return attempts.map(mapAttempt);
  },

  // Loads active exams and joins them with the candidate attempt state.
  async getExamsForCandidate(
    candidateId: string,
  ): Promise<{ exam: Exam; attempt?: CandidateExamAttempt }[]> {
    const [exams, attempts] = await Promise.all([
      request<BackendExam[]>("get", "/exams"),
      request<BackendAttempt[]>("get", "/exam-submissions"),
    ]);

    const mappedAttempts = attempts
      .map(mapAttempt)
      .filter((attempt) => attempt.candidateId === candidateId);

    return exams
      .map(mapExam)
      .filter((exam) => exam.status === "active")
      .map((exam) => ({
        exam,
        attempt: mappedAttempts.find((attempt) => attempt.examId === exam.id),
      }));
  },

  // Starts a candidate exam attempt through the backend API.
  async startExam(
    examId: string,
    _candidateId: string,
    _candidateName: string,
    _candidateEmail: string,
  ): Promise<CandidateExamAttempt> {
    const attempt = await request<BackendAttempt>(
      "post",
      "/exam-submissions/start",
      {
        examId,
      },
    );

    return mapAttempt(attempt);
  },

  // Submits candidate answers and violation count for final scoring.
  async submitExam(
    attemptId: string,
    answers: Record<string, string | string[]>,
    violations: number,
  ): Promise<CandidateExamAttempt> {
    const attempt = await request<BackendAttempt>(
      "post",
      `/exam-submissions/${attemptId}/submit`,
      { answers, violations },
    );

    return mapAttempt(attempt);
  },
};
