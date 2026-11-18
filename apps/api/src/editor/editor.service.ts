import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveEditorDocumentDto, CreateVersionSnapshotDto } from './dto/editor.dto';

@Injectable()
export class EditorService {
  constructor(private prisma: PrismaService) {}

  async createOrSave(userId: string, dto: SaveEditorDocumentDto) {
    const doc = await this.prisma.editorDocument.create({
      data: {
        userId,
        projectId: dto.projectId,
        title: dto.title,
        mode: dto.mode || 'canvas',
        targetSelector: dto.targetSelector,
        content: dto.content
      }
    });

    // Auto-create initial version snapshot
    await this.prisma.editorDocumentVersion.create({
      data: {
        editorDocumentId: doc.id,
        versionNumber: 1,
        title: 'Initial Draft',
        contentSnapshot: dto.content
      }
    });

    return doc;
  }

  async findOne(userId: string, id: string) {
    const doc = await this.prisma.editorDocument.findUnique({
      where: { id },
      include: {
        versions: {
          select: {
            id: true,
            versionNumber: true,
            title: true,
            createdAt: true
          },
          orderBy: { versionNumber: 'desc' }
        }
      }
    });

    if (!doc) {
      throw new NotFoundException('Editor project not found');
    }

    if (doc.userId !== userId) {
      throw new ForbiddenException('Access denied to this editor document');
    }

    return doc;
  }

  async update(userId: string, id: string, dto: Partial<SaveEditorDocumentDto>) {
    await this.findOne(userId, id);

    return this.prisma.editorDocument.update({
      where: { id },
      data: {
        title: dto.title,
        mode: dto.mode,
        targetSelector: dto.targetSelector,
        content: dto.content
      }
    });
  }

  async createVersion(userId: string, id: string, dto: CreateVersionSnapshotDto) {
    const doc = await this.findOne(userId, id);

    const latestVersion = await this.prisma.editorDocumentVersion.findFirst({
      where: { editorDocumentId: id },
      orderBy: { versionNumber: 'desc' }
    });

    const nextVer = (latestVersion?.versionNumber || 0) + 1;

    return this.prisma.editorDocumentVersion.create({
      data: {
        editorDocumentId: id,
        versionNumber: nextVer,
        title: dto.title || `Snapshot v${nextVer}`,
        contentSnapshot: doc.content as any
      }
    });
  }

  async getVersions(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.editorDocumentVersion.findMany({
      where: { editorDocumentId: id },
      orderBy: { versionNumber: 'desc' }
    });
  }

  async restoreVersion(userId: string, id: string, versionId: string) {
    await this.findOne(userId, id);

    const version = await this.prisma.editorDocumentVersion.findUnique({
      where: { id: versionId }
    });

    if (!version || version.editorDocumentId !== id) {
      throw new NotFoundException('Snapshot version not found');
    }

    return this.prisma.editorDocument.update({
      where: { id },
      data: {
        content: version.contentSnapshot as any
      }
    });
  }

  async exportCode(userId: string, id: string, framework: string) {
    const doc = await this.findOne(userId, id);
    const content = doc.content as any;
    const layers = content?.layers || [];
    const mode = doc.mode;
    const target = doc.targetSelector || '#festive-root';

    let code = '';
    let instructions = '';

    switch (framework) {
      case 'react':
        code = this.generateReactCode(layers, mode, target);
        instructions = 'npm install @festiveui/react @festiveui/core';
        break;

      case 'next':
        code = this.generateNextCode(layers, mode, target);
        instructions = 'npm install @festiveui/next @festiveui/react @festiveui/core';
        break;

      case 'vue':
        code = this.generateVueCode(layers, mode, target);
        instructions = 'npm install @festiveui/vue @festiveui/core';
        break;

      case 'angular':
        code = this.generateAngularCode(layers, mode, target);
        instructions = 'npm install @festiveui/angular @festiveui/core';
        break;

      case 'web-component':
        code = this.generateWebComponentCode(layers);
        instructions = 'npm install @festiveui/web-component';
        break;

      case 'vanilla':
      default:
        code = this.generateVanillaCode(layers, mode, target);
        instructions = 'npm install @festiveui/core';
        break;
    }

    return {
      framework,
      code,
      instructions,
      layersCount: layers.length
    };
  }

