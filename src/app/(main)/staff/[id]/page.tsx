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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, CalendarCheck, CalendarDays } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { Staff, Attendance } from '@/lib/types';
import { format, getDaysInMonth, startOfMonth, getDate } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import useLocalStorage from '@/hooks/use-local-storage';

export default function StaffProfilePage() {
  const router = useRouter();
  const params = useParams();
  const staffId = typeof params.id === 'string' ? params.id : '';
  
  const [staffList] = useLocalStorage<Staff[]>('staff', initialStaff);
  const [attendance] = useLocalStorage<Attendance[]>('attendance', initialAttendance);
  const [isMounted, setIsMounted] = useState(false);
  const [staffMember, setStaffMember] = useState<Staff | undefined>(undefined);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const member = staffList.find(s => s.id === staffId);
      if (!member) {
        router.push('/staff');
      } else {
        setStaffMember(member);
      }
    }
  }, [staffId, staffList, router, isMounted]);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const memberAttendanceThisMonth = useMemo(() => attendance.filter(a => 
      a.staffId === staffMember?.id &&
      new Date(a.date).getMonth() === currentMonth &&
      new Date(a.date).getFullYear() === currentYear
  ), [attendance, staffMember?.id, currentMonth, currentYear]);

  const calculateSalary = () => {
    if (!staffMember) return 0;
    if (staffMember.position.type === 'monthly') {
        const hasWorked = attendance.some(a => a.staffId === staffMember.id && new Date(a.date).getUTCMonth() === today.getUTCMonth() && new Date(a.date).getUTCFullYear() === today.getUTCFullYear());
        return hasWorked ? staffMember.position.rate : 0;
    }
    if (staffMember.position.type === 'hourly') {
      const totalHours = memberAttendanceThisMonth.reduce((sum, h) => sum + h.hours, 0);
      return totalHours * staffMember.position.rate;
    }
    return 0;
  }
  
  const daysInMonth = getDaysInMonth(today);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const attendanceMap = new Map(memberAttendanceThisMonth.map(att => [getDate(new Date(att.date)), att.hours]));

  if (!isMounted || !staffMember) {
    return (
        <div className="flex justify-center items-center h-64">
            <p>Loading staff member...</p>
        </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
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
                        <CalendarDays className="h-5 w-5" />
                        Yo'qlama ({format(today, 'MMMM yyyy')})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                   <ScrollArea className="w-full">
                     <div className="overflow-x-auto">
                        <Table className="min-w-full w-max">
                            <TableHeader>
                                <TableRow>
                                    {monthDays.map(day => {
                                        const date = new Date(currentYear, currentMonth, day);
                                        return (
                                            <TableHead key={day} className="text-center p-2 min-w-[60px]">
                                                <div className="text-xs text-muted-foreground">{format(date, 'EEE')}</div>
                                                <div>{day}</div>
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               <TableRow>
                                    {monthDays.map(day => {
                                        const hours = attendanceMap.get(day);
                                        return (
                                            <TableCell key={day} className="text-center p-2">
                                                {hours !== undefined ? (
                                                    <Badge variant="default" className="bg-green-600 text-white w-8 h-8 flex items-center justify-center">
                                                        {hours}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableBody>
                        </Table>
                     </div>
                   </ScrollArea>
                </CardContent>
            </Card>
        )}

        {staffMember.workSchedule && (
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
                           {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
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
