import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Discover from './pages/Discover';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="font-syne text-xl font-extrabold text-dark">meetup.</div>
      <nav className="hidden md:flex gap-1">
        <Link
          to="/"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isActive('/') ? 'bg-sky-50 text-primary' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Discover
        </Link>
        <Link
          to="/create"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isActive('/create') ? 'bg-sky-50 text-primary' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          + Create
        </Link>
      </nav>
      <div
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => navigate('/profile')}
      >
        <span className="hidden md:inline text-sm text-slate-600 font-medium">Anna K.</span>
        <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center text-white text-[11px] font-bold font-syne hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
          AK
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-[1400px] mx-auto bg-white min-h-screen flex flex-col shadow-xl">
        <TopBar />
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <BottomNav />
        <Toast />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

// Made with Bob
