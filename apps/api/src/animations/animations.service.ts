import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAnimationsDto, CreateAnimationDto } from './dto/animation.dto';

@Injectable()
export class AnimationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryAnimationsDto) {
    const { festival, category, format, isFree, search, sort = 'popular', page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null
    };

    if (festival) {
      where.festival = { slug: festival };
    }
    if (category) {
      where.category = { slug: category };
    }
    if (format) {
      where.format = format;
    }
    if (isFree !== undefined) {
      where.isFree = isFree;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy: any = { downloadsCount: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'trending') orderBy = [{ viewsCount: 'desc' }, { downloadsCount: 'desc' }];

    const [items, total] = await Promise.all([
      this.prisma.animation.findMany({
        where,
        include: {
          festival: true,
          category: true,
          schema: true,
          _count: { select: { favorites: true, reviews: true } }
        },
        skip,
        take: limit,
        orderBy
      }),
      this.prisma.animation.count({ where })
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findBySlug(slug: string) {
    const animation = await this.prisma.animation.findUnique({
      where: { slug },
      include: {
        festival: true,
        category: true,
        schema: true,
        versions: { orderBy: { createdAt: 'desc' } },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { favorites: true, reviews: true }
        }
      }
    });

    if (!animation) {
      throw new NotFoundException(`Animation with slug "${slug}" not found`);
    }

    // Increment views async
    this.prisma.animation.update({
      where: { id: animation.id },
      data: { viewsCount: { increment: 1 } }
    }).catch(() => {});

    return animation;
  }

  async getFeatured() {
    return this.prisma.animation.findMany({
      where: { status: 'PUBLISHED' },
      include: { festival: true, category: true, schema: true },
      take: 6,
      orderBy: { viewsCount: 'desc' }
    });
  }

  async getTrending() {
    return this.prisma.animation.findMany({
      where: { status: 'PUBLISHED' },
      include: { festival: true, category: true, schema: true },
      take: 8,
      orderBy: { downloadsCount: 'desc' }
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { animations: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async toggleFavorite(userId: string, animationId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_animationId: { userId, animationId }
      }
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: { id: existing.id }
      });
      return { favorited: false };
    } else {
      await this.prisma.favorite.create({
        data: { userId, animationId }
      });
      return { favorited: true };
    }
  }

  async create(dto: CreateAnimationDto) {
    return this.prisma.animation.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        festivalId: dto.festivalId,
        categoryId: dto.categoryId,
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
        format: dto.format,
        isFree: dto.isFree,
        price: dto.price,
        status: 'PUBLISHED',
        schema: dto.schemaJson
          ? {
              create: {
                schemaJson: dto.schemaJson,
                defaultSettings: dto.defaultSettings || {}
              }
            }
          : undefined,
        versions: {
          create: {
            version: '1.0.0',
            changelog: 'Initial release'
          }
        }
      },
      include: {
        festival: true,
        category: true,
        schema: true
      }
    });
  }
}
