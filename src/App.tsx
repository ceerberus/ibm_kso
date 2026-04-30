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
import CreateActivity from './pages/CreateActivity';
import Profile from './pages/Profile';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/create" element={<CreateActivity />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </motion.main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">GroupSave</h3>
              <p className="text-gray-600 text-sm">
                Save money on group tickets by joining activities across Switzerland.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/" className="hover:text-primary-600">Browse Activities</a></li>
                <li><a href="/create" className="hover:text-primary-600">Create Activity</a></li>
                <li><a href="/profile" className="hover:text-primary-600">My Profile</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <p className="text-gray-600 text-sm">
                Email: info@groupsave.ch<br />
                Demo Project - Hackathon 2026
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>&copy; 2026 GroupSave. Built with ❤️ for Swiss group activities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
