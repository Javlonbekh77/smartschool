'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { PlusCircle, Upload, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EXPENSES as initialExpenses } from '@/lib/data';
import type { Expense } from '@/lib/types';
import { AddExpenseDialog } from '@/components/dialogs/add-expense-dialog';
import useLocalStorage from '@/hooks/use-local-storage';
import { useAuth } from '@/context/auth';

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', initialExpenses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expenseToAdd: Expense = {
      id: `exp${Date.now()}`,
      ...newExpense,
    };
    setExpenses(prev => [...prev, expenseToAdd]);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(expenses, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'expenses.json');
    linkElement.click();
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!event.target.files) return;
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = e => {
      if (typeof e.target?.result === 'string') {
        const importedData: Expense[] = JSON.parse(e.target.result);
        setExpenses(importedData);
      }
    };
    event.target.value = '';
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="font-headline">Xarajatlar</CardTitle>
              <CardDescription>
                Track all operational expenses.
              </CardDescription>
            </div>
            {user?.role === 'admin' && (
              <div className="ml-auto flex items-center gap-2">
                 <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json" />
                <Button size="sm" variant="outline" className="gap-1" onClick={handleImportClick}>
                  <Upload className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Import</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
                <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Expense
                  </span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="text-right">
                    {expense.amount.toLocaleString()} so'm
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="font-bold">
            Total Expenses: {totalExpenses.toLocaleString()} so'm
          </div>
        </CardFooter>
      </Card>
      <AddExpenseDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </>
  );
}
