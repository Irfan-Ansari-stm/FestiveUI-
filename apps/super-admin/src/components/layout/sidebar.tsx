'use client';

import React from 'react';
import Link from 'next/navigation';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  KeyRound,
  FolderTree,
  Code2,
  Globe,
  Sparkles,
  Film,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Award,
  Cpu,
  BarChart3,
  Bell,
  ScrollText,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { DEFAULT_ROLE_PRESETS } from '@festiveui/permissions';

const ICON_MAP: Record<string, React.ElementType> = {
  overview: LayoutDashboard,
  users: Users,
  roles: ShieldAlert,
  permissions: KeyRound,
  dashboard_access: FolderTree,
  developers: Code2,
  projects: Globe,
  festivals: Sparkles,
  animations: Film,
  marketplace: ShoppingBag,
  subscriptions: CreditCard,
  payments: DollarSign,
  licenses: Award,
  api_management: Cpu,
  analytics: BarChart3,
  notifications: Bell,
  audit_logs: ScrollText,
  settings: Settings,
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, can, previewRole, setPreviewRole, accessibleModules } = useAuth();

  // Filter modules based on permission checking (or preview simulation)
  const visibleModules = accessibleModules.filter((mod) => can(mod.permissionSlug));

  return (
    <aside className="w-72 bg-admin-950 border-r border-admin-800 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* 1. Header Branding */}
      <div className="p-5 border-b border-admin-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
              FestiveUI
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-mono font-semibold border border-brand-500/30">
                ADMIN
              </span>
            </div>
            <div className="text-xs text-admin-400">Control Panel & RBAC</div>
          </div>
        </div>
      </div>

      {/* 2. "Preview as Role" Switcher Banner */}
      {user?.isSuperAdmin && (
        <div className="px-4 py-3 bg-admin-900/90 border-b border-admin-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider text-admin-400 uppercase flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Preview Role
            </span>
            {previewRole && (
              <button
                onClick={() => setPreviewRole(null)}
                className="text-[10px] text-red-400 hover:text-red-300 underline"
              >
                Reset to Owner
              </button>
            )}
          </div>
          <select
            value={previewRole || ''}
            onChange={(e) => setPreviewRole(e.target.value || null)}
            className="w-full text-xs bg-admin-950 border border-admin-700 rounded-lg px-2.5 py-1.5 text-admin-200 focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option value="">Full Super Admin (Owner)</option>
            {DEFAULT_ROLE_PRESETS.filter((r) => !r.isSuperAdmin).map((preset) => (
              <option key={preset.slug} value={preset.slug}>
                Simulate: {preset.name}
              </option>
            ))}
          </select>
          {previewRole && (
            <div className="mt-1.5 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
              Active simulation: <strong className="font-semibold">{previewRole}</strong>
            </div>
          )}
        </div>
      )}

      {/* 3. Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-admin-500">
          Navigation ({visibleModules.length})
        </div>

        {visibleModules.map((mod) => {
          const Icon = ICON_MAP[mod.slug] || LayoutDashboard;
          const isActive = pathname === mod.route || pathname.startsWith(`${mod.route}/`);

          return (
            <NextLink
              key={mod.slug}
              href={mod.route}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600/20 to-brand-500/10 text-white border-l-4 border-brand-500 pl-2 font-semibold shadow-sm'
                  : 'text-admin-400 hover:text-admin-100 hover:bg-admin-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-brand-400' : 'text-admin-500 group-hover:text-admin-300'
                  }`}
                />
                <span>{mod.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-400" />}
            </NextLink>
          );
        })}
      </div>

      {/* 4. Footer User Info & Logout */}
      <div className="p-4 border-t border-admin-800 bg-admin-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-admin-800 border border-admin-700 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : 'SA'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-medium text-white truncate">{user?.email}</div>
              <div className="text-[10px] text-brand-400 truncate flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-brand-400" />
                {user?.isSuperAdmin ? 'SUPER ADMIN' : user?.roles?.[0] || 'ADMIN'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 text-admin-400 hover:text-red-400 hover:bg-admin-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
