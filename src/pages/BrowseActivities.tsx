import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityStore } from '../store/activityStore';
import { useUserStore } from '../store/userStore';
import { Activity } from '../types';

const CATEGORIES = [
  { label: 'All', value: '', icon: '✦' },
  { label: 'Travel', value: 'travel', icon: '✈️' },
  { label: 'Concerts', value: 'concert', icon: '🎵' },
  { label: 'Sports', value: 'sports', icon: '⚽' },
  { label: 'Events', value: 'event', icon: '🎪' },
];

const CARD_STYLES: Record<string, { gradient: string; glow: string }> = {
  travel:  { gradient: 'from-blue-100 via-blue-50 to-cyan-50',        glow: 'group-hover:shadow-blue-200/60' },
  concert: { gradient: 'from-violet-100 via-fuchsia-50 to-pink-50',   glow: 'group-hover:shadow-fuchsia-200/60' },
  sports:  { gradient: 'from-green-100 via-emerald-50 to-teal-50',    glow: 'group-hover:shadow-emerald-200/60' },
  event:   { gradient: 'from-orange-100 via-amber-50 to-yellow-50',   glow: 'group-hover:shadow-amber-200/60' },
  other:   { gradient: 'from-gray-100 via-gray-50 to-zinc-50',        glow: 'group-hover:shadow-gray-200/60' },
};

const STATUS_STYLES: Record<string, string> = {
  open:         'bg-green-100 text-green-700 border border-green-200',
  filling_fast: 'bg-orange-100 text-orange-700 border border-orange-200',
  full:         'bg-red-100 text-red-700 border border-red-200',
  cancelled:    'bg-gray-100 text-gray-700 border border-gray-200',
  completed:    'bg-gray-100 text-gray-700 border border-gray-200',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Open', filling_fast: 'Filling Fast', full: 'Full',
  cancelled: 'Cancelled', completed: 'Completed',
};

const BrowseActivities = () => {
  const navigate = useNavigate();
  const { activities, setFilters, applyFilters } = useActivityStore();
  const { saveActivity, unsaveActivity, isActivitySaved } = useUserStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');

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
    <div className="py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          Browse All Activities
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover all available group activities across Switzerland. Join a group, share the experience, split the ticket.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-sm max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search all activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 px-5 py-3 outline-none text-sm font-medium border border-gray-200 rounded-xl"
        />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-5 py-3 text-sm outline-none cursor-pointer font-medium"
        >
          <option value="">All Cities</option>
          {['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="px-8 py-3 text-gray-900 font-black rounded-xl transition-all text-sm shadow-sm hover:brightness-110"
          style={{ backgroundColor: '#c5e600' }}
        >
          Search
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryPill(cat.value)}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
              selectedType === cat.value
                ? 'bg-fuchsia-100 border-fuchsia-400 text-fuchsia-700 shadow-sm shadow-fuchsia-100'
                : 'bg-white/90 border-white text-gray-700 hover:text-gray-900 hover:bg-white shadow-sm backdrop-blur-sm'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => {
          const style = CARD_STYLES[activity.type] ?? CARD_STYLES.other;
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
              className={`group relative rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.glow} flex flex-col border border-gray-200`}
            >
              {/* Image */}
              {activity.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Overlays on image */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${STATUS_STYLES[activity.status]}`}>
                      {STATUS_LABELS[activity.status]}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl drop-shadow-lg" aria-hidden="true">
                        {CATEGORIES.find(c => c.value === activity.type)?.icon ?? '✦'}
                      </span>
                      <button
                        onClick={(e) => handleSaveToggle(e, activity.id)}
                        className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all shadow-sm"
                        title={isActivitySaved(activity.id) ? 'Remove from saved' : 'Save for later'}
                      >
                        <svg className="w-4 h-4 text-fuchsia-600" fill={isActivitySaved(activity.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-5 flex-1">
                {!activity.imageUrl && (
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${STATUS_STYLES[activity.status]}`}>
                      {STATUS_LABELS[activity.status]}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" aria-hidden="true">
                        {CATEGORIES.find(c => c.value === activity.type)?.icon ?? '✦'}
                      </span>
                      <button
                        onClick={(e) => handleSaveToggle(e, activity.id)}
                        className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                        title={isActivitySaved(activity.id) ? 'Remove from saved' : 'Save for later'}
                      >
                        <svg className="w-4 h-4 text-fuchsia-600" fill={isActivitySaved(activity.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
                  {activity.description}
                </p>
              </div>

              {/* Bottom meta strip */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600 gap-4">
                  <span className="flex items-center gap-1.5 truncate">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {activity.city}
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(activity.date).toLocaleDateString('en-CH', { day: 'numeric', month: 'short' })}
                    {activity.time && ` · ${activity.time}`}
                  </span>
                </div>

                {/* Spots progress */}
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>{spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</span>
                    <span>{activity.spotsTaken}/{activity.totalSpots}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        pct >= 80 ? 'bg-red-500' : pct >= 50 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {pricingNote && (
                  <p className="text-xs text-gray-500 truncate">🎟 {pricingNote}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BrowseActivities;

// Made with Bob
