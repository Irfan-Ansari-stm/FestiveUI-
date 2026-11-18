import { CanvasRenderer } from '../canvas-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

interface GoldParticle {
  x: number;
  y: number;
  size: number;
  vy: number;
  swaySpeed: number;
  swayDist: number;
  phase: number;
  sparkleSpeed: number;
  sparklePhase: number;
}

export class GoldenParticlesRenderer extends CanvasRenderer {
  private particles: GoldParticle[] = [];
  private time = 0;

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'golden-particles',
    properties: {
      count: { name: 'count', label: 'Dust Particle Count', type: 'range', default: 50, min: 15, max: 150, step: 5 },
      speed: { name: 'speed', label: 'Rise Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 },
      glow: { name: 'glow', label: 'Luminous Glow', type: 'boolean', default: true },
      color: { name: 'color', label: 'Gold Tone', type: 'color', default: '#F59E0B' }
    },
    defaults: {
      count: 50,
      speed: 1.0,
      glow: true,
      color: '#F59E0B'
    }
  };

  protected initCanvasState(): void {
    const count = this.config.settings?.count ?? 50;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.5 + 1,
        vy: -(Math.random() * 25 + 15),
        swaySpeed: Math.random() * 1.5 + 0.8,
        swayDist: Math.random() * 20 + 8,
        phase: Math.random() * Math.PI * 2,
        sparkleSpeed: Math.random() * 4 + 2,
        sparklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  protected renderFrame(dt: number): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const speed = this.config.settings?.speed ?? 1.0;
    this.time += dt * speed;
    const baseColor = this.config.settings?.color || '#F59E0B';
    const enableGlow = this.config.settings?.glow !== false;

    for (const p of this.particles) {
      p.y += p.vy * dt * speed;
      const currentX = p.x + Math.sin(this.time * p.swaySpeed + p.phase) * p.swayDist;

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }

      const sparkle = (Math.sin(this.time * p.sparkleSpeed + p.sparklePhase) + 1) * 0.5;
      const alpha = 0.3 + sparkle * 0.7;

      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      if (enableGlow && p.size > 1.8) {
        const glow = this.ctx.createRadialGradient(currentX, p.y, 0, currentX, p.y, p.size * 3.5);
        glow.addColorStop(0, 'rgba(254, 240, 138, 0.8)');
        glow.addColorStop(0.5, baseColor);
        glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(currentX, p.y, p.size * 3.5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.fillStyle = '#FEF08A';
      this.ctx.beginPath();
      this.ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
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
