export interface Event {
  id: number;
  title: string;
  category: string;
  emoji: string;
  date: string;
  time: string;
  location: string;
  lat: number;
  lng: number;
  host: string;
  hostInitials: string;
  maxSlots: number;
  joined: number;
  description: string;
  color: string;
  isNew: boolean;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export type ViewMode = 'list' | 'map';

export interface EventStore {
  events: Event[];
  joinedIds: number[];
  myEventIds: number[];
  activeCat: string;
  activeView: ViewMode;
  toastMessage: string;
  showToast: boolean;
  
  // Actions
  addEvent: (event: Omit<Event, 'id' | 'isNew'>) => void;
  toggleJoin: (id: number) => void;
  setCategory: (cat: string) => void;
  setView: (view: ViewMode) => void;
  getFilteredEvents: () => Event[];
  displayToast: (message: string) => void;
  hideToast: () => void;
}

// Made with Bob
