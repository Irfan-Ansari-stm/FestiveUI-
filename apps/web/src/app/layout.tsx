import './globals.css';
import { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'FestiveUI — Festival & Event UI Animation Library, Visual Studio & Marketplace',
  description: 'Integrate ready-made festival decorations, animations, and particle effects into React, Next.js, Vue, Angular, and Vanilla JS websites. Visually customize with FestiveUI Studio.',
  keywords: ['animation', 'festival', 'diwali', 'christmas', 'new-year', 'holi', 'react', 'nextjs', 'canvas', 'svg', 'ui components']
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-slate-100 antialiased selection:bg-primary-500/30 selection:text-primary-200">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
