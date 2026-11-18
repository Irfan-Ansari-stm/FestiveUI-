'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Sparkles, ArrowLeft, ArrowRight, Eye, Heart, Layers } from 'lucide-react';
import { ApiClient } from '@/lib/api';
import { FestiveAnimation } from '@festiveui/react';

export default function FestivalDetailPage() {
  const { slug } = useParams() as { slug: string };
  const [festival, setFestival] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    ApiClient.fetch(`/festivals/${slug}`)
      .then((data) => {
        setFestival(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading festival collection...</p>
      </div>
    );
  }

  if (!festival) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Festival Not Found</h2>
        <Link href="/festivals" className="text-primary-400 text-sm hover:underline">
          Return to Festivals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/festivals"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Festivals
      </Link>

      {/* Festival Banner Card */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-surface via-slate-900 to-surface p-8 sm:p-12 mb-12 glow-card relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-400 block mb-2">
            Festival Collection
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">{festival.name}</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{festival.description}</p>
        </div>
      </div>

      {/* Linked Animations Grid */}
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-festive-gold" />
        Animations in {festival.name} Collection ({festival.animations?.length || 0})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {festival.animations?.map((anim: any) => (
          <Link
            key={anim.id}
            href={`/marketplace/${anim.slug}`}
            className="group rounded-2xl border border-border bg-surface hover:border-slate-700 p-4 flex flex-col justify-between glow-card"
          >
            <div className="h-44 rounded-xl bg-slate-950 border border-border/80 relative flex items-center justify-center overflow-hidden mb-3.5">
              <FestiveAnimation
                type={anim.slug}
                config={{ position: 'center', size: 80, ...anim.schema?.defaultSettings }}
              />
              <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-slate-300 border border-border">
                {anim.format}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-white text-base group-hover:text-primary-400 transition-colors truncate">
                  {anim.name}
                </h3>
                <span className={`text-xs font-bold ${anim.isFree ? 'text-emerald-400' : 'text-festive-gold'}`}>
                  {anim.isFree ? 'FREE' : `$${Number(anim.price).toFixed(2)}`}
                </span>
              </div>
              <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                {anim.description}
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-slate-400">
              <span className="capitalize">{anim.category?.name || 'Decoration'}</span>
              <span className="font-semibold text-primary-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Preview <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
