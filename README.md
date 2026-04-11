# Online Assessment Platform

Frontend Engineer project task for a simplified online assessment platform with Employer and Candidate panels.

## Project Overview

This application demonstrates a complete assessment workflow:

- Employers can sign in, view online tests, create tests, manage question sets, and review candidate submissions.
- Candidates can sign in, view available exams, start an exam, answer questions, and submit manually or automatically on timeout.
- The project includes a real Express and MongoDB backend for bonus API integration.

## Live Links

- Live demo: Add your deployed frontend URL here
- Video recording: Add your video walkthrough URL here
- GitHub repository: Add your repository URL here

## Tech Stack

- Framework: Next.js 14, React, TypeScript
- State management: Zustand
- Forms: React Hook Form
- Validation: Zod
- Styling/UI: Tailwind CSS, shadcn/ui, Radix UI
- API handling: Axios, TanStack React Query
- Backend: Express.js, TypeScript, MongoDB, Mongoose
- Authentication: JWT-based role authentication
- Rich text editor: Tiptap

## Features

### Employer Panel

- Login page with email and password fields.
- JWT authentication through the backend API.
- Redirects to employer dashboard after successful login.
- Online tests dashboard with card-based exam list.
- Exam cards display exam name, candidates, question sets, exam slots, and a View Candidates action.
- Create Online Test multi-step form.
- Step 1: Basic information with title, total candidates, total slots, question sets, question type, start time, end time, duration, and negative marking.
- Step 2: Question sets with add, edit, and delete question workflow.
- Question editor supports Radio, Checkbox, and Text question types.
- Candidate submission list for each exam.

### Candidate Panel

- Login page with email and password fields.
- JWT authentication through the backend API.
- Candidate dashboard with available exams displayed as cards.
- Exam cards show duration, total questions, negative marking, and Start action.
- Exam screen displays questions one by one.
- Supports radio, checkbox, and rich text answers.
- Timer countdown with auto-submit on timeout.
- Manual submit on the final question.
- Behavioral tracking for tab switch and fullscreen exit.
- Timeout and test-completed status screens.

## Project Structure

```text
IBOS/
  backend/
    src/
      config/
      middleware/
      modules/
        auth/
        exam/
        exam-submission/
      scripts/
      utils/
  client/
    src/
      app/
      components/
        auth/
        create-exam/
        dashboard/
        exam/
        shared/
        ui/
      features/
        candidate/
        employer/
      hooks/
      schemas/
      services/
      stores/
      types/
```

## Setup Instructions

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Clone and Install

```bash
git clone <your-repository-url>
cd IBOS
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install client dependencies:

```bash
cd ../client
npm install
```

### 2. Backend Environment

Create `backend/.env` from `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

Example:

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/assesshub
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 3. Client Environment

Create `client/.env.local` from `client/.env.local.example`:

```bash
cd client
cp .env.local.example .env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Seed Database

Run the seed script from the backend folder:

```bash
cd backend
npm run seed
```

Seed credentials:

- Employer: `employer@test.com` / `password123`
- Candidate: `candidate@test.com` / `password123`

### 5. Run the App

Start backend:

```bash
cd backend
npm run dev
```

Start frontend in another terminal:

```bash
cd client
npm run dev
```

Open the app:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api`

## Available Scripts

Backend:

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run seed
```

Client:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## API Summary

- `POST /api/auth/login` authenticates employer and candidate users.
- `GET /api/exams` returns exams.
- `POST /api/exams` creates an employer exam.
- `GET /api/exams/:examId` returns one exam.
- `GET /api/exam-submissions` returns candidate submissions.
- `GET /api/exam-submissions/exam/:examId` returns exam submissions for employer review.
- `POST /api/exam-submissions/start` starts or resumes a candidate exam attempt.
- `POST /api/exam-submissions/:submissionId/submit` submits candidate answers.

## Code Quality Notes

- Feature screens are separated into `features/candidate` and `features/employer`.
- Reusable UI and layout components live in `components/shared`, `components/dashboard`, `components/exam`, and `components/create-exam`.
- API calls are centralized in `client/src/services/api.ts` using Axios.
- Server state is handled with TanStack React Query.
- Client session and auth state are handled with Zustand.
- Form schemas are separated into `client/src/schemas`.
- Exam behavior logic is encapsulated with custom hooks for timer, tab switch detection, fullscreen detection, and online status.
- Rich text rendering uses a shared display helper to avoid leaking editor HTML tags into the UI.

## Additional Questions

### MCP Integration

Yes. MCP can be used to speed up design-to-code and implementation workflows. In this project, a Figma MCP workflow is especially useful for reading the Figma design, extracting layout intent, spacing, component structure, and visual details, then translating those into reusable React and Tailwind components. MCP can also support Chrome DevTools-style inspection for visual QA and Supabase or database MCP workflows for quickly checking records, auth data, and API behavior.

### AI Tools for Development

Recommended AI tools and processes:

- ChatGPT or Codex for code generation, refactoring, debugging, README writing, and architecture review.
- GitHub Copilot for inline component and utility implementation.
- Claude Code or similar agentic coding tools for larger multi-file refactors.
- Figma-to-code assistance for matching UI screens quickly.
- AI-assisted review prompts for checking accessibility, edge cases, validation, and maintainability.

The best workflow is not to blindly accept generated code. I use AI as a pair programmer, then verify behavior with linting, type checks, manual testing, and code review.

### Offline Mode

If a candidate loses internet during an exam, I would keep the exam session resilient by storing answers, remaining time, current question index, and violation events in local persistent storage such as Zustand persist or IndexedDB. The UI would show an offline banner and continue allowing the candidate to answer questions locally. When the connection returns, the app would sync unsent answers and final submission to the backend with idempotent API calls so duplicate submissions do not corrupt data. For strict exam integrity, the backend should also store server-side start time and enforce final submission windows, because client-side timers can be manipulated.

## Notes

- The backend integration is implemented for bonus points.
- The app uses seeded users for quick testing.
- Replace the Live demo and Video recording placeholders before final submission.
