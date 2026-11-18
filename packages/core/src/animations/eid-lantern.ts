import { SvgRenderer } from '../svg-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

export class EidLanternRenderer extends SvgRenderer {
  private lanternGroup: SVGGElement | null = null;
  private flameEl: SVGPathElement | null = null;
  private swingAnimId: number | null = null;
  private startTime = 0;

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'eid-lantern',
    properties: {
      size: { name: 'size', label: 'Lantern Height', type: 'range', default: 130, min: 70, max: 260, step: 10 },
      swingSpeed: { name: 'swingSpeed', label: 'Swaying Motion', type: 'range', default: 1.0, min: 0.2, max: 2.5, step: 0.1 },
      metalColor: { name: 'metalColor', label: 'Lantern Brass Tone', type: 'color', default: '#D97706' },
      glow: { name: 'glow', label: 'Candle Light Radiance', type: 'boolean', default: true }
    },
    defaults: {
      size: 130,
      swingSpeed: 1.0,
      metalColor: '#D97706',
      glow: true
    }
  };

  protected getViewBox(): string {
    return '0 0 100 140';
  }

  protected buildSvgContent(): void {
    if (!this.svgRoot) return;
    const brass = this.config.settings?.metalColor || '#D97706';
    const enableGlow = this.config.settings?.glow !== false;

    this.svgRoot.innerHTML = `
      <defs>
        <radialGradient id="lanternCandleGlow-${this.id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.85"/>
          <stop offset="60%" stop-color="#F59E0B" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#D97706" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Top Chain Ring -->
      <line x1="50" y1="0" x2="50" y2="18" stroke="#B45309" stroke-width="2"/>
      <circle cx="50" cy="18" r="4" fill="none" stroke="${brass}" stroke-width="2"/>

      <!-- Swaying Lantern Body Group -->
      <g id="lanternBody-${this.id}" style="transform-origin: 50px 18px;">
        <!-- Dome Top & Crescent -->
        <path d="M 32 38 Q 50 20 68 38 Z" fill="${brass}" stroke="#92400E" stroke-width="1.5"/>
        <path d="M 50 18 Q 46 25 50 30 Q 54 25 50 18 Z" fill="#FDE047"/>

        <!-- Glass Chamber -->
        <polygon points="34,38 24,78 32,102 68,102 76,78 66,38" fill="rgba(254, 243, 199, 0.2)" stroke="${brass}" stroke-width="2"/>

        <!-- Internal Candle Glow -->
        <circle cx="50" cy="72" r="28" fill="url(#lanternCandleGlow-${this.id})" style="display: ${enableGlow ? 'block' : 'none'};"/>

        <!-- Candle Base & Flame -->
        <rect x="46" y="74" width="8" height="18" fill="#F8FAFC" rx="1"/>
        <path id="lanternFlame-${this.id}" d="M 50 62 C 46 68 47 74 50 74 C 53 74 54 68 50 62 Z" fill="#F59E0B"/>

        <!-- Lattice Filigree Lines -->
        <line x1="50" y1="38" x2="50" y2="102" stroke="${brass}" stroke-width="1.5"/>
        <line x1="34" y1="38" x2="68" y2="102" stroke="${brass}" stroke-width="0.8" opacity="0.6"/>
        <line x1="66" y1="38" x2="32" y2="102" stroke="${brass}" stroke-width="0.8" opacity="0.6"/>

        <!-- Ornate Base Tier -->
        <rect x="30" y="102" width="40" height="8" fill="${brass}" rx="2"/>
        <circle cx="50" cy="115" r="3" fill="${brass}"/>
        <line x1="50" y1="110" x2="50" y2="115" stroke="${brass}" stroke-width="1.5"/>
      </g>
    `;

    this.lanternGroup = this.svgRoot.querySelector(`#lanternBody-${this.id}`);
    this.flameEl = this.svgRoot.querySelector(`#lanternFlame-${this.id}`);
  }

  protected updateSvgContent(): void {
    this.buildSvgContent();
  }

  protected onResume(): void {
    if (this.swingAnimId !== null) return;
    this.startTime = performance.now();
    const speed = this.config.settings?.swingSpeed ?? 1.0;

    const animate = (now: number) => {
      if (!this.isRunning) return;
      const elapsed = (now - this.startTime) * 0.002 * speed;

      if (this.lanternGroup) {
        const swingDeg = Math.sin(elapsed * 1.5) * 8;
        this.lanternGroup.style.transform = `rotate(${swingDeg}deg)`;
      }

      if (this.flameEl) {
        const flicker = 1 + Math.sin(elapsed * 8) * 0.15;
        this.flameEl.style.transform = `scale(${flicker})`;
        this.flameEl.style.transformOrigin = '50px 74px';
      }

      this.swingAnimId = requestAnimationFrame(animate);
    };
    this.swingAnimId = requestAnimationFrame(animate);
  }

  protected onPause(): void {
    if (this.swingAnimId !== null) {
      cancelAnimationFrame(this.swingAnimId);
      this.swingAnimId = null;
    }
  }
}
