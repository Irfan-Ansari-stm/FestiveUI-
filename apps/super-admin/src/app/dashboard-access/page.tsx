'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import {
  FolderTree,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Save,
  ShieldCheck,
  Eye,
  RefreshCw,
  Layers,
  Sparkles
} from 'lucide-react';
import { DASHBOARD_TREE, DashboardModuleNode } from '@festiveui/permissions';

export default function DashboardAccessControlPage() {
  const { can, setPreviewRole } = useAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [modules, setModules] = useState<DashboardModuleNode[]>(DASHBOARD_TREE);
  const [allowedModules, setAllowedModules] = useState<Set<string>>(new Set());
  const [allowedPages, setAllowedPages] = useState<Set<string>>(new Set());
  const [initialState, setInitialState] = useState<{ modules: string[]; pages: string[] }>({ modules: [], pages: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (can('dashboard_access.view')) {
      loadRoles();
    }
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    const res = await apiFetch<any[]>('/admin/roles');
    if (res.data && res.data.length > 0) {
      setRoles(res.data);
      // Select first non-super admin role by default
      const defaultRole = res.data.find((r) => !r.isSuperAdmin) || res.data[0];
      setSelectedRoleId(defaultRole.id);
      loadRoleAccess(defaultRole.id, res.data);
    }
    setLoading(false);
  };

  const loadRoleAccess = async (roleId: string, rolesList = roles) => {
    const currentRole = rolesList.find((r) => r.id === roleId);
    if (!currentRole) return;

    if (currentRole.isSuperAdmin) {
      // Super Admin has full tree access
      const allMods = new Set(modules.map((m) => m.slug));
      const allPgs = new Set(modules.flatMap((m) => m.pages.map((p) => p.slug)));
      setAllowedModules(allMods);
      setAllowedPages(allPgs);
      setInitialState({ modules: Array.from(allMods), pages: Array.from(allPgs) });
      return;
    }

    const res = await apiFetch<any[]>(`/admin/roles/${roleId}/dashboard-access`);
    if (res.data && res.data.length > 0) {
      const modSet = new Set<string>();
      const pageSet = new Set<string>();
      for (const item of res.data) {
        if (item.module?.slug) modSet.add(item.module.slug);
        if (item.page?.slug) pageSet.add(item.page.slug);
      }
      setAllowedModules(modSet);
      setAllowedPages(pageSet);
      setInitialState({ modules: Array.from(modSet), pages: Array.from(pageSet) });
    } else {
      // Derive default based on role permissions
      const roleDetail = await apiFetch<any>(`/admin/roles/${roleId}`);
      const perms = new Set((roleDetail.data?.permissions || []).map((p: any) => p.permission.slug));

      const modSet = new Set<string>();
      const pageSet = new Set<string>();
      for (const m of modules) {
        if (perms.has(m.permissionSlug)) {
          modSet.add(m.slug);
        }
        for (const p of m.pages) {
          if (perms.has(p.permissionSlug)) {
            pageSet.add(p.slug);
          }
        }
      }
      setAllowedModules(modSet);
      setAllowedPages(pageSet);
      setInitialState({ modules: Array.from(modSet), pages: Array.from(pageSet) });
    }
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
    loadRoleAccess(roleId);
  };

  const toggleModule = (moduleSlug: string) => {
    const nextMods = new Set(allowedModules);
    const nextPages = new Set(allowedPages);
    const targetMod = modules.find((m) => m.slug === moduleSlug);

    if (nextMods.has(moduleSlug)) {
      nextMods.delete(moduleSlug);
      // Also uncheck child pages
      targetMod?.pages.forEach((p) => nextPages.delete(p.slug));
    } else {
      nextMods.add(moduleSlug);
      // Also check all child pages
      targetMod?.pages.forEach((p) => nextPages.add(p.slug));
    }
    setAllowedModules(nextMods);
    setAllowedPages(nextPages);
  };

  const togglePage = (moduleSlug: string, pageSlug: string) => {
    const nextPages = new Set(allowedPages);
    const nextMods = new Set(allowedModules);

    if (nextPages.has(pageSlug)) {
      nextPages.delete(pageSlug);
    } else {
      nextPages.add(pageSlug);
      nextMods.add(moduleSlug); // Ensure parent module is also enabled
    }
    setAllowedPages(nextPages);
    setAllowedModules(nextMods);
  };

  const handleSaveAccess = async () => {
    const activeRole = roles.find((r) => r.id === selectedRoleId);
    if (activeRole?.isSuperAdmin) {
      alert('Super Admin has immutable full section access.');
      return;
    }

    setSaving(true);
    // Find all module and page records
    const accessPayload: any[] = [];
    for (const m of modules) {
      if (allowedModules.has(m.slug)) {
        accessPayload.push({
          isAllowed: true
        });
      }
    }

    const res = await apiFetch(`/admin/roles/${selectedRoleId}/dashboard-access`, {
      method: 'PUT',
      body: JSON.stringify({ access: accessPayload })
    });
    setSaving(false);

    if (!res.error) {
      alert(`Dashboard section visibility successfully updated for ${activeRole?.name}.`);
    } else {
      alert(`Error updating section access: ${res.error}`);
    }
  };

  if (!can('dashboard_access.view')) {
    return <UnauthorizedView requiredPermission="dashboard_access.view" />;
  }

  const activeRole = roles.find((r) => r.id === selectedRoleId);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-brand-400" />
            Dashboard Access Control
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Hierarchical module & section tree. Control exactly which dashboards, sub-pages, and actions each role can view.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeRole && (
            <button
              onClick={() => setPreviewRole(activeRole.slug)}
              className="px-3.5 py-2 rounded-xl bg-admin-900 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview UI as {activeRole.name}
            </button>
          )}

          {can('dashboard_access.update') && (
            <button
              onClick={handleSaveAccess}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Section Access'}
            </button>
          )}
        </div>
      </div>

      {/* Role Picker Selector Bar */}
      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-xs font-semibold text-admin-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          Target Role:
        </span>
        <select
          value={selectedRoleId}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="bg-admin-950 border border-admin-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.slug}) {r.isSuperAdmin ? '— Full Owner' : ''}
            </option>
          ))}
        </select>
        <span className="text-xs text-admin-500 font-mono">
          {allowedModules.size} of {modules.length} modules enabled for {activeRole?.name}
        </span>
      </div>

      {/* Hierarchical Tree of Modules & Sub-pages */}
      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-admin-800/80">
        {modules.map((mod) => {
          const isModAllowed = allowedModules.has(mod.slug);

          return (
            <div key={mod.slug} className="p-5 space-y-3">
              {/* Module Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleModule(mod.slug)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      isModAllowed
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                        : 'bg-admin-950 border border-admin-700 text-transparent'
                    }`}
                  >
                    ✓
                  </button>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {mod.name}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-admin-950 border border-admin-800 text-brand-400">
                        {mod.route}
                      </span>
                    </div>
                    <div className="text-[11px] text-admin-400 font-mono">
                      Gate: {mod.permissionSlug}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                    isModAllowed
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-admin-950 text-admin-500 border-admin-800'
                  }`}
                >
                  {isModAllowed ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>

              {/* Sub-pages Branch */}
              <div className="pl-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {mod.pages.map((page) => {
                  const isPageAllowed = allowedPages.has(page.slug);
                  return (
                    <div
                      key={page.slug}
                      onClick={() => togglePage(mod.slug, page.slug)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isPageAllowed
                          ? 'bg-brand-500/10 border-brand-500/30 text-white'
                          : 'bg-admin-950 border-admin-800 text-admin-500 hover:border-admin-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xs font-medium truncate">{page.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-admin-400">
                        {page.route}
                      </span>
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
