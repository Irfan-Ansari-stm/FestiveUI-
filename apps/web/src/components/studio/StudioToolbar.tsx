'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  Eye,
  Code2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Clock,
  RotateCw,
  Check,
  Sliders
} from 'lucide-react';
import { useStudioStore } from './studio-store';
import { CANVAS_PRESETS } from './types';

export const StudioToolbar: React.FC = () => {
  const store = useStudioStore();

  return (
    <header className="h-16 border-b border-[#1F2937] bg-[#111827] px-4 flex items-center justify-between gap-3 shrink-0 z-30 select-none overflow-hidden">
      {/* ============================================================ */}
      {/* 1. LEFT GROUP: Navigation, Title & Save Status               */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 shrink-0">
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

        {/* Studio Brand Icon & Title */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#1F2937]/80">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-600 via-festive-gold to-festive-crimson p-0.5 flex-shrink-0">
            <div className="w-full h-full bg-[#0B0F19] rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={store.projectTitle}
              onChange={(e) => store.setProjectTitle(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none w-28 sm:w-40 truncate border-b border-transparent hover:border-[#1F2937] focus:border-primary-500"
              title="Click to rename project"
            />
          </div>
        </div>

        {/* Save Status Indicator */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono shrink-0">
          {store.saveStatus === 'saved' && (
            <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <Check className="w-3 h-3" /> <span className="hidden xl:inline">{store.lastSavedTime}</span>
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
      {/* 2. CENTER GROUP: CANVAS SIZE, CUSTOM SIZE & ZOOM            */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Preset Selector */}
        <div className="hidden md:flex items-center gap-1 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-2 py-1">
          <select
            value={store.canvasPreset}
            onChange={(e) => store.setCanvasPreset(e.target.value)}
            className="bg-transparent text-[11px] font-mono text-slate-300 focus:outline-none cursor-pointer"
            title="Choose canvas preset"
          >
            {CANVAS_PRESETS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#111827] text-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* DIRECT CUSTOM SIZE INPUTS (Width × Height) */}
        <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-2 py-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px] font-bold">W:</span>
          <input
            type="number"
            min={200}
            max={3840}
            value={store.canvasWidth}
            onChange={(e) => store.setCanvasDimensions(Number(e.target.value), store.canvasHeight)}
            className="w-12 bg-transparent text-white font-mono font-bold text-xs focus:outline-none focus:text-primary-400 text-center"
            title="Custom Canvas Width (px)"
          />
          <span className="text-slate-600 font-mono">×</span>
          <span className="text-slate-400 font-mono text-[11px] font-bold">H:</span>
          <input
            type="number"
            min={200}
            max={2160}
            value={store.canvasHeight}
            onChange={(e) => store.setCanvasDimensions(store.canvasWidth, Number(e.target.value))}
            className="w-12 bg-transparent text-white font-mono font-bold text-xs focus:outline-none focus:text-primary-400 text-center"
            title="Custom Canvas Height (px)"
          />
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">px</span>
        </div>

        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-0.5 border-l border-[#1F2937] pl-2">
          <button
            onClick={store.undo}
            disabled={store.history.length === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={store.redo}
            disabled={store.future.length === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center gap-1 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-1.5 py-0.5">
          <button
            onClick={() => store.setZoom(Number((store.zoom - 0.1).toFixed(2)))}
            className="p-1 text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="font-mono text-[10px] w-8 text-center font-bold text-white">
            {Math.round(store.zoom * 100)}%
          </span>
          <button
            onClick={() => store.setZoom(Number((store.zoom + 0.1).toFixed(2)))}
            className="p-1 text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          <button
            onClick={store.resetPanZoom}
            className="p-1 text-slate-400 hover:text-primary-400 border-l border-[#1F2937] pl-1.5"
            title="Fit Canvas to Screen"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. RIGHT GROUP: ESSENTIAL ACTIONS ONLY                       */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 shrink-0 text-xs">
        {/* Timeline Toggle Button */}
        <button
          onClick={store.toggleTimeline}
          className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold text-xs transition-all ${
            store.timelineOpen
              ? 'bg-primary-600 text-white border-primary-500 shadow-sm'
              : 'bg-[#0B0F19] hover:bg-slate-800 text-slate-300 border-[#1F2937] hover:text-white'
          }`}
          title={store.timelineOpen ? 'Hide Animation Timeline' : 'Open Animation Timeline (Tracks & Timing)'}
        >
          <Clock className="w-3.5 h-3.5 text-festive-gold" />
          <span className="hidden md:inline">Timeline</span>
          <span className="text-[10px] font-mono px-1 rounded bg-black/40 text-white font-bold">
            {store.layers.length}
          </span>
        </button>

        {/* Live Preview Button */}
        <button
          onClick={() => store.setPreviewModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-slate-200 hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
          title="Distraction-Free Live Preview"
        >
          <Eye className="w-3.5 h-3.5 text-festive-gold" />
          <span className="hidden lg:inline">Preview</span>
        </button>

        {/* Save Button */}
        <button
          onClick={() => store.saveProject()}
          disabled={store.saveStatus === 'saving'}
          className="px-3 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-white font-semibold flex items-center gap-1.5 transition-colors"
          title="Save Project (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5 text-primary-400" />
          <span>Save</span>
        </button>

        {/* Export Code Button */}
        <button
          onClick={() => store.setExportModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold shadow-md flex items-center gap-1.5 transition-all"
          title="Export production code for React, Next.js, Vue, Angular, Vanilla JS"
        >
          <Code2 className="w-3.5 h-3.5 text-festive-gold" />
          <span>Export</span>
        </button>

        {/* Inspector Toggle Button */}
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
