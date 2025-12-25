'use client';
import * as React from 'react';
import {
  ChevronsUpDown,
  ChevronDown,
} from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Student } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StudentDataTableRowActions } from './data-table-row-actions';
import Link from 'next/link';

interface StudentTableProps {
  data: Student[];
  onMakePayment: (student: Student) => void;
  onEdit: (student: Student) => void;
  onArchive: (student: Student) => void;
  onDelete: (student: Student) => void;
  userRole?: 'admin' | 'visitor';
}

export function StudentTable({ data, onMakePayment, onEdit, onArchive, onDelete, userRole }: StudentTableProps) {
  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ row }) => (
        <Link href={`/students/${row.original.id}`} className="flex items-center gap-3 hover:underline">
           <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarFallback>{row.original.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="capitalize font-medium">{row.getValue('fullName')}</div>
        </Link>
      ),
    },
    {
      accessorKey: 'grade',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Grade
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="text-center">{row.getValue('grade')}</div>,
    },
    {
      accessorKey: 'balance',
      header: ({ column }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Balance
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('balance'));
        const formatted = amount.toLocaleString() + " so'm";
  
        return (
          <div className="text-right font-medium">
            <Badge variant={amount < 0 ? 'destructive' : amount > 0 ? 'default' : 'secondary'}
              className={amount > 0 ? 'bg-green-600 text-white' : ''}
            >
              {formatted}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'monthlyFee',
      header: () => <div className="text-right">Monthly Fee</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('monthlyFee'));
        const formatted = amount.toLocaleString() + " so'm";
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
     {
      accessorKey: 'isArchived',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isArchived') ? 'outline' : 'secondary'}>
          {row.getValue('isArchived') ? 'Archived' : 'Active'}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
  ];
  
  if (userRole === 'admin') {
    columns.push({
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const student = row.original;
          return <StudentDataTableRowActions 
            student={student} 
            onMakePayment={() => onMakePayment(student)}
            onEdit={() => onEdit(student)}
            onArchive={() => onArchive(student)}
            onDelete={() => onDelete(student)}
          />
        },
    });
  }


  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  const uniqueGrades = React.useMemo(() => {
    const grades = new Set(data.map(student => student.grade));
    return Array.from(grades).sort((a,b) => a - b);
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
        pagination: {
            pageSize: 8,
        }
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter students..."
          value={(table.getColumn('fullName')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('fullName')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
            value={(table.getColumn('grade')?.getFilterValue() as string) ?? ''}
            onValueChange={(value) => table.getColumn('grade')?.setFilterValue(value)}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Grade" />
            </SelectTrigger>
            <SelectContent>
                 <SelectItem value="">All Grades</SelectItem>
                {uniqueGrades.map(grade => (
                    <SelectItem key={grade} value={String(grade)}>{grade}-sinf</SelectItem>
                ))}
            </SelectContent>
        </Select>
         <Select
            value={(table.getColumn('isArchived')?.getFilterValue() as string) ?? ''}
            onValueChange={(value) => table.getColumn('isArchived')?.setFilterValue(value === 'all' ? undefined : (value === 'active' ? false : true))}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} student(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
