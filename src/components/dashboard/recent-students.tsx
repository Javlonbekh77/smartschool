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
import Link from 'next/link';

export function RecentStudents() {
  const [students] = useLocalStorage<Student[]>('students', initialStudents);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Yangi o'quvchilar</CardTitle>
          <CardDescription>Yaqinda qo'shilgan 5 ta o'quvchi.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Yuklanmoqda...</p>
        </CardContent>
      </Card>
    );
  }

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Yangi o'quvchilar</CardTitle>
        <CardDescription>Yaqinda qo'shilgan 5 ta o'quvchi.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>O'quvchi</TableHead>
              <TableHead>Sinf</TableHead>
              <TableHead className="text-right">Balans</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Link href={`/students/${student.id}`} className="flex items-center gap-3 hover:underline">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{student.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{student.fullName}</div>
                  </Link>
                </TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={student.balance < 0 ? 'destructive' : 'default'} className={student.balance > 0 ? "bg-green-600 text-white" : ""}>
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
