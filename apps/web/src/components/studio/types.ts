export interface StudioLayer {
  id: string;
  name: string;
  animationSlug: string;
  animationType: string;
  visible: boolean;
  locked: boolean;
  isText?: boolean;
  textContent?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textColor?: string;
  textGlow?: string;
  // Position & Dimensions
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  zIndex: number;
  opacity: number;
  blendMode: 'normal' | 'screen' | 'lighten' | 'overlay' | 'multiply';
  // Animation Behavior
  speed: number;
  loop: boolean;
  direction: 'normal' | 'reverse' | 'alternate';
  entranceEffect: 'none' | 'fade-in' | 'scale-up' | 'drop-down';
  // Timeline Settings
  timelineStart: number; // in seconds
  timelineDuration: number; // in seconds
  // Custom Parameters from Schema
  settings: Record<string, any>;
}

export interface LibraryItem {
  slug: string;
  name: string;
  festival: string;
  category: string;
  format: 'SVG' | 'Canvas' | 'Text' | 'WebGL';
  isFree: boolean;
  rating: number;
  description: string;
  defaultSettings: Record<string, any>;
}

export interface CanvasPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export const CANVAS_PRESETS: CanvasPreset[] = [
  { id: 'fhd', name: 'Full HD Desktop', width: 1920, height: 1080, aspectRatio: '16:9' },
  { id: 'laptop', name: 'Laptop Display', width: 1440, height: 900, aspectRatio: '16:10' },
  { id: 'hd', name: 'HD Banner', width: 1280, height: 720, aspectRatio: '16:9' },
  { id: 'square', name: 'Social Square', width: 1080, height: 1080, aspectRatio: '1:1' },
  { id: 'story', name: 'Story / Reel', width: 1080, height: 1920, aspectRatio: '9:16' },
  { id: 'banner', name: 'Hero Web Banner', width: 1200, height: 628, aspectRatio: '1.91:1' },
  { id: 'custom', name: 'Custom Size', width: 1200, height: 700, aspectRatio: 'Custom' }
];

export const FESTIVE_TEMPLATES = [
  {
    id: 'tmpl-diwali-grand',
    name: 'Diwali Grand Celebration',
    festival: 'Diwali',
    thumbnailColor: '#F97316',
    layersCount: 3,
    description: 'Radiant Diya lamp paired with synchronized fireworks bursts and golden sparkles.'
  },
  {
    id: 'tmpl-christmas-wonderland',
    name: 'Winter Christmas Wonderland',
    festival: 'Christmas',
    thumbnailColor: '#0284C7',
    layersCount: 3,
    description: 'Gentle falling snow physics combined with draped fairy lights and glowing pine tree.'
  },
  {
    id: 'tmpl-newyear-countdown',
    name: 'New Year Midnight Gala',
    festival: 'New Year',
    thumbnailColor: '#8B5CF6',
    layersCount: 3,
    description: 'Countdown HUD clock flanked by metallic confetti showers and fireworks.'
  },
  {
    id: 'tmpl-eid-lanterns',
    name: 'Eid Mubarak Desert Night',
    festival: 'Eid',
    thumbnailColor: '#10B981',
    layersCount: 2,
    description: 'Traditional swaying brass Fanous lanterns suspended under crescent moon.'
  }
];

