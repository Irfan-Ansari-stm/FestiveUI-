'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Repeat,
  Maximize2,
  Minimize2,
  X,
  Layers,
  Sparkles,
  Type,
  Film,
  GripHorizontal,
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ChevronUp,
  ChevronDown,
  Magnet,
  ZoomIn,
  ZoomOut,
  SkipBack,
  SkipForward,
  Clock,
  SlidersHorizontal
} from 'lucide-react';
import { useStudioStore } from './studio-store';
import { StudioLayer } from './types';

export const TimelineEditor: React.FC = () => {
  const store = useStudioStore();
  const rulerRef = useRef<HTMLDivElement>(null);
  const channelsRef = useRef<HTMLDivElement>(null);

  // Height resize state
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(store.timelineHeight);

  // Playhead scrubber state
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Track bar drag & trim state
  const [dragAction, setDragAction] = useState<{
    type: 'move' | 'trim-left' | 'trim-right';
    layerId: string;
    startX: number;
    initialStart: number;
    initialDuration: number;
    currentStart: number;
    currentDuration: number;
  } | null>(null);

  // Total duration popover dropdown
  const [durationMenuOpen, setDurationMenuOpen] = useState(false);

  // Animation RAF loop synchronized with store
  useEffect(() => {
    if (!store.isPlaying) return;
    let lastTime = performance.now();
    let frameId: number;

    const loop = (now: number) => {
      const deltaSec = ((now - lastTime) / 1000) * store.playbackSpeed;
      lastTime = now;

      let next = store.currentTime + deltaSec;
      if (next >= store.totalDuration) {
        if (store.isLooping) {
          next = 0;
        } else {
          next = store.totalDuration;
          store.pause();
        }
      }
      store.seek(next);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [store.isPlaying, store.playbackSpeed, store.totalDuration, store.isLooping, store.currentTime]);

  // Helper to get time from clientX on timeline channels / ruler
  const getTimeFromClientX = useCallback((clientX: number): number => {
    const target = rulerRef.current || channelsRef.current;
    if (!target) return 0;
    const rect = target.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * store.totalDuration;
  }, [store.totalDuration]);

  // Playhead Scrubber Handler
  const handleScrubberMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsScrubbing(true);
    const newTime = getTimeFromClientX(e.clientX);
    store.seek(newTime);
  };

  // Start moving the whole layer track bar
  const handleBarMouseDown = (e: React.MouseEvent, layer: StudioLayer) => {
    if (e.button !== 0 || layer.locked) return;
    e.stopPropagation();
    store.selectLayer(layer.id);

    setDragAction({
      type: 'move',
      layerId: layer.id,
      startX: e.clientX,
      initialStart: layer.timelineStart,
      initialDuration: layer.timelineDuration,
      currentStart: layer.timelineStart,
      currentDuration: layer.timelineDuration
    });
  };

  // Start trimming from left handle
  const handleTrimLeftMouseDown = (e: React.MouseEvent, layer: StudioLayer) => {
    if (e.button !== 0 || layer.locked) return;
    e.stopPropagation();
    store.selectLayer(layer.id);

    setDragAction({
      type: 'trim-left',
      layerId: layer.id,
      startX: e.clientX,
      initialStart: layer.timelineStart,
      initialDuration: layer.timelineDuration,
      currentStart: layer.timelineStart,
      currentDuration: layer.timelineDuration
    });
  };

  // Start trimming from right handle
  const handleTrimRightMouseDown = (e: React.MouseEvent, layer: StudioLayer) => {
    if (e.button !== 0 || layer.locked) return;
    e.stopPropagation();
    store.selectLayer(layer.id);

    setDragAction({
      type: 'trim-right',
      layerId: layer.id,
      startX: e.clientX,
      initialStart: layer.timelineStart,
      initialDuration: layer.timelineDuration,
      currentStart: layer.timelineStart,
      currentDuration: layer.timelineDuration
    });
  };

  // Global mouse move and mouse up listeners for scrubbing & dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Scrubbing Playhead
      if (isScrubbing) {
        const newTime = getTimeFromClientX(e.clientX);
        store.seek(newTime);
        return;
      }

      // 2. Resizing Timeline Height Dock
      if (isResizingHeight) {
        const delta = resizeStartY - e.clientY;
        const newHeight = Math.max(140, Math.min(520, initialHeight + delta));
        store.setTimelineHeight(newHeight);
        return;
      }

      // 3. Dragging or Trimming Track Bar
      if (dragAction) {
        const target = rulerRef.current || channelsRef.current;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const deltaPixels = e.clientX - dragAction.startX;
        const deltaTime = (deltaPixels / rect.width) * store.totalDuration;

        if (dragAction.type === 'move') {
          let nextStart = dragAction.initialStart + deltaTime;

          // Snapping
          if (store.snapToTimelineGrid) {
            nextStart = Math.round(nextStart * 10) / 10; // Snap to 0.1s
            if (Math.abs(nextStart - store.currentTime) < 0.15) {
              nextStart = store.currentTime; // Snap to playhead
            }
          }

          // Clamping
          const maxStart = Math.max(0, store.totalDuration - dragAction.initialDuration);
          const clampedStart = Math.max(0, Math.min(maxStart, nextStart));

          setDragAction(prev => prev ? { ...prev, currentStart: clampedStart } : null);
          store.updateLayerTiming(dragAction.layerId, clampedStart, dragAction.initialDuration);
        } else if (dragAction.type === 'trim-left') {
          const fixedEnd = dragAction.initialStart + dragAction.initialDuration;
          let nextStart = dragAction.initialStart + deltaTime;

          if (store.snapToTimelineGrid) {
            nextStart = Math.round(nextStart * 10) / 10;
          }

          const clampedStart = Math.max(0, Math.min(fixedEnd - 0.2, nextStart));
          const newDuration = fixedEnd - clampedStart;

          setDragAction(prev => prev ? { ...prev, currentStart: clampedStart, currentDuration: newDuration } : null);
          store.updateLayerTiming(dragAction.layerId, clampedStart, newDuration);
        } else if (dragAction.type === 'trim-right') {
          let nextDuration = dragAction.initialDuration + deltaTime;

          if (store.snapToTimelineGrid) {
            nextDuration = Math.round(nextDuration * 10) / 10;
          }

          const maxDuration = store.totalDuration - dragAction.initialStart;
          const clampedDuration = Math.max(0.2, Math.min(maxDuration, nextDuration));

          setDragAction(prev => prev ? { ...prev, currentDuration: clampedDuration } : null);
          store.updateLayerTiming(dragAction.layerId, dragAction.initialStart, clampedDuration);
        }
      }
    };

    const handleMouseUp = () => {
      if (isScrubbing) setIsScrubbing(false);
      if (isResizingHeight) setIsResizingHeight(false);
      if (dragAction) {
        setDragAction(null);
        store.recordHistory();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, isResizingHeight, dragAction, getTimeFromClientX, resizeStartY, initialHeight, store]);

  if (!store.timelineOpen) return null;

  // Generate tick markers based on total duration and zoom
  const ticksCount = Math.max(5, Math.round(store.totalDuration * (store.timelineZoom >= 1.5 ? 2 : 1)));
  const ticks = Array.from({ length: ticksCount + 1 }, (_, i) => {
    const sec = (i / ticksCount) * store.totalDuration;
    return sec;
  });

  return (
    <div
      style={{ height: `${store.timelineHeight}px` }}
      className="border-t border-[#1F2937] bg-[#0E131F] flex flex-col shrink-0 z-30 select-none overflow-hidden relative shadow-2xl transition-all"
    >
      {/* ============================================================ */}
      {/* 1. TOP RESIZE HANDLE BAR                                     */}
      {/* ============================================================ */}
      <div
        onMouseDown={(e) => {
          setIsResizingHeight(true);
          setResizeStartY(e.clientY);
          setInitialHeight(store.timelineHeight);
        }}
        className="w-full h-2 cursor-row-resize hover:bg-primary-500/40 flex items-center justify-center transition-colors shrink-0 group"
        title="Drag up/down to resize timeline dock"
      >
        <div className="w-12 h-1 rounded-full bg-slate-600 group-hover:bg-primary-400 transition-colors" />
      </div>

      {/* ============================================================ */}
      {/* 2. TRANSPORT & TIMELINE MANAGEMENT HEADER                   */}
      {/* ============================================================ */}
      <div className="h-10 border-b border-[#1F2937] px-4 flex items-center justify-between shrink-0 bg-[#0B0F19] text-xs">
        {/* Left: Transport Controls & Time Readout */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Jump to Beginning */}
          <button
            onClick={store.restart}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111827] transition-colors"
            title="Jump to Start (0.0s)"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Step Back 0.5s */}
          <button
            onClick={() => store.stepTime(-0.5)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111827] transition-colors text-[10px] font-mono font-bold"
            title="Step Back 0.5s"
          >
            -0.5s
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={store.togglePlayback}
            className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md ${
              store.isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-pulse'
                : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-950/50'
            }`}
            title={store.isPlaying ? 'Pause (Space)' : 'Play Animation (Space)'}
          >
            {store.isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px]">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px]">Play</span>
              </>
            )}
          </button>

          {/* Step Forward 0.5s */}
          <button
            onClick={() => store.stepTime(0.5)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111827] transition-colors text-[10px] font-mono font-bold"
            title="Step Forward 0.5s"
          >
            +0.5s
          </button>

          {/* Loop Toggle */}
          <button
            onClick={store.toggleLoop}
            className={`p-1.5 rounded-lg transition-colors ${
              store.isLooping
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title={store.isLooping ? 'Looping Enabled' : 'Looping Disabled'}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Time Readout & Total Duration Dropdown */}
          <div className="relative ml-2 flex items-center bg-[#111827] border border-[#1F2937] rounded-xl px-2.5 py-1 gap-2 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-white font-bold">{store.currentTime.toFixed(2)}s</span>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => setDurationMenuOpen(!durationMenuOpen)}
              className="text-slate-300 hover:text-festive-gold font-bold flex items-center gap-1 transition-colors"
              title="Change Total Timeline Duration"
            >
              <span>{store.totalDuration}.00s</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Total Duration Selector Dropdown */}
            {durationMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-[#111827] border border-[#1F2937] rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
                  Timeline Length
                </span>
                {[5, 10, 15, 20, 30, 60].map(dur => (
                  <button
                    key={dur}
                    onClick={() => {
                      store.setTotalDuration(dur);
                      setDurationMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center justify-between ${
                      store.totalDuration === dur
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-300 hover:bg-[#1F2937]'
                    }`}
                  >
                    <span>{dur} Seconds</span>
                    {store.totalDuration === dur && <span className="text-[10px]">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Snapping, Zoom, Speed & Dock Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Snap to Grid Toggle */}
          <button
            onClick={store.toggleTimelineSnap}
            className={`px-2 py-1 rounded-xl text-xs flex items-center gap-1.5 font-medium transition-colors border ${
              store.snapToTimelineGrid
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-[#111827] text-slate-500 border-[#1F2937] hover:text-slate-300'
            }`}
            title="Toggle Snapping to 0.1s increments and playhead"
          >
            <Magnet className="w-3 h-3" />
            <span className="hidden md:inline text-[11px]">Snap</span>
          </button>

          {/* Timeline Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[#111827] border border-[#1F2937] rounded-xl px-1.5 py-0.5">
            <button
              onClick={() => store.setTimelineZoom(store.timelineZoom - 0.25)}
              disabled={store.timelineZoom <= 0.5}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Zoom Out Timeline"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="font-mono text-[10px] text-slate-300 w-10 text-center">
              {Math.round(store.timelineZoom * 100)}%
            </span>
            <button
              onClick={() => store.setTimelineZoom(store.timelineZoom + 0.25)}
              disabled={store.timelineZoom >= 3.0}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Zoom In Timeline"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-[#111827] border border-[#1F2937] rounded-xl px-2 py-0.5">
            <span className="hidden md:inline text-[11px]">Speed:</span>
            <select
              value={store.playbackSpeed}
              onChange={(e) => store.setPlaybackSpeed(Number(e.target.value))}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value={0.25} className="bg-[#111827]">0.25x</option>
              <option value={0.5} className="bg-[#111827]">0.5x</option>
              <option value={1.0} className="bg-[#111827]">1.0x</option>
              <option value={1.5} className="bg-[#111827]">1.5x</option>
              <option value={2.0} className="bg-[#111827]">2.0x</option>
            </select>
          </div>

          {/* Maximize / Restore Dock */}
          <button
            onClick={store.toggleTimelineMaximize}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111827] transition-colors"
            title={store.isTimelineMaximized ? 'Restore Timeline Dock' : 'Maximize Timeline Dock'}
          >
            {store.isTimelineMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close Timeline */}
          <button
            onClick={store.toggleTimeline}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111827] transition-colors"
            title="Collapse Timeline"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MAIN TIMELINE BODY: TRACK HEADERS (LEFT) & CHANNELS (RIGHT) */}
      {/* ============================================================ */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ========================================================== */}
        {/* A. LEFT TRACK HEADERS COLUMN (FIXED WIDTH)                 */}
        {/* ========================================================== */}
        <div className="w-64 border-r border-[#1F2937] bg-[#0B0F19] flex flex-col shrink-0 overflow-y-auto">
          {/* Header Row: Track Count & Quick Action */}
          <div className="h-8 border-b border-[#1F2937] px-3 flex items-center justify-between text-[11px] font-bold text-slate-400 bg-[#070A11] shrink-0">
            <span>Layers / Tracks ({store.layers.length})</span>
            <span className="text-[10px] text-slate-500 font-mono">Z-Order (Top to Bottom)</span>
          </div>

          {/* Track Headers List */}
          <div className="divide-y divide-[#1F2937]/50">
            {store.layers.map((layer, index) => {
              const isSelected = store.selectedLayerId === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => store.selectLayer(layer.id)}
                  className={`h-9 px-2 flex items-center justify-between gap-1.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-950/40 border-l-2 border-primary-500 text-white'
                      : 'text-slate-300 hover:bg-[#111827]/80'
                  }`}
                >
                  {/* Left: Reorder Controls & Layer Type Icon */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    {/* Move Up / Down Buttons */}
                    <div className="flex flex-col -space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          store.reorderLayersList(index, index - 1);
                        }}
                        disabled={index === 0}
                        className="text-slate-500 hover:text-white disabled:opacity-20 p-0.5"
                        title="Move Up in Stack"
                      >
                        <ChevronUp className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          store.reorderLayersList(index, index + 1);
                        }}
                        disabled={index === store.layers.length - 1}
                        className="text-slate-500 hover:text-white disabled:opacity-20 p-0.5"
                        title="Move Down in Stack"
                      >
                        <ChevronDown className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* Icon */}
                    {layer.isText ? (
                      <Type className="w-3.5 h-3.5 text-festive-gold shrink-0" />
                    ) : layer.animationSlug.includes('diya') || layer.animationSlug.includes('fireworks') ? (
                      <Sparkles className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    ) : (
                      <Film className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    )}

                    {/* Layer Name */}
                    <span className="truncate text-xs font-semibold">{layer.name}</span>
                  </div>

                  {/* Right: Visibility, Lock & Delete Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Visibility Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        store.updateLayer(layer.id, { visible: !layer.visible });
                      }}
                      className={`p-1 rounded hover:bg-slate-800 ${
                        layer.visible ? 'text-slate-400 hover:text-white' : 'text-rose-400'
                      }`}
                      title={layer.visible ? 'Hide on Canvas' : 'Show on Canvas'}
                    >
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>

                    {/* Lock Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        store.updateLayer(layer.id, { locked: !layer.locked });
                      }}
                      className={`p-1 rounded hover:bg-slate-800 ${
                        layer.locked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                    >
                      {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>

                    {/* Delete Layer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        store.deleteLayer(layer.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Layer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================== */}
        {/* B. RIGHT TIMELINE CHANNELS & SCROLLABLE TIME RULER          */}
        {/* ========================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0B0F19] overflow-x-auto overflow-y-auto relative">
          <div
            style={{ width: `${Math.max(100, 100 * store.timelineZoom)}%` }}
            className="min-w-full flex-1 flex flex-col relative"
          >
            {/* -------------------------------------------------------- */}
            {/* TIME RULER HEADER ROW                                    */}
            {/* -------------------------------------------------------- */}
            <div
              ref={rulerRef}
              onMouseDown={handleScrubberMouseDown}
              className="h-8 border-b border-[#1F2937] bg-[#111827] relative cursor-ew-resize select-none shrink-0"
              title="Click or drag to scrub playhead"
            >
              {/* Minor & Major Tick Marks */}
              <div className="absolute inset-0 flex justify-between items-end px-1 pb-1 pointer-events-none">
                {ticks.map((t, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] font-mono font-semibold text-slate-400 mb-0.5">
                      {t.toFixed(1)}s
                    </span>
                    <div className="w-[1px] h-2 bg-slate-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* FULL-HEIGHT VERTICAL PLAYHEAD LINE                       */}
            {/* -------------------------------------------------------- */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary-500 z-30 pointer-events-none transition-none shadow-[0_0_10px_rgba(249,115,22,0.8)]"
              style={{ left: `${(store.currentTime / store.totalDuration) * 100}%` }}
            >
              {/* Playhead Scrubber Diamond Head */}
              <div className="w-3 h-4 bg-primary-500 -translate-x-[5px] -translate-y-1 shadow-lg flex items-center justify-center rounded-sm">
                <div className="w-1 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* LAYER TRACK CHANNELS                                     */}
            {/* -------------------------------------------------------- */}
            <div ref={channelsRef} className="flex-1 divide-y divide-[#1F2937]/50 relative">
              {/* Background Grid Lines for Ticks */}
              <div className="absolute inset-0 flex justify-between pointer-events-none opacity-10">
                {ticks.map((_, idx) => (
                  <div key={idx} className="w-[1px] h-full bg-slate-400" />
                ))}
              </div>

              {store.layers.map((layer) => {
                const isSelected = store.selectedLayerId === layer.id;
                const isDragging = dragAction?.layerId === layer.id;

                const displayStart = isDragging ? dragAction.currentStart : layer.timelineStart;
                const displayDuration = isDragging ? dragAction.currentDuration : layer.timelineDuration;

                const startPct = (displayStart / store.totalDuration) * 100;
                const widthPct = (displayDuration / store.totalDuration) * 100;

                return (
                  <div
                    key={layer.id}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        const clickTime = getTimeFromClientX(e.clientX);
                        store.seek(clickTime);
                      }
                    }}
                    className="h-9 relative bg-[#0E131F]/60 flex items-center px-1"
                  >
                    {/* Draggable & Resizable Layer Timing Block */}
                    <div
                      style={{
                        left: `${startPct}%`,
                        width: `${Math.max(1.5, widthPct)}%`
                      }}
                      onMouseDown={(e) => handleBarMouseDown(e, layer)}
                      className={`absolute h-7 rounded-lg group select-none flex items-center justify-between px-2 cursor-grab active:cursor-grabbing transition-shadow z-20 border ${
                        isSelected
                          ? 'bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 border-white/40 shadow-lg shadow-primary-950/80 ring-1 ring-primary-400 text-white font-bold'
                          : 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 border-[#1F2937] text-slate-200'
                      } ${layer.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {/* Left Trim Handle */}
                      {!layer.locked && (
                        <div
                          onMouseDown={(e) => handleTrimLeftMouseDown(e, layer)}
                          className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/40 rounded-l-lg flex items-center justify-center transition-colors z-30"
                          title="Drag to trim start time"
                        >
                          <div className="w-0.5 h-3 bg-white/60 rounded-full" />
                        </div>
                      )}

                      {/* Content Info (Name, Duration, Icon) */}
                      <div className="flex items-center gap-2 truncate pointer-events-none pl-1 pr-1 text-[11px] font-mono">
                        <span className="truncate">{layer.animationSlug}</span>
                        <span className="opacity-75 text-[10px]">
                          ({displayDuration.toFixed(1)}s)
                        </span>
                      </div>

                      {/* Right Trim Handle */}
                      {!layer.locked && (
                        <div
                          onMouseDown={(e) => handleTrimRightMouseDown(e, layer)}
                          className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/40 rounded-r-lg flex items-center justify-center transition-colors z-30"
                          title="Drag to trim duration / end time"
                        >
                          <div className="w-0.5 h-3 bg-white/60 rounded-full" />
                        </div>
                      )}

                      {/* Live Floating Timing HUD Tooltip while dragging */}
                      {isDragging && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-primary-500/60 text-white px-2 py-0.5 rounded-md text-[10px] font-mono shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                          Start: {displayStart.toFixed(2)}s | Dur: {displayDuration.toFixed(2)}s | End: {(displayStart + displayDuration).toFixed(2)}s
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
