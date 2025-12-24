'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const data = [
  { month: 'Jan', income: 18600, expenses: 8000 },
  { month: 'Feb', income: 30500, expenses: 13980 },
  { month: 'Mar', income: 23700, expenses: 9800 },
  { month: 'Apr', income: 27800, expenses: 3908 },
  { month: 'May', income: 18900, expenses: 4800 },
  { month: 'Jun', income: 23900, expenses: 3800 },
];

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function FinancialChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Monthly Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[350px]">
          <BarChart data={data} accessibilityLayer>
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${Number(value) / 1000}k`}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="income" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expenses" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
