'use client';

import React from 'react';
import {
  Sliders,
  Palette,
  Grid,
  Magnet,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Sparkles,
  Crown,
  Keyboard,
  Info
} from 'lucide-react';
import { useStudioStore } from './studio-store';
import { CANVAS_PRESETS } from './types';

export const CanvasSettingsPanel: React.FC = () => {
  const store = useStudioStore();

  const THEME_COLORS = [
    { name: 'Deep Space', value: '#0B0F19' },
    { name: 'Midnight', value: '#050811' },
    { name: 'Royal Purple', value: '#180D2B' },
    { name: 'Diwali Dark', value: '#1C1004' },
    { name: 'Crimson Noir', value: '#1A0A0A' },
    { name: 'Emerald Night', value: '#041812' },
    { name: 'Pitch Black', value: '#000000' }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-5 text-xs select-none scrollbar-thin scrollbar-thumb-slate-800">
      {/* ------------------------------------------------------------ */}
      {/* SECTION 1: CANVAS SIZE & PRESETS                             */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#1F2937]/60">
          <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider text-[11px]">
            <Sliders className="w-3.5 h-3.5 text-primary-400" />
            <span>Canvas Size & Dimensions</span>
          </div>
          <span className="text-[10px] font-mono text-primary-400 font-bold bg-primary-500/15 px-1.5 py-0.5 rounded border border-primary-500/30">
            {store.canvasWidth} × {store.canvasHeight}
          </span>
        </div>

        {/* Preset Selector */}
        <div>
          <label className="text-[10px] text-slate-400 font-medium block mb-1">Preset Template</label>
          <select
            value={store.canvasPreset}
            onChange={(e) => store.setCanvasPreset(e.target.value)}
            className="w-full px-2.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white text-xs focus:outline-none focus:border-primary-500"
          >
            {CANVAS_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.width} × {p.height})
              </option>
            ))}
          </select>
        </div>

        {/* Custom Width & Height Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-1">Custom Width (px)</label>
            <input
              type="number"
              min={200}
              max={3840}
              value={store.canvasWidth}
              onChange={(e) => store.setCanvasDimensions(Number(e.target.value), store.canvasHeight)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono text-xs focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-1">Custom Height (px)</label>
            <input
              type="number"
              min={200}
              max={2160}
              value={store.canvasHeight}
              onChange={(e) => store.setCanvasDimensions(store.canvasWidth, Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white font-mono text-xs focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Quick Aspect Ratio Shortcut Buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => store.setCanvasDimensions(1920, 1080)}
            className="flex-1 py-1 rounded-lg bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 text-[10px] font-mono text-center transition-colors"
          >
            16:9 HD
          </button>
          <button
            onClick={() => store.setCanvasDimensions(1080, 1080)}
            className="flex-1 py-1 rounded-lg bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 text-[10px] font-mono text-center transition-colors"
          >
            1:1 Square
          </button>
          <button
            onClick={() => store.setCanvasDimensions(1080, 1920)}
            className="flex-1 py-1 rounded-lg bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 text-[10px] font-mono text-center transition-colors"
          >
            9:16 Reel
          </button>
          <button
            onClick={() => store.setCanvasDimensions(1200, 628)}
            className="flex-1 py-1 rounded-lg bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 text-[10px] font-mono text-center transition-colors"
          >
            Banner
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* SECTION 2: CANVAS BACKGROUND STYLING                         */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-3 pt-2 border-t border-[#1F2937]">
        <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider text-[11px]">
          <Palette className="w-3.5 h-3.5 text-festive-gold" />
          <span>Canvas Styling & Background</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-300">Color Palette</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400 text-[10px]">{store.backgroundColor}</span>
            <input
              type="color"
              value={store.backgroundColor}
              onChange={(e) => store.setBackgroundColor(e.target.value)}
              className="w-7 h-7 rounded-lg bg-transparent cursor-pointer border border-[#1F2937]"
            />
          </div>
        </div>

        {/* Quick Swatches */}
        <div className="flex items-center gap-1.5">
          {THEME_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => store.setBackgroundColor(c.value)}
              style={{ backgroundColor: c.value }}
              className={`w-6 h-6 rounded-lg border transition-transform ${
                store.backgroundColor === c.value ? 'border-primary-400 scale-110 shadow-md ring-1 ring-primary-500' : 'border-[#1F2937] hover:scale-105'
              }`}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* SECTION 3: GRID, SNAPPING & GUIDES                           */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-3 pt-2 border-t border-[#1F2937]">
        <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider text-[11px]">
          <Grid className="w-3.5 h-3.5 text-blue-400" />
          <span>Grid & Alignment</span>
        </div>

        <div className="space-y-2">
          {/* Show Grid Toggle */}
          <label className="flex items-center justify-between p-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] cursor-pointer hover:border-slate-700 transition-colors">
            <span className="text-slate-300">Show Dot Grid</span>
            <input
              type="checkbox"
              checked={store.showGrid}
              onChange={store.toggleGrid}
              className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
            />
          </label>

          {/* Snap to Grid Toggle */}
          <label className="flex items-center justify-between p-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] cursor-pointer hover:border-slate-700 transition-colors">
            <span className="text-slate-300">Snap to Grid</span>
            <input
              type="checkbox"
              checked={store.snapToGrid}
              onChange={store.toggleSnap}
              className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
            />
          </label>

          {/* Grid Step Size */}
          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400">
            <span>Grid Step Size</span>
            <div className="flex gap-1">
              {[10, 20, 40].map((step) => (
                <button
                  key={step}
                  onClick={() => store.setCanvasPreset(store.canvasPreset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    store.gridSize === step ? 'bg-primary-600 text-white font-bold' : 'bg-[#0B0F19] text-slate-400'
                  }`}
                >
                  {step}px
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* SECTION 4: INTEGRATION & TARGET DOM MODE                     */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-3 pt-2 border-t border-[#1F2937]">
        <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider text-[11px]">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Integration & Runtime Mode</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
          <button
            onClick={() => store.setMode('canvas')}
            className={`py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
              store.mode === 'canvas' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mode A: Canvas
          </button>
          <button
            onClick={() => store.setMode('website')}
            className={`py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
              store.mode === 'website' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mode B: DOM
          </button>
        </div>

        {store.mode === 'website' && (
          <div className="space-y-1.5 bg-[#0B0F19] p-2.5 rounded-xl border border-[#1F2937]">
            <span className="text-[10px] text-slate-400 font-medium block">Target DOM Selector</span>
            <input
              type="text"
              value={store.targetSelector}
              onChange={(e) => store.setTargetSelector(e.target.value)}
              placeholder="#hero, .product-banner"
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1F2937] text-white font-mono text-xs focus:outline-none focus:border-primary-500"
            />
            <p className="text-[10px] text-slate-500">
              When integrated into website, FestiveUI runtime will anchor directly to this element.
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* SECTION 5: MARKETPLACE PUBLISHING SHORTCUT                  */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-2 pt-2 border-t border-[#1F2937]">
        <button
          onClick={() => store.setPublishModalOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <Crown className="w-4 h-4 text-festive-gold" />
          <span>Publish to FestiveUI Marketplace</span>
        </button>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* SECTION 6: KEYBOARD SHORTCUTS CHEAT SHEET                   */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-2 pt-2 border-t border-[#1F2937]">
        <div className="flex items-center gap-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
          <Keyboard className="w-3.5 h-3.5" />
          <span>Keyboard Shortcuts</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-400 font-mono">
          <div className="flex justify-between py-0.5">
            <span className="text-slate-300">Space + Drag</span>
            <span>Pan Canvas</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-300">Space</span>
            <span>Play / Pause</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-300">Ctrl + Z</span>
            <span>Undo</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-300">Ctrl + D</span>
            <span>Duplicate Layer</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-300">Ctrl + S</span>
            <span>Save Project</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-300">Del / Backspace</span>
            <span>Delete Layer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
