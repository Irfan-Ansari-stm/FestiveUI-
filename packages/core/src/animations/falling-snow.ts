import { CanvasRenderer } from '../canvas-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

interface SnowFlake {
  x: number;
  y: number;
  radius: number;
  density: number;
  vy: number;
  swaySpeed: number;
  swayDist: number;
  phase: number;
  alpha: number;
}

export class FallingSnowRenderer extends CanvasRenderer {
  private flakes: SnowFlake[] = [];
  private time = 0;

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'falling-snow',
    properties: {
      count: { name: 'count', label: 'Snowflake Count', type: 'range', default: 80, min: 20, max: 250, step: 10 },
      speed: { name: 'speed', label: 'Fall Speed', type: 'range', default: 1.0, min: 0.2, max: 3.0, step: 0.1 },
      wind: { name: 'wind', label: 'Wind Drift', type: 'range', default: 15, min: -50, max: 50, step: 5 },
      glow: { name: 'glow', label: 'Crystalline Glow', type: 'boolean', default: true }
    },
    defaults: {
      count: 80,
      speed: 1.0,
      wind: 15,
      glow: true
    }
  };

  protected initCanvasState(): void {
    const count = this.config.settings?.count ?? 80;
    this.flakes = [];
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 3.5 + 1;
      this.flakes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius,
        density: Math.random() * 20,
        vy: radius * 14 + 18, // Bigger flakes fall faster (parallax)
        swaySpeed: Math.random() * 2 + 1,
        swayDist: Math.random() * 15 + 5,
        phase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.5 + 0.5
      });
    }
  }

  protected renderFrame(dt: number): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const speed = this.config.settings?.speed ?? 1.0;
    const wind = this.config.settings?.wind ?? 15;
    const enableGlow = this.config.settings?.glow !== false;
    this.time += dt * speed;

    for (const f of this.flakes) {
      f.y += f.vy * dt * speed;
      f.x += wind * dt * speed;
      const currentX = f.x + Math.sin(this.time * f.swaySpeed + f.phase) * f.swayDist;

      if (f.y > this.height + 10) {
        f.y = -10;
        f.x = Math.random() * this.width;
      }
      if (f.x > this.width + 20) f.x = -20;
      if (f.x < -20) f.x = this.width + 20;

      this.ctx.save();
      this.ctx.globalAlpha = f.alpha;

      if (enableGlow && f.radius > 2.5) {
        const glow = this.ctx.createRadialGradient(currentX, f.y, 0, currentX, f.y, f.radius * 2.5);
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        glow.addColorStop(0.5, 'rgba(224, 242, 254, 0.4)');
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(currentX, f.y, f.radius * 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(currentX, f.y, f.radius, 0, Math.PI * 2);
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
