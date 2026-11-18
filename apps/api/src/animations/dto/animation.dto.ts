import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAnimationsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  festival?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['newest', 'trending', 'price_asc', 'price_desc', 'popular'] })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;
}

export class CreateAnimationDto {
  @ApiProperty({ example: 'Diya Glow' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'diya-glow' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'diwali' })
  @IsString()
  festivalId: string;

  @ApiProperty({ example: 'decorations' })
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ example: '/assets/animations/diya-glow.png' })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({ enum: ['canvas', 'svg', 'css', 'lottie', 'webgl'] })
  @IsString()
  format: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  isFree: boolean;

  @ApiProperty({ default: 0 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  schemaJson?: any;

  @ApiPropertyOptional()
  @IsOptional()
  defaultSettings?: any;
}
