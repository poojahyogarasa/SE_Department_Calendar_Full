import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  Bell,
  Settings,
  Search,
  Plus,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { getInboxNotifications } from '../../utils/storage';

interface HeaderProps {
  onNewEvent?: () => void;
}

function getUnreadCount(userId?: string): number {
  try {
    return userId ? getInboxNotifications(userId).filter(n => !n.read).length : 0;
  } catch {
    return 0;
  }
}

export default function Header({ onNewEvent }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(() => getUnreadCount(user?.id));
  const menuRef = useRef<HTMLDivElement>(null);

  // Re-compute unread count whenever route changes (e.g. returning from /notifications)
  useEffect(() => {
    setUnreadCount(getUnreadCount(user?.id));
  }, [location.pathname, user?.id]);

  // Also update in real-time via storage events (inbox notification written in same tab)
  useEffect(() => {
    const handleStorage = () => setUnreadCount(getUnreadCount(user?.id));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.id]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /** Human-readable role label */
  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'Admin',
      HOD: 'Head of Dept',
      LECTURER: 'Lecturer',
      INSTRUCTOR: 'Instructor',
      TECHNICAL_OFFICER: 'Tech Officer',
      STAFF: 'Staff',
      STUDENT: 'Student',
    };
    return labels[role] ?? role;
  };

  /** Role badge colour */
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':             return 'bg-red-100 text-red-700 border border-red-200';
      case 'HOD':               return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'LECTURER':          return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'INSTRUCTOR':        return 'bg-cyan-100 text-cyan-700 border border-cyan-200';
      case 'TECHNICAL_OFFICER': return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'STAFF':             return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'STUDENT':
      default:                  return 'bg-green-100 text-green-700 border border-green-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left - Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <span className="text-primary font-semibold text-lg hidden sm:block">Department Calendar</span>
      </Link>

      {/* Center - Search */}
      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, courses, rooms..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* New Event Button */}
        {onNewEvent && (
          <button
            onClick={onNewEvent}
            className="btn-primary hidden sm:flex"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
        )}

        {/* Notifications bell with reactive unread count */}
        <Link
          to="/notifications"
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setTimeout(() => setUnreadCount(getUnreadCount()), 100)}
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="notification-dot">{unreadCount}</span>
          )}
        </Link>

        {/* Settings */}
        <Link to="/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </Link>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-medium text-sm">
                {user?.name
                  ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                  : 'U'}
              </span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-700 leading-none">
                {user?.name || 'User'}
              </p>
              <span className={`inline-block mt-0.5 px-1.5 py-0 text-xs font-medium rounded-full ${getRoleBadgeColor(user?.role || 'STUDENT')}`}>
                {getRoleLabel(user?.role || 'STUDENT')}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="dropdown-menu w-56 animate-slideIn">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(user?.role || 'STUDENT')}`}>
                  {getRoleLabel(user?.role || 'STUDENT')}
                </span>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="dropdown-item flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="dropdown-item flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </div>
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="dropdown-item flex items-center gap-2 w-full text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
