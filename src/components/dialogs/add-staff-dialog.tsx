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
import { useState } from "react";

interface AddStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staff: Omit<Staff, 'id' | 'avatarUrl'>) => void;
  positions: Position[];
}

const staffSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  positionId: z.string().min(1, "Position is required"),
  salary: z.coerce.number().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

export function AddStaffDialog({ isOpen, onClose, onAddStaff, positions }: AddStaffDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
  });

  const selectedPositionId = watch("positionId");
  const selectedPosition = positions.find(p => p.id === selectedPositionId);

  const onSubmit = (data: StaffFormData) => {
    const position = positions.find(p => p.id === data.positionId)!;
    
    const newStaff: Omit<Staff, 'id' | 'avatarUrl'> = {
        fullName: data.fullName,
        position: position,
        ...(position.type === 'monthly' && { salary: data.salary }),
        ...(position.type === 'hourly' && { hoursWorked: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 } }),
    }
    
    onAddStaff(newStaff);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new staff member.
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
                <Select onValueChange={(value) => reset({ ...watch(), positionId: value, salary: undefined })} value={selectedPositionId}>
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
                    <Label htmlFor="salary" className="text-right">Salary</Label>
                    <Input id="salary" type="number" {...register("salary")} placeholder={`e.g. ${selectedPosition.rate}`} className="col-span-3" />
                    {errors.salary && <p className="col-span-4 text-red-500 text-sm text-right">{errors.salary.message}</p>}
                 </div>
            )}
             {selectedPosition?.type === 'hourly' && (
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Rate</Label>
                    <p className="col-span-3 text-sm text-muted-foreground">${selectedPosition.rate}/hour (Hours can be set on profile)</p>
                 </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Staff</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
