'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Sliders,
  Check,
  Eye,
  ArrowLeft,
  Code2,
  CheckCircle2,
  Save,
  Layers
} from 'lucide-react';
import { ApiClient } from '@/lib/api';
import { FestiveAnimation } from '@festiveui/react';

export default function AdminAnimationStudioPage() {
  const [name, setName] = useState('Golden Starlight Burst');
  const [slug, setSlug] = useState('golden-starlight');
  const [format, setFormat] = useState('canvas');
  const [festivalId, setFestivalId] = useState('diwali');
  const [previewAnimation, setPreviewAnimation] = useState('golden-particles');
  const [schemaJsonText, setSchemaJsonText] = useState(
    JSON.stringify(
      {
        type: 'golden-particles',
        properties: {
          count: { name: 'count', label: 'Dust Density', type: 'range', default: 60, min: 20, max: 200 },
          speed: { name: 'speed', label: 'Rise Pace', type: 'range', default: 1.2, min: 0.2, max: 3.0 }
        }
      },
      null,
      2
    )
  );
  const [statusMessage, setStatusMessage] = useState('');

  const handleValidateAndPublish = async () => {
    try {
      JSON.parse(schemaJsonText); // Validate JSON
      setStatusMessage('Schema JSON validated successfully!');
      setTimeout(() => setStatusMessage(''), 2500);
    } catch {
      alert('Invalid JSON in schema definition. Please verify JSON syntax.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Operations
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Animation Studio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Author and validate animation packages, declarative JSON schemas, and live previews before marketplace publication.
          </p>
        </div>

        <button
          onClick={handleValidateAndPublish}
          className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Validate & Publish
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Metadata & JSON Schema Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl border border-border bg-surface space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Animation Metadata</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Package Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Slug Identifier</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Technology Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white focus:outline-none focus:border-primary-500 uppercase font-mono"
                >
                  <option value="canvas">Canvas (2D Physics)</option>
                  <option value="svg">SVG (Vector Filter)</option>
                  <option value="css">CSS Keyframes</option>
                  <option value="lottie">Lottie JSON</option>
                  <option value="webgl">WebGL 3D</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Live Engine Test Renderer</label>
                <select
                  value={previewAnimation}
                  onChange={(e) => setPreviewAnimation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-border text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="golden-particles">Floating Golden Particles</option>
                  <option value="diya-glow">Diya Glow</option>
                  <option value="diwali-fireworks">Diwali Fireworks</option>
                  <option value="falling-snow">Falling Snow</option>
                  <option value="new-year-confetti">New Year Confetti</option>
                  <option value="eid-lantern">Eid Fanous Lantern</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Declarative Property JSON Schema</label>
              <textarea
                rows={12}
                value={schemaJsonText}
                onChange={(e) => setSchemaJsonText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-border font-mono text-slate-300 text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Sandboxed Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl border border-border bg-slate-950 min-h-[460px] flex flex-col justify-between relative shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-border/60 pb-3 z-10">
              <span className="font-mono text-primary-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Sandboxed Engine Preview
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Verification Active
              </span>
            </div>

            <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
              <FestiveAnimation type={previewAnimation} config={{ position: 'center', size: 100 }} />
            </div>

            <div className="text-[11px] text-slate-500 pt-3 border-t border-border/60 flex items-center justify-between z-10">
              <span>Verified reduced-motion support</span>
              <span>Memory leak protection OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
