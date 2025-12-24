import { DebtorReportGenerator } from "@/components/reports/debtor-report-generator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Debtor Report</CardTitle>
        <CardDescription>
          Generate a summary report of students with outstanding balances using AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DebtorReportGenerator />
      </CardContent>
    </Card>
  );
}
