'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit, Check, X, Sparkles } from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function AdminFestivalsPage() {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadFestivals = () => {
    setLoading(true);
    ApiClient.fetch('/festivals')
      .then((data) => {
        setFestivals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadFestivals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ApiClient.fetch('/admin/festivals', {
        method: 'POST',
        body: JSON.stringify({ name, slug: slug.toLowerCase().replace(/\s+/g, '-'), description, isFeatured: true })
      });
      setModalOpen(false);
      setName('');
      setSlug('');
      setDescription('');
      loadFestivals();
    } catch (err: any) {
      alert(err.message || 'Failed to create festival');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this festival? Linked animations will be affected.')) return;
    try {
      await ApiClient.fetch(`/admin/festivals/${id}`, { method: 'DELETE' });
      loadFestivals();
    } catch (err: any) {
      alert(err.message || 'Failed to delete festival');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Operations
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Festival Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage global cultural festivals, dates, and collections</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md glow-primary"
        >
          <Plus className="w-3.5 h-3.5" /> Add Festival
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading festivals...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Slug</th>
                <th className="p-4 font-semibold">Animations</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-slate-300">
              {festivals.map((f) => (
                <tr key={f.id} className="hover:bg-surfaceHover/50">
                  <td className="p-4 font-bold text-white">{f.name}</td>
                  <td className="p-4 font-mono text-slate-400">{f.slug}</td>
                  <td className="p-4 font-semibold text-primary-400">{f._count?.animations || 0}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      PUBLISHED
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-950"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="font-bold text-white text-base">Create New Festival</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Festival Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navratri"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Slug</label>
                <input
                  type="text"
                  required
                  placeholder="navratri"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Festival description and traditions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-surface border border-border text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Festival'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
