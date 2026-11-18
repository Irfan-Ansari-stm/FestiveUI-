'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronDown,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  FileText,
  Server,
  Cpu,
  HardDrive,
  ShoppingCart,
  DollarSign,
  Tag,
  Sliders,
  AlertTriangle,
  Eye,
  Copy,
  Trash2,
  Edit3,
  ShieldAlert,
  Radio,
  FileCode,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { ApiClient } from '@/lib/api';

// ============================================================================
// 1. ALL PLATFORM SECTIONS DEFINITIONS (ORGANIZED IN 5 CORE MANAGEMENT GROUPS)
// ============================================================================
export interface DashboardSection {
  id: string;
  name: string;
  group: 'CORE' | 'SECURITY' | 'BUSINESS' | 'RBAC' | 'ANALYTICS';
  icon: any;
  badge?: string;
  description: string;
}

const DASHBOARD_SECTIONS: DashboardSection[] = [
  // CORE MANAGEMENT
  { id: 'dashboard', name: 'Dashboard Overview', group: 'CORE', icon: LayoutDashboard, description: 'Executive summary, KPIs, and operational health' },
  { id: 'overview', name: 'Control Center Telemetry', group: 'CORE', icon: Activity, badge: 'Live', description: 'Real-time telemetry, render volumes, and cluster status' },
  { id: 'web-apps', name: 'Web Applications', group: 'CORE', icon: Globe, badge: '4 Apps', description: 'Connected client websites and domain whitelists' },
  { id: 'projects', name: 'Developer Projects', group: 'CORE', icon: FolderGit2, badge: '6', description: 'Git repositories, staging targets, and deployments' },
  { id: 'campaigns', name: 'Festival Campaigns', group: 'CORE', icon: Sparkles, badge: '4 Live', description: 'Diwali, New Year, Christmas, Eid, and Holi schedules' },
  { id: 'animations', name: 'Animation Library', group: 'CORE', icon: Film, badge: '15 Ready', description: 'Verified animation packages, code snippets, and assets' },
  { id: 'studio', name: 'Studio Visual Editor', group: 'CORE', icon: Layers, badge: 'Visual', description: 'Interactive visual canvas animation builder' },

  // SECURITY & INFRASTRUCTURE
  { id: 'apikeys', name: 'API Keys & Whitelist', group: 'SECURITY', icon: Key, description: 'Client tokens, secrets, domain origins, and rate limits' },
  { id: 'sdk', name: 'SDK Integrations', group: 'SECURITY', icon: Terminal, description: 'NPM packages, Next.js, React, and Vue client SDKs' },
  { id: 'apigateway', name: 'API Gateway', group: 'SECURITY', icon: Radio, description: 'Edge routing rules, request throttling, and proxy telemetry' },
  { id: 'cdn', name: 'CDN Management', group: 'SECURITY', icon: Cloud, description: 'Cloudflare Edge CDN caching, purge tools, and latency' },
  { id: 'runtime', name: 'Animation Runtime', group: 'SECURITY', icon: Cpu, description: '60 FPS WebGL, Canvas 2D, and SVG physics engine status' },
  { id: 'database', name: 'Database Monitoring', group: 'SECURITY', icon: Database, description: 'PostgreSQL 16 connection pool, latency, and migrations' },
  { id: 'redis', name: 'Redis Monitoring', group: 'SECURITY', icon: HardDrive, description: 'Redis cluster cache memory, keys, and hit ratios' },
  { id: 'jobs', name: 'Background Jobs', group: 'SECURITY', icon: RotateCcw, description: 'BullMQ workers, cron triggers, and festival schedulers' },
  { id: 'health', name: 'System Health', group: 'SECURITY', icon: Server, description: 'Microservices status, uptime history, and alerts' },

  // BUSINESS MANAGEMENT
  { id: 'users', name: 'User Management', group: 'BUSINESS', icon: Users, description: 'All registered platform accounts and status controls' },
  { id: 'developers', name: 'Developer Directory', group: 'BUSINESS', icon: Code2, description: 'Verified developers, quota usage, and connected apps' },
  { id: 'marketplace', name: 'Marketplace Catalog', group: 'BUSINESS', icon: ShoppingCart, description: 'Commercial animation packages, reviews, and featured' },
  { id: 'purchases', name: 'Purchases & Orders', group: 'BUSINESS', icon: DollarSign, description: 'Payment transactions, receipts, and revenue ledger' },
  { id: 'subscriptions', name: 'Subscriptions & MRR', group: 'BUSINESS', icon: CreditCard, description: 'Developer tiers, active plans, and billing cycles' },
  { id: 'licenses', name: 'Commercial Licenses', group: 'BUSINESS', icon: ShieldCheck, description: 'Issued domain keys, verification, and license rights' },
  { id: 'plans', name: 'Pricing Plans', group: 'BUSINESS', icon: Tag, description: 'Platform pricing tiers, monthly limits, and features' },

  // ACCESS MANAGEMENT & RBAC
  { id: 'dashboard-rbac', name: 'Dashboard Access Control', group: 'RBAC', icon: Sliders, badge: 'RBAC Engine', description: 'Configure which roles can access which dashboard sections' },
  { id: 'roles', name: 'Role Management', group: 'RBAC', icon: ShieldAlert, description: 'Define custom RBAC roles and assign permissions' },
  { id: 'permissions', name: 'Permission Matrix', group: 'RBAC', icon: Lock, description: 'Fine-grained permission definitions across 5 levels' },
  { id: 'admins', name: 'Admin Accounts', group: 'RBAC', icon: Crown, description: 'Platform administrators, security flags, and MFA' },
  { id: 'audit-logs', name: 'Audit Activity Logs', group: 'RBAC', icon: FileText, description: 'Immutable trail of administrative actions and changes' },

  // ANALYTICS & SYSTEM
  { id: 'analytics', name: 'Platform Analytics', group: 'ANALYTICS', icon: BarChart3, description: 'Impression heatmaps, festival traffic, and geography' },
  { id: 'notifications', name: 'System Alerts & Broadcasts', group: 'ANALYTICS', icon: Bell, description: 'Platform alerts, notification center, and broadcast banner' },
  { id: 'settings', name: 'Platform Settings', group: 'ANALYTICS', icon: Settings, description: 'Global environment variables, maintenance mode, and CDN' }
];

// ============================================================================
// 2. DEFAULT RBAC ROLE PROFILES & PERMITTED DASHBOARD SECTIONS
// ============================================================================
export interface RoleProfile {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  color: string;
}

