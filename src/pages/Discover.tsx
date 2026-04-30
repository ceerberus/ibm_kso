import { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import EventCard from '../components/EventCard';
import MapView from '../components/MapView';
import EventModal from '../components/EventModal';
import { Event } from '../types';

export default function Discover() {
  const { getFilteredEvents, getRecommendedEvents, activeView, setView, events, activeCat } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const filteredEvents = getFilteredEvents();
  const recommendedEvents = getRecommendedEvents();

  const handleEventClick = (eventId: number) => {
    // Search in all events, not just filtered
    const event = events.find((e) => e.id === eventId);
    if (event) setSelectedEvent(event);
  };

  // Get category display name
  const getCategoryDisplay = () => {
    if (activeCat === 'all') return 'All Events';
    if (activeCat === 'my-events') return 'My Events';
    return activeCat.charAt(0).toUpperCase() + activeCat.slice(1);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6 bg-gradient-to-b from-slate-50/50 to-white">
      {/* Hero Stats Bar */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-syne text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-1">
                {getCategoryDisplay()}
              </h1>
              <p className="text-sky-100 text-sm font-medium">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} available in Zurich
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{events.length}</div>
                <div className="text-xs text-sky-100 font-medium">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {events.reduce((sum, e) => sum + e.joined, 0)}
                </div>
                <div className="text-xs text-sky-100 font-medium">Joined</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {events.filter(e => e.joined < e.maxSlots).length}
                </div>
                <div className="text-xs text-sky-100 font-medium">Open</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section - Only show if there are recommendations */}
      {recommendedEvents.length > 0 && activeCat === 'all' && (
        <div className="px-4 md:px-6 pt-8 pb-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl">⭐</span>
                </div>
                <div>
                  <h2 className="font-syne text-xl md:text-2xl font-extrabold text-dark">
                    Picked for You
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Based on your interests
                  </p>
                </div>
              </div>
            </div>

            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="relative">
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
                {recommendedEvents.slice(0, 3).map((event, index) => (
                  <div
                    key={event.id}
                    className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-auto snap-center md:snap-align-none"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <EventCard
                        event={event}
                        onClick={() => handleEventClick(event.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Section */}
      <div className="px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-indigo-500 rounded-full"></div>
              <h3 className="font-syne text-lg md:text-xl font-bold text-dark">
                {activeCat === 'all' ? 'All Events' : activeCat === 'my-events' ? 'Your Events' : `${getCategoryDisplay()} Events`}
              </h3>
            </div>
            
            {/* Enhanced view toggle */}
            <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeView === 'list'
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-dark hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="hidden sm:inline">List</span>
                </span>
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeView === 'map'
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-dark hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="hidden sm:inline">Map</span>
                </span>
              </button>
            </div>
          </div>

          {/* Main Content with fade-in animation */}
          <div className="animate-fadeIn">
            {activeView === 'list' ? (
              filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.map((event, index) => (
                    <div
                      key={event.id}
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                      }}
                    >
                      <EventCard
                        event={event}
                        onClick={() => handleEventClick(event.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="font-syne text-xl font-bold text-dark mb-2">No events found</h3>
                  <p className="text-slate-500">Try selecting a different category</p>
                </div>
              )
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200">
                <MapView events={filteredEvents} onEventClick={handleEventClick} />
              </div>
            )}
          </div>
        </div>
      </div>

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
