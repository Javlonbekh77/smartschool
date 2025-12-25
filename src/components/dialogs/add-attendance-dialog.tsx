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
import type { Staff } from "@/lib/types";
import { useEffect } from "react";

interface AddAttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAttendance: (
    records: { staffId: string; hours: number }[],
    date: string
  ) => void;
  staff: Staff[];
}

const attendanceRecordSchema = z.object({
  staffId: z.string(),
  staffName: z.string(),
  positionType: z.enum(['hourly', 'monthly']),
  hours: z.coerce.number().min(0, "Hours must be positive").max(24, "Hours cannot exceed 24"),
});

const attendanceSchema = z.object({
  date: z.string().min(1, "Date is required"),
  records: z.array(attendanceRecordSchema),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

export function AddAttendanceDialog({
  isOpen,
  onClose,
  onAddAttendance,
  staff,
}: AddAttendanceDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      records: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "records",
  });
  
  const selectedDate = watch('date');

  useEffect(() => {
    if (isOpen) {
      const dateObj = new Date(selectedDate || new Date());
      // Adjust for timezone differences to get correct day of week for local timezone
      const localDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
      const dayIndex = (localDate.getDay() + 6) % 7; 
      const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const todayString = weekDays[dayIndex];

      const hourlyStaff = staff.filter(s => s.position.type === 'hourly');
      
      const staffForSelectedDay = hourlyStaff.filter(s => {
          if (!s.workSchedule) return false;
          const workDay = s.workSchedule.find(d => d.day === todayString);
          return workDay && workDay.isWorkingDay;
      });

      const staffRecords = staffForSelectedDay.map(s => {
        let defaultHours = 0;
        if (s.workSchedule) {
            const workDay = s.workSchedule.find(d => d.day === todayString && d.isWorkingDay);
            if (workDay) {
                defaultHours = workDay.hours;
            }
        }
        
        return {
            staffId: s.id,
            staffName: s.fullName,
            positionType: s.position.type,
            hours: defaultHours,
        }
      });
      replace(staffRecords);
    }
  }, [isOpen, staff, replace, selectedDate]);

  const onSubmit = (data: AttendanceFormData) => {
    onAddAttendance(data.records, data.date);
    handleClose();
  };

  const handleClose = () => {
    reset({
        date: new Date().toISOString().split("T")[0],
        records: []
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Attendance Record (Hourly Staff)</DialogTitle>
          <DialogDescription>
            Enter the hours worked for each hourly staff member scheduled for the selected date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                className="col-span-3"
              />
              {errors.date && <p className="col-span-4 text-sm text-red-500 text-right">{errors.date.message}</p>}
            </div>

            <ScrollArea className="h-72 mt-4 border rounded-md">
              <div className="p-4">
                <h4 className="mb-4 font-medium leading-none">Staff Hours</h4>
                 {fields.length > 0 ? (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-3 items-center gap-4"
                        >
                          <Label className="col-span-2">{field.staffName}</Label>
                          <Input
                            type="number"
                            step="0.5"
                            {...register(`records.${index}.hours`)}
                            placeholder="Hours"
                            className="col-span-1"
                          />
                          {errors.records?.[index]?.hours && (
                            <p className="col-span-3 text-red-500 text-sm text-right">
                              {errors.records?.[index]?.hours?.message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                 ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <p>No hourly staff scheduled to work on this date.</p>
                    </div>
                 )}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save Attendance</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
