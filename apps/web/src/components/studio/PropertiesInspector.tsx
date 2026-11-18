'use client';

import React from 'react';
import {
  Settings2,
  Sliders,
  Type,
  Maximize2,
  Palette,
  Grid,
  Magnet,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStudioStore } from './studio-store';
import { CANVAS_PRESETS } from './types';

export const PropertiesInspector: React.FC = () => {
  const store = useStudioStore();

  if (!store.isRightInspectorOpen) return null;

  const selectedLayer = store.layers.find(l => l.id === store.selectedLayerId) || null;

  return (
    <aside className="w-72 sm:w-80 border-l border-[#1F2937] bg-[#111827] flex flex-col shrink-0 z-20 overflow-hidden select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-[#1F2937] flex items-center justify-between bg-[#0B0F19] shrink-0">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary-400" />
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">Inspector</h3>
        </div>
        {selectedLayer ? (
          <span className="text-[10px] font-mono text-primary-400 font-bold px-1.5 py-0.5 rounded bg-primary-500/15 border border-primary-500/30 truncate max-w-[120px]">
            {selectedLayer.animationSlug}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-400 font-bold">Artboard</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* ============================================================ */}
        {/* CASE A: NO ELEMENT SELECTED -> SHOW ARTBOARD & CANVAS SPECS  */}
        {/* ============================================================ */}
        {!selectedLayer ? (
          <div className="space-y-4">
            <div>
              <span className="font-bold text-white block mb-2">Artboard Dimensions</span>
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Preset Size</span>
                  <select
                    value={store.canvasPreset}
                    onChange={(e) => store.setCanvasPreset(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white"
                  >
                    {CANVAS_PRESETS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.width}×{p.height})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Width (px)</span>
                    <input
                      type="number"
                      value={store.canvasWidth}
                      onChange={(e) => store.setCanvasDimensions(Number(e.target.value), store.canvasHeight)}
                      className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Height (px)</span>
                    <input
                      type="number"
                      value={store.canvasHeight}
                      onChange={(e) => store.setCanvasDimensions(store.canvasWidth, Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F2937] space-y-3">
              <span className="font-bold text-white block">Canvas Styling</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Background Color</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[10px]">{store.backgroundColor}</span>
                  <input
                    type="color"
                    value={store.backgroundColor}
                    onChange={(e) => store.setBackgroundColor(e.target.value)}
                    className="w-8 h-7 rounded border border-[#1F2937] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F2937] space-y-3">
              <span className="font-bold text-white block">Grid & Alignment</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Show Alignment Grid</span>
                <input
                  type="checkbox"
                  checked={store.showGrid}
                  onChange={store.toggleGrid}
                  className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Snap to Grid</span>
                <input
                  type="checkbox"
                  checked={store.snapToGrid}
                  onChange={store.toggleSnap}
                  className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Grid Step Size</span>
                <span className="font-mono text-primary-400 font-bold">{store.gridSize}px</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-[#1F2937] text-slate-400 space-y-1.5 text-[11px]">
              <span className="font-bold text-white block">Quick Tips</span>
              <p>• Click on any layer on the canvas to inspect and edit its parameters.</p>
              <p>• Hold <strong className="text-white">Space + Drag</strong> to pan the workspace.</p>
              <p>• Press <strong className="text-white">Ctrl + D</strong> to duplicate elements.</p>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* CASE B: ELEMENT SELECTED -> SHOW CONTEXTUAL INSPECTOR        */
          /* ============================================================ */
          <div className="space-y-4">
            {/* 1. IDENTITY & GENERAL */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Layer Name</label>
                <input
                  type="text"
                  value={selectedLayer.name}
                  onChange={(e) => store.updateLayer(selectedLayer.id, { name: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500 font-semibold"
                />
              </div>

              {/* Action Buttons: Lock, Visibility, Duplicate, Delete */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => store.updateLayer(selectedLayer.id, { locked: !selectedLayer.locked })}
                  className={`flex-1 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1.5 ${
                    selectedLayer.locked
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'bg-[#0B0F19] border-[#1F2937] text-slate-300 hover:text-white'
                  }`}
                >
                  {selectedLayer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{selectedLayer.locked ? 'Locked' : 'Unlocked'}</span>
                </button>

                <button
                  onClick={() => store.updateLayer(selectedLayer.id, { visible: !selectedLayer.visible })}
                  className={`flex-1 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1.5 ${
                    !selectedLayer.visible
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      : 'bg-[#0B0F19] border-[#1F2937] text-slate-300 hover:text-white'
                  }`}
                >
                  {selectedLayer.visible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                  <span>{selectedLayer.visible ? 'Visible' : 'Hidden'}</span>
                </button>

                <button
                  onClick={() => store.duplicateLayer(selectedLayer.id)}
                  className="p-1.5 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-slate-300 hover:text-white"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => store.deleteLayer(selectedLayer.id)}
                  className="p-1.5 rounded-lg bg-[#0B0F19] border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. TEXT TYPOGRAPHY (IF TEXT LAYER) */}
            {selectedLayer.isText && (
              <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-[#1F2937] space-y-2.5">
                <span className="font-bold text-festive-gold flex items-center gap-1.5 text-xs">
                  <Type className="w-3.5 h-3.5" /> Greeting Content
                </span>
                <input
                  type="text"
                  value={selectedLayer.textContent || ''}
                  onChange={(e) => store.updateLayer(selectedLayer.id, { textContent: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Font Family</span>
                    <select
                      value={selectedLayer.fontFamily || 'serif'}
                      onChange={(e) => store.updateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                      className="w-full px-2 py-1 rounded-lg bg-[#111827] border border-[#1F2937] text-white text-xs"
                    >
                      <option value="serif">Cinzel / Serif</option>
                      <option value="sans-serif">Inter / Sans</option>
                      <option value="monospace">Futuristic Monospace</option>
                      <option value="cursive">Calligraphy Cursive</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Font Size (px)</span>
                    <input
                      type="number"
                      value={selectedLayer.fontSize || 48}
                      onChange={(e) => store.updateLayer(selectedLayer.id, { fontSize: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded-lg bg-[#111827] border border-[#1F2937] text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Text Color</span>
                    <input
                      type="color"
                      value={selectedLayer.textColor || '#FCD34D'}
                      onChange={(e) => store.updateLayer(selectedLayer.id, { textColor: e.target.value })}
                      className="w-full h-7 rounded-lg bg-[#111827] border border-[#1F2937] cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Glow / Shadow</span>
                    <input
                      type="color"
                      value={selectedLayer.textGlow || '#F97316'}
                      onChange={(e) => store.updateLayer(selectedLayer.id, { textGlow: e.target.value })}
                      className="w-full h-7 rounded-lg bg-[#111827] border border-[#1F2937] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. TRANSFORM & COORDINATES */}
            <div className="space-y-2 pt-2 border-t border-[#1F2937]">
              <span className="font-bold text-white block">Position & Dimensions</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">X Position (px)</span>
                  <input
                    type="number"
                    value={selectedLayer.x}
                    onChange={(e) => store.updateLayer(selectedLayer.id, { x: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Y Position (px)</span>
                  <input
                    type="number"
                    value={selectedLayer.y}
                    onChange={(e) => store.updateLayer(selectedLayer.id, { y: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Width (px)</span>
                  <input
                    type="number"
                    value={selectedLayer.width}
                    onChange={(e) => store.updateLayer(selectedLayer.id, { width: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Height (px)</span>
                  <input
                    type="number"
                    value={selectedLayer.height}
                    onChange={(e) => store.updateLayer(selectedLayer.id, { height: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono"
                  />
                </div>
              </div>

              {/* Rotation Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Rotation</span>
                  <span className="font-mono text-primary-400">{selectedLayer.rotation}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={selectedLayer.rotation}
                  onChange={(e) => store.updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })}
                  className="w-full accent-primary-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 4. APPEARANCE & BLEND */}
            <div className="space-y-2.5 pt-2 border-t border-[#1F2937]">
              <span className="font-bold text-white block">Appearance</span>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Opacity</span>
                  <span className="font-mono text-primary-400">{Math.round(selectedLayer.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={1.0}
                  step={0.05}
                  value={selectedLayer.opacity}
                  onChange={(e) => store.updateLayer(selectedLayer.id, { opacity: Number(e.target.value) })}
                  className="w-full accent-primary-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Blend Mode</span>
                  <select
                    value={selectedLayer.blendMode}
                    onChange={(e) => store.updateLayer(selectedLayer.id, { blendMode: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="screen">Screen (Glow)</option>
                    <option value="lighten">Lighten</option>
                    <option value="overlay">Overlay</option>
                    <option value="multiply">Multiply</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Z-Index Stack</span>
                  <input
                    type="number"
                    value={selectedLayer.zIndex}
                    onChange={(e) => store.updateLayer(selectedLayer.id, { zIndex: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 5. ANIMATION BEHAVIOR */}
            <div className="space-y-2.5 pt-2 border-t border-[#1F2937]">
              <span className="font-bold text-white block">Animation Settings</span>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Playback Speed</span>
                  <span className="font-mono text-primary-400">{selectedLayer.speed}x</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={3.0}
                  step={0.1}
                  value={selectedLayer.speed}
                  onChange={(e) => store.updateLayer(selectedLayer.id, { speed: Number(e.target.value) })}
                  className="w-full accent-primary-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300 font-semibold">Infinite Loop</span>
                <input
                  type="checkbox"
                  checked={selectedLayer.loop}
                  onChange={(e) => store.updateLayer(selectedLayer.id, { loop: e.target.checked })}
                  className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* 6. DYNAMIC SCHEMA PARAMETERS */}
            {selectedLayer.settings && Object.keys(selectedLayer.settings).length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[#1F2937]">
                <span className="font-bold text-festive-gold block">Custom Parameters</span>

                {Object.entries(selectedLayer.settings).map(([key, val]) => {
                  if (typeof val === 'number') {
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-mono text-primary-400">{val}</span>
                        </div>
                        <input
                          type="range"
                          min={0.1}
                          max={val > 10 ? 300 : 2.0}
                          step={val > 10 ? 5 : 0.05}
                          value={val}
                          onChange={(e) => {
                            const num = Number(e.target.value);
                            store.updateLayer(selectedLayer.id, {
                              settings: { ...selectedLayer.settings, [key]: num }
                            });
                          }}
                          className="w-full accent-primary-500 cursor-pointer"
                        />
                      </div>
                    );
                  }

                  if (typeof val === 'boolean') {
                    return (
                      <div key={key} className="flex items-center justify-between py-1">
                        <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={(e) => {
                            store.updateLayer(selectedLayer.id, {
                              settings: { ...selectedLayer.settings, [key]: e.target.checked }
                            });
                          }}
                          className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
                        />
                      </div>
                    );
                  }

                  if (typeof val === 'string' && val.startsWith('#')) {
                    return (
                      <div key={key} className="flex items-center justify-between py-1">
                        <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <input
                          type="color"
                          value={val}
                          onChange={(e) => {
                            store.updateLayer(selectedLayer.id, {
                              settings: { ...selectedLayer.settings, [key]: e.target.value }
                            });
                          }}
                          className="w-8 h-6 rounded border border-[#1F2937] cursor-pointer"
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
