'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  Check,
  Copy,
  Layers,
  ArrowLeft,
  Shield,
  Download,
  Star,
  Terminal,
  ExternalLink,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { ApiClient } from '@/lib/api';
import { FestiveAnimation } from '@festiveui/react';

export default function AnimationDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [animation, setAnimation] = useState<any>(null);
  const [config, setConfig] = useState<any>({});
  const [framework, setFramework] = useState<'react' | 'next' | 'vue' | 'angular' | 'vanilla' | 'web-component'>('react');
  const [copied, setCopied] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [licenseResult, setLicenseResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    ApiClient.fetch(`/animations/${slug}`)
      .then((data) => {
        setAnimation(data);
        setConfig(data.schema?.defaultSettings || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load animation:', err);
        setLoading(false);
      });
  }, [slug]);

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleCheckout = async () => {
    setPurchasing(true);
    try {
      const res = await ApiClient.fetch('/checkout', {
        method: 'POST',
        body: JSON.stringify({
          animationIds: [animation.id],
          provider: 'stripe'
        })
      });
      setLicenseResult(res);
    } catch (err: any) {
      alert(err.message || 'Please sign in to purchase.');
    } finally {
      setPurchasing(false);
    }
  };

  const getGeneratedCode = () => {
    if (!animation) return '';
    const cfgStr = JSON.stringify(config, null, 2);

    switch (framework) {
      case 'react':
        return `import { FestiveAnimation } from '@festiveui/react';\n\nexport default function FestiveBanner() {\n  return (\n    <FestiveAnimation\n      type="${animation.slug}"\n      config={${cfgStr}}\n    />\n  );\n}`;

      case 'next':
        return `'use client';\n\nimport { NextFestiveAnimation } from '@festiveui/next';\n\nexport default function FestiveHero() {\n  return (\n    <NextFestiveAnimation\n      type="${animation.slug}"\n      config={${cfgStr}}\n    />\n  );\n}`;

      case 'vue':
        return `<template>\n  <div v-festive="{ type: '${animation.slug}', config: ${JSON.stringify(config)} }"></div>\n</template>\n\n<script setup>\nimport { FestiveVuePlugin } from '@festiveui/vue';\n</script>`;

      case 'angular':
        return `// In your Angular Component\nFestiveUI.mount({\n  type: '${animation.slug}',\n  target: this.container.nativeElement,\n  config: ${cfgStr}\n});`;

      case 'web-component':
        return `<script type="module" src="https://cdn.jsdelivr.net/npm/@festiveui/web-component/dist/index.js"></script>\n\n<festive-animation type="${animation.slug}"></festive-animation>`;

      case 'vanilla':
      default:
        return `import { FestiveUI } from '@festiveui/core';\n\nFestiveUI.mount({\n  type: '${animation.slug}',\n  target: '#my-banner',\n  config: ${cfgStr}\n});`;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getGeneratedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading animation details...</p>
      </div>
    );
  }

  if (!animation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Animation Not Found</h2>
        <Link href="/marketplace" className="text-primary-400 text-sm hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const properties = animation.schema?.schemaJson?.properties || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Live Interactive Preview & Property Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Box */}
          <div className="rounded-2xl border border-border bg-slate-950 p-6 flex flex-col justify-between relative min-h-[380px] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-border/60 pb-3 mb-4 z-10">
              <span className="font-mono flex items-center gap-1.5 text-primary-400">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Live Preview
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Rendering 60 FPS
              </span>
            </div>

            <div className="relative flex-1 flex items-center justify-center min-h-[260px]">
              <FestiveAnimation
                type={animation.slug}
                config={{
                  position: 'center',
                  size: config.size || 100,
                  settings: config
                }}
              />
            </div>

            <div className="text-[11px] text-slate-500 pt-3 border-t border-border/60 flex items-center justify-between z-10">
              <span>Format: {animation.format?.toUpperCase()}</span>
              <span>Hardware-accelerated RAF</span>
            </div>
          </div>

          {/* Schema-Driven Live Inspector Sliders */}
          {Object.keys(properties).length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-primary-400" />
                <h3 className="font-bold text-white text-sm">Visual Property Inspector</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(properties).map(([propKey, propMeta]: [string, any]) => {
                  const val = config[propKey] !== undefined ? config[propKey] : propMeta.default;

                  if (propMeta.type === 'range') {
                    return (
                      <div key={propKey} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>{propMeta.label}</span>
                          <span className="font-mono text-primary-400">{val}</span>
                        </div>
                        <input
                          type="range"
                          min={propMeta.min}
                          max={propMeta.max}
                          step={propMeta.step || 1}
                          value={val}
                          onChange={(e) => handleConfigChange(propKey, Number(e.target.value))}
                          className="w-full accent-primary-500 cursor-pointer"
                        />
                      </div>
                    );
                  }

                  if (propMeta.type === 'boolean') {
                    return (
                      <div key={propKey} className="flex items-center justify-between py-1">
                        <span className="text-xs text-slate-300">{propMeta.label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean(val)}
                          onChange={(e) => handleConfigChange(propKey, e.target.checked)}
                          className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          )}

          {/* Integration Code Tabs */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Installation & Usage</h3>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-border text-xs">
                {(['react', 'next', 'vue', 'angular', 'vanilla', 'web-component'] as const).map((fw) => (
                  <button
                    key={fw}
                    onClick={() => setFramework(fw)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                      framework === fw ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {fw}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block */}
            <div className="rounded-xl border border-border bg-slate-950 overflow-hidden relative">
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/60 border-b border-border text-xs text-slate-400">
                <span className="font-mono">Component snippet</span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 text-primary-400 hover:text-primary-300 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                <code>{getGeneratedCode()}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Right Col: Metadata, Commercial Licensing & Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-surface">
            {/* Festival tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-600/20 text-primary-400 border border-primary-500/30">
                {animation.festival?.name}
              </span>
              <span className="text-xs text-slate-400">v{animation.currentVersion}</span>
            </div>

            <h1 className="text-2xl font-extrabold text-white mb-2">{animation.name}</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{animation.description}</p>

            {/* Pricing Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-border flex items-center justify-between mb-6">
              <div>
                <span className="text-xs text-slate-400 block">License Price</span>
                <span className={`text-2xl font-extrabold ${animation.isFree ? 'text-emerald-400' : 'text-white'}`}>
                  {animation.isFree ? 'FREE' : `$${Number(animation.price).toFixed(2)}`}
                </span>
              </div>
              <div className="text-right text-xs text-slate-400">
                <span className="block font-semibold text-slate-200">Commercial Ready</span>
                <span>Lifetime Domain Whitelist</span>
              </div>
            </div>

            {/* Purchase / Open in Studio Buttons */}
            <div className="space-y-3">
              <Link
                href="/studio"
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-md glow-primary flex items-center justify-center gap-2 transition-all"
              >
                <Layers className="w-4 h-4 text-festive-gold" />
                Customize in FestiveUI Studio
              </Link>

              {!animation.isFree && !licenseResult && (
                <button
                  onClick={handleCheckout}
                  disabled={purchasing}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  {purchasing ? 'Processing Order...' : `Buy Commercial License ($${Number(animation.price).toFixed(2)})`}
                </button>
              )}
            </div>

            {/* License Result Modal / Banner if purchased */}
            {licenseResult && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> License Issued Successfully!
                </div>
                <p>Order #{licenseResult.orderNumber}</p>
                <div className="p-2 bg-slate-950 rounded font-mono text-emerald-300 select-all">
                  {licenseResult.licenseKey}
                </div>
                <p className="text-[11px] text-slate-400">Invoice: {licenseResult.invoiceNumber}</p>
              </div>
            )}
          </div>

          {/* Feature Specs */}
          <div className="p-6 rounded-2xl border border-border bg-surface text-xs text-slate-300 space-y-3">
            <h4 className="font-bold text-white text-sm mb-2">Technical Specifications</h4>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-slate-400">Rendering Technology</span>
              <span className="font-semibold text-white uppercase">{animation.format}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-slate-400">Supported Frameworks</span>
              <span className="font-semibold text-white">React, Next, Vue, Angular, Vanilla</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-slate-400">Accessibility</span>
              <span className="font-semibold text-emerald-400">prefers-reduced-motion compliant</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-slate-400">Targeting Modes</span>
              <span className="font-semibold text-white">Canvas (Mode A) & Selector (Mode B)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Memory Cleanup</span>
              <span className="font-semibold text-emerald-400">Automatic RAF & DOM teardown</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
