'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Code2,
  Terminal,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Sparkles,
  Shield,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const navItems = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'installation', title: 'Installation' },
    { id: 'react', title: 'React Integration' },
    { id: 'next', title: 'Next.js App Router' },
    { id: 'vue', title: 'Vue 3 Composable' },
    { id: 'angular', title: 'Angular Standalone' },
    { id: 'vanilla', title: 'Vanilla JavaScript' },
    { id: 'web-component', title: 'Web Components' },
    { id: 'visual-editor', title: 'FestiveUI Studio' },
    { id: 'api-keys', title: 'API Keys & Security' },
    { id: 'licensing', title: 'Licensing & Commercial Use' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-10">
      {/* Left Sidebar (260px) */}
      <aside className="w-full md:w-64 shrink-0 space-y-1 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">
          Documentation
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
              activeSection === item.id
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'text-slate-400 hover:text-white hover:bg-surface'
            }`}
          >
            <span>{item.title}</span>
            {activeSection === item.id && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ))}
      </aside>

      {/* Main Documentation Content */}
      <article className="flex-1 max-w-4xl space-y-8 text-slate-300 text-sm leading-relaxed">
        {activeSection === 'getting-started' && (
          <section className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white">Getting Started with FestiveUI</h1>
            <p>
              FestiveUI is an enterprise-grade festival UI decoration library, animation engine, and visual drag-and-drop studio designed to make websites celebratory across all cultural holidays and milestones.
            </p>
            <div className="p-4 rounded-xl border border-primary-500/30 bg-primary-950/20 text-primary-200 text-xs">
              <strong>Core Engine Architecture:</strong> FestiveUI is built on a framework-independent core (<code className="bg-slate-900 px-1 py-0.5 rounded font-mono">@festiveui/core</code>) which handles requestAnimationFrame loops, automatic resize observers, reduced-motion compliance, and DOM teardown without memory leaks.
            </div>
          </section>
        )}

        {activeSection === 'installation' && (
          <section className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white">Installation</h1>
            <p>Install the adapter for your frontend framework:</p>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-border flex items-center justify-between">
                <span>npm install @festiveui/react @festiveui/core</span>
                <button
                  onClick={() => copyCode('npm install @festiveui/react @festiveui/core', 'inst-react')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedId === 'inst-react' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-border flex items-center justify-between">
                <span>npm install @festiveui/next @festiveui/react @festiveui/core</span>
                <button
                  onClick={() => copyCode('npm install @festiveui/next @festiveui/react @festiveui/core', 'inst-next')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedId === 'inst-next' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'react' && (
          <section className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white">React Integration</h1>
            <p>Use ready-made named components or the generic <code className="text-primary-400">FestiveAnimation</code> wrapper:</p>
            <div className="p-4 rounded-xl bg-slate-950 border border-border font-mono text-xs overflow-x-auto">
              <pre>{`import { DiyaEffect, FireworksEffect } from '@festiveui/react';

export default function FestivalBanner() {
  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-slate-950">
      <FireworksEffect frequency={1.2} particleCount={70} />
      <DiyaEffect position="bottom-right" size={90} glow />
    </div>
  );
}`}</pre>
            </div>
          </section>
        )}

        {activeSection === 'next' && (
          <section className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white">Next.js App Router Integration</h1>
            <p>
              To ensure full compatibility with Server-Side Rendering (SSR) without hydration mismatch errors, import from <code className="text-primary-400">@festiveui/next</code>:
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-border font-mono text-xs overflow-x-auto">
              <pre>{`'use client';

import { NextFestiveAnimation } from '@festiveui/next';

export function DiwaliHero() {
  return (
    <section className="relative w-full h-96">
      <NextFestiveAnimation
        type="diya-glow"
        config={{ position: 'bottom-right', size: 90 }}
      />
    </section>
  );
}`}</pre>
            </div>
          </section>
        )}

        {activeSection === 'vue' && (
          <section className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white">Vue 3 Integration</h1>
            <p>Integrate using our declarative custom directive:</p>
            <div className="p-4 rounded-xl bg-slate-950 border border-border font-mono text-xs overflow-x-auto">
              <pre>{`<template>
  <div v-festive="{ type: 'diwali-fireworks', config: { frequency: 1.2 } }" style="height: 400px;"></div>
</template>

<script setup>
import { FestiveVuePlugin } from '@festiveui/vue';
</script>`}</pre>
            </div>
          </section>
        )}

        {activeSection === 'visual-editor' && (
          <section className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white">FestiveUI Studio</h1>
            <p>
              FestiveUI Studio is a browser-based drag-and-drop visual editor. It allows non-technical creators and developers to visually compose, scale, and adjust festive animations without code.
            </p>
            <ul className="space-y-2 text-xs list-disc pl-5">
              <li><strong>Mode A (Canvas):</strong> Freeform design on an isolated high-DPI canvas overlay.</li>
              <li><strong>Mode B (Website Target):</strong> Targets specific CSS selectors like <code className="text-primary-400">#hero</code> or <code className="text-primary-400">.promo-banner</code>.</li>
              <li><strong>Time-Travel:</strong> Instant Undo/Redo stack and snapshot version history stored in PostgreSQL.</li>
            </ul>
          </section>
        )}

        {activeSection === 'api-keys' && (
          <section className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white">API Keys & Security</h1>
            <p>
              Every developer project comes with cryptographically generated API keys. Secret keys are displayed once upon generation and stored exclusively as Argon2/bcrypt hashes on the backend.
            </p>
            <div className="p-4 rounded-xl border border-border bg-surface text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Shield className="w-4 h-4" /> Domain Origin Whitelisting
              </div>
              <p>Configure allowed hostnames (e.g. <code className="font-mono">myshop.com, staging.myshop.com</code>) to prevent unauthorized embedding of your paid animation bundles.</p>
            </div>
          </section>
        )}

        {activeSection === 'licensing' && (
          <section className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white">Licensing & Commercial Use</h1>
            <p>
              Free animations in FestiveUI can be used for personal and open-source projects under MIT. Premium animations include commercial developer licenses permitting client deployment and commercial store usage.
            </p>
          </section>
        )}
      </article>
    </div>
  );
}