  private generateReactCode(layers: any[], mode: string, target: string): string {
    const imports = `import React from 'react';\nimport { FestiveAnimation } from '@festiveui/react';\n\n`;
    const components = layers
      .map((l: any) => {
        const cfg = JSON.stringify(l.config, null, 2);
        return `      {/* ${l.name} */}\n      <FestiveAnimation\n        type="${l.animationType}"\n        config={${cfg}}\n      />`;
      })
      .join('\n\n');

    return `${imports}export default function FestiveBanner() {\n  return (\n    <div className="festiveui-scene" style={{ position: 'relative', width: '100%', minHeight: '400px' }}>\n${components}\n    </div>\n  );\n}`;
  }

  private generateNextCode(layers: any[], mode: string, target: string): string {
    const imports = `'use client';\n\nimport { NextFestiveAnimation } from '@festiveui/next';\n\n`;
    const components = layers
      .map((l: any) => {
        const cfg = JSON.stringify(l.config, null, 2);
        return `      <NextFestiveAnimation\n        type="${l.animationType}"\n        config={${cfg}}\n      />`;
      })
      .join('\n\n');

    return `${imports}export function FestiveHeroSection() {\n  return (\n    <section id="${target.replace('#', '')}" className="relative w-full overflow-hidden">\n${components}\n    </section>\n  );\n}`;
  }

  private generateVueCode(layers: any[], mode: string, target: string): string {
    const mountedCalls = layers
      .map((l: any) => {
        return `      FestiveUI.mount({\n        type: '${l.animationType}',\n        target: container.value,\n        config: ${JSON.stringify(l.config, null, 8)}\n      });`;
      })
      .join('\n\n');

    return `<template>\n  <div ref="container" class="festive-vue-container" style="position: relative; width: 100%; height: 400px;"></div>\n</template>\n\n<script setup>\nimport { ref, onMounted, onUnmounted } from 'vue';\nimport { FestiveUI } from '@festiveui/core';\n\nconst container = ref(null);\n\nonMounted(() => {\n  if (container.value) {\n${mountedCalls}\n  }\n});\n\nonUnmounted(() => {\n  FestiveUI.unmountAll();\n});\n</script>`;
  }

  private generateAngularCode(layers: any[], mode: string, target: string): string {
    return `import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';\nimport { FestiveUI } from '@festiveui/core';\n\n@Component({\n  selector: 'app-festive-banner',\n  template: '<div #festiveContainer class=\"festive-canvas\"></div>',\n  styles: ['.festive-canvas { position: relative; width: 100%; min-height: 400px; }']\n})\nexport class FestiveBannerComponent implements OnInit, OnDestroy {\n  @ViewChild('festiveContainer', { static: true }) container!: ElementRef;\n\n  ngOnInit() {\n    const el = this.container.nativeElement;\n${layers.map((l) => `    FestiveUI.mount({ type: '${l.animationType}', target: el, config: ${JSON.stringify(l.config)} });`).join('\n')}\n  }\n\n  ngOnDestroy() {\n    FestiveUI.unmountAll();\n  }\n}`;
  }

  private generateVanillaCode(layers: any[], mode: string, target: string): string {
    return `import { FestiveUI } from '@festiveui/core';\n\nconst targetEl = document.querySelector('${target}') || document.body;\n\n// Mount configured festival animations\n${layers.map((l) => `FestiveUI.mount({\n  type: '${l.animationType}',\n  target: targetEl,\n  config: ${JSON.stringify(l.config, null, 2)}\n});`).join('\n\n')}\n`;
  }

  private generateWebComponentCode(layers: any[]): string {
    const elements = layers
      .map((l: any) => {
        return `<!-- ${l.name} -->\n<festive-animation type="${l.animationType}" size="${l.config?.size || 80}" position="${l.config?.position || 'center'}"></festive-animation>`;
      })
      .join('\n\n');

    return `<script type="module" src="https://cdn.jsdelivr.net/npm/@festiveui/web-component/dist/index.js"></script>\n\n<div style="position: relative; width: 100%; height: 350px;">\n${elements}\n</div>`;
  }
}
