import { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { useNavigate } from 'react-router-dom';
import EditEventModal from '../components/EditEventModal';
import { Event } from '../types';

export default function Profile() {
  const { events, joinedIds, myEventIds } = useEventStore();
  const navigate = useNavigate();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const joinedEvents = events.filter((e) => joinedIds.includes(e.id));
  const myEvents = events.filter((e) => myEventIds.includes(e.id));

  const handleEventClick = (eventId: number) => {
    navigate(`/?event=${eventId}`);
  };

  const handleEditClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
      <div className="max-w-xl">
        {/* Profile Card */}
        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-gray-200 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-dark flex items-center justify-center text-white font-syne text-xl font-extrabold flex-shrink-0">
            AK
          </div>
          <div>
            <h2 className="font-syne text-lg font-extrabold text-dark">Anna Keller</h2>
            <p className="text-sm text-slate-600 mt-0.5">Zurich · 26 years</p>
            <p className="text-sm text-slate-700 mt-1">Loves hiking and good food 🏔️</p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] px-2 py-1 rounded-full bg-sky-50 text-sky-700 border-2 border-sky-200">
                Hiking
              </span>
              <span className="text-[11px] px-2 py-1 rounded-full bg-sky-50 text-sky-700 border-2 border-sky-200">
                Cycling
              </span>
              <span className="text-[11px] px-2 py-1 rounded-full bg-sky-50 text-sky-700 border-2 border-sky-200">
                Cooking
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-3 text-center">
            <div className="font-syne text-2xl font-extrabold text-dark">{joinedIds.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Events joined</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-3 text-center">
            <div className="font-syne text-2xl font-extrabold text-dark">{myEventIds.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Organized</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-3 text-center">
            <div className="font-syne text-2xl font-extrabold text-dark">9</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Connections</div>
          </div>
        </div>

        {/* My Events Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2 font-syne">
            Your events
          </h3>
          {myEvents.length === 0 ? (
            <p className="text-sm text-slate-400">No events yet — create one!</p>
          ) : (
            <div className="space-y-2">
              {myEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-sky-300 transition-colors"
                >
                  <span className="text-xl">{event.emoji}</span>
                  <div className="flex-1 cursor-pointer" onClick={() => handleEventClick(event.id)}>
                    <div className="text-sm font-semibold text-dark font-syne">{event.title}</div>
                    <div className="text-[11px] text-slate-600">
                      {event.date} · {event.joined}/{event.maxSlots} joined
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleEditClick(event, e)}
                    className="px-3 py-1.5 text-xs font-semibold text-primary bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Joined Events Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2 font-syne">
            Joined events
          </h3>
          {joinedEvents.length === 0 ? (
            <p className="text-sm text-slate-400">You haven't joined any events yet.</p>
          ) : (
            <div className="space-y-2">
              {joinedEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 cursor-pointer hover:border-sky-300 transition-colors"
                >
                  <span className="text-xl">{event.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-dark font-syne">{event.title}</div>
                    <div className="text-[11px] text-slate-600">
                      {event.date} · {event.time}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    ✓ Joined
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}

// Made with Bob
