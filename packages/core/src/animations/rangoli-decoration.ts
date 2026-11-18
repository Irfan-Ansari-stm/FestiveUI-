import { SvgRenderer } from '../svg-renderer';
import { AnimationSchemaDefinition } from '@festiveui/types';

export class RangoliDecorationRenderer extends SvgRenderer {
  private rotationAnimId: number | null = null;
  private ringOuter: SVGGElement | null = null;
  private ringInner: SVGGElement | null = null;
  private startTime = 0;

  public static readonly schema: AnimationSchemaDefinition = {
    type: 'rangoli-decoration',
    properties: {
      size: { name: 'size', label: 'Rangoli Diameter', type: 'range', default: 160, min: 80, max: 400, step: 10 },
      rotationSpeed: { name: 'rotationSpeed', label: 'Rotation Speed', type: 'range', default: 1.0, min: 0, max: 3.0, step: 0.1 },
      primaryColor: { name: 'primaryColor', label: 'Outer Petals', type: 'color', default: '#EC4899' },
      secondaryColor: { name: 'secondaryColor', label: 'Inner Mandala', type: 'color', default: '#F59E0B' },
      accentColor: { name: 'accentColor', label: 'Center Core', type: 'color', default: '#10B981' }
    },
    defaults: {
      size: 160,
      rotationSpeed: 1.0,
      primaryColor: '#EC4899',
      secondaryColor: '#F59E0B',
      accentColor: '#10B981'
    }
  };

  protected getViewBox(): string {
    return '0 0 200 200';
  }

  protected buildSvgContent(): void {
    if (!this.svgRoot) return;

    const col1 = this.config.settings?.primaryColor || '#EC4899';
    const col2 = this.config.settings?.secondaryColor || '#F59E0B';
    const col3 = this.config.settings?.accentColor || '#10B981';

    // Generate 12 outer petals and 8 inner petals
    let outerPetals = '';
    for (let i = 0; i < 12; i++) {
      const angle = (i * 360) / 12;
      outerPetals += `<path d="M 100 100 Q 85 45 100 20 Q 115 45 100 100 Z" fill="${col1}" stroke="#FFFFFF" stroke-width="1.2" transform="rotate(${angle} 100 100)" opacity="0.9"/>`;
    }

    let innerPetals = '';
    for (let i = 0; i < 8; i++) {
      const angle = (i * 360) / 8 + 22.5;
      innerPetals += `<path d="M 100 100 Q 90 60 100 45 Q 110 60 100 100 Z" fill="${col2}" stroke="#FFFFFF" stroke-width="1" transform="rotate(${angle} 100 100)"/>`;
    }

    this.svgRoot.innerHTML = `
      <defs>
        <filter id="rangoliGlow-${this.id}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#rangoliGlow-${this.id})">
        <!-- Outer Rotating Ring -->
        <g id="rangoliOuter-${this.id}" style="transform-origin: 100px 100px;">
          <circle cx="100" cy="100" r="92" fill="none" stroke="${col2}" stroke-width="2" stroke-dasharray="4 6"/>
          ${outerPetals}
        </g>

        <!-- Inner Counter-Rotating Ring -->
        <g id="rangoliInner-${this.id}" style="transform-origin: 100px 100px;">
          <circle cx="100" cy="100" r="56" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
          ${innerPetals}
        </g>

        <!-- Sacred Center Floral Core -->
        <circle cx="100" cy="100" r="22" fill="${col3}" stroke="#FFFFFF" stroke-width="2"/>
        <circle cx="100" cy="100" r="14" fill="#FDE68A"/>
        <circle cx="100" cy="100" r="6" fill="#EF4444"/>
      </g>
    `;

    this.ringOuter = this.svgRoot.querySelector(`#rangoliOuter-${this.id}`);
    this.ringInner = this.svgRoot.querySelector(`#rangoliInner-${this.id}`);
  }

  protected updateSvgContent(): void {
    this.buildSvgContent();
  }

  protected onResume(): void {
    if (this.rotationAnimId !== null) return;
    this.startTime = performance.now();
    const speed = this.config.settings?.rotationSpeed ?? 1.0;

    const animate = (now: number) => {
      if (!this.isRunning) return;
      const elapsed = (now - this.startTime) * 0.001 * speed;
      const outerDeg = (elapsed * 20) % 360;
      const innerDeg = (-elapsed * 30) % 360;

      if (this.ringOuter) {
        this.ringOuter.style.transform = `rotate(${outerDeg}deg)`;
      }
      if (this.ringInner) {
        this.ringInner.style.transform = `rotate(${innerDeg}deg)`;
      }

      this.rotationAnimId = requestAnimationFrame(animate);
    };
    this.rotationAnimId = requestAnimationFrame(animate);
  }

  protected onPause(): void {
    if (this.rotationAnimId !== null) {
      cancelAnimationFrame(this.rotationAnimId);
      this.rotationAnimId = null;
    }
  }
}
