import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = () => {
    // Navigate to dashboard with search params
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCity) params.set('city', selectedCity);
    navigate(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative w-full px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Heading */}
            <div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-tight tracking-tight mb-8">
                Find your next<br />
                <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  group adventure
                </span>
              </h1>
              
              {/* Subheading */}
              <p className="text-gray-600 text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed">
                Concerts, trips, sports events and more — join a group, share the experience, split the ticket.
              </p>
            </div>

            {/* Search bar - Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-3 flex flex-col md:flex-row gap-3 shadow-2xl border border-white/40 max-w-4xl mx-auto"
            >
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-white text-gray-900 placeholder-gray-400 px-7 py-5 outline-none text-base font-medium rounded-2xl focus:ring-2 focus:ring-sky-400 transition-all shadow-sm"
              />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-white text-gray-900 border-0 rounded-2xl px-7 py-5 text-base outline-none cursor-pointer font-medium focus:ring-2 focus:ring-sky-400 transition-all shadow-sm"
              >
                <option value="">All Cities</option>
                {['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="px-10 py-5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-2xl transition-all text-base shadow-lg hover:shadow-xl hover:scale-105"
              >
                Search
              </button>
            </motion.div>

            {/* Quick action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-8"
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors underline underline-offset-4"
              >
                or browse all activities →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

// Made with Bob
