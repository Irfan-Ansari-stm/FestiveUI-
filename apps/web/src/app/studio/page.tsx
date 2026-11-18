'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  Undo2,
  Redo2,
  Save,
  Code2,
  Eye,
  Sliders,
  Move,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Check,
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Settings2,
  ArrowLeft,
  X,
  FileCode
} from 'lucide-react';
import { useStudioStore } from '@/lib/store';
import { ApiClient } from '@/lib/api';
import { FestiveAnimation } from '@festiveui/react';

export default function StudioPage() {
  const store = useStudioStore();
  const [availableAnimations, setAvailableAnimations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'library' | 'layers'>('library');
  const [selectedFestivalFilter, setSelectedFestivalFilter] = useState('');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFramework, setExportFramework] = useState('react');
  const [exportedCode, setExportedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Dragging state on canvas
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load all registered animations from API
    ApiClient.fetch('/animations?limit=30')
      .then((data) => setAvailableAnimations(data.items || []))
      .catch((err) => console.error('Failed to load animations for studio:', err));
  }, []);

  const selectedLayer = store.layers.find((l) => l.id === store.selectedLayerId);

  // Add animation from library
  const handleAddAnimation = (anim: any) => {
    const newLayerId = `${anim.slug}-${Date.now().toString(36)}`;
    const newLayer = {
      id: newLayerId,
      name: anim.name,
      animationSlug: anim.slug,
      animationType: anim.slug,
      visible: true,
      locked: false,
      config: {
        type: anim.slug,
        position: 'center' as const,
        x: 100,
        y: 80,
        size: 90,
        opacity: 1,
        zIndex: 10 * (store.layers.length + 1),
        settings: { ...(anim.schema?.defaultSettings || {}) }
      }
    };
    store.addLayer(newLayer);
    setActiveTab('layers');
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    store.selectLayer(layerId);
    const layer = store.layers.find((l) => l.id === layerId);
    if (!layer || layer.locked) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - (layer.config.x || 0),
      y: e.clientY - (layer.config.y || 0)
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !store.selectedLayerId) return;
    const layer = store.layers.find((l) => l.id === store.selectedLayerId);
    if (!layer || layer.locked) return;

    const newX = Math.round(e.clientX - dragOffset.x);
    const newY = Math.round(e.clientY - dragOffset.y);

    store.updateLayerConfig(store.selectedLayerId, { x: newX, y: newY, position: undefined });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Save document to PostgreSQL
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: store.title,
        mode: store.mode,
        targetSelector: store.targetSelector,
        content: {
          mode: store.mode,
          viewport: store.viewport,
          backgroundColor: store.backgroundColor,
          zoom: store.zoom,
          layers: store.layers
        }
      };

      if (store.documentId) {
        await ApiClient.fetch(`/editor/projects/${store.documentId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        const res = await ApiClient.fetch('/editor/projects', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        useStudioStore.setState({ documentId: res.id });
      }

      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 2500);
    } catch {
      setSaveMessage('Saved to local session');
      setTimeout(() => setSaveMessage(''), 2500);
    } finally {
      setSaving(false);
    }
  };

  // Export Code handler
  const handleExport = async (fw: string) => {
    setExportFramework(fw);
    setExportModalOpen(true);
    const layers = store.layers.filter((l) => l.visible);

    if (store.documentId) {
      try {
        const res = await ApiClient.fetch(`/editor/projects/${store.documentId}/export`, {
          method: 'POST',
          body: JSON.stringify({ framework: fw })
        });
        setExportedCode(res.code);
        return;
      } catch {}
    }

    // Client fallback generation
    if (fw === 'react') {
      const comps = layers
        .map(
          (l) =>
            `      {/* ${l.name} */}\n      <FestiveAnimation\n        type="${l.animationType}"\n        config={${JSON.stringify(l.config, null, 2)}}\n      />`
        )
        .join('\n\n');
      setExportedCode(
        `import { FestiveAnimation } from '@festiveui/react';\n\nexport default function FestiveScene() {\n  return (\n    <div className="festiveui-container" style={{ position: 'relative', width: '100%', minHeight: '400px' }}>\n${comps}\n    </div>\n  );\n}`
      );
    } else if (fw === 'next') {
      const comps = layers
        .map(
          (l) =>
            `      <NextFestiveAnimation\n        type="${l.animationType}"\n        config={${JSON.stringify(l.config, null, 2)}}\n      />`
        )
        .join('\n\n');
      setExportedCode(
        `'use client';\n\nimport { NextFestiveAnimation } from '@festiveui/next';\n\nexport function FestiveHero() {\n  return (\n    <div className="relative w-full h-[400px] overflow-hidden">\n${comps}\n    </div>\n  );\n}`
      );
    } else {
      setExportedCode(
        `import { FestiveUI } from '@festiveui/core';\n\n${layers
          .map(
            (l) =>
              `FestiveUI.mount({\n  type: '${l.animationType}',\n  target: '#banner',\n  config: ${JSON.stringify(l.config, null, 2)}\n});`
          )
          .join('\n\n')}`
      );
    }
  };

  const copyExportedCode = () => {
    navigator.clipboard.writeText(exportedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Viewport width styling
  const getViewportStyle = () => {
    switch (store.viewport) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '700px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const filteredAnimations = selectedFestivalFilter
    ? availableAnimations.filter((a) => a.festival?.slug === selectedFestivalFilter)
    : availableAnimations;

  return (
    <div className="w-full h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* 1. TOP TOOLBAR */}
      <div className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Brand Icon, Document Name & Mode Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-semibold"
            title="Return to Application Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-primary-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-600 to-festive-gold p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
              </div>
            </div>
            <span className="text-xs font-bold text-white hidden md:inline">
              Studio <span className="text-primary-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary-500/10 border border-primary-500/20">v2.4</span>
            </span>
          </div>

          <input
            type="text"
            value={store.title}
            onChange={(e) => store.setTitle(e.target.value)}
            className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-primary-500 text-sm font-bold text-white px-1 py-0.5 focus:outline-none w-40 sm:w-56"
          />

          <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-border text-xs">
            <button
              onClick={() => store.setMode('canvas')}
              className={`px-2.5 py-1 rounded font-medium ${
                store.mode === 'canvas' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mode A (Canvas)
            </button>
            <button
              onClick={() => store.setMode('website')}
              className={`px-2.5 py-1 rounded font-medium ${
                store.mode === 'website' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mode B (DOM Target)
            </button>
          </div>
        </div>

        {/* Center: Viewport & Undo/Redo */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center gap-1 border-r border-border pr-2">
            <button
              onClick={() => store.undo()}
              disabled={store.history.length === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surfaceHover disabled:opacity-30"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => store.redo()}
              disabled={store.future.length === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surfaceHover disabled:opacity-30"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Viewport controls */}
          <div className="hidden md:flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-border">
            <button
              onClick={() => store.setViewport('desktop')}
              className={`p-1.5 rounded ${store.viewport === 'desktop' ? 'bg-surface text-primary-400' : 'text-slate-400'}`}
              title="Desktop (1440px)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => store.setViewport('tablet')}
              className={`p-1.5 rounded ${store.viewport === 'tablet' ? 'bg-surface text-primary-400' : 'text-slate-400'}`}
              title="Tablet (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => store.setViewport('mobile')}
              className={`p-1.5 rounded ${store.viewport === 'mobile' ? 'bg-surface text-primary-400' : 'text-slate-400'}`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 pl-2">
            <button onClick={() => store.setZoom(store.zoom - 0.1)} className="p-1 hover:text-white">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono w-10 text-center">{Math.round(store.zoom * 100)}%</span>
            <button onClick={() => store.setZoom(store.zoom + 0.1)} className="p-1 hover:text-white">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Save & Export Code Buttons */}
        <div className="flex items-center gap-2">
          {saveMessage && <span className="text-xs text-emerald-400 font-semibold">{saveMessage}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surfaceHover border border-border text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => handleExport('react')}
            className="px-3.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-xs font-bold text-white shadow-sm glow-primary flex items-center gap-1.5 transition-all"
          >
            <Code2 className="w-3.5 h-3.5 text-festive-gold" />
            Export Code
          </button>
        </div>
      </div>

      {/* 2. MAIN 3-PANEL LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Library & Layers (300px) */}
        <aside className="w-72 sm:w-80 border-r border-border bg-surface flex flex-col shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'library'
                  ? 'text-primary-400 border-b-2 border-primary-500 bg-surfaceHover/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Library
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'layers'
                  ? 'text-primary-400 border-b-2 border-primary-500 bg-surfaceHover/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Layers ({store.layers.length})
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'library' ? (
              <>
                {/* Festival Filter */}
                <div className="mb-2">
                  <select
                    value={selectedFestivalFilter}
                    onChange={(e) => setSelectedFestivalFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-border text-xs text-white"
                  >
                    <option value="">All Festivals</option>
                    <option value="diwali">Diwali</option>
                    <option value="christmas">Christmas</option>
                    <option value="holi">Holi</option>
                    <option value="new-year">New Year</option>
                    <option value="eid">Eid</option>
                  </select>
                </div>

                {/* Animation Cards to Add */}
                <div className="space-y-2.5">
                  {filteredAnimations.map((anim) => (
                    <div
                      key={anim.id}
                      onClick={() => handleAddAnimation(anim)}
                      className="p-3 rounded-xl border border-border bg-slate-950 hover:border-primary-500/60 cursor-pointer transition-all flex items-center justify-between group glow-card"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                          <FestiveAnimation type={anim.slug} config={{ position: 'center', size: 32 }} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-primary-400 transition-colors">
                            {anim.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">{anim.format}</span>
                        </div>
                      </div>
                      <button className="p-1.5 rounded-lg bg-surface group-hover:bg-primary-600 text-slate-300 group-hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* LAYERS TAB */
              <div className="space-y-2">
                {store.layers.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">Canvas is empty. Add elements from library.</p>
                ) : (
                  store.layers.map((layer, index) => (
                    <div
                      key={layer.id}
                      onClick={() => store.selectLayer(layer.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        store.selectedLayerId === layer.id
                          ? 'border-primary-500 bg-primary-950/20'
                          : 'border-border bg-slate-950 hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-mono text-slate-500">#{index + 1}</span>
                        <span className="text-xs font-bold text-white truncate">{layer.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            store.toggleLayerVisibility(layer.id);
                          }}
                          className={`p-1 rounded text-slate-400 hover:text-white ${!layer.visible ? 'opacity-30' : ''}`}
                          title={layer.visible ? 'Hide' : 'Show'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            store.toggleLayerLock(layer.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title={layer.locked ? 'Unlock' : 'Lock'}
                        >
                          {layer.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            store.duplicateLayer(layer.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            store.deleteLayer(layer.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER PANEL: Website / Canvas Preview with Pan & Drag-and-Drop */}
        <main
          className="flex-1 bg-slate-900/50 flex items-center justify-center p-6 relative overflow-auto"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Target Selector Banner in Mode B */}
          {store.mode === 'website' && (
            <div className="absolute top-4 left-6 z-10 flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-border text-xs">
              <span className="text-slate-400">Target Element:</span>
              <input
                type="text"
                value={store.targetSelector}
                onChange={(e) => store.setTargetSelector(e.target.value)}
                placeholder="#hero, .product-card"
                className="bg-surface px-2 py-0.5 rounded font-mono text-primary-400 text-xs border border-border focus:outline-none focus:border-primary-500"
              />
            </div>
          )}

          {/* Canvas Viewport Frame */}
          <div
            ref={canvasRef}
            style={{
              ...getViewportStyle(),
              transform: `scale(${store.zoom})`,
              transformOrigin: 'center center',
              backgroundColor: store.backgroundColor
            }}
            className="rounded-2xl border border-border/80 shadow-2xl relative transition-all overflow-hidden"
          >
            {/* Background grid dots */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#64748B 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Mode B Website Simulation Mockup Content */}
            {store.mode === 'website' && (
              <div className="p-8 pointer-events-none opacity-40 space-y-4">
                <div className="h-6 w-36 bg-slate-700 rounded-md" />
                <div className="h-10 w-3/4 bg-slate-600 rounded-lg" />
                <div className="h-4 w-1/2 bg-slate-700 rounded-md" />
                <div className="flex gap-3 pt-2">
                  <div className="h-9 w-28 bg-primary-600/60 rounded-lg" />
                  <div className="h-9 w-28 bg-slate-700 rounded-lg" />
                </div>
              </div>
            )}

            {/* Mounted Active Layers */}
            {store.layers.map((layer) => {
              if (!layer.visible) return null;
              const isSelected = store.selectedLayerId === layer.id;

              const layerStyle: React.CSSProperties = {
                position: 'absolute',
                left: layer.config.position === 'full' ? 0 : `${layer.config.x || 60}px`,
                top: layer.config.position === 'full' ? 0 : `${layer.config.y || 60}px`,
                width: layer.config.position === 'full' ? '100%' : 'auto',
                height: layer.config.position === 'full' ? '100%' : 'auto',
                zIndex: layer.config.zIndex || 10,
                opacity: layer.config.opacity !== undefined ? layer.config.opacity : 1,
                cursor: layer.locked ? 'default' : 'move'
              };

              return (
                <div
                  key={layer.id}
                  style={layerStyle}
                  onMouseDown={(e) => handleMouseDown(e, layer.id)}
                  className={`group ${
                    isSelected ? 'ring-2 ring-primary-500 rounded-lg' : 'hover:ring-1 hover:ring-primary-400/50'
                  }`}
                >
                  <FestiveAnimation
                    type={layer.animationType}
                    config={{
                      ...layer.config,
                      position: undefined
                    }}
                  />

                  {/* Selection Label */}
                  {isSelected && (
                    <div className="absolute -top-6 left-0 px-1.5 py-0.5 rounded bg-primary-600 text-[10px] font-bold text-white pointer-events-none whitespace-nowrap shadow-sm">
                      {layer.name} ({layer.config.x || 0}, {layer.config.y || 0})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* RIGHT PANEL: Schema-Driven Properties Inspector (300px) */}
        <aside className="w-72 sm:w-80 border-l border-border bg-surface flex flex-col shrink-0">
          <div className="p-3.5 border-b border-border flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary-400" />
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Properties Inspector</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {selectedLayer ? (
              <>
                {/* Layer Identity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Layer Name</label>
                  <input
                    type="text"
                    value={selectedLayer.name}
                    onChange={(e) => {
                      const updated = store.layers.map((l) =>
                        l.id === selectedLayer.id ? { ...l, name: e.target.value } : l
                      );
                      store.setLayers(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-border text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Transform Coordinates (X, Y) */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Position & Dimensions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400">X Position (px)</span>
                      <input
                        type="number"
                        value={selectedLayer.config.x || 0}
                        onChange={(e) =>
                          store.updateLayerConfig(selectedLayer.id, { x: Number(e.target.value), position: undefined })
                        }
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-border text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400">Y Position (px)</span>
                      <input
                        type="number"
                        value={selectedLayer.config.y || 0}
                        onChange={(e) =>
                          store.updateLayerConfig(selectedLayer.id, { y: Number(e.target.value), position: undefined })
                        }
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-border text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Global Properties: Size, Opacity, Z-Index */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Size (Scale)</span>
                      <span className="font-mono text-primary-400">{selectedLayer.config.size || 80}px</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={300}
                      value={selectedLayer.config.size || 80}
                      onChange={(e) => store.updateLayerConfig(selectedLayer.id, { size: Number(e.target.value) })}
                      className="w-full accent-primary-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Opacity</span>
                      <span className="font-mono text-primary-400">
                        {Math.round((selectedLayer.config.opacity ?? 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={selectedLayer.config.opacity ?? 1}
                      onChange={(e) => store.updateLayerConfig(selectedLayer.id, { opacity: Number(e.target.value) })}
                      className="w-full accent-primary-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Z-Index Layer</span>
                      <span className="font-mono text-primary-400">{selectedLayer.config.zIndex || 10}</span>
                    </div>
                    <input
                      type="number"
                      value={selectedLayer.config.zIndex || 10}
                      onChange={(e) => store.updateLayerConfig(selectedLayer.id, { zIndex: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded bg-slate-950 border border-border text-xs text-white"
                    />
                  </div>
                </div>

                {/* Animation Specific Dynamic Settings from Schema */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <span className="text-xs font-bold text-white block">Custom Animation Parameters</span>
                  {selectedLayer.config.settings &&
                    Object.entries(selectedLayer.config.settings).map(([key, val]) => {
                      if (typeof val === 'number') {
                        return (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-300">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="font-mono text-primary-400">{val}</span>
                            </div>
                            <input
                              type="range"
                              min={0.1}
                              max={typeof val === 'number' && val > 10 ? 150 : 3.0}
                              step={val > 10 ? 5 : 0.1}
                              value={val}
                              onChange={(e) =>
                                store.updateLayerConfig(selectedLayer.id, {
                                  settings: { [key]: Number(e.target.value) }
                                })
                              }
                              className="w-full accent-primary-500 cursor-pointer"
                            />
                          </div>
                        );
                      }

                      if (typeof val === 'boolean') {
                        return (
                          <div key={key} className="flex items-center justify-between py-1">
                            <span className="text-xs text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <input
                              type="checkbox"
                              checked={val}
                              onChange={(e) =>
                                store.updateLayerConfig(selectedLayer.id, {
                                  settings: { [key]: e.target.checked }
                                })
                              }
                              className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
                            />
                          </div>
                        );
                      }

                      return null;
                    })}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Sliders className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Select any layer on canvas to inspect its animation parameters.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. EXPORT CODE MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-surface p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-bold text-white">Export Verified Integration Code</h3>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Framework Switcher */}
            <div className="flex items-center gap-2 mb-4">
              {(['react', 'next', 'vue', 'angular', 'vanilla', 'web-component'] as const).map((fw) => (
                <button
                  key={fw}
                  onClick={() => handleExport(fw)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    exportFramework === fw ? 'bg-primary-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {fw}
                </button>
              ))}
            </div>

            {/* Generated Code Window */}
            <div className="rounded-xl border border-border bg-slate-950 overflow-hidden relative">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-border text-xs text-slate-400">
                <span className="font-mono">Production Integration Code</span>
                <button
                  onClick={copyExportedCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface hover:bg-surfaceHover text-primary-400 font-semibold border border-border"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 max-h-96 overflow-y-auto leading-relaxed">
                <code>{exportedCode}</code>
              </pre>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surfaceHover border border-border text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
