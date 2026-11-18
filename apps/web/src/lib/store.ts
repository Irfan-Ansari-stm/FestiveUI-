import { create } from 'zustand';
import { EditorLayer, AnimationConfig } from '@festiveui/types';

export interface StudioState {
  documentId: string | null;
  title: string;
  mode: 'canvas' | 'website';
  targetSelector: string;
  backgroundColor: string;
  zoom: number;
  viewport: 'desktop' | 'tablet' | 'mobile';
  layers: EditorLayer[];
  selectedLayerId: string | null;
  history: EditorLayer[][];
  future: EditorLayer[][];
  isSaving: boolean;
  lastSavedAt: Date | null;

  // Actions
  setTitle: (title: string) => void;
  setMode: (mode: 'canvas' | 'website') => void;
  setTargetSelector: (selector: string) => void;
  setBackgroundColor: (color: string) => void;
  setZoom: (zoom: number) => void;
  setViewport: (vp: 'desktop' | 'tablet' | 'mobile') => void;
  selectLayer: (id: string | null) => void;
  addLayer: (layer: EditorLayer) => void;
  updateLayerConfig: (id: string, config: Partial<AnimationConfig>) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  undo: () => void;
  redo: () => void;
  setLayers: (layers: EditorLayer[]) => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  documentId: null,
  title: 'Untitled Festive Canvas',
  mode: 'canvas',
  targetSelector: '#hero',
  backgroundColor: '#0F172A',
  zoom: 1,
  viewport: 'desktop',
  layers: [
    {
      id: 'default-diya',
      name: 'Glowing Diya Lamp',
      animationSlug: 'diya-glow',
      animationType: 'diya-glow',
      visible: true,
      locked: false,
      config: {
        type: 'diya-glow',
        position: 'center',
        size: 90,
        opacity: 1,
        zIndex: 50,
        settings: { glow: true, glowIntensity: 0.85, flickerSpeed: 1.0 }
      }
    }
  ],
  selectedLayerId: 'default-diya',
  history: [],
  future: [],
  isSaving: false,
  lastSavedAt: null,

  setTitle: (title) => set({ title }),
  setMode: (mode) => set({ mode }),
  setTargetSelector: (targetSelector) => set({ targetSelector }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(zoom, 2.5)) }),
  setViewport: (viewport) => set({ viewport }),
  selectLayer: (selectedLayerId) => set({ selectedLayerId }),

  addLayer: (layer) => {
    const { layers, history } = get();
    set({
      history: [...history, layers],
      future: [],
      layers: [...layers, layer],
      selectedLayerId: layer.id
    });
  },

  updateLayerConfig: (id, config) => {
    const { layers, history } = get();
    const updatedLayers = layers.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          config: {
            ...l.config,
            ...config,
            settings: {
              ...(l.config.settings || {}),
              ...(config.settings || {})
            }
          }
        };
      }
      return l;
    });

    set({
      history: [...history, layers],
      future: [],
      layers: updatedLayers
    });
  },

  toggleLayerVisibility: (id) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    }));
  },

  toggleLayerLock: (id) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l))
    }));
  },

  deleteLayer: (id) => {
    const { layers, history, selectedLayerId } = get();
    set({
      history: [...history, layers],
      future: [],
      layers: layers.filter((l) => l.id !== id),
      selectedLayerId: selectedLayerId === id ? null : selectedLayerId
    });
  },

  duplicateLayer: (id) => {
    const { layers, history } = get();
    const target = layers.find((l) => l.id === id);
    if (!target) return;

    const cloned: EditorLayer = {
      ...target,
      id: `${target.animationType}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${target.name} (Copy)`,
      config: {
        ...target.config,
        x: (target.config.x || 0) + 20,
        y: (target.config.y || 0) + 20
      }
    };

    set({
      history: [...history, layers],
      future: [],
      layers: [...layers, cloned],
      selectedLayerId: cloned.id
    });
  },

  reorderLayers: (fromIndex, toIndex) => {
    const { layers, history } = get();
    const newLayers = [...layers];
    const [moved] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, moved);

    set({
      history: [...history, layers],
      future: [],
      layers: newLayers
    });
  },

  undo: () => {
    const { history, layers, future } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      history: history.slice(0, -1),
      future: [layers, ...future],
      layers: prev
    });
  },

  redo: () => {
    const { future, layers, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      future: future.slice(1),
      history: [...history, layers],
      layers: next
    });
  },

  setLayers: (layers) => set({ layers })
}));
