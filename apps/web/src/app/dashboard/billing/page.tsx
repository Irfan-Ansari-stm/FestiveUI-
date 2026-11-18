'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  Download,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ApiClient.fetch('/subscriptions/me').catch(() => null),
      ApiClient.fetch('/purchases').catch(() => []),
      ApiClient.fetch('/subscriptions/plans').catch(() => [])
    ]).then(([sub, purchs, plns]) => {
      setSubscription(sub);
      setPurchases(purchs);
      setPlans(plns);
      setLoading(false);
    });
  }, []);

  const handleCancel = async () => {
    if (!subscription?.id || subscription.id === 'free-default') return;
    if (!confirm('Are you sure you want to cancel your active subscription?')) return;

    try {
      await ApiClient.fetch(`/subscriptions/${subscription.id}`, { method: 'DELETE' });
      setSubscription((prev: any) => ({ ...prev, status: 'CANCELED' }));
      alert('Subscription cancelled successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to cancel subscription');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Billing, Plans & Invoices
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review your subscription tier, billing period, and invoice receipts.
        </p>
      </div>

      {/* Active Subscription Tier Card */}
      <div className="p-6 rounded-2xl border border-primary-500/40 bg-surface shadow-xl glow-primary flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-600/20 text-primary-400 border border-primary-500/30">
              Current Tier
            </span>
            <span className="text-xs text-emerald-400 font-semibold">● {subscription?.status || 'Active'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">{subscription?.plan?.name || 'Starter Free Plan'}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {subscription?.plan?.description || 'Access to free core animations and 3 active projects.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary transition-all"
          >
            Upgrade Plan
          </Link>
          {subscription?.id && subscription.id !== 'free-default' && subscription.status === 'ACTIVE' && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl bg-surface hover:bg-red-950/40 border border-border text-red-300 font-semibold text-xs transition-colors"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Invoices & Order History */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="p-4 border-b border-border bg-slate-950/40 flex items-center justify-between">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">Invoices & Receipts</h3>
          <span className="text-xs text-slate-500">Tax compliant commercial invoices</span>
        </div>

        {purchases.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No invoices generated yet.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Invoice #</th>
                <th className="p-4 font-semibold">Order</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-slate-300">
              {purchases.map((pur) => (
                <tr key={pur.id} className="hover:bg-surfaceHover/50">
                  <td className="p-4 font-mono font-bold text-primary-400">
                    {pur.order?.invoices?.[0]?.invoiceNumber || `INV-2026-${pur.id.substring(0, 5)}`}
                  </td>
                  <td className="p-4 font-mono text-slate-300">{pur.order?.orderNumber}</td>
                  <td className="p-4 text-slate-400">{new Date(pur.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-white">${Number(pur.order?.totalAmount || 0).toFixed(2)}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      PAID
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Downloading Invoice ${pur.order?.invoices?.[0]?.invoiceNumber || 'INV-2026'}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-950"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
