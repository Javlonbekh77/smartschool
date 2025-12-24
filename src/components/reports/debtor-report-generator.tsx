"use client";

import { useState } from "react";
import { generateDebtorReport } from "@/ai/flows/generate-debtor-report";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const months = [
  "January 2024",
  "February 2024",
  "March 2024",
  "April 2024",
  "May 2024",
  "June 2024",
];

export function DebtorReportGenerator() {
  const [selectedMonth, setSelectedMonth] = useState(months[4]);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setReport("");
    try {
      const result = await generateDebtorReport({ month: selectedMonth });
      setReport(result.report);
    } catch (error) {
      console.error(error);
      setReport("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        <div className="flex-1">
          <label htmlFor="month" className="text-sm font-medium">
            Select Month
          </label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger id="month">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Report"
          )}
        </Button>
      </form>
      <div className="rounded-lg border bg-background p-4 min-h-[200px]">
        <h3 className="font-semibold mb-2">Generated Report:</h3>
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>AI is analyzing financial data...</p>
          </div>
        ) : report ? (
          <p className="text-sm whitespace-pre-wrap">{report}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your generated report will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
