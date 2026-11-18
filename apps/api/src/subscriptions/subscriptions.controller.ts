import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Subscriptions & Pricing Plans')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'List all public subscription plans and pricing limits' })
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current active subscription plan for authenticated user' })
  getMySubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getUserSubscription(userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel active subscription' })
  cancel(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.subscriptionsService.cancel(userId, id);
  }
}
