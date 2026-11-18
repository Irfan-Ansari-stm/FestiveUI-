'use client';

import React from 'react';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Type,
  Sparkles
} from 'lucide-react';
import { useStudioStore } from './studio-store';

export const LayersPanel: React.FC = () => {
  const store = useStudioStore();

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-3.5 space-y-2 text-xs select-none">
      <div className="flex items-center justify-between text-slate-400 pb-1 shrink-0">
        <span className="font-semibold">Canvas Hierarchy</span>
        <span className="font-mono text-primary-400 font-bold">{store.layers.length} Layers</span>
      </div>

      {store.layers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
          <Layers className="w-8 h-8 opacity-30 text-primary-400" />
          <p>Artboard is empty. Click on any item from Library or Templates to add to canvas.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
          {store.layers.map((layer, index) => {
            const isSelected = store.selectedLayerId === layer.id;

            return (
              <div
                key={layer.id}
                onClick={() => store.selectLayer(layer.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-primary-500 bg-primary-950/20'
                    : 'border-[#1F2937] bg-[#0B0F19] hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">#{index + 1}</span>
                  {layer.isText ? (
                    <Type className="w-3.5 h-3.5 text-festive-gold shrink-0" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-white truncate">{layer.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Reorder Z-Index */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.reorderLayerZ(layer.id, 'up');
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Bring Forward"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.reorderLayerZ(layer.id, 'down');
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Send Backward"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Visibility Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.updateLayer(layer.id, { visible: !layer.visible });
                    }}
                    className={`p-1 rounded text-slate-400 hover:text-white ${!layer.visible ? 'opacity-30' : ''}`}
                    title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                  >
                    {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                  </button>

                  {/* Lock Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.updateLayer(layer.id, { locked: !layer.locked });
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                  >
                    {layer.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.duplicateLayer(layer.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Duplicate Layer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.deleteLayer(layer.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-400"
                    title="Delete Layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
