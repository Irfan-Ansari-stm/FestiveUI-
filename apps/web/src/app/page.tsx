'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Layers,
  ArrowRight,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Globe2,
  ShieldCheck,
  Sliders,
  ExternalLink,
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';
import { FestiveAnimation } from '@festiveui/react';

export default function HomePage() {
  const [activeFestival, setActiveFestival] = useState<'diwali' | 'christmas' | 'holi' | 'new-year' | 'eid'>('diwali');
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleSnippet = `import { DiyaEffect, FireworksEffect } from '@festiveui/react';

export default function FestivalBanner() {
  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-slate-950">
      <FireworksEffect frequency={1.2} particleCount={70} />
      <DiyaEffect position="bottom-right" size={90} glow />
    </div>
  );
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-border">
        {/* Background Ambient Glow & Active Festival Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-primary-600/20 via-festive-gold/10 to-transparent blur-3xl opacity-70" />
          
          {/* Real live background effect based on festival toggle */}
          {activeFestival === 'diwali' && (
            <FestiveAnimation type="diwali-fireworks" config={{ position: 'full', opacity: 0.35, settings: { frequency: 0.8, particleCount: 45 } }} />
          )}
          {activeFestival === 'christmas' && (
            <FestiveAnimation type="falling-snow" config={{ position: 'full', opacity: 0.6, settings: { count: 60, speed: 0.8 } }} />
          )}
          {activeFestival === 'holi' && (
            <FestiveAnimation type="holi-color-particles" config={{ position: 'full', opacity: 0.45, settings: { intensity: 0.7 } }} />
          )}
          {activeFestival === 'new-year' && (
            <FestiveAnimation type="new-year-confetti" config={{ position: 'full', opacity: 0.5, settings: { count: 65, speed: 0.9 } }} />
          )}
          {activeFestival === 'eid' && (
            <FestiveAnimation type="golden-particles" config={{ position: 'full', opacity: 0.4, settings: { count: 35 } }} />
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-medium text-slate-300 mb-8 glow-card">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>FestiveUI 2.0 Released</span>
            <span className="text-slate-500">|</span>
            <span className="text-primary-400">15+ Live Core Animations</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl text-white leading-[1.12]">
            Celebrate Festivals on Your Website with{' '}
            <span className="bg-gradient-to-r from-festive-gold via-primary-500 to-festive-crimson bg-clip-text text-transparent">
              One Line of Code
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed">
            The complete festival animation engine, visual drag-and-drop studio, and component marketplace. Add glowing diyas, snowfall, confetti, and fireworks into React, Next.js, Vue, Angular, or Vanilla JS.
          </p>

          {/* Festival Switcher Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-surface/90 border border-border backdrop-blur-md">
            {[
              { id: 'diwali', label: '🪔 Diwali', color: 'text-amber-400' },
              { id: 'christmas', label: '❄️ Christmas', color: 'text-sky-400' },
              { id: 'holi', label: '🎨 Holi', color: 'text-pink-400' },
              { id: 'new-year', label: '🎉 New Year', color: 'text-emerald-400' },
              { id: 'eid', label: '🌙 Eid', color: 'text-yellow-300' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFestival(f.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeFestival === f.id
                    ? 'bg-primary-600 text-white shadow-md glow-primary scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-surfaceHover'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/studio"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-base shadow-lg glow-primary flex items-center justify-center gap-2 transition-all hover:scale-[1.03]"
            >
              <Layers className="w-5 h-5 text-festive-gold" />
              Launch Visual Studio
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href="/marketplace"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-surface hover:bg-surfaceHover border border-border text-slate-200 font-semibold text-base transition-colors flex items-center justify-center gap-2"
            >
              Browse 15+ Animations
            </Link>
          </div>

          {/* Live Code Preview Card */}
          <div className="mt-14 w-full max-w-3xl rounded-2xl border border-border bg-surface/80 backdrop-blur-md shadow-2xl overflow-hidden text-left">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">FestivalBanner.tsx</span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-surface text-slate-300 hover:text-white hover:bg-surfaceHover transition-colors border border-border"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-5 text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
              <code>{sampleSnippet}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE SHOWCASE */}
      <section className="w-full py-20 border-b border-border bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">
              Verified Runtime Quality
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Hardware-Accelerated Animation Pipeline
            </h3>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Real functional canvas and SVG components rendering in real-time. Zero memory leaks, automatically paused out of viewport, respecting reduced-motion preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Diya Glow */}
            <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between glow-card relative overflow-hidden">
              <div className="h-44 rounded-xl bg-slate-950 border border-border/60 relative flex items-center justify-center overflow-hidden mb-4">
                <FestiveAnimation type="diya-glow" config={{ position: 'center', size: 100, settings: { glow: true, glowIntensity: 0.9, flickerSpeed: 1.2 } }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-lg">Diya Glow</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    SVG + Filters
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Handcrafted clay lamp with organic flame flickering physics, radial illumination, and golden rim tokens.
                </p>
                <Link href="/marketplace/diya-glow" className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  Inspect Configuration <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Rangoli Mandala */}
            <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between glow-card relative overflow-hidden">
              <div className="h-44 rounded-xl bg-slate-950 border border-border/60 relative flex items-center justify-center overflow-hidden mb-4">
                <FestiveAnimation type="rangoli-decoration" config={{ position: 'center', size: 130, settings: { rotationSpeed: 0.8 } }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-lg">Rangoli Decoration</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    Sacred Geometry
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Concentric rotating floral mandalas with revolving petals, dynamic color palettes, and soft center aura.
                </p>
                <Link href="/marketplace/rangoli-decoration" className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  Inspect Configuration <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Eid Fanous Lantern */}
            <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between glow-card relative overflow-hidden">
              <div className="h-44 rounded-xl bg-slate-950 border border-border/60 relative flex items-center justify-center overflow-hidden mb-4">
                <FestiveAnimation type="eid-lantern" config={{ position: 'center', size: 120, settings: { swingSpeed: 1.0, glow: true } }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-lg">Eid Lantern (Fanous)</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Pendulum Sway
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Moroccan brass filigree lantern with swinging chain motion, internal flickering candle, and crescent crown.
                </p>
                <Link href="/marketplace/eid-lantern" className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  Inspect Configuration <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTED FRAMEWORKS */}
      <section className="w-full py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Universal Framework Ecosystem — One Engine, All Stacks
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'React', badge: '@festiveui/react', desc: 'Hooks & Components' },
              { name: 'Next.js', badge: '@festiveui/next', desc: 'SSR-Safe App Router' },
              { name: 'Vue 3', badge: '@festiveui/vue', desc: 'Directives & Composables' },
              { name: 'Angular', badge: '@festiveui/angular', desc: 'Standalone Directives' },
              { name: 'Vanilla JS', badge: '@festiveui/core', desc: 'Lightweight Runtime' },
              { name: 'Web Component', badge: '<festive-animation>', desc: 'W3C Custom Elements' }
            ].map((f) => (
              <div key={f.name} className="p-4 rounded-xl border border-border bg-surface text-center glow-card">
                <Code2 className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">{f.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{f.badge}</p>
                <p className="text-[11px] text-slate-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR FESTIVAL COLLECTIONS */}
      <section className="w-full py-20 border-b border-border bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">
                Curated Themes
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                World Cultural Festival Collections
              </h3>
            </div>
            <Link href="/festivals" className="mt-4 md:mt-0 text-sm font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1">
              Explore All 8 Festivals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                slug: 'diwali',
                name: 'Diwali',
                subtitle: 'Festival of Lights',
                items: 'Diyas, Fireworks, Rangoli, Golden Dust',
                icon: '🪔',
                color: 'from-amber-600/30 to-amber-900/10'
              },
              {
                slug: 'christmas',
                name: 'Christmas',
                subtitle: 'Winter & Yuletide Joy',
                items: 'Snowfall, Fairy Lights, Pine Trees',
                icon: '❄️',
                color: 'from-sky-600/30 to-sky-900/10'
              },
              {
                slug: 'holi',
                name: 'Holi',
                subtitle: 'Festival of Colors',
                items: 'Gulal Splashes, Color Particles, Clouds',
                icon: '🎨',
                color: 'from-pink-600/30 to-pink-900/10'
              },
              {
                slug: 'new-year',
                name: 'New Year',
                subtitle: 'Midnight Celebration',
                items: 'Confetti Ribbons, Ring Bursts, Countdowns',
                icon: '🎉',
                color: 'from-emerald-600/30 to-emerald-900/10'
              }
            ].map((fest) => (
              <Link
                key={fest.slug}
                href={`/festivals/${fest.slug}`}
                className="group p-6 rounded-2xl border border-border bg-surface glow-card flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-3">{fest.icon}</div>
                  <h4 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    {fest.name}
                  </h4>
                  <p className="text-xs font-semibold text-primary-400 mt-0.5">{fest.subtitle}</p>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{fest.items}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>View Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="w-full py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">
              Three-Step Developer Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              From Discovery to Production in Under 5 Minutes
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-border bg-surface relative">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/30 text-primary-400 font-extrabold text-lg flex items-center justify-center mb-6">
                1
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Discover & Preview</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Browse our marketplace of tested, framework-independent festive decorations, particle bursts, and interactive greetings.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-surface relative">
              <div className="w-12 h-12 rounded-xl bg-festive-gold/20 border border-festive-gold/30 text-festive-gold font-extrabold text-lg flex items-center justify-center mb-6">
                2
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Visually Customize</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Open in FestiveUI Studio. Drag, resize, rotate, and tune speeds, particle quantities, glow intensities, and section selectors without code.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-surface relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-lg flex items-center justify-center mb-6">
                3
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Export & Mount</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Copy verified code for React, Next.js, Vue, or Vanilla. Save configs to your project and manage allowed domains with secure API keys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VISUAL STUDIO DEMO TEASER */}
      <section className="w-full py-20 border-b border-border bg-gradient-to-b from-slate-950 via-surface/40 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12 glow-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-festive-gold/10 text-festive-gold text-xs font-bold border border-festive-gold/20 mb-4">
                  <Sliders className="w-3.5 h-3.5" />
                  Most Powerful Feature
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  FestiveUI Studio: Drag-and-Drop Visual Editor
                </h3>
                <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
                  Visually compose multi-layer festive scenes with live element selection, resize handles, position coordinates, and schema-driven property controls.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Mode A (Standalone Canvas) & Mode B (Website Section Targeting e.g. #hero)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Time-traveling Undo / Redo engine & document version snapshots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant export to real React, Next.js, Vue, and Vanilla JS SDK APIs</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    href="/studio"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-md glow-primary transition-all hover:scale-105"
                  >
                    Open Studio Canvas <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Studio Live Preview Box */}
              <div className="rounded-2xl border border-border/80 bg-slate-950 p-4 shadow-inner relative h-80 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-border pb-2.5">
                  <span className="font-mono">Studio Canvas Preview</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                    Live Mode
                  </span>
                </div>
                <div className="relative flex-1 flex items-center justify-center">
                  <FestiveAnimation type="diwali-fireworks" config={{ position: 'full', opacity: 0.7 }} />
                  <FestiveAnimation type="diya-glow" config={{ position: 'bottom-right', size: 85 }} />
                  <FestiveAnimation type="golden-particles" config={{ position: 'full', opacity: 0.5 }} />
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-border">
                  <span>Layers: 3 Active</span>
                  <span>Viewport: Desktop 1440px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING PLANS */}
      <section className="w-full py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">
              Transparent Commercial Pricing
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Start Free, Scale as You Celebrate
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                code: 'FREE',
                name: 'Starter Free',
                price: '$0',
                period: '/month',
                desc: 'Open source & personal hobby sites.',
                features: ['Access to 10+ free animations', '3 Active Projects', 'Community Support', 'React & Vanilla SDKs']
              },
              {
                code: 'PRO',
                name: 'Developer Pro',
                price: '$19',
                period: '/month',
                isPopular: true,
                desc: 'Freelancers & modern frontend developers.',
                features: ['All 15+ Core Animations', '15 Active Projects', 'Studio Visual Editor', 'Priority CDN delivery', 'All Framework SDKs']
              },
              {
                code: 'BUSINESS',
                name: 'Business Scale',
                price: '$49',
                period: '/month',
                desc: 'High-traffic e-commerce & marketing agencies.',
                features: ['Unlimited Animations', '50 Active Projects', 'Commercial Web Whitelisting', 'Multi-domain API Keys', 'Dedicated Support']
              },
              {
                code: 'ENTERPRISE',
                name: 'Enterprise',
                price: '$199',
                period: '/month',
                desc: 'Custom enterprise effects, SLAs & agreements.',
                features: ['Custom Bespoke Animations', '200+ Projects', 'Dedicated Account Manager', 'Custom Licensing Agreement', '99.99% SLA']
              }
            ].map((p) => (
              <div
                key={p.code}
                className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  p.isPopular
                    ? 'border-primary-500 bg-surface shadow-xl glow-primary relative'
                    : 'border-border bg-surface'
                }`}
              >
                {p.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary-600 text-[10px] font-bold text-white uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-white text-lg">{p.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-extrabold text-white">{p.price}</span>
                    <span className="text-xs text-slate-400">{p.period}</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-primary-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href="/pricing"
                    className={`block w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all ${
                      p.isPopular
                        ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-md'
                        : 'bg-surfaceHover hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    Select {p.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DEVELOPER TESTIMONIALS */}
      <section className="w-full py-20 border-b border-border bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">
              Loved by Engineers
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Modern Web Development
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-surface glow-card">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                "We mounted the Diwali Fireworks and Diya Glow effects on our e-commerce storefront within 10 minutes. Conversion during the festive holiday week jumped 34%!"
              </p>
              <div className="text-xs">
                <span className="font-bold text-white block">Priya Sharma</span>
                <span className="text-slate-400">Head of Frontend, TrendBazaar</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-surface glow-card">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                "The Visual Studio is brilliant. Our non-technical marketing lead tuned the snow speed and positions, exported the Next.js snippet, and we merged it right away."
              </p>
              <div className="text-xs">
                <span className="font-bold text-white block">Marcus Vance</span>
                <span className="text-slate-400">Tech Lead, Snowdrop Studios</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-surface glow-card">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                "Zero canvas memory leaks, automatic cleanup on unmount, and perfect reduced-motion accessibility. It behaves like a true enterprise library."
              </p>
              <div className="text-xs">
                <span className="font-bold text-white block">Elena Rostova</span>
                <span className="text-slate-400">Senior Staff Architect, Omniverse</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="w-full py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl font-extrabold text-white">
              Everything You Need to Know
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does FestiveUI perform on mobile and low-powered devices?',
                a: 'All animations are built on hardware-accelerated SVG and high-DPI HTML5 canvas loops. They automatically pause when scrolled out of view and throttle during background tabs.'
              },
              {
                q: 'Can I target specific website elements like my navbar or hero banner?',
                a: 'Yes! Mode B in FestiveUI Studio allows CSS selector targeting (e.g. #hero, .promo-banner) to anchor diyas, lights, or snow directly to your existing DOM nodes.'
              },
              {
                q: 'Is FestiveUI compatible with Next.js 14 App Router and SSR?',
                a: 'Yes, our @festiveui/next package includes safe client boundaries, preventing hydration mismatch errors.'
              },
              {
                q: 'Can I purchase commercial licenses for client projects?',
                a: 'Yes, every purchase or subscription comes with cryptographically verifiable commercial licenses and domain-whitelisted API keys.'
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-surface">
                <h4 className="font-bold text-white text-base mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
