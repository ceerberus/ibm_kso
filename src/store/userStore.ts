/**
 * User Store using Zustand
 * Following best practices: secure state management, clear actions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserStore, CurrentUser } from '@/types';
import { currentUser as defaultUser } from '@/data/mockUsers';

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: defaultUser,
      isAuthenticated: true,

      setCurrentUser: (user) => {
        set({ currentUser: user, isAuthenticated: true });
      },

      updateProfile: (updates) => {
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...updates }
            : null,
        }));
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

// Made with Bob
