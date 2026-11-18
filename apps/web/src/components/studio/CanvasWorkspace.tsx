'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useStudioStore } from './studio-store';
import { StudioLayer } from './types';
import { FestiveAnimation } from '@festiveui/react';
import { CanvasFloatingToolbar } from './CanvasFloatingToolbar';
import { Clock } from 'lucide-react';

export const CanvasWorkspace: React.FC = () => {
  const store = useStudioStore();
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Interaction State
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 });

  const [isDraggingLayer, setIsDraggingLayer] = useState(false);
  const [isResizingLayer, setIsResizingLayer] = useState<string | null>(null);
  const [isRotatingLayer, setIsRotatingLayer] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({
    mouseX: 0,
    mouseY: 0,
    layerX: 0,
    layerY: 0,
    layerW: 0,
    layerH: 0,
    layerRot: 0
  });

  const selectedLayer = store.layers.find(l => l.id === store.selectedLayerId) || null;

  // Space key to toggle panning
  const [spacePressed, setSpacePressed] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Workspace Pan Mouse Events
  const handleWorkspaceMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary button
    if (store.activeTool === 'hand' || spacePressed) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX,
        y: e.clientY,
        initialPanX: store.panX,
        initialPanY: store.panY
      });
    } else {
      // Clicked on blank canvas workspace -> deselect
      store.selectLayer(null);
    }
  };

  const handleWorkspaceMouseMove = (e: React.MouseEvent) => {
    // 1. PANNING WORKSPACE
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      store.setPan(panStart.initialPanX + dx, panStart.initialPanY + dy);
      return;
    }

    if (!selectedLayer || selectedLayer.locked) return;

    // 2. DRAGGING LAYER
    if (isDraggingLayer) {
      const deltaX = (e.clientX - dragStartPos.mouseX) / store.zoom;
      const deltaY = (e.clientY - dragStartPos.mouseY) / store.zoom;

      let newX = Math.round(dragStartPos.layerX + deltaX);
      let newY = Math.round(dragStartPos.layerY + deltaY);

      if (store.snapToGrid) {
        newX = Math.round(newX / store.gridSize) * store.gridSize;
        newY = Math.round(newY / store.gridSize) * store.gridSize;
      }

      store.updateLayer(selectedLayer.id, { x: newX, y: newY });
    }

    // 3. RESIZING LAYER
    else if (isResizingLayer) {
      const deltaX = (e.clientX - dragStartPos.mouseX) / store.zoom;
      const deltaY = (e.clientY - dragStartPos.mouseY) / store.zoom;

      let newW = dragStartPos.layerW;
      let newH = dragStartPos.layerH;

      if (isResizingLayer.includes('e')) newW = Math.max(30, dragStartPos.layerW + deltaX);
      if (isResizingLayer.includes('s')) newH = Math.max(20, dragStartPos.layerH + deltaY);
      if (isResizingLayer.includes('w')) newW = Math.max(30, dragStartPos.layerW - deltaX);
      if (isResizingLayer.includes('n')) newH = Math.max(20, dragStartPos.layerH - deltaY);

      if (store.snapToGrid) {
        newW = Math.round(newW / store.gridSize) * store.gridSize;
        newH = Math.round(newH / store.gridSize) * store.gridSize;
      }

      store.updateLayer(selectedLayer.id, { width: newW, height: newH });
    }

    // 4. ROTATING LAYER
    else if (isRotatingLayer) {
      const deltaX = e.clientX - dragStartPos.mouseX;
      const newRot = Math.round((dragStartPos.layerRot + deltaX * 0.5) % 360);
      store.updateLayer(selectedLayer.id, { rotation: newRot < 0 ? newRot + 360 : newRot });
    }
  };

  const handleWorkspaceMouseUp = () => {
    if (isPanning) setIsPanning(false);
    if (isDraggingLayer || isResizingLayer || isRotatingLayer) {
      setIsDraggingLayer(false);
      setIsResizingLayer(null);
      setIsRotatingLayer(false);
      store.recordHistory();
    }
  };

  // Layer Interaction Starters
  const handleLayerMouseDown = (e: React.MouseEvent, layer: StudioLayer) => {
    if (store.activeTool === 'hand' || spacePressed) return;
    if (e.button === 2) return; // Handled by contextmenu
    e.stopPropagation();
    store.selectLayer(layer.id);

    if (layer.locked) return;
    setIsDraggingLayer(true);
    setDragStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      layerX: layer.x,
      layerY: layer.y,
      layerW: layer.width,
      layerH: layer.height,
      layerRot: layer.rotation
    });
  };

  const handleResizeHandleDown = (e: React.MouseEvent, handle: string) => {
    if (!selectedLayer || selectedLayer.locked) return;
    e.stopPropagation();
    setIsResizingLayer(handle);
    setDragStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      layerX: selectedLayer.x,
      layerY: selectedLayer.y,
      layerW: selectedLayer.width,
      layerH: selectedLayer.height,
      layerRot: selectedLayer.rotation
    });
  };

  const handleRotateHandleDown = (e: React.MouseEvent) => {
    if (!selectedLayer || selectedLayer.locked) return;
    e.stopPropagation();
    setIsRotatingLayer(true);
    setDragStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      layerX: selectedLayer.x,
      layerY: selectedLayer.y,
      layerW: selectedLayer.width,
      layerH: selectedLayer.height,
      layerRot: selectedLayer.rotation
    });
  };

  // Context Menu Handler
  const handleLayerContextMenu = (e: React.MouseEvent, layer: StudioLayer) => {
    e.preventDefault();
    e.stopPropagation();
    store.openContextMenu(e.clientX, e.clientY, layer.id);
  };

  // Wheel to Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
      store.setZoom(Number((store.zoom + zoomDelta).toFixed(2)));
    }
  };

  return (
    <main
      ref={workspaceRef}
      onMouseDown={handleWorkspaceMouseDown}
      onMouseMove={handleWorkspaceMouseMove}
      onMouseUp={handleWorkspaceMouseUp}
      onWheel={handleWheel}
      className={`flex-1 min-w-0 min-h-0 relative overflow-hidden bg-[#070A11] flex items-center justify-center ${
        store.activeTool === 'hand' || spacePressed
          ? isPanning ? 'cursor-grabbing' : 'cursor-grab'
          : 'cursor-default'
      }`}
    >
      {/* Floating Canvas Toolbar */}
      <CanvasFloatingToolbar />

      {/* Mode B DOM Target Banner */}
      {store.mode === 'website' && (
        <div className="absolute top-4 left-6 z-20 flex items-center gap-2 bg-[#111827]/90 px-3.5 py-1.5 rounded-xl border border-[#1F2937] text-xs backdrop-blur-md shadow-xl">
          <span className="text-slate-400 font-medium">Target Element:</span>
          <input
            type="text"
            value={store.targetSelector}
            onChange={(e) => store.setTargetSelector(e.target.value)}
            placeholder="#hero, .product-banner"
            className="bg-[#0B0F19] px-2.5 py-1 rounded-lg font-mono text-primary-400 text-xs border border-[#1F2937] focus:outline-none focus:border-primary-500"
          />
          <span className="text-[10px] text-slate-500 font-mono">Mounts into target website DOM</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* ARTBOARD CANVAS (PROPORTIONALLY SCALED & CENTERED)           */}
      {/* ============================================================ */}
      <div
        style={{
          width: `${store.canvasWidth}px`,
          height: `${store.canvasHeight}px`,
          transform: `translate(${store.panX}px, ${store.panY}px) scale(${store.zoom})`,
          transformOrigin: 'center center',
          backgroundColor: store.backgroundColor
        }}
        className="rounded-2xl border border-[#1F2937] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative transition-transform duration-75 overflow-hidden shrink-0"
      >
        {/* Background Grid Dots Overlay */}
        {store.showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#64748B 1px, transparent 1px)',
              backgroundSize: `${store.gridSize}px ${store.gridSize}px`
            }}
          />
        )}

        {/* Mode B Website Background Mockup Wireframe */}
        {store.mode === 'website' && (
          <div className="p-8 pointer-events-none opacity-25 space-y-4">
            <div className="h-6 w-36 bg-slate-700 rounded-md" />
            <div className="h-10 w-3/4 bg-slate-600 rounded-lg" />
            <div className="h-4 w-1/2 bg-slate-700 rounded-md" />
            <div className="flex gap-3 pt-2">
              <div className="h-9 w-28 bg-primary-600/60 rounded-lg" />
              <div className="h-9 w-28 bg-slate-700 rounded-lg" />
            </div>
          </div>
        )}

        {/* Mounted Interactive Canvas Layers */}
        {store.layers.map((layer) => {
          if (!layer.visible) return null;
          const isSelected = store.selectedLayerId === layer.id;

          // Check if layer should be rendered based on timeline playhead
          const isLayerActiveInTimeline = !store.isPlaying || (
            store.currentTime >= layer.timelineStart &&
            store.currentTime <= layer.timelineStart + layer.timelineDuration
          );
          if (!isLayerActiveInTimeline) return null;

          const layerStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${layer.x}px`,
            top: `${layer.y}px`,
            width: `${layer.width}px`,
            height: `${layer.height}px`,
            transform: `rotate(${layer.rotation}deg) scale(${layer.scale})`,
            zIndex: layer.zIndex,
            opacity: layer.opacity,
            mixBlendMode: layer.blendMode,
            cursor: layer.locked ? 'default' : 'move'
          };

          return (
            <div
              key={layer.id}
              style={layerStyle}
              onClick={(e) => {
                e.stopPropagation();
                store.selectLayer(layer.id);
              }}
              onMouseDown={(e) => handleLayerMouseDown(e, layer)}
              onContextMenu={(e) => handleLayerContextMenu(e, layer)}
              className={`group relative ${
                isSelected
                  ? 'ring-2 ring-primary-500 rounded-xl shadow-lg'
                  : 'hover:ring-1 hover:ring-primary-400/50'
              }`}
            >
              {/* Layer Content: Text Element vs Animation Element */}
              {layer.isText ? (
                <div
                  className="w-full h-full flex items-center justify-center font-extrabold select-none pointer-events-none"
                  style={{
                    fontFamily: layer.fontFamily || 'serif',
                    fontSize: `${layer.fontSize || 40}px`,
                    fontWeight: layer.fontWeight || '800',
                    color: layer.textColor || '#FFF',
                    textShadow: `0 0 15px ${layer.textGlow || '#F97316'}`
                  }}
                >
                  {layer.textContent}
                </div>
              ) : (
                <div className="w-full h-full pointer-events-none flex items-center justify-center">
                  <FestiveAnimation
                    type={layer.animationSlug}
                    config={{
                      ...layer.settings,
                      size: layer.width,
                      speed: layer.speed,
                      loop: layer.loop
                    }}
                  />
                </div>
              )}

              {/* ACTIVE SELECTION HUD & TRANSFORM CONTROLS */}
              {isSelected && !layer.locked && (
                <>
                  {/* Top Coordinate HUD Badge */}
                  <div className="absolute -top-7 left-0 px-2 py-0.5 rounded-md bg-primary-600 text-[10px] font-mono font-bold text-white pointer-events-none whitespace-nowrap shadow-md flex items-center gap-1 z-30">
                    <span>{layer.name}</span>
                    <span className="text-primary-200">({layer.x}, {layer.y}) [{layer.width}×{layer.height}]</span>
                  </div>

                  {/* Rotation Stem & Handle */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                    <div
                      onMouseDown={handleRotateHandleDown}
                      className="w-3.5 h-3.5 rounded-full bg-festive-gold border-2 border-white shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                      title="Drag to Rotate (0° - 360°)"
                    />
                    <div className="w-0.5 h-3 bg-festive-gold" />
                  </div>

                  {/* 8 Multi-Point Resize Handles */}
                  <div onMouseDown={(e) => handleResizeHandleDown(e, 'nw')} className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-sm bg-white border border-primary-600 cursor-nwse-resize shadow-sm" />
                  <div onMouseDown={(e) => handleResizeHandleDown(e, 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-sm bg-white border border-primary-600 cursor-ns-resize shadow-sm" />
                  <div onMouseDown={(e) => handleResizeHandleDown(e, 'ne')} className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-sm bg-white border border-primary-600 cursor-nesw-resize shadow-sm" />
                  <div onMouseDown={(e) => handleResizeHandleDown(e, 'e')} className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-sm bg-white border border-primary-600 cursor-ew-resize shadow-sm" />
                  <div onMouseDown={(e) => handleResizeHandleDown(e, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-sm bg-white border border-primary-600 cursor-nwse-resize shadow-sm" />
                  <div onMouseDown={(e) => handleResizeHandleDown(e, 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-sm bg-white border border-primary-600 cursor-ns-resize shadow-sm" />
                  <div onMouseDown={(e) => handleResizeHandleDown(e, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-sm bg-white border border-primary-600 cursor-nesw-resize shadow-sm" />
                  <div onMouseDown={(e) => handleResizeHandleDown(e, 'w')} className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-sm bg-white border border-primary-600 cursor-ew-resize shadow-sm" />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Pill to Reopen Timeline when collapsed */}
      {!store.timelineOpen && (
        <button
          onClick={store.toggleTimeline}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#111827]/90 border border-[#1F2937] hover:border-primary-500 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105"
        >
          <Clock className="w-4 h-4 text-festive-gold" />
          <span>Open Animation Timeline</span>
          <span className="px-1.5 py-0.5 rounded-full bg-primary-600 text-[10px] font-mono">
            {store.layers.length} tracks
          </span>
        </button>
      )}
    </main>
  );
};
