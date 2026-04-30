import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';

export default function Landing() {
  const navigate = useNavigate();
  const { events } = useEventStore();

  // Get some stats for the hero section
  const totalEvents = events.length;
  const totalParticipants = events.reduce((sum, e) => sum + e.joined, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 animate-fadeInUp">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-semibold text-slate-700">
            {totalEvents} live events • {totalParticipants}+ participants
          </span>
        </div>

        {/* Main heading */}
        <h1 
          className="font-syne text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-dark mb-6 tracking-tight animate-fadeInUp leading-tight"
          style={{ animationDelay: '0.1s' }}
        >
          Discover Events.
          <br />
          <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Make Memories.
          </span>
        </h1>

        {/* Subheading */}
        <p 
          className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-fadeInUp"
          style={{ animationDelay: '0.2s' }}
        >
          Join spontaneous activities and meet new people in Zurich
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp"
          style={{ animationDelay: '0.3s' }}
        >
          <button
            onClick={() => navigate('/discover')}
            className="group relative px-10 py-5 bg-dark text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Events
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => navigate('/create')}
            className="px-10 py-5 bg-white text-dark rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-slate-200 hover:border-sky-300"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
