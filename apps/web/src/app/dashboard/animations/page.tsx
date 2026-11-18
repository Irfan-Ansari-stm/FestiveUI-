'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Download,
  ArrowRight,
  ExternalLink,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { ApiClient } from '@/lib/api';
import { FestiveAnimation } from '@festiveui/react';

export default function MyAnimationsPage() {
  const [tab, setTab] = useState<'purchased' | 'favorites' | 'installed'>('purchased');
  const [purchases, setPurchases] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ApiClient.fetch('/purchases').catch(() => []),
      ApiClient.fetch('/animations?limit=50').catch(() => ({ items: [] }))
    ]).then(([purchs, allAnims]) => {
      setPurchases(purchs);
      // Filter for demo/active favorites
      setFavorites(allAnims.items?.slice(0, 4) || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Animation Library
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your purchased commercial licenses, favorites, and project installations.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" /> Explore Marketplace
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border mb-8 pb-1">
        <button
          onClick={() => setTab('purchased')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            tab === 'purchased' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Purchased Licenses ({purchases.length})
        </button>
        <button
          onClick={() => setTab('favorites')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            tab === 'favorites' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> Starred & Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setTab('installed')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            tab === 'installed' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Project Installations
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading animation inventory...</p>
        </div>
      ) : tab === 'purchased' ? (
        purchases.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border text-slate-500 text-xs">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-white font-bold text-sm mb-1">No Commercial Purchases Yet</p>
            <p className="text-slate-400 mb-4">Free animations can be used immediately without a license purchase.</p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-white text-xs font-semibold hover:bg-surfaceHover"
            >
              Browse Premium Animations
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((pur) => (
              <div
                key={pur.id}
                className="p-5 rounded-2xl border border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      {pur.license?.licenseKey || 'Standard License'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 uppercase">
                      Commercial Valid
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Order #{pur.order?.orderNumber} • Purchased {new Date(pur.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">
                    ${Number(pur.order?.totalAmount || 0).toFixed(2)}
                  </span>
                  <Link
                    href="/studio"
                    className="px-3.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Layers className="w-3.5 h-3.5" /> Customize in Studio
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : tab === 'favorites' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((anim) => (
            <Link
              key={anim.id}
              href={`/marketplace/${anim.slug}`}
              className="group p-4 rounded-2xl border border-border bg-surface glow-card flex flex-col justify-between"
            >
              <div className="h-36 rounded-xl bg-slate-950 border border-border/80 relative flex items-center justify-center overflow-hidden mb-3">
                <FestiveAnimation type={anim.slug} config={{ position: 'center', size: 64 }} />
                <span className="absolute top-2.5 right-2.5 text-red-500">
                  <Heart className="w-4 h-4 fill-red-500" />
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-primary-400 transition-colors">
                  {anim.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{anim.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-primary-400 font-semibold">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Installed */
        <div className="p-8 rounded-2xl border border-border bg-surface">
          <h3 className="font-bold text-white text-sm mb-4">Live Project Integrations</h3>
          <p className="text-xs text-slate-400 mb-6">
            Review active animations mounted across your configured domains.
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                <FestiveAnimation type="diya-glow" config={{ position: 'center', size: 36 }} />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">Diya Glow (Hero Banner)</span>
                <span className="text-[11px] text-slate-400 font-mono">localhost:3000 • #hero</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
              ACTIVE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
