import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import { ExamSubmissionModel } from "../modules/exam-submission/exam-submission.model";
import { UserModel } from "../modules/auth/auth.model";
import { ExamModel } from "../modules/exam/exam.model";

// Seed script to populate the database with sample users, exams, and attempts.
async function seed() {
  await connectDatabase();

  await Promise.all([
    ExamSubmissionModel.deleteMany({}),
    ExamModel.deleteMany({}),
    UserModel.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash("password123", 10);

  const [employerOne, employerTwo, candidateOne, candidateTwo, candidateThree] =
    await UserModel.create([
      {
        name: "Sarah Chen",
        email: "employer@test.com",
        password: hashedPassword,
        role: "employer",
        employeeId: "EMP-1001",
      },
      {
        name: "James Miller",
        email: "admin@test.com",
        password: hashedPassword,
        role: "employer",
        employeeId: "EMP-1002",
      },
      {
        name: "Alex Johnson",
        email: "candidate@test.com",
        password: hashedPassword,
        role: "candidate",
        employeeId: "CAND-2001",
      },
      {
        name: "John Smith",
        email: "john@test.com",
        password: hashedPassword,
        role: "candidate",
        employeeId: "CAND-2002",
      },
      {
        name: "Jane Doe",
        email: "jane@test.com",
        password: hashedPassword,
        role: "candidate",
        employeeId: "CAND-2003",
      },
    ]);

  const examOneQuestionSet = {
    name: "Question Set 1",
    questions: [
      {
        title:
          "Which of the following indicators is used to measure market volatility?",
        type: "radio",
        options: [
          "Relative Strength Index (RSI)",
          "Moving Average Convergence Divergence (MACD)",
          "Bollinger Bands",
          "Fibonacci Retracement",
        ],
        correctAnswer: "Bollinger Bands",
        points: 1,
      },
      {
        title: "Select the React hooks used for state and side effects.",
        type: "checkbox",
        options: ["useState", "useEffect", "useRouter", "useMemo"],
        correctAnswer: ["useState", "useEffect"],
        points: 1,
      },
      {
        title:
          "Write a brief note about why TypeScript improves frontend maintainability.",
        type: "text",
        points: 5,
      },
    ],
  };

  const examTwoQuestionSet = {
    name: "Question Set 1",
    questions: [
      {
        title: "Which keyword creates a type alias in TypeScript?",
        type: "radio",
        options: ["type", "interface", "alias", "typedef"],
        correctAnswer: "type",
        points: 1,
      },
      {
        title: "Pick the valid TypeScript utility types.",
        type: "checkbox",
        options: ["Partial", "Pick", "Dispatch", "Omit"],
        correctAnswer: ["Partial", "Pick", "Omit"],
        points: 1,
      },
      {
        title:
          "Explain the difference between interface and type in TypeScript.",
        type: "text",
        points: 5,
      },
    ],
  };

  const examThreeQuestionSet = {
    name: "Question Set 1",
    questions: [
      {
        title: "What does REST stand for?",
        type: "radio",
        options: [
          "Representational State Transfer",
          "Remote Execution State Transfer",
          "Rapid Endpoint Service Transport",
          "Rendered State Tracking",
        ],
        correctAnswer: "Representational State Transfer",
        points: 1,
      },
      {
        title: "Choose the databases that are commonly categorized as NoSQL.",
        type: "checkbox",
        options: ["MongoDB", "PostgreSQL", "Redis", "MySQL"],
        correctAnswer: ["MongoDB", "Redis"],
        points: 1,
      },
    ],
  };

  const [examOne, examTwo, examThree] = await ExamModel.create([
    {
      title: "Psychometric Test for Management Trainee Officer",
      createdBy: employerOne._id,
      totalCandidates: 25,
      totalSlots: 3,
      duration: 30,
      negativeMarking: true,
      startTime: "2026-04-10T09:00:00.000Z",
      endTime: "2026-04-10T15:30:00.000Z",
      status: "active",
      questionSets: [examOneQuestionSet],
      slots: [
        {
          startTime: "2026-04-10T09:00:00.000Z",
          endTime: "2026-04-10T09:30:00.000Z",
        },
        {
          startTime: "2026-04-10T11:00:00.000Z",
          endTime: "2026-04-10T11:30:00.000Z",
        },
        {
          startTime: "2026-04-10T14:00:00.000Z",
          endTime: "2026-04-10T14:30:00.000Z",
        },
      ],
    },
    {
      title: "TypeScript Proficiency Test",
      createdBy: employerOne._id,
      totalCandidates: 15,
      totalSlots: 2,
      duration: 45,
      negativeMarking: false,
      startTime: "2026-04-12T10:00:00.000Z",
      endTime: "2026-04-12T15:00:00.000Z",
      status: "active",
      questionSets: [examTwoQuestionSet],
      slots: [
        {
          startTime: "2026-04-12T10:00:00.000Z",
          endTime: "2026-04-12T10:45:00.000Z",
        },
        {
          startTime: "2026-04-12T14:00:00.000Z",
          endTime: "2026-04-12T14:45:00.000Z",
        },
      ],
    },
    {
      title: "Full Stack Knowledge Check",
      createdBy: employerTwo._id,
      totalCandidates: 40,
      totalSlots: 4,
      duration: 60,
      negativeMarking: true,
      startTime: "2026-04-15T09:00:00.000Z",
      endTime: "2026-04-15T18:30:00.000Z",
      status: "draft",
      questionSets: [examThreeQuestionSet],
      slots: [
        {
          startTime: "2026-04-15T09:00:00.000Z",
          endTime: "2026-04-15T10:00:00.000Z",
        },
        {
          startTime: "2026-04-15T11:30:00.000Z",
          endTime: "2026-04-15T12:30:00.000Z",
        },
        {
          startTime: "2026-04-15T14:00:00.000Z",
          endTime: "2026-04-15T15:00:00.000Z",
        },
        {
          startTime: "2026-04-15T16:30:00.000Z",
          endTime: "2026-04-15T17:30:00.000Z",
        },
      ],
    },
  ]);

  await ExamSubmissionModel.create([
    {
      examId: examOne._id,
      candidateId: candidateOne._id,
      candidateName: candidateOne.name,
      candidateEmail: candidateOne.email,
      status: "completed",
      answers: {
        "question-1": "Bollinger Bands",
        "question-2": ["useState", "useEffect"],
        "question-3":
          "TypeScript catches bugs early, improves refactoring safety, and documents component contracts.",
      },
      totalQuestions: 3,
      violations: 0,
      score: 85,
      startedAt: new Date("2026-04-10T09:05:00.000Z"),
      submittedAt: new Date("2026-04-10T09:25:00.000Z"),
    },
    {
      examId: examOne._id,
      candidateId: candidateTwo._id,
      candidateName: candidateTwo.name,
      candidateEmail: candidateTwo.email,
      status: "violated",
      answers: {
        "question-1": "MACD",
      },
      totalQuestions: 3,
      violations: 3,
      score: 42,
      startedAt: new Date("2026-04-10T11:02:00.000Z"),
      submittedAt: new Date("2026-04-10T11:18:00.000Z"),
    },
    {
      examId: examTwo._id,
      candidateId: candidateThree._id,
      candidateName: candidateThree.name,
      candidateEmail: candidateThree.email,
      status: "in-progress",
      answers: {
        "question-1": "type",
      },
      totalQuestions: 3,
      violations: 0,
      score: 0,
      startedAt: new Date("2026-04-12T10:10:00.000Z"),
    },
  ]);

  console.log("Database seeded successfully");
  console.log("Employer login: employer@test.com / password123");
  console.log("Candidate login: candidate@test.com / password123");

  await mongoose.disconnect();
}

void seed().catch(async (error) => {
  console.error("Seed failed");
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
