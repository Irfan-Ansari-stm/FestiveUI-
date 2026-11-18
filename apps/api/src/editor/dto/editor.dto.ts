import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class SaveEditorDocumentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ example: 'Diwali Homepage Banner' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'canvas', enum: ['canvas', 'website'] })
  @IsString()
  mode: string;

  @ApiPropertyOptional({ example: '#hero' })
  @IsOptional()
  @IsString()
  targetSelector?: string;

  @ApiProperty()
  @IsObject()
  content: any; // layers, positions, configs, zoom, viewport
}

export class CreateVersionSnapshotDto {
  @ApiPropertyOptional({ example: 'Holiday launch release draft' })
  @IsOptional()
  @IsString()
  title?: string;
}

export class ExportCodeDto {
  @ApiProperty({ example: 'react', enum: ['react', 'next', 'vue', 'angular', 'vanilla', 'web-component'] })
  @IsString()
  framework: string;
}
