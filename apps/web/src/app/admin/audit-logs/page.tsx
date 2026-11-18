'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, History, Shield, Activity } from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.fetch('/admin/audit-logs')
      .then((data) => {
        setLogs(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Operations
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-white">Administrative Audit Trail</h1>
        <p className="text-xs text-slate-400 mt-1">Immutable security log of role updates, publication events, and key operations</p>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading audit logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border text-slate-500 text-xs">
          No audit entries recorded yet.
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold">Resource</th>
                <th className="p-4 font-semibold">Administrator</th>
                <th className="p-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surfaceHover/50">
                  <td className="p-4">
                    <span className="font-mono font-bold text-primary-400">{log.action}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{log.resource}</td>
                  <td className="p-4 font-medium text-white">{log.user?.email || 'System'}</td>
                  <td className="p-4 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
