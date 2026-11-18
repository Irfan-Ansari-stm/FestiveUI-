'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Plus,
  Key,
  Globe2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyResult, setNewKeyResult] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // New project form state
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [framework, setFramework] = useState('react');
  const [domainInput, setDomainInput] = useState('');
  const [creating, setCreating] = useState(false);

  const loadProjects = () => {
    setLoading(true);
    ApiClient.fetch('/projects')
      .then((data) => {
        setProjects(data);
        if (data.length > 0 && !selectedProject) {
          setSelectedProject(data[0]);
          loadApiKeys(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadApiKeys = (projectId: string) => {
    ApiClient.fetch(`/projects/${projectId}/api-keys`)
      .then((keys) => setApiKeys(keys))
      .catch(() => setApiKeys([]));
  };

  const handleSelectProject = (p: any) => {
    setSelectedProject(p);
    setNewKeyResult(null);
    loadApiKeys(p.id);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const domains = domainInput
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      const res = await ApiClient.fetch('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name,
          websiteUrl,
          framework,
          domains
        })
      });

      setCreateModalOpen(false);
      setName('');
      setWebsiteUrl('');
      setDomainInput('');
      loadProjects();
      setSelectedProject(res);
      loadApiKeys(res.id);
    } catch (err: any) {
      alert(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!selectedProject) return;
    try {
      const res = await ApiClient.fetch(`/projects/${selectedProject.id}/api-keys`, {
        method: 'POST',
        body: JSON.stringify({ name: 'Live Production Key' })
      });
      setNewKeyResult(res.secretKey);
      loadApiKeys(selectedProject.id);
    } catch (err: any) {
      alert(err.message || 'Failed to generate key');
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Connected SDK instances will be rejected.')) return;
    try {
      await ApiClient.fetch(`/projects/${selectedProject.id}/api-keys/${keyId}`, {
        method: 'DELETE'
      });
      loadApiKeys(selectedProject.id);
    } catch (err: any) {
      alert(err.message || 'Failed to revoke key');
    }
  };

  const handleRotateKey = async (keyId: string) => {
    try {
      const res = await ApiClient.fetch(`/projects/${selectedProject.id}/api-keys/${keyId}/rotate`, {
        method: 'POST'
      });
      setNewKeyResult(res.secretKey);
      loadApiKeys(selectedProject.id);
    } catch (err: any) {
      alert(err.message || 'Failed to rotate key');
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Projects & API Keys
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your websites, domain restrictions, and secure API keys.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Project List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Projects ({projects.length})</h3>
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelectProject(p)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedProject?.id === p.id
                  ? 'border-primary-500 bg-surface shadow-md glow-primary'
                  : 'border-border bg-slate-950 hover:bg-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-white text-sm truncate">{p.name}</h4>
                <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase font-mono">
                  {p.framework}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{p.websiteUrl || 'No domain linked'}</p>
            </div>
          ))}
        </div>

        {/* Right: Selected Project Details & API Keys (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedProject ? (
            <>
              {/* Project Overview Card */}
              <div className="p-6 rounded-2xl border border-border bg-surface">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedProject.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedProject.websiteUrl}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                    {selectedProject.environment?.toUpperCase() || 'PRODUCTION'}
                  </span>
                </div>

                {/* Domains Whitelist */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-primary-400" /> Whitelisted Origin Domains
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.domains?.map((d: any) => (
                      <span
                        key={d.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-border text-xs font-mono text-slate-300 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {d.domain}
                      </span>
                    ))}
                    {(!selectedProject.domains || selectedProject.domains.length === 0) && (
                      <span className="text-xs text-slate-500">localhost, 127.0.0.1 (Default)</span>
                    )}
                  </div>
                </div>

                {/* API Keys Header & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-festive-gold" />
                    <h4 className="font-bold text-white text-sm">Project API Keys</h4>
                  </div>
                  <button
                    onClick={handleGenerateKey}
                    className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Generate Key
                  </button>
                </div>

                {/* New Key Alert (Shown once) */}
                {newKeyResult && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-xs text-amber-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-amber-400">
                      <span>Copy your new secret key now! It will not be shown again.</span>
                      <button
                        onClick={() => copyKey(newKeyResult)}
                        className="flex items-center gap-1 text-white bg-amber-800/60 px-2 py-0.5 rounded text-[11px]"
                      >
                        {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 font-mono text-amber-300 select-all break-all">
                      {newKeyResult}
                    </div>
                  </div>
                )}

                {/* Keys Table */}
                <div className="mt-4 space-y-2.5">
                  {apiKeys.map((k) => (
                    <div
                      key={k.id}
                      className="p-3 rounded-xl border border-border bg-slate-950 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{k.name}</span>
                          <span className="font-mono text-slate-400">{k.keyPrefix}...</span>
                          {k.revoked && (
                            <span className="px-1.5 py-0.2 rounded bg-red-950/60 text-red-400 border border-red-800 text-[10px]">
                              Revoked
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          Created {new Date(k.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {!k.revoked && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRotateKey(k.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface"
                            title="Rotate Key"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-surface"
                            title="Revoke Key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border text-slate-500 text-xs">
              Select or create a project to manage API keys.
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="font-bold text-white text-base">Create New Website Project</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Diwali Store"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://acme-store.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Framework</label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                >
                  <option value="react">React</option>
                  <option value="next">Next.js</option>
                  <option value="vue">Vue</option>
                  <option value="angular">Angular</option>
                  <option value="vanilla">Vanilla JS</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Allowed Domains (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="myshop.com, staging.myshop.com, localhost"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-surface border border-border text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
