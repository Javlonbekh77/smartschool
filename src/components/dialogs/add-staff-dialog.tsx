"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import type { Position, Staff, WorkDay } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";

interface AddStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staff: Omit<Staff, 'id' | 'avatarUrl'>) => void;
  positions: Position[];
}

const workDaySchema = z.object({
  day: z.string(),
  hours: z.coerce.number().min(0, "Invalid hours").max(24, "Invalid hours"),
  isWorkingDay: z.boolean(),
});

const staffSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  positionId: z.string().min(1, "Position is required"),
  workSchedule: z.array(workDaySchema).optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function AddStaffDialog({ isOpen, onClose, onAddStaff, positions }: AddStaffDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      workSchedule: weekDays.map(day => ({ day, hours: 0, isWorkingDay: false })),
    }
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "workSchedule",
  });

  const selectedPositionId = watch("positionId");
  const selectedPosition = positions.find(p => p.id === selectedPositionId);


  const onSubmit = (data: StaffFormData) => {
    const position = positions.find(p => p.id === data.positionId)!;
    
    const newStaff: Omit<Staff, 'id' | 'avatarUrl'> = {
        fullName: data.fullName,
        position: position,
        workSchedule: data.workSchedule,
    };
    
    onAddStaff(newStaff);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset({
        fullName: '',
        positionId: undefined,
        workSchedule: weekDays.map(day => ({ day, hours: 0, isWorkingDay: false })),
    });
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
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
                <Controller
                    name="positionId"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                            <SelectContent>
                                {positions.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.positionId && <p className="col-span-4 text-red-500 text-sm text-right">{errors.positionId.message}</p>}
            </div>
            
            {selectedPosition && selectedPosition.type === 'hourly' && (
                <div className="col-span-4 space-y-4 rounded-lg border p-4">
                    <Label>Weekly Work Schedule</Label>
                    <div className="space-y-2">
                        {fields.map((field, index) => (
                           <div key={field.id} className="flex items-center gap-4 justify-between">
                                <div className="flex items-center gap-2">
                                     <Controller
                                        name={`workSchedule.${index}.isWorkingDay`}
                                        control={control}
                                        render={({ field }) => (
                                             <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id={`workSchedule.${index}.isWorkingDay`}
                                            />
                                        )}
                                    />
                                    <Label htmlFor={`workSchedule.${index}.isWorkingDay`} className="flex-1">{field.day}</Label>
                                </div>
                                <Input 
                                    type="number"
                                    className="w-24"
                                    placeholder="Hours"
                                    {...register(`workSchedule.${index}.hours`)}
                                    disabled={!watch(`workSchedule.${index}.isWorkingDay`)}
                                />
                           </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Staff</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
