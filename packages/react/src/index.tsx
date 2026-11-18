import React, { useEffect, useRef } from 'react';
import { FestiveUI, AnimationRuntimeInstance } from '@festiveui/core';
import { AnimationConfig } from '@festiveui/types';

export interface FestiveAnimationProps {
  type: string;
  config?: Partial<AnimationConfig>;
  className?: string;
  style?: React.CSSProperties;
  onMount?: (instance: AnimationRuntimeInstance) => void;
}

export const FestiveAnimation: React.FC<FestiveAnimationProps> = ({
  type,
  config,
  className,
  style,
  onMount
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<AnimationRuntimeInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const instance = FestiveUI.mount({
        type,
        target: containerRef.current,
        config
      });
      instanceRef.current = instance;
      if (onMount) onMount(instance);
    } catch (err) {
      console.error('[FestiveUI React] Failed to mount animation:', err);
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [type]);

  useEffect(() => {
    if (instanceRef.current && config) {
      instanceRef.current.update(config);
    }
  }, [config]);

  return (
    <div
      ref={containerRef}
      className={`festiveui-react-wrapper ${className || ''}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style
      }}
    />
  );
};

export const DiyaEffect: React.FC<Omit<FestiveAnimationProps, 'type'>> = (props) => (
  <FestiveAnimation type="diya-glow" {...props} />
);

export const SnowEffect: React.FC<Omit<FestiveAnimationProps, 'type'>> = (props) => (
  <FestiveAnimation type="falling-snow" {...props} />
);

export const ConfettiEffect: React.FC<Omit<FestiveAnimationProps, 'type'>> = (props) => (
  <FestiveAnimation type="new-year-confetti" {...props} />
);

export const FireworksEffect: React.FC<Omit<FestiveAnimationProps, 'type'>> = (props) => (
  <FestiveAnimation type="diwali-fireworks" {...props} />
);

export const LanternEffect: React.FC<Omit<FestiveAnimationProps, 'type'>> = (props) => (
  <FestiveAnimation type="eid-lantern" {...props} />
);

export function useFestiveAnimation(type: string, config?: Partial<AnimationConfig>) {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<AnimationRuntimeInstance | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const inst = FestiveUI.mount({
      type,
      target: ref.current,
      config
    });
    instanceRef.current = inst;

    return () => {
      inst.destroy();
      instanceRef.current = null;
    };
  }, [type]);

  return { ref, instance: instanceRef.current };
}
