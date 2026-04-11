# AssessHub - Online Assessment Platform

A secure online assessment platform built with Next.js, TypeScript, and Tailwind CSS for employers and candidates.

## Features

- **Employer Dashboard**: Create and manage exams
- **Candidate Portal**: Take exams with timer and monitoring
- **Authentication**: Secure login for both roles
- **Rich Text Editor**: For creating questions
- **Real-time Monitoring**: Tab switch and fullscreen detection
- **Responsive Design**: Works on all devices

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable UI components
- `src/stores/` - Zustand state management
- `src/hooks/` - Custom React hooks
- `src/services/` - API services (currently mock data)
- `src/types/` - TypeScript type definitions

## Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Rich Text**: Tiptap
- **Icons**: Lucide React

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
