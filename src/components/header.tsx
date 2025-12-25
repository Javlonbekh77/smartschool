'use client';
import Link from 'next/link';
import {
  PanelLeft,
  School,
  LayoutDashboard,
  Users,
  Briefcase,
  GraduationCap,
  ClipboardList,
  Wallet,
  FileText,
  BarChart3,
  ArrowLeft,
  Languages,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useI18n } from '@/context/i18n';

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

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useI18n();

  const currentPageLabelKey =
    navItems.find((item) => pathname.startsWith(item.href))?.labelKey || 'Smart School Manager';
  
  const currentPage = t(currentPageLabelKey);
  
  const isSubPage = navItems.some(item => pathname.startsWith(item.href) && pathname !== item.href);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <School className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Smart School</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                  pathname.startsWith(item.href) && 'text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        {isSubPage && (
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        <h1 className="font-headline text-xl">{currentPage}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('header.language')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as 'uz' | 'ru' | 'en')}>
              <DropdownMenuRadioItem value="uz">O'zbekcha</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ru">Русский</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Image
                src="https://picsum.photos/seed/admin/36/36"
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full"
                data-ai-hint="professional portrait"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('header.myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('header.settings')}</DropdownMenuItem>
            <DropdownMenuItem>{t('header.support')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('header.logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
