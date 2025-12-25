'use client';

import { MainSidebar } from '@/components/main-sidebar';
import { Header } from '@/components/header';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <MainSidebar userRole={user.role} username={user.username} isOpen={sidebarOpen} />
        <div className={`flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 ${sidebarOpen ? 'sm:pl-64' : 'sm:pl-14'}`}>
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
  );
}
