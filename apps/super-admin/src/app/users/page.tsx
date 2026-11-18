'use client';

import React, { useEffect, useState } from 'react';
import { useAuth, Can } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  UserX,
  MoreVertical,
  Plus,
  RefreshCw,
  AlertTriangle,
  Building,
  Mail,
  Calendar,
  Globe
} from 'lucide-react';

export default function UsersPage() {
  const { can } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (can('users.view')) {
      loadUsers();
      loadRoles();
    }
  }, [roleFilter, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      search,
      role: roleFilter,
      status: statusFilter
    });
    const res = await apiFetch<any>(`/admin/users?${query.toString()}`);
    if (res.data?.items) {
      setUsers(res.data.items);
    }
    setLoading(false);
  };

  const loadRoles = async () => {
    const res = await apiFetch<any[]>('/admin/roles');
    if (res.data) {
      setRoles(res.data);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to change account status to ${newStatus}?`)) return;
    setIsUpdating(true);
    const res = await apiFetch(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, reason: actionReason || 'Admin console action' })
    });
    setIsUpdating(false);
    if (!res.error) {
      loadUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    setIsUpdating(true);
    const res = await apiFetch(`/admin/users/${userId}/roles`, {
      method: 'POST',
      body: JSON.stringify({ roleId })
    });
    setIsUpdating(false);
    if (!res.error) {
      loadUsers();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    if (!confirm('Are you sure you want to remove this role?')) return;
    setIsUpdating(true);
    const res = await apiFetch(`/admin/users/${userId}/roles/${roleId}`, {
      method: 'DELETE'
    });
    setIsUpdating(false);
    if (!res.error) {
      loadUsers();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  if (!can('users.view')) {
    return <UnauthorizedView requiredPermission="users.view" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-400" />
            User Management
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Search accounts, inspect profile details, manage statuses, and assign RBAC roles.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="p-2 bg-admin-900 border border-admin-800 hover:border-admin-700 rounded-lg text-admin-300 hover:text-white transition-colors flex items-center gap-2 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadUsers();
          }}
          className="relative flex-1 min-w-[280px]"
        >
          <Search className="w-4 h-4 text-admin-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, name, company..."
            className="w-full pl-10 pr-4 py-2 bg-admin-950 border border-admin-800 rounded-xl text-xs text-white placeholder-admin-500 focus:outline-none focus:border-brand-500"
          />
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-admin-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-admin-950 border border-admin-800 rounded-lg px-2.5 py-1.5 text-xs text-admin-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-admin-400">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-admin-950 border border-admin-800 rounded-lg px-2.5 py-1.5 text-xs text-admin-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-admin-950 text-admin-400 border-b border-admin-800 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">User / Contact</th>
                <th className="py-3.5 px-6">Assigned Roles</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6">Projects</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-800/60">
              {users.map((u) => {
                const fullName = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() || 'No Name';
                const isSuper = u.userRoles.some((ur: any) => ur.role.isSuperAdmin || ur.role.slug === 'super_admin');

                return (
                  <tr key={u.id} className="hover:bg-admin-900/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-admin-800 border border-admin-700 flex items-center justify-center font-bold text-white text-xs">
                          {u.email.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{fullName}</div>
                          <div className="text-[11px] text-admin-400 font-mono">{u.email}</div>
                          {u.profile?.company && (
                            <div className="text-[10px] text-admin-500 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3" /> {u.profile.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {u.userRoles.map((ur: any) => (
                          <span
                            key={ur.id}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border ${
                              ur.role.isSuperAdmin
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-admin-800 text-admin-200 border-admin-700'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3 text-brand-400" />
                            {ur.role.name}
                            {!ur.role.isSuperAdmin && can('roles.assign_users') && (
                              <button
                                onClick={() => handleRemoveRole(u.id, ur.role.id)}
                                className="text-admin-400 hover:text-red-400 ml-1"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                        {can('roles.assign_users') && (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignRole(u.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="text-[10px] bg-admin-950 border border-admin-800 rounded px-1.5 py-0.5 text-admin-400 hover:text-white cursor-pointer"
                          >
                            <option value="">+ Role</option>
                            {roles
                              .filter((r) => !u.userRoles.some((ur: any) => ur.roleId === r.id))
                              .map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : u.status === 'SUSPENDED'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-admin-300 font-mono">
                      {u._count?.projects || 0} Projects
                    </td>
                    <td className="py-4 px-6 text-admin-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {can('users.suspend') && !isSuper && (
                          u.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleStatusChange(u.id, 'SUSPENDED')}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-medium transition-colors"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium transition-colors"
                            >
                              Reactivate
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
