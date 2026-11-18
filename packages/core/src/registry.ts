import { AnimationConfig, AnimationRuntimeInstance, AnimationSchemaDefinition } from '@festiveui/types';
import { DiyaGlowRenderer } from './animations/diya-glow';
import { DiwaliFireworksRenderer } from './animations/diwali-fireworks';
import { FloatingDiyasRenderer } from './animations/floating-diyas';
import { RangoliDecorationRenderer } from './animations/rangoli-decoration';
import { GoldenParticlesRenderer } from './animations/golden-particles';
import { HoliColorSplashRenderer } from './animations/holi-color-splash';
import { HoliColorParticlesRenderer } from './animations/holi-color-particles';
import { FallingSnowRenderer } from './animations/falling-snow';
import { ChristmasLightsRenderer } from './animations/christmas-lights';
import { ChristmasTreeRenderer } from './animations/christmas-tree';
import { NewYearConfettiRenderer } from './animations/new-year-confetti';
import { FireworksBurstRenderer } from './animations/fireworks-burst';
import { CountdownAnimationRenderer } from './animations/countdown-animation';
import { EidLanternRenderer } from './animations/eid-lantern';
import { CrescentMoonRenderer } from './animations/crescent-moon';

export type AnimationFactory = (config: AnimationConfig) => AnimationRuntimeInstance;

export interface RegisteredAnimationEntry {
  type: string;
  name: string;
  festival: string;
  category: string;
  format: 'canvas' | 'svg' | 'css';
  factory: AnimationFactory;
  schema: AnimationSchemaDefinition;
}

class AnimationRegistry {
  private entries: Map<string, RegisteredAnimationEntry> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.register({
      type: 'diya-glow',
      name: 'Diya Glow',
      festival: 'diwali',
      category: 'decorations',
      format: 'svg',
      factory: (config) => new DiyaGlowRenderer('diya-glow', config),
      schema: DiyaGlowRenderer.schema
    });

    this.register({
      type: 'floating-diyas',
      name: 'Floating Diyas',
      festival: 'diwali',
      category: 'particles',
      format: 'canvas',
      factory: (config) => new FloatingDiyasRenderer('floating-diyas', config),
      schema: FloatingDiyasRenderer.schema
    });

    this.register({
      type: 'diwali-fireworks',
      name: 'Diwali Fireworks',
      festival: 'diwali',
      category: 'celebrations',
      format: 'canvas',
      factory: (config) => new DiwaliFireworksRenderer('diwali-fireworks', config),
      schema: DiwaliFireworksRenderer.schema
    });

    this.register({
      type: 'rangoli-decoration',
      name: 'Rangoli Decoration',
      festival: 'diwali',
      category: 'decorations',
      format: 'svg',
      factory: (config) => new RangoliDecorationRenderer('rangoli-decoration', config),
      schema: RangoliDecorationRenderer.schema
    });

    this.register({
      type: 'golden-particles',
      name: 'Floating Golden Particles',
      festival: 'diwali',
      category: 'backgrounds',
      format: 'canvas',
      factory: (config) => new GoldenParticlesRenderer('golden-particles', config),
      schema: GoldenParticlesRenderer.schema
    });

    this.register({
      type: 'holi-color-splash',
      name: 'Holi Color Splash',
      festival: 'holi',
      category: 'celebrations',
      format: 'canvas',
      factory: (config) => new HoliColorSplashRenderer('holi-color-splash', config),
      schema: HoliColorSplashRenderer.schema
    });

    this.register({
      type: 'holi-color-particles',
      name: 'Holi Color Particles',
      festival: 'holi',
      category: 'particles',
      format: 'canvas',
      factory: (config) => new HoliColorParticlesRenderer('holi-color-particles', config),
      schema: HoliColorParticlesRenderer.schema
    });

    this.register({
      type: 'falling-snow',
      name: 'Falling Snow',
      festival: 'christmas',
      category: 'backgrounds',
      format: 'canvas',
      factory: (config) => new FallingSnowRenderer('falling-snow', config),
      schema: FallingSnowRenderer.schema
    });

    this.register({
      type: 'christmas-lights',
      name: 'Christmas Lights',
      festival: 'christmas',
      category: 'borders',
      format: 'svg',
      factory: (config) => new ChristmasLightsRenderer('christmas-lights', config),
      schema: ChristmasLightsRenderer.schema
    });

    this.register({
      type: 'christmas-tree',
      name: 'Christmas Tree Decoration',
      festival: 'christmas',
      category: 'decorations',
      format: 'svg',
      factory: (config) => new ChristmasTreeRenderer('christmas-tree', config),
      schema: ChristmasTreeRenderer.schema
    });

    this.register({
      type: 'new-year-confetti',
      name: 'New Year Confetti',
      festival: 'new-year',
      category: 'celebrations',
      format: 'canvas',
      factory: (config) => new NewYearConfettiRenderer('new-year-confetti', config),
      schema: NewYearConfettiRenderer.schema
    });

    this.register({
      type: 'fireworks-burst',
      name: 'Fireworks Burst',
      festival: 'new-year',
      category: 'celebrations',
      format: 'canvas',
      factory: (config) => new FireworksBurstRenderer('fireworks-burst', config),
      schema: FireworksBurstRenderer.schema
    });

    this.register({
      type: 'countdown-animation',
      name: 'Countdown Animation',
      festival: 'new-year',
      category: 'celebrations',
      format: 'svg',
      factory: (config) => new CountdownAnimationRenderer('countdown-animation', config),
      schema: CountdownAnimationRenderer.schema
    });

    this.register({
      type: 'eid-lantern',
      name: 'Eid Lantern',
      festival: 'eid',
      category: 'decorations',
      format: 'svg',
      factory: (config) => new EidLanternRenderer('eid-lantern', config),
      schema: EidLanternRenderer.schema
    });

    this.register({
      type: 'crescent-moon',
      name: 'Crescent Moon Decoration',
      festival: 'eid',
      category: 'decorations',
      format: 'svg',
      factory: (config) => new CrescentMoonRenderer('crescent-moon', config),
      schema: CrescentMoonRenderer.schema
    });
  }

  public register(entry: RegisteredAnimationEntry): void {
    this.entries.set(entry.type, entry);
  }

  public get(type: string): RegisteredAnimationEntry | undefined {
    return this.entries.get(type);
  }

  public getAll(): RegisteredAnimationEntry[] {
    return Array.from(this.entries.values());
  }

  public has(type: string): boolean {
    return this.entries.has(type);
  }
}

export const registry = new AnimationRegistry();
