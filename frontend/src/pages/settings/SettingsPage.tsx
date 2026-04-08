import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Palette,
  Bell,
  User,
  Shield,
  Calendar,
  Settings as SettingsIcon,
  Users,
  Link2,
  Moon,
  MessageSquare,
  Clock,
  CalendarDays,
  Search,
  Menu,
  X,
  Mail,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { authAPI } from '../../services/api';

type SettingsSection = 'display' | 'notifications' | 'account' | 'security' | 'calendar' | 'event-defaults' | 'user-roles' | 'integrations' | 'help';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingsSection>('display');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Account Management local state
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [accountSaved, setAccountSaved] = useState(false);

  // Notification Preferences state
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);

  // Event Defaults state
  const [defaultVisibility, setDefaultVisibility] = useState('PUBLIC');
  const [defaultReminder, setDefaultReminder] = useState('30');
  const [defaultsSaved, setDefaultsSaved] = useState(false);

  // BUG_010: Compute real user initials
  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // BUG_013–016: Restrict admin-only sections by role
  const isAdminOrHod = user?.role === 'ADMIN' || user?.role === 'HOD';
  const isAdminOnly = user?.role === 'ADMIN';

  // BUG_027-030: Display settings from persistent store
  const {
    darkMode, setDarkMode,
    showDescriptions, setShowDescriptions,
    use24Hour, setUse24Hour,
    firstDayOfWeek, setFirstDayOfWeek,
  } = useSettingsStore();

  const sections = [
    { id: 'display', label: 'Display & Appearance', icon: Palette },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'account', label: 'Account Management', icon: User },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    // BUG_013: Calendar Management — ADMIN / HOD only
    ...(isAdminOrHod ? [{ id: 'calendar', label: 'Calendar Management', icon: Calendar }] : []),
    // BUG_014: Event Defaults — ADMIN / HOD only
    ...(isAdminOrHod ? [{ id: 'event-defaults', label: 'Event Defaults', icon: SettingsIcon }] : []),
    // BUG_015: User Roles — ADMIN only
    ...(isAdminOnly ? [{ id: 'user-roles', label: 'User Roles', icon: Users }] : []),
    // BUG_016: Integrations — ADMIN / HOD only
    ...(isAdminOrHod ? [{ id: 'integrations', label: 'Integrations', icon: Link2 }] : []),
    // BUG_023: Removed "Help & Support" from sidebar (not in approved design)
  ];

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`toggle ${enabled ? 'toggle-active' : 'toggle-inactive'}`}
    >
      <span className={`toggle-dot ${enabled ? 'toggle-dot-active' : 'toggle-dot-inactive'}`} />
    </button>
  );

  const filteredSections = sections.filter(s =>
    searchQuery.trim() === '' ||
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSectionClick = (sectionId: SettingsSection) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'display':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Theme Settings</h3>
              <p className="text-sm text-gray-500 mb-6">Customize how the calendar looks and feels.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Moon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Dark Mode</p>
                      <p className="text-sm text-gray-500">Switch between light and dark themes.</p>
                    </div>
                  </div>
                  <Toggle enabled={darkMode} onChange={setDarkMode} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Show Event Descriptions</p>
                      <p className="text-sm text-gray-500">Display full event descriptions directly in calendar view.</p>
                    </div>
                  </div>
                  <Toggle enabled={showDescriptions} onChange={setShowDescriptions} />
                </div>
              </div>
            </div>

            {/* Time & Date Format */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Time & Date Format</h3>
              <p className="text-sm text-gray-500 mb-6">Set your preferred time and date display options.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Clock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">24-Hour Clock</p>
                      <p className="text-sm text-gray-500">Display time in 24-hour format (e.g., 14:00).</p>
                    </div>
                  </div>
                  <Toggle enabled={use24Hour} onChange={setUse24Hour} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <CalendarDays className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">First Day of Week</p>
                      <p className="text-sm text-gray-500">Choose whether your week starts on Sunday or Monday.</p>
                    </div>
                  </div>
                  <select
                    value={firstDayOfWeek}
                    onChange={(e) => setFirstDayOfWeek(e.target.value as 'sunday' | 'monday')}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                  >
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h3>
            <p className="text-sm text-gray-500 mb-6">Manage how and when you receive notifications.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { label: 'Email Notifications', description: 'Receive notifications via email', enabled: notifEmail, onChange: setNotifEmail },
                { label: 'Push Notifications', description: 'Receive browser push notifications', enabled: notifPush, onChange: setNotifPush },
                { label: 'Event Reminders', description: 'Get reminded before events start', enabled: notifReminders, onChange: setNotifReminders },
                { label: 'Weekly Digest', description: 'Receive a weekly summary of events', enabled: notifDigest, onChange: setNotifDigest },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <Toggle enabled={item.enabled} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'account':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Account Management</h3>
            <p className="text-sm text-gray-500 mb-6">Update your personal information and preferences.</p>

            {accountSaved && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                Profile updated successfully.
              </div>
            )}

            <div className="max-w-xl space-y-6">
              <div>
                <label className="input-label">Display Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={displayName}
                  onChange={e => { setDisplayName(e.target.value); setAccountSaved(false); }}
                />
              </div>
              <div>
                <label className="input-label">Email Address</label>
                <input type="email" className="input-field" value={user?.email || ''} disabled />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact admin to update.</p>
              </div>
              <div>
                <label className="input-label">Department</label>
                <input
                  type="text"
                  className="input-field"
                  value={department}
                  onChange={e => { setDepartment(e.target.value); setAccountSaved(false); }}
                />
              </div>

              <button
                className="btn-primary"
                onClick={() => {
                  if (user) {
                    const newName = displayName.trim() || user.name;
                    const newDept = department.trim() || user.department;
                    setUser({ ...user, name: newName, department: newDept });
                    setAccountSaved(true);

                    // H5: Persist profile to backend (fire-and-forget)
                    const nameParts = newName.split(' ');
                    const first_name = nameParts[0] || '';
                    const last_name = nameParts.slice(1).join(' ') || '';
                    authAPI.updateProfile({ first_name, last_name, department: newDept }).catch(() => {});
                  }
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Security & Privacy</h3>
            <p className="text-sm text-gray-500 mb-6">Manage your security settings and active sessions.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">Change Password</h4>
                <p className="text-sm text-gray-500 mb-4">Update your password regularly for better security.</p>
                <button className="btn-outline">Change Password</button>
              </div>

              <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account.</p>
                <button className="btn-outline">Enable 2FA</button>
              </div>

              <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">Active Sessions</h4>
                <p className="text-sm text-gray-500 mb-4">Manage devices where you're currently logged in.</p>
                <button className="btn-outline">View Sessions</button>
              </div>

              <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">Data & Privacy</h4>
                <p className="text-sm text-gray-500 mb-4">Control your data sharing and privacy preferences.</p>
                <button className="btn-outline">Manage Privacy</button>
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Calendar Management</h3>
            <p className="text-sm text-gray-500 mb-6">Manage department calendars, visibility, and access control.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">Public Calendar</h4>
                <p className="text-sm text-gray-500 mb-3">Visible to all users including students.</p>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">Active</span>
              </div>
              <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">Staff Calendar</h4>
                <p className="text-sm text-gray-500 mb-3">Visible to staff and above only.</p>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">Active</span>
              </div>
              <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">Event Approval Policy</h4>
                <p className="text-sm text-gray-500 mb-3">Lecturer and Instructor events require HOD approval before going live.</p>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">Enforced</span>
              </div>
              <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">Lab Booking Policy</h4>
                <p className="text-sm text-gray-500 mb-3">Only Instructors may schedule lab sessions. Conflicts are auto-detected.</p>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">Enforced</span>
              </div>
            </div>
          </div>
        );

      case 'event-defaults':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Event Defaults</h3>
            <p className="text-sm text-gray-500 mb-6">Configure default values for new events created in the system.</p>
            <div className="max-w-xl space-y-4">
              {defaultsSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                  Event defaults saved.
                </div>
              )}
              <div>
                <label className="input-label">Default Event Visibility</label>
                <select
                  className="input-field"
                  value={defaultVisibility}
                  onChange={(e) => { setDefaultVisibility(e.target.value); setDefaultsSaved(false); }}
                >
                  <option value="PUBLIC">Public — visible to everyone</option>
                  <option value="STAFF_ONLY">Staff Only</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
              <div>
                <label className="input-label">Default Reminder</label>
                <select
                  className="input-field"
                  value={defaultReminder}
                  onChange={(e) => { setDefaultReminder(e.target.value); setDefaultsSaved(false); }}
                >
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="1440">1 day before</option>
                </select>
              </div>
              <button className="btn-primary" onClick={() => setDefaultsSaved(true)}>Save Defaults</button>
            </div>
          </div>
        );

      case 'user-roles':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">User Roles</h3>
            <p className="text-sm text-gray-500 mb-6">Overview of role permissions in the system.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Role</th>
                    <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Create Events</th>
                    <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Approve Events</th>
                    <th className="text-left py-2 text-gray-500 font-semibold">Admin Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { role: 'Admin',            create: '✓', approve: '✓', admin: '✓' },
                    { role: 'HOD',              create: '✓', approve: '✓', admin: '✓' },
                    { role: 'Lecturer',         create: '✓ (pending)',  approve: '—', admin: '—' },
                    { role: 'Instructor',       create: 'Lab only',    approve: '—', admin: '—' },
                    { role: 'Technical Officer',create: '—', approve: '—', admin: '—' },
                    { role: 'Student',          create: '—', approve: '—', admin: '—' },
                  ].map(row => (
                    <tr key={row.role}>
                      <td className="py-3 pr-4 font-medium text-gray-900">{row.role}</td>
                      <td className="py-3 pr-4 text-gray-600">{row.create}</td>
                      <td className="py-3 pr-4 text-gray-600">{row.approve}</td>
                      <td className="py-3 text-gray-600">{row.admin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Integrations</h3>
            <p className="text-sm text-gray-500 mb-6">Connect third-party services with the calendar system.</p>
            <div className="max-w-xl space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Google Calendar Sync</p>
                  <p className="text-sm text-gray-500">Sync events with Google Calendar.</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-600">Coming soon</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications (SMTP)</p>
                  <p className="text-sm text-gray-500">Send automated event emails to users.</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-600">Coming soon</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Admin</h3>
            <p className="text-sm text-gray-500 mb-6">Need help? Reach out to the system administrator directly.</p>
            {/* BUG_022: Added contact email for admin */}
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Administrator</p>
                  <a
                    href="mailto:admin@department.edu"
                    className="text-sm text-primary hover:underline"
                  >
                    admin@department.edu
                  </a>
                </div>
              </div>
              <p className="text-xs text-gray-400">Response time is typically within 1–2 business days.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[270px] bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar header - mobile close */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 lg:hidden">
          <span className="font-semibold text-gray-900">Settings</span>
          <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id as SettingsSection)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                  ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main area (navbar + content) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side */}
            <div className="flex items-center gap-3">
              {/* Hamburger - mobile only */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold text-lg text-gray-900">Settings</span>
              </Link>
            </div>

            {/* Search - centered */}
            <div className="hidden sm:block relative w-72 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all"
              />
            </div>

            {/* Right side */}
            {/* BUG_026: Removed bell icon from Settings header (not in approved design) */}
            <div className="flex items-center gap-3">
              {/* BUG_010 & BUG_011 & BUG_025: Real initials + clickable avatar → profile, style matches main Header */}
              <button
                onClick={() => navigate('/profile')}
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold hover:ring-2 hover:ring-primary/30 transition-all"
                title="View profile"
              >
                {userInitials}
              </button>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
