import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'My E-Commerce Store' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'https://myshop.com' })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: 'react', enum: ['react', 'next', 'vue', 'angular', 'vanilla'] })
  @IsOptional()
  @IsString()
  framework?: string;

  @ApiPropertyOptional({ example: 'production' })
  @IsOptional()
  @IsString()
  environment?: string;

  @ApiPropertyOptional({ example: ['myshop.com', 'localhost'] })
  @IsOptional()
  @IsArray()
  domains?: string[];
}

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  framework?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  environment?: string;
}

export class CreateApiKeyDto {
  @ApiProperty({ example: 'Production Live Key' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
