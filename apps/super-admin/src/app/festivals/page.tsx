'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { Sparkles, Plus, Trash2, Edit2, Calendar, Film } from 'lucide-react';

export default function FestivalsPage() {
  const { can } = useAuth();
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', isFeatured: false });

  useEffect(() => {
    if (can('festivals.view')) {
      loadFestivals();
    }
  }, []);

  const loadFestivals = async () => {
    setLoading(true);
    const res = await apiFetch<any[]>('/admin/festivals');
    if (res.data) {
      setFestivals(res.data);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch('/admin/festivals', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (!res.error) {
      setShowModal(false);
      setForm({ name: '', slug: '', description: '', isFeatured: false });
      loadFestivals();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete festival "${name}"?`)) return;
    const res = await apiFetch(`/admin/festivals/${id}`, { method: 'DELETE' });
    if (!res.error) {
      loadFestivals();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  if (!can('festivals.view')) {
    return <UnauthorizedView requiredPermission="festivals.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-brand-400" />
            Cultural Festivals Management
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Curate world festivals, holiday schedules, themed graphic collections, and animation anchors.
          </p>
        </div>
        {can('festivals.create') && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Festival
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {festivals.map((fest) => (
          <div key={fest.id} className="bg-admin-900/80 border border-admin-800 rounded-2xl p-5 hover:border-admin-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {fest.slug}
                </span>
                {fest.isFeatured && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                    Featured
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-white mb-1.5">{fest.name}</h2>
              <p className="text-xs text-admin-400 leading-relaxed mb-4 line-clamp-3">
                {fest.description || 'Festive celebrations and animations.'}
              </p>
            </div>

            <div className="pt-3 border-t border-admin-800/80 flex items-center justify-between text-xs text-admin-400">
              <span className="flex items-center gap-1 text-admin-300 font-mono">
                <Film className="w-3.5 h-3.5 text-brand-400" />
                {fest._count?.animations || 0} Animations
              </span>
              {can('festivals.delete') && (
                <button
                  onClick={() => handleDelete(fest.id, fest.name)}
                  className="p-1 rounded text-admin-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-admin-900 border border-admin-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Add Cultural Festival</h2>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-admin-300 mb-1">Festival Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    setForm({ ...form, name, slug: form.slug || slug });
                  }}
                  className="w-full px-3 py-2 bg-admin-950 border border-admin-700 rounded-xl text-white"
                  placeholder="e.g. Lunar New Year"
                />
              </div>
              <div>
                <label className="block text-admin-300 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-admin-950 border border-admin-700 rounded-xl text-white font-mono"
                  placeholder="e.g. lunar-new-year"
                />
              </div>
              <div>
                <label className="block text-admin-300 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-admin-950 border border-admin-700 rounded-xl text-white"
                  placeholder="Cultural themes, lantern dragons, red envelopes..."
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                />
                <label htmlFor="feat" className="text-admin-300 cursor-pointer">
                  Feature prominently on Home showcase
                </label>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-admin-950 border border-admin-800 text-admin-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold"
                >
                  Save Festival
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
