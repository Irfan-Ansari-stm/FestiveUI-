import { FestiveUI, AnimationRuntimeInstance } from '@festiveui/core';
import { AnimationConfig } from '@festiveui/types';

export interface UseFestiveOptions {
  type: string;
  config?: Partial<AnimationConfig>;
}

export function createFestiveMount(targetEl: HTMLElement, type: string, config?: Partial<AnimationConfig>): AnimationRuntimeInstance {
  return FestiveUI.mount({
    type,
    target: targetEl,
    config
  });
}

export const FestiveVuePlugin = {
  install(app: any) {
    app.directive('festive', {
      mounted(el: HTMLElement, binding: { value: { type: string; config?: Partial<AnimationConfig> } }) {
        const { type, config } = binding.value || {};
        if (!type) return;
        const instance = FestiveUI.mount({ type, target: el, config });
        (el as any).__festiveInstance = instance;
      },
      updated(el: HTMLElement, binding: { value: { type: string; config?: Partial<AnimationConfig> } }) {
        const instance = (el as any).__festiveInstance as AnimationRuntimeInstance;
        if (instance && binding.value?.config) {
          instance.update(binding.value.config);
        }
      },
      unmounted(el: HTMLElement) {
        const instance = (el as any).__festiveInstance as AnimationRuntimeInstance;
        if (instance) {
          instance.destroy();
          delete (el as any).__festiveInstance;
        }
      }
    });
  }
};
