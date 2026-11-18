import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      animation: {
        findMany: jest.fn(),
        update: jest.fn()
      },
      coupon: {
        findUnique: jest.fn(),
        update: jest.fn()
      },
      $transaction: jest.fn((callback) => callback(prisma)),
      order: {
        create: jest.fn().mockImplementation((args) => ({
          id: 'order-1',
          orderNumber: args.data.orderNumber,
          totalAmount: args.data.totalAmount
        }))
      },
      license: {
        create: jest.fn().mockImplementation((args) => ({
          id: 'license-1',
          licenseKey: args.data.licenseKey,
          licenseType: args.data.licenseType
        }))
      },
      purchase: {
        create: jest.fn().mockResolvedValue({ id: 'purchase-1' })
      },
      payment: {
        create: jest.fn().mockImplementation((args) => ({
          id: 'pay-1',
          transactionId: args.data.transactionId
        }))
      },
      invoice: {
        create: jest.fn().mockImplementation((args) => ({
          id: 'inv-1',
          invoiceNumber: args.data.invoiceNumber
        }))
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma }
      ]
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkout', () => {
    it('should complete transactional animation checkout and issue a commercial license key', async () => {
      prisma.animation.findMany.mockResolvedValue([
        { id: 'anim-1', name: 'Floating Diyas', price: 9.99 }
      ]);

      const res: any = await service.checkout('user-1', {
        animationIds: ['anim-1'],
        provider: 'stripe'
      });

      expect(res.success).toBe(true);
      expect(res.licenseKey).toMatch(/^FEST-COMM-[A-F0-9]{8}-[A-F0-9]{8}$/);
      expect(res.invoiceNumber).toMatch(/^INV-2026-\d+$/);
      expect(res.totalAmount).toBe(9.99);
    });

    it('should apply discount when valid coupon is provided', async () => {
      prisma.animation.findMany.mockResolvedValue([
        { id: 'anim-1', name: 'Floating Diyas', price: 10.0 }
      ]);
      prisma.coupon.findUnique.mockResolvedValue({
        id: 'coup-1',
        code: 'SAVE50',
        discountPercent: 50,
        active: true
      });

      const res: any = await service.checkout('user-1', {
        animationIds: ['anim-1'],
        couponCode: 'SAVE50',
        provider: 'stripe'
      });

      expect(res.totalAmount).toBe(5.0);
    });
  });
});
