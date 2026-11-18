import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, IsIn } from 'class-validator';

export class CheckoutDto {
  @ApiPropertyOptional({ example: ['anim-uuid-1', 'anim-uuid-2'] })
  @IsOptional()
  @IsArray()
  animationIds?: string[];

  @ApiPropertyOptional({ example: 'PRO', enum: ['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE'] })
  @IsOptional()
  @IsString()
  planCode?: string;

  @ApiPropertyOptional({ example: 'MONTHLY', enum: ['MONTHLY', 'YEARLY'] })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({ example: 'FESTIVE20' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiProperty({ example: 'mock', enum: ['stripe', 'razorpay', 'mock'] })
  @IsNotEmpty()
  @IsString()
  provider: string;
}

export class PaymentWebhookDto {
  @ApiProperty()
  event: string;

  @ApiProperty()
  payload: any;
}
