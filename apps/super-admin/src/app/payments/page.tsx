'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { DollarSign, Download, RotateCcw, RefreshCw, FileText } from 'lucide-react';

export default function PaymentsPage() {
  const { can } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (can('payments.view')) {
      loadPayments();
    }
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/admin/payments');
    if (res.data?.items) {
      setOrders(res.data.items);
    }
    setLoading(false);
  };

  const handleRefund = async (orderId: string) => {
    const reason = prompt('Enter refund reason for the audit log:', 'Customer requested refund');
    if (!reason) return;

    const res = await apiFetch(`/admin/payments/${orderId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    if (!res.error) {
      alert('Order successfully refunded.');
      loadPayments();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  if (!can('payments.view')) {
    return <UnauthorizedView requiredPermission="payments.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-brand-400" />
            Payment Ledger & Transactions
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Complete transaction history, invoice records, and administrative refund controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {can('payments.export') && (
            <button
              onClick={() => alert('Exporting financial report CSV...')}
              className="px-3 py-1.5 rounded-lg bg-admin-900 border border-admin-800 text-xs font-semibold text-white flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Export Ledger
            </button>
          )}
          <button onClick={loadPayments} className="p-2 bg-admin-900 border border-admin-800 rounded-lg text-xs flex items-center gap-2 text-admin-300 hover:text-white">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-admin-900/80 border border-admin-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-admin-950 text-admin-400 border-b border-admin-800 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-6">Order Number / Customer</th>
              <th className="py-3.5 px-6">Amount</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Invoice</th>
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-6 text-right">Refund Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-800/60">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-admin-400">
                  No payment transactions recorded yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-admin-900/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-xs font-mono">{o.orderNumber}</div>
                    <div className="text-[11px] text-admin-400 mt-0.5">{o.user?.email}</div>
                  </td>
                  <td className="py-4 px-6 text-white font-mono font-bold">
                    ${Number(o.totalAmount).toFixed(2)} {o.currency}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      o.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-admin-400 font-mono">
                    {o.invoices?.[0]?.invoiceNumber || 'INV-2026-001'}
                  </td>
                  <td className="py-4 px-6 font-mono text-admin-500 text-[11px]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {can('payments.refund') && o.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleRefund(o.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-medium transition-colors"
                      >
                        Refund Order
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
