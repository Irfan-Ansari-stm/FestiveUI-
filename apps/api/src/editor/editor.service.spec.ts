import { Test, TestingModule } from '@nestjs/testing';
import { EditorService } from './editor.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EditorService', () => {
  let service: EditorService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      editorDocument: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn()
      },
      editorDocumentVersion: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn()
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditorService,
        { provide: PrismaService, useValue: prisma }
      ]
    }).compile();

    service = module.get<EditorService>(EditorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportCode', () => {
    it('should generate valid React integration code using @festiveui/react', async () => {
      prisma.editorDocument.findUnique.mockResolvedValue({
        id: 'doc-1',
        userId: 'user-1',
        title: 'Diwali Banner',
        mode: 'canvas',
        content: {
          layers: [
            {
              id: 'layer-1',
              name: 'Diya',
              animationType: 'diya-glow',
              config: { size: 80, position: 'bottom-right' }
            }
          ]
        }
      });

      const res = await service.exportCode('user-1', 'doc-1', 'react');
      expect(res.framework).toBe('react');
      expect(res.code).toContain("import { FestiveAnimation } from '@festiveui/react'");
      expect(res.code).toContain('diya-glow');
      expect(res.instructions).toContain('@festiveui/react');
    });

    it('should generate Next.js SSR-safe code with use client and NextFestiveAnimation', async () => {
      prisma.editorDocument.findUnique.mockResolvedValue({
        id: 'doc-1',
        userId: 'user-1',
        title: 'Christmas Banner',
        mode: 'website',
        targetSelector: '#hero',
        content: {
          layers: [
            {
              id: 'layer-2',
              name: 'Snowfall',
              animationType: 'falling-snow',
              config: { count: 80 }
            }
          ]
        }
      });

      const res = await service.exportCode('user-1', 'doc-1', 'next');
      expect(res.framework).toBe('next');
      expect(res.code).toContain("'use client'");
      expect(res.code).toContain("from '@festiveui/next'");
      expect(res.code).toContain('falling-snow');
    });
  });
});
