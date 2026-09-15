import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Upload, Layers, Trophy, User, BookOpen, LogOut, Swords } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { getInitials, getLevelName } from '@/lib/utils';
import { useEffect } from 'react';
import { AITutorSidecar } from './AITutorSidecar';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { logout, isAuthenticated } = useAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('cuba_board_auth_token') || localStorage.getItem('questify_auth_token');
    if (!token && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Study Library', path: '/upload', icon: Upload },
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Battle Arena', path: '/battle', icon: Swords },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-background relative">
      {/* Sidebar (Discord-style: dark, compact, icon-focused) */}
      <aside className="w-64 bg-surface border-r border-white/5 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="text-primary w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-white">Cuba Board</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-surfaceHover rounded-xl">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="truncate max-w-[110px]">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-primary font-medium truncate">Lvl {user.level} {getLevelName(user.level)}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-error transition-colors p-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Floating AI Tutor Sidecar */}
      <AITutorSidecar />
    </div>
  );
};

export default Layout;
