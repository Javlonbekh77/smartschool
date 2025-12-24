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
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STAFF as initialStaff, POSITIONS } from '@/lib/data';
import type { Staff } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AddStaffDialog } from '@/components/dialogs/add-staff-dialog';
import { EditStaffDialog } from '@/components/dialogs/edit-staff-dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { StaffDataTableRowActions } from '@/components/staff/staff-data-table-row-actions';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [dialogState, setDialogState] = useState({
    add: false,
    edit: false,
    delete: false,
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

  const calculateSalary = (member: Staff) => {
    if (member.position.type === 'monthly') {
      return member.salary;
    }
    if (member.position.type === 'hourly' && member.hoursWorked) {
      const totalHours = Object.values(member.hoursWorked).reduce(
        (sum, h) => sum + h,
        0
      );
      return totalHours * 4 * member.position.rate; // Assuming 4 weeks in a month
    }
    return 0;
  };

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

  const handleUpdateStaff = (staffId: string, data: Omit<Staff, 'id' | 'avatarUrl'>) => {
    const staffIndex = initialStaff.findIndex(s => s.id === staffId);
    if (staffIndex !== -1) {
      const currentAvatar = initialStaff[staffIndex].avatarUrl;
      initialStaff[staffIndex] = { ...initialStaff[staffIndex], ...data, avatarUrl: currentAvatar, id: staffId };
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
                <TableHead>Type</TableHead>
                <TableHead className="text-right">
                  Calculated Salary (Monthly)
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
                  <TableCell>{member.position.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {member.position.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
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
    </>
  );
}
