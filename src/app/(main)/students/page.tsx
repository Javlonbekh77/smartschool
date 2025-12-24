import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { StudentTable } from "@/components/students/student-table";
import { STUDENTS } from "@/lib/data";

export default function StudentsPage() {
  // In a real app, you'd fetch this data.
  const students = STUDENTS;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div>
            <CardTitle className="font-headline">O'quvchilar</CardTitle>
            <CardDescription>
              Manage your students and their payments.
            </CardDescription>
          </div>
          <div className="ml-auto">
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Student
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <StudentTable data={students} />
      </CardContent>
    </Card>
  );
}
