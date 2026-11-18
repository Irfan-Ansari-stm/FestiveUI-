import { AnimationConfig, AnimationRuntimeInstance } from '@festiveui/types';
import { registry, RegisteredAnimationEntry } from './registry';

export type { AnimationRuntimeInstance, AnimationConfig } from '@festiveui/types';

export interface MountOptions {
  type: string;
  target?: string | HTMLElement;
  config?: Partial<AnimationConfig>;
}

export class FestiveUIEngine {
  private activeInstances: Map<string, AnimationRuntimeInstance> = new Map();

  public mount(options: MountOptions): AnimationRuntimeInstance {
    const { type, target, config = {} } = options;
    const entry = registry.get(type);

    if (!entry) {
      throw new Error(`[FestiveUI] Unknown animation type: "${type}". Ensure it is registered in the registry.`);
    }

    let targetElement: HTMLElement | null = null;
    if (typeof target === 'string') {
      targetElement = document.querySelector<HTMLElement>(target);
    } else if (target instanceof HTMLElement) {
      targetElement = target;
    } else if (typeof document !== 'undefined') {
      targetElement = document.body;
    }

    if (!targetElement) {
      throw new Error(`[FestiveUI] Mount target "${target}" could not be found in DOM.`);
    }

    const mergedConfig: AnimationConfig = {
      type,
      ...entry.schema.defaults,
      ...config
    };

    const instance = entry.factory(mergedConfig);
    instance.mount(targetElement);

    this.activeInstances.set(instance.id, instance);
    return instance;
  }

  public unmount(instanceId: string): void {
    const inst = this.activeInstances.get(instanceId);
    if (inst) {
      inst.destroy();
      this.activeInstances.delete(instanceId);
    }
  }

  public unmountAll(): void {
    for (const [id, inst] of this.activeInstances.entries()) {
      inst.destroy();
    }
    this.activeInstances.clear();
  }

  public getInstance(instanceId: string): AnimationRuntimeInstance | undefined {
    return this.activeInstances.get(instanceId);
  }

  public getRegistry(): RegisteredAnimationEntry[] {
    return registry.getAll();
  }

  public getSchema(type: string) {
    return registry.get(type)?.schema;
  }
}

export const FestiveUI = new FestiveUIEngine();

export * from './renderer';
export * from './canvas-renderer';
export * from './svg-renderer';
export * from './registry';
export * from './animations/diya-glow';
export * from './animations/diwali-fireworks';
export * from './animations/floating-diyas';
export * from './animations/rangoli-decoration';
export * from './animations/golden-particles';
export * from './animations/holi-color-splash';
export * from './animations/holi-color-particles';
export * from './animations/falling-snow';
export * from './animations/christmas-lights';
export * from './animations/christmas-tree';
export * from './animations/new-year-confetti';
export * from './animations/fireworks-burst';
export * from './animations/countdown-animation';
export * from './animations/eid-lantern';
export * from './animations/crescent-moon';
