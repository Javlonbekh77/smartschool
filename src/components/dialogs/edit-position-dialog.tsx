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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Position } from "@/lib/types";
import { useEffect } from "react";

interface EditPositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePosition: (positionId: string, data: Omit<Position, "id">) => void;
  position: Position | null;
}

const positionSchema = z.object({
  name: z.string().min(1, "Position name is required"),
  type: z.enum(["hourly", "monthly"]),
  rate: z.coerce.number().min(1, "Rate is required"),
});

type PositionFormData = z.infer<typeof positionSchema>;

export function EditPositionDialog({
  isOpen,
  onClose,
  onUpdatePosition,
  position,
}: EditPositionDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PositionFormData>({
    resolver: zodResolver(positionSchema),
  });
  
  useEffect(() => {
    if (position) {
      reset({
        name: position.name,
        type: position.type,
        rate: position.rate,
      });
    }
  }, [position, reset]);

  const onSubmit = (data: PositionFormData) => {
    if (!position) return;
    onUpdatePosition(position.id, data);
  };
  
  if (!position) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tahrirlash: {position.name}</DialogTitle>
          <DialogDescription>
            Kasb ma'lumotlarini yangilang.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" {...register("name")} className="col-span-3" />
              {errors.name && (
                <p className="col-span-4 text-red-500 text-sm text-right">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                onValueChange={(value: "hourly" | "monthly") =>
                  setValue("type", value)
                }
                value={watch("type")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">
                Rate / Salary (so'm)
              </Label>
              <Input
                id="rate"
                type="number"
                {...register("rate")}
                className="col-span-3"
              />
              {errors.rate && (
                <p className="col-span-4 text-red-500 text-sm text-right">
                  {errors.rate.message}
                </p>
              )}
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
