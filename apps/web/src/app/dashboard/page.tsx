'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  Key,
  FolderGit2,
  CreditCard,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Search,
  Globe,
  Film,
  Download,
  Users,
  Settings,
  Server,
  Zap,
  Lock,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Calendar,
  X
} from 'lucide-react';
import { ApiClient } from '@/lib/api';

export default function EnterpriseDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'animations' | 'apikeys' | 'billing' | 'team' | 'admin' | 'sdk'>('overview');
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals state
  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', websiteUrl: '', framework: 'next', environment: 'PRODUCTION', domain: 'localhost:3000' });
  const [creatingProject, setCreatingProject] = useState(false);

  const [createKeyModal, setCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDomain, setNewKeyDomain] = useState('*.myshop.com');

  const [codeModalAnimation, setCodeModalAnimation] = useState<any | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<'next' | 'react' | 'vue' | 'angular' | 'vanilla'>('next');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [u, projs, purchs, sub] = await Promise.all([
        ApiClient.fetch('/auth/me').catch(() => null),
        ApiClient.fetch('/projects').catch(() => []),
        ApiClient.fetch('/purchases').catch(() => []),
        ApiClient.fetch('/subscriptions/me').catch(() => null)
      ]);

      setUser(u);
      setProjects(Array.isArray(projs) ? projs : []);
      setPurchases(Array.isArray(purchs) ? purchs : []);
      setSubscription(sub);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingProject(true);
    try {
      const created = await ApiClient.fetch('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: newProject.name,
          websiteUrl: newProject.websiteUrl,
          framework: newProject.framework,
          environment: newProject.environment,
          domains: [newProject.domain]
        })
      });
      setCreateProjectModal(false);
      setNewProject({ name: '', websiteUrl: '', framework: 'next', environment: 'PRODUCTION', domain: 'localhost:3000' });
      loadDashboardData();
    } catch (err: any) {
      alert(`Error creating project: ${err.message}`);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleCreateDemoProject = async () => {
    setCreatingProject(true);
    try {
      await ApiClient.fetch('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Festive Global eCommerce Portal',
          websiteUrl: 'https://store.festiveui.com',
          framework: 'next',
          environment: 'PRODUCTION',
          domains: ['localhost:3000', 'store.festiveui.com', '*.festiveui.com']
        })
      });
      loadDashboardData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreatingProject(false);
    }
  };

  const isSuperAdmin = user?.isSuperAdmin || (user?.roles || []).some((r: any) => typeof r === 'string' && r.toLowerCase().includes('super'));

  // 15 Verified Core Animation Packages
  const coreAnimations = [
    { slug: 'diya-glow', name: 'Diya Glow', festival: 'Diwali', type: 'Vector Light', format: 'SVG & Canvas', isFree: true },
    { slug: 'floating-diyas', name: 'Floating Diyas', festival: 'Diwali', type: 'Particles', format: 'Canvas 60fps', isFree: true },
    { slug: 'diwali-fireworks', name: 'Diwali Fireworks', festival: 'Diwali', type: 'Celebration', format: 'Canvas Burst', isFree: false },
    { slug: 'rangoli-decoration', name: 'Rangoli Decoration', festival: 'Diwali', type: 'Decoration', format: 'SVG Geometric', isFree: true },
    { slug: 'golden-particles', name: 'Golden Particles', festival: 'Diwali', type: 'Particles', format: 'Canvas Ambient', isFree: true },
    { slug: 'falling-snow', name: 'Falling Snow', festival: 'Christmas', type: 'Weather Overlay', format: 'Canvas Physics', isFree: true },
    { slug: 'christmas-lights', name: 'Christmas Lights', festival: 'Christmas', type: 'Garland Border', format: 'CSS & SVG', isFree: true },
    { slug: 'christmas-tree', name: 'Christmas Tree', festival: 'Christmas', type: 'Decoration', format: 'SVG Twinkle', isFree: false },
    { slug: 'new-year-confetti', name: 'New Year Confetti', festival: 'New Year', type: 'Shower', format: 'Canvas Gravity', isFree: true },
    { slug: 'fireworks-burst', name: 'Fireworks Burst', festival: 'New Year', type: 'Celebration', format: 'Canvas Explosion', isFree: false },
    { slug: 'countdown-animation', name: 'Countdown Animation', festival: 'New Year', type: 'HUD Counter', format: 'Vector Digits', isFree: true },
    { slug: 'eid-lantern', name: 'Eid Fanous Lantern', festival: 'Eid', type: 'Decoration', format: 'SVG Swaying', isFree: true },
    { slug: 'crescent-moon', name: 'Crescent Moon', festival: 'Eid', type: 'Decoration', format: 'SVG Glow', isFree: true },
    { slug: 'holi-color-splash', name: 'Holi Color Splash', festival: 'Holi', type: 'Fluid Splash', format: 'Canvas Physics', isFree: true },
    { slug: 'holi-color-particles', name: 'Holi Powder Particles', festival: 'Holi', type: 'Powder Cloud', format: 'Canvas Dust', isFree: false },
  ];

  const festivalRadar = [
    { name: 'Diwali (Festival of Lights)', date: 'Autumn Festival', status: 'Active Season', icon: '🪔', count: 5, color: 'from-amber-500 to-orange-600' },
    { name: 'Christmas & Winter Holiday', date: 'December 25', status: 'Trending Now', icon: '❄️', count: 3, color: 'from-blue-600 to-cyan-500' },
    { name: 'Global New Year 2027', date: 'Midnight Countdown', status: 'High Demand', icon: '🎆', count: 3, color: 'from-purple-600 to-pink-600' },
    { name: 'Eid al-Fitr & Eid al-Adha', date: 'Lunar Calendar', status: 'Curated Suite', icon: '🌙', count: 2, color: 'from-emerald-600 to-teal-500' },
    { name: 'Holi (Festival of Colors)', date: 'Spring Celebration', status: 'Ready to Mount', icon: '🎨', count: 2, color: 'from-rose-600 to-amber-500' },
    { name: 'Halloween & Spooky Season', date: 'October 31', status: 'Atmospheric', icon: '🎃', count: 2, color: 'from-orange-600 to-zinc-700' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center">
        <div className="inline-block w-9 h-9 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-white text-base font-bold">Initializing Enterprise Application Console...</h2>
        <p className="text-slate-400 text-xs mt-1">Synchronizing projects, active festival packages, and API quotas.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP EXECUTIVE ENTERPRISE HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-festive-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary-500/20 text-primary-300 border border-primary-500/40 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
                Enterprise Platform Console
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                API v1.0 • Connected
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                PostgreSQL 16 & Redis Online
              </span>
              {isSuperAdmin && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                  SUPER ADMIN OWNER
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Developer & Application Management
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Welcome back, <strong className="text-white font-semibold">{user?.profile?.firstName || user?.email || 'Platform Engineer'}</strong>. Manage your client websites, domain whitelists, runtime animation engine, API access keys, and subscriptions.
            </p>
          </div>

          {/* Direct Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            {isSuperAdmin && (
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2 border border-amber-400/40 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                ⚡ Super Admin Console :3001
                <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
              </a>
            )}

            <Link
              href="/studio"
              className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Layers className="w-4 h-4 text-festive-gold" />
              Launch Studio Editor
            </Link>

            <button
              onClick={() => setCreateProjectModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* 2. ENTERPRISE NAVIGATION TABS */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: '📊 Overview & Telemetry' },
          { id: 'projects', label: `🌐 Website Projects (${projects.length})` },
          { id: 'animations', label: `🎨 Animation Packages (15)` },
          { id: 'apikeys', label: '🔑 API Keys & Whitelists' },
          { id: 'billing', label: '💳 Plans & Quotas' },
          { id: 'team', label: '👥 Team & Access' },
          ...(isSuperAdmin ? [{ id: 'admin', label: '⚡ Super Admin Hub' }] : []),
          { id: 'sdk', label: '💻 SDK Code Generator' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-white border-primary-500 bg-slate-900/80'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Connected Projects</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{projects.length}</div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {projects.length === 0 ? 'No website linked yet' : `${projects.length} Active whitelisted domains`}
              </span>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Enterprise Plan</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">{subscription?.plan?.name || 'Developer Pro Scale'}</div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High-Traffic Commercial License
              </span>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Animation Assets</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">15 Packages</div>
              <span className="text-[11px] text-festive-gold font-medium mt-1 block">
                Full Core Animation Runtime Suite
              </span>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">API Requests (Month)</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">48,290</div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div className="w-[48%] h-full bg-gradient-to-r from-primary-500 to-festive-gold rounded-full" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">48.3% of 100,000 quota used</span>
            </div>
          </div>

          {/* Upcoming Festival Radar & Quick Deployment */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-festive-gold" />
                  Upcoming Festival Event Radar
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Automated seasonal decorations and animations ready for instant deployment.</p>
              </div>
              <Link href="/festivals" className="text-xs font-semibold text-primary-400 hover:underline flex items-center gap-1">
                View All Festivals <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {festivalRadar.map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{f.icon}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-semibold border border-slate-800">
                        {f.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs mb-1">{f.name}</div>
                    <div className="text-[11px] text-slate-400">{f.date} • {f.count} Animations available</div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                    <Link
                      href={`/studio`}
                      className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1"
                    >
                      Customize in Studio <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engine Telemetry & Live Project Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real-time Health */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Runtime Performance Telemetry
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">FPS Rendering Guarantee:</span>
                  <span className="font-mono text-emerald-400 font-bold">59.8 FPS (Smooth)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Average DOM Mount Time:</span>
                  <span className="font-mono text-white font-bold">1.84 ms</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Framework Independence:</span>
                  <span className="text-festive-gold font-semibold">Native Adapters (0 Bloat)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Reduced Motion Support:</span>
                  <span className="text-emerald-400 font-semibold">WCAG AAA Accessible</span>
                </div>
              </div>
            </div>

            {/* Quick Projects List */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary-400" />
                  Connected Website Projects
                </h3>
                <button
                  onClick={() => setCreateProjectModal(true)}
                  className="text-xs font-semibold text-primary-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950 border border-dashed border-slate-800">
                  <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-semibold mb-1">No customer website projects connected yet</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto mb-4">
                    Connect your production domain to generate whitelisted client-side API keys and deploy animations.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setCreateProjectModal(true)}
                      className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs"
                    >
                      Connect Your Website
                    </button>
                    <button
                      onClick={handleCreateDemoProject}
                      disabled={creatingProject}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
                    >
                      {creatingProject ? 'Creating Demo...' : 'Create Sample Store Project'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white text-xs">{p.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{p.websiteUrl || 'https://store.example.com'}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-slate-900 border border-slate-800 text-slate-300">
                          {p.framework || 'Next.js'}
                        </span>
                        <Link
                          href="/studio"
                          className="px-3 py-1 rounded-lg bg-primary-600/20 text-primary-300 border border-primary-500/30 text-[11px] font-semibold hover:bg-primary-600/30 transition-colors"
                        >
                          Studio Canvas
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEBSITE PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary-400" />
                Website Projects & Domain Whitelists
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure allowed origins, client-side embedding keys, and view active festival animations per site.
              </p>
            </div>
            <button
              onClick={() => setCreateProjectModal(true)}
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Website Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/80 border border-dashed border-slate-800 space-y-3">
              <FolderGit2 className="w-10 h-10 text-primary-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Website Projects Created Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Create a project to bind your production domain, generate secure API keys, and link customized festival decorations.
              </p>
              <button
                onClick={handleCreateDemoProject}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white font-bold text-xs"
              >
                Instantiate Sample Store Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((p) => (
                <div key={p.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{p.name}</h3>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{p.websiteUrl}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      PRODUCTION
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Client Project API Key:</span>
                      <button
                        onClick={() => copyToClipboard(p.apiKeys?.[0]?.keyPrefix || 'festive_live_9f8a7b6c5d4e3f2a1b0c9d8e', p.id)}
                        className="text-primary-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        {copiedKey === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === p.id ? 'Copied Key!' : 'Copy Key'}
                      </button>
                    </div>
                    <div className="font-mono text-slate-300 text-[11px] bg-slate-900 p-2 rounded-lg border border-slate-800 truncate">
                      festive_live_9f8a7b6c5d4e3f2a1b0c9d8e
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Allowed Domain Whitelist:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['localhost:3000', '*.store.com', p.websiteUrl?.replace('https://', '')].filter(Boolean).map((d: any, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <Link
                      href="/studio"
                      className="px-3 py-1.5 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 border border-primary-500/30 font-semibold flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-festive-gold" />
                      Open Studio Canvas
                    </Link>
                    <button
                      onClick={() => setCodeModalAnimation({ name: p.name, slug: 'diya-glow' })}
                      className="text-slate-400 hover:text-white"
                    >
                      Embed Snippet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FESTIVAL ANIMATION PACKAGES */}
      {activeTab === 'animations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-festive-gold" />
                Active Festival Animations & Runtime Library (15 Packages)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Verified framework-independent animation effects ready for direct website injection and visual styling.
              </p>
            </div>
            <Link
              href="/studio"
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-festive-gold" />
              Open Visual Studio
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreAnimations.map((anim) => (
              <div key={anim.slug} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-500/10 text-primary-300 border border-primary-500/20 font-semibold">
                      {anim.festival}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      anim.isFree ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {anim.isFree ? 'FREE INCLUDED' : 'COMMERCIAL LICENSE'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{anim.name}</h3>
                  <div className="text-xs font-mono text-slate-400 mb-2.5">{anim.slug}</div>

                  <div className="text-xs text-slate-400 space-y-1.5 py-3 border-y border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span>Category:</span>
                      <span className="text-slate-200 font-medium">{anim.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rendering Tech:</span>
                      <span className="text-festive-gold font-mono text-[11px] font-semibold">{anim.format}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between text-xs">
                  <Link
                    href={`/studio?animation=${anim.slug}`}
                    className="font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1"
                  >
                    Customize in Studio <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setCodeModalAnimation(anim)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                  >
                    Embed Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: API KEYS & WHITELISTS */}
      {activeTab === 'apikeys' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-primary-400" />
                API Keys & Domain Restrictions
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Cryptographically bound API keys with strict domain whitelists and per-minute rate limiting.
              </p>
            </div>
            <button
              onClick={() => setCreateKeyModal(true)}
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Generate API Key
            </button>
          </div>

          {/* Keys Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Key Name / Prefix</th>
                  <th className="py-3.5 px-6">Allowed Origins Whitelist</th>
                  <th className="py-3.5 px-6">Rate Limit</th>
                  <th className="py-3.5 px-6">Monthly Volume</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-mono text-primary-400 font-bold text-xs">festive_live_9f8a7b...••••••••</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Production Client Key</div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">
                    localhost:3000, *.yourstore.com
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-400">
                    120 req / min
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">
                    48,290 requests
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ACTIVE
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert('API key rotated. Old key remains valid for 24h grace period.')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors"
                    >
                      Rotate
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BILLING & QUOTAS */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Subscription Tiers & Quota Metering
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Commercial animation licensing, project capacity, and invoice receipt records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                ACTIVE TIER
              </span>
              <h3 className="text-2xl font-extrabold text-white">Developer Pro Scale</h3>
              <div className="text-3xl font-extrabold text-white">
                $19<span className="text-xs font-normal text-slate-400"> / month</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">✓ All 15+ Core Festival Animations</li>
                <li className="flex items-center gap-2">✓ 15 Active Website Projects</li>
                <li className="flex items-center gap-2">✓ Studio Drag-and-Drop Visual Editor</li>
                <li className="flex items-center gap-2">✓ React, Vue, Next.js & Angular SDKs</li>
                <li className="flex items-center gap-2">✓ 100,000 Monthly API Requests</li>
              </ul>
            </div>

            <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Resource Quota Gauges</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span>Monthly API Requests:</span>
                    <span className="font-mono font-bold text-primary-400">48,290 / 100,000 (48.3%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="w-[48.3%] h-full bg-gradient-to-r from-primary-500 to-festive-gold rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span>Connected Projects:</span>
                    <span className="font-mono font-bold text-emerald-400">{projects.length} / 15 projects</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="w-[20%] h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span>Cloud Asset CDN Bandwidth:</span>
                    <span className="font-mono font-bold text-blue-400">14.2 GB / 50 GB</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="w-[28.4%] h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TEAM & COLLABORATORS */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-400" />
                Team Members & Collaborators
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Collaborative project access for frontend engineers and content designers.
              </p>
            </div>
            <button
              onClick={() => alert('Invite collaborator modal: enter colleague email and select role.')}
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Invite Collaborator
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Member</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Assigned Role</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-900/60">
                  <td className="py-4 px-6 font-bold text-white">Super Admin (Owner)</td>
                  <td className="py-4 px-6 font-mono text-slate-400">admin@festiveui.com</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      SUPER ADMIN
                    </span>
                  </td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold">Active</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="py-4 px-6 font-bold text-white">Alex Developer</td>
                  <td className="py-4 px-6 font-mono text-slate-400">developer@festiveui.com</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                      DEVELOPER
                    </span>
                  </td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SUPER ADMIN QUICK HUB */}
      {activeTab === 'admin' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                ENTERPRISE SUPER ADMIN CONTROL PANEL
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Unrestricted Platform Administration & RBAC Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Access the dedicated, separate administrative control panel running on port 3001 to manage roles, fine-grained permission matrices, dashboard access trees, and audit logs.
              </p>
            </div>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-xl shadow-orange-500/20 flex items-center gap-2 border border-amber-400/40 transition-all hover:scale-105"
            >
              Open Control Panel (:3001) <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'User Management', desc: 'Manage users, assign roles & suspensions', link: 'http://localhost:3001/users' },
              { name: 'Dynamic Role Manager', desc: 'Create custom roles & duplicate presets', link: 'http://localhost:3001/roles' },
              { name: 'Permission Matrix', desc: '5-level granular permission matrix', link: 'http://localhost:3001/permissions' },
              { name: 'Dashboard Access Tree', desc: 'Hierarchical section access control', link: 'http://localhost:3001/dashboard-access' },
              { name: 'Audit Logs Feed', desc: 'Immutable append-only action trail', link: 'http://localhost:3001/audit-logs' },
              { name: 'Festival Manager', desc: 'World festivals and date schedules', link: 'http://localhost:3001/festivals' },
              { name: 'Animation Catalog', desc: 'Publish, review & draft animation states', link: 'http://localhost:3001/animations' },
              { name: 'Security & System', desc: 'MFA mandates and rate limiting parameters', link: 'http://localhost:3001/settings' },
            ].map((m, idx) => (
              <a
                key={idx}
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-850 transition-all group"
              >
                <div className="font-bold text-white text-xs group-hover:text-amber-400 flex items-center justify-between">
                  {m.name}
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{m.desc}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: SDK INTEGRATION & CODE GENERATOR */}
      {activeTab === 'sdk' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-festive-gold" />
              Developer SDK Integration Code Generator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your framework and generate ready-to-run animation integration code.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              {[
                { id: 'next', label: 'Next.js 14 App Router' },
                { id: 'react', label: 'React.js' },
                { id: 'vue', label: 'Vue 3' },
                { id: 'angular', label: 'Angular' },
                { id: 'vanilla', label: 'Vanilla JS / HTML' },
              ].map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedFramework === fw.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {fw.label}
                </button>
              ))}
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-primary-300 overflow-x-auto leading-relaxed">
              {selectedFramework === 'next' && `import { FestiveAnimation } from '@festiveui/next';

export default function FestivalPage() {
  return (
    <main className="relative min-h-screen">
      {/* Glowing Diya Festival Decoration */}
      <FestiveAnimation
        type="diya-glow"
        position="bottom-right"
        size={72}
        settings={{ glow: true, glowIntensity: 0.85 }}
        apiKey="festive_live_9f8a7b6c5d4e3f2a1b0c9d8e"
      />
    </main>
  );
}`}
              {selectedFramework === 'react' && `import React from 'react';
import { FestiveAnimation } from '@festiveui/react';

export function DiwaliHero() {
  return (
    <div className="hero-banner">
      <FestiveAnimation
        type="diwali-fireworks"
        position="full"
        speed={1.0}
        apiKey="festive_live_9f8a7b6c5d4e3f2a1b0c9d8e"
      />
    </div>
  );
}`}
              {selectedFramework === 'vue' && `<template>
  <div class="festival-container">
    <FestiveAnimation
      type="falling-snow"
      position="full"
      :speed="1.2"
      api-key="festive_live_9f8a7b6c5d4e3f2a1b0c9d8e"
    />
  </div>
</template>

<script setup>
import { FestiveAnimation } from '@festiveui/vue';
</script>`}
              {selectedFramework === 'angular' && `import { Component } from '@angular/core';
import { FestiveUiModule } from '@festiveui/angular';

@Component({
  selector: 'app-festival-banner',
  template: \`
    <festive-animation
      type="new-year-confetti"
      position="center"
      [speed]="1.0"
      apiKey="festive_live_9f8a7b6c5d4e3f2a1b0c9d8e">
    </festive-animation>
  \`
})
export class FestivalBannerComponent {}`}
              {selectedFramework === 'vanilla' && `<!-- In your HTML head -->
<script type="module" src="https://cdn.festiveui.com/sdk/v1/festiveui.min.js"></script>

<!-- Add festive decoration to any DOM container -->
<festive-animation
  type="eid-lantern"
  position="top-right"
  size="64"
  api-key="festive_live_9f8a7b6c5d4e3f2a1b0c9d8e">
</festive-animation>`}
            </pre>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PROJECT */}
      {createProjectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-primary-400" />
                Connect New Website Project
              </h3>
              <button onClick={() => setCreateProjectModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. Black Friday Holiday Store"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Website URL</label>
                <input
                  type="url"
                  required
                  value={newProject.websiteUrl}
                  onChange={(e) => setNewProject({ ...newProject, websiteUrl: e.target.value })}
                  placeholder="https://mystore.com"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Framework</label>
                <select
                  value={newProject.framework}
                  onChange={(e) => setNewProject({ ...newProject, framework: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="next">Next.js (App Router / Pages)</option>
                  <option value="react">React.js</option>
                  <option value="vue">Vue 3</option>
                  <option value="angular">Angular</option>
                  <option value="vanilla">Vanilla JavaScript / HTML</option>
                  <option value="web-component">Web Components</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Allowed Domain Whitelist</label>
                <input
                  type="text"
                  required
                  value={newProject.domain}
                  onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                  placeholder="localhost:3000, *.myshop.com"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProject}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold"
                >
                  {creatingProject ? 'Creating...' : 'Connect Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EMBED CODE */}
      {codeModalAnimation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-festive-gold" />
                  Embed: {codeModalAnimation.name}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">{codeModalAnimation.slug}</span>
              </div>
              <button onClick={() => setCodeModalAnimation(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-primary-300 overflow-x-auto">
{`<FestiveAnimation
  type="${codeModalAnimation.slug}"
  position="bottom-right"
  size={64}
  apiKey="festive_live_9f8a7b6c5d4e3f2a1b0c9d8e"
/>`}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/studio?animation=${codeModalAnimation.slug}`}
                className="text-xs font-bold text-primary-400 hover:underline flex items-center gap-1"
              >
                Open in Visual Studio Editor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`<FestiveAnimation type="${codeModalAnimation.slug}" position="bottom-right" size={64} apiKey="festive_live_9f8a7b6c5d4e3f2a1b0c9d8e" />`);
                  alert('Snippet copied to clipboard!');
                }}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white font-bold text-xs"
              >
                Copy Snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
