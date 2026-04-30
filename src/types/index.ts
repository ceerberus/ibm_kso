/**
 * Core type definitions for the Group Activity Platform
 * Following best practices: strict typing, clear naming, comprehensive documentation
 */

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  createdAt: string;
}

export interface CurrentUser extends User {
  joinedActivities: number[];
  createdActivities: number[];
}

// ============================================================================
// Activity Types
// ============================================================================

export type ActivityType = 'travel' | 'concert' | 'sports' | 'event' | 'other';
export type ActivityStatus = 'open' | 'filling_fast' | 'full' | 'cancelled' | 'completed';

export interface Activity {
  id: number;
  title: string;
  description: string;
  type: ActivityType;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  date: string;
  time?: string;
  totalSpots: number;
  spotsTaken: number;
  pricePerPerson?: number;
  regularPrice?: number;
  groupDiscountInfo?: string;
  status: ActivityStatus;
  creatorId: number;
  creator: User;
  participants: User[];
  comments: Comment[];
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateActivityInput {
  title: string;
  description: string;
  type: ActivityType;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  date: string;
  time?: string;
  totalSpots: number;
  pricePerPerson?: number;
  regularPrice?: number;
  groupDiscountInfo?: string;
}

// ============================================================================
// Comment Types
// ============================================================================

export interface Comment {
  id: number;
  activityId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
}

export interface CreateCommentInput {
  activityId: number;
  content: string;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType = 
  | 'join_request' 
  | 'request_accepted' 
  | 'new_comment' 
  | 'activity_full'
  | 'activity_created'
  | 'spot_taken';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface ActivityFilters {
  city?: string;
  type?: ActivityType;
  date?: string;
  search?: string;
  status?: ActivityStatus;
}

export type SortOption = 'newest' | 'oldest' | 'spots_available' | 'price_low' | 'price_high';

// ============================================================================
// Location Types
// ============================================================================

export interface Location {
  lat: number;
  lng: number;
}

export interface City {
  name: string;
  lat: number;
  lng: number;
}

// ============================================================================
// Store State Types
// ============================================================================

export interface ActivityStore {
  activities: Activity[];
  filteredActivities: Activity[];
  filters: ActivityFilters;
  sortBy: SortOption;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: CreateActivityInput) => void;
  updateActivity: (id: number, updates: Partial<Activity>) => void;
  deleteActivity: (id: number) => void;
  joinActivity: (activityId: number) => void;
  leaveActivity: (activityId: number) => void;
  addComment: (activityId: number, comment: string) => void;
  setFilters: (filters: Partial<ActivityFilters>) => void;
  setSortBy: (sortBy: SortOption) => void;
  applyFilters: () => void;
  getActivityById: (id: number) => Activity | undefined;
  incrementViewCount: (id: number) => void;
}

export interface UserStore {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  
  // Actions
  setCurrentUser: (user: CurrentUser) => void;
  updateProfile: (updates: Partial<CurrentUser>) => void;
  logout: () => void;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

export interface FilterBarProps {
  filters: ActivityFilters;
  onFilterChange: (filters: Partial<ActivityFilters>) => void;
}

export interface MapViewProps {
  activities: Activity[];
  center?: Location;
  zoom?: number;
  onActivityClick?: (activity: Activity) => void;
}

export interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
}

export interface SpotProgressProps {
  current: number;
  total: number;
  showLabel?: boolean;
  animated?: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Made with Bob
