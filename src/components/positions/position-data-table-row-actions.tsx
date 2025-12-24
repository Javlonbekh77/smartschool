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
import { Position } from "@/lib/types"

interface PositionDataTableRowActionsProps {
  position: Position;
  onEdit: () => void;
  onDelete: () => void;
}

export function PositionDataTableRowActions({ 
  position, 
  onEdit,
  onDelete
}: PositionDataTableRowActionsProps) {
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
        <DropdownMenuItem onClick={onEdit}>Edit Position</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:bg-destructive/20"
          onClick={onDelete}
        >
          Delete Position
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
