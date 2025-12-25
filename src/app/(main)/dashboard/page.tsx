'use client';
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

export default function DashboardPage() {
  const [students] = useLocalStorage<Student[]>('students', initialStudents);
  const [staff] = useLocalStorage<Staff[]>('staff', initialStaff);
  const [expenses] = useLocalStorage<Expense[]>('expenses', initialExpenses);

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
          title="Total Active Students"
          value={totalStudents.toString()}
          icon={GraduationCap}
        />
        <SummaryCard
          title="Total Staff Members"
          value={totalStaff.toString()}
          icon={Users}
        />
        <SummaryCard
          title="Current Month Revenue"
          value={`${currentMonthRevenue.toLocaleString()} so'm`}
          icon={TrendingUp}
          description="Based on active student fees"
        />
        <SummaryCard
          title="Current Month Expenses"
          value={`${currentMonthExpenses.toLocaleString()} so'm`}
          icon={TrendingDown}
          description="Total for this month"
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
