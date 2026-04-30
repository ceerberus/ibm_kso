/**
 * Profile Page Component
 * User profile with activities and settings
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { useActivityStore } from '../store/activityStore';
import { useNotificationStore } from '../store/notificationStore';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useUserStore();
  const { activities } = useActivityStore();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    city: currentUser?.city || '',
    phone: currentUser?.phone || '',
  });

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const joinedActivities = activities.filter((activity) =>
    activity.participants.some((p) => p.id === currentUser.id)
  );

  const createdActivities = activities.filter(
    (activity) => activity.creatorId === currentUser.id
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mr-6">
              <span className="text-3xl font-bold text-primary-600">
                {currentUser.firstName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <p className="text-gray-600">{currentUser.email}</p>
              <p className="text-gray-600">{currentUser.city}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleEditSubmit}
            className="border-t border-gray-200 pt-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={editForm.city}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Zurich">Zurich</option>
                  <option value="Geneva">Geneva</option>
                  <option value="Basel">Basel</option>
                  <option value="Bern">Bern</option>
                  <option value="Lausanne">Lausanne</option>
                  <option value="Lucerne">Lucerne</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </motion.form>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{joinedActivities.length}</p>
            <p className="text-sm text-gray-600">Joined Activities</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{createdActivities.length}</p>
            <p className="text-sm text-gray-600">Created Activities</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">
              {notifications.filter((n) => !n.isRead).length}
            </p>
            <p className="text-sm text-gray-600">Unread Notifications</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Joined Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Joined Activities ({joinedActivities.length})
          </h2>
          {joinedActivities.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              You haven't joined any activities yet.
            </p>
          ) : (
            <div className="space-y-4">
              {joinedActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <h3 className="font-bold text-gray-900 mb-1">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{activity.city}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                    <span className="text-primary-600 font-medium">
                      {activity.spotsTaken}/{activity.totalSpots} spots
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Created Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Created Activities ({createdActivities.length})
          </h2>
          {createdActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't created any activities yet.</p>
              <button
                onClick={() => navigate('/create')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Activity
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {createdActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <h3 className="font-bold text-gray-900 mb-1">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{activity.city}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                    <span className="text-primary-600 font-medium">
                      {activity.spotsTaken}/{activity.totalSpots} spots
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Notifications ({notifications.length})
          </h2>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No notifications yet.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  notification.isRead
                    ? 'border-gray-200 bg-white'
                    : 'border-primary-200 bg-primary-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;

// Made with Bob