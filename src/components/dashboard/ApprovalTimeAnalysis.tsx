
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const data = [
  {
    name: 'Education',
    days: 76,
  },
  {
    name: 'Health',
    days: 120,
  },
  {
    name: 'Defense',
    days: 45,
  },
  {
    name: 'Economy',
    days: 95,
  },
  {
    name: 'Environment',
    days: 82,
  },
  {
    name: 'Transport',
    days: 63,
  },
];

const config = {
  days: {
    label: 'Average Days to Approval',
    color: '#9b87f5',
  },
};

export function ApprovalTimeAnalysis() {
  return (
    <ChartContainer config={config} className="aspect-[4/3]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            fontSize={12}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => `${value.toString()}`}
            fontSize={12}
          />
          <Tooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`${value.toString()} days`, 'Average Time']}
              />
            }
          />
          <Bar
            dataKey="days"
            radius={[4, 4, 0, 0]}
            className="fill-[var(--color-days)]"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
