import { CanvasRenderer } from '../canvas-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

interface PowderCloud {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

export class HoliColorParticlesRenderer extends CanvasRenderer {
  private clouds: PowderCloud[] = [];
  private emitTimer = 0;
  private colors = [
    'rgba(236, 72, 153, 0.25)',  // Vibrant Gulal Pink
    'rgba(245, 158, 11, 0.25)',  // Radiant Marigold Yellow
    'rgba(16, 185, 129, 0.25)',  // Festive Spring Green
    'rgba(59, 130, 246, 0.25)',  // Sky Blue
    'rgba(139, 92, 246, 0.25)'   // Deep Royal Violet
  ];

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'holi-color-particles',
    properties: {
      intensity: { name: 'intensity', label: 'Smoke Billow Rate', type: 'range', default: 1.0, min: 0.3, max: 2.5, step: 0.1 },
      cloudSize: { name: 'cloudSize', label: 'Powder Cloud Size', type: 'range', default: 40, min: 20, max: 90, step: 5 }
    },
    defaults: {
      intensity: 1.0,
      cloudSize: 40
    }
  };

  protected initCanvasState(): void {
    this.clouds = [];
  }

  private emitCloud(): void {
    const maxSize = this.config.settings?.cloudSize ?? 40;
    this.clouds.push({
      x: Math.random() * this.width,
      y: this.height + 20,
      vx: (Math.random() - 0.5) * 40 + 20, // Wind bias
      vy: -(Math.random() * 30 + 35),
      radius: 8,
      maxRadius: Math.random() * maxSize + 25,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      alpha: 0.6
    });
  }

  protected renderFrame(dt: number): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const rate = this.config.settings?.intensity ?? 1.0;
    this.emitTimer += dt;
    if (this.emitTimer >= 0.15 / rate) {
      this.emitTimer = 0;
      this.emitCloud();
    }

    for (let i = this.clouds.length - 1; i >= 0; i--) {
      const c = this.clouds[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      if (c.radius < c.maxRadius) {
        c.radius += dt * 25;
      }
      c.alpha -= dt * 0.18;

      if (c.alpha <= 0 || c.y < -50) {
        this.clouds.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = c.alpha;
      const grad = this.ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
      grad.addColorStop(0, c.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  protected onCanvasResized(): void {}
  protected onConfigUpdated(): void {}
}
