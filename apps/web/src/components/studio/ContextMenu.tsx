'use client';

import React, { useEffect, useRef } from 'react';
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowUpToLine,
  ArrowDownToLine,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useStudioStore } from './studio-store';

export const ContextMenu: React.FC = () => {
  const store = useStudioStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        store.closeContextMenu();
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [store]);

  if (!store.contextMenu) return null;

  const { x, y, layerId } = store.contextMenu;
  const targetLayer = store.layers.find(l => l.id === layerId);
  if (!targetLayer) return null;

  return (
    <div
      ref={menuRef}
      style={{ left: `${x}px`, top: `${y}px` }}
      className="fixed z-50 w-52 rounded-2xl bg-[#111827] border border-[#1F2937] p-1.5 shadow-2xl text-xs text-slate-200 backdrop-blur-md select-none space-y-0.5 animate-in fade-in duration-100"
    >
      <div className="px-2.5 py-1 text-[10px] font-mono text-slate-400 font-bold border-b border-[#1F2937] truncate">
        {targetLayer.name}
      </div>

      <button
        onClick={() => {
          store.duplicateLayer(layerId);
          store.closeContextMenu();
        }}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5 text-primary-400" /> Duplicate</span>
        <span className="text-[10px] text-slate-500 font-mono">Ctrl+D</span>
      </button>

      <button
        onClick={() => {
          store.copySelectedLayer();
          store.closeContextMenu();
        }}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5 text-slate-400" /> Copy</span>
        <span className="text-[10px] text-slate-500 font-mono">Ctrl+C</span>
      </button>

      <button
        onClick={() => {
          store.pasteLayer();
          store.closeContextMenu();
        }}
        disabled={!store.clipboard}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 transition-colors"
      >
        <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5 text-slate-400" /> Paste</span>
        <span className="text-[10px] text-slate-500 font-mono">Ctrl+V</span>
      </button>

      <div className="h-px bg-[#1F2937] my-1" />

      {/* Layer Stacking */}
      <button
        onClick={() => {
          store.bringToFront(layerId);
          store.closeContextMenu();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <ArrowUpToLine className="w-3.5 h-3.5 text-festive-gold" /> Bring to Front
      </button>

      <button
        onClick={() => {
          store.reorderLayerZ(layerId, 'up');
          store.closeContextMenu();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <ChevronUp className="w-3.5 h-3.5" /> Bring Forward
      </button>

      <button
        onClick={() => {
          store.reorderLayerZ(layerId, 'down');
          store.closeContextMenu();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <ChevronDown className="w-3.5 h-3.5" /> Send Backward
      </button>

      <button
        onClick={() => {
          store.sendToBack(layerId);
          store.closeContextMenu();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <ArrowDownToLine className="w-3.5 h-3.5 text-slate-400" /> Send to Back
      </button>

      <div className="h-px bg-[#1F2937] my-1" />

      {/* Lock & Visibility */}
      <button
        onClick={() => {
          store.updateLayer(layerId, { locked: !targetLayer.locked });
          store.closeContextMenu();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        {targetLayer.locked ? <Unlock className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5" />}
        {targetLayer.locked ? 'Unlock Layer' : 'Lock Layer'}
      </button>

      <button
        onClick={() => {
          store.updateLayer(layerId, { visible: !targetLayer.visible });
          store.closeContextMenu();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        {targetLayer.visible ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
        {targetLayer.visible ? 'Hide Layer' : 'Show Layer'}
      </button>

      <div className="h-px bg-[#1F2937] my-1" />

      <button
        onClick={() => {
          store.deleteLayer(layerId);
          store.closeContextMenu();
        }}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
      >
        <span className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete</span>
        <span className="text-[10px] font-mono">Del</span>
      </button>
    </div>
  );
};
