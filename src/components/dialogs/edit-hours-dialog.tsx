"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Staff, Attendance, DailyHours } from "@/lib/types";
import { useEffect, useMemo } from "react";
import { format } from "date-fns";

interface EditHoursDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateHours: (staffId: string, dailyHours: DailyHours[]) => void;
  staff: Staff | null;
  attendance: Attendance[];
}

const dailyHoursSchema = z.object({
  date: z.string(),
  hours: z.coerce.number().min(0, "Hours must be positive").max(24, "Hours cannot exceed 24"),
});

const hoursSchema = z.object({
  days: z.array(dailyHoursSchema),
});

type HoursFormData = z.infer<typeof hoursSchema>;

export function EditHoursDialog({
  isOpen,
  onClose,
  onUpdateHours,
  staff,
  attendance,
}: EditHoursDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HoursFormData>({
    resolver: zodResolver(hoursSchema),
    defaultValues: {
      days: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "days",
  });

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    if (isOpen && staff) {
      const monthAttendance = attendance.filter(a => 
        a.staffId === staff.id &&
        new Date(a.date).getMonth() === today.getMonth() &&
        new Date(a.date).getFullYear() === today.getFullYear()
      ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const dailyHours = monthAttendance.map(record => {
        return { date: record.date, hours: record.hours || 0 };
      }).filter(d => d.hours > 0); // Only show days that were worked
      
      replace(dailyHours);
    } else {
        replace([]);
    }
  }, [isOpen, staff, attendance, replace, today]);

  const onSubmit = (data: HoursFormData) => {
    if (!staff) return;
    
    // We need to merge the updated days with the existing non-edited days for the month
    const monthAttendance = attendance.filter(a => 
        a.staffId === staff.id &&
        new Date(a.date).getMonth() === today.getMonth() &&
        new Date(a.date).getFullYear() === today.getFullYear()
    );

    const updatedDaysMap = new Map(data.days.map(d => [d.date, d]));
    
    const finalDailyHours: DailyHours[] = monthAttendance.map(a => {
        if(updatedDaysMap.has(a.date)) {
            return { date: a.date, hours: updatedDaysMap.get(a.date)!.hours }
        }
        return { date: a.date, hours: a.hours };
    });


    onUpdateHours(staff.id, finalDailyHours);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  
  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Hours for {staff.fullName}</DialogTitle>
          <DialogDescription>
            Update hours worked for {format(today, 'MMMM yyyy')}. Only worked days are shown.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="h-80 my-4">
             {fields.length > 0 ? (
                <div className="space-y-4 p-4">
                {fields.map((field, index) => (
                    <div
                    key={field.id}
                    className="grid grid-cols-3 items-center gap-4"
                    >
                    <Label className="col-span-2">
                        {format(new Date(field.date), 'MMMM d, eee')}
                    </Label>
                    <Input
                        type="number"
                        step="0.5"
                        {...register(`days.${index}.hours`)}
                        placeholder="Hours"
                        className="col-span-1"
                    />
                    {errors.days?.[index]?.hours && (
                        <p className="col-span-3 text-red-500 text-sm text-right">
                        {errors.days?.[index]?.hours?.message}
                        </p>
                    )}
                    </div>
                ))}
                </div>
            ) : (
                 <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No hours logged this month.</p>
                </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Update Hours</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
