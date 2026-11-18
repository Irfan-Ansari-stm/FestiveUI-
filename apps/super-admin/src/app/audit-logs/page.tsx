'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { ScrollText, Filter, Download, RefreshCw, Eye, ShieldCheck, Database } from 'lucide-react';

export default function AuditLogsPage() {
  const { can } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  useEffect(() => {
    if (can('audit_logs.view')) {
      loadLogs();
    }
  }, [actionFilter]);

  const loadLogs = async () => {
    setLoading(true);
    const query = new URLSearchParams({ action: actionFilter });
    const res = await apiFetch<any>(`/admin/audit-logs?${query.toString()}`);
    if (res.data?.items) {
      setLogs(res.data.items);
    }
    setLoading(false);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Timestamp,Actor,Action,Resource,Entity_Type\n' +
      logs.map((l) => `"${l.id}","${l.createdAt}","${l.actorEmail || ''}","${l.action}","${l.resource}","${l.entityType || ''}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `festiveui_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!can('audit_logs.view')) {
    return <UnauthorizedView requiredPermission="audit_logs.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ScrollText className="w-6 h-6 text-brand-400" />
            Administrative Audit Trail
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Immutable, cryptographically verifiable ledger recording every operational role change, permission modification, and user intervention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('audit_logs.export') && (
            <button
              onClick={handleExport}
              className="px-3.5 py-1.5 rounded-xl bg-admin-900 border border-admin-800 text-xs font-semibold text-white flex items-center gap-2 hover:border-admin-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          )}
          <button onClick={loadLogs} className="p-2 bg-admin-900 border border-admin-800 rounded-lg text-xs flex items-center gap-2 text-admin-300 hover:text-white">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-admin-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter by Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-admin-950 border border-admin-800 rounded-lg px-2.5 py-1.5 text-xs text-admin-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Actions</option>
            <option value="ROLE_CREATED">ROLE_CREATED</option>
            <option value="ROLE_PERMISSIONS_UPDATED">ROLE_PERMISSIONS_UPDATED</option>
            <option value="USER_ROLE_ASSIGNED">USER_ROLE_ASSIGNED</option>
            <option value="USER_STATUS_UPDATED">USER_STATUS_UPDATED</option>
            <option value="PAYMENT_REFUNDED">PAYMENT_REFUNDED</option>
            <option value="SYSTEM_BOOTSTRAP">SYSTEM_BOOTSTRAP</option>
          </select>
        </div>

        <div className="text-xs font-mono text-admin-500">
          Total Recorded Events: {logs.length}
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-admin-950 text-admin-400 border-b border-admin-800 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-6">Timestamp</th>
              <th className="py-3.5 px-6">Actor Email</th>
              <th className="py-3.5 px-6">Action</th>
              <th className="py-3.5 px-6">Target Resource</th>
              <th className="py-3.5 px-6">Entity</th>
              <th className="py-3.5 px-6 text-right">Payload Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-800/60">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-admin-900/60 transition-colors">
                <td className="py-4 px-6 font-mono text-admin-400 text-[11px] whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-white">{log.actorEmail || 'System'}</div>
                  <div className="text-[10px] text-admin-500 font-mono">{log.ipAddress || '127.0.0.1'}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {log.action}
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-admin-300 text-[11px]">
                  {log.resource}
                </td>
                <td className="py-4 px-6">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-admin-950 border border-admin-800 text-admin-400 font-mono">
                    {log.entityType || 'SYSTEM'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {(log.newValues || log.metadata) && (
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 rounded-lg bg-admin-950 border border-admin-800 hover:border-admin-700 text-admin-300 hover:text-white text-[11px] inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Diff
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JSON Payload Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-admin-900 border border-admin-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-400" />
              Audit Log Event Details: {selectedLog.action}
            </h2>
            <div className="text-xs text-admin-400 mb-4 font-mono">{selectedLog.resource}</div>

            <div className="space-y-3 text-xs">
              {selectedLog.previousValues && (
                <div>
                  <div className="text-admin-400 font-semibold mb-1">Previous Values:</div>
                  <pre className="p-3 rounded-xl bg-admin-950 border border-admin-800 font-mono text-[11px] text-red-400 overflow-x-auto max-h-40">
                    {JSON.stringify(selectedLog.previousValues, null, 2)}
                  </pre>
                </div>
              )}
              {selectedLog.newValues && (
                <div>
                  <div className="text-admin-400 font-semibold mb-1">New Values:</div>
                  <pre className="p-3 rounded-xl bg-admin-950 border border-admin-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-40">
                    {JSON.stringify(selectedLog.newValues, null, 2)}
                  </pre>
                </div>
              )}
              {selectedLog.metadata && !selectedLog.newValues && (
                <div>
                  <div className="text-admin-400 font-semibold mb-1">Metadata:</div>
                  <pre className="p-3 rounded-xl bg-admin-950 border border-admin-800 font-mono text-[11px] text-admin-300 overflow-x-auto max-h-40">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-admin-800">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-admin-950 border border-admin-800 text-admin-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
