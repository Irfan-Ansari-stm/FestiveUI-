'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStudioStore } from './studio-store';
import { FESTIVE_TEMPLATES } from './types';

export const TemplatesPanel: React.FC = () => {
  const store = useStudioStore();

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-3.5 space-y-3.5 text-xs select-none">
      <div className="flex items-center justify-between text-slate-400">
        <span className="font-semibold">Pre-Built Compositions</span>
        <span className="font-mono text-primary-400 font-bold">{FESTIVE_TEMPLATES.length} Presets</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
        {FESTIVE_TEMPLATES.map(tmpl => (
          <div
            key={tmpl.id}
            onClick={() => store.loadTemplate(tmpl.id)}
            className="p-3.5 rounded-2xl bg-[#0B0F19] border border-[#1F2937] hover:border-primary-500/60 cursor-pointer transition-all space-y-2 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase" style={{ backgroundColor: `${tmpl.thumbnailColor}20`, color: tmpl.thumbnailColor }}>
                {tmpl.festival}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{tmpl.layersCount} Layers</span>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs group-hover:text-primary-400 transition-colors">
                {tmpl.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {tmpl.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-primary-400 font-semibold pt-1 text-[11px]">
              <span>Apply Composition</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
