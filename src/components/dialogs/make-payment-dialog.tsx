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
import { Textarea } from "@/components/ui/textarea";
import type { Student } from "@/lib/types";

interface MakePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMakePayment: (studentId: string, amount: number, note: string) => void;
  student: Student | null;
}

const paymentSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  note: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export function MakePaymentDialog({
  isOpen,
  onClose,
  onMakePayment,
  student,
}: MakePaymentDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = (data: PaymentFormData) => {
    if (!student) return;
    onMakePayment(student.id, data.amount, data.note || '');
    reset();
    onClose();
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>To'lov qilish: {student.fullName}</DialogTitle>
          <DialogDescription>
            Hozirgi balans: {student.balance.toLocaleString()} so'm
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Summa (so'm)
              </Label>
              <Input
                id="amount"
                type="number"
                step="1"
                {...register("amount")}
                className="col-span-3"
              />
              {errors.amount && <p className="col-span-4 text-red-500 text-sm text-right">{errors.amount.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="note" className="text-right pt-2">
                Izoh
              </Label>
              <Textarea
                id="note"
                {...register("note")}
                className="col-span-3"
                placeholder="To'lov maqsadi (ixtiyoriy)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button type="submit">To'lovni amalga oshirish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
