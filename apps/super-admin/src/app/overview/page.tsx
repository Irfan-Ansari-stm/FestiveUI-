'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import {
  Users,
  Code2,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Film,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Cpu,
  Clock,
  UserX,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function OverviewPage() {
  const { can } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (can('overview.view')) {
      loadStats();
    }
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/admin/stats');
    if (res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (!can('overview.view')) {
    return <UnauthorizedView requiredPermission="overview.view" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    );
  }

  const m = data?.metrics || {};

  const statCards = [
    { label: 'Total Users', value: m.totalUsers, icon: Users, color: 'from-blue-600 to-indigo-600', sub: 'Active & registered accounts' },
    { label: 'Active Developers', value: m.activeDevelopers, icon: Code2, color: 'from-purple-600 to-pink-600', sub: 'SDK & API consumers' },
    { label: 'Total Administrators', value: m.totalAdministrators, icon: ShieldCheck, color: 'from-emerald-600 to-teal-600', sub: 'Delegated staff roles' },
    { label: 'Total Roles', value: m.totalRoles, icon: ShieldAlert, color: 'from-amber-600 to-orange-600', sub: 'System & custom roles' },
    { label: 'Active Projects', value: m.activeProjects, icon: Globe, color: 'from-cyan-600 to-blue-600', sub: 'Registered websites' },
    { label: 'Total Animations', value: m.totalAnimations, icon: Film, color: 'from-rose-600 to-red-600', sub: '15 Verified packages' },
    { label: 'Total Purchases', value: m.totalPurchases, icon: ShoppingBag, color: 'from-violet-600 to-purple-600', sub: 'Lifetime commercial orders' },
    { label: 'Monthly Revenue', value: `$${m.monthlyRevenue?.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-600 to-green-600', sub: 'Gross billing ledger' },
    { label: 'Active Subscriptions', value: m.activeSubscriptions, icon: CreditCard, color: 'from-blue-600 to-cyan-600', sub: 'Pro & Business plans' },
    { label: 'API Requests', value: m.apiRequests?.toLocaleString(), icon: Cpu, color: 'from-indigo-600 to-violet-600', sub: 'CDN & runtime telemetry' },
    { label: 'Pending Approvals', value: m.pendingApprovals, icon: Clock, color: 'from-amber-500 to-yellow-600', sub: 'Draft animation packages' },
    { label: 'Suspended Accounts', value: m.suspendedAccounts, icon: UserX, color: 'from-red-600 to-rose-700', sub: 'Security interventions' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-brand-400" />
          Platform Overview & Telemetry
        </h1>
        <p className="text-xs text-admin-400 mt-1">
          Real-time metrics, platform usage trends, and system health status.
        </p>
      </div>

      {/* 12 Required Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5 hover:border-admin-700 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-admin-400">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{card.value ?? 0}</div>
              <div className="text-[11px] text-admin-500 mt-1 truncate">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Growth Trend */}
        <div className="lg:col-span-2 bg-admin-900/80 border border-admin-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Annual Revenue & Registration Trajectory
              </h2>
              <p className="text-xs text-admin-400 mt-0.5">Aggregated monthly recurring billing ledger</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              +32.4% MoM
            </span>
          </div>

          <div className="h-48 flex items-end gap-3 pt-6 pb-2">
            {(data?.revenueTrend || []).map((t: any, i: number) => {
              const heightPercent = Math.min(100, Math.max(15, Math.round((t.revenue / 6000) * 100)));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-admin-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    ${t.revenue}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-amber-500 group-hover:from-brand-500 group-hover:to-amber-400 transition-all shadow-md shadow-brand-500/20"
                  />
                  <span className="text-[10px] text-admin-500 font-medium">{t.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit Trail Snippet */}
        <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              Live Audit Feed
            </h2>
            <a href="/audit-logs" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-56">
            {(data?.recentAuditLogs || []).map((log: any) => (
              <div key={log.id} className="p-2.5 rounded-xl bg-admin-950 border border-admin-800 text-xs">
                <div className="flex items-center justify-between text-admin-400 text-[10px]">
                  <span className="font-mono text-brand-400 font-semibold">{log.action}</span>
                  <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="text-admin-300 text-xs mt-1 truncate">
                  By: {log.actorEmail || 'System'} • {log.resource}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
