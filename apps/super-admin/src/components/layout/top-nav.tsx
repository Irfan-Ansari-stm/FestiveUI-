'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Bell, ShieldCheck, Activity, Search, ExternalLink } from 'lucide-react';

export function AdminTopNav() {
  const { user, previewRole } = useAuth();

  return (
    <header className="h-16 bg-admin-950/80 backdrop-blur-md border-b border-admin-800 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Global search */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-admin-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search modules, users, roles, settings..."
          className="w-full pl-9 pr-4 py-2 bg-admin-900 border border-admin-800 rounded-lg text-xs text-white placeholder-admin-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Action shortcuts & indicators */}
      <div className="flex items-center gap-4">
        {/* System operational badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Production RBAC Active
        </div>

        {/* Portal links */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-admin-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>Main Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-admin-500" />
        </a>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-admin-800">
          <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-white">{user?.email?.split('@')[0]}</div>
            <div className="text-[10px] text-admin-400">
              {previewRole ? `Simulating: ${previewRole}` : 'Super Admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
