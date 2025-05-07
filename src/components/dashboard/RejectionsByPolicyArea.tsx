
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { fetchRejectionsByPolicyArea } from '@/services/billsService';
import { RejectionData } from '@/services/billsService';

export function RejectionsByPolicyArea() {
  const [data, setData] = useState<RejectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Colors for the bars
  const colors = ['#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff'];
  
  useEffect(() => {
    async function loadRejectionData() {
      try {
        setLoading(true);
        const rejectionData = await fetchRejectionsByPolicyArea();
        
        // Sort data by count (value) in descending order and limit to top 8
        const sortedData = rejectionData
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);
          
        setData(sortedData);
        setError(null);
      } catch (err) {
        console.error('Failed to load rejection data:', err);
        setError('Failed to load rejection data');
      } finally {
        setLoading(false);
      }
    }
    
    loadRejectionData();
  }, []);
  
  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center">
        <p className="text-gray-500">Loading rejection data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-72 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center">
        <p className="text-gray-500">No rejection data available</p>
      </div>
    );
  }
  
  return (
    <div className="h-72">
      <ChartContainer
        config={{
          rejected: {
            label: 'Rejected Bills',
            color: '#9333ea',
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 20, bottom: 40 }}
            barSize={24}
          >
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <p className="font-medium">{payload[0].payload.name}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {payload[0].value}
                        </span> bills rejected
                      </p>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" name="Rejected Bills">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
