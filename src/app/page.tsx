import { Button } from '@/components/ui/button';
import { School, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center">
          <School className="h-6 w-6" />
          <span className="ml-2 font-semibold font-headline">
            Smart School Manager
          </span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Maktabingizni oson va samarali boshqaring
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Smart School Manager o'quvchilar, xodimlar, to'lovlar va
                    barchasini bir joyda kuzatib borish uchun yagona platforma.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Boshqaruv paneliga o'tish
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://picsum.photos/seed/school/600/400"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="school building"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center p-4 border-t">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Smart School Manager. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
