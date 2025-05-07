
import { useEffect, useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { fetchRejectionsByPolicyArea } from '@/services/billsService';
import { RejectionData } from '@/services/billsService';
import { useIsMobile } from "@/hooks/use-mobile";

export function RejectionsByPolicyArea() {
  const [data, setData] = useState<RejectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
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
          .slice(0, 8)
          // Truncate long policy area names for better display
          .map(item => ({
            ...item,
            name: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name
          }));
          
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
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading rejection data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-gray-500">No rejection data available</p>
      </div>
    );
  }

  // Adjust the chart layout based on screen size
  const chartMargin = isMobile
    ? { top: 10, right: 10, left: 0, bottom: 80 }
    : { top: 20, right: 20, left: 20, bottom: 100 };

  const xAxisProps = isMobile
    ? {
        height: 120,
        angle: -60,
        dy: 20,
        fontSize: 10,
      }
    : {
        height: 120,
        angle: -45,
        dy: 15,
        fontSize: 12,
      };
  
  return (
    <div className="h-[400px]">
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
            margin={chartMargin}
            barSize={isMobile ? 20 : 28}
          >
            <XAxis 
              dataKey="name"
              tick={{ 
                fontSize: xAxisProps.fontSize,
                width: 80,
                textOverflow: 'ellipsis',
                wordWrap: 'break-word' 
              }}
              tickLine={false}
              axisLine={false}
              angle={xAxisProps.angle}
              textAnchor="end"
              height={xAxisProps.height}
              dy={xAxisProps.dy}
              interval={0}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              width={isMobile ? 30 : 45}
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
