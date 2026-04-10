import { Exam } from '@/types';
import { mockQuestionSets } from './mock-questions';

export const mockExams: Exam[] = [
  {
    id: 'exam-1',
    title: 'Frontend Developer Assessment',
    createdBy: 'emp-1',
    totalCandidates: 25,
    totalSlots: 3,
    questionSets: [mockQuestionSets[0], mockQuestionSets[1]],
    slots: [
      { id: 'slot-1', startTime: '2026-04-10T09:00:00', endTime: '2026-04-10T10:30:00' },
      { id: 'slot-2', startTime: '2026-04-10T11:00:00', endTime: '2026-04-10T12:30:00' },
      { id: 'slot-3', startTime: '2026-04-10T14:00:00', endTime: '2026-04-10T15:30:00' },
    ],
    duration: 90,
    negativeMarking: true,
    startTime: '2026-04-10T09:00:00',
    endTime: '2026-04-10T15:30:00',
    status: 'active',
  },
  {
    id: 'exam-2',
    title: 'TypeScript Proficiency Test',
    createdBy: 'emp-1',
    totalCandidates: 15,
    totalSlots: 2,
    questionSets: [mockQuestionSets[2]],
    slots: [
      { id: 'slot-4', startTime: '2026-04-12T10:00:00', endTime: '2026-04-12T11:00:00' },
      { id: 'slot-5', startTime: '2026-04-12T14:00:00', endTime: '2026-04-12T15:00:00' },
    ],
    duration: 60,
    negativeMarking: false,
    startTime: '2026-04-12T10:00:00',
    endTime: '2026-04-12T15:00:00',
    status: 'active',
  },
  {
    id: 'exam-3',
    title: 'Full Stack Knowledge Check',
    createdBy: 'emp-2',
    totalCandidates: 40,
    totalSlots: 4,
    questionSets: [mockQuestionSets[0], mockQuestionSets[1], mockQuestionSets[2]],
    slots: [
      { id: 'slot-6', startTime: '2026-04-15T09:00:00', endTime: '2026-04-15T11:00:00' },
      { id: 'slot-7', startTime: '2026-04-15T11:30:00', endTime: '2026-04-15T13:30:00' },
      { id: 'slot-8', startTime: '2026-04-15T14:00:00', endTime: '2026-04-15T16:00:00' },
      { id: 'slot-9', startTime: '2026-04-15T16:30:00', endTime: '2026-04-15T18:30:00' },
    ],
    duration: 120,
    negativeMarking: true,
    startTime: '2026-04-15T09:00:00',
    endTime: '2026-04-15T18:30:00',
    status: 'draft',
  },
];
