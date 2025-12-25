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
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Bosh sahifa' },
  { href: '/students', icon: GraduationCap, label: "O'quvchilar" },
  { href: '/staff', icon: Users, label: 'Xodimlar' },
  { href: '/grades', icon: BarChart3, label: 'Sinflar' },
  { href: '/positions', icon: Briefcase, label: 'Kasblar' },
  { href: '/tests', icon: ClipboardList, label: 'Test natijalari' },
  { href: '/expenses', icon: Wallet, label: 'Xarajatlar' },
  { href: '/reports', icon: FileText, label: 'Hisobotlar' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const currentPage =
    navItems.find((item) => pathname.startsWith(item.href))?.label ||
    'Smart School Manager';
  
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
                {item.label}
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
      <div className="ml-auto flex items-center gap-4">
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
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
