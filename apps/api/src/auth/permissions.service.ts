import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { evaluateUserPermission } from '@festiveui/permissions';

@Injectable()
export class PermissionsService {
  // In-memory permission cache with invalidation support
  private cache = new Map<string, { permissions: { slug: string; effect: 'ALLOW' | 'DENY' }[]; overrides: { slug: string; effect: 'ALLOW' | 'DENY' }[]; isSuperAdmin: boolean; expiresAt: number }>();
  private CACHE_TTL_MS = 60 * 1000; // 1 minute TTL, invalidated immediately on mutation

  constructor(private prisma: PrismaService) {}

  invalidateCache(userId?: string) {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }

  async getUserEffectivePermissions(userId: string) {
    const cached = this.cache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        },
        permissionOverrides: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!user) {
      return { permissions: [], overrides: [], isSuperAdmin: false, expiresAt: 0 };
    }

    const isSuperAdmin = user.userRoles.some(
      (ur) => ur.role.isSuperAdmin || ur.role.slug === 'super_admin' || ur.role.name === 'SUPER_ADMIN'
    );

    const permissions: { slug: string; effect: 'ALLOW' | 'DENY' }[] = [];
    for (const ur of user.userRoles) {
      for (const rp of ur.role.permissions) {
        permissions.push({
          slug: rp.permission.slug,
          effect: (rp.effect as 'ALLOW' | 'DENY') || 'ALLOW'
        });
      }
    }

    const overrides: { slug: string; effect: 'ALLOW' | 'DENY' }[] = user.permissionOverrides.map((po) => ({
      slug: po.permission.slug,
      effect: (po.effect as 'ALLOW' | 'DENY') || 'ALLOW'
    }));

    const result = {
      permissions,
      overrides,
      isSuperAdmin,
      expiresAt: Date.now() + this.CACHE_TTL_MS
    };

    this.cache.set(userId, result);
    return result;
  }

  async hasPermission(userId: string, requiredPermission: string): Promise<boolean> {
    const data = await this.getUserEffectivePermissions(userId);
    return evaluateUserPermission(requiredPermission, data.permissions, data.overrides, data.isSuperAdmin);
  }

  async hasRole(userId: string, roleSlug: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });
    if (!user) return false;
    return user.userRoles.some((ur) => ur.role.slug === roleSlug || ur.role.name === roleSlug);
  }

  async getUserRoles(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });
    return user ? user.userRoles.map((ur) => ur.role) : [];
  }

  async getAccessibleDashboard(userId: string) {
    const { permissions, overrides, isSuperAdmin } = await this.getUserEffectivePermissions(userId);

    const modules = await this.prisma.dashboardModule.findMany({
      where: { status: 'ACTIVE' },
      include: {
        pages: {
          orderBy: { sortOrder: 'asc' },
          include: {
            actions: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    if (isSuperAdmin) {
      return modules;
    }

    // Filter modules and pages according to permissions
    return modules
      .map((mod) => {
        const canAccessModule = evaluateUserPermission(mod.permissionSlug, permissions, overrides, false);
        const accessiblePages = mod.pages.filter((page) =>
          evaluateUserPermission(page.permissionSlug, permissions, overrides, false)
        );

        if (!canAccessModule && accessiblePages.length === 0) {
          return null;
        }

        return {
          ...mod,
          pages: accessiblePages
        };
      })
      .filter(Boolean);
  }
}
