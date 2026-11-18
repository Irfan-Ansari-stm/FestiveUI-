'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Studio, Developer Dashboard, and Admin must NOT have marketing website header or footer
  const isDedicatedApp =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/studio') ||
    pathname?.startsWith('/admin');

  if (isDedicatedApp) {
    return <div className="w-full min-h-screen flex flex-col bg-slate-950">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </>
  );
}
