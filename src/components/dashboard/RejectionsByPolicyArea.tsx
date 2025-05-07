import { useEffect, useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { fetchRejectionsByPolicyArea } from '@/services/billsService';
import { RejectionData } from '@/services/billsService';
import { useIsMobile } from "@/hooks/use-mobile";

export function RejectionsByPolicyArea() {
  const [data, setData] = useState<RejectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Enhanced color palette for better visual distinction
  const colors = [
    '#9333ea', '#a855f7', '#b066f7', '#c084fc', 
    '#d8b4fe', '#e9d5ff', '#f3e8ff', '#f5f3ff'
  ];
  
  useEffect(() => {
    async function loadRejectionData() {
      try {
        setLoading(true);
        const rejectionData = await fetchRejectionsByPolicyArea();
        
        // Sort data by count (value) in descending order and limit to top 8
        const sortedData = rejectionData
          .sort((a, b) => b.value - a.value)
          .slice(0, 8)
          // Process policy area names for better display
          .map(item => ({
            ...item,
            // Keep full name but limit display if needed
            fullName: item.name,
            name: item.name.length > 20 ? `${item.name.substring(0, 18)}...` : item.name
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

  // Responsive configuration based on screen size
  const chartConfig = {
    small: {
      margin: { top: 10, right: 10, left: 0, bottom: 80 },
      barSize: 20,
      xAxis: {
        angle: -60,
        dy: 20,
        fontSize: 10,
        height: 120
      }
    },
    medium: {
      margin: { top: 20, right: 20, left: 20, bottom: 80 },
      barSize: 30,
      xAxis: {
        angle: -45,
        dy: 15,
        fontSize: 12,
        height: 100
      }
    },
    large: {
      margin: { top: 20, right: 30, left: 30, bottom: 60 },
      barSize: 40,
      xAxis: {
        angle: -30,
        dy: 10,
        fontSize: 12,
        height: 80
      }
    }
  };
  
  // Select the appropriate configuration based on screen size
  const config = isMobile ? chartConfig.small : window.innerWidth < 1200 ? chartConfig.medium : chartConfig.large;
  
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
            margin={config.margin}
            barSize={config.barSize}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name"
              tick={{ 
                fontSize: config.xAxis.fontSize,
                fill: "#4b5563", // text-gray-600 equivalent
                fontWeight: 500
              }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              angle={config.xAxis.angle}
              textAnchor="end"
              height={config.xAxis.height}
              dy={config.xAxis.dy}
              interval={0}
            />
            <YAxis 
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tick={{ fontSize: 12, fill: "#4b5563" }}
              width={45}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <ChartTooltipContent>
                      <p className="font-medium">{item.fullName || item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {item.value}
                        </span> bills rejected
                      </p>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" name="Rejected Bills" radius={[4, 4, 0, 0]}>
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
