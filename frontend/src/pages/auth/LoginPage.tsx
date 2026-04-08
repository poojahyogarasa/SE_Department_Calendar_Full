import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { canApproveEvents } from '../../utils/permissions';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const successMessage = (location.state as { message?: string } | null)?.message || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Role-based redirect after login — read user from store
      const loggedInUser = useAuthStore.getState().user;
      if (loggedInUser && canApproveEvents(loggedInUser)) {
        navigate('/approvals');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side - Illustration */}
      <div className="auth-left">
        <div className="max-w-md text-white">
          {/* Calendar Illustration */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl mb-8 transform -rotate-3">
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={day} className="text-gray-400 py-1">{day}</div>
              ))}
              {[8, 9, 10, 11, 12, 13, 14].map((day) => (
                <div
                  key={day}
                  className={`py-1 ${day === 13 ? 'bg-blue-500 text-white rounded-full' : 'text-gray-600'}`}
                >
                  {day}
                </div>
              ))}
              {[15, 16, 17, 18, 19, 20, 21].map((day) => (
                <div
                  key={day}
                  className={`py-1 ${day === 18 ? 'bg-yellow-400 text-gray-800 rounded-full' : 'text-gray-600'}`}
                >
                  {day}
                </div>
              ))}
              {[22, 23, 24, 25, 26, 27, 28].map((day) => (
                <div key={day} className="text-gray-600 py-1">{day}</div>
              ))}
              {[29, 30, 31, 32, 33, 34, 35].map((day) => (
                <div key={day} className="text-gray-400 py-1">{day}</div>
              ))}
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 font-heading">
            Streamline Your Academic Journey
          </h1>
          <p className="text-white/80 text-lg">
            Access your examination portal with ease. Manage your academic schedule,
            view results, and stay connected with the University of Jaffna.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-right">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-500">Log in to access your Department Calendar.</p>
          </div>

          {/* Success Message (e.g. after registration) */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Email</label>
              <div className="input-group">
                <Mail className="input-icon w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.edu"
                  className="input-field input-with-icon"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="input-label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-600"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-right"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full btn-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5\" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
