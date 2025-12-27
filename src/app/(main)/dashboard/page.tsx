'use client';
import { useState, useEffect } from 'react';
import {
  DollarSign,
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';

import { SummaryCard } from '@/components/dashboard/summary-card';
import { FinancialChart } from '@/components/dashboard/financial-chart';
import { TopDebtors } from '@/components/dashboard/top-debtors';
import { STUDENTS as initialStudents, STAFF as initialStaff, EXPENSES as initialExpenses } from '@/lib/data';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Student, Staff, Expense } from '@/lib/types';
import { useI18n } from '@/context/i18n';
import { useAuth } from '@/context/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentStudents } from '@/components/dashboard/recent-students';

export default function DashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [students, setStudents] = useLocalStorage<Student[]>('students', initialStudents);
  const [staff, setStaff] = useLocalStorage<Staff[]>('staff', initialStaff);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', initialExpenses);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
        <div className="flex items-center justify-center h-full">
            <div>{t('common.loading')}</div>
        </div>
    );
  }

  const totalStudents = students.filter(s => !s.isArchived).length;
  const totalStaff = staff.length;

  const currentMonthRevenue = students
    .filter(s => !s.isArchived)
    .reduce((acc, student) => acc + student.monthlyFee, 0);

  const currentMonthExpenses = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight font-headline">
                {t('sidebar.dashboard')}
            </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">
                    <Activity className="mr-2 h-4 w-4" />
                    Umumiy ko'rinish
                </TabsTrigger>
                <TabsTrigger value="analytics" disabled>
                    Tahlil
                </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title={t('dashboard.totalActiveStudents')}
                        value={totalStudents.toString()}
                        icon={GraduationCap}
                    />
                    <SummaryCard
                        title={t('dashboard.totalStaffMembers')}
                        value={totalStaff.toString()}
                        icon={Users}
                    />
                    <SummaryCard
                        title={t('dashboard.currentMonthRevenue')}
                        value={`${currentMonthRevenue.toLocaleString()} so'm`}
                        icon={TrendingUp}
                        description={t('dashboard.currentMonthRevenueDesc')}
                    />
                    <SummaryCard
                        title={t('dashboard.currentMonthExpenses')}
                        value={`${currentMonthExpenses.toLocaleString()} so'm`}
                        icon={TrendingDown}
                        description={t('dashboard.currentMonthExpensesDesc')}
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="lg:col-span-4">
                        <FinancialChart />
                    </div>
                    <div className="lg:col-span-3">
                        <TopDebtors />
                    </div>
                </div>
                 <div className="grid gap-4">
                    <RecentStudents />
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
