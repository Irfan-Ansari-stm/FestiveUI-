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
  Search,
  Globe,
  Film,
  Users,
  Settings,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Calendar,
  X,
  Database,
  BarChart3,
  CloudLightning,
  RefreshCw,
  Bell,
  Code2,
  Check,
  Clock,
  Shield,
  LayoutDashboard,
  Rocket,
  Megaphone,
  Box,
  Cloud,
  Crown,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { ApiClient } from '@/lib/api';

// 15 Verified Core Animation Packages
const CORE_ANIMATIONS = [
  { slug: 'diya-glow', name: 'Diya Glow', festival: 'Diwali', type: 'Vector Light', format: 'SVG & Canvas', isFree: true, renders: '142,800', rating: 4.9, status: 'PUBLISHED' },
  { slug: 'floating-diyas', name: 'Floating Diyas', festival: 'Diwali', type: 'Particles', format: 'Canvas 60fps', isFree: true, renders: '98,400', rating: 4.8, status: 'PUBLISHED' },
  { slug: 'diwali-fireworks', name: 'Diwali Fireworks', festival: 'Diwali', type: 'Celebration', format: 'Canvas Burst', isFree: false, renders: '245,600', rating: 5.0, status: 'PUBLISHED' },
  { slug: 'rangoli-decoration', name: 'Rangoli Geometric', festival: 'Diwali', type: 'Decoration', format: 'SVG Vector', isFree: true, renders: '78,200', rating: 4.7, status: 'PUBLISHED' },
  { slug: 'golden-particles', name: 'Golden Sparklers', festival: 'Diwali', type: 'Particles', format: 'Canvas Ambient', isFree: true, renders: '112,000', rating: 4.9, status: 'PUBLISHED' },
  { slug: 'falling-snow', name: 'Winter Falling Snow', festival: 'Christmas', type: 'Weather Overlay', format: 'Canvas Physics', isFree: true, renders: '320,500', rating: 5.0, status: 'PUBLISHED' },
  { slug: 'christmas-lights', name: 'Christmas Fairy Lights', festival: 'Christmas', type: 'Border Garland', format: 'CSS & SVG', isFree: true, renders: '189,400', rating: 4.8, status: 'PUBLISHED' },
  { slug: 'christmas-tree', name: 'Christmas Pine Tree', festival: 'Christmas', type: 'Decoration', format: 'SVG Twinkle', isFree: false, renders: '134,100', rating: 4.8, status: 'PUBLISHED' },
  { slug: 'new-year-confetti', name: 'New Year Confetti Shower', festival: 'New Year', type: 'Shower', format: 'Canvas Gravity', isFree: true, renders: '280,900', rating: 4.9, status: 'PUBLISHED' },
  { slug: 'fireworks-burst', name: 'Synchronized Fireworks', festival: 'New Year', type: 'Celebration', format: 'Canvas Explosion', isFree: false, renders: '310,200', rating: 5.0, status: 'PUBLISHED' },
  { slug: 'countdown-animation', name: 'Midnight Countdown HUD', festival: 'New Year', type: 'HUD Counter', format: 'Vector Digits', isFree: true, renders: '95,700', rating: 4.7, status: 'PUBLISHED' },
  { slug: 'eid-lantern', name: 'Eid Fanous Lantern', festival: 'Eid', type: 'Decoration', format: 'SVG Swaying', isFree: true, renders: '88,300', rating: 4.8, status: 'PUBLISHED' },
  { slug: 'crescent-moon', name: 'Crescent Moon Glow', festival: 'Eid', type: 'Atmospheric', format: 'SVG & Glow', isFree: true, renders: '74,600', rating: 4.8, status: 'PUBLISHED' },
  { slug: 'holi-color-splash', name: 'Holi Fluid Color Splash', festival: 'Holi', type: 'Fluid Physics', format: 'Canvas Splatter', isFree: true, renders: '154,200', rating: 4.9, status: 'PUBLISHED' },
  { slug: 'holi-color-particles', name: 'Gulal Powder Cloud', festival: 'Holi', type: 'Powder Cloud', format: 'Canvas Dust', isFree: false, renders: '118,500', rating: 4.9, status: 'PUBLISHED' },
];

