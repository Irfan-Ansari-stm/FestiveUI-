import { SvgRenderer } from '../svg-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

export class CountdownAnimationRenderer extends SvgRenderer {
  private timerAnimId: number | null = null;
  private circleProgress: SVGCircleElement | null = null;
  private textEl: SVGTextElement | null = null;
  private currentCount = 10;
  private startTime = 0;

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'countdown-animation',
    properties: {
      size: { name: 'size', label: 'Badge Size', type: 'range', default: 110, min: 70, max: 220, step: 10 },
      startFrom: { name: 'startFrom', label: 'Countdown Start', type: 'range', default: 10, min: 3, max: 60, step: 1 },
      accentColor: { name: 'accentColor', label: 'Ring Accent', type: 'color', default: '#3B82F6' }
    },
    defaults: {
      size: 110,
      startFrom: 10,
      accentColor: '#3B82F6'
    }
  };

  protected getViewBox(): string {
    return '0 0 100 100';
  }

  protected buildSvgContent(): void {
    if (!this.svgRoot) return;
    const accent = this.config.settings?.accentColor || '#3B82F6';
    this.currentCount = this.config.settings?.startFrom ?? 10;

    this.svgRoot.innerHTML = `
      <!-- Track Ring -->
      <circle cx="50" cy="50" r="42" fill="#0F172A" stroke="#334155" stroke-width="6"/>

      <!-- Progress Ring -->
      <circle id="countdownProgress-${this.id}" cx="50" cy="50" r="42" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round" stroke-dasharray="264" stroke-dashoffset="0" transform="rotate(-90 50 50)"/>

      <!-- Number Text -->
      <text id="countdownText-${this.id}" x="50" y="58" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="28" fill="#F8FAFC" text-anchor="middle">
        ${this.currentCount}
      </text>
    `;

    this.circleProgress = this.svgRoot.querySelector(`#countdownProgress-${this.id}`);
    this.textEl = this.svgRoot.querySelector(`#countdownText-${this.id}`);
  }

  protected updateSvgContent(): void {
    this.buildSvgContent();
  }

  protected onResume(): void {
    if (this.timerAnimId !== null) return;
    this.startTime = performance.now();
    const totalSecs = this.config.settings?.startFrom ?? 10;

    const animate = (now: number) => {
      if (!this.isRunning) return;
      const elapsed = (now - this.startTime) * 0.001;
      const remaining = Math.max(0, Math.ceil(totalSecs - (elapsed % (totalSecs + 1))));
      const progressFraction = (elapsed % (totalSecs + 1)) / totalSecs;

      if (this.textEl) {
        this.textEl.textContent = remaining === 0 ? '🎉' : String(remaining);
      }
      if (this.circleProgress) {
        const offset = 264 * (1 - Math.min(progressFraction, 1));
        this.circleProgress.setAttribute('stroke-dashoffset', String(offset));
      }

      this.timerAnimId = requestAnimationFrame(animate);
    };
    this.timerAnimId = requestAnimationFrame(animate);
  }

  protected onPause(): void {
    if (this.timerAnimId !== null) {
      cancelAnimationFrame(this.timerAnimId);
      this.timerAnimId = null;
    }
  }
}
