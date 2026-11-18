'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Key,
  Plus,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function ApiKeysPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeySecret, setNewKeySecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    ApiClient.fetch('/projects')
      .then((projs) => {
        setProjects(projs);
        if (projs.length > 0) {
          setSelectedProjectId(projs[0].id);
          fetchKeys(projs[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchKeys = (projId: string) => {
    setLoading(true);
    ApiClient.fetch(`/projects/${projId}/api-keys`)
      .then((keys) => {
        setApiKeys(keys);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProjectId(id);
    setNewKeySecret(null);
    fetchKeys(id);
  };

  const handleGenerate = async () => {
    if (!selectedProjectId) return;
    try {
      const res = await ApiClient.fetch(`/projects/${selectedProjectId}/api-keys`, {
        method: 'POST',
        body: JSON.stringify({ name: 'Live Production Key' })
      });
      setNewKeySecret(res.secretKey);
      fetchKeys(selectedProjectId);
    } catch (err: any) {
      alert(err.message || 'Failed to generate API key');
    }
  };

  const handleRevoke = async (keyId: string) => {
    if (!confirm('Revoking this key will immediately block API calls from clients using it. Continue?')) return;
    try {
      await ApiClient.fetch(`/projects/${selectedProjectId}/api-keys/${keyId}`, { method: 'DELETE' });
      fetchKeys(selectedProjectId);
    } catch (err: any) {
      alert(err.message || 'Failed to revoke key');
    }
  };

  const handleRotate = async (keyId: string) => {
    try {
      const res = await ApiClient.fetch(`/projects/${selectedProjectId}/api-keys/${keyId}/rotate`, { method: 'POST' });
      setNewKeySecret(res.secretKey);
      fetchKeys(selectedProjectId);
    } catch (err: any) {
      alert(err.message || 'Failed to rotate key');
    }
  };

  const copyKey = () => {
    if (!newKeySecret) return;
    navigator.clipboard.writeText(newKeySecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard Overview
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">API Keys & Access Control</h1>
        <p className="text-slate-400 text-sm mt-1">
          Cryptographically hashed API keys for client-side and server-side SDK authorization.
        </p>
      </div>

      {/* Select Project Header */}
      <div className="p-6 rounded-2xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Select Project</label>
          <select
            value={selectedProjectId}
            onChange={handleProjectChange}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-border text-white text-xs font-semibold focus:outline-none focus:border-primary-500 w-64"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Generate New Key
        </button>
      </div>

      {/* New Key Alert */}
      {newKeySecret && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800 text-xs text-amber-200 space-y-3">
          <div className="flex items-center justify-between font-bold text-amber-400">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Copy your new secret key! It will not be shown again.
            </span>
            <button
              onClick={copyKey}
              className="flex items-center gap-1 text-white bg-amber-800/80 px-2.5 py-1 rounded-lg text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Key'}
            </button>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-amber-300 break-all select-all border border-amber-900/50">
            {newKeySecret}
          </div>
        </div>
      )}

      {/* Keys Table */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-slate-950/40">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Active Project Keys</span>
          <span className="text-xs text-slate-500 font-mono">Domain whitelisting enabled</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading keys...</div>
        ) : apiKeys.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No keys generated for this project.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-border bg-slate-950/60">
              <tr>
                <th className="p-4 font-semibold">Key Name</th>
                <th className="p-4 font-semibold">Key Prefix</th>
                <th className="p-4 font-semibold">Created</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-slate-300">
              {apiKeys.map((k) => (
                <tr key={k.id} className="hover:bg-surfaceHover/50">
                  <td className="p-4 font-bold text-white">{k.name}</td>
                  <td className="p-4 font-mono text-primary-400 font-semibold">{k.keyPrefix}...</td>
                  <td className="p-4 text-slate-400">{new Date(k.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        k.revoked
                          ? 'bg-red-950/60 text-red-400 border border-red-800'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {k.revoked ? 'REVOKED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {!k.revoked && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRotate(k.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-950"
                          title="Rotate"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRevoke(k.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-950"
                          title="Revoke"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
