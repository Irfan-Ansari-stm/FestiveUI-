'use client';

import React, { useState } from 'react';
import { Sparkles, Layers, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { useStudioStore } from './studio-store';
import { LibraryPanel } from './LibraryPanel';
import { LayersPanel } from './LayersPanel';
import { AssetsPanel } from './AssetsPanel';
import { TemplatesPanel } from './TemplatesPanel';

export const LeftSidebar: React.FC = () => {
  const store = useStudioStore();
  const [activeTab, setActiveTab] = useState<'library' | 'layers' | 'assets' | 'templates'>('library');

  if (!store.isLeftSidebarOpen) return null;

  return (
    <aside className="w-72 sm:w-80 border-r border-[#1F2937] bg-[#111827] flex flex-col shrink-0 z-20 overflow-hidden select-none">
      {/* 4 Tabs Bar */}
      <div className="flex border-b border-[#1F2937] shrink-0 bg-[#0B0F19]">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'library'
              ? 'text-primary-400 border-b-2 border-primary-500 bg-[#111827]'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Animation Library"
        >
          <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
          <span className="hidden sm:inline">Library</span>
        </button>

        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'layers'
              ? 'text-primary-400 border-b-2 border-primary-500 bg-[#111827]'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Canvas Layers Hierarchy"
        >
          <Layers className="w-3.5 h-3.5 text-primary-400" />
          <span className="hidden sm:inline">Layers</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'assets'
              ? 'text-primary-400 border-b-2 border-primary-500 bg-[#111827]'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Assets & Media"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'templates'
              ? 'text-primary-400 border-b-2 border-primary-500 bg-[#111827]'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Presets & Compositions"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Scenes</span>
        </button>
      </div>

      {/* Active Tab Panel */}
      {activeTab === 'library' && <LibraryPanel />}
      {activeTab === 'layers' && <LayersPanel />}
      {activeTab === 'assets' && <AssetsPanel />}
      {activeTab === 'templates' && <TemplatesPanel />}
    </aside>
  );
};
