'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, Upload, Download } from 'lucide-react';
import { StudentTable } from '@/components/students/student-table';
import { STUDENTS as initialStudents, PAYMENTS as initialPayments, AUDIT_LOGS as initialAuditLogs } from '@/lib/data';
import type { Student, Payment, AuditLog } from '@/lib/types';
import { AddStudentDialog } from '@/components/dialogs/add-student-dialog';
import { MakePaymentDialog } from '@/components/dialogs/make-payment-dialog';
import { EditStudentDialog } from '@/components/dialogs/edit-student-dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import useLocalStorage from '@/hooks/use-local-storage';
import { useI18n } from '@/context/i18n';
import { useAuth } from '@/context/auth';

export default function StudentsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [students, setStudents] = useLocalStorage<Student[]>('students', initialStudents);
  const [payments, setPayments] = useLocalStorage<Payment[]>('payments', initialPayments);
  const [auditLogs, setAuditLogs] = useLocalStorage<AuditLog[]>('audit_logs', initialAuditLogs);

  const [dialogState, setDialogState] = useState({
    add: false,
    payment: false,
    edit: false,
    archive: false,
    delete: false,
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logAction = (action: AuditLog['action'], details: string) => {
    if (!user) return;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminUsername: user.username,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const openDialog = (dialog: keyof typeof dialogState, student?: Student) => {
    if (user?.role !== 'admin') return;
    setSelectedStudent(student || null);
    setDialogState(prev => ({ ...prev, [dialog]: true }));
  };

  const closeDialog = (dialog: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialog]: false }));
    setSelectedStudent(null);
  };

  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'isArchived'>) => {
    const studentToAdd: Student = {
      id: `stu${Date.now()}`,
      isArchived: false,
      ...newStudent
    };
    setStudents(prev => [...prev, studentToAdd]);
    logAction('add_student', `Added student: ${studentToAdd.fullName}`);
    closeDialog('add');
  };

  const handleMakePayment = (studentId: string, amount: number, note: string) => {
    let studentName = '';
    let newBalance = 0;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        studentName = s.fullName;
        newBalance = s.balance + amount;
        return { ...s, balance: newBalance };
      }
      return s;
    }));

    const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        studentId: studentId,
        amount: amount,
        note: note,
        date: new Date().toISOString(),
        balanceAfter: newBalance
    };
    setPayments(prev => [...prev, newPayment]);

    logAction('make_payment', `Made payment of ${amount.toLocaleString()} so'm for ${studentName}. Note: ${note}`);
    closeDialog('payment');
  };
  
  const handleUpdateStudent = (studentId: string, data: Omit<Student, 'id' | 'balance' | 'isArchived'>) => {
    let studentName = '';
    setStudents(prev => prev.map(s => {
        if(s.id === studentId) {
            studentName = s.fullName;
            return { ...s, ...data };
        }
        return s;
    }));
    logAction('edit_student', `Edited details for student: ${studentName}`);
    closeDialog('edit');
  };

  const handleToggleArchive = () => {
    if (!selectedStudent) return;
    setStudents(prev => prev.map(s => 
        s.id === selectedStudent.id ? { ...s, isArchived: !s.isArchived } : s
    ));
    const action = selectedStudent.isArchived ? 'unarchive_student' : 'archive_student';
    logAction(action, `${action === 'archive_student' ? 'Archived' : 'Unarchived'} student: ${selectedStudent.fullName}`);
    closeDialog('archive');
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
    setPayments(prev => prev.filter(p => p.studentId !== selectedStudent.id)); // Also remove payments
    logAction('delete_student', `Deleted student: ${selectedStudent.fullName}`);
    closeDialog('delete');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(students, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'students.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
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
        const importedStudents: Student[] = JSON.parse(e.target.result);
        setStudents(importedStudents);
        logAction('import_students', `Imported ${importedStudents.length} students from file.`);
      }
    };
     // Reset file input
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
              <CardTitle className="font-headline">{t('students.title')}</CardTitle>
              <CardDescription>
                {t('students.description')}
              </CardDescription>
            </div>
            {user?.role === 'admin' && (
              <div className="ml-auto flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json" />
                <Button size="sm" variant="outline" className="gap-1" onClick={handleImportClick}>
                  <Upload className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Import
                  </span>
                </Button>
                 <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button size="sm" className="gap-1" onClick={() => openDialog('add')}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t('students.addStudent')}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <StudentTable 
            data={students}
            onMakePayment={(student) => openDialog('payment', student)}
            onEdit={(student) => openDialog('edit', student)}
            onArchive={(student) => openDialog('archive', student)}
            onDelete={(student) => openDialog('delete', student)}
            userRole={user?.role}
          />
        </CardContent>
      </Card>
      
      {user?.role === 'admin' && (
        <>
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
      )}
    </>
  );
}
