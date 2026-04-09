import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../images/logo.png';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from URL params if available
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const API_BASE =
        (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "") ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

      const response = await fetch(`${API_BASE}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          Otp: otp
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const API_BASE =
      (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "") ||
      `${window.location.protocol}//${window.location.hostname}:3000`;

    fetch(`${API_BASE}/resend-verification-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Email: email })
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setSuccess(data.message || 'Verification code resent.');
        } else {
          setError(data.message || 'Unable to resend code.');
        }
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center px-6 py-20 animate-in fade-in duration-700">
      {/* Centered Large Logo */}
      <div className="mb-16">
        <Link to="/" className="block group">
          <img 
            src={logo} 
            alt="Visual Art Gallery" 
            className="h-24 md:h-32 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-stone-900 italic">Verify Email</h2>
          <p className="text-stone-600 text-sm mt-4 font-serif">
            We've sent a verification code to your email address
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="border-b border-stone-300 py-2 focus-within:border-stone-900 transition-colors">
            <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-none outline-none text-stone-900 font-serif placeholder:text-stone-300"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="border-b border-stone-300 py-2 focus-within:border-stone-900 transition-colors">
            <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Verification Code</label>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              className="w-full bg-transparent border-none outline-none text-stone-900 font-serif text-center text-2xl tracking-widest"
              placeholder="000000"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-stone-900 text-white text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-stone-500 text-xs font-serif italic mb-4">
            Didn't receive the code?
          </p>
          <button 
            onClick={handleResendOtp}
            disabled={loading}
            className="text-stone-900 underline underline-offset-4 not-italic text-xs hover:text-stone-700 disabled:opacity-50"
          >
            Resend verification code
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-stone-500 text-xs font-serif italic">
            <Link to="/register" className="text-stone-900 underline underline-offset-4 not-italic">Back to registration</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
