'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { STUDENTS as initialStudents } from '@/lib/data';
import { BarChart, TrendingUp, TrendingDown, Users } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Student } from '@/lib/types';

export default function GradesPage() {
  const [students] = useLocalStorage<Student[]>('students', initialStudents);

  const gradesData = students.reduce((acc, student) => {
    if (student.isArchived) return acc;

    if (!acc[student.grade]) {
      acc[student.grade] = {
        grade: student.grade,
        studentCount: 0,
        totalRevenue: 0,
        totalBalance: 0,
      };
    }

    acc[student.grade].studentCount++;
    acc[student.grade].totalRevenue += student.monthlyFee;
    acc[student.grade].totalBalance += student.balance;

    return acc;
  }, {} as Record<number, { grade: number; studentCount: number; totalRevenue: number; totalBalance: number; }>);

  const sortedGrades = Object.values(gradesData).sort((a, b) => a.grade - b.grade);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Sinflar</CardTitle>
          <CardDescription>
            Sinflar bo'yicha moliyaviy va o'quvchilar soni haqida ma'lumot.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedGrades.map((gradeInfo) => (
          <Card key={gradeInfo.grade}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-headline">
                {gradeInfo.grade}-sinf
              </CardTitle>
              <BarChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">O'quvchilar soni</p>
                    <p className="font-bold">{gradeInfo.studentCount} nafar</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-3 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Oylik daromad</p>
                    <p className="font-bold">{gradeInfo.totalRevenue.toLocaleString()} so'm</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-3 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Umumiy qarzdorlik</p>
                    <p className="font-bold text-red-500">{gradeInfo.totalBalance.toLocaleString()} so'm</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
