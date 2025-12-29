"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Student, Test, TestResult } from "@/lib/types";
import { useMemo, useState } from "react";

interface AddTestResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTest: (test: Omit<Test, "id">, results: Omit<TestResult, "id" | "testId">[]) => void;
  students: Student[];
}

const testResultSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  score: z.coerce.number().min(0, "Score must be positive").max(100, "Score cannot exceed 100"),
});

const testSchema = z.object({
  month: z.string().min(1, "Month is required"),
  grade: z.coerce.number().min(1, "Grade is required"),
  results: z.array(testResultSchema),
});

type TestFormData = z.infer<typeof testSchema>;

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
].map(m => `${m} ${new Date().getFullYear()}`);

export function AddTestResultDialog({
  isOpen,
  onClose,
  onAddTest,
  students,
}: AddTestResultDialogProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      month: months[new Date().getMonth()],
      results: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "results",
  });
  
  const uniqueGrades = useMemo(() => {
    const grades = students.map(s => s.grade);
    return [...new Set(grades)].sort((a,b) => a - b);
  }, [students]);

  const handleGradeChange = (gradeValue: string) => {
    const grade = parseInt(gradeValue, 10);
    setSelectedGrade(grade);
    setValue("grade", grade);
    const studentsInGrade = students.filter(s => s.grade === grade);
    replace(studentsInGrade.map(s => ({ studentId: s.id, studentName: s.fullName, score: 0 })));
  };

  const onSubmit = (data: TestFormData) => {
    const { results, ...testData } = data;
    onAddTest(testData, results);
    reset();
    setSelectedGrade(null);
    onClose();
  };
  
  const handleClose = () => {
    reset();
    setSelectedGrade(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Test Result</DialogTitle>
          <DialogDescription>
            Select a grade and month, then enter the scores for each student.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="month">Month</Label>
                     <Select onValueChange={(val) => setValue("month", val)} defaultValue={months[new Date().getMonth()]}>
                        <SelectTrigger id="month">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select onValueChange={handleGradeChange} value={selectedGrade?.toString()}>
                        <SelectTrigger id="grade">
                            <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueGrades.map(g => <SelectItem key={g} value={g.toString()}>{g}-sinf</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
            </div>

            {selectedGrade && (
                <ScrollArea className="h-72 mt-4 border rounded-md">
                    <div className="p-4">
                        <h4 className="mb-4 font-medium leading-none">Enter Scores for {selectedGrade}-sinf</h4>
                        <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-3 items-center gap-4">
                                <Label className="col-span-2 truncate">{field.studentName}</Label>
                                <Input 
                                    type="number"
                                    {...register(`results.${index}.score`)}
                                    placeholder="Score"
                                    className="col-span-1"
                                />
                                {errors.results?.[index]?.score && <p className="col-span-3 text-red-500 text-sm text-right">{errors.results?.[index]?.score?.message}</p>}
                            </div>
                        ))}
                        </div>
                    </div>
                </ScrollArea>
            )}

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedGrade}>Save Results</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
