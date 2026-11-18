'use client';

import React, { useState } from 'react';
import { Crown, X, Check } from 'lucide-react';
import { useStudioStore } from './studio-store';

export const PublishModal: React.FC = () => {
  const store = useStudioStore();
  const [title, setTitle] = useState(store.projectTitle);
  const [isCommercial, setIsCommercial] = useState(false);
  const [price, setPrice] = useState('29');
  const [tags, setTags] = useState('diwali, fireworks, festival');
  const [submitted, setSubmitted] = useState(false);

  if (!store.publishModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      store.setPublishModalOpen(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827] p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-festive-gold" />
            <h3 className="text-base font-bold text-white">Publish to Marketplace</h3>
          </div>
          <button onClick={() => store.setPublishModalOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Submitted for Review!</h4>
            <p className="text-xs text-slate-400">
              Your composition has been submitted to the FestiveUI marketplace curation queue. You will receive an alert once approved.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Package Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Licensing Model</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsCommercial(false)}
                  className={`p-2.5 rounded-xl border text-center font-bold ${
                    !isCommercial
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-[#1F2937] bg-[#0B0F19] text-slate-400'
                  }`}
                >
                  Free & Open
                </button>
                <button
                  type="button"
                  onClick={() => setIsCommercial(true)}
                  className={`p-2.5 rounded-xl border text-center font-bold ${
                    isCommercial
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-[#1F2937] bg-[#0B0F19] text-slate-400'
                  }`}
                >
                  Commercial ($USD)
                </button>
              </div>
            </div>

            {isCommercial && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">License Price ($USD)</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={499}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Keywords & Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => store.setPublishModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold"
              >
                Submit for Approval
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
