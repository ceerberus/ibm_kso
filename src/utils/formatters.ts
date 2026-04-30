/**
 * Utility functions for formatting data
 * Following best practices: pure functions, proper typing, reusability
 */

import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
};

/**
 * Format time to readable string
 */
export const formatTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  } catch {
    return timeString;
  }
};

/**
 * Format date and time together
 */
export const formatDateTime = (dateString: string, timeString?: string): string => {
  const formattedDate = formatDate(dateString);
  if (timeString) {
    return `${formattedDate} at ${formatTime(timeString)}`;
  }
  return formattedDate;
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

/**
 * Format price in CHF
 */
export const formatPrice = (price: number): string => {
  return `CHF ${price.toFixed(2)}`;
};

/**
 * Calculate savings percentage
 */
export const calculateSavings = (regularPrice: number, discountPrice: number): number => {
  return Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
};

/**
 * Format savings display
 */
export const formatSavings = (regularPrice: number, discountPrice: number): string => {
  const savings = calculateSavings(regularPrice, discountPrice);
  const amount = regularPrice - discountPrice;
  return `Save ${savings}% (CHF ${amount.toFixed(2)})`;
};

/**
 * Check if activity date is in the past
 */
export const isActivityPast = (dateString: string): boolean => {
  try {
    return isPast(new Date(dateString));
  } catch {
    return false;
  }
};

/**
 * Check if activity date is in the future
 */
export const isActivityFuture = (dateString: string): boolean => {
  try {
    return isFuture(new Date(dateString));
  } catch {
    return false;
  }
};

/**
 * Get activity status color
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'open':
      return 'text-green-600 bg-green-50';
    case 'filling_fast':
      return 'text-orange-600 bg-orange-50';
    case 'full':
      return 'text-red-600 bg-red-50';
    case 'cancelled':
      return 'text-gray-600 bg-gray-50';
    case 'completed':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

/**
 * Get activity type icon
 */
export const getActivityTypeIcon = (type: string): string => {
  switch (type) {
    case 'travel':
      return '🚂';
    case 'concert':
      return '🎵';
    case 'sports':
      return '⚽';
    case 'event':
      return '🎉';
    default:
      return '📍';
  }
};

/**
 * Get activity type label
 */
export const getActivityTypeLabel = (type: string): string => {
  switch (type) {
    case 'travel':
      return 'Travel';
    case 'concert':
      return 'Concert';
    case 'sports':
      return 'Sports';
    case 'event':
      return 'Event';
    default:
      return 'Other';
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Swiss phone number format: +41 XX XXX XX XX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('41')) {
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
  }
  return phone;
};

// Made with Bob
