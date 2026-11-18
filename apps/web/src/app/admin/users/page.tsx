'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, ShieldCheck, UserCheck, UserX, Shield } from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = () => {
    setLoading(true);
    ApiClient.fetch(`/admin/users?search=${search}`)
      .then((data) => {
        setUsers(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await ApiClient.fetch(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      });
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await ApiClient.fetch(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Operations
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Developer User Management</h1>
          <p className="text-xs text-slate-400 mt-1">Role assignments, account status, and organization directory</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search developers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border text-xs text-white focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading users...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Projects</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-slate-300">
              {users.map((u) => {
                const roleName = u.userRoles?.[0]?.role?.name || 'USER';
                return (
                  <tr key={u.id} className="hover:bg-surfaceHover/50">
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-white block">
                          {u.profile?.firstName ? `${u.profile.firstName} ${u.profile.lastName || ''}` : u.email}
                        </span>
                        <span className="text-slate-500 text-[11px]">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={roleName}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="px-2 py-1 rounded bg-slate-950 border border-border text-white text-xs font-semibold"
                      >
                        <option value="DEVELOPER">DEVELOPER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="USER">USER</option>
                      </select>
                    </td>
                    <td className="p-4 font-semibold text-primary-400">{u._count?.projects || 0}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950/60 text-red-400 border border-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`px-2.5 py-1 rounded border text-[11px] font-semibold ${
                          u.status === 'ACTIVE'
                            ? 'bg-red-950/40 border-red-800 text-red-300 hover:bg-red-900/50'
                            : 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/50'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
