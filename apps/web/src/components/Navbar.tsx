'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Layers, Compass, BookOpen, CreditCard, LayoutDashboard, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { ApiClient } from '@/lib/api';

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = ApiClient.getToken();
    if (token) {
      ApiClient.fetch('/auth/me')
        .then((u) => setUser(u))
        .catch(() => ApiClient.setToken(null));
    }
  }, []);

  const handleLogout = () => {
    ApiClient.setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 via-festive-gold to-festive-crimson p-0.5 glow-primary transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-festive-gold" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-primary-400 bg-clip-text text-transparent">
              Festive<span className="text-primary-500">UI</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">
              Animation Cloud
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link
            href="/marketplace"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-surfaceHover transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-primary-400" />
            Marketplace
          </Link>
          <Link
            href="/festivals"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-surfaceHover transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-festive-gold" />
            Festivals
          </Link>
          <Link
            href="/studio"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-surfaceHover transition-colors flex items-center gap-1.5 text-festive-gold font-semibold"
          >
            <Layers className="w-4 h-4 text-festive-gold" />
            Studio
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30">
              Visual
            </span>
          </Link>
          <Link
            href="/pricing"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-surfaceHover transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            Pricing
          </Link>
          <Link
            href="/docs"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-surfaceHover transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            Docs
          </Link>
        </nav>

        {/* Right CTA / User State */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-surface border border-border hover:border-slate-600 text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-primary-400" />
                Dashboard
              </Link>
              {user.roles?.includes('SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 flex items-center gap-1.5 hover:bg-red-900/50 transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surfaceHover"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-surfaceHover transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-500 text-white shadow-sm glow-primary transition-all hover:scale-[1.02]"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surfaceHover"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-surfaceHover"
          >
            Marketplace
          </Link>
          <Link
            href="/festivals"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-surfaceHover"
          >
            Festivals
          </Link>
          <Link
            href="/studio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-primary-400 font-semibold hover:bg-surfaceHover"
          >
            Visual Studio
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-surfaceHover"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-surfaceHover"
          >
            Documentation
          </Link>
          <div className="pt-4 border-t border-border flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-center rounded-lg bg-surface border border-border text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-center rounded-lg bg-red-950/40 text-red-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-center rounded-lg bg-surface border border-border text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-center rounded-lg bg-primary-600 text-white font-medium"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
