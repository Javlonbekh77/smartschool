'use client';
import { STUDENTS as initialStudents } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { format, addMonths, setDate } from 'date-fns';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Student } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function StudentProfilePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [students] = useLocalStorage<Student[]>('students', initialStudents);
  const [student, setStudent] = useState<Student | undefined>(undefined);

  useEffect(() => {
    const foundStudent = students.find((s) => s.id === id);
    if (foundStudent) {
      setStudent(foundStudent);
    } else {
      notFound();
    }
  }, [id, students]);


  if (!student) {
    return null; // or a loading spinner
  }

  const getPaymentDeadline = () => {
    const today = new Date();
    const enrollmentDate = new Date(student.enrollmentDate);

    if (student.paymentType === 'anniversary') {
        let deadline = addMonths(enrollmentDate, 1);
        while (deadline < today) {
            deadline = addMonths(deadline, 1);
        }
        return deadline;
    } else { // monthly
        let deadline = setDate(today, 1);
        if (deadline < today) {
            deadline = addMonths(deadline, 1);
        }
        return deadline;
    }
  }

  const paymentDeadline = getPaymentDeadline();

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={student.avatarUrl} alt={student.fullName} />
          <AvatarFallback>{student.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-3xl">{student.fullName}</CardTitle>
        <CardDescription>
          {student.grade}-sinf o'quvchisi
          {student.isArchived && <Badge variant="outline" className="ml-2">Arxivlangan</Badge>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <GraduationCap className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Sinf</p>
              <p className="font-semibold">{student.grade}-sinf</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Ro'yxatdan o'tgan sana</p>
              <p className="font-semibold">{format(new Date(student.enrollmentDate), 'PPP')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DollarSign className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Balans</p>
              <Badge variant={student.balance < 0 ? "destructive" : "default"} className={student.balance > 0 ? "bg-green-600 text-white" : ""}>
                {student.balance.toLocaleString()} so'm
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Oylik to'lov</p>
              <p className="font-semibold">{student.monthlyFee.toLocaleString()} so'm</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:col-span-2">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Keyingi to'lov sanasi</p>
              <p className="font-semibold">{format(paymentDeadline, 'PPP')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
