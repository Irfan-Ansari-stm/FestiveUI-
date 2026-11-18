'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { Globe, Key, ShieldCheck, RefreshCw, ExternalLink } from 'lucide-react';

export default function ProjectsPage() {
  const { can } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (can('projects.view')) {
      loadProjects();
    }
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/admin/projects');
    if (res.data?.items) {
      setProjects(res.data.items);
    }
    setLoading(false);
  };

  if (!can('projects.view')) {
    return <UnauthorizedView requiredPermission="projects.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-brand-400" />
            Website Projects & Whitelists
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Registered customer applications, client domain whitelists, and live API key constraints.
          </p>
        </div>
        <button onClick={loadProjects} className="p-2 bg-admin-900 border border-admin-800 rounded-lg text-xs flex items-center gap-2 text-admin-300 hover:text-white">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-admin-950 text-admin-400 border-b border-admin-800 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-6">Project Name / URL</th>
              <th className="py-3.5 px-6">Owner Developer</th>
              <th className="py-3.5 px-6">Allowed Domains</th>
              <th className="py-3.5 px-6">API Keys</th>
              <th className="py-3.5 px-6">Studio Canvas</th>
              <th className="py-3.5 px-6 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-800/60">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-admin-900/60 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-white text-xs">{p.name}</div>
                  <div className="text-[11px] text-admin-400 font-mono mt-0.5">{p.websiteUrl || 'https://localhost:3000'}</div>
                </td>
                <td className="py-4 px-6 text-admin-300">
                  <div>{p.user?.profile?.firstName} {p.user?.profile?.lastName}</div>
                  <div className="text-[10px] text-admin-500 font-mono">{p.user?.email}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {(p.domains || []).map((d: any) => (
                      <span key={d.id} className="px-2 py-0.5 rounded bg-admin-950 border border-admin-800 text-[10px] text-admin-300 font-mono">
                        {d.domain}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-mono text-brand-400 font-semibold text-[11px]">
                    {p.apiKeys?.[0]?.keyPrefix ? `${p.apiKeys[0].keyPrefix}...` : 'Active Key'}
                  </span>
                </td>
                <td className="py-4 px-6 text-admin-400 font-mono">
                  {p.editorDocs?.length || 0} Canvas Documents
                </td>
                <td className="py-4 px-6 text-right font-mono text-[11px] text-admin-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
