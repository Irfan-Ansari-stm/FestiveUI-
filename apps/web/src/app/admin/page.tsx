'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Sparkles,
  Layers,
  DollarSign,
  TrendingUp,
  Download,
  Eye,
  Calendar,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ApiClient.fetch('/admin/dashboard')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Access denied. Super Admin role required.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading admin metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 rounded-2xl border border-red-800 bg-red-950/40 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-red-200">{error}</p>
        <Link
          href="/login"
          className="inline-block px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs"
        >
          Sign in as Admin
        </Link>
      </div>
    );
  }

  const { metrics, recentUsers, recentOrders } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Nav Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800 text-[10px] font-bold uppercase tracking-wider">
              Super Admin
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Operations Center</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">Platform management, audit controls, and publication analytics</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/festivals"
            className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surfaceHover border border-border text-slate-200 font-semibold"
          >
            Festivals
          </Link>
          <Link
            href="/admin/animations"
            className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surfaceHover border border-border text-slate-200 font-semibold"
          >
            Animations
          </Link>
          <Link
            href="/admin/users"
            className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surfaceHover border border-border text-slate-200 font-semibold"
          >
            Users
          </Link>
          <Link
            href="/admin/audit-logs"
            className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surfaceHover border border-border text-slate-200 font-semibold"
          >
            Audit Logs
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border border-border bg-surface glow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">${metrics?.totalRevenue || 0}</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Live Stripe & Razorpay</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface glow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Developers</span>
            <Users className="w-4 h-4 text-primary-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.totalUsers || 0}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active user accounts</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface glow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Catalog Animations</span>
            <Layers className="w-4 h-4 text-festive-gold" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.totalAnimations || 0}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across {metrics?.totalFestivals || 8} festivals</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface glow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Downloads & Mounts</span>
            <Download className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.totalDownloads || 0}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Live runtime executions</span>
        </div>
      </div>

      {/* Recent Orders & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl border border-border bg-surface">
          <h3 className="font-bold text-white text-base mb-4">Recent Platform Orders</h3>
          <div className="space-y-3">
            {recentOrders?.map((ord: any) => (
              <div key={ord.id} className="p-3 rounded-xl bg-slate-950 border border-border flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono text-white font-bold block">Order #{ord.orderNumber}</span>
                  <span className="text-slate-400">{ord.user?.email}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 block">${Number(ord.totalAmount).toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface">
          <h3 className="font-bold text-white text-base mb-4">Recent Developers Onboarded</h3>
          <div className="space-y-3">
            {recentUsers?.map((u: any) => (
              <div key={u.id} className="p-3 rounded-xl bg-slate-950 border border-border flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{u.profile?.firstName ? `${u.profile.firstName} ${u.profile.lastName || ''}` : u.email}</span>
                  <span className="text-slate-400">{u.email}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase">
                  {u.userRoles?.[0]?.role?.name || 'USER'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
