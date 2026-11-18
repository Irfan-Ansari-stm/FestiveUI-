'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { Film, CheckCircle2, XCircle, Eye, Sparkles, Filter, Download } from 'lucide-react';

export default function AnimationsPage() {
  const { can } = useAuth();
  const [animations, setAnimations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState('ALL');

  useEffect(() => {
    if (can('animations.view')) {
      loadAnimations();
    }
  }, []);

  const loadAnimations = async () => {
    setLoading(true);
    const res = await apiFetch<any[]>('/admin/animations');
    if (res.data) {
      setAnimations(res.data);
    }
    setLoading(false);
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const res = await apiFetch(`/admin/animations/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify({ status: nextStatus })
    });
    if (!res.error) {
      loadAnimations();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  if (!can('animations.view')) {
    return <UnauthorizedView requiredPermission="animations.view" />;
  }

  const filtered = animations.filter((a) => {
    if (filterState === 'ALL') return true;
    return a.status === filterState;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Film className="w-6 h-6 text-brand-400" />
            Animation Package Management
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Supervise all 15+ framework-independent animation packages, live publication status, and download telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-admin-900 border border-admin-800 rounded-xl p-1 text-xs">
          {['ALL', 'PUBLISHED', 'DRAFT'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterState(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterState === s ? 'bg-brand-600 text-white' : 'text-admin-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-admin-950 text-admin-400 border-b border-admin-800 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-6">Animation / Slug</th>
              <th className="py-3.5 px-6">Festival & Category</th>
              <th className="py-3.5 px-6">License / Pricing</th>
              <th className="py-3.5 px-6">Downloads</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Publication Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-800/60">
            {filtered.map((anim) => (
              <tr key={anim.id} className="hover:bg-admin-900/60 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    {anim.name}
                  </div>
                  <div className="text-[11px] text-admin-400 font-mono mt-0.5">{anim.slug}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-admin-200 font-semibold">{anim.festival?.name || 'General'}</div>
                  <div className="text-[10px] text-admin-400 font-mono">{anim.category?.name || 'Effect'}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    anim.isFree
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {anim.isFree ? 'FREE' : `$${anim.price || 19}`}
                  </span>
                </td>
                <td className="py-4 px-6 text-admin-300 font-mono">
                  {anim.downloadsCount || 0}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    anim.status === 'PUBLISHED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {anim.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {can('animations.publish') && (
                    <button
                      onClick={() => handleTogglePublish(anim.id, anim.status)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        anim.status === 'PUBLISHED'
                          ? 'bg-admin-950 border-admin-700 text-admin-300 hover:text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent'
                      }`}
                    >
                      {anim.status === 'PUBLISHED' ? 'Unpublish' : 'Publish Live'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
