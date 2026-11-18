import { SvgRenderer } from '../svg-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

export class ChristmasLightsRenderer extends SvgRenderer {
  private twinkleAnimId: number | null = null;
  private bulbElements: SVGEllipseElement[] = [];
  private glowElements: SVGCircleElement[] = [];
  private startTime = 0;
  private colors = ['#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'christmas-lights',
    properties: {
      bulbCount: { name: 'bulbCount', label: 'Bulb Count', type: 'range', default: 12, min: 6, max: 24, step: 2 },
      twinkleSpeed: { name: 'twinkleSpeed', label: 'Twinkle Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 },
      glow: { name: 'glow', label: 'Bulb Radiance', type: 'boolean', default: true }
    },
    defaults: {
      bulbCount: 12,
      twinkleSpeed: 1.0,
      glow: true
    }
  };

  protected getViewBox(): string {
    return '0 0 600 60';
  }

  protected buildSvgContent(): void {
    if (!this.svgRoot) return;
    this.bulbElements = [];
    this.glowElements = [];

    const count = this.config.settings?.bulbCount ?? 12;
    const enableGlow = this.config.settings?.glow !== false;

    let wirePath = 'M 0 10 ';
    const segWidth = 600 / count;
    for (let i = 0; i < count; i++) {
      const startX = i * segWidth;
      const midX = startX + segWidth / 2;
      const endX = startX + segWidth;
      wirePath += `Q ${midX} 26 ${endX} 10 `;
    }

    let bulbsSvg = '';
    for (let i = 0; i < count; i++) {
      const bulbX = i * segWidth + segWidth / 2;
      const bulbY = 22;
      const color = this.colors[i % this.colors.length];

      bulbsSvg += `
        <g>
          <!-- Socket -->
          <rect x="${bulbX - 3}" y="${bulbY - 4}" width="6" height="5" fill="#15803D" rx="1"/>
          <!-- Glow halo -->
          <circle id="bulbGlow-${this.id}-${i}" cx="${bulbX}" cy="${bulbY + 7}" r="14" fill="${color}" opacity="${enableGlow ? '0.35' : '0'}"/>
          <!-- Bulb glass -->
          <ellipse id="bulbGlass-${this.id}-${i}" cx="${bulbX}" cy="${bulbY + 7}" rx="5" ry="9" fill="${color}"/>
          <ellipse cx="${bulbX - 1.5}" cy="${bulbY + 5}" rx="1.5" ry="3" fill="#FFFFFF" opacity="0.65"/>
        </g>
      `;
    }

    this.svgRoot.innerHTML = `
      <!-- Festive Wire -->
      <path d="${wirePath}" fill="none" stroke="#166534" stroke-width="2.5" stroke-linecap="round"/>
      ${bulbsSvg}
    `;

    for (let i = 0; i < count; i++) {
      const glass = this.svgRoot.querySelector<SVGEllipseElement>(`#bulbGlass-${this.id}-${i}`);
      const glow = this.svgRoot.querySelector<SVGCircleElement>(`#bulbGlow-${this.id}-${i}`);
      if (glass) this.bulbElements.push(glass);
      if (glow) this.glowElements.push(glow);
    }
  }

  protected updateSvgContent(): void {
    this.buildSvgContent();
  }

  protected onResume(): void {
    if (this.twinkleAnimId !== null) return;
    this.startTime = performance.now();
    const speed = this.config.settings?.twinkleSpeed ?? 1.0;

    const animate = (now: number) => {
      if (!this.isRunning) return;
      const elapsed = (now - this.startTime) * 0.003 * speed;

      for (let i = 0; i < this.bulbElements.length; i++) {
        const pulse = 0.5 + Math.sin(elapsed * 2 + i * 1.3) * 0.5;
        if (this.bulbElements[i]) {
          this.bulbElements[i].style.opacity = String(0.6 + pulse * 0.4);
        }
        if (this.glowElements[i]) {
          this.glowElements[i].style.opacity = String(pulse * 0.5);
        }
      }

      this.twinkleAnimId = requestAnimationFrame(animate);
    };
    this.twinkleAnimId = requestAnimationFrame(animate);
  }

  protected onPause(): void {
    if (this.twinkleAnimId !== null) {
      cancelAnimationFrame(this.twinkleAnimId);
      this.twinkleAnimId = null;
    }
  }
}
