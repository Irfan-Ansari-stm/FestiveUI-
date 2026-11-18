'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  GripHorizontal
} from 'lucide-react';
import { useStudioStore } from './studio-store';

export const TimelineEditor: React.FC = () => {
  const store = useStudioStore();
  const rulerRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(store.timelineHeight);

  // RAF playback loop synchronized with centralized store
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

  // Scrubbing on Time Ruler
  const handleRulerMouseDown = (e: React.MouseEvent) => {
    if (!rulerRef.current) return;
    setIsScrubbing(true);
    updateScrub(e.clientX);
  };

  const updateScrub = (clientX: number) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    store.seek(ratio * store.totalDuration);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) {
        updateScrub(e.clientX);
      }
      if (isResizingHeight) {
        const delta = resizeStartY - e.clientY;
        store.setTimelineHeight(initialHeight + delta);
      }
    };

    const handleMouseUp = () => {
      if (isScrubbing) setIsScrubbing(false);
      if (isResizingHeight) setIsResizingHeight(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, isResizingHeight, resizeStartY, initialHeight]);

  if (!store.timelineOpen) return null;

  return (
    <div
      style={{ height: `${store.timelineHeight}px` }}
      className="border-t border-[#1F2937] bg-[#0E131F] flex flex-col shrink-0 z-30 select-none overflow-hidden relative shadow-2xl"
    >
      {/* Top Drag Resize Handle */}
      <div
        onMouseDown={(e) => {
          setIsResizingHeight(true);
          setResizeStartY(e.clientY);
          setInitialHeight(store.timelineHeight);
        }}
        className="w-full h-2 cursor-row-resize hover:bg-primary-500/30 flex items-center justify-center transition-colors shrink-0"
      >
        <div className="w-10 h-0.5 rounded-full bg-slate-600" />
      </div>

      {/* Transport Controls Header */}
      <div className="h-10 border-b border-[#1F2937] px-4 flex items-center justify-between shrink-0 bg-[#0B0F19] text-xs">
        <div className="flex items-center gap-2">
          {/* Restart */}
          <button
            onClick={store.restart}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Restart to Beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={store.togglePlayback}
            className="p-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold shadow-sm"
            title={store.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {store.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          {/* Loop */}
          <button
            onClick={store.toggleLoop}
            className={`p-1 rounded ${store.isLooping ? 'text-primary-400 font-bold' : 'text-slate-500'}`}
            title="Toggle Looping"
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Time Readout */}
          <div className="pl-3 font-mono text-xs font-bold text-white flex items-center gap-1">
            <span className="text-primary-400">{store.currentTime.toFixed(2)}s</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{store.totalDuration}.00s</span>
          </div>
        </div>

        {/* Speed, Maximize & Close */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Speed:</span>
            <select
              value={store.playbackSpeed}
              onChange={(e) => store.setPlaybackSpeed(Number(e.target.value))}
              className="bg-[#111827] border border-[#1F2937] rounded px-1.5 py-0.5 text-xs text-white"
            >
              <option value={0.5}>0.5x</option>
              <option value={1.0}>1.0x</option>
              <option value={1.5}>1.5x</option>
              <option value={2.0}>2.0x</option>
            </select>
          </div>

          <button
            onClick={store.toggleTimelineMaximize}
            className="p-1 rounded text-slate-400 hover:text-white"
            title={store.isTimelineMaximized ? 'Restore Timeline' : 'Maximize Timeline'}
          >
            {store.isTimelineMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={store.toggleTimeline}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Collapse Timeline"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Tracks & Scrubber Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
        {/* Scrubber Time Ruler */}
        <div
          ref={rulerRef}
          onMouseDown={handleRulerMouseDown}
          className="relative h-6 w-full bg-[#111827] rounded-lg border border-[#1F2937] flex items-center px-3 cursor-ew-resize select-none"
        >
          {/* Active Playhead Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary-500 z-10 pointer-events-none"
            style={{ left: `${(store.currentTime / store.totalDuration) * 100}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary-500 -translate-x-[4px] -translate-y-1 shadow-md" />
          </div>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
            <span>0.0s</span>
            <span>2.0s</span>
            <span>4.0s</span>
            <span>6.0s</span>
            <span>8.0s</span>
            <span>10.0s</span>
          </div>
        </div>

        {/* Tracks List */}
        <div className="space-y-1.5">
          {store.layers.map(layer => {
            const isSelected = store.selectedLayerId === layer.id;
            const startPct = (layer.timelineStart / store.totalDuration) * 100;
            const widthPct = (layer.timelineDuration / store.totalDuration) * 100;

            return (
              <div key={layer.id} className="flex items-center gap-3">
                {/* Track Label */}
                <div
                  onClick={() => store.selectLayer(layer.id)}
                  className={`w-44 px-2 py-1 rounded-lg truncate cursor-pointer font-semibold text-[11px] flex items-center gap-2 ${
                    isSelected ? 'bg-primary-950/40 text-primary-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {layer.isText ? <Type className="w-3.5 h-3.5 text-festive-gold" /> : <Sparkles className="w-3.5 h-3.5 text-primary-400" />}
                  <span className="truncate">{layer.name}</span>
                </div>

                {/* Track Channel Bar */}
                <div className="flex-1 relative h-6 bg-[#0B0F19] rounded-lg border border-[#1F2937] overflow-hidden">
                  <div
                    style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                    onClick={() => store.selectLayer(layer.id)}
                    className={`absolute top-0.5 bottom-0.5 rounded-md cursor-pointer transition-colors flex items-center px-2 text-[10px] font-mono font-bold truncate ${
                      isSelected
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{layer.animationSlug}</span>
                    <span className="opacity-60 ml-2">({layer.timelineDuration}s)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
