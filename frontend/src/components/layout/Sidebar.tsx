import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Bell,
  CheckSquare,
  FileText,
  Settings,
  ClipboardCheck,
  Users,
  MapPin,
  Megaphone,
  BarChart3,
  HelpCircle,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEventStore } from '../../stores/useEventStore';
import { isAdmin as checkAdmin, isStaffOrAdmin as checkStaff, canApproveEvents } from '../../utils/permissions';

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const { user } = useAuthStore();
  const { events } = useEventStore();
  const isAdmin = checkAdmin(user);
  const isStaff = checkStaff(user);
  const canApprove = canApproveEvents(user); // Only ADMIN + HOD
  const pendingCount = events.filter(e => e.status === 'PENDING').length;

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/documents', icon: FileText, label: 'Documents', hidden: !isStaff },
  ];

  const staffItems = [
    // Approvals only for HOD / Admin
    { to: '/approvals', icon: ClipboardCheck, label: 'Approvals', badge: pendingCount, hidden: !canApprove },
    { to: '/attendance', icon: Users, label: 'Attendance' },
    { to: '/venues', icon: MapPin, label: 'Venues' },
    { to: '/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  const adminItems = [
    { to: '/user-roles', icon: Shield, label: 'User Roles' },
    { to: '/calendar-management', icon: Calendar, label: 'Calendar Management' },
  ];

  const bottomItems = [
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  const renderNavItem = (item: { to: string; icon: any; label: string; badge?: number; hidden?: boolean }) => {
    if (item.hidden) return null;
    const Icon = item.icon;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          isActive ? 'sidebar-link-active' : 'sidebar-link'
        }
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-4rem)] transition-all duration-300`}>
      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <div className="space-y-1">
          {navItems.map(renderNavItem)}
        </div>

        {/* Staff Section */}
        {isStaff && (
          <>
            <div className="mt-6 mb-2 px-4">
              {!collapsed && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Staff</p>}
            </div>
            <div className="space-y-1">
              {staffItems.map(renderNavItem)}
            </div>
          </>
        )}

        {/* Admin Section */}
        {user?.role === 'ADMIN' && (
          <>
            <div className="mt-6 mb-2 px-4">
              {!collapsed && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</p>}
            </div>
            <div className="space-y-1">
              {adminItems.map(renderNavItem)}
            </div>
          </>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 py-4 px-3">
        <div className="space-y-1">
          {bottomItems.map(renderNavItem)}
        </div>
      </div>
    </aside>
  );
}
