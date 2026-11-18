import { CanvasRenderer } from '../canvas-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

interface RingSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
}

export class FireworksBurstRenderer extends CanvasRenderer {
  private sparks: RingSpark[] = [];
  private burstTimer = 0;
  private colors = ['#38BDF8', '#818CF8', '#F472B6', '#FBBF24', '#34D399'];

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'fireworks-burst',
    properties: {
      burstInterval: { name: 'burstInterval', label: 'Interval (seconds)', type: 'range', default: 1.5, min: 0.5, max: 3.5, step: 0.25 },
      ringDensity: { name: 'ringDensity', label: 'Ring Sparks Count', type: 'range', default: 60, min: 24, max: 120, step: 6 },
      ringRadius: { name: 'ringRadius', label: 'Expansion Speed', type: 'range', default: 140, min: 60, max: 260, step: 10 }
    },
    defaults: {
      burstInterval: 1.5,
      ringDensity: 60,
      ringRadius: 140
    }
  };

  protected initCanvasState(): void {
    this.sparks = [];
    this.createRingBurst(this.width / 2, this.height * 0.4);
  }

  private createRingBurst(centerX: number, centerY: number): void {
    const density = this.config.settings?.ringDensity ?? 60;
    const speed = this.config.settings?.ringRadius ?? 140;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];

    for (let i = 0; i < density; i++) {
      const angle = (i * Math.PI * 2) / density;
      this.sparks.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        decay: Math.random() * 0.4 + 0.6
      });
    }
  }

  protected renderFrame(dt: number): void {
    if (!this.ctx) return;
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const interval = this.config.settings?.burstInterval ?? 1.5;
    this.burstTimer += dt;
    if (this.burstTimer >= interval) {
      this.burstTimer = 0;
      const x = Math.random() * (this.width * 0.7) + this.width * 0.15;
      const y = Math.random() * (this.height * 0.5) + this.height * 0.2;
      this.createRingBurst(x, y);
    }

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 45 * dt; // Soft gravity
      s.alpha -= s.decay * dt;

      if (s.alpha <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  protected onCanvasResized(): void {}
  protected onConfigUpdated(): void {}
}
