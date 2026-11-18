import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FestivalsService } from './festivals.service';
import { CreateFestivalDto, UpdateFestivalDto } from './dto/festival.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Festivals')
@Controller()
export class FestivalsController {
  constructor(private readonly festivalsService: FestivalsService) {}

  @Get('festivals')
  @ApiOperation({ summary: 'List all published festivals' })
  findAll() {
    return this.festivalsService.findAll();
  }

  @Get('festivals/:slug')
  @ApiOperation({ summary: 'Get festival details with its animations and collections' })
  findBySlug(@Param('slug') slug: string) {
    return this.festivalsService.findBySlug(slug);
  }

  @Post('admin/festivals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin create a new festival' })
  create(@Body() dto: CreateFestivalDto) {
    return this.festivalsService.create(dto);
  }

  @Patch('admin/festivals/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update festival details' })
  update(@Param('id') id: string, @Body() dto: UpdateFestivalDto) {
    return this.festivalsService.update(id, dto);
  }

  @Delete('admin/festivals/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin delete festival' })
  delete(@Param('id') id: string) {
    return this.festivalsService.delete(id);
  }
}
