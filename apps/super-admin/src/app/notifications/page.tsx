'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { Bell, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function NotificationsPage() {
  const { can } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sentAlerts, setSentAlerts] = useState<any[]>([
    {
      id: '1',
      title: 'Diwali Festival Collection Live',
      message: 'Explore 5 brand new glowing diyas and rangoli decorations in FestiveUI Studio.',
      createdAt: new Date().toISOString()
    }
  ]);

  if (!can('notifications.view')) {
    return <UnauthorizedView requiredPermission="notifications.view" />;
  }

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setSentAlerts([
      {
        id: Date.now().toString(),
        title,
        message,
        createdAt: new Date().toISOString()
      },
      ...sentAlerts
    ]);
    setTitle('');
    setMessage('');
    alert('System announcement successfully broadcasted.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-brand-400" />
          System Announcements & Broadcasts
        </h1>
        <p className="text-xs text-admin-400 mt-1">
          Deliver platform notifications, release notices, and festival event alerts to registered developers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Form */}
        <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-brand-400" />
            Send System Announcement
          </h2>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-admin-300 font-medium mb-1.5">Announcement Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Christmas Animation Pack Released!"
                className="w-full px-3.5 py-2.5 bg-admin-950 border border-admin-700 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-admin-300 font-medium mb-1.5">Notification Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detailed announcement content..."
                className="w-full px-3.5 py-2.5 bg-admin-950 border border-admin-700 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Broadcast to All Developers
            </button>
          </form>
        </div>

        {/* Recent Broadcasts */}
        <div className="lg:col-span-2 bg-admin-900/80 border border-admin-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4">Broadcast History</h2>
          <div className="space-y-3">
            {sentAlerts.map((a) => (
              <div key={a.id} className="p-4 rounded-xl bg-admin-950 border border-admin-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">{a.title}</span>
                  <span className="text-[10px] text-admin-500 font-mono">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-admin-400">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
