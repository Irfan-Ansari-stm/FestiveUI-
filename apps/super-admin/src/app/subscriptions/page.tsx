'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { CreditCard, CheckCircle2, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export default function SubscriptionsPage() {
  const { can } = useAuth();
  const [data, setData] = useState<any>({ subscriptions: [], plans: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (can('subscriptions.view')) {
      loadSubscriptions();
    }
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/admin/subscriptions');
    if (res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (!can('subscriptions.view')) {
    return <UnauthorizedView requiredPermission="subscriptions.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-brand-400" />
            Subscription Tiers & Memberships
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Configure developer pricing plans, project quotas, and monitor active subscriptions.
          </p>
        </div>
        <button onClick={loadSubscriptions} className="p-2 bg-admin-900 border border-admin-800 rounded-lg text-xs flex items-center gap-2 text-admin-300 hover:text-white">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Plan Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.plans || []).map((plan: any) => (
          <div key={plan.id} className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5 hover:border-admin-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {plan.code}
                </span>
                {plan.isPopular && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                    Popular
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-white mb-1">{plan.name}</h2>
              <div className="text-2xl font-bold text-white tracking-tight mb-2">
                ${plan.priceMonthly}<span className="text-xs text-admin-400 font-normal"> / mo</span>
              </div>
              <p className="text-xs text-admin-400 mb-4 line-clamp-2">{plan.description}</p>
            </div>

            <div className="pt-3 border-t border-admin-800/80 text-xs text-admin-300 flex items-center justify-between font-mono">
              <span>{plan.maxProjects} Projects</span>
              <span className="text-brand-400 font-semibold">{plan._count?.subscriptions || 0} Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
