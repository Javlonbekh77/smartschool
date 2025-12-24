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
  onUpdateStaff: (staffId: string, data: Partial<Omit<Staff, 'id' | 'avatarUrl'>>) => void;
  staff: Staff | null;
  positions: Position[];
}

const staffSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  positionId: z.string().min(1, "Position is required"),
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
      });
    }
  }, [staff, reset]);

  const onSubmit = (data: StaffFormData) => {
    if (!staff) return;
    
    const position = positions.find(p => p.id === data.positionId)!;
    
    const updatedStaffData: Partial<Omit<Staff, 'id' | 'avatarUrl'>> = {
        fullName: data.fullName,
        position: position,
    };

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
             {selectedPosition && (
              <div className="col-span-4 text-sm text-muted-foreground text-right">
                {selectedPosition.type === 'monthly' ? `Monthly Salary: ${selectedPosition.rate.toLocaleString()} so'm` : `Hourly Rate: ${selectedPosition.rate.toLocaleString()} so'm`}
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
