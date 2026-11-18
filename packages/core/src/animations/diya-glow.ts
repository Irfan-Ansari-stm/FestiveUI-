import { SvgRenderer } from '../svg-renderer';
import { AnimationConfig, AnimationSchemaDefinition } from '@festiveui/types';

export class DiyaGlowRenderer extends SvgRenderer {
  private flameEl: SVGPathElement | null = null;
  private glowEl: SVGCircleElement | null = null;
  private flameAnimId: number | null = null;
  private startTime = 0;

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'diya-glow',
    properties: {
      size: { name: 'size', label: 'Diya Size', type: 'range', default: 80, min: 40, max: 240, step: 4 },
      glow: { name: 'glow', label: 'Enable Glow', type: 'boolean', default: true },
      glowIntensity: { name: 'glowIntensity', label: 'Glow Intensity', type: 'range', default: 0.8, min: 0.1, max: 1.0, step: 0.05 },
      flickerSpeed: { name: 'flickerSpeed', label: 'Flicker Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 },
      primaryColor: { name: 'primaryColor', label: 'Diya Clay Color', type: 'color', default: '#D97706' },
      flameColor: { name: 'flameColor', label: 'Flame Core Color', type: 'color', default: '#FBBF24' }
    },
    defaults: {
      size: 80,
      glow: true,
      glowIntensity: 0.8,
      flickerSpeed: 1.0,
      primaryColor: '#D97706',
      flameColor: '#FBBF24'
    }
  };

  protected getViewBox(): string {
    return '0 0 120 120';
  }

  protected buildSvgContent(): void {
    if (!this.svgRoot) return;

    const clayColor = this.config.settings?.primaryColor || '#D97706';
    const flameColor = this.config.settings?.flameColor || '#FBBF24';
    const enableGlow = this.config.settings?.glow !== false;
    const glowIntensity = this.config.settings?.glowIntensity ?? 0.8;

    this.svgRoot.innerHTML = `
      <defs>
        <radialGradient id="diyaGlowGrad-${this.id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#F59E0B" stop-opacity="${glowIntensity}"/>
          <stop offset="40%" stop-color="#EF4444" stop-opacity="${glowIntensity * 0.4}"/>
          <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="clayGrad-${this.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#B45309"/>
          <stop offset="50%" stop-color="${clayColor}"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
        <linearGradient id="flameGrad-${this.id}" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#EF4444"/>
          <stop offset="40%" stop-color="#F59E0B"/>
          <stop offset="80%" stop-color="${flameColor}"/>
          <stop offset="100%" stop-color="#FFFFFF"/>
        </linearGradient>
      </defs>

      <!-- Glow Aura -->
      <circle id="diyaGlowCircle-${this.id}" cx="60" cy="45" r="45" fill="url(#diyaGlowGrad-${this.id})" style="display: ${enableGlow ? 'block' : 'none'};"/>

      <!-- Diya Base (Clay Lamp) -->
      <g id="diyaBase-${this.id}">
        <!-- Rim -->
        <ellipse cx="60" cy="72" rx="42" ry="14" fill="url(#clayGrad-${this.id})" stroke="#92400E" stroke-width="2"/>
        <ellipse cx="60" cy="70" rx="36" ry="10" fill="#78350F"/>
        <!-- Bottom bowl -->
        <path d="M 22 72 Q 60 108 98 72 Z" fill="url(#clayGrad-${this.id})" stroke="#92400E" stroke-width="2"/>
        <!-- Golden ornamental rim dots -->
        <circle cx="36" cy="74" r="2" fill="#FDE68A"/>
        <circle cx="48" cy="77" r="2.5" fill="#FDE68A"/>
        <circle cx="60" cy="78" r="3" fill="#FDE68A"/>
        <circle cx="72" cy="77" r="2.5" fill="#FDE68A"/>
        <circle cx="84" cy="74" r="2" fill="#FDE68A"/>
      </g>

      <!-- Flame Wick -->
      <line x1="60" y1="70" x2="60" y2="58" stroke="#1F2937" stroke-width="3" stroke-linecap="round"/>

      <!-- Animated Flame -->
      <path id="diyaFlame-${this.id}" d="M 60 22 C 50 40 48 56 60 58 C 72 56 70 40 60 22 Z" fill="url(#flameGrad-${this.id})" style="transform-origin: 60px 58px;"/>
      <ellipse cx="60" cy="46" rx="4" ry="8" fill="#FFFFFF" opacity="0.8"/>
    `;

    this.flameEl = this.svgRoot.querySelector(`#diyaFlame-${this.id}`);
    this.glowEl = this.svgRoot.querySelector(`#diyaGlowCircle-${this.id}`);
  }

  protected updateSvgContent(): void {
    this.buildSvgContent();
  }

  protected onResume(): void {
    if (this.flameAnimId !== null) return;
    this.startTime = performance.now();
    const speed = this.config.settings?.flickerSpeed ?? 1.0;

    const animateFlame = (now: number) => {
      if (!this.isRunning) return;
      const elapsed = (now - this.startTime) * 0.003 * speed;
      
      if (this.flameEl) {
        const flickerScaleX = 1 + Math.sin(elapsed * 5.2) * 0.08 + Math.cos(elapsed * 8.7) * 0.05;
        const flickerScaleY = 1 + Math.cos(elapsed * 4.1) * 0.1;
        const flickerSkew = Math.sin(elapsed * 3.3) * 4;
        this.flameEl.style.transform = `scale(${flickerScaleX}, ${flickerScaleY}) skewX(${flickerSkew}deg)`;
      }

      if (this.glowEl) {
        const glowPulse = 0.8 + Math.sin(elapsed * 3.7) * 0.2;
        this.glowEl.style.opacity = String(glowPulse);
      }

      this.flameAnimId = requestAnimationFrame(animateFlame);
    };

    this.flameAnimId = requestAnimationFrame(animateFlame);
  }

  protected onPause(): void {
    if (this.flameAnimId !== null) {
      cancelAnimationFrame(this.flameAnimId);
      this.flameAnimId = null;
    }
  }
}
