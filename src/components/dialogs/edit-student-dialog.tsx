"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Student } from "@/lib/types";
import { useEffect } from "react";

interface EditStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudent: (studentId: string, data: Omit<Student, 'id' | 'balance' | 'isArchived' | 'avatarUrl'>) => void;
  student: Student | null;
}

const studentSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  grade: z.coerce.number().min(1, "Grade is required").max(12),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  monthlyFee: z.coerce.number().min(0, "Monthly fee must be a positive number"),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function EditStudentDialog({ isOpen, onClose, onUpdateStudent, student }: EditStudentDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName,
        grade: student.grade,
        dateOfBirth: student.dateOfBirth,
        monthlyFee: student.monthlyFee,
      });
    }
  }, [student, reset]);


  const onSubmit = (data: StudentFormData) => {
    if (!student) return;
    onUpdateStudent(student.id, data);
    onClose();
  };
  
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tahrirlash: {student.fullName}</DialogTitle>
          <DialogDescription>
            O'quvchi ma'lumotlarini yangilang.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input id="fullName" {...register("fullName")} className="col-span-3" />
              {errors.fullName && <p className="col-span-4 text-red-500 text-sm text-right">{errors.fullName.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">
                Grade
              </Label>
              <Input id="grade" type="number" {...register("grade")} className="col-span-3" />
              {errors.grade && <p className="col-span-4 text-red-500 text-sm text-right">{errors.grade.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateOfBirth" className="text-right">
                Date of Birth
              </Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="col-span-3" />
              {errors.dateOfBirth && <p className="col-span-4 text-red-500 text-sm text-right">{errors.dateOfBirth.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monthlyFee" className="text-right">
                Monthly Fee (so'm)
              </Label>
              <Input id="monthlyFee" type="number" {...register("monthlyFee")} className="col-span-3" />
              {errors.monthlyFee && <p className="col-span-4 text-red-500 text-sm text-right">{errors.monthlyFee.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Saqlash</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
