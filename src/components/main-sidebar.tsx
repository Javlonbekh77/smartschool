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
  History,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useI18n } from '@/context/i18n';
import type { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MainSidebarProps {
  userRole?: UserRole;
  username?: string;
  isOpen: boolean;
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
  { href: '/last-actions', icon: History, labelKey: 'sidebar.lastActions' },
];

const adminNavItems = [
    { href: '/users', icon: UsersIcon, labelKey: 'sidebar.users' },
];

const secondaryNavItems = [
    { href: '/settings', icon: Settings, labelKey: 'sidebar.settings' },
];

export function MainSidebar({ userRole, username, isOpen }: MainSidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  const renderNavItem = (item: typeof navItems[0]) => {
    const isActive = pathname.startsWith(item.href);
    const linkContent = (
        <>
            <item.icon className="h-5 w-5" />
            <span className={cn("truncate transition-opacity", isOpen ? "opacity-100" : "opacity-0")}>{t(item.labelKey)}</span>
        </>
    );

    return (
        <li key={item.href}>
        {isOpen ? (
             <Link
                href={item.href}
                className={cn(
                    'flex h-9 items-center gap-4 rounded-lg px-3 text-muted-foreground transition-colors hover:text-foreground',
                    isActive && 'bg-accent text-accent-foreground'
                )}
                >
                {linkContent}
            </Link>
        ) : (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Link
                            href={item.href}
                            className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                                isActive && 'bg-accent text-accent-foreground'
                            )}
                            >
                            <item.icon className="h-5 w-5" />
                            <span className="sr-only">{t(item.labelKey)}</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )}
        </li>
    );
  }

  return (
    <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-all duration-300",
        isOpen ? "w-64" : "w-14"
    )}>
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
            <Link
              href="/"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <School className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">{t('landing.title')}</span>
            </Link>
        </nav>
        <div className="flex-1 overflow-auto">
             <ul className="grid gap-1 p-2">
                {navItems.map(renderNavItem)}
                {userRole === 'admin' && username === 'Admin' && adminNavItems.map(renderNavItem)}
             </ul>
        </div>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
            <ul className="grid gap-1 p-2">
                {secondaryNavItems.map(renderNavItem)}
            </ul>
        </nav>
    </aside>
  );
}
