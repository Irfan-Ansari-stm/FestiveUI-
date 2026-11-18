'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export function UnauthorizedView({ requiredPermission }: { requiredPermission?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-400">
        <Lock className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">403 – Access Denied</h1>
      <p className="text-sm text-admin-400 max-w-md mb-6 leading-relaxed">
        Your administrator account or currently active preview role lacks the required authorization privilege to view or manage this section.
        {requiredPermission && (
          <span className="block mt-2 font-mono text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
            Missing Permission: {requiredPermission}
          </span>
        )}
      </p>
      <Link
        href="/overview"
        className="px-5 py-2.5 rounded-lg bg-admin-800 hover:bg-admin-700 text-white text-xs font-semibold flex items-center gap-2 border border-admin-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard Overview
      </Link>
    </div>
  );
}
