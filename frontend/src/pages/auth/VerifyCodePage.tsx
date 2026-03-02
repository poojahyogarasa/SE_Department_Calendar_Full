import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newCode = [...code];
    pastedData.split('').forEach((char, i) => {
      if (i < 4) newCode[i] = char;
    });
    setCode(newCode);
    const nextEmpty = Math.min(pastedData.length, 3);
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp: fullCode,
      });

      setIsLoading(false);
      navigate('/reset-password', { state: { email } });
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Invalid or expired code');
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) return;

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setTimeLeft(59);
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend code. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main content — vertically and horizontally centered */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Enter the verification code
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              We sent a 4-digit code to your email for password<br />recovery.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP inputs */}
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
              ))}
            </div>

            {/* Timer + Resend */}
            <div className="flex items-center justify-between text-sm px-1">
              <span className="text-gray-500">
                Code expires in:{' '}
                <span className="font-medium text-gray-700">{formatTime(timeLeft)}</span>
              </span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={timeLeft > 0}
                className={`font-medium transition-colors ${
                  timeLeft > 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-primary hover:text-primary-600 cursor-pointer'
                }`}
              >
                Resend code
              </button>
            </div>

            {/* Verify button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full btn-lg"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
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
