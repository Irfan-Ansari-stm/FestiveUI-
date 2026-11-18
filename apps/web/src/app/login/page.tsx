'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('developer@festiveui.com'); // Pre-filled default dev seed
  const [password, setPassword] = useState('Festive@2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await ApiClient.fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      ApiClient.setToken(res.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-2xl glow-card">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-festive-gold p-0.5 glow-primary mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-festive-gold" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to your FestiveUI developer account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-primary-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
