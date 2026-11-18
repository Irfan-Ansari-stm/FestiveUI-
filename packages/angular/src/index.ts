import { FestiveUI, AnimationRuntimeInstance } from '@festiveui/core';
import { AnimationConfig } from '@festiveui/types';

export class FestiveUIService {
  mount(element: HTMLElement, type: string, config?: Partial<AnimationConfig>): AnimationRuntimeInstance {
    return FestiveUI.mount({ type, target: element, config });
  }

  unmount(id: string): void {
    FestiveUI.unmount(id);
  }

  unmountAll(): void {
    FestiveUI.unmountAll();
  }
}
