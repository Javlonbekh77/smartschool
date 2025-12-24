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
import { getDaysInMonth, format, startOfMonth, addDays } from "date-fns";

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
  const currentMonthDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(today);
    const start = startOfMonth(today);
    return Array.from({ length: daysInMonth }, (_, i) => addDays(start, i));
  }, [today]);

  useEffect(() => {
    if (isOpen && staff) {
      const monthAttendance = attendance.filter(a => 
        a.staffId === staff.id &&
        new Date(a.date).getMonth() === today.getMonth() &&
        new Date(a.date).getFullYear() === today.getFullYear()
      );
      
      const dailyHours = currentMonthDays.map(day => {
        const dateString = format(day, 'yyyy-MM-dd');
        const record = monthAttendance.find(a => a.date === dateString);
        return { date: dateString, hours: record?.hours || 0 };
      });
      
      replace(dailyHours);
    }
  }, [isOpen, staff, attendance, replace, today, currentMonthDays]);

  const onSubmit = (data: HoursFormData) => {
    if (!staff) return;
    onUpdateHours(staff.id, data.days);
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
            Update hours worked for {format(today, 'MMMM yyyy')}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="h-80 my-4">
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