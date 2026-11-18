import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    const [
      totalUsers,
      totalAnimations,
      totalFestivals,
      orders,
      downloadsSum,
      recentUsers,
      recentOrders
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.animation.count({ where: { deletedAt: null } }),
      this.prisma.festival.count(),
      this.prisma.order.findMany({
        where: { status: 'COMPLETED' },
        select: { totalAmount: true }
      }),
      this.prisma.animation.aggregate({
        _sum: { downloadsCount: true, viewsCount: true }
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { profile: true, userRoles: { include: { role: true } } }
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { include: { profile: true } } }
      })
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

    return {
      metrics: {
        totalUsers,
        totalAnimations,
        totalFestivals,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalDownloads: downloadsSum._sum.downloadsCount || 0,
        totalViews: downloadsSum._sum.viewsCount || 0
      },
      recentUsers,
      recentOrders
    };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { firstName: { contains: search, mode: 'insensitive' } } },
        { profile: { lastName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          profile: true,
          userRoles: { include: { role: true } },
          _count: { select: { projects: true, purchases: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateUserRole(adminUserId: string, userId: string, roleName: string) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName }
    });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    await this.prisma.userRole.deleteMany({ where: { userId } });
    const userRole = await this.prisma.userRole.create({
      data: { userId, roleId: role.id }
    });

    // Record audit log
    await this.prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'USER_ROLE_CHANGED',
        resource: `users/${userId}`,
        metadata: { newRole: roleName }
      }
    });

    return userRole;
  }

  async updateUserStatus(adminUserId: string, userId: string, status: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { status }
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'USER_STATUS_UPDATED',
        resource: `users/${userId}`,
        metadata: { newStatus: status }
      }
    });

    return user;
  }

  async getAdminAnimations() {
    return this.prisma.animation.findMany({
      include: {
        festival: true,
        category: true,
        schema: true,
        versions: true,
        _count: { select: { orderItems: true, favorites: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async togglePublishAnimation(adminUserId: string, id: string, status: string) {
    const animation = await this.prisma.animation.update({
      where: { id },
      data: { status }
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'ANIMATION_PUBLISH_STATUS_CHANGED',
        resource: `animations/${id}`,
        metadata: { status }
      }
    });

    return animation;
  }

  async getAuditLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        include: { user: { include: { profile: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.auditLog.count()
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
