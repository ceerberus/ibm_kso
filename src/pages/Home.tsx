import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityStore } from '../store/activityStore';
import { useUserStore } from '../store/userStore';
import { Activity } from '../types';
import MapView from '../components/MapView';

const CATEGORIES = [
  { label: 'All', value: '', icon: '✦' },
  { label: 'Travel', value: 'travel', icon: '✈️' },
  { label: 'Concerts', value: 'concert', icon: '🎵' },
  { label: 'Sports', value: 'sports', icon: '⚽' },
  { label: 'Events', value: 'event', icon: '🎪' },
];

const STATUS_STYLES: Record<string, string> = {
  open:         'bg-emerald-50 text-emerald-700 border border-emerald-200',
  filling_fast: 'bg-orange-50 text-orange-700 border border-orange-200',
  full:         'bg-red-50 text-red-700 border border-red-200',
  cancelled:    'bg-gray-50 text-gray-600 border border-gray-200',
  completed:    'bg-gray-50 text-gray-600 border border-gray-200',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Open', filling_fast: 'Filling Fast', full: 'Full',
  cancelled: 'Cancelled', completed: 'Completed',
};

const Home = () => {
  const navigate = useNavigate();
  const { filteredActivities, setFilters, applyFilters } = useActivityStore();
  const { saveActivity, unsaveActivity, isActivitySaved } = useUserStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = () => {
    const f: Record<string, string> = {};
    if (searchTerm) f.search = searchTerm;
    if (selectedCity) f.city = selectedCity;
    if (selectedType) f.type = selectedType;
    setFilters(f as any);
    applyFilters();
  };

  const handleCategoryPill = (value: string) => {
    setSelectedType(value);
    setFilters({ type: value as any });
    applyFilters();
  };

  const getPricingNote = (activity: Activity) => {
    if (!activity.pricePerPerson) return null;
    const save = activity.regularPrice
      ? (activity.regularPrice - activity.pricePerPerson) * activity.totalSpots
      : null;
    let note = `CHF ${activity.pricePerPerson}/person`;
    if (save) note += ` · Save CHF ${save}`;
    return note;
  };

  const handleSaveToggle = (e: React.MouseEvent, activityId: number) => {
    e.stopPropagation();
    if (isActivitySaved(activityId)) {
      unsaveActivity(activityId);
    } else {
      saveActivity(activityId);
    }
  };

  return (
    <div className="pb-16">
      {/* ── Hero - Minimalist ──────────────────────────────────────── */}
      <section className="relative -mx-4 overflow-hidden min-h-[85vh] flex items-center">
        {/* Background Image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80"
            alt="Live event crowd"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/70" />
        </div>

        {/* Content - Better spacing */}
        <div className="relative w-full px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              {/* Badge - Cleaner */}
              <div>
                <span className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-8">
                  Switzerland's group activity platform
                </span>
                
                {/* Heading - More space */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight mb-8">
                  Find your next<br />
                  group adventure
                </h1>
                
                {/* Subheading - Better readability */}
                <p className="text-white/90 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                  Concerts, trips, sports events and more — join a group, share the experience, split the ticket.
                </p>
              </div>

              {/* Search bar - Cleaner design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl max-w-4xl mx-auto"
              >
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 px-6 py-4 outline-none text-sm font-medium rounded-xl focus:bg-gray-50 transition-colors"
                />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-6 py-4 text-sm outline-none cursor-pointer font-medium hover:bg-gray-100 transition-colors"
                >
                  <option value="">All Cities</option>
                  {['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl transition-all text-sm shadow-sm hover:shadow-md hover:scale-105"
                >
                  Search
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Main content - Better spacing ──────────────────────────── */}
      <div className="py-16 space-y-12">
        {/* Category pills - Cleaner */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryPill(cat.value)}
              className={`shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all border ${
                selectedType === cat.value
                  ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 shadow-sm'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Section header - Better spacing */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              Activities
            </h2>
            <p className="text-base font-medium text-gray-500">
              {filteredActivities.length} available
            </p>
          </div>
          
          {/* View Toggle - Minimalist */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Map
            </button>
          </div>
        </div>

        {/* Map or List View */}
        {viewMode === 'map' ? (
          <MapView
            activities={filteredActivities}
            onActivityClick={(activityId) => navigate(`/activities/${activityId}`)}
          />
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No activities found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity, index) => {
              const pricingNote = getPricingNote(activity);
              const pct = (activity.spotsTaken / activity.totalSpots) * 100;
              const spotsLeft = activity.totalSpots - activity.spotsTaken;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  className="group relative rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col border border-gray-200"
                >
                  {/* Image */}
                  {activity.imageUrl && (
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      
                      {/* Overlays */}
                      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm ${STATUS_STYLES[activity.status]}`}>
                          {STATUS_LABELS[activity.status]}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl drop-shadow-lg">
                            {CATEGORIES.find(c => c.value === activity.type)?.icon ?? '✦'}
                          </span>
                          <button
                            onClick={(e) => handleSaveToggle(e, activity.id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all shadow-sm"
                          >
                            <svg className="w-4 h-4 text-gray-900" fill={isActivitySaved(activity.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content - Better spacing */}
                  <div className="p-6 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>

                  {/* Bottom meta - Cleaner */}
                  <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 gap-4">
                      <span className="flex items-center gap-2 truncate font-medium">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {activity.city}
                      </span>
                      <span className="flex items-center gap-2 shrink-0 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(activity.date).toLocaleDateString('en-CH', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    {/* Spots progress */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-medium">
                        <span>{spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</span>
                        <span>{activity.spotsTaken}/{activity.totalSpots}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            pct >= 80 ? 'bg-red-500' : pct >= 50 ? 'bg-orange-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {pricingNote && (
                      <p className="text-xs text-gray-500 font-medium">🎟 {pricingNote}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

// Made with Bob
