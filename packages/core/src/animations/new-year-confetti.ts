import { CanvasRenderer } from '../canvas-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  width: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  scaleX: number;
  scaleSpeed: number;
}

export class NewYearConfettiRenderer extends CanvasRenderer {
  private pieces: ConfettiPiece[] = [];
  private colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#FDE047'];

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'new-year-confetti',
    properties: {
      count: { name: 'count', label: 'Confetti Density', type: 'range', default: 90, min: 25, max: 250, step: 10 },
      gravity: { name: 'gravity', label: 'Fall Acceleration', type: 'range', default: 120, min: 40, max: 300, step: 10 },
      speed: { name: 'speed', label: 'Overall Pace', type: 'range', default: 1.0, min: 0.2, max: 2.5, step: 0.1 }
    },
    defaults: {
      count: 90,
      gravity: 120,
      speed: 1.0
    }
  };

  protected initCanvasState(): void {
    const count = this.config.settings?.count ?? 90;
    this.pieces = [];
    for (let i = 0; i < count; i++) {
      this.pieces.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height - this.height,
        size: Math.random() * 8 + 6,
        width: Math.random() * 5 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 50,
        vy: Math.random() * 80 + 70,
        scaleX: 1,
        scaleSpeed: Math.random() * 5 + 2
      });
    }
  }

  protected renderFrame(dt: number): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    const speed = this.config.settings?.speed ?? 1.0;
    const gravity = this.config.settings?.gravity ?? 120;

    for (const p of this.pieces) {
      p.y += p.vy * dt * speed;
      p.x += p.vx * dt * speed;
      p.rotation += p.rotationSpeed * dt * speed;
      p.scaleX = Math.cos(p.rotation * 2);

      if (p.y > this.height + 20) {
        p.y = -20;
        p.x = Math.random() * this.width;
        p.vy = Math.random() * 80 + 70;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.scale(p.scaleX, 1);

      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.width / 2, -p.size / 2, p.width, p.size);
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
