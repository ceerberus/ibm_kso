/**
 * Main App Component
 * Following best practices: routing, layout, demo simulator
 */

import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ActivityDetail from './pages/ActivityDetail';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import { startDemoSimulator } from './utils/demoSimulator';

function App() {
  useEffect(() => {
    // Start demo simulator for realistic activity
    const cleanup = startDemoSimulator();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </motion.main>

      <footer className="bg-white/90 backdrop-blur-sm border-t border-white/50 mt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-extrabold text-lg mb-3 text-gray-900">
                <span>link</span>
                <span style={{ color: '#c5e600' }} className="drop-shadow-sm">up</span>
                <span>.</span>
              </h3>
              <p className="text-gray-600 text-sm">
                Join group activities across Switzerland and share the experience.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-700 uppercase tracking-widest mb-3">Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/" className="hover:text-gray-900 transition-colors">Browse Activities</a></li>
                <li><a href="/profile" className="hover:text-gray-900 transition-colors">My Profile</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-700 uppercase tracking-widest mb-3">Contact</h3>
              <p className="text-gray-600 text-sm">
                info@groupup.ch<br />
                Demo Project — Hackathon 2026
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            &copy; 2026 linkup. Built for Swiss group activities.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
