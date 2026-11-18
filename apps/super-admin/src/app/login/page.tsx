'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@festiveui.com');
  const [password, setPassword] = useState('Festive@2026!');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || 'Failed to authenticate');
    }
  };

  const handleQuickFill = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-admin-950 via-admin-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 shadow-xl shadow-brand-500/20 mb-4 border border-brand-400/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Super Admin Control Panel</h1>
          <p className="text-xs text-admin-400 mt-1.5">
            Enterprise RBAC Management & Platform Operations Suite
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-admin-900/90 border border-admin-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-admin-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-admin-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-admin-950 border border-admin-700 rounded-xl text-sm text-white placeholder-admin-500 focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="admin@festiveui.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-admin-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-admin-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-admin-950 border border-admin-700 rounded-xl text-sm text-white placeholder-admin-500 focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Verifying Security Credentials...' : 'Authenticate & Enter Control Panel'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Select Buttons for instant evaluation */}
          <div className="mt-8 pt-6 border-t border-admin-800">
            <div className="text-[11px] font-semibold text-admin-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-brand-400" />
              Demo Role Accounts
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@festiveui.com', 'Festive@2026!')}
                className="p-2 rounded-lg bg-admin-950 border border-brand-500/30 text-left hover:border-brand-500 transition-colors"
              >
                <div className="font-semibold text-brand-400">Super Admin (Owner)</div>
                <div className="text-[10px] text-admin-400 truncate">admin@festiveui.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('content@festiveui.com', 'Festive@2026!')}
                className="p-2 rounded-lg bg-admin-950 border border-admin-700 text-left hover:border-admin-500 transition-colors"
              >
                <div className="font-semibold text-purple-400">Content Lead</div>
                <div className="text-[10px] text-admin-400 truncate">content@festiveui.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('finance@festiveui.com', 'Festive@2026!')}
                className="p-2 rounded-lg bg-admin-950 border border-admin-700 text-left hover:border-admin-500 transition-colors"
              >
                <div className="font-semibold text-emerald-400">Finance Manager</div>
                <div className="text-[10px] text-admin-400 truncate">finance@festiveui.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('developer@festiveui.com', 'Festive@2026!')}
                className="p-2 rounded-lg bg-admin-950 border border-admin-700 text-left hover:border-admin-500 transition-colors"
              >
                <div className="font-semibold text-blue-400">Developer (Restricted)</div>
                <div className="text-[10px] text-admin-400 truncate">developer@festiveui.com</div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-admin-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          End-to-End Cryptographically Signed Sessions & Append-Only Audit Logging
        </div>
      </div>
    </div>
  );
}
