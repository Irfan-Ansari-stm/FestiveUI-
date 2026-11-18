import { CanvasRenderer } from '../canvas-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
}

export class DiwaliFireworksRenderer extends CanvasRenderer {
  private rockets: Rocket[] = [];
  private particles: Particle[] = [];
  private spawnTimer = 0;
  private colors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24', '#34D399'];

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'diwali-fireworks',
    properties: {
      frequency: { name: 'frequency', label: 'Launch Frequency', type: 'range', default: 1.2, min: 0.3, max: 3.0, step: 0.1 },
      particleCount: { name: 'particleCount', label: 'Explosion Particles', type: 'range', default: 60, min: 20, max: 150, step: 10 },
      gravity: { name: 'gravity', label: 'Gravity Pull', type: 'range', default: 120, min: 40, max: 300, step: 10 },
      trailOpacity: { name: 'trailOpacity', label: 'Motion Trail Opacity', type: 'range', default: 0.25, min: 0.05, max: 0.6, step: 0.05 }
    },
    defaults: {
      frequency: 1.2,
      particleCount: 60,
      gravity: 120,
      trailOpacity: 0.25
    }
  };

  protected initCanvasState(): void {
    this.rockets = [];
    this.particles = [];
    this.spawnRocket();
  }

  private spawnRocket(): void {
    const x = Math.random() * (this.width * 0.8) + this.width * 0.1;
    const y = this.height;
    const targetY = Math.random() * (this.height * 0.5) + this.height * 0.1;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.rockets.push({
      x,
      y,
      targetY,
      vy: -(Math.random() * 150 + 250),
      color
    });
  }

  private explode(x: number, y: number, color: string): void {
    const count = this.config.settings?.particleCount ?? 60;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 180 + 40;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: Math.random() * 2.5 + 1.5,
        decay: Math.random() * 0.6 + 0.4
      });
    }
  }

  protected renderFrame(dt: number): void {
    if (!this.ctx) return;

    // Trail background clear
    const trail = this.config.settings?.trailOpacity ?? 0.25;
    this.ctx.fillStyle = `rgba(15, 23, 42, ${trail})`;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const freq = this.config.settings?.frequency ?? 1.2;
    this.spawnTimer += dt;
    if (this.spawnTimer >= 1 / freq) {
      this.spawnTimer = 0;
      this.spawnRocket();
    }

    const gravity = this.config.settings?.gravity ?? 120;

    // Update and draw rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.y += r.vy * dt;

      this.ctx.fillStyle = r.color;
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Spark trail
      this.ctx.fillStyle = 'rgba(254, 240, 138, 0.6)';
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y + 4, 1.5, 0, Math.PI * 2);
      this.ctx.fill();

      if (r.y <= r.targetY) {
        this.explode(r.x, r.y, r.color);
        this.rockets.splice(i, 1);
      }
    }

    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += gravity * dt;
      p.alpha -= p.decay * dt;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  protected onCanvasResized(): void {}
  protected onConfigUpdated(): void {}
}
