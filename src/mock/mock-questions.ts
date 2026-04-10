import { QuestionSet } from '@/types';

export const mockQuestionSets: QuestionSet[] = [
  {
    id: 'qs-1',
    name: 'JavaScript Fundamentals',
    questions: [
      {
        id: 'q-1',
        title: 'Which of the following is NOT a primitive data type in JavaScript?',
        type: 'radio',
        options: ['String', 'Number', 'Object', 'Boolean'],
        correctAnswer: 'Object',
      },
      {
        id: 'q-2',
        title: 'Which keywords are used to declare variables in ES6?',
        type: 'checkbox',
        options: ['var', 'let', 'const', 'define'],
        correctAnswer: ['let', 'const'],
      },
      {
        id: 'q-3',
        title: 'Explain the difference between == and === in JavaScript.',
        type: 'text',
      },
      {
        id: 'q-4',
        title: 'What does the typeof operator return for null?',
        type: 'radio',
        options: ['null', 'undefined', 'object', 'string'],
        correctAnswer: 'object',
      },
      {
        id: 'q-5',
        title: 'Which array methods mutate the original array?',
        type: 'checkbox',
        options: ['map', 'push', 'filter', 'splice'],
        correctAnswer: ['push', 'splice'],
      },
    ],
  },
  {
    id: 'qs-2',
    name: 'React Basics',
    questions: [
      {
        id: 'q-6',
        title: 'What hook is used for side effects in React?',
        type: 'radio',
        options: ['useState', 'useEffect', 'useContext', 'useRef'],
        correctAnswer: 'useEffect',
      },
      {
        id: 'q-7',
        title: 'Which are valid ways to pass data between components?',
        type: 'checkbox',
        options: ['Props', 'Context', 'Direct DOM manipulation', 'State lifting'],
        correctAnswer: ['Props', 'Context', 'State lifting'],
      },
      {
        id: 'q-8',
        title: 'Describe the virtual DOM and its benefits.',
        type: 'text',
      },
    ],
  },
  {
    id: 'qs-3',
    name: 'TypeScript Essentials',
    questions: [
      {
        id: 'q-9',
        title: 'What is the difference between interface and type in TypeScript?',
        type: 'text',
      },
      {
        id: 'q-10',
        title: 'Which of these is a TypeScript utility type?',
        type: 'radio',
        options: ['Partial', 'Fragment', 'Component', 'Module'],
        correctAnswer: 'Partial',
      },
      {
        id: 'q-11',
        title: 'Select all valid TypeScript access modifiers.',
        type: 'checkbox',
        options: ['public', 'private', 'protected', 'internal'],
        correctAnswer: ['public', 'private', 'protected'],
      },
    ],
  },
];
