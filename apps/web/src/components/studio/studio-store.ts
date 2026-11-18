import { create } from 'zustand';
import { StudioLayer, CanvasPreset, CANVAS_PRESETS, FESTIVE_TEMPLATES } from './types';
import { ApiClient } from '@/lib/api';

export interface StudioStoreState {
  // Document Metadata
  documentId: string | null;
  projectTitle: string;
  mode: 'canvas' | 'website';
  targetSelector: string;

  // Canvas Workspace & Preset
  canvasPreset: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  activeTool: 'select' | 'hand' | 'text';

  // Panels Collapse States
  isLeftSidebarOpen: boolean;
  isRightInspectorOpen: boolean;
  timelineOpen: boolean;
  timelineHeight: number;
  isTimelineMaximized: boolean;

  // Layers & Selection
  layers: StudioLayer[];
  selectedLayerId: string | null;
  clipboard: StudioLayer | null;
  contextMenu: { x: number; y: number; layerId: string } | null;

  // History
  history: StudioLayer[][];
  future: StudioLayer[][];

  // Timeline & Playback Engine
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  playbackSpeed: number;
  isLooping: boolean;

  // Save Status
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSavedTime: string;

  // Modals
  exportModalOpen: boolean;
  publishModalOpen: boolean;
  previewModalOpen: boolean;

  // Actions
  setProjectTitle: (title: string) => void;
  setMode: (mode: 'canvas' | 'website') => void;
  setTargetSelector: (selector: string) => void;
  setCanvasPreset: (presetId: string) => void;
  setCanvasDimensions: (width: number, height: number) => void;
  setBackgroundColor: (color: string) => void;
  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  resetPanZoom: () => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  setActiveTool: (tool: 'select' | 'hand' | 'text') => void;

  toggleLeftSidebar: () => void;
  toggleRightInspector: () => void;
  toggleTimeline: () => void;
  setTimelineHeight: (height: number) => void;
  toggleTimelineMaximize: () => void;

  selectLayer: (id: string | null) => void;
  addLayer: (layer: StudioLayer) => void;
  updateLayer: (id: string, updates: Partial<StudioLayer>) => void;
  duplicateLayer: (id: string) => void;
  deleteLayer: (id: string) => void;
  reorderLayerZ: (id: string, dir: 'up' | 'down') => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  nudgeLayer: (id: string, dx: number, dy: number) => void;
  alignLayers: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;

  copySelectedLayer: () => void;
  pasteLayer: () => void;
  openContextMenu: (x: number, y: number, layerId: string) => void;
  closeContextMenu: () => void;

  undo: () => void;
  redo: () => void;
  recordHistory: () => void;

  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
  restart: () => void;
  seek: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleLoop: () => void;

  saveProject: () => Promise<void>;
  loadTemplate: (templateId: string) => void;

  setExportModalOpen: (open: boolean) => void;
  setPublishModalOpen: (open: boolean) => void;
  setPreviewModalOpen: (open: boolean) => void;
}

const DEFAULT_LAYERS: StudioLayer[] = [
  {
    id: 'layer-diya-default',
    name: 'Glowing Diya Lamp',
    animationSlug: 'diya-glow',
    animationType: 'diya-glow',
    visible: true,
    locked: false,
    x: 480,
    y: 180,
    width: 150,
    height: 150,
    rotation: 0,
    scale: 1.0,
    zIndex: 50,
    opacity: 1,
    blendMode: 'normal',
    speed: 1.0,
    loop: true,
    direction: 'normal',
    entranceEffect: 'fade-in',
    timelineStart: 0,
    timelineDuration: 10,
    settings: { glow: true, glowIntensity: 0.9, flickerSpeed: 1.0, flameSize: 90, flameColor: '#F97316', baseColor: '#D97706' }
  },
  {
    id: 'layer-greeting-default',
    name: 'Happy Diwali Heading',
    animationSlug: 'custom-text',
    animationType: 'custom-text',
    isText: true,
    textContent: 'Happy Diwali',
    fontFamily: 'serif',
    fontSize: 54,
    fontWeight: '800',
    textColor: '#FCD34D',
    textGlow: '#F97316',
    visible: true,
    locked: false,
    x: 360,
    y: 360,
    width: 400,
    height: 80,
    rotation: 0,
    scale: 1.0,
    zIndex: 60,
    opacity: 1,
    blendMode: 'normal',
    speed: 1.0,
    loop: true,
    direction: 'normal',
    entranceEffect: 'scale-up',
    timelineStart: 0.5,
    timelineDuration: 9.5,
    settings: {}
  }
];

