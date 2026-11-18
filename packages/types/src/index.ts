export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'DEVELOPER' | 'USER';

export type FestivalSlug =
  | 'diwali'
  | 'holi'
  | 'christmas'
  | 'new-year'
  | 'eid'
  | 'valentines-day'
  | 'halloween'
  | 'independence-day';

export type AnimationCategory =
  | 'particles'
  | 'decorations'
  | 'backgrounds'
  | 'borders'
  | 'celebrations'
  | 'greetings';

export type AnimationFormat = 'canvas' | 'svg' | 'css' | 'lottie' | 'webgl';

export type FrameworkType = 'react' | 'next' | 'vue' | 'angular' | 'vanilla' | 'web-component';

export type LicenseType = 'free' | 'developer' | 'commercial' | 'extended';

export interface AnimationPropertyControl {
  name: string;
  label: string;
  type: 'color' | 'number' | 'boolean' | 'select' | 'range' | 'text';
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  description?: string;
}

export interface AnimationSchemaDefinition {
  type: string;
  properties: Record<string, AnimationPropertyControl>;
  defaults: Record<string, any>;
}

export interface AnimationConfig {
  id?: string;
  type: string;
  target?: string | HTMLElement;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'center' | 'full';
  x?: number;
  y?: number;
  size?: number;
  width?: number;
  height?: number;
  opacity?: number;
  speed?: number;
  loop?: boolean;
  zIndex?: number;
  responsive?: boolean;
  respectReducedMotion?: boolean;
  settings?: Record<string, any>;
  [key: string]: any;
}

export interface EditorLayer {
  id: string;
  name: string;
  animationSlug: string;
  animationType: string;
  visible: boolean;
  locked: boolean;
  config: AnimationConfig;
}

export interface EditorDocumentContent {
  mode: 'canvas' | 'website';
  targetSelector?: string;
  viewport: 'desktop' | 'tablet' | 'mobile';
  backgroundColor: string;
  zoom: number;
  layers: EditorLayer[];
}

export interface AnimationRuntimeInstance {
  id: string;
  type: string;
  mount(target: HTMLElement): void;
  unmount(): void;
  update(config: Partial<AnimationConfig>): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  isPlaying(): boolean;
}

export interface ProjectDomainConfig {
  id: string;
  domain: string;
  verified: boolean;
}

export interface ProjectApiKeyDto {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
  revoked: boolean;
}

export interface SubscriptionPlanDto {
  id: string;
  code: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  name: string;
  priceMonthly: number;
  priceYearly: number;
  maxProjects: number;
  maxApiRequests: number;
  features: string[];
}
