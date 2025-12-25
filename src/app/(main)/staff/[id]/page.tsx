'use client';
import { STAFF as initialStaff, ATTENDANCE as initialAttendance } from '@/lib/data';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, Clock, CalendarCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Staff, Attendance } from '@/lib/types';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const findStaffMember = (id: string, staffList: Staff[]) => staffList.find(s => s.id === id);

export default function StaffProfilePage() {
  const router = useRouter();
  const params = useParams();
  const staffId = typeof params.id === 'string' ? params.id : '';
  
  const [staffList, setStaffList] = useState(initialStaff);
  const [attendance, setAttendance] = useState(initialAttendance);
  const staffMember = findStaffMember(staffId, staffList);

  useEffect(() => {
    if (!staffMember) {
      router.push('/staff');
    }
  }, [staffMember, router]);

  if (!staffMember) {
    return null;
  }
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const memberAttendanceThisMonth = attendance.filter(a => 
      a.staffId === staffMember.id &&
      new Date(a.date).getMonth() === currentMonth &&
      new Date(a.date).getFullYear() === currentYear
  ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const calculateSalary = () => {
    if (staffMember.position.type === 'monthly') {
      return memberAttendanceThisMonth.length > 0 ? staffMember.position.rate : 0;
    }
    if (staffMember.position.type === 'hourly') {
      const totalHours = memberAttendanceThisMonth.reduce((sum, h) => sum + h.hours, 0);
      return totalHours * staffMember.position.rate;
    }
    return 0;
  }

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={staffMember.avatarUrl} alt={staffMember.fullName} />
          <AvatarFallback>{staffMember.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-3xl">{staffMember.fullName}</CardTitle>
        <CardDescription>{staffMember.position.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Briefcase className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Kasbi</p>
              <p className="font-semibold">{staffMember.position.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="capitalize text-sm">{staffMember.position.type}</Badge>
            <div>
              <p className="text-sm text-muted-foreground">To'lov turi</p>
              <p className="font-semibold">
                {staffMember.position.rate.toLocaleString()}
                {staffMember.position.type === 'hourly' && ' so\'m / soat'}
                {staffMember.position.type === 'monthly' && ' so\'m / oy'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:col-span-2">
            <DollarSign className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Hisoblangan oylik ({format(today, 'MMMM')})</p>
              <p className="font-semibold">{calculateSalary()?.toLocaleString()} so'm</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="space-y-6">
        {staffMember.position.type === 'hourly' && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5" />
                        Ishlagan soatlar ({format(today, 'MMMM yyyy')})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-48">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Sana</TableHead>
                                <TableHead className="text-right">Soat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memberAttendanceThisMonth.length > 0 ? (
                                    memberAttendanceThisMonth.map(att => (
                                        <TableRow key={att.id}>
                                            <TableCell>{format(new Date(att.date), 'PPP')}</TableCell>
                                            <TableCell className="text-right font-bold">{att.hours} soat</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                                            Bu oy uchun yo'qlama mavjud emas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        )}

        {staffMember.position.type === 'hourly' && staffMember.workSchedule && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CalendarCheck className="h-5 w-5" />
                        Haftalik ish jadvali
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Hafta kuni</TableHead>
                            <TableHead className="text-right">Ish soati</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {weekDays.map(day => {
                                const schedule = staffMember.workSchedule?.find(ws => ws.day === day);
                                return (
                                    <TableRow key={day} className={!schedule?.isWorkingDay ? 'text-muted-foreground' : ''}>
                                        <TableCell>{day}</TableCell>
                                        <TableCell className="text-right font-bold">
                                            {schedule?.isWorkingDay ? `${schedule.hours} soat` : "Dam olish kuni"}
                                        </TableCell>
                                    </TableRow>
                                )
                           })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}
    </div>
    </div>
  );
}
