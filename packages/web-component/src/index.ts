import { FestiveUI, AnimationRuntimeInstance } from '@festiveui/core';

export class FestiveAnimationElement extends HTMLElement {
  private instance: AnimationRuntimeInstance | null = null;

  static get observedAttributes() {
    return ['type', 'size', 'speed', 'position', 'opacity'];
  }

  connectedCallback() {
    this.mountAnimation();
  }

  disconnectedCallback() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === 'type') {
      this.mountAnimation();
    } else if (this.instance) {
      this.instance.update(this.getConfigFromAttributes());
    }
  }

  private getConfigFromAttributes() {
    const size = this.getAttribute('size');
    const speed = this.getAttribute('speed');
    const position = this.getAttribute('position');
    const opacity = this.getAttribute('opacity');

    return {
      size: size ? Number(size) : undefined,
      speed: speed ? Number(speed) : undefined,
      position: (position as any) || undefined,
      opacity: opacity ? Number(opacity) : undefined
    };
  }

  private mountAnimation() {
    const type = this.getAttribute('type');
    if (!type) return;

    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }

    try {
      this.instance = FestiveUI.mount({
        type,
        target: this,
        config: this.getConfigFromAttributes()
      });
    } catch (e) {
      console.error('[FestiveUI WebComponent] Mount error:', e);
    }
  }
}

if (typeof window !== 'undefined' && 'customElements' in window) {
  if (!customElements.get('festive-animation')) {
    customElements.define('festive-animation', FestiveAnimationElement);
  }
}
