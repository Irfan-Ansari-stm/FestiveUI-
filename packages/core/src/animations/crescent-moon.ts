import { SvgRenderer } from '../svg-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

export class CrescentMoonRenderer extends SvgRenderer {
  private starEl: SVGGElement | null = null;
  private glowEl: SVGCircleElement | null = null;
  private animId: number | null = null;
  private startTime = 0;

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'crescent-moon',
    properties: {
      size: { name: 'size', label: 'Crescent Moon Size', type: 'range', default: 110, min: 60, max: 260, step: 10 },
      moonColor: { name: 'moonColor', label: 'Luminous Gold', type: 'color', default: '#FDE047' },
      swayStar: { name: 'swayStar', label: 'Star Sway Physics', type: 'boolean', default: true },
      glow: { name: 'glow', label: 'Moonlight Radiance', type: 'boolean', default: true }
    },
    defaults: {
      size: 110,
      moonColor: '#FDE047',
      swayStar: true,
      glow: true
    }
  };

  protected getViewBox(): string {
    return '0 0 120 120';
  }

  protected buildSvgContent(): void {
    if (!this.svgRoot) return;
    const gold = this.config.settings?.moonColor || '#FDE047';
    const enableGlow = this.config.settings?.glow !== false;

    this.svgRoot.innerHTML = `
      <defs>
        <radialGradient id="moonGlowGrad-${this.id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#FDE047" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Moonlight Glow -->
      <circle id="crescentMoonGlow-${this.id}" cx="60" cy="60" r="50" fill="url(#moonGlowGrad-${this.id})" style="display: ${enableGlow ? 'block' : 'none'};"/>

      <!-- Crescent Moon Shape -->
      <path d="M 65 18 C 35 18 18 42 18 68 C 18 94 36 114 65 114 C 48 102 44 80 44 64 C 44 48 50 28 65 18 Z" fill="${gold}" stroke="#F59E0B" stroke-width="1.5"/>

      <!-- Dangling Star -->
      <g id="danglingStar-${this.id}" style="transform-origin: 55px 36px;">
        <line x1="55" y1="36" x2="68" y2="60" stroke="#FBBF24" stroke-width="1.2" stroke-dasharray="2 2"/>
        <!-- Star polygon -->
        <polygon points="68,54 70,59 75,59 71,62 73,67 68,64 63,67 65,62 61,59 66,59" fill="#FFFBEB" stroke="#F59E0B" stroke-width="0.8"/>
      </g>
    `;

    this.starEl = this.svgRoot.querySelector(`#danglingStar-${this.id}`);
    this.glowEl = this.svgRoot.querySelector(`#crescentMoonGlow-${this.id}`);
  }

  protected updateSvgContent(): void {
    this.buildSvgContent();
  }

  protected onResume(): void {
    if (this.animId !== null) return;
    this.startTime = performance.now();

    const animate = (now: number) => {
      if (!this.isRunning) return;
      const elapsed = (now - this.startTime) * 0.002;

      if (this.starEl && this.config.settings?.swayStar !== false) {
        const swing = Math.sin(elapsed * 2) * 12;
        this.starEl.style.transform = `rotate(${swing}deg)`;
      }

      if (this.glowEl) {
        const pulse = 0.75 + Math.sin(elapsed * 3) * 0.25;
        this.glowEl.style.opacity = String(pulse);
      }

      this.animId = requestAnimationFrame(animate);
    };
    this.animId = requestAnimationFrame(animate);
  }

  protected onPause(): void {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
