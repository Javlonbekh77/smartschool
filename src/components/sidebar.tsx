
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

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useI18n } from '@/context/i18n';
import { useAuth } from '@/context/auth';

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
]

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <School className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Smart School</span>
        </Link>
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    pathname.startsWith(item.href) &&
                      'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{t(item.labelKey)}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
            </Tooltip>
          ))}
           {user?.role === 'admin' && user.username === 'Admin' && adminNavItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    pathname.startsWith(item.href) && 'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{t(item.labelKey)}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
            {secondaryNavItems.map((item) => (
                <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                    <Link
                    href={item.href}
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                        pathname.startsWith(item.href) &&
                        'bg-accent text-accent-foreground'
                    )}
                    >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{t(item.labelKey)}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
                </Tooltip>
            ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
