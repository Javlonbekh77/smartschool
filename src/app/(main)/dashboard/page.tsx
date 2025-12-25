'use client';
import { useState, useEffect } from 'react';
import {
  DollarSign,
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import { SummaryCard } from '@/components/dashboard/summary-card';
import { FinancialChart } from '@/components/dashboard/financial-chart';
import { TopDebtors } from '@/components/dashboard/top-debtors';
import { STUDENTS as initialStudents, STAFF as initialStaff, EXPENSES as initialExpenses } from '@/lib/data';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Student, Staff, Expense } from '@/lib/types';
import { useI18n } from '@/context/i18n';

export default function DashboardPage() {
  const { t } = useI18n();
  const [students, setStudents] = useLocalStorage<Student[]>('students', initialStudents);
  const [staff, setStaff] = useLocalStorage<Staff[]>('staff', initialStaff);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', initialExpenses);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
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
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
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
    </div>
  );
}
