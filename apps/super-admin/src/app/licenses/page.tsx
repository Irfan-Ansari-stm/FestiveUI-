'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { Award, Key, ShieldCheck, XCircle, RefreshCw } from 'lucide-react';

export default function LicensesPage() {
  const { can } = useAuth();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (can('licenses.view')) {
      loadLicenses();
    }
  }, []);

  const loadLicenses = async () => {
    setLoading(true);
    const res = await apiFetch<any[]>('/admin/licenses');
    if (res.data) {
      setLicenses(res.data);
    }
    setLoading(false);
  };

  const handleRevoke = async (licenseId: string) => {
    const reason = prompt('Enter license revocation reason:', 'License policy violation');
    if (!reason) return;

    const res = await apiFetch(`/admin/licenses/${licenseId}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    if (!res.error) {
      alert('License successfully revoked.');
      loadLicenses();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  if (!can('licenses.view')) {
    return <UnauthorizedView requiredPermission="licenses.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-6 h-6 text-brand-400" />
            Software License Management
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Issued commercial software licenses, domain restrictions, and cryptographic license revocation.
          </p>
        </div>
        <button onClick={loadLicenses} className="p-2 bg-admin-900 border border-admin-800 rounded-lg text-xs flex items-center gap-2 text-admin-300 hover:text-white">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-admin-950 text-admin-400 border-b border-admin-800 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-6">License Key</th>
              <th className="py-3.5 px-6">License Type</th>
              <th className="py-3.5 px-6">Bound Domain</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Issued At</th>
              <th className="py-3.5 px-6 text-right">Revocation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-800/60">
            {licenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-admin-400">
                  No licenses issued yet.
                </td>
              </tr>
            ) : (
              licenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-admin-900/60 transition-colors">
                  <td className="py-4 px-6 font-mono text-brand-400 font-bold">
                    {lic.licenseKey}
                  </td>
                  <td className="py-4 px-6 uppercase font-mono text-[10px] text-admin-300">
                    {lic.licenseType}
                  </td>
                  <td className="py-4 px-6 font-mono text-admin-400">
                    {lic.boundDomain || 'Any Domain (*)'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      lic.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {lic.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-admin-500 text-[11px]">
                    {new Date(lic.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {can('licenses.revoke') && lic.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleRevoke(lic.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-medium"
                      >
                        Revoke License
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
