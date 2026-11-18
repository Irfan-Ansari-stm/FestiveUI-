'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import {
  ShieldAlert,
  ArrowLeft,
  Save,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  KeyRound,
  Info
} from 'lucide-react';

export default function RolePermissionMatrixPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { can } = useAuth();

  const [role, setRole] = useState<any | null>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [initialSlugs, setInitialSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (can('roles.view')) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    const [roleRes, permRes] = await Promise.all([
      apiFetch<any>(`/admin/roles/${id}`),
      apiFetch<any>('/admin/permissions')
    ]);

    if (roleRes.data) {
      setRole(roleRes.data);
      const active = new Set<string>();
      for (const p of roleRes.data.permissions || []) {
        if (p.effect === 'ALLOW') {
          active.add(p.permission.slug);
        }
      }
      setSelectedSlugs(new Set(active));
      setInitialSlugs(new Set(active));
    }

    if (permRes.data) {
      setPermissions(permRes.data.permissions || []);
      setGroups(permRes.data.groups || []);
    }

    setLoading(false);
  };

  const togglePermission = (slug: string) => {
    const next = new Set(selectedSlugs);
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }
    setSelectedSlugs(next);
  };

  const selectModuleAll = (moduleSlug: string) => {
    const next = new Set(selectedSlugs);
    permissions.filter((p) => p.module === moduleSlug).forEach((p) => next.add(p.slug));
    setSelectedSlugs(next);
  };

  const deselectModuleAll = (moduleSlug: string) => {
    const next = new Set(selectedSlugs);
    permissions.filter((p) => p.module === moduleSlug).forEach((p) => next.delete(p.slug));
    setSelectedSlugs(next);
  };

  const selectModuleReadOnly = (moduleSlug: string) => {
    const next = new Set(selectedSlugs);
    // Remove all module perms, then add only view/read perms
    permissions.filter((p) => p.module === moduleSlug).forEach((p) => {
      if (p.action === 'view' || p.action === 'read' || p.slug.endsWith('.view')) {
        next.add(p.slug);
      } else {
        next.delete(p.slug);
      }
    });
    setSelectedSlugs(next);
  };

  const selectAll = () => {
    setSelectedSlugs(new Set(permissions.map((p) => p.slug)));
  };

  const deselectAll = () => {
    setSelectedSlugs(new Set());
  };

  const resetChanges = () => {
    setSelectedSlugs(new Set(initialSlugs));
  };

  const hasUnsavedChanges = (() => {
    if (selectedSlugs.size !== initialSlugs.size) return true;
    const current = Array.from(selectedSlugs);
    for (let i = 0; i < current.length; i++) {
      if (!initialSlugs.has(current[i])) return true;
    }
    return false;
  })();

  const handleSave = async () => {
    if (role?.isSuperAdmin) {
      alert('Super Admin permissions are immutable and automatically include full access.');
      return;
    }

    if (!confirm(`Save permission changes for ${role.name}? This will update authorization across all active users with this role.`)) {
      return;
    }

    setSaving(true);
    const payload = Array.from(selectedSlugs).map((slug) => ({
      permissionSlug: slug,
      effect: 'ALLOW' as const
    }));

    const res = await apiFetch(`/admin/roles/${id}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions: payload })
    });
    setSaving(false);

    if (!res.error) {
      setInitialSlugs(new Set(selectedSlugs));
      alert('Role permissions successfully updated and caches invalidated.');
    } else {
      alert(`Error updating permissions: ${res.error}`);
    }
  };

  if (!can('roles.view')) {
    return <UnauthorizedView requiredPermission="roles.view" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/roles"
            className="p-2 rounded-xl bg-admin-900 border border-admin-800 text-admin-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Permission Matrix: {role?.name}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {role?.slug}
              </span>
            </div>
            <p className="text-xs text-admin-400 mt-1">
              Select granular access across all 5 levels (Module, Page, Action, Component, Data).
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <button
              onClick={resetChanges}
              className="px-3 py-1.5 rounded-lg bg-admin-900 border border-admin-800 text-xs text-admin-400 hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

          <button
            onClick={selectAll}
            className="px-3 py-1.5 rounded-lg bg-admin-900 border border-admin-800 text-xs text-admin-300 hover:text-white"
          >
            Select All
          </button>
          <button
            onClick={deselectAll}
            className="px-3 py-1.5 rounded-lg bg-admin-900 border border-admin-800 text-xs text-admin-300 hover:text-white"
          >
            Deselect All
          </button>

          {can('roles.assign_permissions') && (
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 disabled:opacity-40 transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save Matrix Changes'}
            </button>
          )}
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>You have unsaved permission modifications. Remember to click "Save Matrix Changes".</span>
          </div>
          <span className="font-mono font-semibold">{selectedSlugs.size} active permissions selected</span>
        </div>
      )}

      {/* Modules Matrix Accordion */}
      <div className="space-y-4">
        {groups.map((group) => {
          const modulePerms = permissions.filter((p) => p.module === group.slug);
          if (modulePerms.length === 0) return null;

          const activeCount = modulePerms.filter((p) => selectedSlugs.has(p.slug)).length;
          const isFullySelected = activeCount === modulePerms.length;

          return (
            <div
              key={group.slug}
              className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5 shadow-sm space-y-4"
            >
              {/* Group Header & Fast Module Actions */}
              <div className="flex items-center justify-between pb-3 border-b border-admin-800">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs">
                    {activeCount}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      {group.name}
                      <span className="text-[10px] text-admin-500 font-mono font-normal">({group.slug})</span>
                    </h2>
                    <p className="text-[11px] text-admin-400">{group.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    onClick={() => selectModuleAll(group.slug)}
                    className="px-2 py-1 rounded bg-admin-950 border border-admin-800 text-admin-300 hover:text-white"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => selectModuleReadOnly(group.slug)}
                    className="px-2 py-1 rounded bg-admin-950 border border-admin-800 text-admin-300 hover:text-white"
                  >
                    Read Only
                  </button>
                  <button
                    onClick={() => deselectModuleAll(group.slug)}
                    className="px-2 py-1 rounded bg-admin-950 border border-admin-800 text-admin-300 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modulePerms.map((perm) => {
                  const isChecked = selectedSlugs.has(perm.slug);
                  return (
                    <div
                      key={perm.slug}
                      onClick={() => togglePermission(perm.slug)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all select-none ${
                        isChecked
                          ? 'bg-brand-500/10 border-brand-500/40 text-white'
                          : 'bg-admin-950/60 border-admin-800 text-admin-400 hover:border-admin-700 hover:text-admin-200'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-brand-400" />
                        ) : (
                          <Square className="w-4 h-4 text-admin-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-semibold text-white">{perm.name}</span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                              perm.level === 1
                                ? 'bg-blue-500/20 text-blue-400'
                                : perm.level === 2
                                ? 'bg-purple-500/20 text-purple-400'
                                : perm.level === 3
                                ? 'bg-amber-500/20 text-amber-400'
                                : perm.level === 4
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            Lvl {perm.level}
                          </span>
                        </div>
                        <div className="text-[10px] text-brand-400/90 font-mono mb-1">{perm.slug}</div>
                        <div className="text-[11px] text-admin-400 leading-tight">{perm.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
