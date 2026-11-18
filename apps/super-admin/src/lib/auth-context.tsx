'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { evaluateUserPermission, DEFAULT_ROLE_PRESETS, DASHBOARD_TREE, DashboardModuleNode } from '@festiveui/permissions';

export interface AdminUser {
  id: string;
  email: string;
  roles: string[];
  roleNames?: string[];
  isSuperAdmin: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    company?: string;
  };
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  previewRole: string | null;
  accessibleModules: DashboardModuleNode[];
  setPreviewRole: (roleSlug: string | null) => void;
  can: (permissionSlug: string) => boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewRole, setPreviewRole] = useState<string | null>(null);
  const [effectivePermissions, setEffectivePermissions] = useState<string[]>([]);
  const [accessibleModules, setAccessibleModules] = useState<DashboardModuleNode[]>(DASHBOARD_TREE);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for session
    const savedToken = localStorage.getItem('festiveui_admin_token');
    const savedUser = localStorage.getItem('festiveui_admin_user');
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        fetchPermissionsAndModules(savedToken, parsedUser);
      } catch (e) {
        localStorage.removeItem('festiveui_admin_token');
        localStorage.removeItem('festiveui_admin_user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchPermissionsAndModules = async (authToken: string, currentUser: AdminUser) => {
    try {
      const [permRes, moduleRes] = await Promise.all([
        fetch('http://localhost:4000/api/v1/me/permissions', {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        fetch('http://localhost:4000/api/v1/me/dashboard-access', {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);

      if (permRes.ok) {
        const permData = await permRes.json();
        if (permData.isSuperAdmin) {
          setEffectivePermissions(['*']);
        } else {
          const allowed = (permData.permissions || [])
            .filter((p: any) => p.effect === 'ALLOW')
            .map((p: any) => p.slug);
          setEffectivePermissions(allowed);
        }
      }

      if (moduleRes.ok) {
        const modData = await moduleRes.json();
        if (modData.modules && modData.modules.length > 0) {
          setAccessibleModules(modData.modules);
        }
      }
    } catch (err) {
      console.error('Failed to sync permissions from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Authentication failed' };
      }

      const roleSlugs = (data.user.roles || []).map((r: string) => r.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      const isSuper = roleSlugs.includes('super_admin') || (data.user.roles || []).includes('SUPER_ADMIN');

      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email,
        roles: data.user.roles,
        isSuperAdmin: isSuper,
        profile: data.user.profile
      };

      localStorage.setItem('festiveui_admin_token', data.accessToken);
      localStorage.setItem('festiveui_admin_user', JSON.stringify(adminUser));
      setToken(data.accessToken);
      setUser(adminUser);

      await fetchPermissionsAndModules(data.accessToken, adminUser);
      router.push('/overview');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('festiveui_admin_token');
    localStorage.removeItem('festiveui_admin_user');
    setToken(null);
    setUser(null);
    setPreviewRole(null);
    setEffectivePermissions([]);
    router.push('/login');
  };

  // Evaluate permission considering preview simulation
  const can = (permissionSlug: string): boolean => {
    if (!user) return false;

    // If simulating as another role
    if (previewRole) {
      const preset = DEFAULT_ROLE_PRESETS.find((r) => r.slug === previewRole);
      if (!preset) return false;
      if (preset.isSuperAdmin || preset.permissions.includes('*')) return true;
      return preset.permissions.includes(permissionSlug);
    }

    if (user.isSuperAdmin || effectivePermissions.includes('*')) {
      return true;
    }

    return effectivePermissions.includes(permissionSlug);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        previewRole,
        accessibleModules,
        setPreviewRole,
        can,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function Can({ permission, children }: { permission: string; children: React.ReactNode }) {
  const { can } = useAuth();
  if (!can(permission)) return null;
  return <>{children}</>;
}

export function CanAny({ permissions, children }: { permissions: string[]; children: React.ReactNode }) {
  const { can } = useAuth();
  const allowed = permissions.some((p) => can(p));
  if (!allowed) return null;
  return <>{children}</>;
}
