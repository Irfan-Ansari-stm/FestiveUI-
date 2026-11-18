'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { BarChart3, Activity, Zap, Cpu, ArrowUpRight } from 'lucide-react';

export default function AnalyticsPage() {
  const { can } = useAuth();

  if (!can('analytics.view')) {
    return <UnauthorizedView requiredPermission="analytics.view" />;
  }

  const frameworks = [
    { name: 'React / Next.js', percent: 64, color: 'bg-blue-500' },
    { name: 'Vue 3', percent: 18, color: 'bg-emerald-500' },
    { name: 'Angular', percent: 11, color: 'bg-red-500' },
    { name: 'Web Components / Vanilla', percent: 7, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-brand-400" />
          Analytics & Engine Telemetry
        </h1>
        <p className="text-xs text-admin-400 mt-1">
          Animation engine performance benchmarks, 60fps rendering frame drop analysis, and SDK distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5">
          <div className="text-xs text-admin-400 font-medium mb-1">Average Mount Latency</div>
          <div className="text-2xl font-bold text-white font-mono">1.84 ms</div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <Zap className="w-3.5 h-3.5" /> High-speed DOM mounting
          </div>
        </div>

        <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5">
          <div className="text-xs text-admin-400 font-medium mb-1">Animation Frame Rate</div>
          <div className="text-2xl font-bold text-white font-mono">59.8 FPS</div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <Activity className="w-3.5 h-3.5" /> Zero dropped physics frames
          </div>
        </div>

        <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5">
          <div className="text-xs text-admin-400 font-medium mb-1">Engine Core Size</div>
          <div className="text-2xl font-bold text-white font-mono">14.2 KB</div>
          <div className="text-[11px] text-blue-400 mt-2 font-mono">
            Brotli compressed runtime
          </div>
        </div>
      </div>

      {/* Framework Share */}
      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">Framework SDK Adoption</h2>
        <div className="space-y-4">
          {frameworks.map((fw) => (
            <div key={fw.name}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-white">{fw.name}</span>
                <span className="font-mono text-admin-400">{fw.percent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-admin-950 overflow-hidden">
                <div style={{ width: `${fw.percent}%` }} className={`h-full ${fw.color} rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
