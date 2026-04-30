import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { useEffect, useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { events } = useEventStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Get some stats for the hero section
  const totalEvents = events.length;
  const totalParticipants = events.reduce((sum, e) => sum + e.joined, 0);

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
          style={{ transform: `translate(${-mousePosition.x}px, ${mousePosition.y}px)` }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
          style={{ transform: `translate(${mousePosition.x}px, ${-mousePosition.y}px)` }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Logo/Brand */}
        <div className="mb-6 animate-fadeInUp">
          <div className="inline-block">
            <h2 className="font-syne text-xl font-extrabold text-white mb-1.5">
              meetup<span className="text-sky-400">.</span>
            </h2>
            <div className="h-0.5 w-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 rounded-full"></div>
          </div>
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl mb-6 animate-fadeInUp"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-white/90">
            {totalEvents} live events • {totalParticipants}+ participants
          </span>
        </div>

        {/* Main heading with gradient text */}
        <h1
          className="font-syne text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight animate-fadeInUp leading-tight"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="text-white">Discover Events.</span>
          <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
            Make Memories.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed animate-fadeInUp"
          style={{ animationDelay: '0.3s' }}
        >
          Join spontaneous activities and meet new people in Zurich.
          <br className="hidden sm:block" />
          Your next adventure starts here.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12 animate-fadeInUp"
          style={{ animationDelay: '0.4s' }}
        >
          <button
            onClick={() => navigate('/discover')}
            className="group relative px-8 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-bold text-base shadow-2xl hover:shadow-sky-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Events
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => navigate('/create')}
            className="px-8 py-3.5 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-base shadow-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/30 transform hover:scale-105 transition-all duration-300"
          >
            Create Event
          </button>
        </div>

        {/* Feature highlights */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fadeInUp"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold mb-1.5 text-sm">Discover</h3>
            <p className="text-slate-400 text-xs">Find events that match your interests</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold mb-1.5 text-sm">Connect</h3>
            <p className="text-slate-400 text-xs">Meet like-minded people</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold mb-1.5 text-sm">Experience</h3>
            <p className="text-slate-400 text-xs">Create unforgettable memories</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
