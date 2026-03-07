import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { canApproveEvents, isStaffOrAdmin } from './utils/permissions';
import type { UserRole } from './types';
import { BookOpen, Mail, MessageSquare, HelpCircle, FileText, Users, MapPin, Megaphone, BarChart3 } from 'lucide-react';

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

        {/* ── Catch-all ───────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
