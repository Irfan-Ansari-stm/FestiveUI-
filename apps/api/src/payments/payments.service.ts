import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, dto: CheckoutDto) {
    // 1. Process Plan Subscription Checkout
    if (dto.planCode) {
      return this.checkoutSubscription(userId, dto);
    }

    // 2. Process Individual Animation Checkout
    if (!dto.animationIds || dto.animationIds.length === 0) {
      throw new BadRequestException('Must provide either planCode or animationIds');
    }

    const animations = await this.prisma.animation.findMany({
      where: { id: { in: dto.animationIds } }
    });

    if (animations.length === 0) {
      throw new NotFoundException('Selected animations not found');
    }

    let totalAmount = animations.reduce((acc, a) => acc + Number(a.price), 0);

    // Apply coupon if valid
    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: dto.couponCode.toUpperCase() }
      });
      if (coupon && coupon.active && (!coupon.validUntil || coupon.validUntil > new Date())) {
        totalAmount = totalAmount * (1 - coupon.discountPercent / 100);
        await this.prisma.coupon.update({
          where: { id: coupon.id },
          data: { timesUsed: { increment: 1 } }
        });
      }
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const transactionId = `txn_${dto.provider}_${crypto.randomBytes(12).toString('hex')}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;

    // Database transaction for full consistency
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          totalAmount,
          currency: 'USD',
          status: 'COMPLETED',
          items: {
            create: animations.map((anim) => ({
              animationId: anim.id,
              price: anim.price,
              licenseType: 'commercial'
            }))
          }
        }
      });

      // Generate Commercial License
      const licenseKey = `FEST-COMM-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const license = await tx.license.create({
        data: {
          licenseKey,
          licenseType: 'commercial',
          status: 'ACTIVE'
        }
      });

      // Record Purchase
      const purchase = await tx.purchase.create({
        data: {
          userId,
          orderId: order.id,
          licenseId: license.id
        }
      });

      // Record Payment
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          provider: dto.provider,
          transactionId,
          amount: totalAmount,
          currency: 'USD',
          status: 'SUCCEEDED',
          paymentMethod: `${dto.provider.toUpperCase()} Card`
        }
      });

      // Generate Invoice
      const invoice = await tx.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber,
          amount: totalAmount,
          currency: 'USD'
        }
      });

      // Increment download counts
      for (const a of animations) {
        await tx.animation.update({
          where: { id: a.id },
          data: { downloadsCount: { increment: 1 } }
        });
      }

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount,
        licenseKey: license.licenseKey,
        invoiceNumber: invoice.invoiceNumber,
        transactionId: payment.transactionId
      };
    });
  }

  private async checkoutSubscription(userId: string, dto: CheckoutDto) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { code: dto.planCode }
    });

    if (!plan) {
      throw new NotFoundException(`Plan ${dto.planCode} not found`);
    }

    const isYearly = dto.period === 'YEARLY';
    const amount = isYearly ? plan.priceYearly : plan.priceMonthly;
    const transactionId = `sub_${dto.provider}_${crypto.randomBytes(12).toString('hex')}`;

    const existingSub = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    if (existingSub) {
      // Upgrade / downgrade plan
      const updated = await this.prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          planId: plan.id,
          period: dto.period || 'MONTHLY'
        },
        include: { plan: true }
      });
      return {
        success: true,
        message: `Subscription successfully updated to ${plan.name}`,
        subscription: updated
      };
    }

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        period: dto.period || 'MONTHLY',
        status: 'ACTIVE',
        payments: {
          create: {
            provider: dto.provider,
            transactionId,
            amount,
            status: 'SUCCEEDED'
          }
        }
      },
      include: { plan: true }
    });

    return {
      success: true,
      message: `Successfully subscribed to ${plan.name}`,
      subscription
    };
  }

  async getPurchases(userId: string) {
    return this.prisma.purchase.findMany({
      where: { userId },
      include: {
        license: true,
        order: {
          include: {
            items: {
              include: { animation: true }
            },
            invoices: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPurchaseById(userId: string, id: string) {
    const purchase = await this.prisma.purchase.findFirst({
      where: { id, userId },
      include: {
        license: true,
        order: {
          include: {
            items: { include: { animation: true } },
            payments: true,
            invoices: true
          }
        }
      }
    });

    if (!purchase) {
      throw new NotFoundException('Purchase record not found');
    }

    return purchase;
  }

  async handleWebhook(provider: string, body: any) {
    // Idempotent webhook processor
    const eventType = body?.type || body?.event || 'payment.succeeded';
    const transactionId = body?.data?.object?.id || body?.id || `txn_${Date.now()}`;

    const existingPayment = await this.prisma.payment.findUnique({
      where: { transactionId }
    });

    if (existingPayment) {
      return { received: true, message: 'Already processed (idempotent)' };
    }

    return { received: true, eventType, transactionId };
  }
}
