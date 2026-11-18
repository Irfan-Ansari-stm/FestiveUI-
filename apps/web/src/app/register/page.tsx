'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, User, Building } from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await ApiClient.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, company })
      });

      ApiClient.setToken(res.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
          <h1 className="text-2xl font-extrabold text-white">Create Developer Account</h1>
          <p className="text-xs text-slate-400 mt-1">Get immediate access to FestiveUI SDKs & Studio</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Company (Optional)</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Password (min 8 chars)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={8}
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
            {loading ? 'Registering...' : 'Create Free Account'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
