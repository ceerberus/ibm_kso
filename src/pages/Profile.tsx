import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { useActivityStore } from '../store/activityStore';
import { useNotificationStore } from '../store/notificationStore';

const Card = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

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
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
        <button onClick={() => navigate('/')} className="text-primary-500 hover:text-primary-400">
          Back to Home
        </button>
      </div>
    );
  }

  const joinedActivities = activities.filter((a) =>
    a.participants.some((p) => p.id === currentUser.id)
  );
  const createdActivities = activities.filter((a) => a.creatorId === currentUser.id);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-5">
      {/* Profile header */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <span className="text-3xl font-black text-white">
                {currentUser.firstName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <p className="text-gray-500 text-sm">{currentUser.email}</p>
              <p className="text-gray-500 text-sm">{currentUser.city}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-semibold text-gray-400 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleEditSubmit}
            className="border-t border-white/5 pt-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'firstName', label: 'First Name', type: 'text' },
                { name: 'lastName', label: 'Last Name', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phone', label: 'Phone (optional)', type: 'tel' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={editForm[f.name as keyof typeof editForm]}
                    onChange={handleEditChange}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-2.5 rounded-xl outline-none focus:border-primary-500 text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">City</label>
                <select
                  name="city"
                  value={editForm.city}
                  onChange={handleEditChange}
                  className="w-full bg-[#0e0e14] border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-primary-500 text-sm"
                >
                  {['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lucerne'].map((c) => (
                    <option key={c} value={c} className="bg-gray-900">{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all text-sm"
            >
              Save Changes
            </button>
          </motion.form>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          {[
            { value: joinedActivities.length, label: 'Joined' },
            { value: createdActivities.length, label: 'Created' },
            { value: notifications.filter((n) => !n.isRead).length, label: 'Unread' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                {s.value}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Activities grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Joined */}
        <Card delay={0.1}>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Joined Activities
            <span className="ml-2 text-gray-600 font-normal normal-case tracking-normal">({joinedActivities.length})</span>
          </h2>
          {joinedActivities.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">
              You haven't joined any activities yet.
            </p>
          ) : (
            <div className="space-y-3">
              {joinedActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  className="bg-white/3 border border-white/5 rounded-xl p-4 hover:border-primary-500/30 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <h3 className="font-bold text-white text-sm mb-1">{activity.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{activity.city}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(activity.date).toLocaleDateString('en-CH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="text-primary-400 font-semibold">{activity.spotsTaken}/{activity.totalSpots} spots</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Created */}
        <Card delay={0.15}>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Created Activities
            <span className="ml-2 text-gray-600 font-normal normal-case tracking-normal">({createdActivities.length})</span>
          </h2>
          {createdActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm mb-4">You haven't created any activities yet.</p>
              <button
                onClick={() => navigate('/create')}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold rounded-xl transition-all"
              >
                Create Activity
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {createdActivities.map((activity) => {
                const pendingCount = activity.pendingRequests.length;
                return (
                  <div
                    key={activity.id}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                    className="bg-white/3 border border-white/5 rounded-xl p-4 hover:border-primary-500/30 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-white text-sm">{activity.title}</h3>
                      {pendingCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-indigo-500/15 text-indigo-400 text-xs font-bold rounded-lg shrink-0 border border-indigo-500/20">
                          {pendingCount} pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{activity.city}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(activity.date).toLocaleDateString('en-CH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="text-primary-400 font-semibold">{activity.spotsTaken}/{activity.totalSpots} spots</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Notifications */}
      <Card delay={0.2}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Notifications
            <span className="ml-2 text-gray-600 font-normal normal-case tracking-normal">({notifications.length})</span>
          </h2>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No notifications yet.</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`rounded-xl p-4 cursor-pointer transition-all border ${
                  notification.isRead
                    ? 'bg-white/3 border-white/5 opacity-60'
                    : 'bg-primary-500/8 border-primary-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm mb-0.5">{notification.title}</h3>
                    <p className="text-xs text-gray-400">{notification.message}</p>
                  </div>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-1 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {new Date(notification.createdAt).toLocaleString('en-CH')}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
