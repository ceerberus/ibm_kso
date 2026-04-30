import { create } from 'zustand';
import { ActivityStore, Activity, CreateActivityInput } from '@/types';
import { mockActivities } from '@/data/mockActivities';
import { currentUser } from '@/data/mockUsers';

// Smart image selection based on activity content
const getImageForActivity = (activityInput: CreateActivityInput): string => {
  const searchText = `${activityInput.title} ${activityInput.description} ${activityInput.location}`.toLowerCase();
  
  // Specific location/landmark keywords
  const imageMap: Array<{ keywords: string[]; image: string }> = [
    // Swiss landmarks and cities
    { keywords: ['jungfraujoch', 'jungfrau', 'top of europe'], image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80' },
    { keywords: ['matterhorn', 'zermatt'], image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80' },
    { keywords: ['interlaken', 'bernese oberland'], image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80' },
    { keywords: ['rhine falls', 'rheinfall', 'schaffhausen'], image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&q=80' },
    { keywords: ['lucerne', 'luzern', 'chapel bridge'], image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&q=80' },
    { keywords: ['lake geneva', 'lac léman', 'montreux'], image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80' },
    { keywords: ['zurich', 'zürich'], image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80' },
    { keywords: ['geneva', 'genève'], image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=800&q=80' },
    { keywords: ['basel'], image: 'https://images.unsplash.com/photo-1559564484-e48eef1f7823?w=800&q=80' },
    { keywords: ['bern'], image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80' },
    
    // Activity-specific keywords
    { keywords: ['ski', 'skiing', 'snowboard'], image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80' },
    { keywords: ['hike', 'hiking', 'trail', 'mountain'], image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
    { keywords: ['museum', 'art', 'gallery', 'exhibition'], image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80' },
    { keywords: ['festival', 'paléo', 'music festival'], image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80' },
    { keywords: ['concert', 'live music', 'band', 'jazz'], image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80' },
    { keywords: ['football', 'soccer', 'fc basel', 'young boys', 'stadium'], image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80' },
    { keywords: ['escape room', 'puzzle', 'challenge'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
    { keywords: ['film', 'cinema', 'movie', 'screening'], image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80' },
    { keywords: ['train', 'railway', 'sbb', 'ticket'], image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80' },
    { keywords: ['boat', 'cruise', 'lake', 'water'], image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80' },
    { keywords: ['food', 'restaurant', 'dining', 'dinner'], image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80' },
    { keywords: ['wine', 'vineyard', 'tasting'], image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80' },
    { keywords: ['bike', 'cycling', 'bicycle'], image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80' },
    { keywords: ['yoga', 'meditation', 'wellness'], image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80' },
    { keywords: ['party', 'club', 'nightlife'], image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80' },
  ];
  
  // Find matching image based on keywords
  for (const { keywords, image } of imageMap) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return image;
    }
  }
  
  // Fallback to type-based images
  const typeImages: Record<string, string> = {
    travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    concert: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    event: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    other: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
  };
  
  return typeImages[activityInput.type] || typeImages.other;
};

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
      // Add contextually relevant image if not provided
      imageUrl: activityInput.imageUrl || getImageForActivity(activityInput),
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
