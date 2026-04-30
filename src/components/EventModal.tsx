import { Event } from '../types';
import { useEventStore } from '../store/eventStore';

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

export default function EventModal({ event: initialEvent, onClose }: EventModalProps) {
  const { events, joinedIds, toggleJoin } = useEventStore();
  
  // Get the latest event data from store to ensure reactivity
  const event = events.find(e => e.id === initialEvent.id) || initialEvent;
  
  const isJoined = joinedIds.includes(event.id);
  const isFull = event.joined >= event.maxSlots && !isJoined;

  const handleToggleJoin = () => {
    toggleJoin(event.id);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-dark/40 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg p-4 md:p-6 relative animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          ✕
        </button>

        {/* Handle bar for mobile */}
        <div className="md:hidden w-7 h-1 bg-gray-200 rounded-full mx-auto mb-3" />

        {/* Event emoji */}
        <div className="text-4xl mb-2">{event.emoji}</div>

        {/* Event title and host */}
        <h2 className="font-syne text-lg font-extrabold text-dark">{event.title}</h2>
        <p className="text-xs text-slate-600 mt-0.5">by {event.host}</p>

        {/* Event details grid */}
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="text-[13px] font-semibold text-dark">{event.date}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Date</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="text-[13px] font-semibold text-dark">{event.time}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Time</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="text-xs font-semibold text-dark">{event.location}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Location</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5">
            <div
              className={`text-[13px] font-semibold ${
                isJoined ? 'text-green-600' : isFull ? 'text-red-600' : 'text-dark'
              }`}
            >
              {event.joined}/{event.maxSlots} joined
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Spots</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-slate-700 leading-relaxed mb-3">{event.description}</p>

        {/* Join/Leave button */}
        <button
          onClick={handleToggleJoin}
          disabled={isFull}
          className={`w-full py-3 rounded-xl font-syne text-sm font-extrabold transition-all ${
            isJoined
              ? 'bg-green-600 text-white hover:bg-green-700'
              : isFull
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-dark text-white hover:bg-slate-800'
          }`}
        >
          {isJoined ? '✓ You are in — leave?' : isFull ? 'Event full' : 'Join event →'}
        </button>
      </div>
    </div>
  );
}

// Made with Bob
