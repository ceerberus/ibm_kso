import { Event } from '../types';
import { useEventStore } from '../store/eventStore';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const joinedIds = useEventStore((state) => state.joinedIds);
  const isJoined = joinedIds.includes(event.id);
  const isFull = event.joined >= event.maxSlots;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border-2 border-gray-200 p-3.5 cursor-pointer transition-all duration-200 hover:border-sky-300 hover:-translate-y-0.5 hover:shadow-md ${
        event.isNew ? 'animate-pop-in border-green-500' : ''
      }`}
    >
      <div className="flex gap-2.5 mb-2.5">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${event.color}18` }}
        >
          {event.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-syne text-sm font-bold text-dark leading-tight">
            {event.title}
            {event.isNew && (
              <span className="ml-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-600 align-middle">
                new
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
            📅 {event.date} · {event.time}
            <br />
            📍 {event.location}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            style={{ backgroundColor: event.color }}
          >
            {event.hostInitials}
          </div>
          <span className="text-[11px] text-slate-400 ml-1.5">{event.host}</span>
        </div>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-all ${
            isJoined
              ? 'bg-green-100 text-green-600'
              : isFull
              ? 'bg-red-50 text-red-600'
              : 'text-slate-700'
          }`}
          style={{
            backgroundColor: !isJoined && !isFull ? `${event.color}18` : undefined,
            color: !isJoined && !isFull ? event.color : undefined,
          }}
        >
          {event.joined}/{event.maxSlots}
          {isJoined && ' ✓'}
        </span>
      </div>
    </div>
  );
}

// Made with Bob
