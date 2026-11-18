'use client';

import React from 'react';
import { StudioToolbar } from './StudioToolbar';
import { LeftSidebar } from './LeftSidebar';
import { CanvasWorkspace } from './CanvasWorkspace';
import { PropertiesInspector } from './PropertiesInspector';
import { TimelineEditor } from './TimelineEditor';
import { ContextMenu } from './ContextMenu';
import { ExportModal } from './ExportModal';
import { PublishModal } from './PublishModal';
import { PreviewModal } from './PreviewModal';

export const StudioLayout: React.FC = () => {
  return (
    <div
      style={{ height: '100dvh' }}
      className="w-full flex flex-col bg-[#0B0F19] text-slate-100 overflow-hidden select-none antialiased"
    >
      {/* 1. TOP TOOLBAR (64px) */}
      <StudioToolbar />

      {/* 2. MAIN MIDDLE SECTION (LEFT SIDEBAR + EXPANSIVE CANVAS + PROPERTIES INSPECTOR) */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        <LeftSidebar />
        <CanvasWorkspace />
        <PropertiesInspector />
      </div>

      {/* 3. BOTTOM TIMELINE EDITOR (RESIZABLE & COLLAPSIBLE) */}
      <TimelineEditor />

      {/* 4. MODALS & OVERLAYS */}
      <ContextMenu />
      <ExportModal />
      <PublishModal />
      <PreviewModal />
    </div>
  );
};
