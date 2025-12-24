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
import { Student } from "@/lib/types";

interface AddStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Omit<Student, 'id' | 'isArchived' | 'avatarUrl'>) => void;
}

const studentSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  grade: z.coerce.number().min(1, "Grade is required").max(12),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  monthlyFee: z.coerce.number().min(0, "Monthly fee must be a positive number"),
  balance: z.coerce.number().default(0),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function AddStudentDialog({ isOpen, onClose, onAddStudent }: AddStudentDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      enrollmentDate: new Date().toISOString().split("T")[0],
      balance: 0,
    }
  });

  const onSubmit = (data: StudentFormData) => {
    onAddStudent(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new student.
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Initial Balance (so'm)
              </Label>
              <Input id="balance" type="number" {...register("balance")} className="col-span-3" />
              {errors.balance && <p className="col-span-4 text-red-500 text-sm text-right">{errors.balance.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