export const INITIAL_LIBRARY_ITEMS: LibraryItem[] = [
  {
    slug: 'diya-glow',
    name: 'Diya Glow Lamp',
    festival: 'diwali',
    category: 'decorations',
    format: 'SVG',
    isFree: true,
    rating: 4.9,
    description: 'Traditional oil lamp with customizable radiant flame and warm atmospheric glow.',
    defaultSettings: { glow: true, glowIntensity: 0.85, flickerSpeed: 1.0, flameSize: 85, flameColor: '#F97316', baseColor: '#D97706' }
  },
  {
    slug: 'diwali-fireworks',
    name: 'Diwali Fireworks Burst',
    festival: 'diwali',
    category: 'celebrations',
    format: 'Canvas',
    isFree: false,
    rating: 5.0,
    description: 'High-energy synchronized fireworks particle explosion with gravity and smoke trails.',
    defaultSettings: { particleCount: 220, explosionRadius: 180, gravity: 0.8, colorPalette: 'Gold & Crimson', spread: 1.2 }
  },
  {
    slug: 'floating-diyas',
    name: 'Floating Diyas River',
    festival: 'diwali',
    category: 'particles',
    format: 'Canvas',
    isFree: true,
    rating: 4.8,
    description: 'Serene water-current simulation of floating lit diyas gently moving with ripples.',
    defaultSettings: { count: 18, waveSpeed: 0.8, glowIntensity: 0.9, waterRipples: true }
  },
  {
    slug: 'rangoli-decoration',
    name: 'Geometric Rangoli Mandala',
    festival: 'diwali',
    category: 'decorations',
    format: 'SVG',
    isFree: true,
    rating: 4.7,
    description: 'Symmetrical sacred geometric rangoli with rotating vector petals and sparkle accents.',
    defaultSettings: { rotateSpeed: 0.5, petalColor: '#EA580C', centerColor: '#F59E0B', scale: 1.0 }
  },
  {
    slug: 'golden-particles',
    name: 'Golden Sparkler Dust',
    festival: 'diwali',
    category: 'particles',
    format: 'Canvas',
    isFree: true,
    rating: 4.9,
    description: 'Ambient shimmering golden star dust floating upward with realistic twinkling.',
    defaultSettings: { particleDensity: 120, riseSpeed: 1.0, twinkleRate: 0.9, color: '#FCD34D' }
  },
  {
    slug: 'falling-snow',
    name: 'Winter Falling Snow',
    festival: 'christmas',
    category: 'backgrounds',
    format: 'Canvas',
    isFree: true,
    rating: 5.0,
    description: 'Physics-based snowfall with variable snowflake sizes, air resistance, and wind drift.',
    defaultSettings: { snowflakeCount: 160, fallSpeed: 1.2, windDrift: 0.5, minSize: 2, maxSize: 7 }
  },
  {
    slug: 'christmas-lights',
    name: 'Christmas Fairy Lights',
    festival: 'christmas',
    category: 'borders',
    format: 'SVG',
    isFree: true,
    rating: 4.8,
    description: 'Multi-color festive wire garland with randomized blinking rhythm and socket reflections.',
    defaultSettings: { garlandStyle: 'Draped Swag', bulbSpacing: 35, twinkleSpeed: 1.2, palette: 'Multi-Color' }
  },
  {
    slug: 'christmas-tree',
    name: 'Twinkling Pine Tree',
    festival: 'christmas',
    category: 'decorations',
    format: 'SVG',
    isFree: false,
    rating: 4.8,
    description: 'Festive decorated evergreen pine tree crowned with a glowing golden star and baubles.',
    defaultSettings: { starGlow: true, baubleTwinkle: true, snowDusting: true, treeScale: 1.0 }
  },
  {
    slug: 'new-year-confetti',
    name: 'New Year Confetti Shower',
    festival: 'new-year',
    category: 'celebrations',
    format: 'Canvas',
    isFree: true,
    rating: 4.9,
    description: 'Celebratory multi-shape metallic confetti storm falling with natural air tumble.',
    defaultSettings: { confettiCount: 180, fallSpeed: 1.5, shapeType: 'Mixed Stars & Ribbons', airTumble: true }
  },
  {
    slug: 'fireworks-burst',
    name: 'Midnight Pyro HUD',
    festival: 'new-year',
    category: 'celebrations',
    format: 'Canvas',
    isFree: false,
    rating: 5.0,
    description: 'Grand finale stadium firework volleys exploding in concentric circular waves.',
    defaultSettings: { burstVolume: 300, burstSpeed: 1.4, multiColor: true, soundSync: false }
  },
  {
    slug: 'countdown-animation',
    name: 'Midnight Countdown HUD',
    festival: 'new-year',
    category: 'greetings',
    format: 'SVG',
    isFree: true,
    rating: 4.7,
    description: 'Glowing futuristic vector digital counter leading up to festive celebration stroke.',
    defaultSettings: { startSeconds: 10, digitColor: '#38BDF8', glowRadius: 20, pulseOnZero: true }
  },
  {
    slug: 'eid-lantern',
    name: 'Eid Fanous Hanging Lantern',
    festival: 'eid',
    category: 'decorations',
    format: 'SVG',
    isFree: true,
    rating: 4.8,
    description: 'Intricately patterned Islamic brass lantern swaying gently with glowing inner candle.',
    defaultSettings: { swaySpeed: 1.0, swayAngle: 12, candleGlow: 0.9, brassColor: '#D97706' }
  },
  {
    slug: 'crescent-moon',
    name: 'Glowing Crescent & Star',
    festival: 'eid',
    category: 'backgrounds',
    format: 'SVG',
    isFree: true,
    rating: 4.8,
    description: 'Atmospheric celestial crescent moon surrounded by twinkling desert constellations.',
    defaultSettings: { moonGlow: true, glowColor: '#FDE047', starTwinkle: true, scale: 1.1 }
  },
  {
    slug: 'holi-color-splash',
    name: 'Holi Fluid Powder Splash',
    festival: 'holi',
    category: 'celebrations',
    format: 'Canvas',
    isFree: true,
    rating: 4.9,
    description: 'Explosive fluid dynamic color pigment splash radiating organic ink splatters.',
    defaultSettings: { splatterRadius: 160, particleIntensity: 1.4, colorTheme: 'Pink, Cyan & Yellow' }
  },
  {
    slug: 'holi-color-particles',
    name: 'Gulal Organic Cloud',
    festival: 'holi',
    category: 'particles',
    format: 'Canvas',
    isFree: false,
    rating: 4.9,
    description: 'Volumetric color smoke cloud billowing and drifting across the viewport.',
    defaultSettings: { cloudDensity: 80, driftSpeed: 0.7, opacity: 0.85, colors: 'Saffron & Magenta' }
  },
  {
    slug: 'custom-text',
    name: 'Festive Greeting Typography',
    festival: 'general',
    category: 'greetings',
    format: 'Text',
    isFree: true,
    rating: 4.9,
    description: 'Custom typography heading with customizable gold neon, festive shadow, and animations.',
    defaultSettings: { text: 'Happy Diwali', fontSize: 48, color: '#FCD34D', glowColor: '#F97316' }
  }
];
