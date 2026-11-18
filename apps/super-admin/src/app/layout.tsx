import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { AdminShell } from '@/components/layout/admin-shell';

export const metadata: Metadata = {
  title: 'FestiveUI – Super Admin Control Panel',
  description: 'Enterprise Dynamic RBAC and Administration Suite for FestiveUI platform owner'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-admin-950 text-admin-100 min-h-screen antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <AdminShell>{children}</AdminShell>
        </AuthProvider>
      </body>
    </html>
  );
}
