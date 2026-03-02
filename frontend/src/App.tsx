import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { canApproveEvents, isStaffOrAdmin } from './utils/permissions';
import type { UserRole } from './types';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyCodePage from './pages/auth/VerifyCodePage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import PasswordSuccessPage from './pages/auth/PasswordSuccessPage';
import VerificationErrorPage from './pages/auth/VerificationErrorPage';

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
 * requireApprover: only ADMIN / HEAD_OF_DEPARTMENT
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

        {/* ── Role-restricted: Approvals — ADMIN / HEAD_OF_DEPARTMENT only */}
        <Route path="/approvals" element={
          <RoleRoute requireApprover>
            <Layout><ApprovalsPage /></Layout>
          </RoleRoute>
        } />

        {/* ── Settings & Profile ───────────────────────────────────────── */}
        <Route path="/settings" element={
          <PrivateRoute><SettingsPage /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />

        {/* ── Catch-all ───────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
