'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { AddTestResultDialog } from '@/components/dialogs/add-test-result-dialog';
import { STUDENTS, TESTS as initialTests, TEST_RESULTS as initialTestResults } from '@/lib/data';
import type { Student, Test, TestResult } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useLocalStorage from '@/hooks/use-local-storage';

export default function TestsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [tests, setTests] = useLocalStorage<Test[]>('tests', initialTests);
  const [testResults, setTestResults] = useLocalStorage<TestResult[]>('testResults', initialTestResults);
  const [students] = useLocalStorage<Student[]>('students', STUDENTS);

  const handleAddTest = (newTest: Omit<Test, 'id'>, results: Omit<TestResult, 'id' | 'testId'>[]) => {
    const testToAdd: Test = {
      id: `test${Date.now()}`,
      ...newTest,
    };
    setTests(prev => [...prev, testToAdd]);

    const resultsToAdd: TestResult[] = results.map(r => ({
      ...r,
      id: `res${Date.now()}${Math.random()}`,
      testId: testToAdd.id,
    }));
    setTestResults(prev => [...prev, ...resultsToAdd]);

  };

  const getResultsForTest = (testId: string) => {
    return testResults.filter(r => r.testId === testId).sort((a,b) => b.score - a.score);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="font-headline">Test natijalari</CardTitle>
              <CardDescription>
                Track and manage student test results by month and grade.
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Test Result
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {tests.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  No test results
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add a new test result to get started.
                </p>
              </div>
            </div>
          ) : (
            tests.map(test => (
              <Card key={test.id}>
                <CardHeader>
                    <CardTitle>{test.month} - {test.grade}-sinf</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>O'quvchi</TableHead>
                                <TableHead className="text-right">Ball</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {getResultsForTest(test.id).map(result => (
                                <TableRow key={result.id}>
                                    <TableCell>{result.studentName}</TableCell>
                                    <TableCell className="text-right font-bold">{result.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
      <AddTestResultDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddTest={handleAddTest}
        students={students}
      />
    </>
  );
}
