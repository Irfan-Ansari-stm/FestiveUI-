import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateFestivalDto {
  @ApiProperty({ example: 'Diwali' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'diwali' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Festival of Lights' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '/assets/festivals/diwali.jpg' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class UpdateFestivalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
