'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Sparkles, Heart, Check, ArrowRight, Eye, Download } from 'lucide-react';
import { ApiClient } from '@/lib/api';
import { FestiveAnimation } from '@festiveui/react';

export default function MarketplacePage() {
  const [animations, setAnimations] = useState<any[]>([]);
  const [festivals, setFestivals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [onlyFree, setOnlyFree] = useState(false);
  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load filters metadata
    Promise.all([
      ApiClient.fetch('/festivals').catch(() => []),
      ApiClient.fetch('/animations/categories').catch(() => [])
    ]).then(([fests, cats]) => {
      setFestivals(fests);
      setCategories(cats);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedFestival) params.append('festival', selectedFestival);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedFormat) params.append('format', selectedFormat);
    if (onlyFree) params.append('isFree', 'true');
    params.append('sort', sort);

    ApiClient.fetch(`/animations?${params.toString()}`)
      .then((data) => {
        setAnimations(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load animations:', err);
        setLoading(false);
      });
  }, [search, selectedFestival, selectedCategory, selectedFormat, onlyFree, sort]);

  const toggleFavorite = async (e: React.MouseEvent, animId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await ApiClient.fetch(`/animations/${animId}/favorite`, { method: 'POST' });
      setAnimations((prev) =>
        prev.map((a) => (a.id === animId ? { ...a, isFavorited: !a.isFavorited } : a))
      );
    } catch {
      alert('Please sign in to favorite animations.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Festival Animation Marketplace
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
          Explore ready-to-mount vector decorations, interactive particle engines, and festival celebratory effects.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search animations by festival, tag or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Festival Dropdown */}
        <div>
          <select
            value={selectedFestival}
            onChange={(e) => setSelectedFestival(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option value="">All Festivals</option>
            {festivals.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option value="popular">Most Popular</option>
            <option value="trending">Trending Now</option>
            <option value="newest">Recently Added</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Secondary Quick Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-border/80">
        <button
          onClick={() => {
            setSelectedCategory('');
            setOnlyFree(false);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            !selectedCategory && !onlyFree ? 'bg-primary-600 text-white' : 'bg-surface text-slate-400 hover:text-white'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setOnlyFree(!onlyFree)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            onlyFree ? 'bg-emerald-600 text-white' : 'bg-surface text-slate-400 hover:text-white'
          }`}
        >
          🎁 Free Only
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setSelectedCategory(selectedCategory === c.slug ? '' : c.slug)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === c.slug ? 'bg-primary-600 text-white' : 'bg-surface text-slate-400 hover:text-white'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Animation Cards Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading animations...</p>
        </div>
      ) : animations.length === 0 ? (
        <div className="py-24 text-center rounded-2xl border border-dashed border-border p-8">
          <Sparkles className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No animations match your filter</h3>
          <p className="text-slate-400 text-xs mt-1">Try clearing some filters or searching for another festival.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {animations.map((anim) => (
            <Link
              key={anim.id}
              href={`/marketplace/${anim.slug}`}
              className="group rounded-2xl border border-border bg-surface hover:border-slate-700 p-4 flex flex-col justify-between glow-card relative"
            >
              {/* Card Preview Container */}
              <div className="h-44 rounded-xl bg-slate-950 border border-border/80 relative flex items-center justify-center overflow-hidden mb-3.5">
                <FestiveAnimation
                  type={anim.slug}
                  config={{ position: 'center', size: 80, ...anim.schema?.defaultSettings }}
                />

                {/* Favorite icon */}
                <button
                  onClick={(e) => toggleFavorite(e, anim.id)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-surface/80 backdrop-blur-sm text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${anim.isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                {/* Badge tags */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-slate-300 border border-border">
                    {anim.format}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-600/30 text-primary-300 border border-primary-500/30">
                    {anim.festival?.name}
                  </span>
                </div>
              </div>

              {/* Card Info */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white text-base group-hover:text-primary-400 transition-colors truncate">
                    {anim.name}
                  </h3>
                  <span className={`text-xs font-bold ${anim.isFree ? 'text-emerald-400' : 'text-festive-gold'}`}>
                    {anim.isFree ? 'FREE' : `$${Number(anim.price).toFixed(2)}`}
                  </span>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {anim.description}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  {anim.viewsCount || 0}
                </span>
                <span className="flex items-center gap-1 font-semibold text-primary-400 group-hover:translate-x-0.5 transition-transform">
                  Preview & Code <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
