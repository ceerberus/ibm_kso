import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            isActive('/') ? 'text-primary' : 'text-slate-400'
          }`}
        >
          <span className="text-lg">✦</span>
          <span className="text-[10px] font-medium">Discover</span>
        </Link>
        <Link
          to="/create"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            isActive('/create') ? 'text-primary' : 'text-slate-400'
          }`}
        >
          <span className="text-lg">+</span>
          <span className="text-[10px] font-medium">Create</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            isActive('/profile') ? 'text-primary' : 'text-slate-400'
          }`}
        >
          <span className="text-lg">👤</span>
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}

// Made with Bob
