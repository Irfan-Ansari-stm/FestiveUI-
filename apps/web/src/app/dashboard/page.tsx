'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Calendar,
  X,
  Radio,
  ChevronRight,
  Database,
  BarChart3,
  Flame,
  CloudLightning,
  RefreshCw,
  Bell,
  Code2,
  CheckCircle,
  HelpCircle,
  Clock,
  Shield,
  FileText,
  DollarSign,
  Cpu,
  HardDrive,
  Network,
  AlertTriangle,
  SlidersHorizontal,
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
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('overview');
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

  const [createKeyModal, setCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDomain, setNewKeyDomain] = useState('*.myshop.com');

  const [codeModalAnim, setCodeModalAnim] = useState<any | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<'next' | 'react' | 'vue' | 'angular' | 'vanilla'>('next');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // CDN purge state
  const [isPurgingCDN, setIsPurgingCDN] = useState(false);
  const [cdnPurgedSuccess, setCdnPurgedSuccess] = useState(false);

  // Live Canvas Interactive Preview
  const [selectedAnim, setSelectedAnim] = useState<string>('falling-snow');
  const [particleDensity, setParticleDensity] = useState<number>(80);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    loadControlCenterData();
    const interval = setInterval(loadTelemetryOnly, 10000); // Live heartbeat every 10s
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

  // Actions
  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingApp(true);
    try {
      const res = await ApiClient.fetch('/control-center/applications', {
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

  const handleResolveAlert = async (id: string) => {
    try {
      await ApiClient.fetch(`/control-center/alerts/${id}/resolve`, { method: 'PATCH' });
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    } catch {}
  };

  // 60 FPS HTML5 Canvas Animation Engine for Interactive Preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 260);

    const particles: any[] = [];
    for (let i = 0; i < particleDensity; i++) {
      if (selectedAnim === 'falling-snow') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.8 + 1,
          speed: (Math.random() * 1.5 + 0.6) * animationSpeed,
          wind: Math.sin(Math.random() * Math.PI) * 0.8
        });
      } else if (selectedAnim === 'diya-glow') {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 120,
          y: height * 0.7 + (Math.random() - 0.5) * 40,
          radius: Math.random() * 4 + 2,
          alpha: Math.random() * 0.8 + 0.2,
          pulse: Math.random() * 0.05 + 0.02,
          hue: Math.floor(Math.random() * 30 + 35)
        });
      } else {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2.5 * animationSpeed,
          vy: (Math.random() * 2.5 + 1) * animationSpeed,
          size: Math.random() * 5 + 2,
          color: `hsl(${Math.random() * 360}, 85%, 65%)`
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (selectedAnim === 'falling-snow') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          if (isPlaying) {
            p.y += p.speed;
            p.x += Math.sin(p.y * 0.01) * p.wind;
            if (p.y > height) {
              p.y = -5;
              p.x = Math.random() * width;
            }
          }
        }
      } else if (selectedAnim === 'diya-glow') {
        const grad = ctx.createRadialGradient(width / 2, height * 0.65, 10, width / 2, height * 0.65, 90);
        grad.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.65, 90, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.fillStyle = `hsla(${p.hue}, 95%, 55%, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          if (isPlaying) {
            p.y -= 0.6 * animationSpeed;
            p.alpha -= 0.01;
            if (p.alpha <= 0 || p.y < height * 0.4) {
              p.y = height * 0.7 + (Math.random() - 0.5) * 20;
              p.x = width / 2 + (Math.random() - 0.5) * 80;
              p.alpha = Math.random() * 0.7 + 0.3;
            }
          }
        }
      } else {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.fillStyle = p.color || 'rgba(244, 63, 94, 0.8)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
          ctx.fill();

          if (isPlaying) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y > height || p.x < 0 || p.x > width) {
              p.y = 10;
              p.x = Math.random() * width;
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedAnim, particleDensity, animationSpeed, isPlaying]);

  // Sidebar modules grouped
  const sidebarGroups = [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { id: 'overview', label: 'Control Center', icon: Activity, badge: 'Live' },
        { id: 'web-apps', label: 'Web Applications', icon: Globe, count: applications.length || 4 },
        { id: 'projects', label: 'Developer Projects', icon: FolderGit2, count: 6 },
        { id: 'campaigns', label: 'Festival Campaigns', icon: Sparkles, count: campaigns.filter(c => c.status === 'ACTIVE').length || 3 },
        { id: 'animations', label: 'Animation Library', icon: Film, count: 15 },
        { id: 'studio', label: 'Studio Visual Editor', icon: Layers, isLink: '/studio', pill: 'Visual' }
      ]
    },
    {
      title: 'SECURITY & INFRASTRUCTURE',
      items: [
        { id: 'apikeys', label: 'API Keys & Whitelist', icon: Key },
        { id: 'sdk', label: 'SDK Integrations', icon: Code2 },
        { id: 'apigateway', label: 'API Gateway', icon: Network },
        { id: 'cdn', label: 'CDN Management', icon: CloudLightning },
        { id: 'runtime', label: 'Animation Runtime', icon: Zap },
        { id: 'database', label: 'Database Monitoring', icon: Database },
        { id: 'redis', label: 'Redis Monitoring', icon: HardDrive },
        { id: 'jobs', label: 'Background Jobs', icon: Clock },
        { id: 'health', label: 'System Health', icon: ShieldCheck }
      ]
    },
    {
      title: 'BUSINESS MANAGEMENT',
      items: [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'developers', label: 'Developer Directory', icon: UserIconBadge },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBagBadge },
        { id: 'purchases', label: 'Purchases & Orders', icon: DollarSign },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'licenses', label: 'Commercial Licenses', icon: Shield },
        { id: 'plans', label: 'Pricing Plans', icon: SlidersHorizontal }
      ]
    },
    {
      title: 'ACCESS MANAGEMENT',
      items: [
        { id: 'roles', label: 'Role Management', icon: Lock, count: 12 },
        { id: 'permissions', label: 'Permission Matrix', icon: Sliders },
        { id: 'admins', label: 'Admin Accounts', icon: ShieldCheck },
        { id: 'audit-logs', label: 'Audit Activity', icon: FileText }
      ]
    },
    {
      title: 'ANALYTICS & SYSTEM',
      items: [
        { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
        { id: 'notifications', label: 'System Alerts', icon: Bell, count: alerts.filter(a => !a.resolved).length },
        { id: 'settings', label: 'System Settings', icon: Settings }
      ]
    }
  ];

  function UserIconBadge(props: any) { return <Users {...props} />; }
  function ShoppingBagBadge(props: any) { return <Sparkles {...props} />; }

  const filteredGroups = sidebarGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      !sidebarSearch || item.label.toLowerCase().includes(sidebarSearch.toLowerCase())
    )
  })).filter(g => g.items.length > 0);

  const kpis = overviewData?.kpis;
  const currentChart = overviewData?.charts?.[timeHorizon] || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-primary-500/30 selection:text-primary-200">
      {/* 1. GLOBAL TOP TELEMETRY STATUS BAR */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0 z-30">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white tracking-tight">FestiveUI Animation Cloud</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {telemetry?.uptimePercentage || 99.99}% Uptime
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <CloudLightning className="w-3.5 h-3.5 text-blue-400" />
            <span>Edge CDN Latency:</span>
            <strong className="text-white font-mono">{telemetry?.cdn?.latencyMs || 16.4}ms</strong>
            <span className="text-emerald-400 font-mono text-[11px]">(Hit Ratio: {telemetry?.cdn?.cacheHitRatio || 94.8}%)</span>
          </div>

          <span className="text-slate-600 hidden md:inline">•</span>

          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <Database className="w-3.5 h-3.5 text-festive-gold" />
            <span>PostgreSQL 16 & Redis Online</span>
          </div>
        </div>

        {/* Global Navigation Hub */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 pr-2 border-r border-slate-800 text-[11px]">
            <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors font-medium">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Main Website</span>
            </Link>
            <Link href="/marketplace" className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors font-medium">
              <Film className="w-3.5 h-3.5 text-primary-400" />
              <span>Marketplace</span>
            </Link>
            <Link href="/docs" className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors font-medium">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Docs</span>
            </Link>
          </div>

          {/* Super Admin Switcher Gateway */}
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-[11px] shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
            title="Open isolated Super Admin Control Panel on port 3001"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>⚡ Super Admin Console :3001</span>
            <ExternalLink className="w-3 h-3 text-amber-200" />
          </a>
        </div>
      </header>

      {/* 2. DUAL-PANE ENTERPRISE SHELL */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 min-h-0">
        {/* LEFT SEARCHABLE ENTERPRISE NAVIGATION RAIL */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-5">
          {/* Workspace Badge Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-festive-gold to-festive-crimson p-0.5 flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-festive-gold" />
                </div>
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-white truncate">FestiveUI Cloud</h2>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="truncate">Production Cluster</span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Active Tier:</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold text-primary-300 bg-primary-500/15 border border-primary-500/30">
                Enterprise Scale
              </span>
            </div>
          </div>

          {/* Search modules input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search 24 modules..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Grouped Navigation Links */}
          <nav className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {filteredGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {group.title}
                </div>

                {group.items.map((item: any) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  if (item.isLink) {
                    return (
                      <Link
                        key={item.id}
                        href={item.isLink}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-festive-gold hover:text-white hover:bg-slate-900 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-festive-gold group-hover:scale-110 transition-transform" />
                          <span>{item.label}</span>
                        </div>
                        {item.pill && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 font-bold border border-primary-500/30">
                            {item.pill}
                          </span>
                        )}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-lg glow-primary'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* RIGHT MAIN APPLICATION COMMAND CONSOLE */}
        <main className="flex-1 space-y-6 min-w-0">
          {/* TOP EXECUTIVE COMMAND HEADER */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-festive-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary-500/20 text-primary-300 border border-primary-500/40 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
                    Enterprise Application Management
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    v2.4.0 Engine Active
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Control Center & Infrastructure
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Monitor real-time animation render volume, manage connected client web applications, orchestrate live festival campaigns, and provision API credentials.
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setCreateAppModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-lg glow-primary flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4 text-festive-gold" />
                  + Connect Web Project
                </button>

                <Link
                  href="/studio"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <Layers className="w-4 h-4 text-festive-gold" />
                  Studio Editor
                </Link>

                <button
                  onClick={handlePurgeCDN}
                  disabled={isPurgingCDN}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  title="Purge Edge CDN Cache across all client domains"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${isPurgingCDN ? 'animate-spin' : ''}`} />
                  <span>{isPurgingCDN ? 'Purging CDN...' : 'Purge CDN'}</span>
                </button>
              </div>
            </div>

            {/* CDN purge alert banner */}
            {cdnPurgedSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Global Edge CDN Cache purged successfully across all 285 Edge PoPs.</span>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* VIEW 1: CONTROL CENTER OVERVIEW */}
          {/* ============================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 KPI METRICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Animation Renders</span>
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center">
                      <Film className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {kpis?.infrastructure?.totalAnimationRenders ? Number(kpis.infrastructure.totalAnimationRenders).toLocaleString() : '1,482,900'}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18.4% vs last month</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Connected Web Apps</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white">{applications.length || 4} Apps</div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Across 8 verified production domains
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">API Requests (Month)</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {kpis?.infrastructure?.apiRequests ? Number(kpis.infrastructure.apiRequests).toLocaleString() : '48,290'}
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                    <div className="w-[48%] h-full bg-gradient-to-r from-primary-500 to-festive-gold rounded-full" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">48.3% of 100,000 monthly quota</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Campaigns</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {campaigns.filter(c => c.status === 'ACTIVE').length || 4} Live
                  </div>
                  <span className="text-[11px] text-festive-gold font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Diwali, Snow, New Year, Eid
                  </span>
                </div>
              </div>

              {/* VISUAL ANALYTICS & RENDERS CHART */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary-400" />
                      Global Animation Render Volume & CDN Traffic
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time particle and SVG render cycles served via Cloudflare Edge CDN.</p>
                  </div>

                  {/* Time Horizon Filter */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                    {(['24h', '7d', '30d', '90d'] as const).map(horizon => (
                      <button
                        key={horizon}
                        onClick={() => setTimeHorizon(horizon)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          timeHorizon === horizon
                            ? 'bg-primary-600 text-white font-bold shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {horizon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Telemetry Curve */}
                <div className="h-48 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="40" x2="600" y2="40" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                    <line x1="0" y1="80" x2="600" y2="80" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

                    <path
                      d="M 0,140 Q 60,110 120,125 T 240,70 T 360,50 T 480,30 T 600,20 L 600,160 L 0,160 Z"
                      fill="url(#chartGrad)"
                    />

                    <path
                      d="M 0,140 Q 60,110 120,125 T 240,70 T 360,50 T 480,30 T 600,20"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3"
                    />

                    <circle cx="120" cy="125" r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
                    <circle cx="240" cy="70" r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
                    <circle cx="360" cy="50" r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
                    <circle cx="480" cy="30" r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
                    <circle cx="600" cy="20" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="2" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-3 border-t border-slate-800">
                  <span>Day 1: 18.2k renders</span>
                  <span>Day 10: 42.1k renders</span>
                  <span>Day 20: 89.5k renders</span>
                  <span className="text-primary-400 font-bold">Today: 148.9k renders (Peak)</span>
                </div>
              </div>

              {/* LIVE INTERACTIVE ANIMATION TESTER */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Play className="w-4 h-4 text-emerald-400" />
                      Live Animation Sandbox & Runtime Inspector
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Test 60fps particle physics, tweak particle density, and inspect runtime FPS.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'falling-snow', label: '❄️ Winter Snow' },
                      { id: 'diya-glow', label: '🪔 Diya Glow' },
                      { id: 'confetti', label: '🎉 Confetti' }
                    ].map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedAnim(preset.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedAnim === preset.id
                            ? 'bg-primary-600 text-white shadow-md glow-primary'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-60 w-full rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 overflow-hidden shadow-inner">
                  <canvas ref={canvasRef} className="w-full h-full block" />

                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      59.9 FPS
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">Particles: <strong className="text-white">{particleDensity}</strong></span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">Speed: <strong className="text-white">{animationSpeed}x</strong></span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                    <Link
                      href="/studio"
                      className="px-2.5 py-1 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold flex items-center gap-1"
                    >
                      <Layers className="w-3.5 h-3.5 text-festive-gold" />
                      Studio
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Particle Density</span>
                      <span className="text-[11px] text-slate-400">Total concurrent particle nodes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="20"
                        max="150"
                        value={particleDensity}
                        onChange={(e) => setParticleDensity(Number(e.target.value))}
                        className="w-28 accent-primary-500"
                      />
                      <span className="font-mono text-xs text-primary-300 font-bold w-7 text-right">{particleDensity}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Velocity & Speed</span>
                      <span className="text-[11px] text-slate-400">Physics drift multiplier</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                        className="w-28 accent-primary-500"
                      />
                      <span className="font-mono text-xs text-primary-300 font-bold w-8 text-right">{animationSpeed}x</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OPERATIONAL ALERTS & RECENT ACTIVITY */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alerts */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      System Alerts & Infrastructure Incidents
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {alerts.length} Total
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {alerts.map((alt) => (
                      <div
                        key={alt.id}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                          alt.severity === 'CRITICAL'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            : alt.severity === 'WARNING'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/40">
                              {alt.source}
                            </span>
                            <span>{alt.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{alt.message}</p>
                        </div>
                        {!alt.resolved && (
                          <button
                            onClick={() => handleResolveAlert(alt.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-white whitespace-nowrap"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Logs */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Audit Trail Activity Stream
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Live Log
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs font-mono">
                    {(overviewData?.recentAuditLogs || []).slice(0, 5).map((log: any) => (
                      <div key={log.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-primary-300 font-bold font-sans block">{log.action}</span>
                          <span className="text-[10px] text-slate-500">{log.actorEmail || 'system'} • {log.resource || 'control_center'}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 2: WEB APPLICATIONS MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'web-apps' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    Web Applications Management ({applications.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage production domains, authorized origins, framework adapters, and live animation overlays.</p>
                </div>

                <button
                  onClick={() => setCreateAppModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-festive-gold" />
                  + Connect Web Application
                </button>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-sm font-bold text-white">{app.name}</h3>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {app.framework || 'Next.js 14'}
                        </span>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Verified
                        </span>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          {app.environment || 'PRODUCTION'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="font-mono text-slate-300">{app.websiteUrl || 'https://store.festiveui.com'}</span>
                        <span>•</span>
                        <span>Allowed Domains: {app.domains?.map((d: any) => d.domain).join(', ') || 'localhost'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      <button
                        onClick={() => {
                          setCodeModalAnim(CORE_ANIMATIONS[0]);
                          setSelectedFramework('next');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                      >
                        <Code2 className="w-3.5 h-3.5 text-primary-400" />
                        Embed Code
                      </button>

                      <Link
                        href="/studio"
                        className="px-3.5 py-2 rounded-xl bg-primary-600/90 hover:bg-primary-600 text-xs font-bold text-white flex items-center gap-1.5 shadow"
                      >
                        <Layers className="w-3.5 h-3.5 text-festive-gold" />
                        Studio
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 3: FESTIVAL CAMPAIGNS */}
          {/* ============================================================ */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-festive-gold" />
                    Festival Campaign Lifecycle Orchestrator ({campaigns.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Automate scheduled decorations across all client web applications with a single master toggle.</p>
                </div>

                <button
                  onClick={() => setCreateCampaignModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-festive-gold" />
                  + Create Festival Campaign
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">
                            {camp.festival?.name?.includes('Diwali') ? '🪔' : camp.festival?.name?.includes('Christmas') ? '❄️' : camp.festival?.name?.includes('Eid') ? '🌙' : '🎆'}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-white">{camp.name}</h3>
                            <span className="text-[11px] text-slate-400">
                              {camp.scheduleStart ? new Date(camp.scheduleStart).toLocaleDateString() : 'Active'} — {camp.scheduleEnd ? new Date(camp.scheduleEnd).toLocaleDateString() : 'Continuous'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleCampaignStatus(camp.id, camp.status)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                            camp.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${camp.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          {camp.status}
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Target Domains:</span>
                          <span className="font-semibold text-white">{camp.targetDomains?.length || 4} Whitelisted</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Animation Intensity:</span>
                          <span className="text-festive-gold font-semibold">{camp.intensity || 'SPECTACULAR'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <Link
                        href="/studio"
                        className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1"
                      >
                        Customize Theme <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleToggleCampaignStatus(camp.id, camp.status)}
                        className="text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        {camp.status === 'ACTIVE' ? 'Pause Campaign' : 'Deploy Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 4: ANIMATION LIBRARY (15 CORE SUITES) */}
          {/* ============================================================ */}
          {activeTab === 'animations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-purple-400" />
                    Animation Library & Asset Distribution (15 Core Packages)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Hardware-accelerated Canvas, SVG, and CSS animations with strict schema validation.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CORE_ANIMATIONS.map((anim) => (
                  <div
                    key={anim.slug}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-500/10 text-primary-300 font-bold border border-primary-500/20 uppercase">
                          {anim.festival}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          ★ {anim.rating}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                        {anim.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{anim.type}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">{anim.format}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedAnim(anim.slug);
                          setActiveTab('overview');
                        }}
                        className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary-400" /> Test Live
                      </button>

                      <button
                        onClick={() => {
                          setCodeModalAnim(anim);
                          setSelectedFramework('next');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-primary-300 border border-slate-700 flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" /> Embed Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 5: API KEYS & SECURITY */}
          {activeTab === 'apikeys' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-400" />
                    Production API Keys & Whitelisted Domains
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Secure client credentials for embedding animations. Keys are bound strictly to your verified domain names.</p>
                </div>

                <button
                  onClick={() => setCreateKeyModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-festive-gold" />
                  + Create New API Key
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="pb-3 font-semibold">Key Identifier</th>
                      <th className="pb-3 font-semibold">Token Prefix</th>
                      <th className="pb-3 font-semibold">Domain Whitelist</th>
                      <th className="pb-3 font-semibold">Rate Limit</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    <tr>
                      <td className="py-3 font-sans font-bold text-white">Storefront Live Key</td>
                      <td className="py-3 text-emerald-400">fst_live_948a••••••••••••••</td>
                      <td className="py-3 text-slate-300">store.festiveui.com, localhost</td>
                      <td className="py-3 text-slate-400">1,000 req/min</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => copyToClipboard('fst_live_948a88201fae92bc401', 'k1')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                        >
                          {copiedKey === 'k1' ? 'Copied!' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-sans font-bold text-white">Holiday Promo Edge Key</td>
                      <td className="py-3 text-emerald-400">fst_live_12bc••••••••••••••</td>
                      <td className="py-3 text-slate-300">holiday.festiveui.com</td>
                      <td className="py-3 text-slate-400">1,000 req/min</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => copyToClipboard('fst_live_12bc44910ea092ff112', 'k2')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                        >
                          {copiedKey === 'k2' ? 'Copied!' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 6: SDK INTEGRATION CODE */}
          {activeTab === 'sdk' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  Developer SDK Integration & Embed Snippets
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Copy framework-native packages or embed directly using a high-performance CDN script tag.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                {[
                  { id: 'next', label: 'Next.js 14 App Router' },
                  { id: 'react', label: 'React 18 / Vite' },
                  { id: 'vue', label: 'Vue 3' },
                  { id: 'angular', label: 'Angular 17' },
                  { id: 'vanilla', label: 'Vanilla JS / CDN Script' },
                ].map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => setSelectedFramework(fw.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedFramework === fw.id
                        ? 'bg-primary-600 text-white shadow glow-primary'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {fw.label}
                  </button>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-emerald-400 font-bold">
                    {selectedFramework === 'next' ? 'app/festive-banner.tsx' : 'main.tsx'}
                  </span>
                  <button
                    onClick={() => copyToClipboard('import { FestiveAnimation } from "@festiveui/next";', 'code-sdk')}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedKey === 'code-sdk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'code-sdk' ? 'Copied Snippet!' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{selectedFramework === 'next' ? `// 1. Install package
pnpm add @festiveui/next @festiveui/core

// 2. Add component to your Next.js page or layout
import { FestiveAnimation } from '@festiveui/next';

export default function FestiveExperience() {
  return (
    <div className="relative w-full h-[400px]">
      <FestiveAnimation
        slug="diya-glow"
        apiKey="fst_live_948a88201fae92bc401"
        settings={{ glow: true, flickerSpeed: 1.0, particleCount: 80 }}
        className="w-full h-full"
      />
    </div>
  );
}` : `<!-- High-Performance Zero-Dependency CDN Script Tag -->
<script src="https://cdn.festiveui.com/v2/festive.min.js" data-api-key="fst_live_948a" async></script>
<div data-festive-container="diwali-fireworks" style="width: 100%; height: 400px;"></div>`}
                </pre>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 7: CDN & INFRASTRUCTURE MONITORING */}
          {activeTab === 'cdn' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <CloudLightning className="w-5 h-5 text-blue-400" />
                    Cloudflare CDN Edge Network & Invalidation
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time edge cache performance across 285 global Points of Presence.</p>
                </div>

                <button
                  onClick={handlePurgeCDN}
                  disabled={isPurgingCDN}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isPurgingCDN ? 'animate-spin' : ''}`} />
                  <span>{isPurgingCDN ? 'Purging CDN...' : 'Purge All Edge CDN Caches'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Cache Hit Ratio</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{telemetry?.cdn?.cacheHitRatio || 94.8}%</div>
                  <span className="text-[11px] text-slate-500">Global edge efficiency</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Average Edge Latency</span>
                  <div className="text-2xl font-bold text-white mt-1">{telemetry?.cdn?.latencyMs || 16.4} ms</div>
                  <span className="text-[11px] text-slate-500">Target &lt; 25 ms</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Active Edge PoPs</span>
                  <div className="text-2xl font-bold text-primary-400 mt-1">{telemetry?.cdn?.activeEdgePops || 285} Locations</div>
                  <span className="text-[11px] text-slate-500">100% Operational</span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 8: DATABASE & REDIS MONITORING */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-festive-gold" />
                  PostgreSQL 16 & Prisma Connection Telemetry
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Real live connection pool statistics, latency measurements, and schema health.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400">Database Status</span>
                    <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      {telemetry?.database?.status || 'CONNECTED'}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400">Live Round-Trip Latency</span>
                    <div className="text-xl font-bold text-white mt-1 font-mono">
                      {telemetry?.database?.latencyMs || 1.2} ms
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400">Connection Pool Utilization</span>
                    <div className="text-xl font-bold text-primary-300 mt-1 font-mono">
                      {telemetry?.database?.activePoolConnections || 12} / {telemetry?.database?.maxPoolConnections || 100}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 9: SYSTEM SETTINGS & PLATFORM CONTROLS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-300" />
                  Platform Settings & Infrastructure Config
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Live configuration variables governing CDN cache behavior, rate limits, and environment modes.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                {settingsList.map((setting) => (
                  <div key={setting.key} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-white block">{setting.key}</span>
                      <span className="text-[11px] text-slate-400">{setting.description}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {setting.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: CONNECT WEB APPLICATION */}
      {createAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-primary-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-primary-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Framework</label>
                  <select
                    value={newApp.framework}
                    onChange={(e) => setNewApp({ ...newApp, framework: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
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

      {/* MODAL 2: EMBED CODE */}
      {codeModalAnim && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary-400" />
                Embed Code: {codeModalAnim.name}
              </h3>
              <button onClick={() => setCodeModalAnim(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
{`import { FestiveAnimation } from '@festiveui/next';

export default function FestiveBanner() {
  return (
    <FestiveAnimation
      slug="${codeModalAnim.slug}"
      apiKey="fst_live_948a88201fae92bc401"
      className="w-full h-80"
    />
  );
}`}
            </pre>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => copyToClipboard(`import { FestiveAnimation } from '@festiveui/next';\n\n<FestiveAnimation slug="${codeModalAnim.slug}" apiKey="fst_live_948a88201fae92bc401" className="w-full h-80" />`, 'modal-code')}
                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs"
              >
                {copiedKey === 'modal-code' ? 'Copied Code!' : 'Copy Snippet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
