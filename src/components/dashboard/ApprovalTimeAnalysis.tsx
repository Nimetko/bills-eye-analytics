
import React, { useState, useEffect } from 'react';
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
import { fetchApprovalTimeByPolicyArea, ApprovalTimeData } from '@/services/billsService';
import { useQuery } from '@tanstack/react-query';

const fallbackData = [
  { name: 'Education', days: 76 },
  { name: 'Health', days: 120 },
  { name: 'Defense', days: 45 },
  { name: 'Economy', days: 95 },
  { name: 'Environment', days: 82 },
  { name: 'Transport', days: 63 },
];

const config = {
  days: {
    label: 'Average Days to Approval',
    color: '#9b87f5',
  },
};

export function ApprovalTimeAnalysis() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['approvalTimes'],
    queryFn: fetchApprovalTimeByPolicyArea,
  });
  
  const chartData = data || fallbackData;

  return (
    <>
      {error && (
        <div className="text-red-500 mb-4">
          Error loading data: {(error as Error).message}
        </div>
      )}
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-parliament-purple"></div>
        </div>
      ) : (
        <ChartContainer config={config} className="aspect-[4/3]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
      )}
    </>
  );
}
