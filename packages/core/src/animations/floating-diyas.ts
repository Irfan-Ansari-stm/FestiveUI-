import { CanvasRenderer } from '../canvas-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

interface FloatingDiya {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  scale: number;
  phase: number;
  flickerPhase: number;
}

export class FloatingDiyasRenderer extends CanvasRenderer {
  private diyas: FloatingDiya[] = [];
  private time = 0;

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'floating-diyas',
    properties: {
      count: { name: 'count', label: 'Diya Count', type: 'range', default: 8, min: 2, max: 25, step: 1 },
      speed: { name: 'speed', label: 'Drift Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 },
      glow: { name: 'glow', label: 'Water Glow Reflections', type: 'boolean', default: true }
    },
    defaults: {
      count: 8,
      speed: 1.0,
      glow: true
    }
  };

  protected initCanvasState(): void {
    const count = this.config.settings?.count ?? 8;
    this.diyas = [];
    for (let i = 0; i < count; i++) {
      const baseY = Math.random() * (this.height * 0.5) + this.height * 0.4;
      this.diyas.push({
        x: Math.random() * this.width,
        y: baseY,
        baseY,
        vx: (Math.random() * 20 + 10) * (Math.random() > 0.5 ? 1 : -1),
        scale: Math.random() * 0.5 + 0.7,
        phase: Math.random() * Math.PI * 2,
        flickerPhase: Math.random() * Math.PI * 2
      });
    }
  }

  protected renderFrame(dt: number): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const speed = this.config.settings?.speed ?? 1.0;
    this.time += dt * speed;
    const enableGlow = this.config.settings?.glow !== false;

    for (const diya of this.diyas) {
      diya.x += diya.vx * dt * speed;
      if (diya.x > this.width + 50) diya.x = -50;
      if (diya.x < -50) diya.x = this.width + 50;

      // Bobbing sine motion
      diya.y = diya.baseY + Math.sin(this.time * 2 + diya.phase) * 6;

      const s = diya.scale;
      const flicker = 1 + Math.sin(this.time * 12 + diya.flickerPhase) * 0.15;

      this.ctx.save();
      this.ctx.translate(diya.x, diya.y);

      // Water reflection ripple
      if (enableGlow) {
        const glowGrad = this.ctx.createRadialGradient(0, 10, 2, 0, 10, 35 * s);
        glowGrad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
        glowGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.15)');
        glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        this.ctx.fillStyle = glowGrad;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 12 * s, 35 * s, 10 * s, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Clay Diya bowl
      this.ctx.fillStyle = '#B45309';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, 26 * s, 10 * s, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#78350F';
      this.ctx.beginPath();
      this.ctx.ellipse(0, -2 * s, 22 * s, 7 * s, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Flame
      this.ctx.fillStyle = '#EF4444';
      this.ctx.beginPath();
      this.ctx.arc(0, -6 * s, 6 * s * flicker, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#FBBF24';
      this.ctx.beginPath();
      this.ctx.arc(0, -9 * s, 4 * s * flicker, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(0, -11 * s, 2 * s * flicker, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  protected onCanvasResized(): void {
    this.initCanvasState();
  }
  protected onConfigUpdated(): void {
    this.initCanvasState();
  }
}
