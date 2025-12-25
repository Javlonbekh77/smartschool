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
import type { UserCredentials } from "@/lib/types";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (userId: string, data: Partial<UserCredentials>) => void;
  user: UserCredentials | null;
}

const userSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type UserFormData = z.infer<typeof userSchema>;

export function EditUserDialog({
  isOpen,
  onClose,
  onUpdateUser,
  user,
}: EditUserDialogProps) {
    const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      reset({ password: user.password });
    }
  }, [user, reset]);

  const onSubmit = (data: UserFormData) => {
    if (!user) return;
    onUpdateUser(user.id, { password: data.password });
    onClose();
  };
  
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User: {user.username}</DialogTitle>
          <DialogDescription>
            Update the user's password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                 <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
                        {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                    </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Password</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
