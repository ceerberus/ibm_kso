/**
 * Main App Component
 * Following best practices: routing, layout, demo simulator
 */

import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ActivityDetail from './pages/ActivityDetail';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import { startDemoSimulator } from './utils/demoSimulator';

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    // Start demo simulator for realistic activity
    const cleanup = startDemoSimulator();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      {/* Hide navbar on landing page */}
      {!isLandingPage && <Navbar />}

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={isLandingPage ? '' : 'container mx-auto px-6 pt-6'}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </motion.main>

      {/* Hide footer on landing page */}
      {!isLandingPage && (
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold text-xl mb-4">
                <span className="text-gray-900">link</span>
                <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">up</span>
                <span className="text-gray-400">.</span>
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Join group activities across Switzerland and share the experience.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="/dashboard" className="hover:text-sky-600 transition-colors">Browse Activities</a></li>
                <li><a href="/profile" className="hover:text-indigo-600 transition-colors">My Profile</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                info@linkup.ch<br />
                Demo Project — Hackathon 2026
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; 2026 linkup. Built for Swiss group activities.
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}

export default App;

// Made with Bob
