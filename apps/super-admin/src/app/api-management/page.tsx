'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { Cpu, Key, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

export default function ApiManagementPage() {
  const { can } = useAuth();
  const [data, setData] = useState<any>({ keys: [], logs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (can('api.view')) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/admin/api-management');
    if (res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (!can('api.view')) {
    return <UnauthorizedView requiredPermission="api.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-brand-400" />
            API Keys & Telemetry Management
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Fleet API keys, allowed CORS origins, rate limit counters, and real-time request logs.
          </p>
        </div>
        <button onClick={loadData} className="p-2 bg-admin-900 border border-admin-800 rounded-lg text-xs flex items-center gap-2 text-admin-300 hover:text-white">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* API Keys Fleet */}
      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-brand-400" />
          Active Project API Keys ({(data.keys || []).length})
        </h2>

        <div className="divide-y divide-admin-800/60">
          {(data.keys || []).map((k: any) => (
            <div key={k.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-mono text-brand-400 font-bold flex items-center gap-2">
                  <span>{k.keyPrefix}...••••••••</span>
                  <span className="text-[10px] text-admin-400 font-normal">({k.name})</span>
                </div>
                <div className="text-[11px] text-admin-400 mt-0.5">
                  Project: <strong className="text-admin-200">{k.project?.name}</strong> • Owner: {k.project?.user?.email}
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                  {k.status}
                </span>
                <div className="text-[10px] text-admin-500 mt-1">
                  Reqs: {k.requestsCount || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
