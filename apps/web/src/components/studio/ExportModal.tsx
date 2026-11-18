'use client';

import React, { useState, useMemo } from 'react';
import { Code2, X, Download, Copy, Check } from 'lucide-react';
import { useStudioStore } from './studio-store';

export const ExportModal: React.FC = () => {
  const store = useStudioStore();
  const [framework, setFramework] = useState<'react' | 'next' | 'vue' | 'angular' | 'vanilla' | 'web-component' | 'json'>('react');
  const [copied, setCopied] = useState(false);

  const generatedCode = useMemo(() => {
    const activeLayers = store.layers.filter(l => l.visible);

    switch (framework) {
      case 'react':
        return `import React from 'react';\nimport { FestiveAnimation } from '@festiveui/react';\n\nexport default function FestiveBanner() {\n  return (\n    <div\n      className="festive-scene-container"\n      style={{\n        position: 'relative',\n        width: '100%',\n        minHeight: '480px',\n        backgroundColor: '${store.backgroundColor}',\n        overflow: 'hidden'\n      }}\n    >\n${activeLayers.map(l => {
          if (l.isText) {
            return `      {/* Text: ${l.name} */}\n      <div\n        style={{\n          position: 'absolute',\n          left: '${l.x}px',\n          top: '${l.y}px',\n          zIndex: ${l.zIndex},\n          fontFamily: '${l.fontFamily || 'serif'}',\n          fontSize: '${l.fontSize || 40}px',\n          fontWeight: '${l.fontWeight || '800'}',\n          color: '${l.textColor || '#FFF'}',\n          textShadow: '0 0 15px ${l.textGlow || '#F97316'}'\n        }}\n      >\n        ${l.textContent}\n      </div>`;
          }
          return `      {/* ${l.name} */}\n      <div\n        style={{\n          position: 'absolute',\n          left: '${l.x}px',\n          top: '${l.y}px',\n          width: '${l.width}px',\n          height: '${l.height}px',\n          zIndex: ${l.zIndex},\n          transform: 'rotate(${l.rotation}deg)',\n          opacity: ${l.opacity}\n        }}\n      >\n        <FestiveAnimation\n          type="${l.animationSlug}"\n          config={${JSON.stringify({ ...l.settings, speed: l.speed, loop: l.loop }, null, 10)}}\n        />\n      </div>`;
        }).join('\n\n')}\n    </div>\n  );\n}`;

      case 'next':
        return `'use client';\n\nimport React from 'react';\nimport { NextFestiveAnimation } from '@festiveui/next';\n\nexport function FestiveHeroSection() {\n  return (\n    <section\n      id="${store.targetSelector.replace('#', '')}"\n      className="relative w-full min-h-[480px] overflow-hidden"\n      style={{ backgroundColor: '${store.backgroundColor}' }}\n    >\n${activeLayers.map(l => {
          if (l.isText) {
            return `      <h1\n        style={{\n          position: 'absolute',\n          left: '${l.x}px',\n          top: '${l.y}px',\n          fontSize: '${l.fontSize || 40}px',\n          color: '${l.textColor || '#FFF'}'\n        }}\n      >\n        ${l.textContent}\n      </h1>`;
          }
          return `      <div style={{ position: 'absolute', left: '${l.x}px', top: '${l.y}px' }}>\n        <NextFestiveAnimation type="${l.animationSlug}" config={${JSON.stringify(l.settings)}} />\n      </div>`;
        }).join('\n')}\n    </section>\n  );\n}`;

      case 'vue':
        return `<template>\n  <div class="festive-scene" :style="{ backgroundColor: '${store.backgroundColor}' }">\n${activeLayers.map(l => `    <!-- ${l.name} -->\n    <div class="layer" style="position: absolute; left: ${l.x}px; top: ${l.y}px; z-index: ${l.zIndex};">\n      <FestiveAnimation type="${l.animationSlug}" :config="${JSON.stringify(l.settings).replace(/"/g, "'")}" />\n    </div>`).join('\n')}\n  </div>\n</template>\n\n<script setup>\nimport { FestiveAnimation } from '@festiveui/vue';\n</script>`;

      case 'angular':
        return `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-festive-hero',\n  template: \`\n    <div class="festive-canvas" style="background-color: ${store.backgroundColor}; position: relative; width: 100%; height: 480px;">\n${activeLayers.map(l => `      <festive-animation type="${l.animationSlug}" [config]="config_${l.id.replace(/-/g, '_')}"></festive-animation>`).join('\n')}\n    </div>\n  \`\n})\nexport class FestiveHeroComponent {\n${activeLayers.map(l => `  config_${l.id.replace(/-/g, '_')} = ${JSON.stringify(l.settings)};`).join('\n')}\n}`;

      case 'vanilla':
        return `<!-- FestiveUI Vanilla Web Integration -->\n<div id="festive-container" style="position: relative; width: 100%; height: 480px; background: ${store.backgroundColor}; overflow: hidden;"></div>\n\n<script type="module">\n  import { FestiveUI } from 'https://cdn.jsdelivr.net/npm/@festiveui/core/dist/index.js';\n  const container = document.getElementById('festive-container');\n\n${activeLayers.map(l => `  FestiveUI.mount({\n    type: '${l.animationSlug}',\n    target: container,\n    config: {\n      x: ${l.x},\n      y: ${l.y},\n      size: ${l.width},\n      ...${JSON.stringify(l.settings)}\n    }\n  });`).join('\n\n')}\n</script>`;

      case 'web-component':
        return `<!-- FestiveUI Web Component Integration -->\n<script type="module" src="https://cdn.jsdelivr.net/npm/@festiveui/web-component/dist/index.js"></script>\n\n<div style="position: relative; width: 100%; height: 480px; background: ${store.backgroundColor};">\n${activeLayers.map(l => `  <festive-animation type="${l.animationSlug}" x="${l.x}" y="${l.y}" size="${l.width}"></festive-animation>`).join('\n')}\n</div>`;

      case 'json':
      default:
        return JSON.stringify({
          version: '2.4.0',
          title: store.projectTitle,
          mode: store.mode,
          targetSelector: store.targetSelector,
          canvasWidth: store.canvasWidth,
          canvasHeight: store.canvasHeight,
          backgroundColor: store.backgroundColor,
          totalDuration: store.totalDuration,
          layers: store.layers
        }, null, 2);
    }
  }, [framework, store.layers, store.backgroundColor, store.projectTitle, store.mode, store.targetSelector, store.canvasWidth, store.canvasHeight, store.totalDuration]);

  if (!store.exportModalOpen) return null;

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      react: 'tsx',
      next: 'tsx',
      vue: 'vue',
      angular: 'ts',
      vanilla: 'html',
      'web-component': 'html',
      json: 'json'
    };
    const extension = extMap[framework] || 'js';
    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FestiveScene.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-3xl rounded-3xl border border-[#1F2937] bg-[#111827] p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-bold text-white">Export Integration Code</h3>
          </div>
          <button onClick={() => store.setExportModalOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framework Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'react', label: 'React' },
            { id: 'next', label: 'Next.js' },
            { id: 'vue', label: 'Vue 3' },
            { id: 'angular', label: 'Angular' },
            { id: 'vanilla', label: 'Vanilla JS' },
            { id: 'web-component', label: 'Web Component' },
            { id: 'json', label: 'JSON Schema' }
          ].map(fw => (
            <button
              key={fw.id}
              onClick={() => setFramework(fw.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                framework === fw.id
                  ? 'bg-primary-600 text-white font-bold shadow-md'
                  : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-[#1F2937]'
              }`}
            >
              {fw.label}
            </button>
          ))}
        </div>

        {/* Code Output Box */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#0B0F19] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#111827]/70 border-b border-[#1F2937] text-xs text-slate-400">
            <span className="font-mono text-slate-300">Target: {framework.toUpperCase()}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0B0F19] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1F2937]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 text-xs font-mono text-emerald-400 max-h-80 overflow-y-auto leading-relaxed">
            <code>{generatedCode}</code>
          </pre>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Installation: <strong className="font-mono text-white">npm install @festiveui/react @festiveui/core</strong></span>
          <button
            onClick={() => store.setExportModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
