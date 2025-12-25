"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Student } from "@/lib/types"
import Link from "next/link"
import { useAuth } from "@/context/auth"

interface StudentDataTableRowActionsProps {
  student: Student;
  onMakePayment: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function StudentDataTableRowActions({ 
  student, 
  onMakePayment,
  onEdit,
  onArchive,
  onDelete
}: StudentDataTableRowActionsProps) {
  const { user } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/students/${student.id}`}>View Profile</Link>
        </DropdownMenuItem>
        {user?.role === 'admin' && (
          <>
            <DropdownMenuItem onClick={onMakePayment}>
              Make Payment
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onEdit}>Edit Student</DropdownMenuItem>
            <DropdownMenuItem onClick={onArchive}>
              {student.isArchived ? 'Unarchive' : 'Archive'} Student
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/20"
              onClick={onDelete}
            >
              Delete Student
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
