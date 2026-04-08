import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { canApproveEvents, isStaffOrAdmin } from './utils/permissions';
import type { UserRole } from './types';
import { BookOpen, Mail, MessageSquare, HelpCircle, FileText, Users, MapPin, Megaphone, BarChart3, Shield, Calendar as CalendarIcon } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyCodePage from './pages/auth/VerifyCodePage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import PasswordSuccessPage from './pages/auth/PasswordSuccessPage';
import VerificationErrorPage from './pages/auth/VerificationErrorPage';

// Event Pages
import AddEventPage from './pages/events/AddEventPage';
import EditEventPage from './pages/events/EditEventPage';
import EventDetailsPage from './pages/events/EventDetailsPage';

// Main Pages
import { DashboardPage } from './pages/dashboard';
import { CalendarPage } from './pages/calendar';
import { TasksPage } from './pages/tasks';
import { NotificationsPage } from './pages/notifications';
import { SettingsPage } from './pages/settings';
import { ProfilePage } from './pages/profile';
import { ApprovalsPage } from './pages/approvals';

// Layout
import { Layout } from './components/layout';

import './index.css';

/** Redirects unauthenticated users to /login */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Redirects already-logged-in users away from auth pages */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/**
 * Role-protected route.
 * allowedRoles: explicit list — OR —
 * requireStaff: any staff-like role — OR —
 * requireApprover: only ADMIN / HOD
 */
interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireStaff?: boolean;
  requireApprover?: boolean;
}

function RoleRoute({ children, allowedRoles, requireStaff, requireApprover }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  let allowed = true;
  if (allowedRoles) {
    allowed = user ? allowedRoles.includes(user.role) : false;
  } else if (requireApprover) {
    allowed = canApproveEvents(user);
  } else if (requireStaff) {
    allowed = isStaffOrAdmin(user);
  }

  if (!allowed) {
    // Silently redirect to dashboard instead of showing a blank/error page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        {/* ── Public Auth Routes ──────────────────────────────────────── */}
        <Route path="/login"             element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register"          element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password"   element={<ForgotPasswordPage />} />
        <Route path="/verify-code"       element={<VerifyCodePage />} />
        <Route path="/reset-password"    element={<ResetPasswordPage />} />
        <Route path="/password-success"  element={<PasswordSuccessPage />} />
        <Route path="/verification-error" element={<VerificationErrorPage />} />

        {/* ── Protected Routes (all authenticated users) ──────────────── */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout><DashboardPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/calendar" element={
          <PrivateRoute>
            <Layout><CalendarPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/tasks" element={
          <PrivateRoute>
            <Layout><TasksPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/notifications" element={
          <PrivateRoute>
            <Layout><NotificationsPage /></Layout>
          </PrivateRoute>
        } />

        {/* ── Role-restricted: Approvals — ADMIN / HOD only */}
        <Route path="/approvals" element={
          <RoleRoute requireApprover>
            <Layout><ApprovalsPage /></Layout>
          </RoleRoute>
        } />

        {/* ── Event Pages (standalone, no sidebar) ────────────────────── */}
        <Route path="/add-event" element={
          <PrivateRoute><AddEventPage /></PrivateRoute>
        } />
        <Route path="/edit-event/:id" element={
          <PrivateRoute><EditEventPage /></PrivateRoute>
        } />
        <Route path="/event/:id" element={
          <PrivateRoute><EventDetailsPage /></PrivateRoute>
        } />

        {/* ── Settings & Profile ───────────────────────────────────────── */}
        <Route path="/settings" element={
          <PrivateRoute><SettingsPage /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />

        {/* ── Help & Support ───────────────────────────────────────────── */}
        <Route path="/help" element={
          <PrivateRoute>
            <Layout>
              <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Help &amp; Support</h1>
                <p className="text-gray-500 mb-8">Find answers or get in touch with your department administrator.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="card p-5">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">User Guide</h2>
                    <p className="text-sm text-gray-500">Learn how to use the SE Department Calendar system.</p>
                  </div>
                  <div className="card p-5">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">Contact Admin</h2>
                    <p className="text-sm text-gray-500">Reach out to your department administrator for assistance.</p>
                  </div>
                  <div className="card p-5">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">FAQs</h2>
                    <p className="text-sm text-gray-500">Frequently asked questions about events, calendars and tasks.</p>
                  </div>
                  <div className="card p-5">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">Report an Issue</h2>
                    <p className="text-sm text-gray-500">Found a bug? Let your administrator know.</p>
                  </div>
                </div>
              </div>
            </Layout>
          </PrivateRoute>
        } />

        {/* ── BUG_034: Staff routes (Documents, Attendance, Venues, Announcements, Reports) */}
        {([
          { path: '/documents',     icon: FileText,   title: 'Documents',     desc: 'Access and manage department documents.' },
          { path: '/attendance',    icon: Users,      title: 'Attendance',    desc: 'View and record student attendance.' },
          { path: '/venues',        icon: MapPin,     title: 'Venues',        desc: 'Manage rooms and lab bookings.' },
          { path: '/announcements', icon: Megaphone,  title: 'Announcements', desc: 'Post and view department announcements.' },
          { path: '/reports',       icon: BarChart3,  title: 'Reports',       desc: 'View analytics and generate reports.' },
        ] as { path: string; icon: any; title: string; desc: string }[]).map(({ path, icon: Icon, title, desc }) => (
          <Route key={path} path={path} element={
            <PrivateRoute>
              <Layout>
                <div className="p-6 max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
                    <p className="text-sm">This section is coming soon.</p>
                  </div>
                </div>
              </Layout>
            </PrivateRoute>
          } />
        ))}

        {/* ── Admin-only routes: User Roles & Calendar Management ─────── */}
        <Route path="/user-roles" element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <Layout>
              <div className="p-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Roles</h1>
                    <p className="text-sm text-gray-500">Overview of role permissions in the system.</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-x-auto">
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
                        { role: 'Admin',             create: '✓',            approve: '✓', admin: '✓' },
                        { role: 'HOD',               create: '✓',            approve: '✓', admin: '✓' },
                        { role: 'Lecturer',          create: '✓ (pending)',   approve: '—', admin: '—' },
                        { role: 'Instructor',        create: 'Lab only',      approve: '—', admin: '—' },
                        { role: 'Technical Officer', create: '—',            approve: '—', admin: '—' },
                        { role: 'Student',           create: '—',            approve: '—', admin: '—' },
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
            </Layout>
          </RoleRoute>
        } />

        <Route path="/calendar-management" element={
          <RoleRoute allowedRoles={['ADMIN', 'HOD']}>
            <Layout>
              <div className="p-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Calendar Management</h1>
                    <p className="text-sm text-gray-500">Manage department calendars, visibility, and access control.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Public Calendar',       desc: 'Visible to all users including students.',                          badge: 'Active',   color: 'bg-emerald-100 text-emerald-700' },
                    { title: 'Staff Calendar',        desc: 'Visible to staff and above only.',                                  badge: 'Active',   color: 'bg-emerald-100 text-emerald-700' },
                    { title: 'Event Approval Policy', desc: 'Lecturer and Instructor events require HOD approval before going live.', badge: 'Enforced', color: 'bg-blue-100 text-blue-700' },
                    { title: 'Lab Booking Policy',    desc: 'Only Instructors may schedule lab sessions. Conflicts are auto-detected.', badge: 'Enforced', color: 'bg-blue-100 text-blue-700' },
                  ].map(item => (
                    <div key={item.title} className="bg-white p-5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.color}`}>{item.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Layout>
          </RoleRoute>
        } />

        {/* ── Catch-all ───────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
