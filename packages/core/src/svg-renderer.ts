import { AnimationConfig } from '@festiveui/types';
import { BaseRenderer } from './renderer';

export abstract class SvgRenderer extends BaseRenderer {
  protected svgRoot: SVGSVGElement | null = null;
  protected size = 64;

  protected init(): void {
    if (!this.container) return;
    this.size = this.config.size || 80;
    this.svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgRoot.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svgRoot.setAttribute('viewBox', this.getViewBox());
    this.svgRoot.setAttribute('width', String(this.size));
    this.svgRoot.setAttribute('height', String(this.size));
    this.svgRoot.style.overflow = 'visible';
    this.svgRoot.style.filter = 'drop-shadow(0px 4px 12px rgba(0,0,0,0.25))';
    
    this.container.appendChild(this.svgRoot);
    this.buildSvgContent();
  }

  protected onResize(): void {
    if (!this.svgRoot) return;
    this.size = this.config.size || 80;
    this.svgRoot.setAttribute('width', String(this.size));
    this.svgRoot.setAttribute('height', String(this.size));
  }

  protected onConfigUpdated(): void {
    if (!this.svgRoot) return;
    this.size = this.config.size || 80;
    this.svgRoot.setAttribute('width', String(this.size));
    this.svgRoot.setAttribute('height', String(this.size));
    this.updateSvgContent();
  }

  protected onDestroy(): void {
    if (this.svgRoot && this.svgRoot.parentNode) {
      this.svgRoot.parentNode.removeChild(this.svgRoot);
    }
    this.svgRoot = null;
  }

  protected abstract getViewBox(): string;
  protected abstract buildSvgContent(): void;
  protected abstract updateSvgContent(): void;
}
