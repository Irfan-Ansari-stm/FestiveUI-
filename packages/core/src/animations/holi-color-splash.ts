import { CanvasRenderer } from '../canvas-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

interface SplatParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  drag: number;
}

export class HoliColorSplashRenderer extends CanvasRenderer {
  private particles: SplatParticle[] = [];
  private burstTimer = 0;
  private colors = ['#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F43F5E'];

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'holi-color-splash',
    properties: {
      burstRate: { name: 'burstRate', label: 'Color Burst Rate', type: 'range', default: 1.0, min: 0.2, max: 2.5, step: 0.1 },
      dropletCount: { name: 'dropletCount', label: 'Droplets Per Blast', type: 'range', default: 45, min: 15, max: 100, step: 5 },
      blastPower: { name: 'blastPower', label: 'Blast Velocity', type: 'range', default: 180, min: 80, max: 350, step: 10 }
    },
    defaults: {
      burstRate: 1.0,
      dropletCount: 45,
      blastPower: 180
    }
  };

  protected initCanvasState(): void {
    this.particles = [];
    this.createSplash(this.width / 2, this.height / 2);
  }

  private createSplash(originX: number, originY: number): void {
    const count = this.config.settings?.dropletCount ?? 45;
    const power = this.config.settings?.blastPower ?? 180;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.pow(Math.random(), 0.5) * power;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 5 + 2.5,
        color,
        alpha: 1,
        drag: Math.random() * 0.92 + 0.88
      });
    }
  }

  protected renderFrame(dt: number): void {
    if (!this.ctx) return;
    
    // Gradual clear for motion paint effect
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const rate = this.config.settings?.burstRate ?? 1.0;
    this.burstTimer += dt;
    if (this.burstTimer >= 1.5 / rate) {
      this.burstTimer = 0;
      const randX = Math.random() * (this.width * 0.7) + this.width * 0.15;
      const randY = Math.random() * (this.height * 0.7) + this.height * 0.15;
      this.createSplash(randX, randY);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(p.drag, dt * 60);
      p.vy *= Math.pow(p.drag, dt * 60);
      p.alpha -= dt * 0.45;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  protected onCanvasResized(): void {}
  protected onConfigUpdated(): void {}
}
