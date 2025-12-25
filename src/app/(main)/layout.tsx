'use client';

import { MainSidebar } from '@/components/main-sidebar';
import { Header } from '@/components/header';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);
  
  if (!user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div>Yuklanmoqda...</div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <MainSidebar userRole={user.role} username={user.username} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 group-data-[state=expanded]:sm:pl-64 transition-[padding]">
          <Header />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <SidebarInset>{children}</SidebarInset>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
