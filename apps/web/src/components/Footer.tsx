import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter, Disc as Discord, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-surface/50 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-festive-gold p-0.5 glow-primary">
                <div className="w-full h-full bg-background rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-festive-gold" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Festive<span className="text-primary-500">UI</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
              The premier festival & event animation library, drag-and-drop visual studio, and marketplace for modern web applications.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface hover:text-white hover:bg-surfaceHover">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface hover:text-white hover:bg-surfaceHover">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface hover:text-white hover:bg-surfaceHover">
                <Discord className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Products */}
          <div>
            <h4 className="font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2.5">
              <li><Link href="/studio" className="hover:text-white transition-colors">FestiveUI Studio</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition-colors">Animation Marketplace</Link></li>
              <li><Link href="/festivals" className="hover:text-white transition-colors">Festival Collections</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Core Runtime SDK</Link></li>
            </ul>
          </div>

          {/* Col 3: Frameworks */}
          <div>
            <h4 className="font-semibold text-white mb-4">Supported Frameworks</h4>
            <ul className="space-y-2.5">
              <li><Link href="/docs/react" className="hover:text-white transition-colors">React 18 / 19</Link></li>
              <li><Link href="/docs/next" className="hover:text-white transition-colors">Next.js App Router</Link></li>
              <li><Link href="/docs/vue" className="hover:text-white transition-colors">Vue 3 Composable</Link></li>
              <li><Link href="/docs/angular" className="hover:text-white transition-colors">Angular Standalone</Link></li>
              <li><Link href="/docs/vanilla" className="hover:text-white transition-colors">Vanilla & Custom Elements</Link></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Developer & Legal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/docs" className="hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing & Licenses</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Commercial Licensing</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FestiveUI Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for celebration worldwide <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
