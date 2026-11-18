import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, CreateApiKeyDto } from './dto/project.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId, deletedAt: null },
      include: {
        domains: true,
        _count: {
          select: { apiKeys: true, installations: true, editorDocs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(userId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        domains: true,
        apiKeys: {
          select: {
            id: true,
            name: true,
            keyPrefix: true,
            revoked: true,
            lastUsedAt: true,
            createdAt: true
          }
        },
        installations: {
          include: { animation: true }
        },
        editorDocs: true
      }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(userId: string, dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        userId,
        name: dto.name,
        websiteUrl: dto.websiteUrl,
        framework: dto.framework || 'react',
        environment: dto.environment || 'production',
        domains: dto.domains && dto.domains.length > 0
          ? {
              create: dto.domains.map((d) => ({ domain: d.trim(), verified: true }))
            }
          : undefined
      },
      include: {
        domains: true
      }
    });

    // Auto-create initial default API key
    await this.createApiKey(userId, project.id, { name: 'Default Project Key' });

    return project;
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    await this.findOne(userId, id);

    return this.prisma.project.update({
      where: { id },
      data: dto
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async createApiKey(userId: string, projectId: string, dto: CreateApiKeyDto) {
    await this.findOne(userId, projectId);

    const rawToken = crypto.randomBytes(24).toString('hex');
    const fullKey = `fst_live_${rawToken}`;
    const keyPrefix = fullKey.substring(0, 13); // "fst_live_XXXX"
    const keyHash = await bcrypt.hash(fullKey, 10);

    const apiKey = await this.prisma.projectApiKey.create({
      data: {
        projectId,
        name: dto.name,
        keyPrefix,
        keyHash
      }
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      createdAt: apiKey.createdAt,
      secretKey: fullKey // Shown once to developer
    };
  }

  async listApiKeys(userId: string, projectId: string) {
    await this.findOne(userId, projectId);

    return this.prisma.projectApiKey.findMany({
      where: { projectId },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        revoked: true,
        lastUsedAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async revokeApiKey(userId: string, projectId: string, keyId: string) {
    await this.findOne(userId, projectId);

    return this.prisma.projectApiKey.update({
      where: { id: keyId },
      data: { revoked: true }
    });
  }

  async rotateApiKey(userId: string, projectId: string, keyId: string) {
    await this.revokeApiKey(userId, projectId, keyId);
    return this.createApiKey(userId, projectId, { name: 'Rotated Project Key' });
  }
}
