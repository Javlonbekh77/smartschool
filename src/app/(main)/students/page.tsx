'use client';
import { useState } from 'react';
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'balance' | 'isArchived' | 'avatarUrl'>) => {
    const studentToAdd: Student = {
      id: `stu${Date.now()}`,
      balance: 0,
      isArchived: false,
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
      ...newStudent
    };
    setStudents(prev => [...prev, studentToAdd]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="font-headline">O'quvchilar</CardTitle>
              <CardDescription>
                Manage your students and their payments.
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Student
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentTable data={students} />
        </CardContent>
      </Card>
      <AddStudentDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </>
  );
}
