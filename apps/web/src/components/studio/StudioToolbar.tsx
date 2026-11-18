'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Magnet,
  Save,
  Eye,
  Code2,
  Crown,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Clock,
  RotateCw,
  Check,
  ChevronDown
} from 'lucide-react';
import { useStudioStore } from './studio-store';
import { CANVAS_PRESETS } from './types';

export const StudioToolbar: React.FC = () => {
  const store = useStudioStore();

  return (
    <header className="h-16 border-b border-[#1F2937] bg-[#111827] px-4 flex items-center justify-between gap-3 shrink-0 z-30 select-none overflow-x-auto scrollbar-none">
      {/* ============================================================ */}
      {/* 1. LEFT GROUP: Navigation, Title & Save Status               */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-semibold"
          title="Return to Application Control Center"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-primary-400" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {/* Sidebar Toggle */}
        <button
          onClick={store.toggleLeftSidebar}
          className={`p-1.5 rounded-xl border transition-all ${
            store.isLeftSidebarOpen
              ? 'bg-[#0B0F19] text-primary-400 border-primary-500/40'
              : 'bg-[#0B0F19] text-slate-400 border-[#1F2937] hover:text-white'
          }`}
          title={store.isLeftSidebarOpen ? 'Collapse Left Sidebar' : 'Expand Left Sidebar'}
        >
          {store.isLeftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2 pl-1 border-l border-[#1F2937]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-600 via-festive-gold to-festive-crimson p-0.5 flex-shrink-0">
            <div className="w-full h-full bg-[#0B0F19] rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
            </div>
          </div>
          <span className="text-xs font-extrabold text-white hidden xl:inline">
            Festive Studio <span className="text-primary-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary-500/15 border border-primary-500/30">v2.4</span>
          </span>
        </div>

        {/* Project Title Input */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl border border-transparent hover:border-[#1F2937] focus-within:border-primary-500 bg-transparent transition-all">
          <input
            type="text"
            value={store.projectTitle}
            onChange={(e) => store.setProjectTitle(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none w-32 sm:w-44 truncate"
            title="Click to rename project"
          />
        </div>

        {/* Real Save Status Badge */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono shrink-0 pl-1">
          {store.saveStatus === 'saved' && (
            <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <Check className="w-3 h-3" /> {store.lastSavedTime}
            </span>
          )}
          {store.saveStatus === 'saving' && (
            <span className="text-amber-400 animate-pulse flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              <RotateCw className="w-3 h-3 animate-spin" /> Saving...
            </span>
          )}
          {store.saveStatus === 'unsaved' && (
            <span className="text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              ● Unsaved
            </span>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. CENTER GROUP: Mode, Undo/Redo & Viewport Presets          */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mode Switcher */}
        <div className="flex items-center p-0.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-xs">
          <button
            onClick={() => store.setMode('canvas')}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
              store.mode === 'canvas' ? 'bg-primary-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mode A (Canvas)
          </button>
          <button
            onClick={() => store.setMode('website')}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
              store.mode === 'website' ? 'bg-primary-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mode B (DOM Target)
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-l border-[#1F2937] pl-2">
          <button
            onClick={store.undo}
            disabled={store.history.length === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={store.redo}
            disabled={store.future.length === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Viewport Presets */}
        <div className="hidden md:flex items-center gap-1 p-0.5 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
          <button
            onClick={() => store.setCanvasPreset('fhd')}
            className={`p-1.5 rounded-lg transition-colors ${
              store.canvasWidth === 1920 ? 'bg-[#111827] text-primary-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 1080p (1920 × 1080)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => store.setCanvasPreset('laptop')}
            className={`p-1.5 rounded-lg transition-colors ${
              store.canvasWidth === 1440 ? 'bg-[#111827] text-primary-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Laptop (1440 × 900)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => store.setCanvasPreset('story')}
            className={`p-1.5 rounded-lg transition-colors ${
              store.canvasWidth === 1080 && store.canvasHeight === 1920 ? 'bg-[#111827] text-primary-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile Portrait (1080 × 1920)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. RIGHT GROUP: Canvas Preset, Zoom, Grid, Actions           */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 shrink-0 text-xs">
        {/* Canvas Dimension Presets Dropdown */}
        <div className="hidden xl:flex items-center gap-1 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-2 py-1">
          <select
            value={store.canvasPreset}
            onChange={(e) => store.setCanvasPreset(e.target.value)}
            className="bg-transparent text-[11px] font-mono text-slate-300 focus:outline-none cursor-pointer"
          >
            {CANVAS_PRESETS.map(p => (
              <option key={p.id} value={p.id} className="bg-[#111827] text-white">
                {p.name} ({p.width}×{p.height})
              </option>
            ))}
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-1.5 py-0.5">
          <button
            onClick={() => store.setZoom(Number((store.zoom - 0.1).toFixed(2)))}
            className="p-1 text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-9 text-center font-bold text-white">
            {Math.round(store.zoom * 100)}%
          </span>
          <button
            onClick={() => store.setZoom(Number((store.zoom + 0.1).toFixed(2)))}
            className="p-1 text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={store.resetPanZoom}
            className="p-1 text-slate-400 hover:text-primary-400 border-l border-[#1F2937] pl-1.5"
            title="Fit to Screen (Reset View)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid & Snap Toggles */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={store.toggleGrid}
            className={`p-1.5 rounded-xl border transition-all ${
              store.showGrid
                ? 'bg-primary-500/20 text-primary-300 border-primary-500/40'
                : 'bg-[#0B0F19] text-slate-500 border-[#1F2937]'
            }`}
            title="Toggle Alignment Grid (20px)"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={store.toggleSnap}
            className={`p-1.5 rounded-xl border transition-all ${
              store.snapToGrid
                ? 'bg-primary-500/20 text-primary-300 border-primary-500/40'
                : 'bg-[#0B0F19] text-slate-500 border-[#1F2937]'
            }`}
            title="Toggle Snap to Grid"
          >
            <Magnet className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={() => store.saveProject()}
          disabled={store.saveStatus === 'saving'}
          className="px-3 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-white font-semibold flex items-center gap-1.5 transition-colors"
          title="Save Project (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5 text-primary-400" />
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Timeline Toggle Button */}
        <button
          onClick={store.toggleTimeline}
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold text-xs transition-all ${
            store.timelineOpen
              ? 'bg-primary-600 text-white border-primary-500 shadow-md'
              : 'bg-[#0B0F19] hover:bg-slate-800 text-slate-300 border-[#1F2937] hover:text-white'
          }`}
          title={store.timelineOpen ? 'Hide Animation Timeline' : 'Open Animation Timeline (Tracks & Timing)'}
        >
          <Clock className="w-3.5 h-3.5 text-festive-gold" />
          <span className="hidden sm:inline">Timeline</span>
          <span className="text-[10px] font-mono px-1 rounded bg-black/30 text-white font-bold">
            {store.layers.length}
          </span>
        </button>

        {/* Live Preview Button */}
        <button
          onClick={() => store.setPreviewModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-slate-200 hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
          title="Distraction-Free Live Preview"
        >
          <Eye className="w-3.5 h-3.5 text-festive-gold" />
          <span className="hidden md:inline">Preview</span>
        </button>

        {/* Export Code Button */}
        <button
          onClick={() => store.setExportModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold shadow-md glow-primary flex items-center gap-1.5 transition-all"
        >
          <Code2 className="w-3.5 h-3.5 text-festive-gold" />
          <span>Export</span>
        </button>

        {/* Publish to Marketplace Button */}
        <button
          onClick={() => store.setPublishModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:text-white font-bold transition-all"
        >
          <Crown className="w-3.5 h-3.5 text-festive-gold" />
          <span>Publish</span>
        </button>

        {/* Inspector Toggle */}
        <button
          onClick={store.toggleRightInspector}
          className={`p-1.5 rounded-xl border transition-all ${
            store.isRightInspectorOpen
              ? 'bg-[#0B0F19] text-primary-400 border-primary-500/40'
              : 'bg-[#0B0F19] text-slate-400 border-[#1F2937] hover:text-white'
          }`}
          title={store.isRightInspectorOpen ? 'Collapse Inspector' : 'Expand Inspector'}
        >
          {store.isRightInspectorOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
