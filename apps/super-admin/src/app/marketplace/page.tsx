'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { ShoppingBag, Star, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function MarketplaceAdminPage() {
  const { can } = useAuth();
  const [animations, setAnimations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (can('marketplace.view')) {
      loadMarketplace();
    }
  }, []);

  const loadMarketplace = async () => {
    setLoading(true);
    const res = await apiFetch<any[]>('/admin/animations');
    if (res.data) {
      setAnimations(res.data);
    }
    setLoading(false);
  };

  if (!can('marketplace.view')) {
    return <UnauthorizedView requiredPermission="marketplace.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-brand-400" />
            Marketplace Management & Moderation
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Supervise public store listings, featured festival bundles, and ratings moderation.
          </p>
        </div>
        <button onClick={loadMarketplace} className="p-2 bg-admin-900 border border-admin-800 rounded-lg text-xs flex items-center gap-2 text-admin-300 hover:text-white">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {animations.slice(0, 9).map((item) => (
          <div key={item.id} className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5 hover:border-admin-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {item.festival?.name}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating || '5.0'}</span>
                </div>
              </div>

              <h2 className="text-sm font-bold text-white mb-1">{item.name}</h2>
              <p className="text-xs text-admin-400 leading-relaxed mb-4 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-admin-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-admin-300">
                {item.isFree ? 'Free License' : `$${item.price} Commercial`}
              </span>
              <span className="text-emerald-400 font-semibold text-[11px]">
                Active Listing
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
