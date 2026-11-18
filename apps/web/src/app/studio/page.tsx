'use client';

import React, { useEffect } from 'react';
import { StudioLayout } from '@/components/studio/StudioLayout';
import { useStudioStore } from '@/components/studio/studio-store';

export default function StudioPage() {
  const store = useStudioStore();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting while user is typing in form controls
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        store.undo();
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      else if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        store.redo();
      }
      // Save: Ctrl+S or Cmd+S
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        store.saveProject();
      }
      // Duplicate: Ctrl+D or Cmd+D
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (store.selectedLayerId) {
          store.duplicateLayer(store.selectedLayerId);
        }
      }
      // Copy: Ctrl+C
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (store.selectedLayerId) {
          store.copySelectedLayer();
        }
      }
      // Paste: Ctrl+V
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        store.pasteLayer();
      }
      // Delete: Delete or Backspace
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (store.selectedLayerId) {
          e.preventDefault();
          store.deleteLayer(store.selectedLayerId);
        }
      }
      // Nudge with arrow keys
      else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (store.selectedLayerId) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
          const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
          store.nudgeLayer(store.selectedLayerId, dx, dy);
        }
      }
      // Space: Toggle timeline playback
      else if (e.code === 'Space') {
        e.preventDefault();
        store.togglePlayback();
      }
      // Escape: Deselect element & close context menu
      else if (e.key === 'Escape') {
        store.selectLayer(null);
        store.closeContextMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);

  return <StudioLayout />;
}
