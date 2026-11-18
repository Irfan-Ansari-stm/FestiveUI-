import { AnimationConfig } from '@festiveui/types';
import { BaseRenderer } from './renderer';

export abstract class CanvasRenderer extends BaseRenderer {
  protected canvas: HTMLCanvasElement | null = null;
  protected ctx: CanvasRenderingContext2D | null = null;
  protected width = 0;
  protected height = 0;
  protected dpr = 1;
  protected animationFrameId: number | null = null;
  protected lastTime = 0;

  protected init(): void {
    if (!this.container) return;
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'block';
    this.canvas.style.pointerEvents = 'none';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.updateDimensions();
    this.initCanvasState();
  }

  protected updateDimensions(): void {
    if (!this.canvas || !this.target) return;
    const rect = this.target.getBoundingClientRect();
    this.width = rect.width || 300;
    this.height = rect.height || 200;
    this.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
    }
  }

  protected onResume(): void {
    if (this.animationFrameId !== null) return;
    this.lastTime = performance.now();
    const loop = (currentTime: number) => {
      if (!this.isRunning) return;
      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
      this.lastTime = currentTime;

      this.renderFrame(dt);
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  protected onPause(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  protected onResize(): void {
    this.updateDimensions();
    this.onCanvasResized();
  }

  protected onDestroy(): void {
    this.onPause();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }

  protected abstract initCanvasState(): void;
  protected abstract renderFrame(dt: number): void;
  protected abstract onCanvasResized(): void;
}
