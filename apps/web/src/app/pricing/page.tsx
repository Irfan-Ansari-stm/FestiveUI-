'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Shield, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const plans = [
    {
      code: 'FREE',
      name: 'Starter Plan',
      priceMonthly: 0,
      priceYearly: 0,
      desc: 'Ideal for open source, hobby projects, and learning.',
      features: [
        'Access to 10+ free animations',
        '3 Active Projects',
        'Community Forum Support',
        'React & Vanilla JS Adapters',
        'Standard CDN Delivery'
      ]
    },
    {
      code: 'PRO',
      name: 'Developer Pro',
      priceMonthly: 19,
      priceYearly: 190,
      isPopular: true,
      desc: 'Everything you need to craft high-conversion festive UI.',
      features: [
        'All 15+ Core Festival Animations',
        '15 Active Projects',
        'FestiveUI Studio Drag & Drop Editor',
        'Priority Global Edge CDN',
        'All Framework Adapters (React, Next, Vue, Angular)',
        'Unlimited Project Whitelisting'
      ]
    },
    {
      code: 'BUSINESS',
      name: 'Business Scale',
      priceMonthly: 49,
      priceYearly: 490,
      desc: 'For high-traffic e-commerce and multi-client digital agencies.',
      features: [
        'Unlimited Animations Catalog',
        '50 Active Projects',
        'Commercial Client Whitelisting',
        'Multi-domain API Key Management',
        'Team Member Accounts',
        'Dedicated Priority SLA Support'
      ]
    },
    {
      code: 'ENTERPRISE',
      name: 'Enterprise Custom',
      priceMonthly: 199,
      priceYearly: 1990,
      desc: 'Bespoke custom animations, private cluster, and SLA guarantees.',
      features: [
        'Bespoke Animation Engineering',
        '200+ Projects & Sites',
        'Dedicated Technical Account Lead',
        'Custom Legal Licensing Agreement',
        '99.99% Guaranteed Runtime SLA'
      ]
    }
  ];

  const handleSubscribe = async (planCode: string) => {
    setSubscribing(planCode);
    try {
      const res = await ApiClient.fetch('/checkout', {
        method: 'POST',
        body: JSON.stringify({
          planCode,
          period: billingCycle,
          provider: 'stripe'
        })
      });
      setSuccessPlan(planCode);
    } catch (err: any) {
      alert(err.message || 'Please sign in to subscribe.');
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Flexible Plans for Every Developer
        </h1>
        <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
          Upgrade when you need commercial licensing, advanced visual editor tools, and unlimited websites.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-surface border border-border">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billingCycle === 'MONTHLY' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'YEARLY' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">Save 20%</span>
          </button>
        </div>
      </div>

      {successPlan && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-center text-xs text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <span className="font-bold text-white block">Subscribed Successfully!</span>
          Your account has been upgraded to {successPlan}.
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {plans.map((p) => {
          const price = billingCycle === 'YEARLY' ? p.priceYearly : p.priceMonthly;
          const periodLabel = billingCycle === 'YEARLY' ? '/yr' : '/mo';

          return (
            <div
              key={p.code}
              className={`p-6 rounded-2xl border flex flex-col justify-between ${
                p.isPopular
                  ? 'border-primary-500 bg-surface shadow-2xl glow-primary relative'
                  : 'border-border bg-surface'
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary-600 text-[10px] font-bold text-white uppercase tracking-wider">
                  Recommended
                </div>
              )}

              <div>
                <h3 className="font-bold text-white text-lg">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{p.desc}</p>

                <div className="mt-5 mb-6">
                  <span className="text-4xl font-extrabold text-white">${price}</span>
                  <span className="text-xs text-slate-400 ml-1">{periodLabel}</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-border">
                <button
                  onClick={() => handleSubscribe(p.code)}
                  disabled={subscribing === p.code}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    p.isPopular
                      ? 'bg-primary-600 hover:bg-primary-500 text-white glow-primary'
                      : 'bg-surfaceHover hover:bg-slate-700 text-white'
                  }`}
                >
                  {subscribing === p.code ? 'Processing...' : `Get ${p.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
