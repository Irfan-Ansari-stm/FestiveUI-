import { Controller, Post, Get, Param, Body, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CheckoutDto, PaymentWebhookDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Monetization & Purchases')
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Checkout animations or subscription plans' })
  checkout(@CurrentUser('id') userId: string, @Body() dto: CheckoutDto) {
    return this.paymentsService.checkout(userId, dto);
  }

  @Get('purchases')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List user purchased animations, orders, and commercial licenses' })
  getPurchases(@CurrentUser('id') userId: string) {
    return this.paymentsService.getPurchases(userId);
  }

  @Get('purchases/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get purchase details and license certificate' })
  getPurchaseById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.paymentsService.getPurchaseById(userId, id);
  }

  @Post('webhooks/payments')
  @ApiOperation({ summary: 'Idempotent webhook for Stripe/Razorpay payments' })
  handleWebhook(@Headers('x-payment-provider') provider: string, @Body() body: any) {
    return this.paymentsService.handleWebhook(provider || 'stripe', body);
  }
}
