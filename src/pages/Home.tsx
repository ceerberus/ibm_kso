import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="relative -mx-4 -mt-16 overflow-hidden h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80"
          alt="Live event crowd"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black/10 to-black/55" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full backdrop-blur-md border border-white/30 text-gray-900 text-xs font-bold tracking-widest uppercase mb-6" style={{ backgroundColor: '#c5e600' }}>
                Switzerland's group activity platform
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
                Find your next<br />
                group adventure
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Concerts, trips, sports events and more — join a group, share the experience, split the ticket.
              </p>
            </div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl max-w-3xl mx-auto"
            >
              <input
                type="text"
                placeholder="Search activities..."
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 px-5 py-4 outline-none text-sm font-medium"
                onKeyDown={(e) => e.key === 'Enter' && navigate('/browse')}
              />
              <select
                className="bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-5 py-4 text-sm outline-none cursor-pointer font-medium"
              >
                <option value="">All Cities</option>
                {['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={() => navigate('/browse')}
                className="px-8 py-4 text-gray-900 font-black rounded-xl transition-all text-sm shadow-sm hover:brightness-110"
                style={{ backgroundColor: '#c5e600' }}
              >
                Search
              </button>
            </motion.div>

            {/* Browse all activities button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button
                onClick={() => navigate('/browse')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold text-sm hover:bg-white/25 transition-all"
              >
                Browse all activities
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;

// Made with Bob
