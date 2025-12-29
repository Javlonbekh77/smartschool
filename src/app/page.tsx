'use client';
import { Button } from '@/components/ui/button';
import { School, ArrowRight, LayoutDashboard, DollarSign, Users, BrainCircuit, BarChart3, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/i18n';
import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                   <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                    {t('landing.tagline')}
                  </div>
                  <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl xl:text-6xl/none">
                    {t('landing.headline')}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
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
               <div className="relative rounded-xl bg-muted p-8 shadow-inner">
                  <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-4 p-4 opacity-10">
                      <BrainCircuit className="h-12 w-12 text-primary transform-gpu rotate-12" />
                      <Users className="h-10 w-10 text-accent col-start-4" />
                      <DollarSign className="h-12 w-12 text-primary row-start-3 col-start-3" />
                      <BarChart3 className="h-10 w-10 text-accent row-start-4" />
                      <Wallet className="h-14 w-14 text-primary row-start-5 col-start-5 transform-gpu -rotate-12" />
                      <LayoutDashboard className="h-10 w-10 text-accent row-start-2 col-start-5" />
                  </div>
                  <Card className="relative bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><BrainCircuit className="text-primary"/> {t('landing.aiCardTitle')}</CardTitle>
                        <CardDescription>{t('landing.aiCardDesc')}</CardDescription>
                    </CardHeader>
                  </Card>
               </div>
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
                            <LayoutDashboard className="h-6 w-6" />
                           </div>
                           <h3 className="text-xl font-bold font-headline">{t('landing.feature3Title')}</h3>
                        </div>
                        <p className="text-muted-foreground">{t('landing.feature3Desc')}</p>
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
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                    <div className="relative flex flex-col items-center text-center">
                        <div className="mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl ring-8 ring-background">1</div>
                        <h3 className="text-xl font-bold font-headline">{t('landing.step1Title')}</h3>
                        <p className="text-muted-foreground">{t('landing.step1Desc')}</p>
                    </div>
                     <div className="relative flex flex-col items-center text-center">
                        <div className="mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl ring-8 ring-background">2</div>
                        <h3 className="text-xl font-bold font-headline">{t('landing.step2Title')}</h3>
                        <p className="text-muted-foreground">{t('landing.step2Desc')}</p>
                    </div>
                     <div className="relative flex flex-col items-center text-center">
                        <div className="mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl ring-8 ring-background">3</div>
                        <h3 className="text-xl font-bold font-headline">{t('landing.step3Title')}</h3>
                        <p className="text-muted-foreground">{t('landing.step3Desc')}</p>
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
