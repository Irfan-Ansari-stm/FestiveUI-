'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, ArrowRight, Layers } from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.fetch('/festivals')
      .then((data) => {
        setFestivals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const festivalIcons: Record<string, string> = {
    diwali: '🪔',
    holi: '🎨',
    christmas: '❄️',
    'new-year': '🎉',
    eid: '🌙',
    'valentines-day': '💖',
    halloween: '🎃',
    'independence-day': '🇮🇳'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Festival & Event Collections
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Celebrate cultural traditions, seasonal holidays, and global milestones with authentic animations and festive styling.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading festival collections...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {festivals.map((fest) => (
            <Link
              key={fest.slug}
              href={`/festivals/${fest.slug}`}
              className="p-6 rounded-2xl border border-border bg-surface hover:border-primary-500/50 glow-card flex flex-col justify-between group"
            >
              <div>
                <div className="text-4xl mb-4">{festivalIcons[fest.slug] || '✨'}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                  {fest.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {fest.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-primary-400 font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  {fest._count?.animations || 0} Animations
                </span>
                <span className="flex items-center gap-1 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
