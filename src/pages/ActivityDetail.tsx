import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityStore } from '../store/activityStore';
import { useUserStore } from '../store/userStore';
import { useNotificationStore } from '../store/notificationStore';

const CARD_GRADIENTS: Record<string, string> = {
  travel:  'from-sky-100 via-sky-50 to-blue-50',
  concert: 'from-purple-100 via-violet-50 to-primary-50',
  sports:  'from-cyan-100 via-sky-50 to-blue-50',
  event:   'from-indigo-100 via-blue-50 to-secondary-50',
  other:   'from-gray-100 via-gray-50 to-zinc-50',
};

const TYPE_ICONS: Record<string, string> = {
  travel: '✈️', concert: '🎵', sports: '⚽', event: '🎪', other: '⭐',
};

const Card = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
  >
    {children}
  </motion.div>
);

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getActivityById,
    requestJoin,
    cancelJoinRequest,
    approveRequest,
    rejectRequest,
    leaveActivity,
    sendChatMessage,
    incrementViewCount,
  } = useActivityStore();
  const currentUser = useUserStore((state) => state.currentUser);
  const { saveActivity, unsaveActivity, isActivitySaved } = useUserStore();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const [activity, setActivity] = useState(getActivityById(Number(id)));
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);

  const refresh = () => setActivity(getActivityById(Number(id)));

  useEffect(() => {
    // Scroll to top when activity detail page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (id) {
      incrementViewCount(Number(id));
      refresh();
    }
  }, [id]);

  useEffect(() => {
    // Only scroll if messages were added (not on initial load)
    if (activity && prevMessageCountRef.current > 0 && activity.chatMessages.length > prevMessageCountRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (activity) {
      prevMessageCountRef.current = activity.chatMessages.length;
    }
  }, [activity?.chatMessages.length]);

  if (!activity) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Activity Not Found</h2>
        <button onClick={() => navigate('/')} className="text-primary-400 hover:text-primary-300">
          Back to Activities
        </button>
      </div>
    );
  }

  const isCreator = currentUser?.id === activity.creatorId;
  const isParticipant = activity.participants.some((p) => p.id === currentUser?.id);
  const isPending = activity.pendingRequests.some((r) => r.userId === currentUser?.id);
  const spotsLeft = activity.totalSpots - activity.spotsTaken;
  const progressPercentage = (activity.spotsTaken / activity.totalSpots) * 100;
  const gradient = CARD_GRADIENTS[activity.type] ?? CARD_GRADIENTS.other;
  const typeIcon = TYPE_ICONS[activity.type] ?? '⭐';

  const handleRequestJoin = () => {
    if (!currentUser) return;
    requestJoin(activity.id, requestMessage);
    setShowRequestForm(false);
    setRequestMessage('');
    addNotification({
      userId: currentUser.id,
      type: 'join_request',
      title: 'Request Sent',
      message: `Your request to join "${activity.title}" was sent to the organiser.`,
      isRead: false,
    });
    refresh();
  };

  const handleCancelRequest = () => {
    cancelJoinRequest(activity.id);
    refresh();
  };

  const handleLeave = () => {
    if (!currentUser) return;
    leaveActivity(activity.id);
    addNotification({
      userId: currentUser.id,
      type: 'spot_taken',
      title: 'Left Activity',
      message: `You left "${activity.title}"`,
      isRead: false,
    });
    refresh();
  };

  const handleApprove = (userId: number, userName: string) => {
    approveRequest(activity.id, userId);
    addNotification({
      userId: currentUser!.id,
      type: 'request_accepted',
      title: 'Member Approved',
      message: `${userName} has been approved to join "${activity.title}".`,
      isRead: false,
    });
    refresh();
  };

  const handleReject = (userId: number, userName: string) => {
    rejectRequest(activity.id, userId);
    addNotification({
      userId: currentUser!.id,
      type: 'request_rejected',
      title: 'Request Declined',
      message: `You declined ${userName}'s request for "${activity.title}".`,
      isRead: false,
    });
    refresh();
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    sendChatMessage(activity.id, chatInput.trim());
    setChatInput('');
    refresh();
  };

  const handleSaveToggle = () => {
    if (isActivitySaved(activity.id)) {
      unsaveActivity(activity.id);
    } else {
      saveActivity(activity.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden bg-white shadow-lg"
      >
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{typeIcon}</span>
                <span className="px-3 py-1 bg-gray-700 text-white text-xs font-semibold rounded-lg capitalize">
                  {activity.type}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  activity.status === 'open' ? 'bg-violet-100 text-violet-700 border-violet-200' :
                  activity.status === 'filling_fast' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                  'bg-red-100 text-red-700 border-red-200'
                }`}>
                  {activity.status === 'open' ? 'Open' : activity.status === 'filling_fast' ? 'Filling Fast' : 'Full'}
                </span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">{activity.title}</h1>
              <p className="text-gray-700 leading-relaxed">{activity.description}</p>
            </div>
            <button
              onClick={handleSaveToggle}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all border border-gray-200 shrink-0"
              title={isActivitySaved(activity.id) ? 'Remove from saved' : 'Save for later'}
            >
              <svg className="w-6 h-6 text-gray-700" fill={isActivitySaved(activity.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Location</p>
              <p className="text-gray-900 font-semibold text-sm">{activity.location}</p>
              <p className="text-gray-600 text-xs">{activity.city}</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Date & Time</p>
              <p className="text-gray-900 font-semibold text-sm">
                {new Date(activity.date).toLocaleDateString('en-CH', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              {activity.time && <p className="text-gray-600 text-xs">at {activity.time}</p>}
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Spots</p>
              <p className="text-gray-900 font-semibold text-sm">{spotsLeft} of {activity.totalSpots} left</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${progressPercentage >= 80 ? 'bg-red-500' : progressPercentage >= 50 ? 'bg-blue-500' : 'bg-violet-500'}`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          {activity.pricePerPerson && (
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <p className="text-gray-500 text-xs mb-1">🎟 Group Ticket Info</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                The group ticket is{' '}
                <span className="text-gray-900 font-bold">CHF {activity.pricePerPerson} per person</span>
                {activity.regularPrice && (
                  <> (regular: <span className="line-through text-gray-400">CHF {activity.regularPrice}</span>)</>
                )}
                {' '}— CHF{' '}
                <span className="text-gray-900 font-bold">{activity.pricePerPerson * activity.totalSpots} total</span>{' '}
                for {activity.totalSpots} people.
                {activity.regularPrice && (
                  <> Save{' '}
                    <span className="text-violet-600 font-bold">
                      CHF {(activity.regularPrice - activity.pricePerPerson) * activity.totalSpots}
                    </span>{' '}
                    vs. individual tickets.
                  </>
                )}
              </p>
              {activity.groupDiscountInfo && (
                <p className="text-gray-500 text-xs italic mt-1">{activity.groupDiscountInfo}</p>
              )}
            </div>
          )}

          {/* Join / status actions */}
          {!isCreator && (
            <div>
              {isParticipant ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    You're in this activity
                  </div>
                  <button
                    onClick={handleLeave}
                    className="ml-auto px-5 py-2 text-sm font-semibold text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors"
                  >
                    Leave
                  </button>
                </div>
              ) : isPending ? (
                <div className="flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-indigo-300 text-sm flex-1 font-medium">
                    Your request is pending approval from the organiser.
                  </p>
                  <button onClick={handleCancelRequest} className="text-xs text-indigo-400 underline hover:text-indigo-300">
                    Cancel
                  </button>
                </div>
              ) : activity.spotsTaken >= activity.totalSpots ? (
                <button disabled className="w-full py-4 rounded-xl font-bold text-base bg-gray-100 text-gray-400 cursor-not-allowed">
                  Activity Full
                </button>
              ) : showRequestForm ? (
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-700 text-sm font-medium">
                    Say hi to the organiser (optional)
                  </p>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="e.g. Hey! I'm a big fan of hiking and would love to join…"
                    rows={3}
                    className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm px-4 py-3 rounded-xl outline-none focus:border-primary-500 resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleRequestJoin}
                      className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all text-sm"
                    >
                      Send Join Request
                    </button>
                    <button
                      onClick={() => setShowRequestForm(false)}
                      className="px-5 py-3 text-sm font-semibold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="w-full py-4 rounded-xl font-bold text-base bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-lg shadow-primary-900/40"
                >
                  Request to Join
                </button>
              )}
            </div>
          )}

          {isCreator && (
            <div className="px-4 py-3 bg-primary-500/10 border border-primary-500/20 rounded-xl text-sm text-primary-300 font-semibold">
              You organised this activity
            </div>
          )}
        </div>
      </motion.div>

      {/* Organiser */}
      <Card delay={0.1}>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Organised by</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <span className="text-base font-bold text-white">{activity.creator.firstName.charAt(0)}</span>
          </div>
          <div>
            <p className="font-bold text-white">{activity.creator.firstName} {activity.creator.lastName}</p>
            <p className="text-sm text-gray-500">{activity.creator.city}</p>
          </div>
        </div>
      </Card>

      {/* Members */}
      <Card delay={0.15}>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
          Members ({activity.participants.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {activity.participants.map((p) => (
            <div key={p.id} className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-primary-700 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{p.firstName.charAt(0)}</span>
              </div>
              <span className="text-sm text-gray-300">
                {p.firstName} {p.lastName}
                {p.id === activity.creatorId && (
                  <span className="ml-1 text-xs text-primary-400">(organiser)</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending Requests — creator only */}
      {isCreator && activity.pendingRequests.length > 0 && (
        <Card delay={0.2}>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
            Join Requests
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            {activity.pendingRequests.length} {activity.pendingRequests.length === 1 ? 'person' : 'people'} waiting for approval.
          </p>
          <div className="space-y-3">
            {activity.pendingRequests.map((req) => (
              <div key={req.id} className="flex items-start gap-4 p-4 bg-white/3 border border-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">{req.user.firstName.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm">
                    {req.user.firstName} {req.user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">{req.user.city}</p>
                  {req.message && (
                    <p className="text-sm text-gray-400 italic">"{req.message}"</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(req.userId, `${req.user.firstName} ${req.user.lastName}`)}
                    className="px-3 py-1.5 text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.userId, `${req.user.firstName} ${req.user.lastName}`)}
                    className="px-3 py-1.5 text-xs font-bold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Group Chat */}
      {(isParticipant || isCreator) ? (
        <Card delay={0.25}>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Group Chat
          </h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-4 bg-white">
              {activity.chatMessages.length === 0 ? (
                <p className="text-sm text-gray-500 text-center pt-10">
                  No messages yet. Say hi to the group!
                </p>
              ) : (
                activity.chatMessages.map((msg) => {
                  const isMine = msg.userId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-purple-700 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-white">{msg.userName.charAt(0)}</span>
                      </div>
                      <div className={`max-w-xs flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        <span className={`text-xs text-gray-500 mb-1 ${isMine ? 'text-right' : ''}`}>
                          {isMine ? 'You' : msg.userName}
                        </span>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${
                          isMine
                            ? 'bg-primary-600 text-white rounded-tr-sm'
                            : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString('en-CH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3 bg-gray-50 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message the group…"
                className="flex-1 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-primary-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="border-2 border-dashed border-white/5 rounded-2xl p-10 text-center"
        >
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-500 mb-1">Group Chat</p>
          <p className="text-xs text-gray-600">Only approved members can see and send messages.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ActivityDetail;
