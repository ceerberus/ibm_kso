/**
 * Activity Detail Page Component
 * Shows detailed information about a specific activity
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityStore } from '../store/activityStore';
import { useUserStore } from '../store/userStore';
import { useNotificationStore } from '../store/notificationStore';

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getActivityById, joinActivity, leaveActivity, addComment, incrementViewCount } = useActivityStore();
  const currentUser = useUserStore((state) => state.currentUser);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const [activity, setActivity] = useState(getActivityById(Number(id)));
  const [comment, setComment] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (id) {
      incrementViewCount(Number(id));
      const act = getActivityById(Number(id));
      setActivity(act);
      
      if (act && currentUser) {
        setIsJoined(act.participants.some(p => p.id === currentUser.id));
      }
    }
  }, [id, getActivityById, incrementViewCount, currentUser]);

  if (!activity) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleJoin = () => {
    if (!currentUser) return;
    
    if (isJoined) {
      leaveActivity(activity.id);
      setIsJoined(false);
      addNotification({
        userId: currentUser.id,
        type: 'spot_taken',
        title: 'Left Activity',
        message: `You left "${activity.title}"`,
        isRead: false,
      });
    } else {
      if (activity.spotsTaken < activity.totalSpots) {
        joinActivity(activity.id);
        setIsJoined(true);
        addNotification({
          userId: currentUser.id,
          type: 'request_accepted',
          title: 'Joined Activity',
          message: `You joined "${activity.title}"`,
          isRead: false,
        });
      }
    }
    
    // Refresh activity data
    const updatedActivity = getActivityById(activity.id);
    if (updatedActivity) {
      setActivity(updatedActivity);
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    addComment(activity.id, comment);
    setComment('');
    
    // Refresh activity data
    const updatedActivity = getActivityById(activity.id);
    if (updatedActivity) {
      setActivity(updatedActivity);
    }
  };

  const spotsLeft = activity.totalSpots - activity.spotsTaken;
  const progressPercentage = (activity.spotsTaken / activity.totalSpots) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Activities
      </button>

      {/* Activity Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activity.title}
            </h1>
            <p className="text-gray-600">{activity.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            activity.status === 'open' ? 'bg-green-100 text-green-800' :
            activity.status === 'filling_fast' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {activity.status === 'open' ? 'Open' :
             activity.status === 'filling_fast' ? 'Filling Fast' : 'Full'}
          </span>
        </div>

        {/* Activity Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{activity.location}, {activity.city}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {new Date(activity.date).toLocaleDateString()} {activity.time && `at ${activity.time}`}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">{activity.type}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Group ticket pricing — described naturally */}
            {activity.pricePerPerson && (
              <div className="rounded-lg border border-gray-200 p-4 space-y-1.5">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  🎟 Group Ticket Info
                </p>
                <p className="text-sm text-gray-600">
                  The group ticket is{' '}
                  <span className="font-semibold text-gray-800">CHF {activity.pricePerPerson} per person</span>
                  {activity.regularPrice && (
                    <> (regular price: <span className="line-through text-gray-400">CHF {activity.regularPrice}</span>)</>
                  )}
                  {' '}and would be{' '}
                  <span className="font-semibold text-gray-800">
                    CHF {activity.pricePerPerson * activity.totalSpots} in total
                  </span>{' '}
                  for {activity.totalSpots} participants.
                  {activity.regularPrice && (
                    <> That's a saving of{' '}
                      <span className="text-green-600 font-medium">
                        CHF {(activity.regularPrice - activity.pricePerPerson) * activity.totalSpots}
                      </span>{' '}
                      compared to buying individually.
                    </>
                  )}
                </p>
                {activity.groupDiscountInfo && (
                  <p className="text-xs text-gray-400 italic">{activity.groupDiscountInfo}</p>
                )}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Spots filled</span>
                <span className="text-sm font-medium text-gray-900">
                  {activity.spotsTaken} / {activity.totalSpots}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    progressPercentage >= 80 ? 'bg-red-500' :
                    progressPercentage >= 50 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
              </p>
            </div>
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={handleJoin}
          disabled={!isJoined && activity.spotsTaken >= activity.totalSpots}
          className={`w-full py-4 rounded-lg font-medium text-lg transition-colors ${
            isJoined
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : activity.spotsTaken >= activity.totalSpots
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {isJoined ? 'Leave Activity' : activity.spotsTaken >= activity.totalSpots ? 'Activity Full' : 'Join Activity'}
        </button>
      </motion.div>

      {/* Organizer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Organized By</h2>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <span className="text-lg font-medium text-primary-600">
              {activity.creator.firstName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {activity.creator.firstName} {activity.creator.lastName}
            </p>
            <p className="text-sm text-gray-600">{activity.creator.city}</p>
          </div>
        </div>
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Comments ({activity.comments.length})
        </h2>

        {/* Add Comment */}
        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            onClick={handleAddComment}
            disabled={!comment.trim()}
            className="mt-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Post Comment
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {activity.comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            activity.comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-600">
                      {comment.userName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{comment.userName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ActivityDetail;

// Made with Bob