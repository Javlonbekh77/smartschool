'use client';
import { STUDENTS as initialStudents, PAYMENTS as initialPayments } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar, DollarSign, TrendingUp, AlertCircle, History } from 'lucide-react';
import { format, addMonths, setDate } from 'date-fns';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Student, Payment } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function StudentProfilePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [students] = useLocalStorage<Student[]>('students', initialStudents);
  const [payments] = useLocalStorage<Payment[]>('payments', initialPayments);
  const [student, setStudent] = useState<Student | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const foundStudent = students.find((s) => s.id === id);
      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        notFound();
      }
    }
  }, [id, students, isMounted]);

  const studentPayments = payments
    .filter(p => p.studentId === id)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  if (!isMounted || !student) {
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
    <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
            <CardHeader className="items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback>{student.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-3xl">{student.fullName}</CardTitle>
                <CardDescription>
                {student.grade}-sinf o'quvchisi
                {student.isArchived && <Badge variant="outline" className="ml-2">Arxivlangan</Badge>}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
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
                <div className="flex items-center gap-4">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                    <div>
                    <p className="text-sm text-muted-foreground">Keyingi to'lov sanasi</p>
                    <p className="font-semibold">{format(paymentDeadline, 'PPP')}</p>
                    </div>
                </div>
                </div>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-6 w-6" />
                    To'lovlar Tarixi
                </CardTitle>
                 <CardDescription>
                    O'quvchining barcha to'lovlari tarixi.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sana</TableHead>
                                <TableHead>Summa</TableHead>
                                <TableHead>Izoh</TableHead>
                                <TableHead className="text-right">To'lovdan keyingi balans</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentPayments.length > 0 ? studentPayments.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell>{format(new Date(payment.date), 'PPP')}</TableCell>
                                    <TableCell className="font-semibold text-green-600">
                                        {payment.amount.toLocaleString()} so'm
                                    </TableCell>
                                    <TableCell>{payment.note || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={payment.balanceAfter < 0 ? "destructive" : "default"} className={payment.balanceAfter >= 0 ? "bg-green-600 text-white" : ""}>
                                            {payment.balanceAfter.toLocaleString()} so'm
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">To'lovlar mavjud emas.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
}
