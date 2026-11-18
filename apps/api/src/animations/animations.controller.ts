import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnimationsService } from './animations.service';
import { QueryAnimationsDto, CreateAnimationDto } from './dto/animation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Marketplace & Animations')
@Controller('animations')
export class AnimationsController {
  constructor(private readonly animationsService: AnimationsService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter marketplace animations' })
  findAll(@Query() query: QueryAnimationsDto) {
    return this.animationsService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured festive animations' })
  getFeatured() {
    return this.animationsService.getFeatured();
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending popular animations' })
  getTrending() {
    return this.animationsService.getTrending();
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all categories with animation counts' })
  getCategories() {
    return this.animationsService.getCategories();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get animation details by slug with schema and reviews' })
  findBySlug(@Param('slug') slug: string) {
    return this.animationsService.findBySlug(slug);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle favorite status for an animation' })
  toggleFavorite(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.animationsService.toggleFavorite(userId, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin create a new animation with schema' })
  create(@Body() dto: CreateAnimationDto) {
    return this.animationsService.create(dto);
  }
}
