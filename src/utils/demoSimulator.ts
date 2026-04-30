/**
 * Demo Simulator - Creates realistic activity for demo purposes
 * Following best practices: realistic timing, proper notifications
 */

import { useActivityStore } from '@/store/activityStore';
import { useNotificationStore } from '@/store/notificationStore';
import { mockUsers, getRandomUsers } from '@/data/mockUsers';
import { swissCities } from '@/data/swissCities';
import { ActivityType } from '@/types';

let simulatorInterval: NodeJS.Timeout | null = null;

/**
 * Simulates someone joining an activity every 30-60 seconds
 */
const simulateJoinActivity = () => {
  const activityStore = useActivityStore.getState();
  const notificationStore = useNotificationStore.getState();
  
  const openActivities = activityStore.filteredActivities.filter(
    (a) => a.status === 'open' || a.status === 'filling_fast'
  );

  if (openActivities.length === 0) return;

  const randomActivity = openActivities[Math.floor(Math.random() * openActivities.length)];
  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

  // Update activity
  activityStore.updateActivity(randomActivity.id, {
    spotsTaken: randomActivity.spotsTaken + 1,
    participants: [...randomActivity.participants, randomUser],
    status:
      randomActivity.spotsTaken + 1 >= randomActivity.totalSpots
        ? 'full'
        : randomActivity.spotsTaken + 1 >= randomActivity.totalSpots * 0.8
        ? 'filling_fast'
        : 'open',
  });

  // Add notification
  notificationStore.addNotification({
    userId: randomActivity.creatorId,
    type: 'spot_taken',
    title: 'Someone joined your activity!',
    message: `${randomUser.firstName} ${randomUser.lastName} just joined "${randomActivity.title}"`,
    link: `/activities/${randomActivity.id}`,
    isRead: false,
  });
};

/**
 * Generates a random activity for demo purposes
 */
const generateRandomActivity = () => {
  const types: ActivityType[] = ['travel', 'concert', 'sports', 'event'];
  const titles = [
    'SBB Day Pass Group Ticket',
    'Museum Night Group Entry',
    'Ski Day Trip to Verbier',
    'Concert at Hallenstadion',
    'Food Festival Group Tickets',
    'Boat Tour on Lake Geneva',
  ];

  const randomCity = swissCities[Math.floor(Math.random() * swissCities.length)];
  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 7);

  return {
    title: randomTitle,
    description: `Join us for ${randomTitle.toLowerCase()}! Group discount available.`,
    type: randomType,
    location: randomCity.name,
    city: randomCity.name,
    latitude: randomCity.lat,
    longitude: randomCity.lng,
    date: futureDate.toISOString().split('T')[0],
    time: '10:00',
    totalSpots: Math.floor(Math.random() * 6) + 4,
    pricePerPerson: Math.floor(Math.random() * 50) + 30,
    regularPrice: Math.floor(Math.random() * 70) + 50,
  };
};

/**
 * Simulates a new activity being created
 */
const simulateNewActivity = () => {
  const activityStore = useActivityStore.getState();
  const notificationStore = useNotificationStore.getState();

  const newActivity = generateRandomActivity();
  activityStore.addActivity(newActivity);

  // Add notification
  notificationStore.addNotification({
    userId: 100, // Current user
    type: 'activity_created',
    title: 'New activity posted!',
    message: `Check out: ${newActivity.title}`,
    link: `/activities/${Date.now()}`,
    isRead: false,
  });
};

/**
 * Starts the demo simulator
 */
export const startDemoSimulator = () => {
  if (simulatorInterval) return;

  console.log('🎬 Demo simulator started');

  // Simulate someone joining an activity every 45 seconds
  const joinInterval = setInterval(() => {
    simulateJoinActivity();
  }, 45000);

  // Simulate new activity every 2.5 minutes
  const createInterval = setInterval(() => {
    simulateNewActivity();
  }, 150000);

  simulatorInterval = joinInterval;

  // Cleanup function
  return () => {
    clearInterval(joinInterval);
    clearInterval(createInterval);
    simulatorInterval = null;
    console.log('🛑 Demo simulator stopped');
  };
};

/**
 * Stops the demo simulator
 */
export const stopDemoSimulator = () => {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
    simulatorInterval = null;
    console.log('🛑 Demo simulator stopped');
  }
};

// Made with Bob
