'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
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

export default function ExpensesPage() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', initialExpenses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
            <div className="ml-auto">
              <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Expense
                </span>
              </Button>
            </div>
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
