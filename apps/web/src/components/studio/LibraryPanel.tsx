'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Sparkles, Type } from 'lucide-react';
import { useStudioStore } from './studio-store';
import { INITIAL_LIBRARY_ITEMS, LibraryItem } from './types';
import { FestiveAnimation } from '@festiveui/react';

export const LibraryPanel: React.FC = () => {
  const store = useStudioStore();
  const [search, setSearch] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('all');

  const filteredItems = useMemo(() => {
    return INITIAL_LIBRARY_ITEMS.filter(item => {
      const matchSearch = search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.festival.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchFestival = selectedFestival === 'all' || item.festival === selectedFestival;
      return matchSearch && matchFestival;
    });
  }, [search, selectedFestival]);

  const handleAdd = (item: LibraryItem) => {
    const isTxt = item.format === 'Text';
    const newId = `layer-${item.slug}-${Date.now().toString(36)}`;

    store.addLayer({
      id: newId,
      name: item.name,
      animationSlug: item.slug,
      animationType: item.slug,
      isText: isTxt,
      textContent: isTxt ? 'Happy Diwali' : undefined,
      fontFamily: isTxt ? 'serif' : undefined,
      fontSize: isTxt ? 48 : undefined,
      fontWeight: isTxt ? '800' : undefined,
      textColor: isTxt ? '#FCD34D' : undefined,
      textGlow: isTxt ? '#F97316' : undefined,
      visible: true,
      locked: false,
      x: Math.round(store.canvasWidth / 2 - (isTxt ? 160 : 75)),
      y: Math.round(store.canvasHeight / 2 - (isTxt ? 40 : 75)),
      width: isTxt ? 320 : 150,
      height: isTxt ? 80 : 150,
      rotation: 0,
      scale: 1,
      zIndex: (store.layers.length + 1) * 10,
      opacity: 1,
      blendMode: 'normal',
      speed: 1,
      loop: true,
      direction: 'normal',
      entranceEffect: 'fade-in',
      timelineStart: 0,
      timelineDuration: 10,
      settings: { ...item.defaultSettings }
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-3.5 space-y-3 select-none text-xs">
      {/* Search Bar */}
      <div className="relative shrink-0">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search animations & effects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Festival Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none shrink-0">
        {[
          { id: 'all', label: 'All' },
          { id: 'diwali', label: 'Diwali' },
          { id: 'christmas', label: 'Christmas' },
          { id: 'new-year', label: 'New Year' },
          { id: 'eid', label: 'Eid' },
          { id: 'holi', label: 'Holi' },
          { id: 'general', label: 'Text / HUD' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedFestival(cat.id)}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
              selectedFestival === cat.id
                ? 'bg-primary-600 text-white font-bold'
                : 'bg-[#0B0F19] text-slate-400 hover:text-white border border-[#1F2937]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Animation Cards Grid */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
        {filteredItems.map(item => (
          <div
            key={item.slug}
            onClick={() => handleAdd(item)}
            className="p-3 rounded-2xl border border-[#1F2937] bg-[#0B0F19] hover:border-primary-500/60 cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:shadow-primary-950/40"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-center shrink-0">
                {item.format === 'Text' ? (
                  <Type className="w-5 h-5 text-festive-gold" />
                ) : (
                  <FestiveAnimation type={item.slug} config={{ position: 'center', size: 30 }} />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white group-hover:text-primary-400 transition-colors truncate">
                    {item.name}
                  </h4>
                  {!item.isFree && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shrink-0">
                      PRO
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  {item.festival} • {item.format}
                </span>
              </div>
            </div>

            <button
              title="Add to Canvas"
              className="p-1.5 rounded-lg bg-[#111827] group-hover:bg-primary-600 text-slate-300 group-hover:text-white transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
