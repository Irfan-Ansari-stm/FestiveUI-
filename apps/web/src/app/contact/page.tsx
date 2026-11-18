'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h1 className="text-3xl font-extrabold text-white">Get in Touch</h1>
        <p className="text-slate-400 text-sm mt-2">
          Have questions about bespoke enterprise animations, custom licensing, or SDK integration?
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-border bg-surface glow-card">
        {submitted ? (
          <div className="text-center py-12 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
            <p className="text-xs text-slate-400">Our engineering and enterprise licensing team will respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Smith"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Enterprise Licensing / Custom Animation Request"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Message</label>
              <textarea
                rows={5}
                required
                placeholder="How can we assist your festival project?"
                className="w-full p-3 rounded-xl bg-slate-950 border border-border text-white text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
