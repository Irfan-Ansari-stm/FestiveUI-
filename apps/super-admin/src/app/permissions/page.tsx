'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import {
  KeyRound,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function PermissionsExplorerPage() {
  const { can } = useAuth();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (can('permissions.view')) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [permRes, rolesRes] = await Promise.all([
      apiFetch<any>('/admin/permissions'),
      apiFetch<any[]>('/admin/roles')
    ]);
    if (permRes.data) {
      setPermissions(permRes.data.permissions || []);
      setGroups(permRes.data.groups || []);
    }
    if (rolesRes.data) {
      setRoles(rolesRes.data);
    }
    setLoading(false);
  };

  if (!can('permissions.view')) {
    return <UnauthorizedView requiredPermission="permissions.view" />;
  }

  const filtered = permissions.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesModule = selectedModule === 'all' || p.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-brand-400" />
            Permission Matrix & Architecture
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Authoritative directory of database-driven permissions across all 5 operational abstraction tiers.
          </p>
        </div>
        <Link
          href="/roles"
          className="px-4 py-2 rounded-xl bg-admin-900 border border-admin-800 hover:border-admin-700 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
        >
          <span>Manage Roles</span>
          <ArrowRight className="w-4 h-4 text-brand-400" />
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-admin-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permission slug, name, action..."
            className="w-full pl-10 pr-4 py-2 bg-admin-950 border border-admin-800 rounded-xl text-xs text-white placeholder-admin-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-admin-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Module:</span>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-admin-950 border border-admin-800 rounded-lg px-2.5 py-1.5 text-xs text-admin-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Modules ({permissions.length})</option>
            {groups.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((perm) => (
          <div
            key={perm.slug}
            className="bg-admin-900/80 border border-admin-800 rounded-2xl p-4 flex flex-col justify-between hover:border-admin-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-admin-950 border border-admin-800 text-brand-400">
                  {perm.module}
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    perm.level === 1
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : perm.level === 2
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : perm.level === 3
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : perm.level === 4
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  Level {perm.level}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white mb-0.5">{perm.name}</h2>
              <div className="text-xs font-mono text-admin-400 mb-2">{perm.slug}</div>
              <p className="text-xs text-admin-400 leading-relaxed mb-3">{perm.description}</p>
            </div>

            <div className="pt-2 border-t border-admin-800/80 flex items-center justify-between text-[11px] text-admin-500">
              <span>Action: <strong className="text-admin-300 font-mono">{perm.action || 'view'}</strong></span>
              <span>Enforced by: <strong className="text-brand-400 font-mono">Backend RBAC Guard</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
