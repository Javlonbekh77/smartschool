'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GraduationCap,
  ClipboardList,
  Wallet,
  FileText,
  School,
  BarChart3,
  Settings,
  Users as UsersIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useI18n } from '@/context/i18n';
import type { UserRole } from '@/lib/types';

interface MainSidebarProps {
  userRole?: UserRole;
  username?: string;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
  { href: '/students', icon: GraduationCap, labelKey: 'sidebar.students' },
  { href: '/staff', icon: Users, labelKey: 'sidebar.staff' },
  { href: '/grades', icon: BarChart3, labelKey: 'sidebar.grades' },
  { href: '/positions', icon: Briefcase, labelKey: 'sidebar.positions' },
  { href: '/tests', icon: ClipboardList, labelKey: 'sidebar.tests' },
  { href: '/expenses', icon: Wallet, labelKey: 'sidebar.expenses' },
  { href: '/reports', icon: FileText, labelKey: 'sidebar.reports' },
];

const adminNavItems = [
    { href: '/users', icon: UsersIcon, labelKey: 'sidebar.users' },
];

const secondaryNavItems = [
    { href: '/settings', icon: Settings, labelKey: 'sidebar.settings' },
];

export function MainSidebar({ userRole, username }: MainSidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <School className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Smart School</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    icon={<item.icon />}
                    tooltip={{
                      children: t(item.labelKey),
                    }}
                  >
                    <span>{t(item.labelKey)}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
             {userRole === 'admin' && username === 'Admin' && adminNavItems.map((item) => (
               <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    icon={<item.icon />}
                    tooltip={{
                      children: t(item.labelKey),
                    }}
                  >
                    <span>{t(item.labelKey)}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarSeparator />
            <SidebarMenu>
                {secondaryNavItems.map((item) => (
                     <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            icon={<item.icon />}
                            tooltip={{
                            children: t(item.labelKey),
                            }}
                        >
                            <span>{t(item.labelKey)}</span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}
