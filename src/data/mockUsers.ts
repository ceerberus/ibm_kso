/**
 * Mock user data for demo purposes
 * Following best practices: realistic data, proper typing, clear structure
 */

import { User, CurrentUser } from '@/types';

export const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'Anna',
    lastName: 'Mueller',
    email: 'anna.mueller@example.com',
    city: 'Zurich',
    phone: '+41 79 123 4567',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isOnline: true,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco.rossi@example.com',
    city: 'Lugano',
    phone: '+41 79 234 5678',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isOnline: false,
    lastSeen: '2026-04-29T18:30:00Z',
    createdAt: '2026-02-20T14:30:00Z',
  },
  {
    id: 3,
    firstName: 'Sophie',
    lastName: 'Dubois',
    email: 'sophie.dubois@example.com',
    city: 'Geneva',
    phone: '+41 79 345 6789',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isOnline: true,
    createdAt: '2026-01-10T09:15:00Z',
  },
  {
    id: 4,
    firstName: 'Luca',
    lastName: 'Bianchi',
    email: 'luca.bianchi@example.com',
    city: 'Basel',
    phone: '+41 79 456 7890',
    avatar: 'https://i.pravatar.cc/150?img=13',
    isOnline: false,
    lastSeen: '2026-04-30T07:45:00Z',
    createdAt: '2026-03-05T11:20:00Z',
  },
  {
    id: 5,
    firstName: 'Emma',
    lastName: 'Keller',
    email: 'emma.keller@example.com',
    city: 'Bern',
    phone: '+41 79 567 8901',
    avatar: 'https://i.pravatar.cc/150?img=9',
    isOnline: true,
    createdAt: '2026-02-14T16:00:00Z',
  },
  {
    id: 6,
    firstName: 'Thomas',
    lastName: 'Weber',
    email: 'thomas.weber@example.com',
    city: 'Basel',
    phone: '+41 79 678 9012',
    avatar: 'https://i.pravatar.cc/150?img=14',
    isOnline: false,
    lastSeen: '2026-04-29T20:15:00Z',
    createdAt: '2026-01-25T13:45:00Z',
  },
  {
    id: 7,
    firstName: 'Nina',
    lastName: 'Schneider',
    email: 'nina.schneider@example.com',
    city: 'Zurich',
    phone: '+41 79 789 0123',
    avatar: 'https://i.pravatar.cc/150?img=10',
    isOnline: true,
    createdAt: '2026-03-12T10:30:00Z',
  },
  {
    id: 8,
    firstName: 'David',
    lastName: 'Martin',
    email: 'david.martin@example.com',
    city: 'Lausanne',
    phone: '+41 79 890 1234',
    avatar: 'https://i.pravatar.cc/150?img=15',
    isOnline: false,
    lastSeen: '2026-04-29T22:00:00Z',
    createdAt: '2026-02-28T15:20:00Z',
  },
];

// Current logged-in user for demo
export const currentUser: CurrentUser = {
  id: 100,
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@groupsave.ch',
  city: 'Zurich',
  phone: '+41 79 999 9999',
  avatar: 'https://i.pravatar.cc/150?img=68',
  isOnline: true,
  createdAt: '2026-04-01T08:00:00Z',
  joinedActivities: [],
  createdActivities: [],
};

// Helper function to get random users
export const getRandomUsers = (count: number, exclude: number[] = []): User[] => {
  const availableUsers = mockUsers.filter(user => !exclude.includes(user.id));
  const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get user by ID
export const getUserById = (id: number): User | undefined => {
  if (id === currentUser.id) return currentUser;
  return mockUsers.find(user => user.id === id);
};

// Made with Bob
