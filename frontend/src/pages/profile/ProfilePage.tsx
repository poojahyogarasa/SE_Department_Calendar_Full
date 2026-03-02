import { useNavigate } from 'react-router-dom';
import { Calendar, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="text-primary font-semibold">Dept Calendar</span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-md mx-auto mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center relative">
          {/* Settings Icon */}
          <button className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>

          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </span>
            </div>
            {/* Online Status */}
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white" />
          </div>

          {/* Name & ID */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">Name / ID</p>
            <p className="font-semibold text-gray-900">
              {user?.name || 'User'} / {user?.id?.slice(-8) || '12345678'}
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-900">{user?.email || 'user@dept.edu'}</p>
          </div>

          {/* Role */}
          <div className="mb-8">
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-semibold text-gray-900">
              {user?.role === 'ADMIN' && 'Administrator'}
              {user?.role === 'HOD' && 'Head of Department'}
              {user?.role === 'LECTURER' && 'Lecturer'}
              {user?.role === 'INSTRUCTOR' && 'Instructor'}
              {user?.role === 'TECHNICAL_OFFICER' && 'Technical Officer'}
              {user?.role === 'STUDENT' && `Student - ${user?.department || 'Computer Engineering'}`}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
