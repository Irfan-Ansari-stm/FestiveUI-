'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { Code2, Building, Globe, Key, ShieldCheck, RefreshCw } from 'lucide-react';

export default function DevelopersPage() {
  const { can } = useAuth();
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (can('developers.view')) {
      loadDevelopers();
    }
  }, []);

  const loadDevelopers = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/admin/developers');
    if (res.data?.items) {
      setDevelopers(res.data.items);
    }
    setLoading(false);
  };

  if (!can('developers.view')) {
    return <UnauthorizedView requiredPermission="developers.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-brand-400" />
            Developer Directory
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Registered engineers utilizing FestiveUI framework SDKs, active projects, and issued API keys.
          </p>
        </div>
        <button onClick={loadDevelopers} className="p-2 bg-admin-900 border border-admin-800 rounded-lg text-xs flex items-center gap-2 text-admin-300 hover:text-white">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {developers.map((dev) => (
          <div key={dev.id} className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5 hover:border-admin-700 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                {dev.email.slice(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{dev.profile?.firstName} {dev.profile?.lastName}</div>
                <div className="text-[11px] text-admin-400 font-mono truncate">{dev.email}</div>
              </div>
            </div>

            <div className="text-xs text-admin-400 space-y-1 py-3 border-y border-admin-800/80">
              <div className="flex items-center justify-between">
                <span>Company:</span>
                <span className="text-admin-200 font-medium">{dev.profile?.company || 'Independent'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Projects:</span>
                <span className="text-brand-400 font-mono font-semibold">{dev.projects?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subscription:</span>
                <span className="text-emerald-400 font-semibold">{dev.subscriptions?.[0]?.plan?.name || 'Free Starter'}</span>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-admin-500 font-mono flex items-center justify-between">
              <span>Joined: {new Date(dev.createdAt).toLocaleDateString()}</span>
              <span className="text-emerald-400">● {dev.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
