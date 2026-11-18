import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      project: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      },
      projectApiKey: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn()
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: prisma }
      ]
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createApiKey', () => {
    it('should generate an API key with fst_live_ prefix and return secret key once', async () => {
      prisma.project.findFirst.mockResolvedValue({ id: 'proj-1', userId: 'user-1' });
      prisma.projectApiKey.create.mockImplementation((args: any) => ({
        id: 'key-id-1',
        name: args.data.name,
        keyPrefix: args.data.keyPrefix,
        createdAt: new Date()
      }));

      const res = await service.createApiKey('user-1', 'proj-1', { name: 'Production Key' });
      expect(res.keyPrefix).toMatch(/^fst_live_/);
      expect(res.secretKey).toMatch(/^fst_live_[a-f0-9]{48}$/);
      expect(res.name).toBe('Production Key');
    });
  });
});
