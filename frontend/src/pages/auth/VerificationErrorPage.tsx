import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function VerificationErrorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">

          {/* Warning icon */}
          <div className="flex justify-center mb-5">
            <AlertTriangle className="w-20 h-20 text-red-500" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verification Error!
          </h1>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            Your account verification has failed. Please contact the administrator
            for assistance or to resolve this issue.
          </p>

          {/* Admin email */}
          <a
            href="mailto:admin@example.com"
            className="text-primary font-medium text-sm hover:text-primary-600 transition-colors"
          >
            admin@example.com
          </a>

          {/* Action buttons */}
          <div className="mt-8 space-y-3">
            <a
              href="mailto:admin@example.com"
              className="btn-primary w-full btn-lg inline-flex justify-center"
            >
              Contact Admin
            </a>
            <Link
              to="/"
              className="btn-outline w-full inline-flex justify-center"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 space-x-4">
        <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-gray-600 transition-colors">Consent Preferences</a>
      </footer>
    </div>
  );
}
