import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function TestsPage() {
  return (
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
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Test Result
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
