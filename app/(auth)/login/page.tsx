'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'email'>('signin');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      if (data?.url) {
        // Force a hard browser navigation — required for OAuth flows in Next.js App Router
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL returned from Supabase');
      }
    } catch (err: any) {
      setError(err.message || 'Error during Google sign in');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ─── Left Panel — Brand ─── */}
      <div
        className="relative lg:w-1/2 flex flex-col justify-between p-10 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #2d1f33 0%, #907E99 60%, #c4afd1 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #f4e4ff, transparent)' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
            <Image src="/Rose-City-Beauty.png" alt="Rose City Beauty" width={36} height={36} className="object-contain" />
          </div>
          <span className="text-white font-semibold tracking-wide text-sm uppercase">Rose City Beauty</span>
        </div>

        {/* Centre copy */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Premium skincare · Bloemfontein</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Your beauty,<br />
              <span className="text-white/70">your ritual.</span>
            </h1>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Sign in to save your checkout details, track your orders, and get early access to new arrivals.
          </p>

          {/* Mini product strip */}
          <div className="flex gap-3 pt-2">
            {['sunscreen-300x300.jpg', 'face-serum-300x300.jpg', 'perfume-300x300.jpg'].map((img) => (
              <div key={img} className="w-14 h-14 rounded-xl overflow-hidden border border-white/20 bg-white/10">
                <Image src={`/${img}`} alt="" width={56} height={56} className="object-cover w-full h-full" />
              </div>
            ))}
            <div className="w-14 h-14 rounded-xl border border-white/20 bg-white/10 flex items-center justify-center">
              <span className="text-white/60 text-xs font-medium">+3</span>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs">© 2024 Rose City Beauty · Bloemfontein, South Africa</p>
        </div>
      </div>

      {/* ─── Right Panel — Auth ─── */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-[#F9F7FB]">
        <div className="w-full max-w-sm space-y-8">

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Welcome back' : 'Sign in with email'}
            </h2>
            <p className="text-gray-500 text-sm">
              {mode === 'signin'
                ? 'Sign in to your Rose City Beauty account'
                : 'Enter your credentials below'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {mode === 'signin' ? (
            <div className="space-y-4">
              {/* Google Button — Primary CTA */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-[#907E99] rounded-xl text-base font-semibold text-[#2d1f33] shadow-md hover:shadow-lg hover:border-[#6b5a7a] hover:bg-[#faf8fc] transition-all duration-200 disabled:opacity-60"
              >
                {googleLoading ? (
                  <svg className="w-5 h-5 animate-spin text-[#907E99]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.62v3.02h3.87c2.26-2.08 3.58-5.14 3.58-8.49z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.09 1.16-3.15 0-5.81-2.13-6.76-4.99H1.27v3.12C3.26 21.31 7.37 24 12 24z" />
                    <path fill="#FBBC05" d="M5.24 14.24a7.16 7.16 0 0 1 0-2.48V8.64H1.27a11.96 11.96 0 0 0 0 6.72l3.97-3.12z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.69 1.27 6.72l3.97 3.12c.95-2.86 3.61-4.99 6.76-4.99z" />
                  </svg>
                )}
                {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-gray-500 text-sm font-medium">or</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              {/* Email option */}
              <button
                onClick={() => setMode('email')}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Sign in with email
              </button>

              {/* Guest option */}
              <div className="text-center pt-3">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-500 hover:text-[#907E99] underline underline-offset-4 transition-colors"
                >
                  Browse as guest without signing in →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#907E99] focus:ring-2 focus:ring-[#907E99]/20 transition-all"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#907E99] focus:ring-2 focus:ring-[#907E99]/20 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #907E99, #2d1f33)' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <div className="flex justify-between text-xs text-gray-400">
                <button type="button" onClick={() => setMode('signin')} className="hover:text-gray-600 underline underline-offset-2">
                  ← Back
                </button>
                <Link href="/forgot-password" className="hover:text-gray-600 underline underline-offset-2">
                  Forgot password?
                </Link>
              </div>
            </form>
          )}

          {/* Register */}
          <p className="text-center text-xs text-gray-400">
            New to Rose City Beauty?{' '}
            <Link href="/register" className="text-[#907E99] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7FB]">
        <div className="w-8 h-8 rounded-full border-2 border-[#907E99] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
