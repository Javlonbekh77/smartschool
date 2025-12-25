"use client";

import { useForm, Controller } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EditStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudent: (studentId: string, data: Omit<Student, 'id' | 'balance' | 'isArchived' | 'avatarUrl'>) => void;
  student: Student | null;
}

const studentSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  grade: z.coerce.number().min(1, "Grade is required").max(12),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  monthlyFee: z.coerce.number().min(0, "Monthly fee must be a positive number"),
  paymentType: z.enum(['monthly', 'anniversary']),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function EditStudentDialog({ isOpen, onClose, onUpdateStudent, student }: EditStudentDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName,
        grade: student.grade,
        enrollmentDate: student.enrollmentDate,
        monthlyFee: student.monthlyFee,
        paymentType: student.paymentType || 'monthly',
      });
    }
  }, [student, reset]);


  const onSubmit = (data: StudentFormData) => {
    if (!student) return;
    onUpdateStudent(student.id, data);
  };
  
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
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
              <Label htmlFor="enrollmentDate" className="text-right">
                Enrollment Date
              </Label>
              <Input id="enrollmentDate" type="date" {...register("enrollmentDate")} className="col-span-3" />
              {errors.enrollmentDate && <p className="col-span-4 text-red-500 text-sm text-right">{errors.enrollmentDate.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monthlyFee" className="text-right">
                Monthly Fee (so'm)
              </Label>
              <Input id="monthlyFee" type="number" {...register("monthlyFee")} className="col-span-3" />
              {errors.monthlyFee && <p className="col-span-4 text-red-500 text-sm text-right">{errors.monthlyFee.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                    Payment Cycle
                </Label>
                <Controller
                    control={control}
                    name="paymentType"
                    render={({ field }) => (
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="col-span-3 flex flex-col space-y-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="monthly" id="edit-monthly" />
                                <Label htmlFor="edit-monthly">1st of each month</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="anniversary" id="edit-anniversary" />
                                <Label htmlFor="edit-anniversary">Enrollment date anniversary</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
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
