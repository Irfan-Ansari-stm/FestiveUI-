import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFestivalDto, UpdateFestivalDto } from './dto/festival.dto';

@Injectable()
export class FestivalsService {
  constructor(private prisma: PrismaService) {}

  async findAll(publishedOnly = true) {
    return this.prisma.festival.findMany({
      where: publishedOnly ? { published: true } : {},
      include: {
        _count: {
          select: { animations: true }
        },
        collections: true
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }]
    });
  }

  async findBySlug(slug: string) {
    const festival = await this.prisma.festival.findUnique({
      where: { slug },
      include: {
        collections: true,
        animations: {
          where: { status: 'PUBLISHED' },
          include: {
            category: true,
            schema: true
          }
        }
      }
    });

    if (!festival) {
      throw new NotFoundException(`Festival with slug "${slug}" not found`);
    }

    return festival;
  }

  async create(dto: CreateFestivalDto) {
    const existing = await this.prisma.festival.findUnique({
      where: { slug: dto.slug }
    });
    if (existing) {
      throw new ConflictException(`Festival with slug "${dto.slug}" already exists`);
    }

    return this.prisma.festival.create({
      data: dto
    });
  }

  async update(id: string, dto: UpdateFestivalDto) {
    return this.prisma.festival.update({
      where: { id },
      data: dto
    });
  }

  async delete(id: string) {
    return this.prisma.festival.delete({
      where: { id }
    });
  }
}
