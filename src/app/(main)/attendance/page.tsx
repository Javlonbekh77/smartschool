'use client';
import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { STAFF, ATTENDANCE as initialAttendance } from '@/lib/data';
import type { Staff, Attendance } from '@/lib/types';
import { AddAttendanceDialog } from '@/components/dialogs/add-attendance-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddAttendance = (
    records: { staffId: string; hours: number }[],
    date: string
  ) => {
    const newAttendance: Attendance[] = records
      .filter(r => r.hours > 0)
      .map(r => ({
        id: `att-${date}-${r.staffId}-${Math.random()}`,
        staffId: r.staffId,
        date: date,
        hours: r.hours,
      }));
    
    // Remove existing records for that date to avoid duplicates
    const updatedAttendance = attendance.filter(a => a.date !== date);

    setAttendance([...updatedAttendance, ...newAttendance]);
  };
  
  const groupedAttendance = useMemo(() => {
    const groups = attendance.reduce((acc, record) => {
        const date = record.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(record);
        return acc;
    }, {} as Record<string, Attendance[]>);

    return Object.entries(groups).sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

  }, [attendance]);


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="font-headline">Yo'qlama</CardTitle>
              <CardDescription>
                Xodimlarning ishga kelishini va ishlagan soatlarini boshqaring.
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Button
                size="sm"
                className="gap-1"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Attendance
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
           {groupedAttendance.length === 0 ? (
             <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  No attendance records
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add a new attendance record to get started.
                </p>
              </div>
            </div>
           ) : (
            groupedAttendance.map(([date, records]) => (
                <Card key={date}>
                    <CardHeader>
                        <CardTitle>{format(new Date(date), 'PPP')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Xodim</TableHead>
                                    <TableHead>Lavozimi</TableHead>
                                    <TableHead className='text-right'>Ishlagan soati</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map(record => {
                                    const staffMember = STAFF.find(s => s.id === record.staffId);
                                    if (!staffMember) return null;
                                    return (
                                        <TableRow key={record.id}>
                                            <TableCell>{staffMember.fullName}</TableCell>
                                            <TableCell>{staffMember.position.name}</TableCell>
                                            <TableCell className="text-right font-bold">{record.hours} soat</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))
           )}
        </CardContent>
      </Card>
      <AddAttendanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddAttendance={handleAddAttendance}
        staff={STAFF}
      />
    </>
  );
}
