
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function SummaryStats() {
  const [totalBills, setTotalBills] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotalBills() {
      try {
        const { count, error } = await supabase
          .from('all_bills_uk')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error fetching bill count:', error);
          return;
        }
        
        setTotalBills(count);
      } catch (error) {
        console.error('Error fetching bill count:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTotalBills();
  }, []);

  const stats = [
    {
      title: "Total Bills",
      value: loading ? "Loading..." : totalBills?.toString() || "0",
      change: "+12% from last period",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Average Processing Time",
      value: "142 days",
      change: "-8% from last period",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      title: "Rejection Rate",
      value: "23%",
      change: "-3% from last period",
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      title: "Approval Rate",
      value: "68%",
      change: "+5% from last period",
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`rounded-full p-2 ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
