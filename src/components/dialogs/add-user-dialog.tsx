"use client";

import { useForm, Controller } from "react-hook-form";
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
import type { UserCredentials, UserRole } from "@/lib/types";
import { useEffect } from "react";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: Omit<UserCredentials, 'id'>) => void;
  existingUsers: UserCredentials[];
}

export function AddUserDialog({
  isOpen,
  onClose,
  onAddUser,
  existingUsers,
}: AddUserDialogProps) {
  
  const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long")
      .refine(val => !existingUsers.some(u => u.username === val), {
        message: "Username already exists",
      }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["admin", "visitor"]),
  });

  type UserFormData = z.infer<typeof userSchema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'visitor',
    }
  });

  useEffect(() => {
    if(isOpen) {
        reset();
    }
  }, [isOpen, reset])

  const onSubmit = (data: UserFormData) => {
    onAddUser(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user and assign a role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" {...register("username")} className="col-span-3" />
              {errors.username && <p className="col-span-4 text-red-500 text-sm text-right">{errors.username.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input id="password" type="password" {...register("password")} className="col-span-3" />
              {errors.password && <p className="col-span-4 text-red-500 text-sm text-right">{errors.password.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitor">Visitor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
