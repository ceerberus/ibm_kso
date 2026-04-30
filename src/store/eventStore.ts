import { create } from 'zustand';
import { Event, EventStore } from '../types';
import { INITIAL_EVENTS, COLORS } from '../data/mockEvents';

let nextId = 100;

export const useEventStore = create<EventStore>((set, get) => ({
  events: INITIAL_EVENTS,
  joinedIds: [],
  myEventIds: [],
  activeCat: 'all',
  activeView: 'list',
  toastMessage: '',
  showToast: false,

  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: nextId++,
      isNew: true,
      joined: 1, // Creator automatically joins
      color: COLORS[nextId % COLORS.length],
    };

    set((state) => ({
      events: [newEvent, ...state.events],
      myEventIds: [...state.myEventIds, newEvent.id],
      joinedIds: [...state.joinedIds, newEvent.id], // Auto-join creator
    }));

    get().displayToast('🎉 Event published!');

    // Remove "new" badge after 10 seconds
    setTimeout(() => {
      set((state) => ({
        events: state.events.map((e) =>
          e.id === newEvent.id ? { ...e, isNew: false } : e
        ),
      }));
    }, 10000);
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
    get().displayToast('✓ Event updated!');
  },

  toggleJoin: (id) => {
    const event = get().events.find((e) => e.id === id);
    if (!event) return;

    const isJoined = get().joinedIds.includes(id);

    if (isJoined) {
      // Leave event
      set((state) => ({
        joinedIds: state.joinedIds.filter((i) => i !== id),
        events: state.events.map((e) =>
          e.id === id ? { ...e, joined: Math.max(0, e.joined - 1) } : e
        ),
      }));
      get().displayToast('Left event');
    } else {
      // Join event
      if (event.joined >= event.maxSlots) {
        get().displayToast('⚠️ Event is full');
        return;
      }

      set((state) => ({
        joinedIds: [...state.joinedIds, id],
        events: state.events.map((e) =>
          e.id === id ? { ...e, joined: e.joined + 1 } : e
        ),
      }));
      get().displayToast('🎉 You are in!');
    }
  },

  setCategory: (cat) => {
    set({ activeCat: cat });
  },

  setView: (view) => {
    set({ activeView: view });
  },

  getFilteredEvents: () => {
    const { events, activeCat, joinedIds } = get();
    if (activeCat === 'all') return events;
    if (activeCat === 'my-events') {
      // Show only events the user has joined
      return events.filter((e) => joinedIds.includes(e.id));
    }
    return events.filter((e) => e.category === activeCat);
  },

  getRecommendedEvents: () => {
    const { events, joinedIds } = get();
    
    // Get categories of events user has joined
    const joinedEvents = events.filter((e) => joinedIds.includes(e.id));
    const preferredCategories = [...new Set(joinedEvents.map((e) => e.category))];
    
    // If user hasn't joined any events, return empty array
    if (preferredCategories.length === 0) return [];
    
    // Find events in preferred categories that user hasn't joined yet
    const recommended = events.filter(
      (e) => preferredCategories.includes(e.category) && !joinedIds.includes(e.id)
    );
    
    // Sort by available spots (events with more spots first) and limit to 6
    return recommended
      .sort((a, b) => (b.maxSlots - b.joined) - (a.maxSlots - a.joined))
      .slice(0, 6);
  },

  displayToast: (message) => {
    set({ toastMessage: message, showToast: true });
    setTimeout(() => {
      get().hideToast();
    }, 2200);
  },

  hideToast: () => {
    set({ showToast: false });
  },
}));

// Made with Bob
