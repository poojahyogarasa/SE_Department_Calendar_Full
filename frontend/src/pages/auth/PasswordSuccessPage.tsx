import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function PasswordSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      {/* Shield icon — standalone, no background circle */}
      <ShieldCheck className="w-16 h-16 text-primary mb-6" strokeWidth={1.5} />

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-3 text-center">
        Password Updated Successfully
      </h1>

      {/* Description */}
      <p className="text-gray-500 text-sm text-center max-w-xs leading-relaxed mb-6">
        Your new password has been created successfully. You can now log in using your new password.
      </p>

      {/* Links */}
      <Link to="/login" className="text-primary font-medium hover:text-primary-600 transition-colors mb-3">
        Go to Login
      </Link>
      <Link to="/" className="text-sm text-primary/70 hover:text-primary transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
