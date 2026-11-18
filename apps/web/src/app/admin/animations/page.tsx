'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Check, Eye, Trash2, Sliders, ExternalLink } from 'lucide-react';
import { ApiClient } from '@/lib/api';
import { FestiveAnimation } from '@festiveui/react';

export default function AdminAnimationsPage() {
  const [animations, setAnimations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnimations = () => {
    setLoading(true);
    ApiClient.fetch('/admin/animations')
      .then((data) => {
        setAnimations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAnimations();
  }, []);

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await ApiClient.fetch(`/admin/animations/${id}/publish`, {
        method: 'POST',
        body: JSON.stringify({ status: nextStatus })
      });
      loadAnimations();
    } catch (err: any) {
      alert(err.message || 'Failed to update animation status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Operations
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Animation Management</h1>
          <p className="text-xs text-slate-400 mt-1">Review, test, configure, and publish animation packages</p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading animation catalog...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Animation</th>
                <th className="p-4 font-semibold">Festival</th>
                <th className="p-4 font-semibold">Format</th>
                <th className="p-4 font-semibold">License Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-slate-300">
              {animations.map((a) => (
                <tr key={a.id} className="hover:bg-surfaceHover/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-950 border border-border flex items-center justify-center shrink-0">
                        <FestiveAnimation type={a.slug} config={{ position: 'center', size: 28 }} />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{a.name}</span>
                        <span className="font-mono text-slate-500 text-[10px]">{a.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-200">{a.festival?.name}</td>
                  <td className="p-4 uppercase font-mono text-primary-400 font-bold">{a.format}</td>
                  <td className="p-4 font-semibold text-white">
                    {a.isFree ? <span className="text-emerald-400">FREE</span> : `$${Number(a.price).toFixed(2)}`}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.status === 'PUBLISHED'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleTogglePublish(a.id, a.status)}
                      className="px-2.5 py-1 rounded bg-slate-950 border border-border hover:bg-surface font-semibold text-slate-200"
                    >
                      {a.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
