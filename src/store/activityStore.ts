import { create } from 'zustand';
import { ActivityStore, Activity, CreateActivityInput } from '@/types';
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
      pendingRequests: [],
      chatMessages: [],
      viewCount: 0,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updated = [newActivity, ...state.activities];
      return { activities: updated, filteredActivities: updated };
    });

    get().applyFilters();
  },

  updateActivity: (id, updates) => {
    set((state) => {
      const updated = state.activities.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      );
      return { activities: updated, filteredActivities: updated };
    });
    get().applyFilters();
  },

  deleteActivity: (id) => {
    set((state) => {
      const updated = state.activities.filter((a) => a.id !== id);
      return { activities: updated, filteredActivities: updated };
    });
  },

  requestJoin: (activityId, message) => {
    set((state) => {
      const updated = state.activities.map((activity) => {
        if (activity.id !== activityId) return activity;
        const alreadyRequested = activity.pendingRequests.some((r) => r.userId === currentUser.id);
        const alreadyJoined = activity.participants.some((p) => p.id === currentUser.id);
        if (alreadyRequested || alreadyJoined) return activity;

        const newRequest = {
          id: Date.now(),
          activityId,
          userId: currentUser.id,
          user: currentUser,
          message: message ?? '',
          requestedAt: new Date().toISOString(),
        };

        return { ...activity, pendingRequests: [...activity.pendingRequests, newRequest] };
      });
      return { activities: updated, filteredActivities: updated };
    });
  },

  cancelJoinRequest: (activityId) => {
    set((state) => {
      const updated = state.activities.map((activity) => {
        if (activity.id !== activityId) return activity;
        return {
          ...activity,
          pendingRequests: activity.pendingRequests.filter((r) => r.userId !== currentUser.id),
        };
      });
      return { activities: updated, filteredActivities: updated };
    });
  },

  approveRequest: (activityId, userId) => {
    set((state) => {
      const updated = state.activities.map((activity) => {
        if (activity.id !== activityId) return activity;
        const request = activity.pendingRequests.find((r) => r.userId === userId);
        if (!request) return activity;

        const newSpotsTaken = activity.spotsTaken + 1;
        const isFull = newSpotsTaken >= activity.totalSpots;
        const isAlmostFull = newSpotsTaken >= activity.totalSpots * 0.8;
        const newStatus = (isFull ? 'full' : isAlmostFull ? 'filling_fast' : 'open') as Activity['status'];

        return {
          ...activity,
          spotsTaken: newSpotsTaken,
          participants: [...activity.participants, request.user],
          pendingRequests: activity.pendingRequests.filter((r) => r.userId !== userId),
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      });
      return { activities: updated, filteredActivities: updated };
    });
    get().applyFilters();
  },

  rejectRequest: (activityId, userId) => {
    set((state) => {
      const updated = state.activities.map((activity) => {
        if (activity.id !== activityId) return activity;
        return {
          ...activity,
          pendingRequests: activity.pendingRequests.filter((r) => r.userId !== userId),
        };
      });
      return { activities: updated, filteredActivities: updated };
    });
  },

  leaveActivity: (activityId) => {
    set((state) => {
      const updated = state.activities.map((activity) => {
        if (activity.id !== activityId) return activity;
        const newSpotsTaken = Math.max(1, activity.spotsTaken - 1);
        return {
          ...activity,
          spotsTaken: newSpotsTaken,
          participants: activity.participants.filter((p) => p.id !== currentUser.id),
          status: 'open' as const,
          updatedAt: new Date().toISOString(),
        };
      });
      return { activities: updated, filteredActivities: updated };
    });
    get().applyFilters();
  },

  sendChatMessage: (activityId, content) => {
    set((state) => {
      const updated = state.activities.map((activity) => {
        if (activity.id !== activityId) return activity;
        const msg = {
          id: Date.now(),
          activityId,
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          content,
          timestamp: new Date().toISOString(),
        };
        return { ...activity, chatMessages: [...activity.chatMessages, msg] };
      });
      return { activities: updated, filteredActivities: updated };
    });
  },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().applyFilters();
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
    get().applyFilters();
  },

  applyFilters: () => {
    const { activities, filters, sortBy } = get();
    let filtered = [...activities];

    if (filters.city) {
      filtered = filtered.filter((a) => a.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters.type) {
      filtered = filtered.filter((a) => a.type === filters.type);
    }
    if (filters.date) {
      filtered = filtered.filter((a) => a.date === filters.date);
    }
    if (filters.status) {
      filtered = filtered.filter((a) => a.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      );
    }

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

  getActivityById: (id) => get().activities.find((a) => a.id === id),

  incrementViewCount: (id) => {
    set((state) => {
      const updated = state.activities.map((a) =>
        a.id === id ? { ...a, viewCount: a.viewCount + 1 } : a
      );
      return { activities: updated, filteredActivities: updated };
    });
  },
}));
