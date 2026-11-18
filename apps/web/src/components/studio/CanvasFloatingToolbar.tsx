'use client';

import React from 'react';
import {
  MousePointer,
  Hand,
  Type,
  Sparkles,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useStudioStore } from './studio-store';

export const CanvasFloatingToolbar: React.FC = () => {
  const store = useStudioStore();

  const handleAddTextElement = () => {
    store.addLayer({
      id: `text-${Date.now().toString(36)}`,
      name: 'Custom Heading',
      animationSlug: 'custom-text',
      animationType: 'custom-text',
      isText: true,
      textContent: 'Festive Season',
      fontFamily: 'serif',
      fontSize: 48,
      fontWeight: '800',
      textColor: '#FCD34D',
      textGlow: '#F97316',
      visible: true,
      locked: false,
      x: Math.round(store.canvasWidth / 2 - 150),
      y: Math.round(store.canvasHeight / 2 - 40),
      width: 320,
      height: 80,
      rotation: 0,
      scale: 1,
      zIndex: 60,
      opacity: 1,
      blendMode: 'normal',
      speed: 1,
      loop: true,
      direction: 'normal',
      entranceEffect: 'scale-up',
      timelineStart: 0,
      timelineDuration: 10,
      settings: {}
    });
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-2xl bg-[#111827]/90 border border-[#1F2937] shadow-2xl backdrop-blur-md select-none">
      {/* Select Tool */}
      <button
        onClick={() => store.setActiveTool('select')}
        className={`p-2 rounded-xl transition-all ${
          store.activeTool === 'select'
            ? 'bg-primary-600 text-white font-bold shadow-md'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
        title="Select Tool (V)"
      >
        <MousePointer className="w-4 h-4" />
      </button>

      {/* Hand / Pan Tool */}
      <button
        onClick={() => store.setActiveTool('hand')}
        className={`p-2 rounded-xl transition-all ${
          store.activeTool === 'hand'
            ? 'bg-primary-600 text-white font-bold shadow-md'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
        title="Hand / Pan Workspace (H or Space + Drag)"
      >
        <Hand className="w-4 h-4" />
      </button>

      {/* Add Text Tool */}
      <button
        onClick={handleAddTextElement}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="Add Festive Typography Heading (T)"
      >
        <Type className="w-4 h-4 text-festive-gold" />
      </button>

      <span className="w-px h-5 bg-[#1F2937] mx-1" />

      {/* Quick Alignment Actions (Active when a layer is selected) */}
      <button
        onClick={() => store.alignLayers('left')}
        disabled={!store.selectedLayerId}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 transition-colors"
        title="Align to Left"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => store.alignLayers('center')}
        disabled={!store.selectedLayerId}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 transition-colors"
        title="Align to Horizontal Center"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => store.alignLayers('middle')}
        disabled={!store.selectedLayerId}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 transition-colors"
        title="Align to Vertical Middle"
      >
        <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
      </button>

      <span className="w-px h-5 bg-[#1F2937] mx-1" />

      {/* Fit to Screen */}
      <button
        onClick={store.resetPanZoom}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="Fit Artboard to Screen"
      >
        <Maximize2 className="w-4 h-4 text-primary-400" />
      </button>
    </div>
  );
};
