/**
 * User Store using Zustand
 * Following best practices: secure state management, clear actions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserStore } from '@/types';
import { currentUser as defaultUser } from '@/data/mockUsers';

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
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

      saveActivity: (activityId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const savedActivities = state.currentUser.savedActivities || [];
          if (savedActivities.includes(activityId)) return state;
          
          return {
            currentUser: {
              ...state.currentUser,
              savedActivities: [...savedActivities, activityId],
            },
          };
        });
      },

      unsaveActivity: (activityId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const savedActivities = state.currentUser.savedActivities || [];
          
          return {
            currentUser: {
              ...state.currentUser,
              savedActivities: savedActivities.filter((id) => id !== activityId),
            },
          };
        });
      },

      isActivitySaved: (activityId) => {
        const state = get();
        if (!state.currentUser) return false;
        const savedActivities = state.currentUser.savedActivities || [];
        return savedActivities.includes(activityId);
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

// Made with Bob
