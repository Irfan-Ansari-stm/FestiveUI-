import React from 'react';
import Link from 'next/link';
import { Sparkles, Globe2, Heart, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Bringing the World's Festivals to Modern Web Apps
        </h1>
        <p className="mt-4 text-slate-400 text-base leading-relaxed">
          FestiveUI was founded on a simple insight: modern websites and apps are too static during the most joyous times of the year.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-border bg-surface glow-card">
          <Globe2 className="w-8 h-8 text-primary-400 mb-4" />
          <h3 className="font-bold text-white text-lg mb-2">Global Cultural Inclusivity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            From Diwali and Holi to Christmas, Eid, Halloween, and New Year, FestiveUI delivers authentic festive decorations crafted with cultural care and attention to detail.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-surface glow-card">
          <Zap className="w-8 h-8 text-festive-gold mb-4" />
          <h3 className="font-bold text-white text-lg mb-2">High-Performance Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built on hardware-accelerated SVG and canvas delta-time physics. Fully zero-dependency, tree-shakable, and automatically paused when outside the viewport.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-surface glow-card">
          <Layers className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="font-bold text-white text-lg mb-2">Visual Drag-and-Drop Studio</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering non-technical creators and developers to visually compose, scale, and adjust festive animations without touching animation math or complex canvas APIs.
          </p>
        </div>
      </div>
    </div>
  );
}
