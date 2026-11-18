'use client';

import React from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { useStudioStore } from './studio-store';
import { FestiveAnimation } from '@festiveui/react';

export const PreviewModal: React.FC = () => {
  const store = useStudioStore();

  if (!store.previewModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] flex flex-col select-none overflow-hidden">
      {/* Top Preview Bar */}
      <div className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between shrink-0 bg-[#111827]">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-white text-sm">{store.projectTitle}</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
            Live Preview Mode
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            {store.canvasWidth} × {store.canvasHeight} px
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={store.restart}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="Restart Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={store.togglePlayback}
            className="px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center gap-1.5"
          >
            {store.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{store.isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={() => store.setPreviewModalOpen(false)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-700 ml-2"
          >
            <X className="w-4 h-4" />
            <span>Exit Preview</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport in Preview Mode */}
      <div
        className="flex-1 relative flex items-center justify-center p-6 overflow-auto"
        style={{ backgroundColor: store.backgroundColor }}
      >
        <div
          style={{
            width: `${store.canvasWidth}px`,
            height: `${store.canvasHeight}px`,
            backgroundColor: store.backgroundColor
          }}
          className="rounded-2xl border border-[#1F2937] shadow-2xl relative overflow-hidden shrink-0"
        >
          {store.layers.filter(l => l.visible).map(layer => {
            const layerStyle: React.CSSProperties = {
              position: 'absolute',
              left: `${layer.x}px`,
              top: `${layer.y}px`,
              width: `${layer.width}px`,
              height: `${layer.height}px`,
              transform: `rotate(${layer.rotation}deg) scale(${layer.scale})`,
              zIndex: layer.zIndex,
              opacity: layer.opacity,
              mixBlendMode: layer.blendMode
            };

            return (
              <div key={layer.id} style={layerStyle}>
                {layer.isText ? (
                  <div
                    className="w-full h-full flex items-center justify-center font-extrabold"
                    style={{
                      fontFamily: layer.fontFamily || 'serif',
                      fontSize: `${layer.fontSize || 40}px`,
                      color: layer.textColor || '#FFF',
                      textShadow: `0 0 15px ${layer.textGlow || '#F97316'}`
                    }}
                  >
                    {layer.textContent}
                  </div>
                ) : (
                  <FestiveAnimation
                    type={layer.animationSlug}
                    config={{
                      ...layer.settings,
                      size: layer.width,
                      speed: layer.speed,
                      loop: layer.loop
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
