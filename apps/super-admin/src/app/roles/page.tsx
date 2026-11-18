'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Copy,
  Trash2,
  Edit,
  KeyRound,
  Users,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

export default function RolesPage() {
  const { can } = useAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', slug: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (can('roles.view')) {
      loadRoles();
    }
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    const res = await apiFetch<any[]>('/admin/roles');
    if (res.data) {
      setRoles(res.data);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await apiFetch('/admin/roles', {
      method: 'POST',
      body: JSON.stringify(newRole)
    });
    setIsSubmitting(false);
    if (!res.error) {
      setShowCreateModal(false);
      setNewRole({ name: '', slug: '', description: '' });
      loadRoles();
    } else {
      alert(`Error creating role: ${res.error}`);
    }
  };

  const handleDuplicate = async (roleId: string, roleName: string) => {
    const newName = prompt(`Enter duplicate name for ${roleName}:`, `${roleName} (Copy)`);
    if (!newName) return;

    const res = await apiFetch(`/admin/roles/${roleId}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ name: newName })
    });
    if (!res.error) {
      loadRoles();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleDelete = async (roleId: string, roleName: string) => {
    if (!confirm(`Are you sure you want to permanently delete custom role "${roleName}"?`)) return;
    const res = await apiFetch(`/admin/roles/${roleId}`, {
      method: 'DELETE'
    });
    if (!res.error) {
      loadRoles();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  if (!can('roles.view')) {
    return <UnauthorizedView requiredPermission="roles.view" />;
  }

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-brand-400" />
            Role Management
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Configure system roles, create unlimited custom RBAC roles, clone presets, and adjust permissions.
          </p>
        </div>
        {can('roles.create') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Custom Role
          </button>
        )}
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-admin-900/80 border border-admin-800 rounded-2xl p-6 flex flex-col justify-between hover:border-admin-700 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    role.isSuperAdmin
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : role.isSystem
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {role.isSuperAdmin ? 'SUPER ADMIN (OWNER)' : role.isSystem ? 'SYSTEM PRESET' : 'CUSTOM ROLE'}
                </span>
                <span className="text-xs font-mono text-admin-500">{role.status}</span>
              </div>

              <h2 className="text-base font-bold text-white mb-1">{role.name}</h2>
              <div className="text-[11px] font-mono text-brand-400 mb-2.5">{role.slug}</div>
              <p className="text-xs text-admin-400 leading-relaxed mb-4 line-clamp-2">
                {role.description || 'No role description provided.'}
              </p>

              <div className="flex items-center gap-4 py-3 border-y border-admin-800/80 text-xs text-admin-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-admin-500" />
                  <span>{role._count?.userRoles || 0} Users</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <KeyRound className="w-3.5 h-3.5 text-brand-400" />
                  <span>
                    {role.isSuperAdmin ? 'Full Access (*)' : `${role._count?.permissions || 0} Permissions`}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-2 flex items-center justify-between">
              <Link
                href={`/roles/${role.id}/permissions`}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                Configure Matrix
              </Link>

              <div className="flex items-center gap-1.5">
                {can('roles.duplicate') && (
                  <button
                    onClick={() => handleDuplicate(role.id, role.name)}
                    title="Duplicate Role"
                    className="p-1.5 rounded-lg bg-admin-950 border border-admin-800 hover:border-admin-700 text-admin-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
                {!role.isSystem && !role.isSuperAdmin && can('roles.delete') && (
                  <button
                    onClick={() => handleDelete(role.id, role.name)}
                    title="Delete Custom Role"
                    className="p-1.5 rounded-lg bg-admin-950 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-admin-900 border border-admin-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-400" />
              Create Custom Role
            </h2>
            <p className="text-xs text-admin-400 mb-5">
              Define a new role and grant granular permissions across the 5 access levels.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-admin-300 mb-1.5">Role Name</label>
                <input
                  type="text"
                  required
                  value={newRole.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                    setNewRole({ ...newRole, name, slug: newRole.slug || slug });
                  }}
                  placeholder="e.g. Regional Event Lead"
                  className="w-full px-3.5 py-2 bg-admin-950 border border-admin-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-admin-300 mb-1.5">Role Slug</label>
                <input
                  type="text"
                  required
                  value={newRole.slug}
                  onChange={(e) => setNewRole({ ...newRole, slug: e.target.value })}
                  placeholder="e.g. regional_event_lead"
                  className="w-full px-3.5 py-2 bg-admin-950 border border-admin-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-admin-300 mb-1.5">Description</label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Operational responsibilities for this role..."
                  rows={3}
                  className="w-full px-3.5 py-2 bg-admin-950 border border-admin-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-admin-950 border border-admin-800 text-admin-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
