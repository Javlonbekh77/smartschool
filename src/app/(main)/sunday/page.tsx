'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SundayPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Sunday</CardTitle>
        <CardDescription>
          Future home for admin management or activity logs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Sunday Page Content
            </h3>
            <p className="text-sm text-muted-foreground">
              This page is under construction.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
