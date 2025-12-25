'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { StudentTable } from '@/components/students/student-table';
import { STUDENTS as initialStudents } from '@/lib/data';
import type { Student } from '@/lib/types';
import { AddStudentDialog } from '@/components/dialogs/add-student-dialog';
import { MakePaymentDialog } from '@/components/dialogs/make-payment-dialog';
import { EditStudentDialog } from '@/components/dialogs/edit-student-dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import useLocalStorage from '@/hooks/use-local-storage';
import { useI18n } from '@/context/i18n';

export default function StudentsPage() {
  const { t } = useI18n();
  const [students, setStudents] = useLocalStorage<Student[]>('students', initialStudents);
  const [dialogState, setDialogState] = useState({
    add: false,
    payment: false,
    edit: false,
    archive: false,
    delete: false,
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const openDialog = (dialog: keyof typeof dialogState, student?: Student) => {
    setSelectedStudent(student || null);
    setDialogState(prev => ({ ...prev, [dialog]: true }));
  };

  const closeDialog = (dialog: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialog]: false }));
    setSelectedStudent(null);
  };

  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'isArchived' | 'avatarUrl'>) => {
    const studentToAdd: Student = {
      id: `stu${Date.now()}`,
      isArchived: false,
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
      ...newStudent
    };
    setStudents(prev => [...prev, studentToAdd]);
    closeDialog('add');
  };

  const handleMakePayment = (studentId: string, amount: number) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, balance: s.balance + amount } : s
    ));
    closeDialog('payment');
  };
  
  const handleUpdateStudent = (studentId: string, data: Omit<Student, 'id' | 'balance' | 'isArchived' | 'avatarUrl'>) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, ...data };
      }
      return s;
    }));
  };

  const handleToggleArchive = () => {
    if (!selectedStudent) return;
    setStudents(prev => prev.map(s => 
        s.id === selectedStudent.id ? { ...s, isArchived: !s.isArchived } : s
    ));
    closeDialog('archive');
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
    closeDialog('delete');
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
              <CardTitle className="font-headline">{t('students.title')}</CardTitle>
              <CardDescription>
                {t('students.description')}
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Button size="sm" className="gap-1" onClick={() => openDialog('add')}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {t('students.addStudent')}
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentTable 
            data={students}
            onMakePayment={(student) => openDialog('payment', student)}
            onEdit={(student) => openDialog('edit', student)}
            onArchive={(student) => openDialog('archive', student)}
            onDelete={(student) => openDialog('delete', student)}
          />
        </CardContent>
      </Card>
      
      <AddStudentDialog 
        isOpen={dialogState.add}
        onClose={() => closeDialog('add')}
        onAddStudent={handleAddStudent}
      />
      <MakePaymentDialog
        isOpen={dialogState.payment}
        onClose={() => closeDialog('payment')}
        student={selectedStudent}
        onMakePayment={handleMakePayment}
      />
      <EditStudentDialog
        isOpen={dialogState.edit}
        onClose={() => closeDialog('edit')}
        student={selectedStudent}
        onUpdateStudent={handleUpdateStudent}
      />
      <ConfirmDialog
        isOpen={dialogState.archive}
        onClose={() => closeDialog('archive')}
        onConfirm={handleToggleArchive}
        title={t(selectedStudent?.isArchived ? 'students.unarchiveTitle' : 'students.archiveTitle')}
        description={t(selectedStudent?.isArchived ? 'students.unarchiveDescription' : 'students.archiveDescription', { name: selectedStudent?.fullName })}
      />
      <ConfirmDialog
        isOpen={dialogState.delete}
        onClose={() => closeDialog('delete')}
        onConfirm={handleDeleteStudent}
        title={t('students.deleteTitle')}
        description={t('students.deleteDescription', { name: selectedStudent?.fullName })}
      />
    </>
  );
}
