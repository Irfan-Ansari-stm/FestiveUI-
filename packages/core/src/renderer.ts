import { AnimationConfig, AnimationRuntimeInstance } from '@festiveui/types';

export abstract class BaseRenderer implements AnimationRuntimeInstance {
  public readonly id: string;
  public readonly type: string;
  protected target: HTMLElement | null = null;
  protected container: HTMLElement | null = null;
  protected config: AnimationConfig;
  protected isRunning = false;
  protected prefersReducedMotion = false;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private mediaQueryList: MediaQueryList | null = null;

  constructor(type: string, config: AnimationConfig) {
    this.id = config.id || `${type}-${Math.random().toString(36).substring(2, 9)}`;
    this.type = type;
    this.config = { ...config };
  }

  public mount(target: HTMLElement): void {
    if (this.target) {
      this.unmount();
    }
    this.target = target;
    this.setupAccessibility();
    this.createContainer();
    this.init();
    this.setupObservers();
    this.resume();
  }

  public unmount(): void {
    this.pause();
    this.teardownObservers();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.target = null;
  }

  public update(newConfig: Partial<AnimationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.onConfigUpdated();
  }

  public pause(): void {
    this.isRunning = false;
    this.onPause();
  }

  public resume(): void {
    if (this.prefersReducedMotion && this.config.respectReducedMotion !== false) {
      return;
    }
    this.isRunning = true;
    this.onResume();
  }

  public destroy(): void {
    this.unmount();
    this.onDestroy();
  }

  public isPlaying(): boolean {
    return this.isRunning;
  }

  protected createContainer(): void {
    if (!this.target) return;
    this.container = document.createElement('div');
    this.container.className = `festiveui-container festiveui-${this.type}`;
    this.container.setAttribute('data-festiveui-id', this.id);
    
    // Positioning
    const pos = this.config.position || 'center';
    const isOverlay = pos === 'full';
    
    this.container.style.position = isOverlay ? 'absolute' : 'relative';
    if (isOverlay) {
      this.container.style.top = '0';
      this.container.style.left = '0';
      this.container.style.width = '100%';
      this.container.style.height = '100%';
      this.container.style.pointerEvents = 'none';
    } else {
      this.applyAnchorPosition(pos);
    }

    if (this.config.zIndex !== undefined) {
      this.container.style.zIndex = String(this.config.zIndex);
    }
    if (this.config.opacity !== undefined) {
      this.container.style.opacity = String(this.config.opacity);
    }

    this.target.appendChild(this.container);
  }

  private applyAnchorPosition(pos: string): void {
    if (!this.container) return;
    this.container.style.position = 'absolute';
    this.container.style.pointerEvents = 'none';

    switch (pos) {
      case 'top-left':
        this.container.style.top = `${this.config.y ?? 16}px`;
        this.container.style.left = `${this.config.x ?? 16}px`;
        break;
      case 'top-right':
        this.container.style.top = `${this.config.y ?? 16}px`;
        this.container.style.right = `${this.config.x ?? 16}px`;
        break;
      case 'bottom-left':
        this.container.style.bottom = `${this.config.y ?? 16}px`;
        this.container.style.left = `${this.config.x ?? 16}px`;
        break;
      case 'bottom-right':
        this.container.style.bottom = `${this.config.y ?? 16}px`;
        this.container.style.right = `${this.config.x ?? 16}px`;
        break;
      case 'top':
        this.container.style.top = `${this.config.y ?? 16}px`;
        this.container.style.left = '50%';
        this.container.style.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        this.container.style.bottom = `${this.config.y ?? 16}px`;
        this.container.style.left = '50%';
        this.container.style.transform = 'translateX(-50%)';
        break;
      case 'center':
      default:
        this.container.style.top = '50%';
        this.container.style.left = '50%';
        this.container.style.transform = 'translate(-50%, -50%)';
        break;
    }
  }

  private setupAccessibility(): void {
    if (typeof window === 'undefined') return;
    this.mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = this.mediaQueryList.matches;
    this.mediaQueryList.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      if (this.prefersReducedMotion && this.config.respectReducedMotion !== false) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  private setupObservers(): void {
    if (typeof window === 'undefined' || !this.target || !this.container) return;

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.target);
    }

    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.resume();
          } else {
            this.pause();
          }
        });
      }, { threshold: 0.05 });
      this.intersectionObserver.observe(this.target);
    }
  }

  private teardownObservers(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  protected abstract init(): void;
  protected abstract onResize(): void;
  protected abstract onConfigUpdated(): void;
  protected abstract onPause(): void;
  protected abstract onResume(): void;
  protected abstract onDestroy(): void;
}
