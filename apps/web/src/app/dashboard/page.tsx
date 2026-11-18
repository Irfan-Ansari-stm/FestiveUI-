'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  Key,
  FolderGit2,
  CreditCard,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ApiClient.fetch('/auth/me').catch(() => null),
      ApiClient.fetch('/projects').catch(() => []),
      ApiClient.fetch('/purchases').catch(() => []),
      ApiClient.fetch('/subscriptions/me').catch(() => null)
    ])
      .then(([u, projs, purchs, sub]) => {
        setUser(u);
        setProjects(projs);
        setPurchases(purchs);
        setSubscription(sub);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Developer Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back, {user?.profile?.firstName || user?.email || 'Developer'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-festive-gold" /> Launch Studio
          </Link>
          <Link
            href="/dashboard/projects"
            className="px-4 py-2 rounded-xl bg-surface hover:bg-surfaceHover border border-border text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Project
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="p-5 rounded-2xl border border-border bg-surface glow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-primary-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{projects.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Connected domains active</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface glow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Plan</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{subscription?.plan?.name || 'Starter Plan'}</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            {subscription?.status || 'Active'}
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface glow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Purchased Licenses</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{purchases.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Verified commercial keys</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface glow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">API Requests</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">4,820</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Of 10,000 monthly limit</span>
        </div>
      </div>

      {/* Main Grid: Projects & Purchased Licenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects Section */}
        <div className="p-6 rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base">Your Website Projects</h3>
            <Link href="/dashboard/projects" className="text-xs font-semibold text-primary-400 hover:underline">
              View All
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-border rounded-xl">
              No projects created yet. Create your first website project.
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-border bg-slate-950 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{p.websiteUrl || 'No domain configured'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase">
                      {p.framework}
                    </span>
                    <Link
                      href={`/dashboard/projects`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchased Licenses Section */}
        <div className="p-6 rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base">Purchased Licenses</h3>
            <Link href="/marketplace" className="text-xs font-semibold text-primary-400 hover:underline">
              Explore Store
            </Link>
          </div>

          {purchases.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-border rounded-xl">
              No commercial animations purchased yet. Free animations can be used immediately.
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.slice(0, 5).map((pur) => (
                <div
                  key={pur.id}
                  className="p-3.5 rounded-xl border border-border bg-slate-950 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono text-emerald-400 block font-bold">
                      {pur.license?.licenseKey || 'Standard License'}
                    </span>
                    <span className="text-[11px] text-slate-400">Order #{pur.order?.orderNumber}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 uppercase">
                    Commercial
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
