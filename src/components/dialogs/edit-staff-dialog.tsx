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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Position, Staff } from "@/lib/types";
import { useEffect } from "react";

interface EditStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStaff: (staffId: string, data: Omit<Staff, 'id' | 'avatarUrl'>) => void;
  staff: Staff | null;
  positions: Position[];
}

const staffSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  positionId: z.string().min(1, "Position is required"),
  salary: z.coerce.number().optional(),
  hoursWorked: z.object({
    Mon: z.coerce.number().min(0).max(24),
    Tue: z.coerce.number().min(0).max(24),
    Wed: z.coerce.number().min(0).max(24),
    Thu: z.coerce.number().min(0).max(24),
    Fri: z.coerce.number().min(0).max(24),
  }).optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

export function EditStaffDialog({ isOpen, onClose, onUpdateStaff, staff, positions }: EditStaffDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
  });
  
  const selectedPositionId = watch("positionId");
  const selectedPosition = positions.find(p => p.id === selectedPositionId);

  useEffect(() => {
    if (staff) {
      reset({
        fullName: staff.fullName,
        positionId: staff.position.id,
        salary: staff.salary,
        hoursWorked: staff.hoursWorked || { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 }
      });
    }
  }, [staff, reset]);

  const onSubmit = (data: StaffFormData) => {
    if (!staff) return;
    
    const position = positions.find(p => p.id === data.positionId)!;
    
    let updatedStaffData: Omit<Staff, 'id' | 'avatarUrl'>;

    if (position.type === 'monthly') {
      updatedStaffData = {
        fullName: data.fullName,
        position: position,
        salary: data.salary || position.rate,
      };
    } else { // hourly
      updatedStaffData = {
        fullName: data.fullName,
        position: position,
        hoursWorked: data.hoursWorked,
      };
    }

    onUpdateStaff(staff.id, updatedStaffData);
    onClose();
  };
  
  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Tahrirlash: {staff.fullName}</DialogTitle>
          <DialogDescription>
            Xodim ma'lumotlarini yangilang.
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
                <Label htmlFor="positionId" className="text-right">Position</Label>
                <Select onValueChange={(value) => setValue("positionId", value)} value={selectedPositionId}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                        {positions.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {errors.positionId && <p className="col-span-4 text-red-500 text-sm text-right">{errors.positionId.message}</p>}
            </div>

            {selectedPosition?.type === 'monthly' && (
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salary" className="text-right">Salary (so'm)</Label>
                    <Input id="salary" type="number" {...register("salary")} placeholder={`e.g. ${selectedPosition.rate}`} className="col-span-3" />
                    {errors.salary && <p className="col-span-4 text-red-500 text-sm text-right">{errors.salary.message}</p>}
                 </div>
            )}
             {selectedPosition?.type === 'hourly' && (
                 <div className="space-y-4 rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <Label>Weekly Hours</Label>
                      <p className="text-sm text-muted-foreground">{selectedPosition.rate.toLocaleString()} so'm/soat</p>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                        <div key={day} className="space-y-1">
                           <Label htmlFor={`hours${day}`} className="text-xs">{day}</Label>
                           <Input id={`hours${day}`} type="number" {...register(`hoursWorked.${day}`)} className="h-8" />
                        </div>
                      ))}
                    </div>
                    {errors.hoursWorked && <p className="text-red-500 text-sm text-right">Please enter valid hours (0-24).</p>}
                 </div>
            )}
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
