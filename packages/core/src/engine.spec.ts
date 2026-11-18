import { FestiveUI, registry } from '../src';

describe('FestiveUI Core Animation Engine', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-target"></div>';
  });

  afterEach(() => {
    FestiveUI.unmountAll();
  });

  describe('Registry', () => {
    it('should have all 15 default festival animations registered', () => {
      const all = registry.getAll();
      expect(all.length).toBeGreaterThanOrEqual(15);

      const expectedSlugs = [
        'diya-glow',
        'floating-diyas',
        'diwali-fireworks',
        'rangoli-decoration',
        'golden-particles',
        'holi-color-splash',
        'holi-color-particles',
        'falling-snow',
        'christmas-lights',
        'christmas-tree',
        'new-year-confetti',
        'fireworks-burst',
        'countdown-animation',
        'eid-lantern',
        'crescent-moon'
      ];

      for (const slug of expectedSlugs) {
        expect(registry.has(slug)).toBe(true);
        const entry = registry.get(slug);
        expect(entry).toBeDefined();
        expect(entry?.schema).toBeDefined();
        expect(entry?.schema.defaults).toBeDefined();
      }
    });
  });

  describe('Lifecycle Management', () => {
    it('should mount an SVG animation onto a DOM target element', () => {
      const target = document.getElementById('test-target')!;
      const instance = FestiveUI.mount({
        type: 'diya-glow',
        target,
        config: { size: 90 }
      });

      expect(instance).toBeDefined();
      expect(instance.type).toBe('diya-glow');
      expect(target.querySelector('.festiveui-container')).toBeTruthy();
      expect(target.querySelector('svg')).toBeTruthy();
      expect(instance.isPlaying()).toBe(true);
    });

    it('should pause and resume animation loop cleanly', () => {
      const target = document.getElementById('test-target')!;
      const instance = FestiveUI.mount({
        type: 'diya-glow',
        target
      });

      instance.pause();
      expect(instance.isPlaying()).toBe(false);

      instance.resume();
      expect(instance.isPlaying()).toBe(true);
    });

    it('should update configuration dynamically on active instance', () => {
      const target = document.getElementById('test-target')!;
      const instance = FestiveUI.mount({
        type: 'diya-glow',
        target,
        config: { size: 80 }
      });

      instance.update({ size: 120 });
      const svg = target.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('120');
      expect(svg?.getAttribute('height')).toBe('120');
    });

    it('should destroy instance and cleanly unmount from DOM', () => {
      const target = document.getElementById('test-target')!;
      const instance = FestiveUI.mount({
        type: 'diya-glow',
        target
      });

      expect(target.children.length).toBeGreaterThan(0);
      instance.destroy();
      expect(target.children.length).toBe(0);
      expect(instance.isPlaying()).toBe(false);
    });

    it('should throw an informative error when mounting an unknown animation type', () => {
      const target = document.getElementById('test-target')!;
      expect(() => {
        FestiveUI.mount({
          type: 'non-existent-animation',
          target
        });
      }).toThrow(/Unknown animation type/);
    });
  });
});
