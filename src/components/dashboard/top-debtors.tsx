'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { STUDENTS as initialStudents } from '@/lib/data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Student } from '@/lib/types';

export function TopDebtors() {
  const [students] = useLocalStorage<Student[]>('students', initialStudents);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Top Debtors</CardTitle>
          <CardDescription>Students with the largest outstanding balances.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const debtors = students
    .filter(s => s.balance < 0)
    .sort((a, b) => a.balance - b.balance)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Top Debtors</CardTitle>
        <CardDescription>Students with the largest outstanding balances.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debtors.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{student.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{student.fullName}</div>
                  </div>
                </TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="destructive">
                    {student.balance.toLocaleString()} so'm
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
