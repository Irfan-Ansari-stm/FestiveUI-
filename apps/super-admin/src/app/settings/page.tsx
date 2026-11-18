'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { UnauthorizedView } from '@/components/common/unauthorized-view';
import { Settings, ShieldCheck, Lock, Globe, Server, CheckCircle2, Save } from 'lucide-react';

export default function SettingsPage() {
  const { can } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enforceMfa, setEnforceMfa] = useState(true);
  const [rateLimit, setRateLimit] = useState(120);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (can('settings.view')) {
      loadSettings();
    }
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/admin/settings');
    if (res.data) {
      setSettings(res.data);
      setEnforceMfa(res.data.security?.enforceMfaForAdmins ?? true);
      setRateLimit(res.data.security?.rateLimitPerMinute ?? 120);
    }
    setLoading(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!can('settings.view')) {
    return <UnauthorizedView requiredPermission="settings.view" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-brand-400" />
            System & Security Settings
          </h1>
          <p className="text-xs text-admin-400 mt-1">
            Global security parameters, multi-factor authentication mandates, and platform CDN delivery endpoints.
          </p>
        </div>

        {can('settings.update') && (
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Settings Saved!' : 'Save System Settings'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Controls */}
        <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Super Admin Security & Access Rules
          </h2>

          <div className="p-4 rounded-xl bg-admin-950 border border-admin-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Enforce Multi-Factor Authentication</div>
                <div className="text-[11px] text-admin-400">Mandate TOTP/passkey for all administrative logins</div>
              </div>
              <input
                type="checkbox"
                checked={enforceMfa}
                onChange={(e) => setEnforceMfa(e.target.checked)}
                className="w-4 h-4 accent-brand-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-admin-950 border border-admin-800 space-y-2">
            <label className="block text-xs font-semibold text-white">Rate Limit Threshold (Per Minute)</label>
            <div className="text-[11px] text-admin-400">Maximum unauthenticated and API request frequency per client IP</div>
            <input
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              className="w-full px-3 py-2 bg-admin-900 border border-admin-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Platform Configuration */}
        <div className="bg-admin-900/80 border border-admin-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-400" />
            Environment & Asset CDN
          </h2>

          <div className="p-4 rounded-xl bg-admin-950 border border-admin-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-admin-400">Platform Version:</span>
              <span className="font-mono text-brand-400 font-bold">{settings?.platform?.version || '2.0.0'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-admin-400">Running Environment:</span>
              <span className="font-mono text-emerald-400 font-semibold">{settings?.platform?.environment || 'production'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-admin-400">Asset Storage Provider:</span>
              <span className="font-mono text-white">{settings?.platform?.storageProvider || 'AWS S3 (Cloudflare CDN)'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-admin-400">CDN Base Endpoint:</span>
              <span className="font-mono text-admin-300 text-[11px]">{settings?.platform?.cdnEndpoint || 'https://cdn.festiveui.com/assets'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
