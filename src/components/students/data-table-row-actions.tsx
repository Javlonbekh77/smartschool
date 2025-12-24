"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
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

interface StudentDataTableRowActionsProps {
  student: Student;
}

export function StudentDataTableRowActions({ student }: StudentDataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(student.id)}
        >
          Make Payment
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit Student</DropdownMenuItem>
        <DropdownMenuItem>{student.isArchived ? 'Unarchive' : 'Archive'} Student</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:bg-destructive/20">Delete Student</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
