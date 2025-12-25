'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { PlusCircle, Upload, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STAFF as initialStaff, POSITIONS as initialPositions, ATTENDANCE as initialAttendance } from '@/lib/data';
import type { Staff, Attendance, Position, WorkDay } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AddStaffDialog } from '@/components/dialogs/add-staff-dialog';
import { EditStaffDialog } from '@/components/dialogs/edit-staff-dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { StaffDataTableRowActions } from '@/components/staff/staff-data-table-row-actions';
import { AddAttendanceDialog } from '@/components/dialogs/add-attendance-dialog';
import useLocalStorage from '@/hooks/use-local-storage';
import { useI18n } from '@/context/i18n';
import { useAuth } from '@/context/auth';

export default function StaffPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [staff, setStaff] = useLocalStorage<Staff[]>('staff', initialStaff);
  const [positions, setPositions] = useLocalStorage<Position[]>('positions', initialPositions);
  const [attendance, setAttendance] = useLocalStorage<Attendance[]>('attendance', initialAttendance);

  const [dialogState, setDialogState] = useState({
    add: false,
    edit: false,
    delete: false,
    addAttendance: false,
  });
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openDialog = (dialog: keyof typeof dialogState, staffMember?: Staff) => {
    if (user?.role !== 'admin') return;
    setSelectedStaff(staffMember || null);
    setDialogState(prev => ({ ...prev, [dialog]: true }));
  };

  const closeDialog = (dialog: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialog]: false }));
    setSelectedStaff(null);
  };
  
  const getAttendanceForMonth = (staffId: string, month: number, year: number) => {
    return attendance.filter(a => 
      a.staffId === staffId &&
      new Date(a.date).getUTCMonth() === month &&
      new Date(a.date).getUTCFullYear() === year
    );
  }

  const calculateSalary = (member: Staff) => {
    const today = new Date();
    const currentMonth = today.getUTCMonth();
    const currentYear = today.getUTCFullYear();
    
    if (member.position.type === 'monthly') {
      return member.position.rate;
    }
    
    if (member.position.type === 'hourly') {
      const memberAttendance = getAttendanceForMonth(member.id, currentMonth, currentYear);
      const totalHours = memberAttendance.reduce((sum, a) => sum + a.hours, 0);
      return totalHours * member.position.rate;
    }

    return 0;
  };

  const calculateTotalHours = (staffId: string) => {
    const today = new Date();
    const currentMonth = today.getUTCMonth();
    const currentYear = today.getUTCFullYear();
    
    const memberAttendance = getAttendanceForMonth(staffId, currentMonth, currentYear);
    return memberAttendance.reduce((sum, a) => sum + a.hours, 0);
  }
  
  const handleAddStaff = (newStaffData: Omit<Staff, 'id'>) => {
    const staffToAdd: Staff = {
        id: `staff${Date.now()}`,
        ...newStaffData
    };
    setStaff(prev => [...prev, staffToAdd]);
    closeDialog('add');
  };

  const handleUpdateStaff = (staffId: string, data: Partial<Omit<Staff, 'id'>>) => {
    setStaff(prevStaff => 
        prevStaff.map(s => (s.id === staffId ? { ...s, ...data } : s))
    );
    closeDialog('edit');
  };
  
  const handleDeleteStaff = () => {
    if (!selectedStaff) return;
    setStaff(prev => prev.filter(s => s.id !== selectedStaff.id));
    // Also remove their attendance records
    setAttendance(prev => prev.filter(a => a.staffId !== selectedStaff.id));
    closeDialog('delete');
  };

  const handleAddAttendance = (
    records: { staffId: string; hours: number }[],
    date: string
  ) => {
    setAttendance(prevAttendance => {
        const otherDatesAttendance = prevAttendance.filter(a => a.date !== date);

        const newAttendance: Attendance[] = records
          .filter(r => r.hours > 0)
          .map(r => ({
            id: `att-${date}-${r.staffId}-${Math.random()}`,
            staffId: r.staffId,
            date: date,
            hours: r.hours,
          }));

        return [...otherDatesAttendance, ...newAttendance];
    });
    
    closeDialog('addAttendance');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(staff, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'staff.json');
    linkElement.click();
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!event.target.files) return;
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = e => {
      if (typeof e.target?.result === 'string') {
        const importedData: Staff[] = JSON.parse(e.target.result);
        setStaff(importedData);
      }
    };
    event.target.value = '';
  };

  if (!isMounted) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="font-headline">{t('staff.title')}</CardTitle>
              <CardDescription>
                {t('staff.description')}
              </CardDescription>
            </div>
            {user?.role === 'admin' && (
              <div className="ml-auto flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json" />
                <Button size="sm" variant="outline" className="gap-1" onClick={handleImportClick}>
                  <Upload className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Import</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
                <Button size="sm" className="gap-1" onClick={() => openDialog('addAttendance')}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t('staff.addAttendance')}
                  </span>
                </Button>
                <Button size="sm" className="gap-1" onClick={() => openDialog('add')}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t('staff.addStaff')}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Current Month Hours</TableHead>
                <TableHead className="text-right">
                  Current Month Salary
                </TableHead>
                {user?.role === 'admin' && <TableHead><span className="sr-only">Actions</span></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Link
                      href={`/staff/${member.id}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar>
                        <AvatarFallback>
                          {member.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.fullName}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {member.position.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.position.type === 'hourly' 
                        ? `${calculateTotalHours(member.id)} soat`
                        : <span className="text-muted-foreground">-</span>
                    }
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {calculateSalary(member)?.toLocaleString()} so'm
                  </TableCell>
                   {user?.role === 'admin' && (
                     <TableCell className="text-right">
                        <StaffDataTableRowActions
                          staff={member}
                          onEdit={() => openDialog('edit', member)}
                          onDelete={() => openDialog('delete', member)}
                        />
                     </TableCell>
                   )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{staff.length}</strong> of{' '}
            <strong>{staff.length}</strong> staff members.
          </div>
        </CardFooter>
      </Card>
      {user?.role === 'admin' && (
        <>
          <AddStaffDialog 
            isOpen={dialogState.add}
            onClose={() => closeDialog('add')}
            onAddStaff={handleAddStaff}
            positions={positions}
          />
           <EditStaffDialog
            isOpen={dialogState.edit}
            onClose={() => closeDialog('edit')}
            staff={selectedStaff}
            onUpdateStaff={handleUpdateStaff}
            positions={positions}
          />
          <ConfirmDialog
            isOpen={dialogState.delete}
            onClose={() => closeDialog('delete')}
            onConfirm={handleDeleteStaff}
            title={t('staff.deleteTitle')}
            description={t('staff.deleteDescription', { name: selectedStaff?.fullName })}
          />
           <AddAttendanceDialog
            isOpen={dialogState.addAttendance}
            onClose={() => closeDialog('addAttendance')}
            onAddAttendance={handleAddAttendance}
            staff={staff}
          />
        </>
      )}
    </>
  );
}
