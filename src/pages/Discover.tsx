import { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import EventCard from '../components/EventCard';
import MapView from '../components/MapView';
import EventModal from '../components/EventModal';
import { Event } from '../types';

export default function Discover() {
  const { getFilteredEvents, activeView, setView } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const filteredEvents = getFilteredEvents();

  const handleEventClick = (eventId: number) => {
    const event = filteredEvents.find((e) => e.id === eventId);
    if (event) setSelectedEvent(event);
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-syne text-lg md:text-xl font-extrabold text-dark">
            Events in Zurich
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {/* View toggle */}
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeView === 'list'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeView === 'map'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeView === 'list' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event.id)}
            />
          ))}
        </div>
      ) : (
        <MapView events={filteredEvents} onEventClick={handleEventClick} />
      )}

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

// Made with Bob
