import { User } from '@/types';

export const mockUsers: (User & { password: string })[] = [
  {
    id: 'emp-1',
    email: 'employer@test.com',
    password: 'password123',
    name: 'Sarah Chen',
    role: 'employer',
  },
  {
    id: 'emp-2',
    email: 'admin@test.com',
    password: 'password123',
    name: 'James Miller',
    role: 'employer',
  },
  {
    id: 'cand-1',
    email: 'candidate@test.com',
    password: 'password123',
    name: 'Alex Johnson',
    role: 'candidate',
  },
  {
    id: 'cand-2',
    email: 'john@test.com',
    password: 'password123',
    name: 'John Smith',
    role: 'candidate',
  },
  {
    id: 'cand-3',
    email: 'jane@test.com',
    password: 'password123',
    name: 'Jane Doe',
    role: 'candidate',
  },
];
