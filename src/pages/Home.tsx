/**
 * Home Page Component
 * Main landing page with activity listings and filters
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityStore } from '../store/activityStore';
import { Activity, ActivityFilters } from '../types';

const Home = () => {
  const navigate = useNavigate();
  const {
    filteredActivities,
    setFilters,
    applyFilters,
  } = useActivityStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = () => {
    const newFilters: Partial<ActivityFilters> = {};
    if (searchTerm) newFilters.search = searchTerm;
    if (selectedCity) newFilters.city = selectedCity;
    if (selectedType) newFilters.type = selectedType as any;
    
    setFilters(newFilters);
    applyFilters();
  };

  const handleActivityClick = (activity: Activity) => {
    navigate(`/activities/${activity.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'filling_fast':
        return 'bg-orange-100 text-orange-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'filling_fast':
        return 'Filling Fast';
      case 'full':
        return 'Full';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getTypeAccent = (type: string) => {
    switch (type) {
      case 'travel':   return { bg: 'bg-sky-50',    text: 'text-sky-700',    badge: 'bg-sky-100 text-sky-700',    icon: '✈️' };
      case 'concert':  return { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', icon: '🎵' };
      case 'sports':   return { bg: 'bg-green-50',  text: 'text-green-700',  badge: 'bg-green-100 text-green-700',  icon: '⚽' };
      case 'event':    return { bg: 'bg-amber-50',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700',  icon: '🎪' };
      default:         return { bg: 'bg-gray-50',   text: 'text-gray-700',   badge: 'bg-gray-100 text-gray-700',    icon: '⭐' };
    }
  };

  const getPricingNote = (activity: Activity) => {
    if (!activity.pricePerPerson) return null;
    const save = activity.regularPrice ? (activity.regularPrice - activity.pricePerPerson) * activity.totalSpots : null;
    let note = `Group ticket: CHF ${activity.pricePerPerson}/person`;
    if (save) note += ` · Save CHF ${save} total (${activity.totalSpots} people)`;
    return note;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-8 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Next Group Adventure
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover concerts, trips, sports events and more across Switzerland — join a group and share the experience
        </p>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              <option value="Zurich">Zurich</option>
              <option value="Geneva">Geneva</option>
              <option value="Basel">Basel</option>
              <option value="Bern">Bern</option>
              <option value="Lausanne">Lausanne</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="travel">Travel</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </motion.div>

      {/* Activities Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Activities ({filteredActivities.length})
          </h2>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">No activities found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity, index) => {
                const accent = getTypeAccent(activity.type);
                const pricingNote = getPricingNote(activity);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleActivityClick(activity)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col"
                  >
                    {/* Coloured type header */}
                    <div className={`${accent.bg} px-6 py-3 flex items-center justify-between`}>
                      <span className={`text-sm font-medium ${accent.text} flex items-center gap-1.5`}>
                        <span>{accent.icon}</span>
                        <span className="capitalize">{activity.type}</span>
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                        {activity.title}
                      </h3>

                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                        {activity.description}
                      </p>

                      <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {activity.city}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(activity.date).toLocaleDateString('en-CH', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {activity.time && <span className="text-gray-400">· {activity.time}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {activity.spotsTaken}/{activity.totalSpots} spots filled
                        </div>
                      </div>

                      {pricingNote && (
                        <p className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-auto">
                          🎟 {pricingNote}
                        </p>
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