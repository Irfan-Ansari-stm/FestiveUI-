import { SvgRenderer } from '../svg-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

export class ChristmasTreeRenderer extends SvgRenderer {
  private starGlow: SVGCircleElement | null = null;
  private animId: number | null = null;
  private startTime = 0;

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'christmas-tree',
    properties: {
      size: { name: 'size', label: 'Tree Height', type: 'range', default: 120, min: 60, max: 280, step: 10 },
      treeColor: { name: 'treeColor', label: 'Pine Foliage', type: 'color', default: '#15803D' },
      starGlow: { name: 'starGlow', label: 'Star Radiance', type: 'boolean', default: true }
    },
    defaults: {
      size: 120,
      treeColor: '#15803D',
      starGlow: true
    }
  };

  protected getViewBox(): string {
    return '0 0 100 130';
  }

  protected buildSvgContent(): void {
    if (!this.svgRoot) return;
    const treeCol = this.config.settings?.treeColor || '#15803D';
    const enableStarGlow = this.config.settings?.starGlow !== false;

    this.svgRoot.innerHTML = `
      <defs>
        <radialGradient id="starGlowGrad-${this.id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FDE047" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Trunk -->
      <rect x="44" y="105" width="12" height="18" fill="#78350F" rx="2"/>

      <!-- Tree Foliage Tier 3 (Bottom) -->
      <polygon points="50,65 15,108 85,108" fill="${treeCol}"/>
      <!-- Tree Foliage Tier 2 (Middle) -->
      <polygon points="50,42 22,80 78,80" fill="#16A34A"/>
      <!-- Tree Foliage Tier 1 (Top) -->
      <polygon points="50,20 30,52 70,52" fill="#22C55E"/>

      <!-- Festive Baubles -->
      <circle cx="36" cy="98" r="4" fill="#EF4444"/>
      <circle cx="62" cy="100" r="4" fill="#F59E0B"/>
      <circle cx="48" cy="88" r="3.5" fill="#3B82F6"/>
      <circle cx="38" cy="72" r="3.5" fill="#EC4899"/>
      <circle cx="64" cy="70" r="3.5" fill="#EF4444"/>
      <circle cx="50" cy="48" r="3" fill="#FDE047"/>

      <!-- Star Glow -->
      <circle id="treeStarGlow-${this.id}" cx="50" cy="16" r="16" fill="url(#starGlowGrad-${this.id})" style="display: ${enableStarGlow ? 'block' : 'none'};"/>

      <!-- Golden Star Topper -->
      <polygon points="50,6 53,13 60,13 55,18 57,25 50,21 43,25 45,18 40,13 47,13" fill="#FBBF24" stroke="#F59E0B" stroke-width="0.8"/>
    `;

    this.starGlow = this.svgRoot.querySelector(`#treeStarGlow-${this.id}`);
  }

  protected updateSvgContent(): void {
    this.buildSvgContent();
  }

  protected onResume(): void {
    if (this.animId !== null) return;
    this.startTime = performance.now();

    const animate = (now: number) => {
      if (!this.isRunning) return;
      const elapsed = (now - this.startTime) * 0.003;

      if (this.starGlow) {
        const pulse = 0.7 + Math.sin(elapsed * 4) * 0.3;
        this.starGlow.style.opacity = String(pulse);
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
