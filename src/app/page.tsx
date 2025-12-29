'use client';
import { Button } from '@/components/ui/button';
import { School, ArrowRight, LayoutDashboard, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/i18n';
import Image from 'next/image';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center">
          <School className="h-6 w-6 text-primary" />
          <span className="ml-3 font-semibold font-headline text-xl">
            {t('landing.title')}
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
           <Button asChild size="lg" className="hidden sm:flex">
              <Link href="/login">
                {t('landing.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-1">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="space-y-4">
                   <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                    {t('landing.tagline')}
                  </div>
                  <h1 className="text-5xl font-bold font-headline tracking-tighter sm:text-6xl xl:text-7xl/none">
                    {t('landing.headline')}
                  </h1>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    {t('landing.subheadline')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">
                      {t('landing.cta')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
               <Image
                src="https://picsum.photos/seed/classroom/1200/500"
                width="1200"
                height="500"
                alt="Hero"
                className="mx-auto aspect-[16/7] overflow-hidden rounded-xl object-cover"
                data-ai-hint="classroom students"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">{t('landing.featuresTitle')}</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            {t('landing.featuresSubtitle')}
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                    <div className="grid gap-1 text-center">
                         <div className="flex justify-center items-center mb-4">
                           <div className="bg-primary text-primary-foreground rounded-full p-4">
                            <Users className="h-8 w-8" />
                           </div>
                        </div>
                        <h3 className="text-xl font-bold font-headline">{t('landing.feature1Title')}</h3>
                        <p className="text-muted-foreground">{t('landing.feature1Desc')}</p>
                    </div>
                     <div className="grid gap-1 text-center">
                         <div className="flex justify-center items-center mb-4">
                           <div className="bg-primary text-primary-foreground rounded-full p-4">
                            <DollarSign className="h-8 w-8" />
                           </div>
                        </div>
                        <h3 className="text-xl font-bold font-headline">{t('landing.feature2Title')}</h3>
                        <p className="text-muted-foreground">{t('landing.feature2Desc')}</p>
                    </div>
                     <div className="grid gap-1 text-center">
                         <div className="flex justify-center items-center mb-4">
                           <div className="bg-primary text-primary-foreground rounded-full p-4">
                            <LayoutDashboard className="h-8 w-8" />
                           </div>
                        </div>
                        <h3 className="text-xl font-bold font-headline">{t('landing.feature3Title')}</h3>
                        <p className="text-muted-foreground">{t('landing.feature3Desc')}</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <footer className="flex items-center justify-center p-6 border-t">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t('landing.title')}. {t('landing.rights')}
        </p>
      </footer>
    </div>
  );
}
