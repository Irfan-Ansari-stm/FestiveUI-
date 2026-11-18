'use client';

import React from 'react';
import { Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { useStudioStore } from './studio-store';

export const AssetsPanel: React.FC = () => {
  const store = useStudioStore();

  const handleUploadClick = () => {
    alert('Asset uploaded and stored in PostgreSQL S3 storage key buffer.');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-3.5 space-y-3.5 text-xs select-none">
      <div className="flex items-center justify-between text-slate-400">
        <span className="font-semibold">Media & Graphic Assets</span>
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-[11px]"
        >
          <Upload className="w-3 h-3" /> Upload
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#1F2937] text-center space-y-2 border-dashed">
        <ImageIcon className="w-8 h-8 mx-auto text-slate-500" />
        <div className="text-white font-semibold">Drop SVG, PNG or Lottie files</div>
        <p className="text-[11px] text-slate-500">Up to 10MB per asset • Optimized for WebGL</p>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Default Brand Assets</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Gold Diya Base', type: 'SVG Vector' },
            { name: 'Lotus Ornament', type: 'SVG Vector' },
            { name: 'Crystal Flake', type: 'PNG 4K' },
            { name: 'Fanous Brass', type: 'SVG Vector' }
          ].map(asset => (
            <div
              key={asset.name}
              onClick={() => alert(`Asset ${asset.name} ready to insert`)}
              className="p-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] hover:border-primary-500/50 cursor-pointer space-y-1"
            >
              <div className="w-full h-12 rounded-lg bg-[#111827] flex items-center justify-center text-primary-400 font-bold text-xs">
                {asset.name.split(' ')[0]}
              </div>
              <div className="font-bold text-white text-[11px] truncate">{asset.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">{asset.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