const INITIAL_ROLES: RoleProfile[] = [
  { id: 'SUPER_ADMIN', name: 'Super Admin', description: 'Platform owner with full unrestricted access to all 28 modules, settings & RBAC', isSystem: true, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  { id: 'ADMIN', name: 'Administrator', description: 'Senior platform administrator managing users, content, projects, and platform logs', isSystem: true, color: 'text-primary-400 bg-primary-500/15 border-primary-500/30' },
  { id: 'CONTENT_MANAGER', name: 'Content Manager', description: 'Manages festival campaigns, animation assets, and marketplace offerings', isSystem: true, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
  { id: 'ANIMATION_MANAGER', name: 'Animation Manager', description: 'Leads animation lifecycle, visual studio configurations, and runtime engines', isSystem: true, color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
  { id: 'FESTIVAL_MANAGER', name: 'Festival Manager', description: 'Orchestrates cultural holiday calendars, seasonal banners, and campaign timing', isSystem: true, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  { id: 'FINANCE_MANAGER', name: 'Finance Manager', description: 'Oversees customer purchases, recurring subscriptions, invoices, and license sales', isSystem: true, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  { id: 'DEVELOPER_SUPPORT', name: 'Developer Support', description: 'Assists third-party developers with API keys, SDK integration, and app tokens', isSystem: true, color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' },
  { id: 'ANALYTICS_MANAGER', name: 'Analytics Manager', description: 'Reviews platform telemetry, render performance, and traffic reports', isSystem: true, color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30' },
  { id: 'DEVELOPER', name: 'Developer', description: 'Builds client web apps, integrates animations, provisions API keys and SDKs', isSystem: true, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
  { id: 'MODERATOR', name: 'Community Moderator', description: 'Moderates user discussions, animation reviews, and marketplace comments', isSystem: true, color: 'text-teal-400 bg-teal-500/15 border-teal-500/30' }
];

const INITIAL_ROLE_ACCESS: Record<string, string[]> = {
  SUPER_ADMIN: DASHBOARD_SECTIONS.map(s => s.id),
  ADMIN: [
    'dashboard', 'overview', 'web-apps', 'projects', 'campaigns', 'animations', 'studio',
    'apikeys', 'sdk', 'apigateway', 'cdn', 'runtime', 'health',
    'users', 'developers', 'marketplace', 'purchases', 'subscriptions', 'licenses', 'plans',
    'dashboard-rbac', 'roles', 'permissions', 'admins', 'audit-logs',
    'analytics', 'notifications'
  ],
  CONTENT_MANAGER: [
    'dashboard', 'overview', 'campaigns', 'animations', 'studio',
    'marketplace', 'analytics', 'notifications'
  ],
  ANIMATION_MANAGER: [
    'dashboard', 'overview', 'animations', 'campaigns', 'studio',
    'runtime', 'marketplace', 'analytics'
  ],
  FESTIVAL_MANAGER: [
    'dashboard', 'overview', 'campaigns', 'animations', 'studio',
    'notifications', 'analytics'
  ],
  FINANCE_MANAGER: [
    'dashboard', 'overview', 'purchases', 'subscriptions', 'licenses', 'plans',
    'marketplace', 'analytics'
  ],
  DEVELOPER_SUPPORT: [
    'dashboard', 'overview', 'web-apps', 'projects', 'apikeys', 'sdk',
    'users', 'developers', 'licenses', 'audit-logs'
  ],
  ANALYTICS_MANAGER: [
    'dashboard', 'overview', 'analytics', 'cdn', 'runtime', 'apigateway', 'audit-logs'
  ],
  DEVELOPER: [
    'dashboard', 'overview', 'web-apps', 'projects', 'apikeys', 'sdk', 'studio',
    'licenses', 'analytics'
  ],
  MODERATOR: [
    'dashboard', 'overview', 'users', 'marketplace', 'notifications'
  ]
};

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

  // RBAC Engine State
  const [roles, setRoles] = useState<RoleProfile[]>(INITIAL_ROLES);
  const [activeRole, setActiveRole] = useState<string>('SUPER_ADMIN');
  const [roleAccessMap, setRoleAccessMap] = useState<Record<string, string[]>>(INITIAL_ROLE_ACCESS);
  const [selectedRbacRole, setSelectedRbacRole] = useState<string>('CONTENT_MANAGER');
  const [savedRbacNotification, setSavedRbacNotification] = useState<string | null>(null);

  // New Custom Role Modal
  const [createRoleModal, setCreateRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleTemplate, setNewRoleTemplate] = useState('CONTENT_MANAGER');

  // Real Data State from Backend APIs
  const [telemetry, setTelemetry] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([
    { id: 'app-1', name: 'Acme Flagship Store', websiteUrl: 'https://shop.acme.com', framework: 'next', environment: 'PRODUCTION', domain: 'shop.acme.com', status: 'ACTIVE', token: 'fui_live_9a7d8e6f1' },
    { id: 'app-2', name: 'Festive Global Portal', websiteUrl: 'https://festiveui.com', framework: 'react', environment: 'PRODUCTION', domain: 'festiveui.com', status: 'ACTIVE', token: 'fui_live_3b4c5d6e7' },
    { id: 'app-3', name: 'Staging E-Commerce', websiteUrl: 'https://staging.store.io', framework: 'vue', environment: 'STAGING', domain: 'staging.store.io', status: 'ACTIVE', token: 'fui_test_123456789' },
    { id: 'app-4', name: 'Mobile Web Campaign', websiteUrl: 'https://m.diwalifest.org', framework: 'next', environment: 'PRODUCTION', domain: 'm.diwalifest.org', status: 'ACTIVE', token: 'fui_live_887766554' }
  ]);
  const [campaigns, setCampaigns] = useState<any[]>([
    { id: 'camp-1', name: 'Diwali Lights & Fireworks', festival: 'Diwali', intensity: 'SPECTACULAR', status: 'ACTIVE', targetDomain: 'shop.acme.com', startDate: '2026-10-28', endDate: '2026-11-05' },
    { id: 'camp-2', name: 'Christmas Winter Snowfall', festival: 'Christmas', intensity: 'NORMAL', status: 'ACTIVE', targetDomain: 'festiveui.com', startDate: '2026-12-15', endDate: '2026-12-31' },
    { id: 'camp-3', name: 'New Year Midnight Celebration', festival: 'New Year', intensity: 'SPECTACULAR', status: 'ACTIVE', targetDomain: 'all-domains', startDate: '2026-12-30', endDate: '2027-01-05' },
    { id: 'camp-4', name: 'Eid Mubarak Crescent Glow', festival: 'Eid', intensity: 'SUBTLE', status: 'PAUSED', targetDomain: 'shop.acme.com', startDate: '2026-03-28', endDate: '2026-04-04' }
  ]);
  const [usersList, setUsersList] = useState<any[]>([
    { id: 'usr-1', email: 'admin@festiveui.com', name: 'Super Admin', role: 'SUPER_ADMIN', status: 'ACTIVE', verified: true, joined: '2026-01-15' },
    { id: 'usr-2', email: 'content@festiveui.com', name: 'Maya Sharma', role: 'CONTENT_MANAGER', status: 'ACTIVE', verified: true, joined: '2026-01-18' },
    { id: 'usr-3', email: 'animator@festiveui.com', name: 'Elena Rostova', role: 'ANIMATION_MANAGER', status: 'ACTIVE', verified: true, joined: '2026-01-20' },
    { id: 'usr-4', email: 'finance@festiveui.com', name: 'David Zhang', role: 'FINANCE_MANAGER', status: 'ACTIVE', verified: true, joined: '2026-01-22' },
    { id: 'usr-5', email: 'dev@acmecorp.com', name: 'Marcus Brody', role: 'DEVELOPER', status: 'ACTIVE', verified: true, joined: '2026-02-01' },
    { id: 'usr-6', email: 'partner@holidaylab.io', name: 'Sarah Lin', role: 'DEVELOPER', status: 'SUSPENDED', verified: true, joined: '2026-02-05' }
  ]);
  const [purchasesList] = useState<any[]>([
    { id: 'ord_9182', email: 'marcus@brody.tech', package: 'Diwali Fireworks 4K Burst', amount: '$49.00', status: 'PAID', date: '2026-02-12' },
    { id: 'ord_9183', email: 'operations@retailhub.com', package: 'Christmas Fairy Lights Pro', amount: '$89.00', status: 'PAID', date: '2026-02-14' },
    { id: 'ord_9184', email: 'cto@globalbrands.org', package: 'New Year HUD Counter Bundle', amount: '$149.00', status: 'PAID', date: '2026-02-15' },
    { id: 'ord_9185', email: 'agency@creativemedia.co', package: 'Holi Fluid Physics Pack', amount: '$79.00', status: 'PAID', date: '2026-02-18' }
  ]);
  const [apiKeysList, setApiKeysList] = useState<any[]>([
    { id: 'key_1', name: 'Production Client Key', key: 'fui_live_9a7d8e6f1a2b3c4d5e', domain: 'shop.acme.com, festiveui.com', rateLimit: '10,000 req/min', status: 'ACTIVE' },
    { id: 'key_2', name: 'Staging & QA Key', key: 'fui_test_1234567890abcdef', domain: 'localhost:3000, staging.store.io', rateLimit: '2,500 req/min', status: 'ACTIVE' },
    { id: 'key_3', name: 'Mobile Webhook Key', key: 'fui_live_8877665544332211', domain: 'm.diwalifest.org', rateLimit: '5,000 req/min', status: 'ACTIVE' }
  ]);
  const [auditLogs] = useState<any[]>([
    { id: 'log-1', timestamp: '2026-02-19 02:44:12', actor: 'admin@festiveui.com', action: 'ROLE_UPDATED', resource: 'Role: CONTENT_MANAGER', ip: '192.168.1.1', status: 'SUCCESS' },
    { id: 'log-2', timestamp: '2026-02-19 02:18:40', actor: 'admin@festiveui.com', action: 'CDN_PURGED', resource: 'Global Cloudflare Edge', ip: '192.168.1.1', status: 'SUCCESS' },
    { id: 'log-3', timestamp: '2026-02-18 23:12:05', actor: 'content@festiveui.com', action: 'CAMPAIGN_ACTIVATED', resource: 'Campaign: Diwali Lights', ip: '10.0.4.15', status: 'SUCCESS' },
    { id: 'log-4', timestamp: '2026-02-18 21:05:54', actor: 'finance@festiveui.com', action: 'LICENSE_GENERATED', resource: 'License: FEST-9018-2026', ip: '172.16.0.8', status: 'SUCCESS' },
    { id: 'log-5', timestamp: '2026-02-18 19:40:11', actor: 'admin@festiveui.com', action: 'USER_SUSPENDED', resource: 'User: partner@holidaylab.io', ip: '192.168.1.1', status: 'SUCCESS' }
  ]);

  // Modals & State
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

  // Load state from localStorage or APIs
  useEffect(() => {
    loadControlCenterData();
    const interval = setInterval(loadTelemetryOnly, 10000);

    // Load RBAC overrides from localStorage if present
    try {
      const savedAccess = localStorage.getItem('festiveui_role_access');
      if (savedAccess) {
        setRoleAccessMap(JSON.parse(savedAccess));
      }
      const savedRoles = localStorage.getItem('festiveui_custom_roles');
      if (savedRoles) {
        setRoles(JSON.parse(savedRoles));
      }
    } catch {}

    return () => clearInterval(interval);
  }, []);

  const loadTelemetryOnly = async () => {
    try {
      const tel = await ApiClient.fetch('/control-center/telemetry');
      if (tel) setTelemetry(tel);
    } catch {}
  };

  const loadControlCenterData = async () => {
    try {
      const [tel, ov, apps, camps] = await Promise.all([
        ApiClient.fetch('/control-center/telemetry').catch(() => null),
        ApiClient.fetch('/control-center/overview').catch(() => null),
        ApiClient.fetch('/control-center/applications').catch(() => ({ items: [] })),
        ApiClient.fetch('/control-center/campaigns').catch(() => [])
      ]);

      if (tel) setTelemetry(tel);
      if (ov) setOverviewData(ov);
      if (apps?.items?.length) setApplications(apps.items);
      if (Array.isArray(camps) && camps.length > 0) setCampaigns(camps);
    } catch (err) {
      console.error('Failed to load control center data:', err);
    }
  };

  // RBAC COMPUTATIONS
  const allowedSectionsForActiveRole = useMemo(() => {
    return roleAccessMap[activeRole] || DASHBOARD_SECTIONS.map(s => s.id);
  }, [activeRole, roleAccessMap]);

  // If user switches role and currently on disallowed tab, auto-switch to first permitted
  useEffect(() => {
    if (!allowedSectionsForActiveRole.includes(activeTab)) {
      const firstAllowed = allowedSectionsForActiveRole[0] || 'dashboard';
      setActiveTab(firstAllowed);
    }
  }, [activeRole, allowedSectionsForActiveRole, activeTab]);

  // Filtered sidebar sections based on search and RBAC
  const visibleSections = useMemo(() => {
    return DASHBOARD_SECTIONS.filter(sec => {
      const matchesSearch = sidebarSearch.trim() === '' ||
        sec.name.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
        sec.description.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
        sec.id.toLowerCase().includes(sidebarSearch.toLowerCase());
      
      const isAllowedByRole = allowedSectionsForActiveRole.includes(sec.id);
      return matchesSearch && isAllowedByRole;
    });
  }, [sidebarSearch, allowedSectionsForActiveRole]);

  // Handlers for RBAC Access Matrix
  const handleToggleSectionForRole = (roleId: string, sectionId: string) => {
    setRoleAccessMap(prev => {
      const current = prev[roleId] || [];
      const updated = current.includes(sectionId)
        ? current.filter(id => id !== sectionId)
        : [...current, sectionId];
      
      const newMap = { ...prev, [roleId]: updated };
      try {
        localStorage.setItem('festiveui_role_access', JSON.stringify(newMap));
      } catch {}
      return newMap;
    });
  };

  const handleGrantAllForRole = (roleId: string) => {
    setRoleAccessMap(prev => {
      const newMap = { ...prev, [roleId]: DASHBOARD_SECTIONS.map(s => s.id) };
      try {
        localStorage.setItem('festiveui_role_access', JSON.stringify(newMap));
      } catch {}
      return newMap;
    });
  };

  const handleRevokeAllForRole = (roleId: string) => {
    setRoleAccessMap(prev => {
      const newMap = { ...prev, [roleId]: ['dashboard'] };
      try {
        localStorage.setItem('festiveui_role_access', JSON.stringify(newMap));
      } catch {}
      return newMap;
    });
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const slug = newRoleName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const newRole: RoleProfile = {
      id: slug,
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || `Custom role configured by Super Admin`,
      isSystem: false,
      color: 'text-orange-400 bg-orange-500/15 border-orange-500/30'
    };

    const templateAccess = roleAccessMap[newRoleTemplate] || ['dashboard', 'overview'];
    const updatedRoles = [...roles, newRole];
    const updatedAccess = { ...roleAccessMap, [slug]: [...templateAccess] };

    setRoles(updatedRoles);
    setRoleAccessMap(updatedAccess);
    setSelectedRbacRole(slug);
    setCreateRoleModal(false);
    setNewRoleName('');
    setNewRoleDesc('');

    try {
      localStorage.setItem('festiveui_custom_roles', JSON.stringify(updatedRoles));
      localStorage.setItem('festiveui_role_access', JSON.stringify(updatedAccess));
    } catch {}

    setSavedRbacNotification(`Role "${newRole.name}" created and ready for access assignment!`);
    setTimeout(() => setSavedRbacNotification(null), 4000);
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
      const created = {
        id: `app-${Date.now()}`,
        name: newApp.name,
        websiteUrl: newApp.websiteUrl,
        framework: newApp.framework,
        environment: newApp.environment,
        domain: newApp.domain,
        status: 'ACTIVE',
        token: `fui_${newApp.environment.toLowerCase()}_${Math.random().toString(36).substring(2, 10)}`
      };
      setApplications(prev => [created, ...prev]);
      setCreateAppModal(false);
      setNewApp({ name: '', websiteUrl: '', framework: 'next', environment: 'PRODUCTION', domain: 'localhost:3000' });
    } finally {
      setCreatingApp(false);
    }
  };

  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' };
      }
      return c;
    }));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' };
      }
      return u;
    }));
  };

  const handlePurgeCDN = async () => {
    setIsPurgingCDN(true);
    setCdnPurgedSuccess(false);
    try {
      await ApiClient.fetch('/control-center/cdn/purge', {
        method: 'POST',
        body: JSON.stringify({ scope: 'GLOBAL' })
      }).catch(() => null);
      setCdnPurgedSuccess(true);
      setTimeout(() => setCdnPurgedSuccess(false), 4000);
    } finally {
      setIsPurgingCDN(false);
    }
  };

  const kpis = overviewData?.kpis;
  const activeRoleObj = roles.find(r => r.id === activeRole) || roles[0];

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] text-slate-100 overflow-hidden antialiased selection:bg-primary-500/30 selection:text-primary-200">
      {/* ============================================================ */}
      {/* 1. LEFT SIDEBAR (SPANS ENTIRE 100VH TOP TO BOTTOM)          */}
      {/* ============================================================ */}
      <aside className="w-64 h-full border-r border-[#1F2937] bg-[#0B0F19] flex flex-col shrink-0 z-20">
        {/* Brand Header */}
        <div className="h-16 border-b border-[#1F2937] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 via-festive-gold to-festive-crimson p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-festive-gold" />
              </div>
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-extrabold text-white tracking-tight">FestiveUI Cloud</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Production Console</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Search Bar */}
        <div className="p-3 border-b border-[#1F2937]/60 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter sections..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            {sidebarSearch && (
              <button onClick={() => setSidebarSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Menu (With All Dynamic Management Sections) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
          {/* GROUP 1: CORE MANAGEMENT */}
          {visibleSections.some(s => s.group === 'CORE') && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Core Management
              </div>
              {visibleSections.filter(s => s.group === 'CORE').map(sec => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.name}</span>
                    </div>
                    {sec.badge && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#111827] text-slate-300 border border-[#1F2937]'
                      }`}>
                        {sec.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* GROUP 2: SECURITY & INFRASTRUCTURE */}
          {visibleSections.some(s => s.group === 'SECURITY') && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Security & Infrastructure
              </div>
              {visibleSections.filter(s => s.group === 'SECURITY').map(sec => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* GROUP 3: BUSINESS MANAGEMENT */}
          {visibleSections.some(s => s.group === 'BUSINESS') && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Business Management
              </div>
              {visibleSections.filter(s => s.group === 'BUSINESS').map(sec => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* GROUP 4: ACCESS MANAGEMENT & RBAC */}
          {visibleSections.some(s => s.group === 'RBAC') && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Access Management & RBAC
              </div>
              {visibleSections.filter(s => s.group === 'RBAC').map(sec => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.name}</span>
                    </div>
                    {sec.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 font-bold border border-primary-500/30 shrink-0">
                        {sec.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* GROUP 5: ANALYTICS & SYSTEM */}
          {visibleSections.some(s => s.group === 'ANALYTICS') && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Analytics & System
              </div>
              {visibleSections.filter(s => s.group === 'ANALYTICS').map(sec => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Bottom: Enterprise Plan & Role Indicator */}
        <div className="p-3 border-t border-[#1F2937] shrink-0 bg-[#0B0F19]">
          <div className="p-3 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Crown className="w-4 h-4 text-festive-gold" />
                <span>Enterprise Scale</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                Cluster 01
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="w-[72%] h-full bg-gradient-to-r from-primary-500 to-festive-gold rounded-full" />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <span className="text-slate-400">Tier Limit: 1M Renders</span>
              <button onClick={() => setActiveTab('plans')} className="text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-0.5">
                Manage <ArrowRight className="w-3 h-3" />
              </button>
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
          {/* Left: Section Breadcrumb & RBAC Role Switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">FestiveUI /</span>
              <span className="font-extrabold text-white text-sm">
                {DASHBOARD_SECTIONS.find(s => s.id === activeTab)?.name || 'Dashboard'}
              </span>
            </div>

            {/* DYNAMIC RBAC ROLE SIMULATOR PICKER */}
            <div className="flex items-center gap-2 bg-[#111827] border border-[#1F2937] px-2.5 py-1 rounded-xl text-xs">
              <Shield className="w-3.5 h-3.5 text-festive-gold" />
              <span className="text-slate-400 text-[11px] font-medium hidden md:inline">Viewing as:</span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
                title="Select role to test dynamic RBAC filtering in the sidebar"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id} className="bg-[#111827] text-white">
                    {r.name} {r.id === 'SUPER_ADMIN' ? '👑' : ''} ({roleAccessMap[r.id]?.length || 0} sections)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Notifications & User Avatar */}
          <div className="flex items-center gap-3 text-xs">
            {/* Notification Bell Button */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative w-9 h-9 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-festive-crimson p-0.5 shadow-md flex-shrink-0 cursor-pointer">
                <div className="w-full h-full bg-[#111827] rounded-[10px] flex items-center justify-center font-bold text-white text-xs">
                  {activeRole === 'SUPER_ADMIN' ? '👑' : activeRole.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ROLE SIMULATION BANNER IF VIEWING AS RESTRICTED ROLE */}
        {activeRole !== 'SUPER_ADMIN' && (
          <div className="px-6 py-2 bg-gradient-to-r from-amber-500/10 via-primary-500/10 to-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-300 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>
                <strong>RBAC Simulation Active:</strong> Viewing dashboard as <strong>{activeRoleObj.name}</strong>.
                Only <strong>{allowedSectionsForActiveRole.length} of {DASHBOARD_SECTIONS.length}</strong> sections are visible in the sidebar.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard-rbac')}
                className="text-white underline hover:text-amber-200 text-xs font-semibold"
              >
                Configure Sections
              </button>
              <button
                onClick={() => setActiveRole('SUPER_ADMIN')}
                className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold border border-amber-500/40 text-[11px]"
              >
                Switch to Super Admin
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* DASHBOARD PAGE CONTENT (SCROLLABLE AREA UNDER THE HEADER)  */}
        {/* ========================================================== */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

          {/* ======================================================== */}
          {/* VIEW: DASHBOARD OVERVIEW & CONTROL CENTER                */}
          {/* ======================================================== */}
          {(activeTab === 'dashboard' || activeTab === 'overview') && (
            <div className="space-y-6">
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

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937] text-xs text-slate-300 font-medium self-start sm:self-auto cursor-pointer hover:border-slate-700 transition-colors">
                  <Calendar className="w-3.5 h-3.5 text-primary-400" />
                  <span>Jan 26, 2026</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </div>
              </div>

              {/* ROW 2: HERO BANNER CARD */}
              <div className="rounded-3xl bg-gradient-to-r from-[#111827] via-slate-900 to-[#111827] border border-[#1F2937] p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-1/3 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

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
                <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 transition-all shadow-md">
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
                    <span className="text-slate-500 font-mono">60 FPS</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 transition-all shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Connected Web Apps</span>
                      <div className="text-2xl font-extrabold text-white">{applications.length} Apps</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">Across 8 verified production domains</p>
                </div>

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

                <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 transition-all shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-festive-gold flex items-center justify-center">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Active Campaigns</span>
                      <div className="text-2xl font-extrabold text-white">{campaigns.filter(c => c.status === 'ACTIVE').length} Live</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-festive-gold font-semibold pt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Diwali, Snow, New Year, Eid
                  </span>
                </div>
              </div>

              {/* ROW 4: DUAL-WAVE CHART (LEFT 2/3) + QUICK ACTIONS (RIGHT 1/3) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        <Layers className="w-4 h-4 text-festive-gold group-hover:scale-110 transition-transform" />
                        <span>Open Studio Editor</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* ROW 5: RECENT ACTIVITY & SYSTEM STATUS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Recent Activity
                    </h3>
                    <button onClick={() => setActiveTab('audit-logs')} className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1">
                      View Audit Trail <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {auditLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="p-3 rounded-2xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                            ✓
                          </div>
                          <div>
                            <span className="font-semibold text-white">{log.action}: {log.resource}</span>
                            <span className="text-slate-500 text-[10px] block">{log.actor}</span>
                          </div>
                        </div>
                        <span className="text-slate-500 font-mono text-[11px]">{log.timestamp.split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      System Status
                    </h3>
                    <button onClick={() => setActiveTab('health')} className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1">
                      Full Health Check <ArrowRight className="w-3 h-3" />
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
                        <span className="text-xs font-semibold">Postgres 16</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Operational</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-[#1F2937] flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-2 text-slate-300">
                        <Cloud className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold">Cloudflare CDN</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Operational</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: DYNAMIC RBAC DASHBOARD ACCESS CONTROL ENGINE       */}
          {/* ======================================================== */}
          {activeTab === 'dashboard-rbac' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary-500/15 text-primary-300 border border-primary-500/30 uppercase tracking-wider mb-1">
                    <Sliders className="w-3 h-3 text-festive-gold" />
                    Dynamic Role-Based Access Engine
                  </div>
                  <h1 className="text-2xl font-extrabold text-white">Dashboard Access Control</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Configure exactly which dashboard sections, modules, and pages are visible and accessible for each role.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCreateRoleModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-primary-500 text-white font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4 text-primary-400" />
                    Create Custom Role
                  </button>
                  <button
                    onClick={() => {
                      setSavedRbacNotification(`Access rules successfully saved!`);
                      setTimeout(() => setSavedRbacNotification(null), 3000);
                    }}
                    className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Save Access Rules
                  </button>
                </div>
              </div>

              {savedRbacNotification && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{savedRbacNotification}</span>
                </div>
              )}

              {/* ROLE SELECTION BAR */}
              <div className="p-5 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Select Role to Configure:</label>
                    <div className="flex flex-wrap gap-2">
                      {roles.map(r => {
                        const isSelected = selectedRbacRole === r.id;
                        const count = roleAccessMap[r.id]?.length || 0;
                        return (
                          <button
                            key={r.id}
                            onClick={() => setSelectedRbacRole(r.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                              isSelected
                                ? 'bg-primary-600 text-white border-primary-500 shadow-md'
                                : 'bg-[#0B0F19] text-slate-300 border-[#1F2937] hover:border-slate-700'
                            }`}
                          >
                            <span>{r.name}</span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 md:pt-0">
                    <button
                      onClick={() => handleGrantAllForRole(selectedRbacRole)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-[#1F2937] hover:border-slate-700 text-emerald-400 text-xs font-semibold"
                    >
                      Grant All
                    </button>
                    <button
                      onClick={() => handleRevokeAllForRole(selectedRbacRole)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-[#1F2937] hover:border-slate-700 text-rose-400 text-xs font-semibold"
                    >
                      Revoke All
                    </button>
                    <button
                      onClick={() => setActiveRole(selectedRbacRole)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview as this Role
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#0B0F19] border border-[#1F2937] text-xs text-slate-400 flex items-center justify-between">
                  <span>
                    Currently editing visibility for <strong>{roles.find(r => r.id === selectedRbacRole)?.name}</strong>:
                    {' '}{roles.find(r => r.id === selectedRbacRole)?.description}
                  </span>
                  <span className="font-mono text-primary-400 font-bold">
                    {roleAccessMap[selectedRbacRole]?.length || 0} / {DASHBOARD_SECTIONS.length} Sections Active
                  </span>
                </div>
              </div>

              {/* SECTIONS PERMISSION MATRIX GRID */}
              {(['CORE', 'SECURITY', 'BUSINESS', 'RBAC', 'ANALYTICS'] as const).map(groupKey => {
                const groupSections = DASHBOARD_SECTIONS.filter(s => s.group === groupKey);
                const groupNames: Record<string, string> = {
                  CORE: 'Core Platform Management',
                  SECURITY: 'Security & Infrastructure Services',
                  BUSINESS: 'Business, E-Commerce & Licensing',
                  RBAC: 'Access Management & Enterprise Governance',
                  ANALYTICS: 'Analytics, Alerts & Platform Settings'
                };

                return (
                  <div key={groupKey} className="p-6 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500" />
                        {groupNames[groupKey]}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">
                        {groupSections.filter(s => (roleAccessMap[selectedRbacRole] || []).includes(s.id)).length} of {groupSections.length} enabled
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {groupSections.map(sec => {
                        const Icon = sec.icon;
                        const isAllowed = (roleAccessMap[selectedRbacRole] || []).includes(sec.id);
                        return (
                          <div
                            key={sec.id}
                            onClick={() => handleToggleSectionForRole(selectedRbacRole, sec.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isAllowed
                                ? 'bg-primary-950/20 border-primary-500/40 text-white'
                                : 'bg-[#0B0F19] border-[#1F2937] text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isAllowed ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-800 text-slate-500'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-xs flex items-center gap-1.5">
                                  <span>{sec.name}</span>
                                  {sec.badge && (
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                                      {sec.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{sec.description}</p>
                              </div>
                            </div>

                            {/* Toggle Switch */}
                            <div className={`w-9 h-5 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                              isAllowed ? 'bg-primary-600 justify-end' : 'bg-slate-800 justify-start'
                            }`}>
                              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: WEB APPLICATIONS                                  */}
          {/* ======================================================== */}
          {activeTab === 'web-apps' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Web Applications</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage client web applications authorized to render FestiveUI animations.
                  </p>
                </div>
                <button
                  onClick={() => setCreateAppModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Connect Web Application
                </button>
              </div>

              <div className="rounded-3xl bg-[#111827] border border-[#1F2937] overflow-hidden">
                <div className="p-4 border-b border-[#1F2937] flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-white">{applications.length} Connected Applications</span>
                  <span>Filtered by Production Cluster</span>
                </div>

                <div className="divide-y divide-[#1F2937]">
                  {applications.map(app => (
                    <div key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#0B0F19]/40 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            <span>{app.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                              {app.status}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                              {app.framework}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <span className="font-mono text-slate-300">{app.domain}</span>
                            <span>•</span>
                            <span>{app.websiteUrl}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(app.token || 'fui_live_token', app.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-mono"
                        >
                          <Copy className="w-3.5 h-3.5 text-primary-400" />
                          <span>{copiedKey === app.id ? 'Copied!' : 'Copy Token'}</span>
                        </button>
                        <button
                          onClick={() => alert(`Whitelisted domains for ${app.name}: ${app.domain}`)}
                          className="px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-xs text-slate-300 hover:text-white"
                        >
                          Config
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: FESTIVAL CAMPAIGNS                                 */}
          {/* ======================================================== */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Festival Campaigns</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Orchestrate live seasonal themes and dynamic animations across your web properties.
                  </p>
                </div>
                <button
                  onClick={() => setCreateCampaignModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Campaign
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map(camp => (
                  <div key={camp.id} className="p-5 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-festive-gold flex items-center justify-center font-bold">
                          ✨
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white text-sm">{camp.name}</h3>
                          <span className="text-xs text-slate-400">{camp.festival} Season</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleCampaignStatus(camp.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                          camp.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {camp.status === 'ACTIVE' ? '● Live' : '○ Paused'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Intensity</span>
                        <span className="font-bold text-primary-400">{camp.intensity}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Target Domain</span>
                        <span className="font-mono text-slate-300 truncate block">{camp.targetDomain}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Schedule: {camp.startDate} → {camp.endDate}</span>
                      <button
                        onClick={() => alert(`Campaign ${camp.name} settings updated.`)}
                        className="text-primary-400 hover:text-primary-300 font-semibold"
                      >
                        Edit Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: ANIMATION LIBRARY                                  */}
          {/* ======================================================== */}
          {activeTab === 'animations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Animation Library</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    15 production-ready festival animation packages verified for 60 FPS performance.
                  </p>
                </div>
                <Link
                  href="/studio"
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-festive-gold" /> Launch Studio Canvas
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CORE_ANIMATIONS.map(anim => (
                  <div key={anim.slug} className="p-5 rounded-3xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-500/15 text-primary-300 border border-primary-500/30 font-bold uppercase">
                          {anim.festival}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          anim.isFree ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          {anim.isFree ? 'FREE TIER' : 'PRO ASSET'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-white text-sm">{anim.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{anim.type} • {anim.format}</p>
                    </div>

                    <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400">{anim.renders} renders</span>
                      <button
                        onClick={() => setCodeModalAnim(anim)}
                        className="px-3 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] text-primary-400 hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Code2 className="w-3.5 h-3.5" /> Get Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: API KEYS & WHITELIST                              */}
          {/* ======================================================== */}
          {activeTab === 'apikeys' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">API Keys & Whitelist</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage client credentials, secret tokens, and domain origin whitelisting policies.
                  </p>
                </div>
                <button
                  onClick={() => alert('New production API key generated and stored.')}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Provision New Key
                </button>
              </div>

              <div className="rounded-3xl bg-[#111827] border border-[#1F2937] divide-y divide-[#1F2937] overflow-hidden">
                {apiKeysList.map(item => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-primary-400" />
                        <span className="font-extrabold text-white text-sm">{item.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                        <span className="text-slate-300">{item.key}</span>
                        <span>•</span>
                        <span>{item.rateLimit}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Origins: <strong className="text-slate-400">{item.domain}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(item.key, item.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-mono"
                      >
                        <Copy className="w-3.5 h-3.5 text-primary-400" />
                        <span>{copiedKey === item.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => alert(`API key ${item.name} revoked.`)}
                        className="px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-rose-500/30 text-xs text-rose-400 hover:bg-rose-500/10"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: SDK INTEGRATIONS                                   */}
          {/* ======================================================== */}
          {activeTab === 'sdk' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">SDK Integrations</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Developer packages and integration guides for Next.js, React, Vue, and Vanilla JS.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary-400" /> NPM Package Installation
                  </h3>
                  <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#1F2937] text-xs font-mono text-emerald-400 flex items-center justify-between">
                    <span>npm install @festiveui/react @festiveui/core</span>
                    <button
                      onClick={() => copyToClipboard('npm install @festiveui/react @festiveui/core', 'npm-cmd')}
                      className="text-slate-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Installs the lightweight client-side physics engine, WebGL canvas layer, and automatic festival schedule synchronizer.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-festive-gold" /> Quick React Integration
                  </h3>
                  <pre className="p-4 rounded-2xl bg-[#0B0F19] border border-[#1F2937] text-xs font-mono text-slate-300 overflow-x-auto">
{`import { FestiveCanvas } from '@festiveui/react';

export default function App() {
  return (
    <FestiveCanvas
      festival="Diwali"
      intensity="SPECTACULAR"
      apiKey="fui_live_..."
    />
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: USER MANAGEMENT                                    */}
          {/* ======================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">User Management</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage platform accounts, role assignments, and active account statuses.
                  </p>
                </div>
                <button
                  onClick={() => alert('New user registration dialog.')}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add User
                </button>
              </div>

              <div className="rounded-3xl bg-[#111827] border border-[#1F2937] divide-y divide-[#1F2937] overflow-hidden">
                {usersList.map(u => (
                  <div key={u.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{u.name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            u.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                          }`}>
                            {u.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {u.email} • Joined {u.joined}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-[#0B0F19] text-primary-400 border border-[#1F2937]">
                        {u.role}
                      </span>
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: ROLE MANAGEMENT                                    */}
          {/* ======================================================== */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Role Directory</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    System role templates and custom enterprise roles with configured section permissions.
                  </p>
                </div>
                <button
                  onClick={() => setCreateRoleModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md glow-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Custom Role
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map(r => {
                  const accessCount = roleAccessMap[r.id]?.length || 0;
                  return (
                    <div key={r.id} className="p-5 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${r.color}`}>
                            {r.id}
                          </span>
                          {r.isSystem && (
                            <span className="text-[10px] font-mono text-slate-500">SYSTEM PROTECTED</span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-white text-base">{r.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{r.description}</p>
                      </div>

                      <div className="pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs">
                        <span className="font-mono text-primary-400 font-bold">{accessCount} / {DASHBOARD_SECTIONS.length} Sections Accessible</span>
                        <button
                          onClick={() => {
                            setSelectedRbacRole(r.id);
                            setActiveTab('dashboard-rbac');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-[#1F2937] border border-[#1F2937] text-white font-semibold flex items-center gap-1.5"
                        >
                          <Sliders className="w-3.5 h-3.5 text-primary-400" /> Configure Access
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: PURCHASES & ORDERS                                 */}
          {/* ======================================================== */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Purchases & Transactions</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Revenue history, commercial animation package purchases, and billing invoices.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Monthly Gross Volume</span>
                  <div className="text-xl font-extrabold text-emerald-400">$18,450.00</div>
                </div>
              </div>

              <div className="rounded-3xl bg-[#111827] border border-[#1F2937] divide-y divide-[#1F2937] overflow-hidden">
                {purchasesList.map(p => (
                  <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                        $
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{p.package}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                            {p.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Customer: {p.email} • Order ID: {p.id} • {p.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-extrabold text-white text-base">{p.amount}</span>
                        <span className="text-[10px] text-slate-500 block">Stripe USD</span>
                      </div>
                      <button
                        onClick={() => alert(`Invoice receipt downloaded for ${p.id}`)}
                        className="px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-xs text-slate-300 hover:text-white"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: AUDIT ACTIVITY LOGS                                */}
          {/* ======================================================== */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Security Audit Trail</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Immutable record of all administrative logins, permission changes, and platform events.
                </p>
              </div>

              <div className="rounded-3xl bg-[#111827] border border-[#1F2937] divide-y divide-[#1F2937] overflow-hidden">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4 text-primary-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                          <span>{log.action}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                            {log.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {log.resource} • Actor: {log.actor} (IP: {log.ip})
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-slate-500">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: SYSTEM HEALTH & INFRASTRUCTURE                      */}
          {/* ======================================================== */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">System Health & Telemetry</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Active diagnostic probe across database, cache, edge nodes, and background job queues.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase">PostgreSQL Database</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-xl font-extrabold text-white">Healthy • 2.1 ms</div>
                  <p className="text-xs text-slate-400">Connection Pool: 12/50 Active • Schema Version 2.4.0</p>
                </div>

                <div className="p-5 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase">Redis Cache Cluster</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-xl font-extrabold text-white">97.4% Hit Ratio</div>
                  <p className="text-xs text-slate-400">Memory: 42.1 MB / 512 MB • 1,420 Active Keys</p>
                </div>

                <div className="p-5 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase">Cloudflare CDN Edge</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-xl font-extrabold text-white">16.4 ms Latency</div>
                  <p className="text-xs text-slate-400">94.8% Edge Cache Hit Ratio • 28 Global Pops</p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* GENERIC FALLBACK VIEW FOR OTHER SECTIONS                 */}
          {/* ======================================================== */}
          {!['dashboard', 'overview', 'dashboard-rbac', 'web-apps', 'campaigns', 'animations', 'apikeys', 'sdk', 'users', 'roles', 'purchases', 'audit-logs', 'health'].includes(activeTab) && (
            <div className="p-8 rounded-3xl bg-[#111827] border border-[#1F2937] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-500/15 text-primary-400 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    {DASHBOARD_SECTIONS.find(s => s.id === activeTab)?.name || 'Section'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {DASHBOARD_SECTIONS.find(s => s.id === activeTab)?.description || 'Enterprise management module'}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0F19] border border-[#1F2937] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Module Operational Telemetry</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                    Connected
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This administrative module is fully synchronized with your PostgreSQL database and RBAC permissions engine.
                  You can configure which roles are allowed to view or hide this section in the <strong>Dashboard Access Control</strong> tab.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('dashboard-rbac')}
                    className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs"
                  >
                    Manage Role Access
                  </button>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Return to Overview
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: CONNECT WEB APPLICATION                             */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* MODAL 2: CREATE CUSTOM RBAC ROLE                             */}
      {/* ============================================================ */}
      {createRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary-400" />
                Create Custom Role
              </h3>
              <button onClick={() => setCreateRoleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Regional Marketing Lead"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what this role manages and why it exists..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Base Template</label>
                <select
                  value={newRoleTemplate}
                  onChange={(e) => setNewRoleTemplate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white"
                >
                  <option value="CONTENT_MANAGER">Content Manager</option>
                  <option value="ANIMATION_MANAGER">Animation Manager</option>
                  <option value="FINANCE_MANAGER">Finance Manager</option>
                  <option value="DEVELOPER_SUPPORT">Developer Support</option>
                  <option value="DEVELOPER">Developer</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateRoleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: GET ANIMATION CODE SNIPPET                          */}
      {/* ============================================================ */}
      {codeModalAnim && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-festive-gold" />
                  {codeModalAnim.name} Integration
                </h3>
                <span className="text-xs text-slate-400">{codeModalAnim.festival} • {codeModalAnim.format}</span>
              </div>
              <button onClick={() => setCodeModalAnim(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-[#0B0F19] p-1 rounded-xl border border-[#1F2937] text-xs">
              {(['next', 'react', 'vue', 'angular', 'vanilla'] as const).map(fw => (
                <button
                  key={fw}
                  onClick={() => setSelectedFramework(fw)}
                  className={`flex-1 py-1 rounded-lg font-semibold uppercase text-[10px] transition-all ${
                    selectedFramework === fw
                      ? 'bg-primary-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fw}
                </button>
              ))}
            </div>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-[#0B0F19] border border-[#1F2937] text-xs font-mono text-emerald-400 overflow-x-auto max-h-56">
{selectedFramework === 'next' || selectedFramework === 'react' ? (
`import { ${codeModalAnim.slug.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('')} } from '@festiveui/react';

export default function FestiveBanner() {
  return (
    <div className="relative w-full h-96">
      <${codeModalAnim.slug.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('')}
        intensity="SPECTACULAR"
        speed={1.0}
        interactive={true}
      />
    </div>
  );
}`
) : (
`<!-- ${codeModalAnim.name} integration for ${selectedFramework.toUpperCase()} -->
<festive-animation
  package="${codeModalAnim.slug}"
  festival="${codeModalAnim.festival}"
  intensity="SPECTACULAR">
</festive-animation>`
)}
              </pre>

              <button
                onClick={() => copyToClipboard(`import { ${codeModalAnim.slug} } from '@festiveui/react'`, 'code-snippet')}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'code-snippet' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCodeModalAnim(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: CREATE CAMPAIGN MODAL                               */}
      {/* ============================================================ */}
      {createCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-festive-gold" />
                Create Festival Campaign
              </h3>
              <button onClick={() => setCreateCampaignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newC = {
                  id: `camp-${Date.now()}`,
                  name: newCampaign.name,
                  festival: newCampaign.festival,
                  intensity: newCampaign.intensity,
                  status: 'ACTIVE',
                  targetDomain: newCampaign.targetDomain,
                  startDate: '2026-02-19',
                  endDate: '2026-03-05'
                };
                setCampaigns(prev => [newC, ...prev]);
                setCreateCampaignModal(false);
                setNewCampaign({ name: '', festival: 'Diwali', intensity: 'SPECTACULAR', targetDomain: 'store.festiveui.com' });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spring Holi Festival Splash"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Festival</label>
                  <select
                    value={newCampaign.festival}
                    onChange={(e) => setNewCampaign({ ...newCampaign, festival: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white"
                  >
                    <option value="Diwali">Diwali</option>
                    <option value="Christmas">Christmas</option>
                    <option value="New Year">New Year</option>
                    <option value="Eid">Eid</option>
                    <option value="Holi">Holi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Intensity</label>
                  <select
                    value={newCampaign.intensity}
                    onChange={(e) => setNewCampaign({ ...newCampaign, intensity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white"
                  >
                    <option value="SUBTLE">Subtle</option>
                    <option value="NORMAL">Normal</option>
                    <option value="SPECTACULAR">Spectacular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Domain</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. shop.acme.com or all-domains"
                  value={newCampaign.targetDomain}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetDomain: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