export const useStudioStore = create<StudioStoreState>((set, get) => ({
  documentId: null,
  projectTitle: 'Untitled Festive Scene',
  mode: 'canvas',
  targetSelector: '#hero',

  canvasPreset: 'hd',
  canvasWidth: 1280,
  canvasHeight: 720,
  backgroundColor: '#0B0F19',
  zoom: 0.85,
  panX: 0,
  panY: 0,
  showGrid: true,
  snapToGrid: true,
  gridSize: 20,
  activeTool: 'select',

  isLeftSidebarOpen: true,
  isRightInspectorOpen: true,
  timelineOpen: false,
  timelineHeight: 220,
  isTimelineMaximized: false,

  layers: DEFAULT_LAYERS,
  selectedLayerId: 'layer-diya-default',
  clipboard: null,
  contextMenu: null,

  history: [],
  future: [],

  isPlaying: false,
  currentTime: 0,
  totalDuration: 10,
  playbackSpeed: 1.0,
  isLooping: true,

  saveStatus: 'saved',
  lastSavedTime: 'Just now',

  exportModalOpen: false,
  publishModalOpen: false,
  previewModalOpen: false,

  setProjectTitle: (projectTitle) => set({ projectTitle, saveStatus: 'unsaved' }),
  setMode: (mode) => set({ mode, saveStatus: 'unsaved' }),
  setTargetSelector: (targetSelector) => set({ targetSelector, saveStatus: 'unsaved' }),

  setCanvasPreset: (presetId) => {
    const preset = CANVAS_PRESETS.find(p => p.id === presetId);
    if (preset) {
      set({
        canvasPreset: presetId,
        canvasWidth: preset.width,
        canvasHeight: preset.height,
        saveStatus: 'unsaved'
      });
    }
  },

  setCanvasDimensions: (canvasWidth, canvasHeight) => {
    set({
      canvasPreset: 'custom',
      canvasWidth: Math.max(320, Math.min(3840, canvasWidth)),
      canvasHeight: Math.max(240, Math.min(2160, canvasHeight)),
      saveStatus: 'unsaved'
    });
  },

  setBackgroundColor: (backgroundColor) => set({ backgroundColor, saveStatus: 'unsaved' }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(zoom, 2.5)) }),
  setPan: (panX, panY) => set({ panX, panY }),
  resetPanZoom: () => set({ zoom: 0.85, panX: 0, panY: 0 }),
  toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),
  toggleSnap: () => set(state => ({ snapToGrid: !state.snapToGrid })),
  setActiveTool: (activeTool) => set({ activeTool }),

  toggleLeftSidebar: () => set(state => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
  toggleRightInspector: () => set(state => ({ isRightInspectorOpen: !state.isRightInspectorOpen })),
  toggleTimeline: () => set(state => ({ timelineOpen: !state.timelineOpen })),
  setTimelineHeight: (timelineHeight) => set({ timelineHeight: Math.max(140, Math.min(500, timelineHeight)) }),
  toggleTimelineMaximize: () => set(state => ({
    isTimelineMaximized: !state.isTimelineMaximized,
    timelineHeight: state.isTimelineMaximized ? 220 : 420
  })),

  selectLayer: (selectedLayerId) => set({ selectedLayerId, contextMenu: null }),

  recordHistory: () => {
    const { layers, history } = get();
    set({
      history: [...history.slice(-25), layers],
      future: [],
      saveStatus: 'unsaved'
    });
  },

  addLayer: (layer) => {
    const { layers } = get();
    get().recordHistory();
    set({
      layers: [...layers, layer],
      selectedLayerId: layer.id
    });
  },

  updateLayer: (id, updates) => {
    const { layers } = get();
    set({
      layers: layers.map(l => l.id === id ? { ...l, ...updates } : l),
      saveStatus: 'unsaved'
    });
  },

  duplicateLayer: (id) => {
    const { layers } = get();
    const target = layers.find(l => l.id === id);
    if (!target) return;
    get().recordHistory();

    const dupId = `${target.animationSlug}-${Date.now().toString(36)}`;
    const duplicated: StudioLayer = {
      ...target,
      id: dupId,
      name: `${target.name} (Copy)`,
      x: target.x + 30,
      y: target.y + 30,
      zIndex: target.zIndex + 1,
      settings: { ...target.settings }
    };

    set({
      layers: [...layers, duplicated],
      selectedLayerId: dupId
    });
  },

  deleteLayer: (id) => {
    const { layers, selectedLayerId } = get();
    get().recordHistory();
    set({
      layers: layers.filter(l => l.id !== id),
      selectedLayerId: selectedLayerId === id ? null : selectedLayerId
    });
  },

  reorderLayerZ: (id, dir) => {
    const { layers } = get();
    const index = layers.findIndex(l => l.id === id);
    if (index === -1) return;
    if (dir === 'up' && index === layers.length - 1) return;
    if (dir === 'down' && index === 0) return;

    get().recordHistory();
    const updated = [...layers];
    const targetIdx = dir === 'up' ? index + 1 : index - 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    updated.forEach((l, i) => {
      l.zIndex = (i + 1) * 10;
    });

    set({ layers: updated });
  },

  bringToFront: (id) => {
    const { layers } = get();
    const target = layers.find(l => l.id === id);
    if (!target) return;
    get().recordHistory();

    const maxZ = Math.max(...layers.map(l => l.zIndex), 0) + 10;
    set({
      layers: layers.map(l => l.id === id ? { ...l, zIndex: maxZ } : l)
    });
  },

  sendToBack: (id) => {
    const { layers } = get();
    const target = layers.find(l => l.id === id);
    if (!target) return;
    get().recordHistory();

    const minZ = Math.max(1, Math.min(...layers.map(l => l.zIndex), 10) - 10);
    set({
      layers: layers.map(l => l.id === id ? { ...l, zIndex: minZ } : l)
    });
  },

  nudgeLayer: (id, dx, dy) => {
    const { layers } = get();
    set({
      layers: layers.map(l => l.id === id && !l.locked ? { ...l, x: l.x + dx, y: l.y + dy } : l),
      saveStatus: 'unsaved'
    });
  },

  alignLayers: (alignment) => {
    const { layers, selectedLayerId, canvasWidth, canvasHeight } = get();
    const target = layers.find(l => l.id === selectedLayerId);
    if (!target || target.locked) return;

    get().recordHistory();
    let newX = target.x;
    let newY = target.y;

    switch (alignment) {
      case 'left':
        newX = 40;
        break;
      case 'center':
        newX = Math.round((canvasWidth - target.width) / 2);
        break;
      case 'right':
        newX = canvasWidth - target.width - 40;
        break;
      case 'top':
        newY = 40;
        break;
      case 'middle':
        newY = Math.round((canvasHeight - target.height) / 2);
        break;
      case 'bottom':
        newY = canvasHeight - target.height - 40;
        break;
    }

    set({
      layers: layers.map(l => l.id === selectedLayerId ? { ...l, x: newX, y: newY } : l)
    });
  },

  copySelectedLayer: () => {
    const { layers, selectedLayerId } = get();
    const target = layers.find(l => l.id === selectedLayerId);
    if (target) {
      set({ clipboard: { ...target, settings: { ...target.settings } } });
    }
  },

  pasteLayer: () => {
    const { clipboard, layers } = get();
    if (!clipboard) return;
    get().recordHistory();

    const newId = `${clipboard.animationSlug}-${Date.now().toString(36)}`;
    const pasted: StudioLayer = {
      ...clipboard,
      id: newId,
      name: `${clipboard.name} (Pasted)`,
      x: clipboard.x + 20,
      y: clipboard.y + 20,
      zIndex: layers.length * 10 + 10,
      settings: { ...clipboard.settings }
    };

    set({
      layers: [...layers, pasted],
      selectedLayerId: newId
    });
  },

  openContextMenu: (x, y, layerId) => set({ contextMenu: { x, y, layerId }, selectedLayerId: layerId }),
  closeContextMenu: () => set({ contextMenu: null }),

  undo: () => {
    const { history, layers, future } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      layers: previous,
      future: [layers, ...future],
      history: history.slice(0, history.length - 1),
      saveStatus: 'unsaved'
    });
  },

  redo: () => {
    const { future, layers, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      layers: next,
      history: [...history, layers],
      future: future.slice(1),
      saveStatus: 'unsaved'
    });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlayback: () => set(state => ({ isPlaying: !state.isPlaying })),
  restart: () => set({ currentTime: 0, isPlaying: false }),
  seek: (currentTime) => set({ currentTime }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  toggleLoop: () => set(state => ({ isLooping: !state.isLooping })),

  saveProject: async () => {
    set({ saveStatus: 'saving' });
    const { documentId, projectTitle, mode, targetSelector, backgroundColor, canvasPreset, canvasWidth, canvasHeight, layers } = get();

    const payload = {
      title: projectTitle,
      mode,
      targetSelector,
      content: {
        canvasPreset,
        canvasWidth,
        canvasHeight,
        backgroundColor,
        layers
      }
    };

    try {
      if (documentId) {
        await ApiClient.fetch(`/editor/projects/${documentId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        const res = await ApiClient.fetch('/editor/projects', {
          method: 'POST',
          body: JSON.stringify(payload)
        }).catch(() => null);

        if (res?.id) {
          set({ documentId: res.id });
        }
      }

      set({
        saveStatus: 'saved',
        lastSavedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch {
      localStorage.setItem(`festiveui_studio_draft_${documentId || 'active'}`, JSON.stringify({
        ...payload,
        savedAt: new Date().toISOString()
      }));
      set({
        saveStatus: 'saved',
        lastSavedTime: 'Saved to local buffer'
      });
    }
  },

  loadTemplate: (templateId) => {
    get().recordHistory();
    if (templateId === 'tmpl-diwali-grand') {
      set({
        projectTitle: 'Diwali Grand Celebration',
        canvasWidth: 1280,
        canvasHeight: 720,
        backgroundColor: '#0B0F19',
        layers: [
          {
            id: 'diwali-diya',
            name: 'Center Diya Flame',
            animationSlug: 'diya-glow',
            animationType: 'diya-glow',
            visible: true,
            locked: false,
            x: 540,
            y: 260,
            width: 200,
            height: 200,
            rotation: 0,
            scale: 1,
            zIndex: 50,
            opacity: 1,
            blendMode: 'normal',
            speed: 1,
            loop: true,
            direction: 'normal',
            entranceEffect: 'fade-in',
            timelineStart: 0,
            timelineDuration: 10,
            settings: { glow: true, glowIntensity: 0.95, flickerSpeed: 1.2, flameSize: 110, flameColor: '#F97316' }
          },
          {
            id: 'diwali-pyro',
            name: 'Gold Fireworks Burst',
            animationSlug: 'diwali-fireworks',
            animationType: 'diwali-fireworks',
            visible: true,
            locked: false,
            x: 140,
            y: 80,
            width: 280,
            height: 280,
            rotation: 0,
            scale: 1,
            zIndex: 20,
            opacity: 0.9,
            blendMode: 'screen',
            speed: 1.2,
            loop: true,
            direction: 'normal',
            entranceEffect: 'scale-up',
            timelineStart: 0.5,
            timelineDuration: 9.5,
            settings: { particleCount: 260, explosionRadius: 220, gravity: 0.8, colorPalette: 'Gold & Crimson' }
          },
          {
            id: 'diwali-text',
            name: 'Happy Diwali Typography',
            animationSlug: 'custom-text',
            animationType: 'custom-text',
            isText: true,
            textContent: 'Happy Diwali',
            fontFamily: 'serif',
            fontSize: 60,
            fontWeight: '900',
            textColor: '#FCD34D',
            textGlow: '#F97316',
            visible: true,
            locked: false,
            x: 440,
            y: 500,
            width: 420,
            height: 90,
            rotation: 0,
            scale: 1,
            zIndex: 60,
            opacity: 1,
            blendMode: 'normal',
            speed: 1,
            loop: true,
            direction: 'normal',
            entranceEffect: 'scale-up',
            timelineStart: 1.0,
            timelineDuration: 9.0,
            settings: {}
          }
        ],
        selectedLayerId: 'diwali-diya'
      });
    }
  },

  setExportModalOpen: (exportModalOpen) => set({ exportModalOpen }),
  setPublishModalOpen: (publishModalOpen) => set({ publishModalOpen }),
  setPreviewModalOpen: (previewModalOpen) => set({ previewModalOpen })
}));
