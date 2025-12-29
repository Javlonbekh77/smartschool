'use client';
import { Button } from '@/components/ui/button';
import { School, ArrowRight, LayoutDashboard, DollarSign, Users, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/i18n';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
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
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4">
                 <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                  {t('landing.tagline')}
                </div>
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {t('landing.headline')}
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  {t('landing.subheadline')}
                </p>
              </div>
              <div className="space-y-2">
                <Button asChild size="lg">
                  <Link href="/login">
                    {t('landing.cta')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-12 mx-auto max-w-5xl">
                <Image
                    src="https://storage.googleapis.com/genkit-assets/images/bAsz2wN.jpeg"
                    alt="University Building"
                    width={1200}
                    height={600}
                    className="rounded-xl object-cover shadow-2xl"
                    data-ai-hint="university building architecture"
                />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">{t('landing.featuresTitle')}</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            {t('landing.featuresSubtitle')}
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-3">
                           <div className="bg-primary text-primary-foreground rounded-full p-3">
                            <Users className="h-6 w-6" />
                           </div>
                           <h3 className="text-xl font-bold font-headline">{t('landing.feature1Title')}</h3>
                        </div>
                        <p className="text-muted-foreground">{t('landing.feature1Desc')}</p>
                    </div>
                     <div className="grid gap-2">
                        <div className="flex items-center gap-3">
                           <div className="bg-primary text-primary-foreground rounded-full p-3">
                            <DollarSign className="h-6 w-6" />
                           </div>
                           <h3 className="text-xl font-bold font-headline">{t('landing.feature2Title')}</h3>
                        </div>
                        <p className="text-muted-foreground">{t('landing.feature2Desc')}</p>
                    </div>
                     <div className="grid gap-2">
                        <div className="flex items-center gap-3">
                           <div className="bg-primary text-primary-foreground rounded-full p-3">
                            <BrainCircuit className="h-6 w-6" />
                           </div>
                           <h3 className="text-xl font-bold font-headline">{t('landing.feature3Title')}</h3>
                        </div>
                        <p className="text-muted-foreground">{t('landing.aiCardDesc')}</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">{t('landing.howItWorksTitle')}</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            {t('landing.howItWorksSubtitle')}
                        </p>
                    </div>
                </div>
                <div className="relative grid gap-10 sm:grid-cols-3">
                    <div className="absolute top-6 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden sm:block"></div>
                    <div className="relative flex flex-col items-center text-center">
                        <div className="mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl ring-8 ring-background z-10">1</div>
                        <h3 className="text-xl font-bold font-headline">{t('landing.step1Title')}</h3>
                        <p className="text-muted-foreground">{t('landing.step1Desc')}</p>
                    </div>
                     <div className="relative flex flex-col items-center text-center">
                        <div className="mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl ring-8 ring-background z-10">2</div>
                        <h3 className="text-xl font-bold font-headline">{t('landing.step2Title')}</h3>
                        <p className="text-muted-foreground">{t('landing.step2Desc')}</p>
                    </div>
                     <div className="relative flex flex-col items-center text-center">
                        <div className="mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl ring-8 ring-background z-10">3</div>
                        <h3 className="text-xl font-bold font-headline">{t('landing.step3Title')}</h3>
                        <p className="text-muted-foreground">{t('landing.step3Desc')}</p>
                    </div>
                </div>
            </div>
        </section>

      </main>
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col items-center text-center">
                 <Link href="/" className="flex items-center justify-center">
                    <School className="h-8 w-8 text-primary" />
                    <span className="ml-3 font-semibold font-headline text-2xl">
                        {t('landing.title')}
                    </span>
                </Link>
                <p className="max-w-md mx-auto mt-4 text-gray-400">
                    {t('landing.subheadline')}
                </p>
                <div className="flex justify-center mt-6">
                     <Button asChild variant="secondary">
                        <Link href="/login">
                            {t('landing.cta')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
            <hr className="h-px my-8 bg-gray-700 border-none" />
            <div className="text-center text-gray-400">
                <p>© {new Date().getFullYear()} {t('landing.title')}. {t('landing.rights')}</p>
            </div>
        </div>
    </footer>
    </div>
  );
}