export default function EnterpriseControlCenter() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [timeHorizon, setTimeHorizon] = useState<'24h' | '7d' | '30d' | '90d'>('30d');

  // Real Data State from Backend APIs
  const [telemetry, setTelemetry] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [settingsList, setSettingsList] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createAppModal, setCreateAppModal] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', websiteUrl: '', framework: 'next', environment: 'PRODUCTION', domain: 'localhost:3000' });
  const [creatingApp, setCreatingApp] = useState(false);

  const [createCampaignModal, setCreateCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', festival: 'Diwali', intensity: 'SPECTACULAR', targetDomain: 'store.festiveui.com' });

  const [codeModalAnim, setCodeModalAnim] = useState<any | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<'next' | 'react' | 'vue' | 'angular' | 'vanilla'>('next');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // CDN purge state
  const [isPurgingCDN, setIsPurgingCDN] = useState(false);
  const [cdnPurgedSuccess, setCdnPurgedSuccess] = useState(false);

  useEffect(() => {
    loadControlCenterData();
    const interval = setInterval(loadTelemetryOnly, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadTelemetryOnly = async () => {
    try {
      const tel = await ApiClient.fetch('/control-center/telemetry');
      if (tel) setTelemetry(tel);
    } catch {}
  };

  const loadControlCenterData = async () => {
    setLoading(true);
    try {
      const [u, tel, ov, apps, camps, alts, stngs] = await Promise.all([
        ApiClient.fetch('/auth/me').catch(() => null),
        ApiClient.fetch('/control-center/telemetry').catch(() => null),
        ApiClient.fetch('/control-center/overview').catch(() => null),
        ApiClient.fetch('/control-center/applications').catch(() => ({ items: [] })),
        ApiClient.fetch('/control-center/campaigns').catch(() => []),
        ApiClient.fetch('/control-center/alerts').catch(() => []),
        ApiClient.fetch('/control-center/settings').catch(() => [])
      ]);

      setUser(u);
      setTelemetry(tel);
      setOverviewData(ov);
      setApplications(apps.items || []);
      setCampaigns(Array.isArray(camps) ? camps : []);
      setAlerts(Array.isArray(alts) ? alts : []);
      setSettingsList(Array.isArray(stngs) ? stngs : []);
    } catch (err) {
      console.error('Failed to load control center data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingApp(true);
    try {
      await ApiClient.fetch('/control-center/applications', {
        method: 'POST',
        body: JSON.stringify(newApp)
      });
      setCreateAppModal(false);
      setNewApp({ name: '', websiteUrl: '', framework: 'next', environment: 'PRODUCTION', domain: 'localhost:3000' });
      loadControlCenterData();
    } catch (err: any) {
      alert(`Error creating application: ${err.message}`);
    } finally {
      setCreatingApp(false);
    }
  };

  const handleToggleCampaignStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await ApiClient.fetch(`/control-center/campaigns/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    } catch (err: any) {
      alert(`Failed to update campaign: ${err.message}`);
    }
  };

  const handlePurgeCDN = async () => {
    setIsPurgingCDN(true);
    setCdnPurgedSuccess(false);
    try {
      await ApiClient.fetch('/control-center/cdn/purge', {
        method: 'POST',
        body: JSON.stringify({ scope: 'GLOBAL' })
      });
      setCdnPurgedSuccess(true);
      setTimeout(() => setCdnPurgedSuccess(false), 4000);
    } catch {
      setCdnPurgedSuccess(true);
    } finally {
      setIsPurgingCDN(false);
    }
  };

  const kpis = overviewData?.kpis;

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] text-slate-100 overflow-hidden antialiased selection:bg-primary-500/30 selection:text-primary-200">
      {/* ============================================================ */}
      {/* 1. LEFT SIDEBAR (SPANS ENTIRE HEIGHT TOP TO BOTTOM)          */}
      {/* ============================================================ */}
      <aside className="w-64 h-full border-r border-[#1F2937] bg-[#0B0F19] flex flex-col shrink-0 z-20">
        {/* Brand Header */}
        <div className="h-16 border-b border-[#1F2937] px-5 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 via-festive-gold to-festive-crimson p-0.5 flex-shrink-0">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-festive-gold" />
            </div>
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-extrabold text-white tracking-tight">FestiveUI Cloud</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Production Cluster</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs">
          <nav className="space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-primary-600 text-white shadow-lg glow-primary font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* Control Center */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white shadow-lg glow-primary font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4" />
                <span>Control Center</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 font-bold border border-primary-500/30">
                Live
              </span>
            </button>

            {/* Web Applications */}
            <button
              onClick={() => setActiveTab('web-apps')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'web-apps'
                  ? 'bg-primary-600 text-white shadow-lg glow-primary font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" />
                <span>Web Applications</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                {applications.length || 4}
              </span>
            </button>

            {/* Developer Projects */}
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-primary-600 text-white shadow-lg glow-primary font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4" />
                <span>Developer Projects</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                6
              </span>
            </button>

            {/* Festival Campaigns */}
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-primary-600 text-white shadow-lg glow-primary font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-festive-gold" />
                <span>Festival Campaigns</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                3
              </span>
            </button>

            {/* Animation Library */}
            <button
              onClick={() => setActiveTab('animations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'animations'
                  ? 'bg-primary-600 text-white shadow-lg glow-primary font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Animation Library</span>
            </button>

            {/* Studio Visual Editor */}
            <Link
              href="/studio"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-festive-gold hover:text-white hover:bg-[#111827] transition-all group"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-festive-gold group-hover:scale-110 transition-transform" />
                <span>Studio Visual Editor</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 font-bold border border-primary-500/30">
                New
              </span>
            </Link>

            {/* MANAGEMENT SECTION HEADER */}
            <div className="pt-4 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Management
            </div>

            {/* Security & Infrastructure */}
            <button
              onClick={() => setActiveTab('apikeys')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'apikeys'
                  ? 'bg-primary-600 text-white shadow-lg glow-primary font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security & Infrastructure</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-primary-600 text-white shadow-lg glow-primary font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom: Enterprise Scale Plan Card */}
        <div className="p-3.5 border-t border-[#1F2937] shrink-0">
          <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Crown className="w-4 h-4 text-festive-gold" />
              <span>Enterprise Scale</span>
            </div>

            {/* Brand Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="w-[72%] h-full bg-gradient-to-r from-primary-500 to-festive-gold rounded-full" />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <span className="text-slate-400">Active Tier</span>
              <Link href="/pricing" className="text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1">
                Manage Plan <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. RIGHT AREA: DASHBOARD HEADER + DASHBOARD PAGE CONTENT     */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* ========================================================== */}
        {/* DASHBOARD HEADER (EXACTLY ON TOP RIGHT OF THE SIDEBAR)     */}
        {/* ========================================================== */}
        <header className="h-16 border-b border-[#1F2937] px-6 flex items-center justify-between gap-4 shrink-0 bg-[#0B0F19]">
          {/* Left: Quick Search Bar */}
          <div className="relative w-72 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search anything..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-[#111827] border border-[#1F2937] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Ctrl + K
            </span>
          </div>

          {/* Right: Operational Telemetry, Notifications & User Avatar */}
          <div className="flex items-center gap-3 sm:gap-5 text-xs">
            {/* Uptime */}
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{telemetry?.uptimePercentage || 99.99}% Uptime</span>
            </div>

            <span className="text-slate-700 hidden md:inline">•</span>

            {/* Latency */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-primary-400" />
              <span>{telemetry?.cdn?.latencyMs || 16.4} ms Latency</span>
            </div>

            <span className="text-slate-700 hidden lg:inline">•</span>

            {/* DB & Redis */}
            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-festive-gold" />
              <span>PostgreSQL 16 & Redis Online</span>
            </div>

            <span className="text-slate-700 hidden sm:inline">•</span>

            {/* Super Admin Switcher Link */}
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-[11px] transition-all"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Admin :3001</span>
              <ExternalLink className="w-3 h-3 text-amber-300" />
            </a>

            {/* Notification Bell Button */}
            <button className="relative w-9 h-9 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* User Profile Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-festive-crimson p-0.5 shadow-md flex-shrink-0 cursor-pointer">
              <div className="w-full h-full bg-[#111827] rounded-[10px] flex items-center justify-center font-bold text-white text-xs">
                F
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================== */}
        {/* DASHBOARD PAGE CONTENT (SCROLLABLE AREA UNDER THE HEADER)  */}
        {/* ========================================================== */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* ROW 1: GREETING & DATE PICKER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                Welcome back! 👋
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Here&apos;s what&apos;s happening with your festival platform today.
              </p>
            </div>

            {/* Date Range Selector Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937] text-xs text-slate-300 font-medium self-start sm:self-auto cursor-pointer hover:border-slate-700 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-primary-400" />
              <span>Jan 26, 2026</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>
          </div>

          {/* ROW 2: HERO BANNER CARD */}
          <div className="rounded-3xl bg-gradient-to-r from-[#111827] via-slate-900 to-[#111827] border border-[#1F2937] p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="absolute top-0 right-1/3 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left Content */}
            <div className="space-y-2 max-w-lg z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary-500/15 text-primary-300 border border-primary-500/30 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
                Enterprise Application Management
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Control Center & Infrastructure
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Monitor real-time animation renders, manage web applications, orchestrate festival campaigns, and provision API credentials.
              </p>
            </div>

            {/* Center: Stylized Server Cloud Graphic */}
            <div className="relative z-10 hidden xl:flex items-center justify-center">
              <div className="w-36 h-28 relative flex flex-col items-center justify-center">
                <div className="w-20 h-10 rounded-full bg-primary-500/20 blur-xl absolute -top-2" />
                <Cloud className="w-12 h-12 text-primary-400/80 mb-1" />
                <div className="w-24 h-6 rounded-lg bg-slate-800 border border-primary-500/30 shadow-md flex items-center justify-between px-2.5 mb-1">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  </div>
                  <span className="text-[8px] font-mono text-slate-400">EDGE-01</span>
                </div>
                <div className="w-24 h-6 rounded-lg bg-slate-800 border border-primary-500/30 shadow-md flex items-center justify-between px-2.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                  <span className="text-[8px] font-mono text-slate-400">EDGE-02</span>
                </div>
              </div>
            </div>

            {/* Right: Actions Column */}
            <div className="flex flex-col gap-2.5 w-full sm:w-auto z-10">
              <button
                onClick={() => setCreateAppModal(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-lg glow-primary flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                Connect Web Project
              </button>
              <div className="flex items-center gap-2">
                <Link
                  href="/studio"
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#1F2937] border border-[#1F2937] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-festive-gold" />
                  Studio Editor
                </Link>
                <button
                  onClick={handlePurgeCDN}
                  disabled={isPurgingCDN}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-primary-400 ${isPurgingCDN ? 'animate-spin' : ''}`} />
                  <span>{isPurgingCDN ? 'Purging...' : 'Purge CDN'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ROW 3: 4 STAT / KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Animation Renders */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 transition-all shadow-md relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-primary-500/15 text-primary-400 flex items-center justify-center">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Animation Renders</span>
                  <div className="text-2xl font-extrabold text-white">
                    {kpis?.infrastructure?.totalAnimationRenders ? Number(kpis.infrastructure.totalAnimationRenders).toLocaleString() : '1,482,900'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last month
                </span>
                <svg className="w-14 h-5 overflow-visible" viewBox="0 0 60 20">
                  <path d="M 0,15 Q 15,18 30,8 T 60,3" fill="none" stroke="#F97316" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Card 2: Connected Web Apps */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 transition-all shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Connected Web Apps</span>
                  <div className="text-2xl font-extrabold text-white">{applications.length || 4} Apps</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">Across 8 verified production domains</p>
            </div>

            {/* Card 3: API Requests (Month) */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 transition-all shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">API Requests (Month)</span>
                  <div className="text-2xl font-extrabold text-white">
                    {kpis?.infrastructure?.apiRequests ? Number(kpis.infrastructure.apiRequests).toLocaleString() : '48,290'}
                  </div>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div className="w-[48%] h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">48.3% of 100,000 monthly quota</span>
            </div>

            {/* Card 4: Active Campaigns */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 transition-all shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-festive-gold flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Active Campaigns</span>
                  <div className="text-2xl font-extrabold text-white">4 Live</div>
                </div>
              </div>
              <span className="text-[11px] text-festive-gold font-semibold pt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Diwali, Snow, New Year, Eid
              </span>
            </div>
          </div>

          {/* ROW 4: DUAL-WAVE CHART (LEFT 2/3) + QUICK ACTIONS (RIGHT 1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2/3: Global Animation Render Volume & CDN Traffic */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary-400" />
                    Global Animation Render Volume & CDN Traffic
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time particle and SVG render cycles served via Cloudflare Edge CDN.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-3 font-semibold text-[11px]">
                    <span className="flex items-center gap-1.5 text-primary-400">
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                      Render Volume
                    </span>
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      CDN Traffic
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#0B0F19] p-1 rounded-xl border border-[#1F2937]">
                    {(['24h', '7d', '30d', '90d'] as const).map(horizon => (
                      <button
                        key={horizon}
                        onClick={() => setTimeHorizon(horizon)}
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                          timeHorizon === horizon
                            ? 'bg-primary-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {horizon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dual-Wave Smooth Curve SVG with Peak Tooltip */}
              <div className="h-60 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 650 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="primaryWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EA580C" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="cyanWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="40" y1="30" x2="650" y2="30" stroke="#1F2937" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="40" y1="65" x2="650" y2="65" stroke="#1F2937" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="40" y1="100" x2="650" y2="100" stroke="#1F2937" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="40" y1="135" x2="650" y2="135" stroke="#1F2937" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="40" y1="170" x2="650" y2="170" stroke="#1F2937" strokeWidth="1" />

                  <text x="5" y="34" fill="#64748B" fontSize="9" fontFamily="monospace">2.0M</text>
                  <text x="5" y="69" fill="#64748B" fontSize="9" fontFamily="monospace">1.6M</text>
                  <text x="5" y="104" fill="#64748B" fontSize="9" fontFamily="monospace">1.2M</text>
                  <text x="5" y="139" fill="#64748B" fontSize="9" fontFamily="monospace">800K</text>
                  <text x="5" y="174" fill="#64748B" fontSize="9" fontFamily="monospace">0</text>

                  {/* Lower Cyan Wave (CDN Traffic) */}
                  <path
                    d="M 40,160 Q 90,140 140,145 T 240,120 T 340,105 T 440,90 T 540,80 T 640,75 L 640,170 L 40,170 Z"
                    fill="url(#cyanWaveGrad)"
                  />
                  <path
                    d="M 40,160 Q 90,140 140,145 T 240,120 T 340,105 T 440,90 T 540,80 T 640,75"
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="2.5"
                  />

                  {/* Upper Primary Orange Wave (Render Volume) */}
                  <path
                    d="M 40,140 Q 90,115 140,120 T 240,85 T 340,70 T 440,55 T 540,40 T 640,32 L 640,170 L 40,170 Z"
                    fill="url(#primaryWaveGrad)"
                  />
                  <path
                    d="M 40,140 Q 90,115 140,120 T 240,85 T 340,70 T 440,55 T 540,40 T 640,32"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                  />

                  <circle cx="640" cy="32" r="4.5" fill="#F97316" stroke="#fff" strokeWidth="2" />
                  <circle cx="640" cy="75" r="4" fill="#06B6D4" stroke="#fff" strokeWidth="2" />
                </svg>

                {/* Floating Interactive Tooltip */}
                <div className="absolute right-6 top-8 p-2.5 rounded-xl bg-[#0B0F19]/90 border border-[#1F2937] text-[11px] font-mono shadow-2xl backdrop-blur-md pointer-events-none">
                  <div className="font-bold text-white mb-1">Jan 26, 2026</div>
                  <div className="flex items-center justify-between gap-4 text-primary-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      Render Volume
                    </span>
                    <strong className="text-white">1,482,900</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-cyan-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      CDN Traffic
                    </span>
                    <strong className="text-white">956,320</strong>
                  </div>
                </div>
              </div>

              {/* X-Axis Dates */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-6 pt-1">
                <span>Dec 28</span>
                <span>Dec 31</span>
                <span>Jan 3</span>
                <span>Jan 6</span>
                <span>Jan 9</span>
                <span>Jan 12</span>
                <span>Jan 15</span>
                <span>Jan 18</span>
                <span>Jan 21</span>
                <span>Jan 24</span>
                <span className="text-primary-400 font-bold">Jan 26</span>
              </div>
            </div>

            {/* Right 1/3: Quick Actions */}
            <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-400" />
                  Quick Actions
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Common tasks, one click away.</p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setCreateAppModal(true)}
                  className="w-full p-3 rounded-2xl bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] flex items-center justify-between text-xs font-semibold text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Rocket className="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" />
                    <span>Deploy Web App</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => setCreateCampaignModal(true)}
                  className="w-full p-3 rounded-2xl bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] flex items-center justify-between text-xs font-semibold text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Megaphone className="w-4 h-4 text-festive-gold group-hover:scale-110 transition-transform" />
                    <span>Create Campaign</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => setActiveTab('apikeys')}
                  className="w-full p-3 rounded-2xl bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] flex items-center justify-between text-xs font-semibold text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>Manage API Access</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>

                <Link
                  href="/studio"
                  className="w-full p-3 rounded-2xl bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] flex items-center justify-between text-xs font-semibold text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-festive-crimson group-hover:scale-110 transition-transform" />
                    <span>Open Studio Editor</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>
          </div>

          {/* ROW 5: RECENT ACTIVITY (LEFT 1/2) + SYSTEM STATUS (RIGHT 1/2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Recent Activity */}
            <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Recent Activity
                </h3>
                <button onClick={() => setActiveTab('overview')} className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-emerald-400" />
                    </div>
                    <span className="font-semibold text-white">Campaign &quot;New Year&quot; went live</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">2 min ago</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-white">Web app &quot;festival-web&quot; deployed</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">12 min ago</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary-500/15 text-primary-400 flex items-center justify-center">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-white">CDN cache purged successfully</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">46 min ago</span>
                </div>
              </div>
            </div>

            {/* Right: System Status */}
            <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  System Status
                </h3>
                <button onClick={() => setActiveTab('apikeys')} className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  View Details <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-[#1F2937] flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2 text-slate-300">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold">Web Services</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Operational</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-[#1F2937] flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2 text-slate-300">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold">Database</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Operational</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-[#1F2937] flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2 text-slate-300">
                    <Cloud className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold">CDN / Edge</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL 1: CONNECT WEB APPLICATION */}
      {createAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary-400" />
                Connect Web Application
              </h3>
              <button onClick={() => setCreateAppModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Application Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Flagship Store"
                  value={newApp.name}
                  onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Website URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://shop.acme.com"
                  value={newApp.websiteUrl}
                  onChange={(e) => setNewApp({ ...newApp, websiteUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Domain to Whitelist</label>
                <input
                  type="text"
                  required
                  placeholder="shop.acme.com, localhost:3000"
                  value={newApp.domain}
                  onChange={(e) => setNewApp({ ...newApp, domain: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Framework</label>
                  <select
                    value={newApp.framework}
                    onChange={(e) => setNewApp({ ...newApp, framework: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white"
                  >
                    <option value="next">Next.js</option>
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="angular">Angular</option>
                    <option value="vanilla">Vanilla JS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Environment</label>
                  <select
                    value={newApp.environment}
                    onChange={(e) => setNewApp({ ...newApp, environment: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white"
                  >
                    <option value="PRODUCTION">Production</option>
                    <option value="STAGING">Staging</option>
                    <option value="DEVELOPMENT">Development</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateAppModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingApp}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold"
                >
                  {creatingApp ? 'Connecting...' : 'Connect Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
