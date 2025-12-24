import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { POSITIONS } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function PositionsPage() {
  const positions = POSITIONS;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div>
            <CardTitle className="font-headline">Kasblar</CardTitle>
            <CardDescription>
              Manage job positions and their payment structures.
            </CardDescription>
          </div>
          <div className="ml-auto">
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Position
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Rate / Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.id}>
                <TableCell className="font-medium">{position.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{position.type}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${position.rate.toLocaleString()}
                  {position.type === 'hourly' && ' / hour'}
                  {position.type === 'monthly' && ' / month'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{positions.length}</strong> of <strong>{positions.length}</strong> positions.
        </div>
      </CardFooter>
    </Card>
  );
}
