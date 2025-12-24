'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { PlusCircle, Pencil } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STAFF as initialStaff, POSITIONS, ATTENDANCE as initialAttendance } from '@/lib/data';
import type { Staff, Attendance, DailyHours } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AddStaffDialog } from '@/components/dialogs/add-staff-dialog';
import { EditStaffDialog } from '@/components/dialogs/edit-staff-dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { StaffDataTableRowActions } from '@/components/staff/staff-data-table-row-actions';
import { EditHoursDialog } from '@/components/dialogs/edit-hours-dialog';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);

  const [dialogState, setDialogState] = useState({
    add: false,
    edit: false,
    delete: false,
    editHours: false,
  });
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const openDialog = (dialog: keyof typeof dialogState, staffMember?: Staff) => {
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
      new Date(a.date).getMonth() === month &&
      new Date(a.date).getFullYear() === year
    );
  }

  const calculateSalary = (member: Staff) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const memberAttendance = getAttendanceForMonth(member.id, currentMonth, currentYear);

    if (member.position.type === 'monthly') {
      // Pay full salary if they worked at least once this month
      return memberAttendance.length > 0 ? member.position.rate : 0;
    }
    
    if (member.position.type === 'hourly') {
      const totalHours = memberAttendance.reduce((sum, a) => sum + a.hours, 0);
      return totalHours * member.position.rate;
    }

    return 0;
  };
  
  const getTotalHoursForMonth = (staffId: string) => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const memberAttendance = getAttendanceForMonth(staffId, currentMonth, currentYear);
      return memberAttendance.reduce((sum, a) => sum + a.hours, 0);
  }


  const handleAddStaff = (newStaff: Omit<Staff, 'id' | 'avatarUrl'>) => {
    const staffToAdd: Staff = {
        id: `staff${Date.now()}`,
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
        ...newStaff
    };
    initialStaff.push(staffToAdd);
    setStaff([...initialStaff]);
    closeDialog('add');
  };

  const handleUpdateStaff = (staffId: string, data: Partial<Omit<Staff, 'id' | 'avatarUrl'>>) => {
    const staffIndex = initialStaff.findIndex(s => s.id === staffId);
    if (staffIndex !== -1) {
      const currentAvatar = initialStaff[staffIndex].avatarUrl;
      const position = data.positionId ? POSITIONS.find(p => p.id === data.positionId) : initialStaff[staffIndex].position;
      
      if (!position) return;

      const updatedStaff: Staff = {
        ...initialStaff[staffIndex],
        ...data,
        position,
        id: staffId,
        avatarUrl: currentAvatar,
      };

      initialStaff[staffIndex] = updatedStaff;
    }
    setStaff([...initialStaff]);
    closeDialog('edit');
  };
  
  const handleDeleteStaff = () => {
    if (!selectedStaff) return;
    const staffIndex = initialStaff.findIndex(s => s.id === selectedStaff.id);
    if (staffIndex !== -1) {
      initialStaff.splice(staffIndex, 1);
    }
    setStaff([...initialStaff]);
    closeDialog('delete');
  };

  const handleUpdateHours = (staffId: string, dailyHours: DailyHours[]) => {
    // Remove all attendance for this staff for the current month
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const otherAttendance = attendance.filter(a => !(a.staffId === staffId && new Date(a.date).getMonth() === currentMonth && new Date(a.date).getFullYear() === currentYear));

    // Add new attendance records
    const newAttendance: Attendance[] = dailyHours.filter(d => d.hours > 0).map(d => ({
      id: `att-${d.date}-${staffId}-${Math.random()}`,
      staffId,
      date: d.date,
      hours: d.hours,
    }));

    const updatedAttendance = [...otherAttendance, ...newAttendance];
    setAttendance(updatedAttendance);
    initialAttendance.splice(0, initialAttendance.length, ...updatedAttendance); // Update shared data
    closeDialog('editHours');
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="font-headline">Xodimlar</CardTitle>
              <CardDescription>
                Manage your school's staff and their salaries.
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Button size="sm" className="gap-1" onClick={() => openDialog('add')}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Staff
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Salary / Rate</TableHead>
                <TableHead>Current Month Hours</TableHead>
                <TableHead className="text-right">
                  Current Month Salary
                </TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
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
                        <AvatarImage
                          src={member.avatarUrl}
                          alt={member.fullName}
                        />
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
                    {member.position.rate.toLocaleString()}
                    {member.position.type === 'hourly' ? ' so\'m / soat' : ' so\'m / oy'}
                  </TableCell>
                  <TableCell>
                    {member.position.type === 'hourly' ? (
                       <div className="flex items-center gap-2">
                        <span>{getTotalHoursForMonth(member.id)} soat</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openDialog('editHours', member)}>
                            <Pencil className="h-3 w-3" />
                            <span className="sr-only">Edit hours</span>
                        </Button>
                       </div>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {calculateSalary(member)?.toLocaleString()} so'm
                  </TableCell>
                   <TableCell className="text-right">
                      <StaffDataTableRowActions
                        staff={member}
                        onEdit={() => openDialog('edit', member)}
                        onDelete={() => openDialog('delete', member)}
                      />
                   </TableCell>
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
      <AddStaffDialog 
        isOpen={dialogState.add}
        onClose={() => closeDialog('add')}
        onAddStaff={handleAddStaff}
        positions={POSITIONS}
      />
       <EditStaffDialog
        isOpen={dialogState.edit}
        onClose={() => closeDialog('edit')}
        staff={selectedStaff}
        onUpdateStaff={handleUpdateStaff}
        positions={POSITIONS}
      />
      <ConfirmDialog
        isOpen={dialogState.delete}
        onClose={() => closeDialog('delete')}
        onConfirm={handleDeleteStaff}
        title="Xodimni o'chirish"
        description={`Haqiqatan ham ${selectedStaff?.fullName}ni o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.`}
      />
      <EditHoursDialog
        isOpen={dialogState.editHours}
        onClose={() => closeDialog('editHours')}
        staff={selectedStaff}
        onUpdateHours={handleUpdateHours}
        attendance={attendance}
      />
    </>
  );
}
