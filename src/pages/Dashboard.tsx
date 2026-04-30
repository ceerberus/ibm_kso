import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const CATEGORY_GRADIENTS: Record<string, string> = {
  travel: 'from-sky-400 to-cyan-500',
  concert: 'from-purple-400 to-pink-500',
  sports: 'from-emerald-400 to-teal-500',
  event: 'from-orange-400 to-amber-500',
  other: 'from-gray-400 to-slate-500',
};

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filteredActivities, setFilters, applyFilters } = useActivityStore();
  const { saveActivity, unsaveActivity, isActivitySaved } = useUserStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    // Apply filters from URL params
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    
    setSearchTerm(search);
    setSelectedCity(city);
    
    const f: Record<string, string> = {};
    if (search) f.search = search;
    if (city) f.city = city;
    if (selectedType) f.type = selectedType;
    
    setFilters(f as any);
    applyFilters();
  }, [searchParams, selectedType, setFilters, applyFilters]);

  const handleCategoryPill = (value: string) => {
    setSelectedType(value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedType('');
    setSearchParams({});
    // Clear all filters by setting empty object
    setFilters({ search: '', city: '', type: '' } as any);
    // Force reapply to show all activities
    setTimeout(() => applyFilters(), 0);
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

  const hasActiveFilters = searchTerm || selectedCity || selectedType;

  return (
    <div className="pb-16">
      {/* Header with glassmorphism */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-sm mb-8 -mx-6 px-6 py-8">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                  Discover Activities
                </h1>
                <p className="text-base font-medium text-gray-600">
                  {filteredActivities.length} activities available
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-1.5 shadow-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                    viewMode === 'map'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Map
                </button>
              </div>
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Active filters:</span>
                {searchTerm && (
                  <span className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium">
                    Search: {searchTerm}
                  </span>
                )}
                {selectedCity && (
                  <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                    City: {selectedCity}
                  </span>
                )}
                {selectedType && (
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                    Type: {selectedType}
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-8">
        {/* Category pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryPill(cat.value)}
              className={`shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-semibold transition-all border backdrop-blur-md ${
                selectedType === cat.value
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 border-transparent text-white shadow-lg'
                  : 'bg-white/80 border-white/40 text-gray-700 hover:text-gray-900 hover:bg-white shadow-md'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Map or List View */}
        {viewMode === 'map' ? (
          <MapView
            activities={filteredActivities}
            onActivityClick={(activityId) => navigate(`/activities/${activityId}`)}
          />
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-white/80 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/40">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-xl font-semibold mb-2">No activities found</p>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity, index) => {
              const pricingNote = getPricingNote(activity);
              const pct = (activity.spotsTaken / activity.totalSpots) * 100;
              const spotsLeft = activity.totalSpots - activity.spotsTaken;
              const gradient = CATEGORY_GRADIENTS[activity.type] || CATEGORY_GRADIENTS.other;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  className="group relative rounded-3xl overflow-hidden bg-white cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col border border-gray-200"
                >
                  {/* Gradient header */}
                  <div className={`relative h-24 bg-gradient-to-br ${gradient} p-5 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl drop-shadow-lg">
                        {CATEGORIES.find(c => c.value === activity.type)?.icon ?? '✦'}
                      </span>
                      <div className="text-white">
                        <div className="text-xs font-semibold opacity-90">{activity.type.toUpperCase()}</div>
                        <div className="text-sm font-bold">{spotsLeft} spots left</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleSaveToggle(e, activity.id)}
                      className="p-2 bg-white rounded-xl hover:scale-110 transition-all shadow-lg"
                    >
                      <svg className="w-5 h-5 text-gray-900" fill={isActivitySaved(activity.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-4">
                      {activity.title}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{activity.city}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{new Date(activity.date).toLocaleDateString('en-CH', { day: 'numeric', month: 'long' })}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">{activity.spotsTaken}/{activity.totalSpots} joined</span>
                      </div>
                    </div>
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

export default Dashboard;

// Made with Bob
