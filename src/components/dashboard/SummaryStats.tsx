
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BillStats {
  totalBills: number;
  approved: number;
  rejected: number;
  inProcess: number;
}

export function SummaryStats() {
  const [stats, setStats] = useState<BillStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBillStats() {
      try {
        // Get total bill count
        const { count: totalCount, error: countError } = await supabase
          .from('all_bills_uk')
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.error('Error fetching bill count:', countError);
          return;
        }
        
        // Get approved bills (isAct = true)
        const { count: approvedCount, error: approvedError } = await supabase
          .from('all_bills_uk')
          .select('*', { count: 'exact', head: true })
          .eq('isAct', true);
        
        if (approvedError) {
          console.error('Error fetching approved bills:', approvedError);
          return;
        }
        
        // Get rejected bills (isDefeated = true)
        const { count: rejectedCount, error: rejectedError } = await supabase
          .from('all_bills_uk')
          .select('*', { count: 'exact', head: true })
          .eq('isDefeated', true);
        
        if (rejectedError) {
          console.error('Error fetching rejected bills:', rejectedError);
          return;
        }
        
        // Calculate in process bills
        const inProcessCount = totalCount - (approvedCount + rejectedCount);
        
        setStats({
          totalBills: totalCount || 0,
          approved: approvedCount || 0,
          rejected: rejectedCount || 0,
          inProcess: inProcessCount || 0
        });
      } catch (error) {
        console.error('Error fetching bill stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBillStats();
  }, []);

  // Calculate percentages
  const approvalRate = stats ? Math.round((stats.approved / stats.totalBills) * 100) : 0;
  const rejectionRate = stats ? Math.round((stats.rejected / stats.totalBills) * 100) : 0;
  
  const summaryStats = [
    {
      title: "Total Bills",
      value: loading ? "Loading..." : stats?.totalBills.toString() || "0",
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
      value: loading ? "Loading..." : `${rejectionRate}%`,
      change: "-3% from last period",
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      title: "Approval Rate",
      value: loading ? "Loading..." : `${approvalRate}%`,
      change: "+5% from last period",
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryStats.map((stat, index) => (
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
