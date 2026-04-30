/**
 * Activity Store using Zustand
 * Following best practices: immutable updates, clear actions, proper typing
 */

import { create } from 'zustand';
import { ActivityStore, Activity, CreateActivityInput, ActivityFilters, SortOption } from '@/types';
import { mockActivities } from '@/data/mockActivities';
import { currentUser } from '@/data/mockUsers';

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: [...mockActivities],
  filteredActivities: [...mockActivities],
  filters: {},
  sortBy: 'newest',
  isLoading: false,
  error: null,

  setActivities: (activities) => {
    set({ activities, filteredActivities: activities });
  },

  addActivity: (activityInput: CreateActivityInput) => {
    const newActivity: Activity = {
      ...activityInput,
      id: Date.now(),
      status: 'open',
      spotsTaken: 1,
      creatorId: currentUser.id,
      creator: currentUser,
      participants: [currentUser],
      comments: [],
      viewCount: 0,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedActivities = [newActivity, ...state.activities];
      return {
        activities: updatedActivities,
        filteredActivities: updatedActivities,
      };
    });

    // Trigger filter reapplication
    get().applyFilters();
  },

  updateActivity: (id, updates) => {
    set((state) => {
      const updatedActivities = state.activities.map((activity) =>
        activity.id === id
          ? { ...activity, ...updates, updatedAt: new Date().toISOString() }
          : activity
      );
      return {
        activities: updatedActivities,
        filteredActivities: updatedActivities,
      };
    });
    get().applyFilters();
  },

  deleteActivity: (id) => {
    set((state) => {
      const updatedActivities = state.activities.filter((activity) => activity.id !== id);
      return {
        activities: updatedActivities,
        filteredActivities: updatedActivities,
      };
    });
  },

  joinActivity: (activityId) => {
    set((state) => {
      const updatedActivities = state.activities.map((activity) => {
        if (activity.id === activityId) {
          const newSpotsTaken = activity.spotsTaken + 1;
          const isAlmostFull = newSpotsTaken >= activity.totalSpots * 0.8;
          const isFull = newSpotsTaken >= activity.totalSpots;

          return {
            ...activity,
            spotsTaken: newSpotsTaken,
            participants: [...activity.participants, currentUser],
            status: isFull ? 'full' : isAlmostFull ? 'filling_fast' : 'open',
            updatedAt: new Date().toISOString(),
          };
        }
        return activity;
      });

      return {
        activities: updatedActivities,
        filteredActivities: updatedActivities,
      };
    });
    get().applyFilters();
  },

  leaveActivity: (activityId) => {
    set((state) => {
      const updatedActivities = state.activities.map((activity) => {
        if (activity.id === activityId) {
          const newSpotsTaken = Math.max(1, activity.spotsTaken - 1);
          const participants = activity.participants.filter(
            (p) => p.id !== currentUser.id
          );

          return {
            ...activity,
            spotsTaken: newSpotsTaken,
            participants,
            status: 'open',
            updatedAt: new Date().toISOString(),
          };
        }
        return activity;
      });

      return {
        activities: updatedActivities,
        filteredActivities: updatedActivities,
      };
    });
    get().applyFilters();
  },

  addComment: (activityId, content) => {
    set((state) => {
      const updatedActivities = state.activities.map((activity) => {
        if (activity.id === activityId) {
          const newComment = {
            id: Date.now(),
            activityId,
            userId: currentUser.id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            userAvatar: currentUser.avatar,
            content,
            timestamp: new Date().toISOString(),
          };

          return {
            ...activity,
            comments: [...activity.comments, newComment],
            updatedAt: new Date().toISOString(),
          };
        }
        return activity;
      });

      return {
        activities: updatedActivities,
        filteredActivities: updatedActivities,
      };
    });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
    get().applyFilters();
  },

  applyFilters: () => {
    const { activities, filters, sortBy } = get();
    
    let filtered = [...activities];

    // Apply filters
    if (filters.city) {
      filtered = filtered.filter(
        (activity) => activity.city.toLowerCase() === filters.city!.toLowerCase()
      );
    }

    if (filters.type) {
      filtered = filtered.filter((activity) => activity.type === filters.type);
    }

    if (filters.date) {
      filtered = filtered.filter((activity) => activity.date === filters.date);
    }

    if (filters.status) {
      filtered = filtered.filter((activity) => activity.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchLower) ||
          activity.description.toLowerCase().includes(searchLower) ||
          activity.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'spots_available':
          return (b.totalSpots - b.spotsTaken) - (a.totalSpots - a.spotsTaken);
        case 'price_low':
          return (a.pricePerPerson || 0) - (b.pricePerPerson || 0);
        case 'price_high':
          return (b.pricePerPerson || 0) - (a.pricePerPerson || 0);
        default:
          return 0;
      }
    });

    set({ filteredActivities: filtered });
  },

  getActivityById: (id) => {
    return get().activities.find((activity) => activity.id === id);
  },

  incrementViewCount: (id) => {
    set((state) => {
      const updatedActivities = state.activities.map((activity) =>
        activity.id === id
          ? { ...activity, viewCount: activity.viewCount + 1 }
          : activity
      );
      return {
        activities: updatedActivities,
        filteredActivities: updatedActivities,
      };
    });
  },
}));

// Made with Bob
