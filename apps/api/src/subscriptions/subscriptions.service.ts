import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { priceMonthly: 'asc' }
    });
  }

  async getUserSubscription(userId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!sub) {
      // Default to Starter FREE plan
      const freePlan = await this.prisma.subscriptionPlan.findUnique({
        where: { code: 'FREE' }
      });
      return {
        id: 'free-default',
        status: 'ACTIVE',
        period: 'MONTHLY',
        plan: freePlan
      };
    }

    return sub;
  }

  async cancel(userId: string, id: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { id, userId }
    });
    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.subscription.update({
      where: { id },
      data: { status: 'CANCELED' },
      include: { plan: true }
    });
  }
}
